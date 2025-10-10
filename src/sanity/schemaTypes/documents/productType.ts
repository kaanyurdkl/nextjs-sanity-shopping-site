import { PackageIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { ComputedSkuInput } from "../../components/ComputedSkuInput";

/**
 * Product schema for fashion e-commerce catalog
 *
 * Fields:
 * - name: Product display name
 * - slug: URL-friendly identifier
 * - description: Product details and description
 * - thumbnail: Main product image for listings
 * - hoverImage: Secondary image for hover effects
 * - images: Additional product gallery images
 * - basePrice: Base product price (before promotions)
 * - category: Men's or women's collection
 * - productType: Product category (shirts, pants, outerwear) - determines sizing options
 * - variants: Size/color combinations with individual stock (sizing varies by productType)
 * - isActive: Product visibility toggle
 * - isFeatured: Homepage featured product flag
 * - seoTitle: Custom SEO page title
 * - seoDescription: Meta description for search engines
 * - reviews: Customer review references
 * - keyFeatures: Product highlights and features
 * - materials: Fabric composition and details
 * - sizeAndFit: Sizing information and fit guide
 * - careInstructions: Washing and care guidelines
 * - relatedProducts: Recommended product references
 */
export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for SEO and accessibility",
        },
      ],
      validation: (Rule) => Rule.required(),
      description: "Main product image for listing pages and product cards",
    }),
    defineField({
      name: "hoverImage",
      title: "Hover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for SEO and accessibility",
        },
      ],
      description:
        "Secondary image shown on hover in product listings (optional)",
    }),
    defineField({
      name: "images",
      title: "Additional Product Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
              description: "Important for SEO and accessibility",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "basePrice",
      title: "Base Price",
      type: "number",
      description: "Base product price - promotions applied dynamically",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
      description:
        "Main category for URL structure and navigation - should be the most specific category",
    }),
    defineField({
      name: "categoryHierarchy",
      title: "Category Hierarchy",
      type: "array",
      of: [{ type: "string" }],
      readOnly: true,
      hidden: true,
      description:
        "Auto-computed array of parent category IDs - updated automatically when category changes",
    }),
    defineField({
      name: "productType",
      title: "Product Type",
      type: "reference",
      to: [{ type: "productType" }],
      validation: (Rule) => Rule.required(),
      description:
        "Select which product type this product belongs to (determines available sizes)",
    }),
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "variant",
          title: "Variant",
          fields: [
            {
              name: "color",
              title: "Color",
              type: "reference",
              to: [{ type: "color" }],
              validation: (Rule) => Rule.required(),
              description: "Select color from available options",
            },
            {
              name: "size",
              title: "Size",
              type: "reference",
              to: [{ type: "size" }],
              options: {
                filter: async ({ document, getClient }) => {
                  const productTypeId = document?.productType?._ref;

                  if (!productTypeId) {
                    return { filter: '_type == "size"' }; // Show all sizes if no product type selected
                  }

                  const client = getClient({ apiVersion: "2025-01-14" });

                  // Get the size group from selected product type
                  const productType = await client.fetch(
                    `*[_type == "productType" && _id == $id][0]{sizeGroup}`,
                    { id: productTypeId }
                  );

                  // Only show sizes that match the product type's size group
                  return {
                    filter: '_type == "size" && sizeGroup == $sizeGroup',
                    params: { sizeGroup: productType?.sizeGroup },
                  };
                },
              },
              validation: (Rule) => Rule.required(),
              description:
                "Select size from available options (filtered by product type)",
            },
            {
              name: "sku",
              title: "Variant SKU",
              type: "string",
              description:
                "Auto-generated SKU (format: PRODUCT-COLOR-SIZE-SEQUENCE)",
              components: {
                input: ComputedSkuInput,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "stockQuantity",
              title: "Stock Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
              description: "Available inventory for this specific variant",
            },
            {
              name: "isActive",
              title: "Variant Active",
              type: "boolean",
              initialValue: true,
              description: "Uncheck to disable this specific variant",
            },
          ],
          preview: {
            select: {
              sizeName: "size.name",
              colorName: "color.name",
              stock: "stockQuantity",
              active: "isActive",
            },
            prepare(selection) {
              const { sizeName, colorName, stock, active } = selection;
              const status = active
                ? stock > 0
                  ? "✅"
                  : "❌ Out of Stock"
                : "🚫 Inactive";
              return {
                title: `${colorName || "No Color"} - ${sizeName || "No Size"}`,
                subtitle: `Stock: ${stock} ${status}`,
              };
            },
          },
        }),
      ],
      description:
        "Define specific combinations of size/color with individual inventory tracking",
    }),
    defineField({
      name: "isActive",
      title: "Product Active",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to hide product from storefront",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
      description: "Check to feature this product on homepage",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Title for search engines (leave empty to use product name)",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description: "Description for search engines and social media",
    }),
    defineField({
      name: "keyFeatures",
      title: "Key Features",
      type: "blockContent",
      description:
        "Key product features and highlights for the KEY FEATURES tab",
    }),
    defineField({
      name: "materials",
      title: "Materials",
      type: "blockContent",
      description:
        "Material composition and fabric details for the MATERIALS tab",
    }),
    defineField({
      name: "sizeAndFit",
      title: "Size & Fit",
      type: "blockContent",
      description: "Sizing information and fit details for the SIZE & FIT tab",
    }),
    defineField({
      name: "careInstructions",
      title: "Care Instructions",
      type: "blockContent",
      description:
        "Washing and care instructions for the CARE INSTRUCTIONS tab",
    }),
    defineField({
      name: "relatedProducts",
      title: "Related Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (Rule) => Rule.max(8),
      description:
        'Related/recommended products to display in the "RELATED PRODUCTS" section',
    }),
  ],
  preview: {
    select: {
      title: "name",
      categorySlug: "category.slug.current",
      media: "thumbnail",
      price: "basePrice",
    },
    prepare(selection) {
      const { title, categorySlug, media, price } = selection;

      // Build full category path from slug
      let categoryPath = "Uncategorized";
      if (categorySlug) {
        categoryPath = categorySlug
          .split("/")
          .map((segment: string) =>
            segment
              .split("-")
              .map(
                (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(" ")
          )
          .join(" > ");
      }

      return {
        title: `${title} • $${price}`,
        subtitle: categoryPath,
        media,
      };
    },
  },
});
