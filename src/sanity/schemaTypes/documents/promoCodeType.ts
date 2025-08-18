import { defineField, defineType } from "sanity";

/**
 * Promo code schema for customer-entered discount codes
 *
 * Customer-entered discount codes for order-level discounts.
 * Supports fixed amount and percentage discounts with optional constraints.
 *
 * Fields:
 * - name: Internal admin name for the promo code
 * - description: Internal admin description/notes
 * - code: Customer-facing code (e.g., SAVE20, WELCOME10) with duplicate prevention
 * - discountType: Fixed amount or percentage discount
 * - discountValue: Dollar amount or percentage value
 * - hasMaximumDiscount: Toggle for maximum discount cap
 * - maximumDiscount: Maximum discount amount to protect profit margins
 * - hasMinimumPurchase: Toggle for minimum purchase requirement
 * - minimumPurchase: Required cart value (conditional)
 * - hasUsageLimit: Toggle for usage limit constraint
 * - usageLimit: Maximum number of uses (conditional)
 * - isActive: Enable/disable the promo code
 * - startDate: When the code becomes active
 * - endDate: When the code expires
 * - usageCount: Current usage tracking (auto-updated)
 */
export const promoCodeType = defineType({
  name: "promoCode",
  title: "Promo Code",
  type: "document",
  fieldsets: [
    {
      name: "basic",
      title: "Basic Information",
      description: "Essential promo code details",
      options: { collapsible: false }
    },
    {
      name: "discount",
      title: "Discount Configuration", 
      description: "Set discount type, amount, and optional caps",
      options: { collapsible: false }
    },
    {
      name: "constraints",
      title: "Constraints & Limits",
      description: "Optional restrictions (minimum purchase, usage limits)",
      options: { collapsible: true, collapsed: false }
    },
    {
      name: "schedule",
      title: "Scheduling & Status",
      description: "When the promo code is active",
      options: { collapsible: true, collapsed: false }
    },
    {
      name: "analytics",
      title: "Usage Analytics",
      description: "Track promo code performance",
      options: { collapsible: true, collapsed: true }
    }
  ],
  fields: [
    // === BASIC INFORMATION ===
    defineField({
      name: "name",
      title: "Promo Code Name",
      type: "string",
      description: "Internal name for this promo code",
      validation: (rule) => rule.required().max(100),
      fieldset: "basic",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Internal description of this promo code",
      fieldset: "basic",
    }),
    defineField({
      name: "code",
      title: "Promo Code",
      type: "string",
      description: "The code customers must enter (e.g., SAVE15, WELCOME10)",
      validation: (rule) => [
        rule
          .required()
          .min(3)
          .max(20)
          .uppercase()
          .regex(/^[A-Z0-9]+$/, "Code must contain only uppercase letters and numbers"),
        rule.custom(async (value, context) => {
          if (!value) return true; // Skip if empty (handled by required())
          
          const { document, getClient } = context;
          const client = getClient({ apiVersion: '2024-01-01' });
          
          // Get current document ID (handle both draft and published)
          const currentId = document?._id?.replace(/^drafts\./, '');
          
          const params = {
            code: value,
            currentId: currentId,
            draftId: `drafts.${currentId}`,
          };
          
          // Check for existing promo codes with the same code (excluding current document)
          const query = `*[_type == "promoCode" && code == $code && _id != $currentId && _id != $draftId]`;
          const existingCodes = await client.fetch(query, params);
          
          if (existingCodes.length > 0) {
            return `Promo code "${value}" is already in use. Please choose a different code.`;
          }
          
          return true;
        }),
      ],
      fieldset: "basic",
    }),

    // === DISCOUNT CONFIGURATION ===
    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Fixed Amount Off ($10 off)", value: "fixed_amount" },
          { title: "Percentage Off (15% off)", value: "percentage" },
        ],
      },
      validation: (rule) => rule.required(),
      initialValue: "fixed_amount",
      fieldset: "discount",
    }),
    defineField({
      name: "discountValue",
      title: "Discount Value",
      type: "number",
      description:
        "Dollar amount (for fixed) or percentage (0-100 for percentage)",
      validation: (rule) =>
        rule
          .required()
          .min(0)
          .custom((value, context) => {
            if (value === undefined || value === null) {
              return "Discount value is required";
            }
            const parent = context.parent as { discountType?: string };
            if (parent?.discountType === "percentage" && value > 100) {
              return "Percentage cannot exceed 100";
            }
            return true;
          }),
      fieldset: "discount",
    }),
    defineField({
      name: "hasMaximumDiscount",
      title: "Set Maximum Discount Cap",
      type: "boolean",
      description: "Limit the maximum discount amount to protect profit margins",
      initialValue: ({ parent }) => {
        // Auto-suggest cap for percentage discounts and large fixed amounts
        if (parent?.discountType === "percentage") return true;
        if (parent?.discountType === "fixed_amount" && parent?.discountValue > 50) return true;
        return false;
      },
      fieldset: "discount",
    }),
    defineField({
      name: "maximumDiscount",
      title: "Maximum Discount Amount",
      type: "number",
      description: "Maximum dollar amount this discount can provide (e.g., $50 cap on 25% off)",
      initialValue: ({ parent }) => {
        // Smart defaults based on discount type
        if (parent?.discountType === "percentage") return 50;
        if (parent?.discountType === "fixed_amount") return parent?.discountValue;
        return undefined;
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { 
            hasMaximumDiscount?: boolean;
            discountType?: string;
            discountValue?: number;
          };
          
          if (parent?.hasMaximumDiscount) {
            if (!value || value <= 0) {
              return "Maximum discount amount is required when cap is enabled";
            }
            
            // For fixed amounts, cap shouldn't be higher than the discount itself
            if (parent?.discountType === "fixed_amount" && parent?.discountValue && value > parent.discountValue) {
              return `Maximum discount cannot exceed the discount amount ($${parent.discountValue})`;
            }
          }
          return true;
        }),
      hidden: ({ parent }) => !parent?.hasMaximumDiscount,
      fieldset: "discount",
    }),

    // === CONSTRAINTS & LIMITS ===
    defineField({
      name: "hasMinimumPurchase",
      title: "Require Minimum Purchase",
      type: "boolean",
      description: "Toggle to require a minimum purchase amount",
      initialValue: false,
      fieldset: "constraints",
    }),
    defineField({
      name: "minimumPurchase",
      title: "Minimum Purchase Amount",
      type: "number",
      description: "Minimum cart value required",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { hasMinimumPurchase?: boolean };
          if (parent?.hasMinimumPurchase && (!value || value <= 0)) {
            return "Minimum purchase amount is required when enabled";
          }
          return true;
        }),
      hidden: ({ parent }) => !parent?.hasMinimumPurchase,
      fieldset: "constraints",
    }),
    defineField({
      name: "hasUsageLimit",
      title: "Set Usage Limit",
      type: "boolean",
      description: "Limit how many times this code can be used",
      initialValue: false,
      fieldset: "constraints",
    }),
    defineField({
      name: "usageLimit",
      title: "Maximum Uses",
      type: "number",
      description: "Maximum number of times this code can be used",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { hasUsageLimit?: boolean };
          if (parent?.hasUsageLimit && (!value || value <= 0)) {
            return "Usage limit is required when enabled";
          }
          return true;
        }),
      hidden: ({ parent }) => !parent?.hasUsageLimit,
      fieldset: "constraints",
    }),

    // === SCHEDULING & STATUS ===
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Whether this promo code is currently active",
      initialValue: true,
      fieldset: "schedule",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      description: "When this promo code becomes active",
      validation: (rule) => rule.required(),
      fieldset: "schedule",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      description: "When this promo code expires (optional)",
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = (context.document as { startDate?: string })
            ?.startDate;
          if (
            endDate &&
            startDate &&
            new Date(endDate) <= new Date(startDate)
          ) {
            return "End date must be after start date";
          }
          return true;
        }),
      fieldset: "schedule",
    }),

    // === USAGE ANALYTICS ===
    defineField({
      name: "usageCount",
      title: "Times Used",
      type: "number",
      description: "How many times this code has been used",
      initialValue: 0,
      readOnly: true,
      fieldset: "analytics",
    }),
  ],

  preview: {
    select: {
      name: "name",
      code: "code",
      discountType: "discountType",
      discountValue: "discountValue",
      isActive: "isActive",
      startDate: "startDate",
      endDate: "endDate",
      usageCount: "usageCount",
      usageLimit: "usageLimit",
    },
    prepare({
      name,
      code,
      discountType,
      discountValue,
      isActive,
      startDate,
      endDate,
      usageCount,
      usageLimit,
    }) {
      const now = new Date();
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      // Status indicator
      let status = "⚪";
      if (!isActive) {
        status = "❌";
      } else if (start && start > now) {
        status = "🟡"; // Scheduled
      } else if (end && end < now) {
        status = "🔴"; // Expired
      } else {
        status = "🟢"; // Active
      }

      // Usage indicator
      const usageIndicator = usageLimit
        ? ` (${usageCount || 0}/${usageLimit})`
        : usageCount
          ? ` (${usageCount} uses)`
          : "";

      // Discount display
      const discountDisplay =
        discountType === "percentage"
          ? `${discountValue}% OFF`
          : `$${discountValue} OFF`;

      return {
        title: `${code} - ${name}`,
        subtitle: `${status} 🎟️ ${discountDisplay}${usageIndicator}`,
      };
    },
  },
});
