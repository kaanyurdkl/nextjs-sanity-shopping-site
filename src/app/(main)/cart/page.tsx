import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CartDetails from "@/components/ui/CartDetails";
import { getCartWithDetails } from "@/services/sanity/lib/cart-utils";

export const metadata: Metadata = {
  title: "Shopping Cart | Your Store",
  description:
    "Review your shopping cart items and proceed to checkout. Manage quantities, remove items, and view your order summary.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CartPage() {
  const cart = await getCartWithDetails();

  return (
    <main>
      <Breadcrumbs slug={["cart"]} />
      {cart ? <CartDetails cart={cart} /> : <p>Your cart is empty</p>}
    </main>
  );
}
