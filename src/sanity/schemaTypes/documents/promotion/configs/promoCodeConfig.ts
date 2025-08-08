import { defineField } from "sanity";

/**
 * Promo Code Configuration
 * For promotions like "SAVE15" for $15 off or 15% off
 */
export const promoCodeConfig = defineField({
  name: "promoCodeConfig",
  title: "Promo Code Configuration",
  type: "object",
  fields: [
    defineField({
      name: "promoCode",
      title: "Promo Code",
      type: "string",
      description:
        "The code customers must enter (e.g., SAVE15, WELCOME10)",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "promo_code") return true;
          if (!value) return "Promo code is required";
          if (value.length < 3) return "Must be at least 3 characters";
          if (value.length > 20) return "Must be at most 20 characters";
          if (value !== value.toUpperCase()) return "Must be uppercase";
          return true;
        }),
    }),
    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage Off", value: "percentage" },
          { title: "Fixed Amount Off", value: "fixed_amount" },
        ],
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "promo_code") return true;
          if (!value) return "Discount type is required";
          return true;
        }),
      initialValue: "fixed_amount",
    }),
    defineField({
      name: "discountValue",
      title: "Discount Value",
      type: "number",
      description: "Percentage (0-100) or fixed dollar amount",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "promo_code") return true;
          if (!value) return "Discount value is required";
          if (value < 0) return "Must be at least 0";
          return true;
        }),
    }),
    defineField({
      name: "minimumPurchase",
      title: "Minimum Purchase Amount",
      type: "number",
      description: "Minimum cart value required (optional)",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "promo_code") return true;
          if (value !== undefined && value < 0) return "Must be at least 0";
          return true;
        }),
    }),
    defineField({
      name: "usageLimit",
      title: "Usage Limit",
      type: "number",
      description:
        "Maximum number of times this code can be used (optional)",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "promo_code") return true;
          if (value !== undefined && value < 1) return "Must be at least 1";
          return true;
        }),
    }),
    defineField({
      name: "usageCount",
      title: "Current Usage Count",
      type: "number",
      description: "How many times this code has been used",
      initialValue: 0,
      readOnly: true,
    }),
  ],
  hidden: ({ document }) => document?.type !== "promo_code",
});