import { defineField } from "sanity";

/**
 * Fixed Amount Discount Configuration
 * For promotions like "$10 off your order"
 */
export const fixedAmountConfig = defineField({
  name: "fixedAmountConfig",
  title: "Fixed Amount Discount Configuration",
  type: "object",
  fields: [
    defineField({
      name: "discountAmount",
      title: "Discount Amount",
      type: "number",
      description: "Fixed dollar amount off",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "fixed_amount") return true;
          if (!value) return "Discount amount is required";
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
          if (docType !== "fixed_amount") return true;
          if (value !== undefined && value < 0) return "Must be at least 0";
          return true;
        }),
    }),
  ],
  hidden: ({ document }) => document?.type !== "fixed_amount",
});