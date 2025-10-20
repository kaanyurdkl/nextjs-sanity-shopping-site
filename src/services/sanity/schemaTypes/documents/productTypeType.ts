import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Product Type schema for defining sizing systems
 *
 * Fields:
 * - name: Product type name (e.g., "Standard Clothing", "Pants & Bottoms")
 * - description: Description of what products use this type
 * - sizeGroup: Which size group this product type uses (letter, waist, shoe_mens, etc.)
 * - isActive: Product type visibility toggle
 */
export const productTypeType = defineType({
  name: "productType",
  title: "Product Type",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Type Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description:
        "Name for this product type (e.g., 'Standard Clothing', 'Pants & Bottoms')",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
      description: "Describe what products use this type",
    }),
    defineField({
      name: "sizeGroup",
      title: "Size Group",
      type: "string",
      options: {
        list: [
          { title: "Letter Sizes (XS, S, M, L, XL, XXL)", value: "letter" },
          { title: "Waist Sizes (28, 30, 32, 34, 36, 38)", value: "waist" },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: "Select which size group this product type uses",
    }),
  ],
  preview: {
    select: {
      title: "name",
      sizeGroup: "sizeGroup",
    },
    prepare(selection) {
      const { title, sizeGroup } = selection;

      // Create size group display mapping
      const sizeGroupLabels: Record<string, string> = {
        letter: "Letter Sizes (XS-XXL)",
        waist: "Waist Sizes (28-38)",
      };

      const sizeGroupLabel = sizeGroupLabels[sizeGroup] || sizeGroup;

      return {
        title: `${title}`,
        subtitle: `${sizeGroupLabel}`,
      };
    },
  },
});
