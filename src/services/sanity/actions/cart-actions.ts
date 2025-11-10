"use server";

import { revalidatePath } from "next/cache";
import {
  createGuestCart,
  createUserCart,
  getCartWithDetails,
  getGuestCart,
  getUserCart,
} from "../lib/cart-utils";
import { writeClient } from "../lib/client";
import { cookies } from "next/headers";
import { auth } from "@/services/next-auth/lib";
import { getUserIdByGoogleId } from "../lib/utils";

export async function addToCartAction({
  productId,
  variantSku,
  quantity,
  priceSnapshot,
}: {
  productId: string;
  variantSku: string;
  quantity: number;
  priceSnapshot: number;
}) {
  try {
    let cart;

    const session = await auth();

    if (session?.user?.googleId) {
      const userId = await getUserIdByGoogleId(session.user.googleId);

      if (userId) {
        const existingCart = await getUserCart(userId);

        if (existingCart) {
          cart = existingCart;
        } else {
          cart = await createUserCart(userId);
        }
      } else {
        throw new Error("User not found");
      }
    } else {
      const cookieStore = await cookies();

      const sessionId = cookieStore.get("cart_session")?.value;

      if (sessionId) {
        const existingCart = await getGuestCart(sessionId);

        if (existingCart) {
          cart = existingCart;
        } else {
          cookieStore.delete("cart_session");

          cart = await createGuestCart();
        }
      } else {
        cart = await createGuestCart();
      }
    }

    // Check if item already in cart
    const existingItemIndex = cart.items?.findIndex(
      (item) => item.variantSku === variantSku,
    );

    if (existingItemIndex !== undefined && existingItemIndex >= 0) {
      // Item exists - increment quantity
      const existingItem = cart.items![existingItemIndex];
      const newQuantity = (existingItem.quantity || 0) + quantity;

      await writeClient
        .patch(cart._id)
        .set({
          [`items[_key == "${existingItem._key}"].quantity`]: newQuantity,
        })
        .commit();
    } else {
      // New item - append to array
      await writeClient
        .patch(cart._id)
        .setIfMissing({ items: [] })
        .append("items", [
          {
            _type: "cartItem",
            _key: `item-${Date.now()}`,
            product: { _type: "reference", _ref: productId },
            variantSku,
            quantity,
            priceSnapshot,
          },
        ])
        .commit();
    }

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
    const cart = await getCartWithDetails();

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
    const cart = await getCartWithDetails();

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
    const cart = await getCartWithDetails();

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
