import { NextResponse } from "next/server";
import { stripe } from "@/services/stripe/server";
import { getCartWithDetails } from "@/services/sanity/utils/cart-utils";

export async function POST() {
  try {
    const cart = await getCartWithDetails();

    if (!cart || !cart.items) {
      return NextResponse.json({ error: "Cart not found" }, { status: 400 });
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
      payment_method_types: ["card"],
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
