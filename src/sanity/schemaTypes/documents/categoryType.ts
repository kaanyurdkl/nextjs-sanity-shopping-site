import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Category schema for hierarchical product categorization
 *
 * Fields:
 * - title: Category display name
 * - slug: URL-friendly identifier
 * - description: Category description for SEO and display
 * - pageType: Whether this category shows as a product listing or landing page
 * - parent: Reference to parent category (creates hierarchy)
 * - seoTitle: Custom SEO page title
 * - seoDescription: Meta description for category pages
 * - isActive: Category visibility toggle
 */
export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Display name for this category",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
      description:
        "URL-friendly identifier. For hierarchical paths, type manually (e.g., mens/tops/shirts)",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Category description for SEO and category pages",
    }),
    defineField({
      name: "pageType",
      title: "Page Type",
      type: "string",
      options: {
        list: [
          { title: "Product Listing Page", value: "listing" },
          { title: "Landing Page", value: "landing" },
        ],
      },
      initialValue: "listing",
      validation: (Rule) => Rule.required(),
      description:
        "Choose whether this category shows as a product listing or landing page",
    }),
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      options: {
        filter: ({ document }) => {
          // Always exclude the current document, whether it's a draft or published
          const currentId = document._id;
          if (currentId) {
            // Extract the base ID (remove 'drafts.' prefix if it exists)
            const baseId = currentId.replace(/^drafts\./, "");

            return {
              filter: "_id != $id && _id != $draftId",
              params: {
                id: baseId,
                draftId: `drafts.${baseId}`,
              },
            };
          }

          // Fallback: if somehow no _id exists, show all categories
          return {
            filter: '_type == "category"',
          };
        },
      },
      description: "Parent category in the hierarchy",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description:
        "Title for search engines (leave empty to use category name)",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description: "Description for search engines and social media",
    }),
    defineField({
      name: "isActive",
      title: "Category Active",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to hide category from storefront",
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare(selection) {
      const { title, slug } = selection;

      return {
        title,
        subtitle: `/${slug}`,
      };
    },
  },
  // Custom ordering in Studio
  orderings: [
    {
      title: "Alphabetical",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
