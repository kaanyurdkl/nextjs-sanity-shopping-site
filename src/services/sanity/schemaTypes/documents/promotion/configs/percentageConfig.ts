import { defineField } from "sanity";

/**
 * Percentage Discount Configuration
 * For promotions like "25% off selected items"
 */
export const percentageConfig = defineField({
  name: "percentageConfig",
  title: "Percentage Discount Configuration",
  type: "object",
  fields: [
    defineField({
      name: "discountPercentage",
      title: "Discount Percentage",
      type: "number",
      description: "Percentage off (0-100)",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "percentage") return true; // Skip validation if not percentage type
          if (!value) return "Discount percentage is required";
          if (value < 0) return "Must be greater than or equal to 0";
          if (value > 100) return "Must be lower than or equal to 100";
          return true;
        }),
    }),
    defineField({
      name: "minimumQuantity",
      title: "Minimum Quantity",
      type: "number",
      description: "Minimum items required (optional)",
      validation: (rule) => rule.min(1),
      initialValue: 1,
    }),
    defineField({
      name: "maximumDiscount",
      title: "Maximum Discount Amount",
      type: "number",
      description: "Cap on total discount in dollars (optional)",
      validation: (rule) => rule.min(0),
    }),
  ],
  hidden: ({ document }) => document?.type !== "percentage",
});