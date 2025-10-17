import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CartDetails from "@/components/ui/CartDetails";

export const metadata: Metadata = {
  title: "Shopping Cart | Your Store",
  description:
    "Review your shopping cart items and proceed to checkout. Manage quantities, remove items, and view your order summary.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <main>
      <Breadcrumbs slug={["cart"]} />
      <CartDetails />
    </main>
  );
}
