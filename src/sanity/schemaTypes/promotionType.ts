import { defineField, defineType } from 'sanity'

export const promotionType = defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  fields: [
    // Basic Information
    defineField({
      name: 'name',
      title: 'Promotion Name',
      type: 'string',
      description: 'Internal name for this promotion',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Internal description of this promotion',
    }),

    // Promotion Type and Configuration
    defineField({
      name: 'type',
      title: 'Promotion Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage Discount', value: 'percentage' },
          { title: 'Bundle Pricing', value: 'bundle' },
          { title: 'Buy One Get One (BOGO)', value: 'bogo' },
          { title: 'Tiered Discount', value: 'tiered' },
          { title: 'Spend Threshold', value: 'threshold' },
          { title: 'Fixed Amount Off', value: 'fixed_amount' },
        ],
      },
      validation: (rule) => rule.required(),
    }),

    // Admin-Controlled Display Tags
    defineField({
      name: 'tagLabel',
      title: 'Tag Label',
      type: 'string',
      description: 'Custom text displayed on product tags (e.g., "2 FOR $95", "25% OFF")',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'tagBackgroundColor',
      title: 'Tag Background Color',
      type: 'string',
      description: 'Hex color code for tag background',
      validation: (rule) => 
        rule.required().custom((color) => {
          if (!color) return 'Background color is required'
          const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
          return hexRegex.test(color) || 'Please enter a valid hex color (e.g., #FF0000)'
        }),
      initialValue: '#000000',
    }),
    defineField({
      name: 'tagTextColor',
      title: 'Tag Text Color',
      type: 'string',
      description: 'Hex color code for tag text',
      validation: (rule) => 
        rule.required().custom((color) => {
          if (!color) return 'Text color is required'
          const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
          return hexRegex.test(color) || 'Please enter a valid hex color (e.g., #FFFFFF)'
        }),
      initialValue: '#FFFFFF',
    }),
    defineField({
      name: 'showTag',
      title: 'Show Tag on Products',
      type: 'boolean',
      description: 'Whether to display the promotion tag on products',
      initialValue: true,
    }),

    // Targeting and Scope
    defineField({
      name: 'gender',
      title: 'Gender Category',
      type: 'string',
      options: {
        list: [
          { title: "Men's", value: 'mens' },
          { title: "Women's", value: 'womens' },
          { title: 'Both', value: 'both' },
        ],
      },
      description: 'Which gender category this promotion applies to',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'applicableProducts',
      title: 'Applicable Products',
      type: 'array',
      of: [{ 
        type: 'reference', 
        to: [{ type: 'product' }],
        options: {
          filter: ({ document }) => {
            const selectedGender = document?.gender
            if (!selectedGender || selectedGender === 'both') {
              return {} // Show all products
            }
            return {
              filter: 'category == $gender',
              params: { gender: selectedGender }
            }
          }
        }
      }],
      description: 'Products this promotion applies to (filtered by selected gender category)',
    }),
    defineField({
      name: 'applicableCategories',
      title: 'Applicable Categories',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'Shirts & Tops', value: 'shirts' },
              { title: 'Pants & Bottoms', value: 'pants' },
              { title: 'Outerwear', value: 'outerwear' },
            ],
          },
        },
      ],
      description: 'Product categories this promotion applies to',
    }),

    // Discount Configuration
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number',
      description: 'Percentage (0-100) or fixed amount depending on type',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'minimumQuantity',
      title: 'Minimum Quantity',
      type: 'number',
      description: 'Minimum items required to trigger promotion',
      validation: (rule) => rule.min(1),
      initialValue: 1,
    }),
    defineField({
      name: 'maximumDiscount',
      title: 'Maximum Discount Amount',
      type: 'number',
      description: 'Cap on discount amount (optional)',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'freeShipping',
      title: 'Includes Free Shipping',
      type: 'boolean',
      description: 'Whether this promotion includes free shipping',
      initialValue: false,
    }),

    // Bundle and Tiered Configuration
    defineField({
      name: 'bundleConfiguration',
      title: 'Bundle Configuration',
      type: 'object',
      fields: [
        defineField({
          name: 'buyQuantity',
          title: 'Buy Quantity',
          type: 'number',
          description: 'Number of items to buy',
          validation: (rule) => rule.min(1),
        }),
        defineField({
          name: 'getQuantity',
          title: 'Get Quantity',
          type: 'number',
          description: 'Number of items customer gets',
          validation: (rule) => rule.min(1),
        }),
        defineField({
          name: 'bundlePrice',
          title: 'Bundle Price',
          type: 'number',
          description: 'Fixed price for the bundle',
          validation: (rule) => rule.min(0),
        }),
      ],
      hidden: ({ document }) => !['bundle', 'bogo'].includes(document?.type as string),
    }),
    defineField({
      name: 'tieredDiscounts',
      title: 'Tiered Discount Rules',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'minimumQuantity',
              title: 'Minimum Quantity',
              type: 'number',
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: 'discountPercentage',
              title: 'Discount Percentage',
              type: 'number',
              validation: (rule) => rule.required().min(0).max(100),
            }),
          ],
          preview: {
            select: {
              minQty: 'minimumQuantity',
              discount: 'discountPercentage',
            },
            prepare({ minQty, discount }) {
              return {
                title: `${minQty}+ items: ${discount}% off`,
              }
            },
          },
        },
      ],
      hidden: ({ document }) => document?.type !== 'tiered',
    }),

    // Threshold Configuration
    defineField({
      name: 'spendThreshold',
      title: 'Minimum Spend Amount',
      type: 'number',
      description: 'Minimum cart value to trigger promotion',
      validation: (rule) => rule.min(0),
      hidden: ({ document }) => document?.type !== 'threshold',
    }),

    // Priority and Conflicts
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: 'Higher numbers take precedence (1-100)',
      validation: (rule) => rule.required().min(1).max(100),
      initialValue: 50,
    }),
    defineField({
      name: 'stackable',
      title: 'Stackable with Other Promotions',
      type: 'boolean',
      description: 'Can this promotion be combined with others?',
      initialValue: false,
    }),
    defineField({
      name: 'exclusiveWith',
      title: 'Exclusive With',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'promotion' }] }],
      description: 'Promotions this cannot be combined with',
    }),

    // Promo Code Integration
    defineField({
      name: 'requiresPromoCode',
      title: 'Requires Promo Code',
      type: 'boolean',
      description: 'Whether customers need to enter a code',
      initialValue: false,
    }),
    defineField({
      name: 'promoCode',
      title: 'Promo Code',
      type: 'string',
      description: 'Code customers must enter',
      validation: (rule) => 
        rule.custom((code, context) => {
          const requiresCode = (context.document as { requiresPromoCode?: boolean })?.requiresPromoCode
          if (requiresCode && !code) {
            return 'Promo code is required when "Requires Promo Code" is enabled'
          }
          if (code && code.length < 3) {
            return 'Promo code must be at least 3 characters'
          }
          return true
        }),
      hidden: ({ document }) => !document?.requiresPromoCode,
    }),
    defineField({
      name: 'codeUsageLimit',
      title: 'Code Usage Limit',
      type: 'number',
      description: 'Maximum number of times this code can be used',
      validation: (rule) => rule.min(1),
      hidden: ({ document }) => !document?.requiresPromoCode,
    }),
    defineField({
      name: 'codeUsageCount',
      title: 'Current Usage Count',
      type: 'number',
      description: 'How many times this code has been used',
      initialValue: 0,
      readOnly: true,
      hidden: ({ document }) => !document?.requiresPromoCode,
    }),

    // Status and Scheduling
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this promotion is currently active',
      initialValue: true,
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description: 'When this promotion becomes active',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'When this promotion expires',
      validation: (rule) => 
        rule.custom((endDate, context) => {
          const startDate = (context.document as { startDate?: string })?.startDate
          if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
            return 'End date must be after start date'
          }
          return true
        }),
    }),

    // Analytics and Tracking
    defineField({
      name: 'usageCount',
      title: 'Total Usage Count',
      type: 'number',
      description: 'How many times this promotion has been used',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'totalSavings',
      title: 'Total Savings Generated',
      type: 'number',
      description: 'Total amount saved by customers using this promotion',
      initialValue: 0,
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      name: 'name',
      tagLabel: 'tagLabel', 
      type: 'type',
      isActive: 'isActive',
      startDate: 'startDate',
      endDate: 'endDate',
      gender: 'gender',
    },
    prepare({ name, tagLabel, type, isActive, startDate, endDate, gender }) {
      const now = new Date()
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null
      
      let status = '⚪'
      if (!isActive) {
        status = '❌'
      } else if (start && start > now) {
        status = '🟡' // Scheduled
      } else if (end && end < now) {
        status = '🔴' // Expired
      } else {
        status = '🟢' // Active
      }

      const typeEmojis: Record<string, string> = {
        percentage: '📊',
        bundle: '📦',
        bogo: '🎁',
        tiered: '📈',
        threshold: '💰',
        fixed_amount: '💵',
      }

      return {
        title: `${name} (${tagLabel})`,
        subtitle: `${status} ${typeEmojis[type] || '🏷️'} ${type.toUpperCase()} • ${gender}`,
      }
    },
  },
})