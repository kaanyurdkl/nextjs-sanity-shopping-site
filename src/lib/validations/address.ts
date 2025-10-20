import { z } from "zod";

/**
 * Address validation schema
 * Matches Sanity address schema constraints
 */
export const addressSchema = z.object({
  // Address nickname (e.g., "Home", "Office")
  nickname: z
    .string()
    .min(1, "Address name is required")
    .max(50, "Address name must be less than 50 characters")
    .trim(),

  // Recipient details
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

  // Location details
  streetAddress: z
    .string()
    .min(1, "Street address is required")
    .max(100, "Street address must be less than 100 characters")
    .trim(),

  aptUnit: z
    .string()
    .max(50, "Apartment/unit must be less than 50 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .min(1, "City is required")
    .max(50, "City must be less than 50 characters")
    .trim(),

  province: z.enum(
    [
      "AB",
      "BC",
      "MB",
      "NB",
      "NL",
      "NT",
      "NS",
      "NU",
      "ON",
      "PE",
      "QC",
      "SK",
      "YT",
    ],
    {
      message: "Please select a valid province",
    }
  ),

  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .refine(
      (val) => {
        // Canadian postal code format: A1A 1A1 (exactly 7 characters with space)
        const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
        return canadianPostalRegex.test(val);
      },
      {
        message: "Postal code must be in format: A1A 1A1 (with space)",
      }
    ),

  // Country (currently only Canada is supported)
  country: z
    .string()
    .min(1, "Country is required")
    .refine((val) => val === "Canada", {
      message: "Only Canada is currently supported",
    }),

  // Phone number (optional, 10 digits)
  phoneNumber: z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        // 10 digits only
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(val);
      },
      {
        message: "Please enter a valid 10-digit phone number",
      }
    )
    .optional()
    .or(z.literal("")),

  // Default address flag
  isDefault: z.boolean().optional().default(false),
});

/**
 * TypeScript type inferred from schema
 */
export type AddressInput = z.infer<typeof addressSchema>;
