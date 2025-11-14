import { sanityFetch } from "@/services/sanity/lib/fetch";
import type {
  CATEGORY_BY_SLUG_QUERYResult,
  CATEGORY_FILTER_VALUES_QUERYResult,
  COLORS_BY_NAMEResult,
  GET_COLORS_FOR_CATEGORY_QUERYResult,
  GET_PRICE_RANGE_FOR_CATEGORY_QUERYResult,
  GET_SIZES_FOR_CATEGORY_QUERYResult,
  SIZES_BY_CODEResult,
} from "@/services/sanity/types/sanity.types";
import {
  CATEGORY_FILTER_VALUES_QUERY,
  COLORS_BY_NAME,
  GET_COLORS_FOR_CATEGORY_QUERY,
  GET_PRICE_RANGE_FOR_CATEGORY_QUERY,
  GET_SIZES_FOR_CATEGORY_QUERY,
  SIZES_BY_CODE,
} from "@/services/sanity/lib/queries";

/**
 * Fetch filter values for a category
 * Used for category page filters
 */
export async function getCategoryFilterValues(
  categoryId: string,
): Promise<CATEGORY_FILTER_VALUES_QUERYResult> {
  return await sanityFetch({
    query: CATEGORY_FILTER_VALUES_QUERY,
    params: { categoryId },
    tags: ["product", "color"],
  });
}

/**
 * Get colors by name (lowercase matching)
 * Used to convert color names from URL to color IDs
 */
export async function getColorsByName(
  colorNames: string[],
): Promise<COLORS_BY_NAMEResult> {
  return await sanityFetch({
    query: COLORS_BY_NAME,
    params: { colorNames },
  });
}

/**
 * Parse color filter URL parameter and convert to color IDs
 * Converts "red,blue,green" to color IDs by looking up color names
 */
export async function parseColorFilters(
  colorNamesString: string | undefined,
  categoryId: string,
): Promise<string[]> {
  if (!colorNamesString) return [];

  const colorNames = colorNamesString
    .split(",")
    .map((name) => name.trim().toLowerCase());

  // Get available colors for this category
  const filterData = await getCategoryFilterValues(categoryId);

  // Find color IDs that match the requested color names
  const colorIds = filterData.colorValues
    .filter((color) => colorNames.includes(color.name.toLowerCase()))
    .map((color) => color._id);

  return colorIds;
}

/**
 * Get sizes by code (lowercase matching)
 * Used to convert size codes from URL to size IDs
 */
export async function getSizesByCode(
  sizeCodes: string[],
): Promise<SIZES_BY_CODEResult> {
  return await sanityFetch({
    query: SIZES_BY_CODE,
    params: { sizeCodes },
  });
}

/**
 * Get price range for products in a category
 * Returns min and max price values, optionally filtered by color and size
 */
export async function getPriceRangeForCategory(
  categoryId: string,
  colorIds?: string[] | null,
  sizeIds?: string[] | null,
): Promise<GET_PRICE_RANGE_FOR_CATEGORY_QUERYResult> {
  return await sanityFetch({
    query: GET_PRICE_RANGE_FOR_CATEGORY_QUERY,
    params: {
      categoryId,
      colorIds: colorIds || null,
      sizeIds: sizeIds || null,
    },
    tags: ["product", "category"],
  });
}

// =============================================================================
// DYNAMIC FILTER DATA (Context-Aware)
// =============================================================================

export interface ColorFilterData {
  type: "color";
  data: GET_COLORS_FOR_CATEGORY_QUERYResult;
}

export interface SizeFilterData {
  type: "size";
  data: GET_SIZES_FOR_CATEGORY_QUERYResult;
}

export interface PriceFilterData {
  type: "price";
  data: GET_PRICE_RANGE_FOR_CATEGORY_QUERYResult;
}

export type FilterData = ColorFilterData | SizeFilterData | PriceFilterData;

/**
 * Get category filter data with context-aware filtering
 * Returns array of enabled filters with their available values
 * Filter options are dynamic based on other active filters
 */
export async function getCategoryFilterData(
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>,
  searchParams?: {
    page?: string;
    colors?: string;
    sizes?: string;
    minPrice?: string;
    maxPrice?: string;
  },
): Promise<FilterData[]> {
  const filterResults: FilterData[] = [];

  // Parse searchParams
  const selectedColorNames = searchParams?.colors?.split(",") || [];
  const selectedSizeCodes = searchParams?.sizes?.split(",") || [];
  const minPrice = searchParams?.minPrice
    ? parseFloat(searchParams.minPrice)
    : null;
  const maxPrice = searchParams?.maxPrice
    ? parseFloat(searchParams.maxPrice)
    : null;

  // Convert selected names to IDs for queries
  let colorIds: string[] | undefined;
  let sizeIds: string[] | undefined;

  if (selectedColorNames.length > 0) {
    const colors = await getColorsByName(selectedColorNames);
    colorIds = colors.map((c) => c._id);
  }

  if (selectedSizeCodes.length > 0) {
    const sizes = await getSizesByCode(selectedSizeCodes);
    sizeIds = sizes.map((s) => s._id);
  }

  // Fetch color filter values (context-aware with size and price filters)
  if (category.enableColorFilter) {
    const colors = await sanityFetch<GET_COLORS_FOR_CATEGORY_QUERYResult>({
      query: GET_COLORS_FOR_CATEGORY_QUERY,
      params: {
        categoryId: category._id,
        sizeIds: sizeIds || null,
        minPrice: minPrice,
        maxPrice: maxPrice,
      },
      tags: ["product", "color", "size"],
    });

    if (colors.length > 0) {
      filterResults.push({ type: "color", data: colors });
    }
  }

  // Fetch size filter values (context-aware with color and price filters)
  if (category.enableSizeFilter) {
    const sizes = await sanityFetch<GET_SIZES_FOR_CATEGORY_QUERYResult>({
      query: GET_SIZES_FOR_CATEGORY_QUERY,
      params: {
        categoryId: category._id,
        colorIds: colorIds || null,
        minPrice: minPrice,
        maxPrice: maxPrice,
      },
      tags: ["product", "color", "size"],
    });

    if (sizes.length > 0) {
      filterResults.push({ type: "size", data: sizes });
    }
  }

  // Fetch price range for category (filtered by active color/size filters)
  if (category.enablePriceFilter) {
    const priceRange = await getPriceRangeForCategory(
      category._id,
      colorIds,
      sizeIds,
    );
    if (priceRange.minPrice !== null && priceRange.maxPrice !== null) {
      filterResults.push({ type: "price", data: priceRange });
    }
  }

  return filterResults;
}
