import { ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Individual Size schema for product variant filtering
 *
 * Fields:
 * - name: Individual size name (e.g., "Medium", "Large", "32 Waist")
 * - code: Short code for SKU generation (e.g., "M", "L", "32")
 * - sizeGroup: Which sizing system this belongs to (letter, waist)
 * - sortOrder: For proper ordering (XS=1, S=2, M=3, L=4, XL=5)
 * - isActive: Enable/disable this size option
 */
export const sizeType = defineType({
  name: "size",
  title: "Size",
  type: "document",
  icon: ComposeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Size Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description:
        "Display name shown to customers (e.g., 'Medium', '32 Waist', 'Size 9')",
    }),
    defineField({
      name: "code",
      title: "Size Code",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .max(3)
          .uppercase()
          .regex(/^[A-Z0-9]{1,3}$/, {
            name: "uppercase letters and numbers only",
            invert: false,
          }),
      description: "1-3 char code for SKU generation (e.g., 'M', 'L', '32')",
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
      description: "Select which size group this size belongs to",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
      description: "For proper ordering (XS=1, S=2, M=3, L=4, XL=5, etc.)",
    }),
  ],
  preview: {
    select: {
      title: "name",
      code: "code",
      sizeGroup: "sizeGroup",
      sortOrder: "sortOrder",
    },
    prepare(selection) {
      const { title, code, sizeGroup, sortOrder } = selection;

      const sizeGroupLabels: Record<string, string> = {
        letter: "Letter",
        waist: "Waist",
      };

      const sizeGroupLabel = sizeGroupLabels[sizeGroup] || sizeGroup;

      return {
        title: `${title}`,
        subtitle: `${sizeGroupLabel} • Code: ${code} • Order: ${sortOrder}`,
        media: ComposeIcon,
      };
    },
  },
  orderings: [
    {
      title: "Size Group & Order",
      name: "sizeGroupAndOrder",
      by: [
        { field: "sizeGroup", direction: "asc" },
        { field: "sortOrder", direction: "asc" },
      ],
    },
    {
      title: "Alphabetical",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
