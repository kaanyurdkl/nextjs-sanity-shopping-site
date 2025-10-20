"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getUserIdByGoogleId, updateUserProfile } from "@/sanity/lib/utils";
import { profileUpdateSchema } from "@/lib/validations/profile";

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
