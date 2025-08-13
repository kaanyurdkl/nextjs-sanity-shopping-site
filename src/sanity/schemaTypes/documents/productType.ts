import { PackageIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { DynamicSizeInput } from "../../components/DynamicSizeInput";
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
      name: "sizeGroup",
      title: "Size Group",
      type: "reference",
      to: [{ type: "size" }],
      validation: (Rule) => Rule.required(),
      description: "Select which size group this product uses",
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
              name: "size",
              title: "Size",
              type: "string",
              components: {
                input: DynamicSizeInput,
              },
              validation: (Rule) => Rule.required(),
              description: "Select size from the chosen size group",
            },
            {
              name: "color",
              title: "Color",
              type: "reference",
              to: [{ type: "color" }],
              validation: (Rule) => Rule.required(),
              description: "Select color from available options",
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
              size: "size",
              colorName: "color.name",
              stock: "stockQuantity",
              active: "isActive",
            },
            prepare(selection) {
              const { size, colorName, stock, active } = selection;
              const status = active
                ? stock > 0
                  ? "✅"
                  : "❌ Out of Stock"
                : "🚫 Inactive";
              return {
                title: `${colorName || "No Color"} - ${size}`,
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
    // TODO: Uncomment when promotionType schema is created
    // defineField({
    //   name: 'promotions',
    //   title: 'Active Promotions',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'reference',
    //       to: [{type: 'promotion'}]
    //     }
    //   ],
    //   description: 'Assign multiple promotions to this product for dynamic pricing'
    // }),
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
      primaryCategory: "primaryCategory.title",
      categoryParent: "primaryCategory.parent.title",
      categoryGrandparent: "primaryCategory.parent.parent.title",
      categoryGreatGrandparent: "primaryCategory.parent.parent.parent.title",
      media: "thumbnail",
      price: "basePrice",
      isActive: "isActive",
    },
    prepare(selection) {
      const {
        title,
        primaryCategory,
        categoryParent,
        categoryGrandparent,
        categoryGreatGrandparent,
        media,
        price,
        isActive,
      } = selection;

      // Build category breadcrumb
      const categoryPath = [
        categoryGreatGrandparent,
        categoryGrandparent,
        categoryParent,
        primaryCategory,
      ]
        .filter(Boolean)
        .join(" > ");

      const statusIcon = isActive ? "✅" : "🚫";

      return {
        title,
        subtitle: `${categoryPath || "Uncategorized"} • $${price} ${statusIcon}`,
        media,
      };
    },
  },
});
