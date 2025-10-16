"use client";

import Image from "next/image";
import { Plus, Minus, Bookmark, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import useStore from "@/hooks/useStore";
import { Button } from "@/components/ui/button";

export default function CartDetails() {
  const cartItems = useStore(useCartStore, (state) => state.cartItems);
  const cartItemsCount = useStore(useCartStore, (state) =>
    state.getCartItemsCount()
  );
  const incrementCartItemQuantity = useCartStore(
    (state) => state.incrementCartItemQuantity
  );
  const decrementCartItemQuantity = useCartStore(
    (state) => state.decrementCartItemQuantity
  );
  const removeCartItem = useCartStore((state) => state.removeCartItem);

  return (
    <div>
      {/* Cart Items Section */}
      <h1 className="text-3xl font-bold uppercase mb-6">
        Shopping Cart{" "}
        <span className="text-base font-normal">
          [{cartItemsCount ?? 0} Items]
        </span>
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4 ">
          {cartItems?.map((cartItem) => (
            <div
              key={`${cartItem.productId}-${cartItem.variantSku}`}
              className="border p-4 flex gap-6"
            >
              {/* Product Image */}
              <div className="relative w-20 h-28 flex-shrink-0 bg-gray-200">
                <Image
                  src={cartItem.imageUrl}
                  alt={cartItem.productName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-bold uppercase text-lg mb-2">
                  {cartItem.productName}
                </h3>
                {/* <p className="text-xs text-gray-600 uppercase mb-2">
                  Placeholder for promotion tag
                  SUMMER CLEARANCE
                </p> */}
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Unit Price:</span> $
                    {cartItem.price}
                  </p>
                  <p>
                    <span className="font-semibold">Color:</span>{" "}
                    {cartItem.color}
                  </p>
                  <p>
                    <span className="font-semibold">Size:</span> {cartItem.size}
                  </p>
                </div>
                <p className="font-bold text-base mt-auto">
                  Total: ${cartItem.quantity * cartItem.price}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end justify-between gap-3">
                {/* Bookmark and Delete Icons */}
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeCartItem(cartItem.variantSku)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center p-1 border border-black">
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      decrementCartItemQuantity(cartItem.variantSku)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 text-sm font-semibold">
                    {cartItem.quantity}
                  </span>
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      incrementCartItemQuantity(cartItem.variantSku)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Order Summary Section */}
        <div className="space-y-6">
          {/* Promo Code */}
          {/* <div className="border p-6">
          <h2 className="font-bold uppercase mb-4">Promo Code</h2>
          <input
            type="text"
            placeholder="ENTER YOUR PROMO CODE HERE"
            className="w-full border p-2 mb-3 text-sm"
          />
          <Button className="w-full" variant="default">
            APPLY
          </Button>
        </div> */}

          {/* Order Summary */}
          <div className="border p-4">
            <h2 className="font-bold text-xl uppercase mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">
                  $
                  {cartItems
                    ?.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Product Sales</span>
                <span className="font-semibold">-$40.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>TBD</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>TBD</span>
              </div>
            </div>
            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between font-bold">
                <span>ESTIMATED TOTAL</span>
                <span>
                  $
                  {cartItems
                    ?.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </span>
              </div>
            </div>
            <Button className="w-full" size="lg">
              PROCEED TO CHECKOUT
            </Button>
            <div className="flex justify-center gap-2 mt-4">
              {/* Placeholder for payment icons */}
              <div className="text-xs text-gray-500">
                Payment methods accepted
              </div>
            </div>
          </div>

          {/* Free Shipping Progress */}
          {/* <div className="border p-4 text-sm">
          <p className="flex items-center gap-2">
            <span>📦</span>
            <span>Add $32.00 more for free shipping</span>
          </p>
        </div> */}
        </div>
      </div>
    </div>
  );
}
