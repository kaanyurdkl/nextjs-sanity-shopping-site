"use client";

import Image from "next/image";
import { Plus, Minus, Bookmark, Trash2 } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/services/sanity/lib/image";
import {
  incrementCartItemAction,
  decrementCartItemAction,
  removeCartItemAction,
} from "@/services/sanity/actions/cart-actions";
import type {
  GUEST_CART_WITH_DETAILS_QUERYResult,
  USER_CART_WITH_DETAILS_QUERYResult,
} from "@/services/sanity/types/sanity.types";
import Link from "next/link";

interface CartDetailsProps {
  cart:
    | NonNullable<USER_CART_WITH_DETAILS_QUERYResult>
    | NonNullable<GUEST_CART_WITH_DETAILS_QUERYResult>;
}

type OptimisticAction =
  | { type: "increment"; variantSku: string }
  | { type: "decrement"; variantSku: string }
  | { type: "remove"; variantSku: string };

export default function CartDetails({ cart }: CartDetailsProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    cart,
    (currentCart, action: OptimisticAction) => {
      if (!currentCart?.items) return currentCart;

      const newItems = [...currentCart.items];

      switch (action.type) {
        case "increment": {
          const index = newItems.findIndex(
            (item) => item.variantSku === action.variantSku,
          );
          if (index !== -1) {
            newItems[index] = {
              ...newItems[index],
              quantity: (newItems[index].quantity || 0) + 1,
            };
          }
          break;
        }
        case "decrement": {
          const index = newItems.findIndex(
            (item) => item.variantSku === action.variantSku,
          );
          if (index !== -1) {
            newItems[index] = {
              ...newItems[index],
              quantity: Math.max((newItems[index].quantity || 1) - 1, 1),
            };
          }
          break;
        }
        case "remove": {
          const filteredItems = newItems.filter(
            (item) => item.variantSku !== action.variantSku,
          );
          return { ...currentCart, items: filteredItems };
        }
      }

      return { ...currentCart, items: newItems };
    },
  );

  const cartItems = optimisticCart?.items || [];
  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

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
            {cartItems?.map((cartItem) => {
              const product = cartItem.product;
              const variant = product?.variant;
              const imageUrl = product?.thumbnail?.asset?.url
                ? urlFor(product.thumbnail.asset.url)
                    .width(200)
                    .height(250)
                    .format("webp")
                    .quality(85)
                    .url()
                : "";

              return (
                <li
                  key={`${product?._id}-${cartItem.variantSku}`}
                  className="border p-4 flex gap-6"
                  aria-label={`${product?.name}, ${variant?.color?.name}, ${variant?.size?.name}`}
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-28 flex-shrink-0 bg-gray-200">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={product?.name || "Product"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold uppercase text-lg mb-2">
                      {product?.name}
                    </h3>
                    <dl className="space-y-1 text-sm">
                      <div>
                        <dt className="inline font-semibold">Unit Price:</dt>
                        <dd className="inline ml-1">${product?.basePrice}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold">Color:</dt>
                        <dd className="inline ml-1">{variant?.color?.name}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold">Size:</dt>
                        <dd className="inline ml-1">{variant?.size?.name}</dd>
                      </div>
                    </dl>
                    <p className="font-bold text-base mt-auto">
                      Total: $
                      {(
                        (product?.basePrice || 0) * (cartItem.quantity || 0)
                      ).toFixed(2)}
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
                        disabled={isPending}
                        onClick={() => {
                          startTransition(async () => {
                            updateOptimisticCart({
                              type: "remove",
                              variantSku: cartItem.variantSku,
                            });
                            await removeCartItemAction(cartItem.variantSku);
                          });
                        }}
                        aria-label={`Remove ${product?.name} from cart`}
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
                        disabled={isPending}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          startTransition(async () => {
                            updateOptimisticCart({
                              type: "decrement",
                              variantSku: cartItem.variantSku,
                            });
                            await decrementCartItemAction(cartItem.variantSku);
                          });
                        }}
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
                        disabled={isPending}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          startTransition(async () => {
                            updateOptimisticCart({
                              type: "increment",
                              variantSku: cartItem.variantSku,
                            });

                            await incrementCartItemAction(cart._id, cartItem);
                          });
                        }}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
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
                    (total, item) =>
                      total +
                      (item.product?.basePrice || 0) * (item.quantity || 0),
                    0,
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
                    (total, item) =>
                      total +
                      (item.product?.basePrice || 0) * (item.quantity || 0),
                    0,
                  )
                  .toFixed(2) ?? "0.00"}
              </dd>
            </dl>
          </div>
          <Button className="w-full" size="lg" aria-label="Proceed to checkout">
            <Link href="/checkout">PROCEED TO CHECKOUT</Link>
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
