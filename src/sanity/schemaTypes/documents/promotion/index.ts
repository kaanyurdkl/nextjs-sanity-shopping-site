// LIBRARIES
import { defineField, defineType } from "sanity";

// COMPONENTS
import TailwindColorPicker from "../../../components/TailwindColorPicker";

// TYPES
import type { CustomStringOptions } from "../../../types/components.types";

// TYPE CONFIGURATIONS
import { percentageConfig } from "./configs/percentageConfig";
import { fixedAmountConfig } from "./configs/fixedAmountConfig";
import { bundleConfig } from "./configs/bundleConfig";
import { bogoConfig } from "./configs/bogoConfig";
import { tieredConfig } from "./configs/tieredConfig";
import { thresholdConfig } from "./configs/thresholdConfig";

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
 * SHARED SECTIONS (conditional visibility):
 * - Target Selection: gender, categories, products (automatic promotions only)
 * - Visual Display: tag styling (automatic promotions only)
 * - Priority: ranking for automatic promotions (automatic promotions only)
 * - Schedule & Status: dates and activation (always visible)
 *
 * PROMOTION RULES:
 * - Multiple automatic promotions can target the same product
 * - Highest priority automatic promotion wins (1-100, higher = better)
 */
export const promotionType = defineType({
  name: "promotion",
  title: "Promotion",
  type: "document",
  fields: [
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
      validation: (rule) => rule.required(),
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
          {
            title: "Buy One Get One (BOGO - Free or Discounted)",
            value: "bogo",
          },
          { title: "Tiered Discount (Volume pricing)", value: "tiered" },
          { title: "Spend Threshold ($150+ for 15% off)", value: "threshold" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    // === TYPE-SPECIFIC CONFIGURATIONS ===
    percentageConfig,
    fixedAmountConfig,
    bundleConfig,
    bogoConfig,
    tieredConfig,
    thresholdConfig,
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
      hidden: ({ document }) => !document?.type,
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
      description:
        "Product categories this promotion applies to (optional - leave empty to apply to all categories)",
      hidden: ({ document }) => !document?.type,
    }),
    defineField({
      name: "applicableSubcategories",
      title: "Applicable Subcategories",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: ({ document }) => {
              const selectedCategories = document?.applicableCategories || [];
              
              // Define subcategories by parent category
              const subcategoryMap = {
                shirts: [
                  { title: "Dress Shirts", value: "dress-shirts" },
                  { title: "Casual Shirts", value: "casual-shirts" },
                  { title: "Polo Shirts", value: "polo-shirts" },
                  { title: "T-Shirts", value: "t-shirts" },
                  { title: "Sweaters", value: "sweaters" },
                  { title: "Blouses", value: "blouses" },
                  { title: "Knitwear", value: "knitwear" },
                  { title: "Tops", value: "tops" },
                ],
                pants: [
                  { title: "Dress Pants", value: "dress-pants" },
                  { title: "Casual Pants", value: "casual-pants" },
                  { title: "Trousers", value: "trousers" },
                  { title: "Jeans", value: "jeans" },
                  { title: "Shorts", value: "shorts" },
                  { title: "Skirts", value: "skirts" },
                ],
                outerwear: [
                  { title: "Blazers", value: "blazers" },
                  { title: "Jackets", value: "jackets" },
                  { title: "Coats", value: "coats" },
                  { title: "Cardigans", value: "cardigans" },
                ],
              };

              // If no categories selected, show all subcategories
              if (selectedCategories.length === 0) {
                return Object.values(subcategoryMap).flat();
              }

              // Return only subcategories for selected categories
              return selectedCategories
                .map((category) => subcategoryMap[category] || [])
                .flat();
            },
          },
        },
      ],
      description:
        "Specific subcategories this promotion applies to (optional - leave empty to apply to all subcategories in selected categories)",
      hidden: ({ document }) => !document?.type || !document?.applicableCategories?.length,
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
                return {};
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
      hidden: ({ document }) => !document?.type,
    }),
    defineField({
      name: "showTag",
      title: "Show Tag on Products",
      type: "boolean",
      description: "Whether to display the promotion tag on products",
      initialValue: true,
      hidden: ({ document }) => !document?.type,
    }),
    defineField({
      name: "tagLabel",
      title: "Tag Label",
      type: "string",
      description:
        'Custom text displayed on product tags (e.g., "2 FOR $95", "25% OFF")',
      validation: (rule) => rule.required().max(50),
      hidden: ({ document }) => !document?.type,
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
      hidden: ({ document }) => !document?.type,
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
      hidden: ({ document }) => !document?.type,
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      description:
        "Higher numbers take precedence when multiple automatic promotions apply to the same product (1-100)",
      validation: (rule) => rule.required().min(1).max(100),
      initialValue: 50,
      hidden: ({ document }) => !document?.type,
    }),
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
        promo_code: "🎟️",
      };

      // Handle null/undefined values for new promotions
      const displayName = name || "New Promotion";
      const displayTagLabel = tagLabel || "No tag";
      const displayType = type ? type.toUpperCase() : "NO TYPE";
      const displayGender = gender || "No target";

      return {
        title: `${displayName} (${displayTagLabel})`,
        subtitle: `${status} ${typeEmojis[type] || "🏷️"} ${displayType} • ${displayGender}`,
      };
    },
  },
});
