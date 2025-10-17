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
      <h1 className="text-3xl font-bold uppercase mb-6">
        Shopping Cart{" "}
        <span className="text-base font-normal">
          [{cartItemsCount ?? 0} Items]
        </span>
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2" aria-label="Cart items">
          <ul className="space-y-4 list-none">
            {cartItems?.map((cartItem) => (
              <li
                key={`${cartItem.productId}-${cartItem.variantSku}`}
                className="border p-4 flex gap-6"
                aria-label={`${cartItem.productName}, ${cartItem.color}, ${cartItem.size}`}
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
                  <dl className="space-y-1 text-sm">
                    <div>
                      <dt className="inline font-semibold">Unit Price:</dt>
                      <dd className="inline ml-1">${cartItem.price}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Color:</dt>
                      <dd className="inline ml-1">{cartItem.color}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Size:</dt>
                      <dd className="inline ml-1">{cartItem.size}</dd>
                    </div>
                  </dl>
                  <p className="font-bold text-base mt-auto">
                    Total: ${cartItem.quantity * cartItem.price}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between gap-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Save for later"
                    >
                      <Bookmark className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeCartItem(cartItem.variantSku)}
                      aria-label={`Remove ${cartItem.productName} from cart`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>

                  <div
                    className="flex items-center p-1 border border-black"
                    role="group"
                    aria-label="Quantity controls"
                  >
                    <Button
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        decrementCartItemQuantity(cartItem.variantSku)
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <span
                      className="px-4 text-sm font-semibold"
                      aria-live="polite"
                      aria-label={`Quantity: ${cartItem.quantity}`}
                    >
                      {cartItem.quantity}
                    </span>
                    <Button
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        incrementCartItemQuantity(cartItem.variantSku)
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <aside
          className="space-y-6 border p-4"
          aria-labelledby="order-summary-heading"
        >
          <h2
            id="order-summary-heading"
            className="font-bold text-xl uppercase mb-4"
          >
            Order Summary
          </h2>
          <dl className="space-y-2 mb-4">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="font-semibold">
                $
                {cartItems
                  ?.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2) ?? "0.00"}
              </dd>
            </div>
            {/* <div className="flex justify-between text-red-600">
              <dt>Product Sales</dt>
              <dd className="font-semibold">-$40.00</dd>
            </div> */}
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>TBD</dd>
            </div>
            <div className="flex justify-between">
              <dt>Tax</dt>
              <dd>TBD</dd>
            </div>
          </dl>
          <div className="border-t pt-3 mb-4">
            <dl className="flex justify-between font-bold">
              <dt>ESTIMATED TOTAL</dt>
              <dd>
                $
                {cartItems
                  ?.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2) ?? "0.00"}
              </dd>
            </dl>
          </div>
          <Button className="w-full" size="lg" aria-label="Proceed to checkout">
            PROCEED TO CHECKOUT
          </Button>
          <div className="flex justify-center gap-2 mt-4">
            <div className="text-xs text-gray-500">
              Payment methods accepted
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
