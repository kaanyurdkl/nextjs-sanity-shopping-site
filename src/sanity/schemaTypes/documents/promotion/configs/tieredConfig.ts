import { defineField } from "sanity";

/**
 * Tiered Discount Configuration
 * For promotions like "Buy 3+ get 10% off, Buy 5+ get 20% off"
 */
export const tieredConfig = defineField({
  name: "tieredConfig",
  title: "Tiered Discount Configuration",
  type: "object",
  fields: [
    defineField({
      name: "tiers",
      title: "Discount Tiers",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "minimumQuantity",
              title: "Minimum Quantity",
              type: "number",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const docType = (context.document as { type?: string })
                    ?.type;
                  if (docType !== "tiered") return true;
                  if (!value) return "Minimum quantity is required";
                  if (value < 1) return "Must be at least 1";
                  return true;
                }),
            }),
            defineField({
              name: "discountPercentage",
              title: "Discount Percentage",
              type: "number",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const docType = (context.document as { type?: string })
                    ?.type;
                  if (docType !== "tiered") return true;
                  if (!value) return "Discount percentage is required";
                  if (value < 0) return "Must be at least 0";
                  if (value > 100) return "Must be at most 100";
                  return true;
                }),
            }),
          ],
          preview: {
            select: {
              minQty: "minimumQuantity",
              discount: "discountPercentage",
            },
            prepare({ minQty, discount }) {
              return {
                title: `${minQty}+ items: ${discount}% off`,
              };
            },
          },
        },
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const docType = (context.document as { type?: string })?.type;
          if (docType !== "tiered") return true;
          if (!value) return "At least one tier is required";
          if (value.length < 1) return "Must have at least one tier";
          return true;
        }),
    }),
  ],
  hidden: ({ document }) => document?.type !== "tiered",
});