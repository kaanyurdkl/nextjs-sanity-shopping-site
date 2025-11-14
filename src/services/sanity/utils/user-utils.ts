import { sanityFetchNoCache } from "@/services/sanity/lib/fetch";
import { writeClient } from "@/services/sanity/lib/client";
import type {
  Address,
  USER_BY_EMAIL_QUERYResult,
  USER_BY_GOOGLE_ID_QUERYResult,
  USER_ID_BY_GOOGLE_ID_QUERYResult,
} from "@/services/sanity/types/sanity.types";
import {
  USER_BY_EMAIL_QUERY,
  USER_BY_GOOGLE_ID_QUERY,
  USER_ID_BY_GOOGLE_ID_QUERY,
} from "@/services/sanity/lib/queries";

/**
 * Fetch user by email
 * Used for account pages and authentication
 * Uses no-cache to always fetch fresh user data after profile updates
 */
export async function getUserByEmail(
  email: string,
): Promise<USER_BY_EMAIL_QUERYResult> {
  return await sanityFetchNoCache({
    query: USER_BY_EMAIL_QUERY,
    params: { email },
  });
}

/**
 * Fetch user by Google OAuth ID
 * Preferred method for account pages (more stable than email)
 * Uses no-cache to always fetch fresh user data after profile updates
 */
export async function getUserByGoogleId(
  googleId: string,
): Promise<USER_BY_GOOGLE_ID_QUERYResult> {
  return await sanityFetchNoCache({
    query: USER_BY_GOOGLE_ID_QUERY,
    params: { googleId },
  });
}

/**
 * Get user ID by Google ID (optimized for mutations)
 * Only fetches the _id field needed for patch operations
 * Uses no-cache to ensure immediate consistency after mutations
 * @returns The user's _id string, or null if not found
 */
export async function getUserIdByGoogleId(
  googleId: string,
): Promise<string | null> {
  const result = await sanityFetchNoCache<USER_ID_BY_GOOGLE_ID_QUERYResult>({
    query: USER_ID_BY_GOOGLE_ID_QUERY,
    params: { googleId },
  });
  return result?._id ?? null;
}

/**
 * Update user profile information
 * Used for updating name and phone number in user settings
 * @param userId - The Sanity document _id of the user
 * @param profile - Profile data to update
 */
export async function updateUserProfile(
  userId: string,
  profile: {
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
  },
) {
  return await writeClient
    .patch(userId)
    .set({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
    })
    .commit({ visibility: "sync" });
}

/**
 * Add address to user's address list
 * Handles default address logic: if new address is default, unsets all existing defaults first
 * User can choose to have no default address
 * @param userId - The Sanity document _id of the user
 * @param address - Address data to add (excluding _type and _key which are set automatically)
 */
export async function addAddress(
  userId: string,
  address: Omit<Address, "_type">,
) {
  // Start building the patch operation
  let patch = writeClient.patch(userId).setIfMissing({ addresses: [] });

  // If new address is marked as default, unset all existing default flags
  if (address.isDefault) {
    // First, fetch current user to check for existing addresses
    const user = await writeClient.fetch(`*[_id == $userId][0]{ addresses }`, {
      userId,
    });

    if (user?.addresses && user.addresses.length > 0) {
      // Manually update each address's isDefault field to false
      user.addresses.forEach((_: unknown, index: number) => {
        patch = patch.set({ [`addresses[${index}].isDefault`]: false });
      });
    }
  }

  // Append the new address
  patch = patch.append("addresses", [
    {
      _type: "address",
      _key: `address-${Date.now()}`, // Unique key for the array item
      ...address,
    },
  ]);

  // Commit all changes in a single transaction
  return await patch.commit({ visibility: "sync" });
}

/**
 * Update an existing address in user's address list
 * Handles default address logic: if address is set as default, unsets all other defaults
 * @param userId - The Sanity document _id of the user
 * @param addressKey - The _key of the address to update
 * @param address - Updated address data (excluding _type and _key which don't change)
 */
export async function updateAddress(
  userId: string,
  addressKey: string,
  address: Omit<Address, "_type" | "_key">,
) {
  // Start building the patch operation
  let patch = writeClient.patch(userId);

  // If address is being set as default, unset all other default flags first
  if (address.isDefault) {
    // Fetch current user to check for existing addresses
    const user = await writeClient.fetch(`*[_id == $userId][0]{ addresses }`, {
      userId,
    });

    if (user?.addresses && user.addresses.length > 0) {
      // Unset isDefault for all addresses EXCEPT the one being updated
      user.addresses.forEach((addr: Address & { _key: string }) => {
        if (addr._key !== addressKey) {
          patch = patch.set({
            [`addresses[_key == "${addr._key}"].isDefault`]: false,
          });
        }
      });
    }
  }

  // Update the specific address by _key
  Object.entries(address).forEach(([key, value]) => {
    patch = patch.set({
      [`addresses[_key == "${addressKey}"].${key}`]: value,
    });
  });

  // Commit all changes in a single transaction
  return await patch.commit({ visibility: "sync" });
}

/**
 * Delete an address from user's address list
 * Removes the address with the matching _key
 * @param userId - The Sanity document _id of the user
 * @param addressKey - The _key of the address to delete
 */
export async function deleteAddress(userId: string, addressKey: string) {
  return await writeClient
    .patch(userId)
    .unset([`addresses[_key == "${addressKey}"]`])
    .commit({ visibility: "sync" });
}

/**
 * Set an address as the default address
 * Unsets all other addresses' default flags and sets the specified address as default
 * @param userId - The Sanity document _id of the user
 * @param addressKey - The _key of the address to set as default
 */
export async function setDefaultAddress(userId: string, addressKey: string) {
  // Fetch current user to check for existing addresses
  const user = await writeClient.fetch(`*[_id == $userId][0]{ addresses }`, {
    userId,
  });

  if (!user?.addresses || user.addresses.length === 0) {
    throw new Error("User has no addresses");
  }

  // Start building the patch operation
  let patch = writeClient.patch(userId);

  // Unset isDefault for all addresses
  user.addresses.forEach((addr: Address & { _key: string }) => {
    patch = patch.set({
      [`addresses[_key == "${addr._key}"].isDefault`]: false,
    });
  });

  // Set the specified address as default
  patch = patch.set({
    [`addresses[_key == "${addressKey}"].isDefault`]: true,
  });

  // Commit all changes in a single transaction
  return await patch.commit({ visibility: "sync" });
}
