"use server";

import { revalidateTag } from "next/cache";
import {
  createGuestCart,
  createUserCart,
  getGuestCart,
  getUserCart,
} from "../utils/cart-utils";
import { writeClient } from "../lib/client";
import { cookies } from "next/headers";
import { auth } from "@/services/next-auth/lib";
import { getUserIdByGoogleId } from "../utils/user-utils";

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

    revalidateTag("cart");

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
 * Uses atomic increment operation for better performance and race condition safety
 */
export async function incrementCartItemAction(
  cartId: string,
  cartItem: {
    _key: string;
    variantSku: string;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    await writeClient
      .patch(cartId)
      .inc({ [`items[_key == "${cartItem._key}"].quantity`]: 1 })
      .commit();

    revalidateTag("cart");

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
 * Uses atomic decrement operation for better performance and race condition safety
 * Note: Minimum quantity of 1 is enforced - use removeCartItemAction to delete items
 */
export async function decrementCartItemAction(
  cartId: string,
  cartItem: {
    _key: string;
    variantSku: string;
    quantity: number;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if quantity is already at minimum
    if (cartItem.quantity <= 1) {
      return { success: true };
    }

    await writeClient
      .patch(cartId)
      .dec({ [`items[_key == "${cartItem._key}"].quantity`]: 1 })
      .commit();

    revalidateTag("cart");

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
 * Removes item completely using optimized approach without fetching full cart
 */
export async function removeCartItemAction(
  cartId: string,
  itemKey: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await writeClient
      .patch(cartId)
      .unset([`items[_key == "${itemKey}"]`])
      .commit();

    revalidateTag("cart");

    return { success: true };
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove item",
    };
  }
}
