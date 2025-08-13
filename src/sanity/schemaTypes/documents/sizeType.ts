import { ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Size schema for product variant management
 *
 * Fields:
 * - name: Size group name (e.g., "Letter Sizes", "Waist Sizes")
 * - sizes: Array of size objects with name and code for SKU generation
 */
export const sizeType = defineType({
  name: "size",
  title: "Size",
  type: "document",
  icon: ComposeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Size Group Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Name for this size group (e.g., 'Letter Sizes', 'Waist Sizes')",
    }),
    defineField({
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      of: [
        {
          type: "object",
          name: "sizeItem",
          title: "Size",
          fields: [
            {
              name: "name",
              title: "Size Name",
              type: "string",
              validation: (Rule) => Rule.required(),
              description: "Display name shown to customers (e.g., 'Medium', '32 Waist')",
            },
            {
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
            },
          ],
          preview: {
            select: {
              name: "name",
              code: "code",
            },
            prepare(selection) {
              const { name, code } = selection;
              return {
                title: name,
                subtitle: `Code: ${code}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      description: "List of sizes with display names and SKU codes",
    }),
  ],
  preview: {
    select: {
      title: "name",
      sizes: "sizes",
    },
    prepare(selection) {
      const { title, sizes } = selection;
      const sizeCount = sizes?.length || 0;
      
      // Extract size names from the object array
      const sizeNames = sizes?.map((sizeItem: any) => sizeItem.name) || [];
      const sizeList = sizeNames.slice(0, 3).join(", ") || "";
      const moreText = sizeNames.length > 3 ? "..." : "";
      
      return {
        title,
        subtitle: `${sizeCount} sizes: ${sizeList}${moreText}`,
        media: ComposeIcon,
      };
    },
  },
});
