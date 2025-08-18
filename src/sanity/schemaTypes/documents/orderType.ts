import { defineField, defineType } from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    // Order Identification
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      description: 'CLO-2025-XXXXXX format',
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
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
    }),

    // Customer Information
    defineField({
      name: 'userId',
      title: 'User Account',
      type: 'reference',
      to: [{ type: 'user' }],
      description: 'For logged-in users (optional for guest checkout)',
    }),
    defineField({
      name: 'guestEmail',
      title: 'Guest Email',
      type: 'string',
      description: 'For guest checkout orders',
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
    }),

    // Order Items
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
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

    // Financial Details
    defineField({
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      description: 'Sum of all item prices before discounts',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'totalDiscount',
      title: 'Total Discount',
      type: 'number',
      description: 'Total amount saved from promotions',
      validation: (rule) => rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'promoCodeDiscount',
      title: 'Promo Code Discount',
      type: 'number',
      description: 'Discount from promo code',
      validation: (rule) => rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'promoCode',
      title: 'Promo Code Used',
      type: 'string',
      description: 'Promo code applied to order',
    }),
    defineField({
      name: 'shippingCost',
      title: 'Shipping Cost',
      type: 'number',
      description: 'Shipping fee (free if subtotal ≥ $150)',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'taxAmount',
      title: 'Tax Amount',
      type: 'number',
      description: 'Provincial tax calculated',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'taxRate',
      title: 'Tax Rate',
      type: 'number',
      description: 'Applied tax rate (for record keeping)',
      validation: (rule) => rule.min(0).max(1),
    }),
    defineField({
      name: 'grandTotal',
      title: 'Grand Total',
      type: 'number',
      description: 'Final amount charged',
      validation: (rule) => rule.required().min(0),
    }),

    // Shipping Information
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'address',
      description: 'Delivery address for this order',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'billingAddress',
      title: 'Billing Address',
      type: 'object',
      fields: [
        defineField({
          name: 'sameAsShipping',
          title: 'Same as Shipping',
          type: 'boolean',
          initialValue: true,
          description: 'Use shipping address for billing',
        }),
        defineField({
          name: 'address',
          title: 'Billing Address Details',
          type: 'address',
          description: 'Billing address (only used if different from shipping)',
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
    }),

    // Payment Information
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
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
          description: 'Stripe payment reference',
        }),
        defineField({
          name: 'lastFourDigits',
          title: 'Last Four Digits',
          type: 'string',
          description: 'Last 4 digits of payment method (for display)',
        }),
        defineField({
          name: 'brand',
          title: 'Card Brand',
          type: 'string',
          description: 'Visa, Mastercard, etc.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // Shipping Tracking
    defineField({
      name: 'shippingMethod',
      title: 'Shipping Method',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Shipping (5-7 business days)', value: 'standard' },
          { title: 'Express Shipping (2-3 business days)', value: 'express' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
      description: 'Carrier tracking number',
    }),
    defineField({
      name: 'carrier',
      title: 'Shipping Carrier',
      type: 'string',
      description: 'Canada Post, UPS, FedEx, etc.',
    }),
    defineField({
      name: 'estimatedDelivery',
      title: 'Estimated Delivery Date',
      type: 'date',
      description: 'Expected delivery date',
    }),

    // Order Notes and Communication
    defineField({
      name: 'orderNotes',
      title: 'Order Notes',
      type: 'text',
      description: 'Customer or admin notes',
    }),
    defineField({
      name: 'statusHistory',
      title: 'Status History',
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
              title: 'Timestamp',
              type: 'datetime',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'note',
              title: 'Note',
              type: 'string',
              description: 'Optional status change note',
            }),
          ],
        },
      ],
      description: 'Track all status changes',
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