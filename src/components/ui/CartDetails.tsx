"use client";

import { useCartStore } from "@/stores/cart-store";
import useStore from "@/hooks/useStore";

export default function CartDetails() {
  console.log("CartDetails");
  const cartItems = useStore(useCartStore, (state) => state.cartItems);
  const cartItemsCount = useStore(useCartStore, (state) =>
    state.getCartItemsCount()
  );

  return (
    <div>
      <h1 className="text-4xl font-extrabold uppercase">
        Shopping Cart{" "}
        <span className="text-xl font-normal">{cartItemsCount ?? 0} items</span>
      </h1>
    </div>
  );
}
