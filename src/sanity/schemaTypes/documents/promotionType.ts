// LIBRARIES
import { defineField, defineType } from "sanity";

// COMPONENTS
import TailwindColorPicker from "../../components/TailwindColorPicker";

// TYPES
import type { CustomStringOptions } from "../../types/components.types";

/**
 * Refactored Promotion schema with type-specific configurations
 * 
 * SHARED FIELDS (always visible):
 * - name: Internal promotion name
 * - description: Internal promotion description  
 * - type: Promotion type selection
 * 
 * TYPE-SPECIFIC CONFIGURATIONS (only one visible based on type):
 * - percentageConfig: For percentage discounts (25% off)
 * - fixedAmountConfig: For fixed amount discounts ($10 off)
 * - bundleConfig: For bundle pricing (2 for $50)
 * - bogoConfig: For buy-one-get-one deals (free or percentage discount)
 * - tieredConfig: For quantity-based discounts
 * - thresholdConfig: For spend-based discounts
 * 
 * SHARED SECTIONS (always available):
 * - Target Selection: gender, categories, products
 * - Visual Display: tag styling
 * - Advanced Options: priority, stacking
 * - Promo Code Settings: optional code requirements
 * - Schedule & Status: dates and activation
 */
export const promotionType = defineType({
  name: "promotion",
  title: "Promotion",
  type: "document",
  fields: [
    // === SHARED BASIC INFORMATION ===
    defineField({
      name: "name",
      title: "Promotion Name",
      type: "string",
      description: "Internal name for this promotion",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Internal description of this promotion",
    }),
    defineField({
      name: "type",
      title: "Promotion Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage Discount (25% off)", value: "percentage" },
          { title: "Fixed Amount Off ($10 off)", value: "fixed_amount" },
          { title: "Bundle Pricing (2 for $50)", value: "bundle" },
          { title: "Buy One Get One (BOGO - Free or Discounted)", value: "bogo" },
          { title: "Tiered Discount (Volume pricing)", value: "tiered" },
          { title: "Spend Threshold ($150+ for 15% off)", value: "threshold" },
        ],
      },
      validation: (rule) => rule.required(),
    }),

    // === TYPE-SPECIFIC CONFIGURATIONS ===
    
    // PERCENTAGE DISCOUNT CONFIG
    defineField({
      name: "percentageConfig",
      title: "Percentage Discount Configuration",
      type: "object",
      fields: [
        defineField({
          name: "discountPercentage",
          title: "Discount Percentage",
          type: "number",
          description: "Percentage off (0-100)",
          validation: (rule) => rule.required().min(0).max(100),
        }),
        defineField({
          name: "minimumQuantity",
          title: "Minimum Quantity",
          type: "number",
          description: "Minimum items required (optional)",
          validation: (rule) => rule.min(1),
          initialValue: 1,
        }),
        defineField({
          name: "maximumDiscount",
          title: "Maximum Discount Amount",
          type: "number",
          description: "Cap on total discount in dollars (optional)",
          validation: (rule) => rule.min(0),
        }),
      ],
      hidden: ({ document }) => document?.type !== "percentage",
    }),

    // FIXED AMOUNT CONFIG
    defineField({
      name: "fixedAmountConfig",
      title: "Fixed Amount Discount Configuration",
      type: "object",
      fields: [
        defineField({
          name: "discountAmount",
          title: "Discount Amount",
          type: "number",
          description: "Fixed dollar amount off",
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: "minimumPurchase",
          title: "Minimum Purchase Amount",
          type: "number",
          description: "Minimum cart value required (optional)",
          validation: (rule) => rule.min(0),
        }),
      ],
      hidden: ({ document }) => document?.type !== "fixed_amount",
    }),

    // BUNDLE PRICING CONFIG
    defineField({
      name: "bundleConfig",
      title: "Bundle Pricing Configuration",
      type: "object",
      fields: [
        defineField({
          name: "quantity",
          title: "Bundle Quantity",
          type: "number",
          description: "Number of items in bundle (e.g., 2 for '2 shirts for $50')",
          validation: (rule) => rule.required().min(2),
        }),
        defineField({
          name: "bundlePrice",
          title: "Bundle Price",
          type: "number",
          description: "Fixed price for the entire bundle",
          validation: (rule) => rule.required().min(0),
        }),
      ],
      hidden: ({ document }) => document?.type !== "bundle",
    }),

    // BOGO CONFIG
    defineField({
      name: "bogoConfig",
      title: "Buy One Get One Configuration",
      type: "object",
      fields: [
        defineField({
          name: "buyQuantity",
          title: "Buy Quantity",
          type: "number",
          description: "Number of items customer must buy",
          validation: (rule) => rule.required().min(1),
          initialValue: 1,
        }),
        defineField({
          name: "getQuantity",
          title: "Get Quantity",
          type: "number",
          description: "Number of additional items customer receives",
          validation: (rule) => rule.required().min(1),
          initialValue: 1,
        }),
        defineField({
          name: "discountType",
          title: "Discount Type",
          type: "string",
          options: {
            list: [
              { title: "Free (100% off)", value: "free" },
              { title: "Percentage Discount", value: "percentage" },
            ],
          },
          description: "Type of discount for additional items",
          validation: (rule) => rule.required(),
          initialValue: "free",
        }),
        defineField({
          name: "discountPercentage",
          title: "Discount Percentage",
          type: "number",
          description: "Percentage off for additional items (e.g., 50 for 50% off)",
          validation: (rule) => rule.required().min(0).max(100),
          initialValue: 50,
          hidden: ({ parent }) => parent?.discountType !== "percentage",
        }),
      ],
      hidden: ({ document }) => document?.type !== "bogo",
    }),

    // TIERED DISCOUNT CONFIG
    defineField({
      name: "tieredConfig",
      title: "Tiered Discount Configuration",
      type: "object",
      fields: [
        defineField({
          name: "tiers",
          title: "Discount Tiers",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "minimumQuantity",
                  title: "Minimum Quantity",
                  type: "number",
                  validation: (rule) => rule.required().min(1),
                }),
                defineField({
                  name: "discountPercentage",
                  title: "Discount Percentage",
                  type: "number",
                  validation: (rule) => rule.required().min(0).max(100),
                }),
              ],
              preview: {
                select: {
                  minQty: "minimumQuantity",
                  discount: "discountPercentage",
                },
                prepare({ minQty, discount }) {
                  return {
                    title: `${minQty}+ items: ${discount}% off`,
                  };
                },
              },
            },
          ],
          validation: (rule) => rule.required().min(1),
        }),
      ],
      hidden: ({ document }) => document?.type !== "tiered",
    }),

    // SPEND THRESHOLD CONFIG
    defineField({
      name: "thresholdConfig",
      title: "Spend Threshold Configuration",
      type: "object",
      fields: [
        defineField({
          name: "minimumSpend",
          title: "Minimum Spend Amount",
          type: "number",
          description: "Minimum cart value to trigger discount",
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: "discountType",
          title: "Discount Type",
          type: "string",
          options: {
            list: [
              { title: "Percentage Off", value: "percentage" },
              { title: "Fixed Amount Off", value: "fixed_amount" },
            ],
          },
          validation: (rule) => rule.required(),
          initialValue: "percentage",
        }),
        defineField({
          name: "discountValue",
          title: "Discount Value",
          type: "number",
          description: "Percentage (0-100) or fixed dollar amount",
          validation: (rule) => rule.required().min(0),
        }),
      ],
      hidden: ({ document }) => document?.type !== "threshold",
    }),

    // === SHARED TARGET SELECTION ===
    defineField({
      name: "gender",
      title: "Gender Category",
      type: "string",
      options: {
        list: [
          { title: "Men's", value: "mens" },
          { title: "Women's", value: "womens" },
          { title: "Both", value: "both" },
        ],
      },
      description: "Which gender category this promotion applies to",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "applicableCategories",
      title: "Applicable Categories",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "Shirts & Tops", value: "shirts" },
              { title: "Pants & Bottoms", value: "pants" },
              { title: "Outerwear", value: "outerwear" },
            ],
          },
        },
      ],
      description: "Product categories this promotion applies to (optional - leave empty to apply to all categories)",
    }),
    defineField({
      name: "applicableProducts",
      title: "Applicable Products",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
          options: {
            filter: ({ document }) => {
              const selectedGender = document?.gender;
              if (!selectedGender || selectedGender === "both") {
                return {}; // Show all products
              }
              return {
                filter: "category == $gender",
                params: { gender: selectedGender },
              };
            },
          },
        },
      ],
      description:
        "Specific products this promotion applies to (optional - leave empty to apply to all products in selected categories)",
    }),

    // === SHARED VISUAL DISPLAY ===
    defineField({
      name: "tagLabel",
      title: "Tag Label",
      type: "string",
      description:
        'Custom text displayed on product tags (e.g., "2 FOR $95", "25% OFF")',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: "tagBackgroundColor",
      title: "Tag Background Color",
      type: "string",
      description:
        "Select a Tailwind CSS background color for the promotion tag",
      options: {
        cssClassPrefix: "bg",
      } as CustomStringOptions,
      components: {
        input: TailwindColorPicker,
      },
      validation: (rule) => rule.required(),
      initialValue: "bg-zinc-950",
    }),
    defineField({
      name: "tagTextColor",
      title: "Tag Text Color",
      type: "string",
      description: "Select a Tailwind CSS text color for the promotion tag",
      options: {
        cssClassPrefix: "text",
      } as CustomStringOptions,
      components: {
        input: TailwindColorPicker,
      },
      validation: (rule) => rule.required(),
      initialValue: "text-zinc-50",
    }),
    defineField({
      name: "showTag",
      title: "Show Tag on Products",
      type: "boolean",
      description: "Whether to display the promotion tag on products",
      initialValue: true,
    }),

    // === SHARED ADVANCED OPTIONS ===
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      description: "Higher numbers take precedence when multiple promotions apply (1-100)",
      validation: (rule) => rule.required().min(1).max(100),
      initialValue: 50,
    }),
    defineField({
      name: "stackable",
      title: "Stackable with Other Promotions",
      type: "boolean",
      description: "Can this promotion be combined with others?",
      initialValue: false,
    }),
    defineField({
      name: "exclusiveWith",
      title: "Exclusive With",
      type: "array",
      of: [{ type: "reference", to: [{ type: "promotion" }] }],
      description: "Promotions this cannot be combined with",
    }),

    // === SHARED PROMO CODE SETTINGS ===
    defineField({
      name: "requiresPromoCode",
      title: "Requires Promo Code",
      type: "boolean",
      description: "Whether customers need to enter a code",
      initialValue: false,
    }),
    defineField({
      name: "promoCode",
      title: "Promo Code",
      type: "string",
      description: "Code customers must enter",
      validation: (rule) =>
        rule.custom((code, context) => {
          const requiresCode = (
            context.document as { requiresPromoCode?: boolean }
          )?.requiresPromoCode;
          if (requiresCode && !code) {
            return 'Promo code is required when "Requires Promo Code" is enabled';
          }
          if (code && code.length < 3) {
            return "Promo code must be at least 3 characters";
          }
          return true;
        }),
      hidden: ({ document }) => !document?.requiresPromoCode,
    }),
    defineField({
      name: "codeUsageLimit",
      title: "Code Usage Limit",
      type: "number",
      description: "Maximum number of times this code can be used",
      validation: (rule) => rule.min(1),
      hidden: ({ document }) => !document?.requiresPromoCode,
    }),
    defineField({
      name: "codeUsageCount",
      title: "Current Usage Count",
      type: "number",
      description: "How many times this code has been used",
      initialValue: 0,
      readOnly: true,
      hidden: ({ document }) => !document?.requiresPromoCode,
    }),

    // === SHARED SCHEDULE & STATUS ===
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Whether this promotion is currently active",
      initialValue: true,
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      description: "When this promotion becomes active",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      description: "When this promotion expires",
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = (context.document as { startDate?: string })
            ?.startDate;
          if (
            endDate &&
            startDate &&
            new Date(endDate) <= new Date(startDate)
          ) {
            return "End date must be after start date";
          }
          return true;
        }),
    }),
  ],

  preview: {
    select: {
      name: "name",
      tagLabel: "tagLabel",
      type: "type",
      isActive: "isActive",
      startDate: "startDate",
      endDate: "endDate",
      gender: "gender",
    },
    prepare({ name, tagLabel, type, isActive, startDate, endDate, gender }) {
      const now = new Date();
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      let status = "⚪";
      if (!isActive) {
        status = "❌";
      } else if (start && start > now) {
        status = "🟡"; // Scheduled
      } else if (end && end < now) {
        status = "🔴"; // Expired
      } else {
        status = "🟢"; // Active
      }

      const typeEmojis: Record<string, string> = {
        percentage: "📊",
        fixed_amount: "💵",
        bundle: "📦",
        bogo: "🎁",
        tiered: "📈",
        threshold: "💰",
      };

      return {
        title: `${name} (${tagLabel})`,
        subtitle: `${status} ${typeEmojis[type] || "🏷️"} ${type.toUpperCase()} • ${gender}`,
      };
    },
  },
});