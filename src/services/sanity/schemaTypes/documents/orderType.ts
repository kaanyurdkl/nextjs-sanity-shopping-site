import { defineField, defineType } from 'sanity'

/**
 * Order schema for comprehensive e-commerce order management
 *
 * Fields:
 * - orderNumber: Professional CLO-2025-XXXXXX format order numbering
 * - status: Current order status (confirmation, processing, shipped, delivered, etc.)
 * - userId: Reference to registered user (for logged-in customers)
 * - guestEmail: Email address for guest checkout orders
 * - items: Array of ordered products with variants, quantities, and pricing
 * - subtotal: Sum of all item prices before discounts
 * - totalDiscount: Total savings from automatic promotions
 * - promoCodeDiscount: Additional discount from promo codes
 * - promoCode: Applied promo code string
 * - shippingCost: Delivery fee (free if subtotal ≥ $150)
 * - taxAmount: Provincial tax calculated
 * - taxRate: Applied tax rate for calculation
 * - grandTotal: Final amount charged to customer
 * - shippingAddress: Delivery address using address schema
 * - billingAddress: Billing details with same-as-shipping option
 * - paymentMethod: Payment information and Stripe integration
 * - shippingMethod: Standard or express delivery
 * - trackingNumber: Carrier tracking reference
 * - carrier: Shipping provider (Canada Post, UPS, etc.)
 * - estimatedDelivery: Expected delivery date
 * - orderNotes: Customer requests or admin notes
 * - statusHistory: Complete audit trail of status changes
 */
export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fieldsets: [
    {
      name: 'identification',
      title: 'Order Identification',
      description: 'Order number and current status',
      options: { collapsible: false }
    },
    {
      name: 'customer',
      title: 'Customer Information',
      description: 'Who placed this order?',
      options: { collapsible: false }
    },
    {
      name: 'items',
      title: 'Order Items',
      description: 'Products and quantities ordered',
      options: { collapsible: false }
    },
    {
      name: 'pricing',
      title: 'Pricing & Totals',
      description: 'Financial breakdown of the order',
      options: { collapsible: false }
    },
    {
      name: 'addresses',
      title: 'Shipping & Billing',
      description: 'Delivery and billing addresses',
      options: { collapsible: false }
    },
    {
      name: 'payment',
      title: 'Payment Details',
      description: 'Payment method and transaction info',
      options: { collapsible: false }
    },
    {
      name: 'fulfillment',
      title: 'Fulfillment & Shipping',
      description: 'Shipping method and tracking information',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'management',
      title: 'Order Management',
      description: 'Notes and status tracking',
      options: { collapsible: true, collapsed: true }
    }
  ],
  fields: [
    // === ORDER IDENTIFICATION ===
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      description: 'CLO-2025-XXXXXX format',
      validation: (rule) => rule.required(),
      readOnly: true,
      fieldset: 'identification',
    }),
    defineField({
      name: 'status',
      title: 'Current Status',
      type: 'string',
      options: {
        list: [
          { title: 'Order Confirmation', value: 'confirmation' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'In Transit', value: 'in_transit' },
          { title: 'Out for Delivery', value: 'out_for_delivery' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Delayed/Exception', value: 'delayed' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'confirmation',
      validation: (rule) => rule.required(),
      fieldset: 'identification',
    }),

    // === CUSTOMER INFORMATION ===
    defineField({
      name: 'userId',
      title: 'Registered User',
      type: 'reference',
      to: [{ type: 'user' }],
      description: 'For logged-in users (leave empty for guest checkout)',
      fieldset: 'customer',
    }),
    defineField({
      name: 'guestEmail',
      title: 'Guest Email',
      type: 'string',
      description: 'Required for guest checkout orders',
      validation: (rule) => 
        rule.custom((guestEmail, context) => {
          const userId = (context.document as { userId?: string })?.userId
          if (!userId && !guestEmail) {
            return 'Either user account or guest email is required'
          }
          if (guestEmail && !guestEmail.includes('@')) {
            return 'Please enter a valid email address'
          }
          return true
        }),
      fieldset: 'customer',
    }),

    // === ORDER ITEMS ===
    defineField({
      name: 'items',
      title: 'Products Ordered',
      type: 'array',
      fieldset: 'items',
      of: [
        {
          type: 'object',
          name: 'orderItem',
          title: 'Order Item',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'variant',
              title: 'Product Variant',
              type: 'object',
              fields: [
                defineField({
                  name: 'size',
                  title: 'Size',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'color',
                  title: 'Color',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'sku',
                  title: 'SKU',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
              ],
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: 'basePrice',
              title: 'Base Price',
              type: 'number',
              description: 'Original price per item',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'finalPrice',
              title: 'Final Price',
              type: 'number',
              description: 'Price per item after promotions',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'appliedPromotions',
              title: 'Applied Promotions',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'promotion' }] }],
              description: 'Promotions applied to this line item',
            }),
          ],
          preview: {
            select: {
              productName: 'product.name',
              size: 'variant.size',
              color: 'variant.color',
              quantity: 'quantity',
              finalPrice: 'finalPrice',
            },
            prepare({ productName, size, color, quantity, finalPrice }) {
              return {
                title: `${productName} (${size}, ${color})`,
                subtitle: `Qty: ${quantity} × $${finalPrice?.toFixed(2)}`,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),

    // === PRICING & TOTALS ===
    defineField({
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      description: 'Sum of all item prices before discounts',
      validation: (rule) => rule.required().min(0),
      fieldset: 'pricing',
    }),
    defineField({
      name: 'totalDiscount',
      title: 'Promotion Discount',
      type: 'number',
      description: 'Total amount saved from promotions',
      validation: (rule) => rule.min(0),
      initialValue: 0,
      fieldset: 'pricing',
    }),
    defineField({
      name: 'promoCodeDiscount',
      title: 'Promo Code Discount',
      type: 'number',
      description: 'Additional discount from promo code',
      validation: (rule) => rule.min(0),
      initialValue: 0,
      fieldset: 'pricing',
    }),
    defineField({
      name: 'promoCode',
      title: 'Applied Promo Code',
      type: 'string',
      description: 'Promo code used for additional discount',
      fieldset: 'pricing',
    }),
    defineField({
      name: 'shippingCost',
      title: 'Shipping Fee',
      type: 'number',
      description: 'Delivery cost (free if subtotal ≥ $150)',
      validation: (rule) => rule.required().min(0),
      fieldset: 'pricing',
    }),
    defineField({
      name: 'taxAmount',
      title: 'Tax Amount',
      type: 'number',
      description: 'Provincial tax calculated',
      validation: (rule) => rule.required().min(0),
      fieldset: 'pricing',
    }),
    defineField({
      name: 'taxRate',
      title: 'Applied Tax Rate',
      type: 'number',
      description: 'Tax rate used for calculation (decimal)',
      validation: (rule) => rule.min(0).max(1),
      fieldset: 'pricing',
    }),
    defineField({
      name: 'grandTotal',
      title: 'Final Total',
      type: 'number',
      description: 'Total amount charged to customer',
      validation: (rule) => rule.required().min(0),
      fieldset: 'pricing',
    }),

    // === SHIPPING & BILLING ===
    defineField({
      name: 'shippingAddress',
      title: 'Delivery Address',
      type: 'address',
      description: 'Where to ship this order',
      validation: (rule) => rule.required(),
      fieldset: 'addresses',
    }),
    defineField({
      name: 'billingAddress',
      title: 'Billing Details',
      type: 'object',
      fields: [
        defineField({
          name: 'sameAsShipping',
          title: 'Same as Delivery Address',
          type: 'boolean',
          initialValue: true,
          description: 'Use delivery address for billing',
        }),
        defineField({
          name: 'address',
          title: 'Different Billing Address',
          type: 'address',
          description: 'Enter billing address if different from delivery',
          hidden: ({ parent }) => parent?.sameAsShipping !== false,
          validation: (rule) => 
            rule.custom((address, context) => {
              const sameAsShipping = (context.parent as { sameAsShipping?: boolean })?.sameAsShipping
              if (sameAsShipping === false && !address) {
                return 'Billing address is required when different from shipping'
              }
              return true
            }),
        }),
      ],
      fieldset: 'addresses',
    }),

    // === PAYMENT DETAILS ===
    defineField({
      name: 'paymentMethod',
      title: 'Payment Information',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Payment Type',
          type: 'string',
          options: {
            list: [
              { title: 'Credit Card', value: 'credit_card' },
              { title: 'PayPal', value: 'paypal' },
            ],
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'stripePaymentIntentId',
          title: 'Stripe Payment Intent ID',
          type: 'string',
          description: 'Stripe transaction reference',
        }),
        defineField({
          name: 'lastFourDigits',
          title: 'Card Last Four Digits',
          type: 'string',
          description: 'Last 4 digits for customer reference',
        }),
        defineField({
          name: 'brand',
          title: 'Card Brand',
          type: 'string',
          description: 'Visa, Mastercard, Amex, etc.',
        }),
      ],
      validation: (rule) => rule.required(),
      fieldset: 'payment',
    }),

    // === FULFILLMENT & SHIPPING ===
    defineField({
      name: 'shippingMethod',
      title: 'Delivery Speed',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Shipping (5-7 business days)', value: 'standard' },
          { title: 'Express Shipping (2-3 business days)', value: 'express' },
        ],
      },
      validation: (rule) => rule.required(),
      fieldset: 'fulfillment',
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
      description: 'Carrier-provided tracking reference',
      fieldset: 'fulfillment',
    }),
    defineField({
      name: 'carrier',
      title: 'Shipping Carrier',
      type: 'string',
      description: 'Canada Post, UPS, FedEx, etc.',
      fieldset: 'fulfillment',
    }),
    defineField({
      name: 'estimatedDelivery',
      title: 'Expected Delivery',
      type: 'date',
      description: 'Estimated delivery date',
      fieldset: 'fulfillment',
    }),

    // === ORDER MANAGEMENT ===
    defineField({
      name: 'orderNotes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Customer requests or admin notes',
      fieldset: 'management',
    }),
    defineField({
      name: 'statusHistory',
      title: 'Status Change Log',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'timestamp',
              title: 'Changed At',
              type: 'datetime',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'note',
              title: 'Change Note',
              type: 'string',
              description: 'Reason for status change',
            }),
          ],
        },
      ],
      description: 'Complete audit trail of order status changes',
      fieldset: 'management',
    }),

  ],

  preview: {
    select: {
      orderNumber: 'orderNumber',
      status: 'status',
      grandTotal: 'grandTotal',
      createdAt: '_createdAt',
      customerName: 'shippingAddress.firstName',
      guestEmail: 'guestEmail',
    },
    prepare({ orderNumber, status, grandTotal, createdAt, customerName, guestEmail }) {
      const orderDate = createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown'
      const customer = customerName || guestEmail || 'Guest'
      const statusColors: Record<string, string> = {
        confirmation: '🟡',
        processing: '🔵',
        shipped: '🟢',
        delivered: '✅',
        cancelled: '❌',
        refunded: '🔄',
      }
      
      return {
        title: `${orderNumber} - ${customer}`,
        subtitle: `${statusColors[status] || '⚪'} ${status.toUpperCase()} • $${grandTotal?.toFixed(2)} • ${orderDate}`,
      }
    },
  },
})