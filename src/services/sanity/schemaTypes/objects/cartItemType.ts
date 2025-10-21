import { defineType, defineField } from "sanity";

/**
 * Cart Item Object Type
 * Represents a single item in a shopping cart
 * Embedded in cart document as array items
 */
export const cartItemType = defineType({
  name: "cartItem",
  title: "Cart Item",
  type: "object",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
      description: "Reference to the product document",
    }),
    defineField({
      name: "variantSku",
      title: "Variant SKU",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Unique SKU for this specific variant (color + size combination)",
    }),
    defineField({
      name: "quantity",
      title: "Quantity",
      type: "number",
      validation: (Rule) => Rule.required().min(1).integer(),
      initialValue: 1,
      description: "Number of items",
    }),
    defineField({
      name: "priceSnapshot",
      title: "Price at Add Time",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      description: "Price when item was added to cart (for analytics only - NOT used for checkout)",
    }),
  ],
  preview: {
    select: {
      productName: "product.name",
      quantity: "quantity",
      sku: "variantSku",
      price: "priceSnapshot",
    },
    prepare({ productName, quantity, sku, price }) {
      return {
        title: `${productName || "Unknown Product"} (${sku})`,
        subtitle: `Qty: ${quantity} × $${price?.toFixed(2) || "0.00"}`,
      };
    },
  },
});
