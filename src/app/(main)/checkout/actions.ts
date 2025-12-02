"use server";

import { cookies } from "next/headers";
import { signOut, auth } from "@/services/next-auth/lib";
import { writeClient } from "@/services/sanity/lib/client";
import { getUserIdByGoogleId } from "@/services/sanity/utils/user-utils";
import { revalidateTag } from "next/cache";
import { getGuestCart, getUserCart } from "@/services/sanity/utils/cart-utils";

/**
 * Sign out action for checkout page
 * Redirects back to checkout after signing out
 */
export async function signOutAction() {
  await signOut({ redirectTo: "/checkout" });
}

/**
 * Submit contact information to cart
 * Updates cart.checkout.contact.email and advances to shipping step
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

  // Update the cart with contact info and advance to shipping step
  await writeClient
    .patch(cartId)
    .set({
      "checkout.contact.email": email,
      "checkout.currentStep": "shipping",
    })
    .commit();

  revalidateTag("cart");
}

/**
 * Edit contact step - returns to contact step and clears subsequent step data
 */
export async function editContactStepAction() {
  let cart;

  const session = await auth();

  if (session?.user?.googleId) {
    const userId = await getUserIdByGoogleId(session.user.googleId);

    if (userId) {
      cart = await getUserCart(userId);
    } else {
      throw new Error("User not found");
    }
  } else {
    const cookieStore = await cookies();

    const sessionId = cookieStore.get("cart_session")?.value;

    if (sessionId) {
      cart = await getGuestCart(sessionId);
    }
  }

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Reset to contact step and clear shipping/payment data
  await writeClient
    .patch(cart._id)
    .set({
      "checkout.currentStep": "contact",
    })
    .unset([
      "checkout.shipping.shippingAddress",
      "checkout.shipping.billingAddress",
      "checkout.shipping.shippingMethod",
    ])
    .commit();

  revalidateTag("cart");
}

/**
 * Submit shipping information to cart
 * Updates cart.checkout.shipping and advances to payment step
 */
export async function submitShippingInfoAction(
  shippingAddress: any,
  billingAddress: any,
  useSameAddressForBilling: boolean,
  shippingMethod: "standard" | "express"
) {
  let cart;
  const session = await auth();

  if (session?.user?.googleId) {
    const userId = await getUserIdByGoogleId(session.user.googleId);
    if (userId) {
      cart = await getUserCart(userId);
    } else {
      throw new Error("User not found");
    }
  } else {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart_session")?.value;
    if (sessionId) {
      cart = await getGuestCart(sessionId);
    }
  }

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Update the cart with shipping info and advance to payment step
  await writeClient
    .patch(cart._id)
    .set({
      "checkout.shipping.shippingAddress": shippingAddress,
      "checkout.shipping.billingAddress": billingAddress,
      "checkout.shipping.useSameAddressForBilling": useSameAddressForBilling,
      "checkout.shipping.shippingMethod": shippingMethod,
      "checkout.currentStep": "payment",
    })
    .commit();

  revalidateTag("cart");
}

/**
 * Create Stripe PaymentIntent
 * Returns client secret for payment form
 */
export async function createPaymentIntentAction(): Promise<{
  client_secret: string | null;
}> {
  const { stripe } = await import("@/services/stripe/server");
  const { getCartWithDetails } = await import(
    "@/services/sanity/utils/cart-utils"
  );

  const cart = await getCartWithDetails();

  if (!cart || !cart.items) {
    throw new Error("Cart not found");
  }

  // Calculate total amount
  const subtotal = cart.items.reduce((total, item) => {
    return total + (item.product?.basePrice || 0) * item.quantity;
  }, 0);

  const shippingCost =
    cart.checkout?.shipping?.shippingMethod === "express" ? 19.99 : 9.99;
  const total = subtotal + shippingCost;

  // Create PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100), // Convert to cents
    currency: "cad",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return { client_secret: paymentIntent.client_secret };
}
