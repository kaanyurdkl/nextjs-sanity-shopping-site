import {PackageIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

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
 * - variants: Size/color combinations with individual stock
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
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        }
      ],
      validation: Rule => Rule.required(),
      description: 'Main product image for listing pages and product cards'
    }),
    defineField({
      name: 'hoverImage',
      title: 'Hover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        }
      ],
      description: 'Secondary image shown on hover in product listings (optional)'
    }),
    defineField({
      name: 'images',
      title: 'Additional Product Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility',
            }
          ]
        }),
      ],
    }),
    defineField({
      name: 'basePrice',
      title: 'Base Price',
      type: 'number',
      description: 'Base product price - promotions applied dynamically',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: "Men's Collection", value: 'mens'},
          {title: "Women's Collection", value: 'womens'},
        ]
      },
      validation: Rule => Rule.required(),
      description: 'Product category for gender-specific organization and promotions'
    }),
    defineField({
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'variant',
          title: 'Variant',
          fields: [
            {
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  {title: 'Extra Small', value: 'XS'},
                  {title: 'Small', value: 'S'},
                  {title: 'Medium', value: 'M'},
                  {title: 'Large', value: 'L'},
                  {title: 'Extra Large', value: 'XL'},
                  {title: 'XXL', value: 'XXL'},
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'color',
              title: 'Color',
              type: 'string',
              validation: Rule => Rule.required(),
              description: 'Must match one of the colors defined in the Available Colors field'
            },
            {
              name: 'sku',
              title: 'Variant SKU',
              type: 'string',
              description: 'Unique SKU for this specific size/color combination',
              validation: Rule => Rule.required()
            },
            {
              name: 'stockQuantity',
              title: 'Stock Quantity',
              type: 'number',
              validation: Rule => Rule.required().min(0),
              description: 'Available inventory for this specific variant'
            },
            {
              name: 'isActive',
              title: 'Variant Active',
              type: 'boolean',
              initialValue: true,
              description: 'Uncheck to disable this specific variant'
            }
          ],
          preview: {
            select: {
              size: 'size',
              color: 'color',
              stock: 'stockQuantity',
              active: 'isActive'
            },
            prepare(selection) {
              const {size, color, stock, active} = selection
              const status = active ? (stock > 0 ? '✅' : '❌ Out of Stock') : '🚫 Inactive'
              return {
                title: `${color} - ${size}`,
                subtitle: `Stock: ${stock} ${status}`
              }
            }
          }
        })
      ],
      description: 'Define specific combinations of size/color with individual inventory tracking'
    }),
    defineField({
      name: 'isActive',
      title: 'Product Active',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to hide product from storefront'
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
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
      description: 'Check to feature this product on homepage'
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for search engines (leave empty to use product name)',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Description for search engines and social media',
    }),
    defineField({
      name: 'reviews',
      title: 'Customer Reviews',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'review'}]}],
      description: 'Customer reviews - average rating and count calculated dynamically from this array'
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Key Features',
      type: 'blockContent',
      description: 'Key product features and highlights for the KEY FEATURES tab'
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'blockContent',
      description: 'Material composition and fabric details for the MATERIALS tab'
    }),
    defineField({
      name: 'sizeAndFit',
      title: 'Size & Fit',
      type: 'blockContent',
      description: 'Sizing information and fit details for the SIZE & FIT tab'
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'blockContent',
      description: 'Washing and care instructions for the CARE INSTRUCTIONS tab'
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      validation: Rule => Rule.max(8),
      description: 'Related/recommended products to display in the "RELATED PRODUCTS" section'
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'thumbnail',
      price: 'basePrice'
    },
    prepare(selection) {
      const {title, subtitle, media, price} = selection
      const categoryDisplay = subtitle === 'mens' ? "Men's" : subtitle === 'womens' ? "Women's" : ''
      return {
        title,
        subtitle: `${categoryDisplay} • $${price}`,
        media,
      }
    },
  },
})