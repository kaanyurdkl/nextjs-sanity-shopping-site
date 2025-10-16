"use client";

import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import useStore from "@/hooks/useStore";

export default function CartDetails() {
  const cartItems = useStore(useCartStore, (state) => state.cartItems);
  const cartItemsCount = useStore(useCartStore, (state) =>
    state.getCartItemsCount()
  );

  return (
    <div>
      <h1 className="text-4xl font-extrabold uppercase mb-8">
        Shopping Cart{" "}
        <span className="text-xl font-normal">
          [{cartItemsCount ?? 0} items]
        </span>
      </h1>
      <div>
        <div className="grid grid-flow-row auto-rows-fr gap-y-4">
          {cartItems?.map((cartItem) => (
            <div
              key={`${cartItem.productId}-${cartItem.variantSku}`}
              className="border p-4 flex gap-4"
            >
              <div className="relative w-24 h-32 flex-shrink-0">
                <Image
                  src={cartItem.imageUrl}
                  alt={cartItem.productName}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold uppercase">
                  {cartItem.productName}
                </h3>
                <p>
                  <span className="font-semibold">Unit Price:</span> $
                  {cartItem.price}
                </p>
                <p>
                  <span className="font-semibold">Color:</span> {cartItem.color}
                </p>
                <p>
                  <span className="font-semibold">Size:</span> {cartItem.size}
                </p>
                <p className="font-bold mt-auto">
                  Total: ${cartItem.quantity * cartItem.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
