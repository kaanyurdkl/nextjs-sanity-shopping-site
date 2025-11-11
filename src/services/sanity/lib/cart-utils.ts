import { cookies } from "next/headers";

import { auth } from "@/services/next-auth/lib";
import { writeClient } from "@/services/sanity/lib/client";
import { sanityFetch, sanityFetchNoCache } from "@/services/sanity/lib/fetch";
import {
  GUEST_CART_ITEMS_WITH_QUANTITY_QUERY,
  GUEST_CART_QUERY,
  GUEST_CART_WITH_DETAILS_QUERY,
  USER_CART_ITEMS_WITH_QUANTITY_QUERY,
  USER_CART_QUERY,
  USER_CART_WITH_DETAILS_QUERY,
} from "@/services/sanity/lib/queries";
import { getUserIdByGoogleId } from "@/services/sanity/lib/utils";
import type {
  Cart,
  GUEST_CART_ITEMS_WITH_QUANTITY_QUERYResult,
  GUEST_CART_QUERYResult,
  GUEST_CART_WITH_DETAILS_QUERYResult,
  USER_CART_ITEMS_WITH_QUANTITY_QUERYResult,
  USER_CART_QUERYResult,
  USER_CART_WITH_DETAILS_QUERYResult,
} from "@/services/sanity/types/sanity.types";

export async function createUserCart(userId: string): Promise<Cart> {
  const cart: Cart = await writeClient.create({
    _type: "cart",
    user: { _type: "reference", _ref: userId },
    items: [],
    status: "active",
  });

  return cart;
}

export async function createGuestCart(): Promise<Cart> {
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

  const cart: Cart = await writeClient.create({
    _type: "cart",
    sessionId,
    items: [],
    status: "active",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  return cart;
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

export async function getCartWithDetails(): Promise<
  USER_CART_WITH_DETAILS_QUERYResult | GUEST_CART_WITH_DETAILS_QUERYResult
> {
  let cart;

  const session = await auth();

  if (session?.user?.googleId) {
    const userId = await getUserIdByGoogleId(session.user.googleId);

    if (userId) {
      cart = await getUserCartWithDetails(userId);
    } else {
      throw new Error("User not found");
    }
  } else {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart_session")?.value;

    if (sessionId) {
      cart = await getGuestCartWithDetails(sessionId);
    }
  }

  if (!cart) {
    return null;
  } else {
    return cart;
  }
}

export async function getUserCartWithDetails(
  userId: string,
): Promise<USER_CART_WITH_DETAILS_QUERYResult> {
  return await sanityFetchNoCache<USER_CART_WITH_DETAILS_QUERYResult>({
    query: USER_CART_WITH_DETAILS_QUERY,
    params: { userId },
  });
}

export async function getGuestCartWithDetails(
  sessionId: string,
): Promise<GUEST_CART_WITH_DETAILS_QUERYResult> {
  return await sanityFetchNoCache<GUEST_CART_WITH_DETAILS_QUERYResult>({
    query: GUEST_CART_WITH_DETAILS_QUERY,
    params: { sessionId },
  });
}

export async function getCartItemCount(): Promise<number> {
  let cart;

  const session = await auth();

  if (session?.user?.googleId) {
    const userId = await getUserIdByGoogleId(session.user.googleId);

    if (userId) {
      cart = await getUserCartItemsWithQuantity(userId);
    } else {
      throw new Error("User not found");
    }
  } else {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart_session")?.value;

    if (sessionId) {
      cart = await getGuestCartItemsWithQuantity(sessionId);
    }
  }

  if (!cart?.items) {
    return 0;
  }

  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function getUserCartItemsWithQuantity(
  userId: string,
): Promise<USER_CART_ITEMS_WITH_QUANTITY_QUERYResult> {
  return await sanityFetchNoCache({
    query: USER_CART_ITEMS_WITH_QUANTITY_QUERY,
    params: { userId },
  });
}

export async function getGuestCartItemsWithQuantity(
  sessionId: string,
): Promise<GUEST_CART_ITEMS_WITH_QUANTITY_QUERYResult> {
  return await sanityFetchNoCache({
    query: GUEST_CART_ITEMS_WITH_QUANTITY_QUERY,
    params: { sessionId },
  });
}
