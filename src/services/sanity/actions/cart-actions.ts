"use server";

import { revalidatePath } from "next/cache";
import { addItemToCart } from "../lib/cart-utils";

/**
 * Server Action: Add item to cart
 * Updates cart in Sanity and revalidates header to show updated count
 */
export async function addToCartAction(params: {
  productId: string;
  variantSku: string;
  quantity: number;
  priceSnapshot: number;
}) {
  try {
    await addItemToCart(params);

    // Revalidate the layout to update cart count in header
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add item to cart",
    };
  }
}
