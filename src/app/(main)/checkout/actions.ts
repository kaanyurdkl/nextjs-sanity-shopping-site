"use server";

import { cookies } from "next/headers";
import { signOut, auth } from "@/services/next-auth/lib";
import { writeClient } from "@/services/sanity/lib/client";
import { getUserIdByGoogleId } from "@/services/sanity/utils/user-utils";
import { revalidateTag } from "next/cache";

/**
 * Sign out action for checkout page
 * Redirects back to checkout after signing out
 */
export async function signOutAction() {
  await signOut({ redirectTo: "/checkout" });
}

/**
 * Submit contact information to cart
 * Updates cart.checkout.contactInfo.email and advances to shipping step
 */
export async function submitContactInfoAction(email: string) {
  const session = await auth();
  let cartId: string | null = null;

  if (session?.user?.googleId) {
    // Logged-in user
    const userId = await getUserIdByGoogleId(session.user.googleId);
    if (!userId) {
      throw new Error("User not found");
    }

    const cart = await writeClient.fetch(
      `*[_type == "cart" && user._ref == $userId][0]{ _id }`,
      { userId },
    );

    cartId = cart?._id;
  } else {
    // Guest user
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart_session")?.value;

    if (!sessionId) {
      throw new Error("No cart session found");
    }

    const cart = await writeClient.fetch(
      `*[_type == "cart" && sessionId == $sessionId][0]{ _id }`,
      { sessionId },
    );

    cartId = cart?._id;
  }

  if (!cartId) {
    throw new Error("Cart not found");
  }

  // Update the cart with contact info and mark step as completed
  await writeClient
    .patch(cartId)
    .set({
      "checkout.contact.email": email,
      "checkout.contact.status": "completed",
      "checkout.shipping.status": "current",
    })
    .commit();

  revalidateTag("cart");
}
