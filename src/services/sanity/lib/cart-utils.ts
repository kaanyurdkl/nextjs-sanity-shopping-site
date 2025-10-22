import { cookies } from "next/headers";
import { auth } from "@/services/next-auth/lib";
import { getUserIdByGoogleId } from "./utils";
import { sanityFetch } from "./fetch";

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
    // Logged-in user - query by user ID
    cart = await sanityFetch<{ items: Array<{ quantity: number }> } | null>({
      query: `*[_type == "cart" && user._ref == $userId && status == "active"][0] {
        items[] {
          quantity
        }
      }`,
      params: { userId: identifier.userId },
      tags: ["cart"],
    });
  } else {
    // Guest user - query by session ID
    cart = await sanityFetch<{ items: Array<{ quantity: number }> } | null>({
      query: `*[_type == "cart" && sessionId == $sessionId && status == "active"][0] {
        items[] {
          quantity
        }
      }`,
      params: { sessionId: identifier.sessionId },
      tags: ["cart"],
    });
  }

  // If no cart found, return 0
  if (!cart?.items) {
    return 0;
  }

  // Sum up all the quantities
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
