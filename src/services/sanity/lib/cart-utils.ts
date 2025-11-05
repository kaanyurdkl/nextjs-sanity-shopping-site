import { cookies } from "next/headers";
import { getUserIdByGoogleId } from "./utils";
import { sanityFetch, sanityFetchNoCache } from "./fetch";
import { writeClient } from "./client";
import {
  CART_WITH_DETAILS_QUERY,
  GUEST_CART_QUERY,
  USER_CART_QUERY,
} from "./queries";
import type {
  Cart,
  CartItem,
  GUEST_CART_QUERYResult,
  USER_CART_QUERYResult,
} from "@/services/sanity/types/sanity.types";
import type { CART_WITH_DETAILS_QUERYResult } from "@/services/sanity/types/sanity.types";
import type { Session } from "next-auth";
import { auth } from "@/services/next-auth/lib";

/**
 * Cart Utility Functions
 * Server-side utilities for managing shopping carts in Sanity
 */

/**
 * Get cart identifier for current user
 * Returns either userId (logged-in) or sessionId (guest)
 */
export async function getCartIdentifier(
  session: Session | null,
): Promise<
  { type: "user"; userId: string } | { type: "guest"; sessionId: string } | null
> {
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
  const session = await auth();

  const identifier = await getCartIdentifier(session);

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
  const session = await auth();

  const identifier = await getCartIdentifier(session);

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
export async function createGuestCart(): Promise<
  Cart & { _id: string; items?: Array<CartItem & { _key: string }> }
> {
  const sessionId = crypto.randomUUID();

  const cookieStore = await cookies();

  // Set cookie (30 days)
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
export async function createUserCart(
  userId: string,
): Promise<Cart & { _id: string; items?: Array<CartItem & { _key: string }> }> {
  return await writeClient.create({
    _type: "cart",
    user: { _type: "reference", _ref: userId },
    items: [],
    status: "active",
  });
}

export async function getUserCart(
  userId: string,
): Promise<USER_CART_QUERYResult> {
  return await sanityFetch<USER_CART_QUERYResult>({
    query: USER_CART_QUERY,
    params: { userId },
    tags: ["cart"],
  });
}

export async function getGuestCart(
  sessionId: string,
): Promise<GUEST_CART_QUERYResult> {
  return await sanityFetch<GUEST_CART_QUERYResult>({
    query: GUEST_CART_QUERY,
    params: { sessionId },
    tags: ["cart"],
  });
}
