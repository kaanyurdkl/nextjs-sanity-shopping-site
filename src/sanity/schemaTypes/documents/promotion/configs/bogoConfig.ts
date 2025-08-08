import { defineField } from "sanity";

/**
 * Buy One Get One (BOGO) Configuration
 * For promotions like "Buy 2, Get 1 Free" or "Buy 1, Get 1 50% Off"
 */
export const bogoConfig = defineField({
  name: "bogoConfig",
  title: "Buy One Get One Configuration",
  type: "object",
  fields: [
    defineField({
      name: "buyQuantity",
      title: "Buy Quantity",
      type: "number",
      description: "Number of items customer must buy",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "bogo") return true;
          if (!value) return "Buy quantity is required";
          if (value < 1) return "Must be at least 1";
          return true;
        }),
      initialValue: 1,
    }),
    defineField({
      name: "getQuantity",
      title: "Get Quantity",
      type: "number",
      description: "Number of additional items customer receives",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "bogo") return true;
          if (!value) return "Get quantity is required";
          if (value < 1) return "Must be at least 1";
          return true;
        }),
      initialValue: 1,
    }),
    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Free (100% off)", value: "free" },
          { title: "Percentage Discount", value: "percentage" },
        ],
      },
      description: "Type of discount for additional items",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "bogo") return true;
          if (!value) return "Discount type is required";
          return true;
        }),
      initialValue: "free",
    }),
    defineField({
      name: "discountPercentage",
      title: "Discount Percentage",
      type: "number",
      description:
        "Percentage off for additional items (e.g., 50 for 50% off)",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          const parent = context.parent as { discountType?: string };
          if (docType !== "bogo") return true;
          if (parent?.discountType !== "percentage") return true;
          if (!value) return "Discount percentage is required";
          if (value < 0) return "Must be at least 0";
          if (value > 100) return "Must be at most 100";
          return true;
        }),
      initialValue: 50,
      hidden: ({ parent }) => parent?.discountType !== "percentage",
    }),
  ],
  hidden: ({ document }) => document?.type !== "bogo",
});