import { cookies } from "next/headers";
import { writeClient } from "@/services/sanity/lib/client";
import { sanityFetchNoCache } from "@/services/sanity/lib/fetch";
import type { Cart } from "@/services/sanity/types/sanity.types";

/**
 * Migrate guest cart to user cart during login
 * This is separate from cart-utils to avoid circular dependency with auth
 * @param userId - Sanity user document ID
 */
export async function migrateCartOnLogin(userId: string) {
  try {
    // 1. Check for guest session cookie
    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get("cart_session")?.value;

    if (!guestSessionId) {
      return { success: true, migrated: false };
    }

    console.log("🔄 Guest session found during login, migrating cart...");

    // 2. Find guest cart by sessionId
    const guestCart = await sanityFetchNoCache<Cart & { _id: string }>({
      query: `*[_type == "cart" && sessionId == $sessionId && status == "active"][0] {
        _id,
        items
      }`,
      params: { sessionId: guestSessionId },
    });

    // 3. If no guest cart found or empty, return
    if (!guestCart || !guestCart.items?.length) {
      return { success: true, migrated: false };
    }

    // 4. Check if user already has an active cart
    const existingUserCart = await sanityFetchNoCache<Cart & { _id: string }>({
      query: `*[_type == "cart" && user._ref == $userId && status == "active"][0] {
        _id,
        items
      }`,
      params: { userId },
    });

    // 5. MERGE scenario: User already has a cart
    if (existingUserCart) {
      console.log(`🔀 Merging guest cart into existing user cart: ${existingUserCart._id}`);

      // Merge guest cart items into existing user cart
      const existingItems = existingUserCart.items || [];
      const guestItems = guestCart.items || [];

      // Create a map of existing items by variantSku
      const itemMap = new Map(
        existingItems.map((item) => [item.variantSku, { ...item }])
      );

      // Add or merge guest items
      guestItems.forEach((guestItem) => {
        const existingItem = itemMap.get(guestItem.variantSku);
        if (existingItem) {
          // Variant already exists, add quantities
          existingItem.quantity += guestItem.quantity;
        } else {
          // New variant, add it
          itemMap.set(guestItem.variantSku, { ...guestItem });
        }
      });

      // Convert map back to array
      const mergedItems = Array.from(itemMap.values());

      // Update existing user cart with merged items
      await writeClient
        .patch(existingUserCart._id)
        .set({ items: mergedItems })
        .commit();

      // Delete the guest cart
      await writeClient.delete(guestCart._id);

      console.log(`✅ Cart merged: ${guestCart._id} deleted, items merged into ${existingUserCart._id}`);
      return { success: true, migrated: true, merged: true, cartId: existingUserCart._id };
    }

    // 6. CONVERT scenario: User has no cart, convert guest cart to user cart
    await writeClient
      .patch(guestCart._id)
      .set({
        user: { _type: "reference", _ref: userId },
      })
      .unset(["sessionId", "expiresAt"])
      .commit();

    console.log(`✅ Cart converted during login: ${guestCart._id} → user ${userId}`);
    return { success: true, migrated: true, merged: false, cartId: guestCart._id };
  } catch (error) {
    console.error("❌ Cart migration failed during login:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
