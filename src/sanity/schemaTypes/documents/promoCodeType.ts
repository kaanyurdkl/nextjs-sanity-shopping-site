import { defineField, defineType } from "sanity";

/**
 * Promo Code Schema
 *
 * Customer-entered discount codes for order-level discounts.
 * Supports fixed amount and percentage discounts with optional constraints.
 *
 * Schema Fields:
 * - name: Internal admin name for the promo code
 * - description: Internal admin description/notes
 * - code: Customer-facing code (e.g., SAVE20, WELCOME10)
 * - discountType: Fixed amount or percentage discount
 * - discountValue: Dollar amount or percentage value
 * - hasMinimumPurchase: Toggle for minimum purchase requirement
 * - minimumPurchase: Required cart value (conditional)
 * - hasUsageLimit: Toggle for usage limit constraint
 * - usageLimit: Maximum number of uses (conditional)
 * - usageCount: Current usage tracking (auto-updated)
 * - isActive: Enable/disable the promo code
 * - startDate: When the code becomes active
 * - endDate: When the code expires
 */
export const promoCodeType = defineType({
  name: "promoCode",
  title: "Promo Code",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Promo Code Name",
      type: "string",
      description: "Internal name for this promo code",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Internal description of this promo code",
    }),
    defineField({
      name: "code",
      title: "Promo Code",
      type: "string",
      description: "The code customers must enter (e.g., SAVE15, WELCOME10)",
      validation: (rule) =>
        rule
          .required()
          .min(3)
          .max(20)
          .uppercase()
          .regex(/^[A-Z0-9]+$/),
    }),
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
    }),
    defineField({
      name: "hasMinimumPurchase",
      title: "Require Minimum Purchase",
      type: "boolean",
      description: "Toggle to require a minimum purchase amount",
      initialValue: false,
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
    }),
    defineField({
      name: "hasUsageLimit",
      title: "Require Usage Limit",
      type: "boolean",
      description: "Toggle to require a usage limit",
      initialValue: false,
    }),
    defineField({
      name: "usageLimit",
      title: "Usage Limit",
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
    }),
    defineField({
      name: "usageCount",
      title: "Current Usage Count",
      type: "number",
      description: "How many times this code has been used",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Whether this promo code is currently active",
      initialValue: true,
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      description: "When this promo code becomes active",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      description: "When this promo code expires",
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
