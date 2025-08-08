import { defineField } from "sanity";

/**
 * Spend Threshold Configuration
 * For promotions like "Spend $150+, get 15% off"
 */
export const thresholdConfig = defineField({
  name: "thresholdConfig",
  title: "Spend Threshold Configuration",
  type: "object",
  fields: [
    defineField({
      name: "minimumSpend",
      title: "Minimum Spend Amount",
      type: "number",
      description: "Minimum cart value to trigger discount",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "threshold") return true;
          if (!value) return "Minimum spend amount is required";
          if (value < 0) return "Must be at least 0";
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
          if (docType !== "threshold") return true;
          if (!value) return "Discount type is required";
          return true;
        }),
      initialValue: "percentage",
    }),
    defineField({
      name: "discountValue",
      title: "Discount Value",
      type: "number",
      description: "Percentage (0-100) or fixed dollar amount",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "threshold") return true;
          if (!value) return "Discount value is required";
          if (value < 0) return "Must be at least 0";
          return true;
        }),
    }),
  ],
  hidden: ({ document }) => document?.type !== "threshold",
});