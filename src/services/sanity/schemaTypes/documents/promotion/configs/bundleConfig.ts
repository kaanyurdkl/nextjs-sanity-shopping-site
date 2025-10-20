import { defineField } from "sanity";

/**
 * Bundle Pricing Configuration
 * For promotions like "2 shirts for $50"
 */
export const bundleConfig = defineField({
  name: "bundleConfig",
  title: "Bundle Pricing Configuration",
  type: "object",
  fields: [
    defineField({
      name: "quantity",
      title: "Bundle Quantity",
      type: "number",
      description:
        "Number of items in bundle (e.g., 2 for '2 shirts for $50')",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "bundle") return true;
          if (!value) return "Bundle quantity is required";
          if (value < 2) return "Must be at least 2";
          return true;
        }),
    }),
    defineField({
      name: "bundlePrice",
      title: "Bundle Price",
      type: "number",
      description: "Fixed price for the entire bundle",
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "bundle") return true;
          if (!value) return "Bundle price is required";
          if (value < 0) return "Must be at least 0";
          return true;
        }),
    }),
  ],
  hidden: ({ document }) => document?.type !== "bundle",
});