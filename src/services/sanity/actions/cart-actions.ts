"use server";

import { revalidatePath } from "next/cache";
import { addItemToCart, getCart } from "../lib/cart-utils";
import { writeClient } from "../lib/client";

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

    // Revalidate paths for immediate UI updates
    revalidatePath("/"); // Revalidate home page
    revalidatePath("/", "layout"); // Revalidate layout

    return { success: true };
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add item to cart",
    };
  }
}

/**
 * Server Action: Increment cart item quantity
 * Increases quantity by 1 and revalidates cart page
 */
export async function incrementCartItemAction(variantSku: string) {
  try {
    console.log("incrementCartItemAction");
    const cart = await getCart();

    if (!cart?.items) {
      return { success: false, error: "Cart not found" };
    }

    const item = cart.items.find((item) => item.variantSku === variantSku);

    if (!item?._key) {
      return { success: false, error: "Item not found in cart" };
    }

    const newQuantity = (item.quantity || 0) + 1;

    await writeClient
      .patch(cart._id)
      .set({ [`items[_key == "${item._key}"].quantity`]: newQuantity })
      .commit();

    // Revalidate paths for immediate UI updates
    revalidatePath("/cart");
    revalidatePath("/"); // Revalidate home page
    revalidatePath("/", "layout"); // Revalidate layout

    return { success: true };
  } catch (error) {
    console.error("Failed to increment item quantity:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update quantity",
    };
  }
}

/**
 * Server Action: Decrement cart item quantity
 * Decreases quantity by 1 (minimum 1) and revalidates cart page
 */
export async function decrementCartItemAction(variantSku: string) {
  try {
    const cart = await getCart();

    if (!cart?.items) {
      return { success: false, error: "Cart not found" };
    }

    const item = cart.items.find((item) => item.variantSku === variantSku);

    if (!item?._key) {
      return { success: false, error: "Item not found in cart" };
    }

    const newQuantity = Math.max((item.quantity || 1) - 1, 1);

    await writeClient
      .patch(cart._id)
      .set({ [`items[_key == "${item._key}"].quantity`]: newQuantity })
      .commit();

    // Revalidate paths for immediate UI updates
    revalidatePath("/cart");
    revalidatePath("/"); // Revalidate home page
    revalidatePath("/", "layout"); // Revalidate layout

    return { success: true };
  } catch (error) {
    console.error("Failed to decrement item quantity:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update quantity",
    };
  }
}

/**
 * Server Action: Remove item from cart
 * Removes item completely and revalidates cart page
 */
export async function removeCartItemAction(variantSku: string) {
  try {
    const cart = await getCart();

    if (!cart?.items) {
      return { success: false, error: "Cart not found" };
    }

    const item = cart.items.find((item) => item.variantSku === variantSku);

    if (!item?._key) {
      return { success: false, error: "Item not found in cart" };
    }

    await writeClient
      .patch(cart._id)
      .unset([`items[_key == "${item._key}"]`])
      .commit();

    // Revalidate paths for immediate UI updates
    revalidatePath("/cart");
    revalidatePath("/"); // Revalidate home page
    revalidatePath("/", "layout"); // Revalidate layout

    return { success: true };
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove item",
    };
  }
}
