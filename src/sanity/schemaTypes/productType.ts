import { PackageIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

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
      type: "string",
      options: {
        list: [
          { title: "Men's Collection", value: "mens" },
          { title: "Women's Collection", value: "womens" },
        ],
      },
      validation: (Rule) => Rule.required(),
      description:
        "Product category for gender-specific organization and promotions",
    }),
    defineField({
      name: "productType",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Shirts & Tops", value: "shirts" },
          { title: "Pants & Bottoms", value: "pants" },
          { title: "Outerwear", value: "outerwear" },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: "Product type determines available size options",
    }),
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "string",
      validation: (Rule) => Rule.required(),
      description:
        "Subcategory (e.g., dress-shirts, casual-shirts, trousers, jeans, etc.)",
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
              options: {
                list: (context: any) => {
                  const productType = context.document?.productType;

                  // Pants use numeric waist sizes
                  if (productType === "pants") {
                    return [
                      { title: "28", value: "28" },
                      { title: "30", value: "30" },
                      { title: "32", value: "32" },
                      { title: "34", value: "34" },
                      { title: "36", value: "36" },
                      { title: "38", value: "38" },
                      { title: "40", value: "40" },
                    ];
                  }

                  // Shirts and Outerwear use letter sizes
                  return [
                    { title: "Extra Small", value: "XS" },
                    { title: "Small", value: "S" },
                    { title: "Medium", value: "M" },
                    { title: "Large", value: "L" },
                    { title: "Extra Large", value: "XL" },
                    { title: "XXL", value: "XXL" },
                  ];
                },
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "color",
              title: "Color",
              type: "string",
              validation: (Rule) => Rule.required(),
              description:
                "Must match one of the colors defined in the Available Colors field",
            },
            {
              name: "sku",
              title: "Variant SKU",
              type: "string",
              description:
                "Auto-generated unique SKU for this specific size/color combination",
              initialValue: (doc, context) => {
                // Auto-generate SKU based on product name, color, and size
                // Access the current variant being created
                const currentVariant = context.parent;
                const productDoc = context.document;

                const productName = productDoc?.name || "PROD";
                const color = currentVariant?.color || "CLR";
                const size = currentVariant?.size || "SIZE";

                // Create SKU: First 3 letters of product + color + size
                const productCode = productName.substring(0, 3).toUpperCase();
                const colorCode = color.substring(0, 3).toUpperCase();
                const sizeCode = size.toUpperCase();

                return `${productCode}-${colorCode}-${sizeCode}`;
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
              color: "color",
              stock: "stockQuantity",
              active: "isActive",
            },
            prepare(selection) {
              const { size, color, stock, active } = selection;
              const status = active
                ? stock > 0
                  ? "✅"
                  : "❌ Out of Stock"
                : "🚫 Inactive";
              return {
                title: `${color} - ${size}`,
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
      name: "reviews",
      title: "Customer Reviews",
      type: "array",
      of: [{ type: "reference", to: [{ type: "review" }] }],
      description:
        "Customer reviews - average rating and count calculated dynamically from this array",
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
      category: "category",
      productType: "productType",
      media: "thumbnail",
      price: "basePrice",
    },
    prepare(selection) {
      const { title, category, productType, media, price } = selection;
      const categoryDisplay =
        category === "mens" ? "Men's" : category === "womens" ? "Women's" : "";
      const typeDisplay =
        productType === "shirts"
          ? "Shirts"
          : productType === "pants"
            ? "Pants"
            : productType === "outerwear"
              ? "Outerwear"
              : "";
      return {
        title,
        subtitle: `${categoryDisplay} ${typeDisplay} • $${price}`,
        media,
      };
    },
  },
});
