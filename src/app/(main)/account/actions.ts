"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { auth } from "@/services/next-auth/lib";
import {
  getUserIdByGoogleId,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/services/sanity/lib/utils";
import { profileUpdateSchema } from "@/lib/validations/profile";
import { addressSchema } from "@/lib/validations/address";

/**
 * Form state returned from Server Action
 */
export interface ProfileFormState {
  success?: boolean;
  message?: string;
  errors?: {
    firstName?: string[] | undefined;
    lastName?: string[] | undefined;
    phoneNumber?: string[] | undefined;
  };
}

/**
 * Address form state
 */
export interface AddressFormState {
  success?: boolean;
  message?: string;
  errors?: {
    nickname?: string[] | undefined;
    firstName?: string[] | undefined;
    lastName?: string[] | undefined;
    streetAddress?: string[] | undefined;
    aptUnit?: string[] | undefined;
    city?: string[] | undefined;
    province?: string[] | undefined;
    postalCode?: string[] | undefined;
    country?: string[] | undefined;
    phoneNumber?: string[] | undefined;
  };
}

/**
 * Update user profile information
 * Server Action for handling profile form submissions
 *
 * @param prevState - Previous form state (from useActionState)
 * @param formData - Form data from submission
 * @returns Updated form state with success/error info
 */
export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.googleId) {
      return {
        success: false,
        message: "You must be signed in to update your profile",
      };
    }

    // 2. Extract and validate form data
    const rawData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phoneNumber: formData.get("phoneNumber") || "",
    };

    const result = profileUpdateSchema.safeParse(rawData);

    if (!result.success) {
      // Format Zod errors into field-specific error arrays
      const fieldErrors: ProfileFormState["errors"] = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ProfileFormState["errors"];
        if (field) {
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field]!.push(issue.message);
        }
      });

      return {
        success: false,
        message: "Please fix the errors below",
        errors: fieldErrors,
      };
    }

    // 3. Get user ID from Sanity by Google ID
    const userId = await getUserIdByGoogleId(session.user.googleId);

    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // 4. Update user in Sanity
    await updateUserProfile(userId, {
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      phoneNumber: result.data.phoneNumber || null,
    });

    // 5. Revalidate cache (belt and suspenders approach)
    // Note: getUserByGoogleId uses no-cache, but we still revalidate
    // in case other parts of the app cache user data
    revalidateTag("user");
    revalidatePath("/account");

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    };
  }
}

/**
 * Add a new address to user's address list
 * Server Action for handling address form submissions
 *
 * @param prevState - Previous form state (from useActionState)
 * @param formData - Form data from submission
 * @returns Updated form state with success/error info
 */
export async function addAddressAction(
  _prevState: AddressFormState,
  formData: FormData
): Promise<AddressFormState> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.googleId) {
      return {
        success: false,
        message: "You must be signed in to add an address",
      };
    }

    // 2. Extract and validate form data
    const rawData = {
      nickname: formData.get("addressName"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      streetAddress: formData.get("address"),
      aptUnit: formData.get("aptUnit") || "",
      city: formData.get("city"),
      province: formData.get("province"),
      postalCode: (formData.get("postalCode") as string)?.toUpperCase() || "",
      country: "Canada", // Always set server-side for security
      phoneNumber: formData.get("phoneNumber") || "",
      isDefault: formData.get("isDefault") === "on",
    };

    const result = addressSchema.safeParse(rawData);

    if (!result.success) {
      // Format Zod errors into field-specific error arrays
      const fieldErrors: Partial<Record<keyof AddressFormState["errors"], string[]>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AddressFormState["errors"];
        if (field) {
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field]!.push(issue.message);
        }
      });

      return {
        success: false,
        message: "Please fix the errors below",
        errors: fieldErrors,
      };
    }

    // 3. Get user ID from Sanity by Google ID
    const userId = await getUserIdByGoogleId(session.user.googleId);

    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // 4. Add address using utility function (handles default address logic)
    // Zod validation ensures province type matches Sanity's literal union
    await addAddress(userId, result.data);

    // 5. Revalidate cache
    revalidateTag("user");
    revalidatePath("/account");

    return {
      success: true,
      message: "Address added successfully",
    };
  } catch (error) {
    console.error("Add address error:", error);
    return {
      success: false,
      message: "Failed to add address. Please try again.",
    };
  }
}

/**
 * Update an existing address in user's address list
 * Server Action for handling address edit form submissions
 *
 * @param addressKey - The _key of the address to update
 * @param prevState - Previous form state (from useActionState)
 * @param formData - Form data from submission
 * @returns Updated form state with success/error info
 */
export async function updateAddressAction(
  addressKey: string,
  _prevState: AddressFormState,
  formData: FormData
): Promise<AddressFormState> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.googleId) {
      return {
        success: false,
        message: "You must be signed in to update an address",
      };
    }

    // 2. Extract and validate form data
    const rawData = {
      nickname: formData.get("addressName"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      streetAddress: formData.get("address"),
      aptUnit: formData.get("aptUnit") || "",
      city: formData.get("city"),
      province: formData.get("province"),
      postalCode: (formData.get("postalCode") as string)?.toUpperCase() || "",
      country: "Canada", // Always set server-side for security
      phoneNumber: formData.get("phoneNumber") || "",
      isDefault: formData.get("isDefault") === "on",
    };

    const result = addressSchema.safeParse(rawData);

    if (!result.success) {
      // Format Zod errors into field-specific error arrays
      const fieldErrors: AddressFormState["errors"] = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AddressFormState["errors"];
        if (field) {
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field]!.push(issue.message);
        }
      });

      return {
        success: false,
        message: "Please fix the errors below",
        errors: fieldErrors,
      };
    }

    // 3. Get user ID from Sanity by Google ID
    const userId = await getUserIdByGoogleId(session.user.googleId);

    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // 4. Update address using utility function (handles default address logic)
    await updateAddress(userId, addressKey, result.data);

    // 5. Revalidate cache
    revalidateTag("user");
    revalidatePath("/account");

    return {
      success: true,
      message: "Address updated successfully",
    };
  } catch (error) {
    console.error("Update address error:", error);
    return {
      success: false,
      message: "Failed to update address. Please try again.",
    };
  }
}

/**
 * Delete an address from user's address list
 * Server Action for handling address deletion
 *
 * @param addressKey - The _key of the address to delete
 * @returns Success/error state
 */
export async function deleteAddressAction(
  addressKey: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.googleId) {
      return {
        success: false,
        message: "You must be signed in to delete an address",
      };
    }

    // 2. Get user ID from Sanity by Google ID
    const userId = await getUserIdByGoogleId(session.user.googleId);

    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // 3. Delete address using utility function
    await deleteAddress(userId, addressKey);

    // 4. Revalidate cache
    revalidateTag("user");
    revalidatePath("/account");

    return {
      success: true,
      message: "Address deleted successfully",
    };
  } catch (error) {
    console.error("Delete address error:", error);
    return {
      success: false,
      message: "Failed to delete address. Please try again.",
    };
  }
}

/**
 * Set an address as the default address
 * Server Action for handling set default address
 *
 * @param addressKey - The _key of the address to set as default
 * @returns Success/error state
 */
export async function setDefaultAddressAction(
  addressKey: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.googleId) {
      return {
        success: false,
        message: "You must be signed in to set a default address",
      };
    }

    // 2. Get user ID from Sanity by Google ID
    const userId = await getUserIdByGoogleId(session.user.googleId);

    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // 3. Set default address using utility function
    await setDefaultAddress(userId, addressKey);

    // 4. Revalidate cache
    revalidateTag("user");
    revalidatePath("/account");

    return {
      success: true,
      message: "Default address updated successfully",
    };
  } catch (error) {
    console.error("Set default address error:", error);
    return {
      success: false,
      message: "Failed to set default address. Please try again.",
    };
  }
}
