import { z } from "zod";

/**
 * Profile update validation schema
 * Matches Sanity user schema constraints
 */
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .trim(),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .trim(),

  phoneNumber: z
    .string()
    .trim()
    .refine(
      (val) => {
        // Allow empty string (optional field)
        if (!val) return true;

        // Canadian phone number: exactly 10 digits (no formatting)
        // Example: 6044403922
        const phoneRegex = /^[0-9]{10}$/;

        return phoneRegex.test(val);
      },
      {
        message: "Please enter a valid 10-digit phone number",
      }
    )
    .optional()
    .or(z.literal("")),
});

/**
 * TypeScript type inferred from schema
 */
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
