import { cookies } from "next/headers";
import { auth } from "@/services/next-auth/lib";
import { getUserIdByGoogleId } from "./utils";
import { sanityFetchNoCache } from "./fetch";
import { writeClient } from "./client";
import { CART_WITH_DETAILS_QUERY } from "./queries";
import type { Cart, CartItem } from "@/services/sanity/types/sanity.types";
import type { CART_WITH_DETAILS_QUERYResult } from "@/services/sanity/types/sanity.types";

/**
 * Cart Utility Functions
 * Server-side utilities for managing shopping carts in Sanity
 */

/**
 * Get cart identifier for current user
 * Returns either userId (logged-in) or sessionId (guest)
 */
async function getCartIdentifier(): Promise<
  { type: "user"; userId: string } | { type: "guest"; sessionId: string } | null
> {
  // Check if user is logged in
  const session = await auth();
  if (session?.user?.googleId) {
    const userId = await getUserIdByGoogleId(session.user.googleId);
    if (userId) {
      return { type: "user", userId };
    }
  }

  // Guest user - check for session cookie
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value;

  if (sessionId) {
    return { type: "guest", sessionId };
  }

  // No logged-in user and no guest session
  return null;
}

/**
 * Get cart with full product details
 * Used for cart page to display all cart items with product info
 * @returns Cart with joined product, variant, color, and size data
 */
export async function getCart(): Promise<CART_WITH_DETAILS_QUERYResult> {
  const identifier = await getCartIdentifier();

  // Build params - always pass both, set to null when not used
  const params: { userId: string | null; sessionId: string | null } = {
    userId: null,
    sessionId: null,
  };

  if (identifier?.type === "user") {
    params.userId = identifier.userId;
  } else if (identifier?.type === "guest") {
    params.sessionId = identifier.sessionId;
  }

  // Fetch cart with full product details (no cache for immediate consistency)
  const cart = await sanityFetchNoCache<CART_WITH_DETAILS_QUERYResult>({
    query: CART_WITH_DETAILS_QUERY,
    params,
  });

  return cart;
}

/**
 * Get total number of items in cart
 * Used for cart badge in header
 * @returns Total item count
 */
export async function getCartItemCount(): Promise<number> {
  const identifier = await getCartIdentifier();

  // If no identifier, no cart exists
  if (!identifier) {
    return 0;
  }

  // Query Sanity for the cart
  let cart;

  if (identifier.type === "user") {
    // Logged-in user - query by user ID (no cache for immediate consistency)
    cart = await sanityFetchNoCache<{
      items: Array<{ quantity: number }>;
    } | null>({
      query: `*[_type == "cart" && user._ref == $userId && status == "active"][0] {
        items[] {
          quantity
        }
      }`,
      params: { userId: identifier.userId },
    });
  } else {
    // Guest user - query by session ID (no cache for immediate consistency)
    cart = await sanityFetchNoCache<{
      items: Array<{ quantity: number }>;
    } | null>({
      query: `*[_type == "cart" && sessionId == $sessionId && status == "active"][0] {
        items[] {
          quantity
        }
      }`,
      params: { sessionId: identifier.sessionId },
    });
  }

  // If no cart found, return 0
  if (!cart?.items) {
    return 0;
  }

  // Sum up all the quantities
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Create a new cart for guest user
 * Generates UUID and sets cookie
 */
async function createGuestCart(): Promise<
  Cart & { _id: string; items?: Array<CartItem & { _key: string }> }
> {
  const sessionId = crypto.randomUUID();

  // Set cookie (30 days)
  const cookieStore = await cookies();
  cookieStore.set("cart_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return (await writeClient.create({
    _type: "cart",
    sessionId,
    items: [],
    status: "active",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })) as Cart & { _id: string; items?: Array<CartItem & { _key: string }> };
}

/**
 * Create a new cart for logged-in user
 * @param userId - Sanity user document ID
 */
async function createUserCart(
  userId: string,
): Promise<Cart & { _id: string; items?: Array<CartItem & { _key: string }> }> {
  return await writeClient.create({
    _type: "cart",
    user: { _type: "reference", _ref: userId },
    items: [],
    status: "active",
  });
}

/**
 * Get existing cart or create new one
 * Returns existing cart if found, otherwise creates a new one
 */
async function getOrCreateCart(): Promise<
  Cart & { _id: string; items?: Array<CartItem & { _key: string }> }
> {
  const identifier = await getCartIdentifier();

  // Try to get existing cart
  if (identifier) {
    let existingCart;

    if (identifier.type === "user") {
      existingCart = await sanityFetch<Cart>({
        query: `*[_type == "cart" && user._ref == $userId && status == "active"][0]`,
        params: { userId: identifier.userId },
        tags: ["cart"],
      });
    } else {
      existingCart = await sanityFetch<Cart>({
        query: `*[_type == "cart" && sessionId == $sessionId && status == "active"][0]`,
        params: { sessionId: identifier.sessionId },
        tags: ["cart"],
      });
    }

    if (existingCart) {
      return existingCart as Cart & {
        _id: string;
        items?: Array<CartItem & { _key: string }>;
      };
    }
  }

  // No cart exists - create new one
  const session = await auth();

  if (session?.user?.googleId) {
    // Logged-in user
    const userId = await getUserIdByGoogleId(session.user.googleId);
    if (userId) {
      return await createUserCart(userId);
    }
  }

  // Guest user
  return await createGuestCart();
}

/**
 * Add item to cart or increment quantity if already exists
 * @param params - Product details to add
 */
export async function addItemToCart(params: {
  productId: string;
  variantSku: string;
  quantity: number;
  priceSnapshot: number;
}) {
  const { productId, variantSku, quantity, priceSnapshot } = params;

  // Get or create cart
  const cart = await getOrCreateCart();

  // Check if item already in cart
  const existingItemIndex = cart.items?.findIndex(
    (item) => item.variantSku === variantSku,
  );

  if (existingItemIndex !== undefined && existingItemIndex >= 0) {
    // Item exists - increment quantity
    const existingItem = cart.items![existingItemIndex];
    const newQuantity = (existingItem.quantity || 0) + quantity;

    await writeClient
      .patch(cart._id)
      .set({
        [`items[_key == "${existingItem._key}"].quantity`]: newQuantity,
      })
      .commit();
  } else {
    // New item - append to array
    await writeClient
      .patch(cart._id)
      .setIfMissing({ items: [] })
      .append("items", [
        {
          _type: "cartItem",
          _key: `item-${Date.now()}`,
          product: { _type: "reference", _ref: productId },
          variantSku,
          quantity,
          priceSnapshot,
        },
      ])
      .commit();
  }
}
