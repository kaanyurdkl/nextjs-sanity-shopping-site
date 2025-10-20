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
 * Advanced promotion schema with 6 promotion types and sophisticated targeting
 *
 * CORE FIELDS (always visible):
 * - name: Internal promotion name
 * - description: Internal promotion description
 * - type: Promotion type selection (percentage, fixed_amount, bundle, bogo, tiered, threshold)
 *
 * TYPE-SPECIFIC CONFIGURATIONS (conditional based on type):
 * - percentageConfig: For percentage discounts (25% off)
 * - fixedAmountConfig: For fixed amount discounts ($10 off)
 * - bundleConfig: For bundle pricing (2 for $50)
 * - bogoConfig: For buy-one-get-one deals (free or percentage discount)
 * - tieredConfig: For quantity-based discounts (buy more, save more)
 * - thresholdConfig: For spend-based discounts ($150+ for 15% off)
 *
 * TARGETING & DISPLAY:
 * - applicableCategories: Target specific product categories (hierarchical support)
 * - applicableProducts: Target specific products (optional, filters by selected categories)
 * - showTag: Toggle to display promotion tags on products
 * - tagLabel: Custom text for promotion tags (e.g., "2 FOR $95", "25% OFF")
 * - tagBackgroundColor: Tailwind CSS background color for tags
 * - tagTextColor: Tailwind CSS text color for tags
 * - priority: Ranking for multiple promotions (1-100, higher wins)
 *
 * SCHEDULING:
 * - isActive: Enable/disable promotion
 * - startDate: When promotion becomes active
 * - endDate: When promotion expires
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
    // === FLEXIBLE CATEGORY SELECTION ===
    defineField({
      name: "applicableCategories",
      title: "Target Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        },
      ],
      description:
        "Select categories this promotion applies to. You can select at any hierarchy level - broader categories (e.g., 'Men's') include all subcategories, while specific categories (e.g., 'Dress Shirts') target only those items.",
      hidden: ({ document }) => !document?.type,
    }),
    defineField({
      name: "applicableProducts",
      title: "Specific Products (Optional)",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
          options: {
            filter: async ({ document, getClient }) => {
              // Filter products based on selected categories
              const selectedCategories = document.applicableCategories as {
                _ref: string;
              }[];

              if (selectedCategories.length === 0) {
                // If no categories selected, show all products
                return {
                  filter: "true",
                  params: {},
                };
              }

              try {
                // Get category details using getClient
                const client = getClient({ apiVersion: "2024-01-01" });
                const categoryIds = selectedCategories.map((cat) => cat._ref);

                const categoryDetails = await client.fetch(
                  `*[_type == "category" && _id in $categoryIds]{
                    _id,
                    title,
                    "slug": slug.current
                  }`,
                  { categoryIds }
                );

                // Generate descendant-matching filters - show products UNDER selected categories
                const categoryFilters = categoryDetails.map((category: any) => {
                  // Use GROQ startsWith function for exact string prefix matching
                  // This matches the exact category OR categories that start with "category/"
                  const filter = `category->slug.current == "${category.slug}" || string::startsWith(category->slug.current, "${category.slug}/")`;

                  return filter;
                });

                const finalFilter =
                  categoryFilters.length > 1
                    ? `(${categoryFilters.join(" || ")})`
                    : categoryFilters[0];

                return {
                  filter: finalFilter,
                  params: {},
                };
              } catch (error) {
                console.error("Failed to fetch category details:", error);

                return {
                  filter: "true",
                  params: {},
                };
              }
            },
          },
        },
      ],
      description:
        "Target specific products (optional - leave empty to apply to all products matching the category selection above)",
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
      categories: "applicableCategories",
    },
    prepare({
      name,
      tagLabel,
      type,
      isActive,
      startDate,
      endDate,
      categories,
    }) {
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

      // Build category summary
      const categoryCount = categories?.length || 0;
      const categoryDisplay =
        categoryCount === 0
          ? "All categories"
          : `${categoryCount} categor${categoryCount === 1 ? "y" : "ies"}`;

      return {
        title: `${displayName} (${displayTagLabel})`,
        subtitle: `${status} ${typeEmojis[type] || "🏷️"} ${displayType} • ${categoryDisplay}`,
      };
    },
  },
});
