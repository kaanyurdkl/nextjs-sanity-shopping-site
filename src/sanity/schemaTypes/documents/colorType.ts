import { ColorWheelIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Color schema for product variant management
 *
 * Fields:
 * - name: Color display name (e.g., "Navy Blue", "Forest Green")
 * - code: 3-letter code for SKU generation (e.g., "NAV", "RED")
 * - hexCode: Hex color code for swatches
 */
export const colorType = defineType({
  name: "color",
  title: "Color",
  type: "document",
  icon: ColorWheelIcon,
  fields: [
    defineField({
      name: "name",
      title: "Color Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description:
        "Display name shown to customers (e.g., 'Navy Blue', 'Forest Green')",
    }),
    defineField({
      name: "code",
      title: "Color Code",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .length(3)
          .uppercase()
          .regex(/^[A-Z]{3}$/, {
            name: "uppercase letters only",
            invert: false,
          })
          .custom(async (value, context) => {
            if (!value) return true; // Skip if no value (required validation will handle this)
            
            const { document, getClient } = context;
            const client = getClient({ apiVersion: '2025-01-14' });
            
            // Get both draft and published document IDs to exclude
            const currentId = document?._id;
            const publishedId = currentId?.replace(/^drafts\./, '');
            const draftId = currentId?.startsWith('drafts.') ? currentId : `drafts.${currentId}`;
            
            // Check for existing documents with the same code (excluding current document)
            const query = `*[_type == "color" && code == $code && _id != $publishedId && _id != $draftId]`;
            const params = { 
              code: value, 
              publishedId: publishedId || '',
              draftId: draftId || ''
            };
            
            const existing = await client.fetch(query, params);
            
            if (existing.length > 0) {
              return 'Color code must be unique. This code is already used.';
            }
            
            return true;
          }),
      description:
        "3-letter uppercase code for SKU generation (e.g., 'NAV', 'RED', 'BLK')",
    }),
    defineField({
      name: "hexCode",
      title: "Hex Color Code",
      type: "string",
      validation: (Rule) => Rule.required(),
      description:
        "Hex code for color swatches (e.g., #FF0000 for red) - optional",
    }),
  ],
  preview: {
    select: {
      title: "name",
      code: "code",
      hexCode: "hexCode",
    },
    prepare(selection) {
      const { title, code, hexCode } = selection;

      return {
        title,
        subtitle: `${code} • ${hexCode}`,
        media: ColorWheelIcon,
      };
    },
  },
});
