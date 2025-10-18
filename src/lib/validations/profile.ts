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

        // Canadian phone number format validation
        // Matches: +1 (514) 555-0123, 1-514-555-0123, 514.555.0123, etc.
        const canadianPhoneRegex =
          /^(\+1|1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

        return canadianPhoneRegex.test(val);
      },
      {
        message: "Please enter a valid Canadian phone number",
      }
    )
    .optional()
    .or(z.literal("")),
});

/**
 * TypeScript type inferred from schema
 */
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
