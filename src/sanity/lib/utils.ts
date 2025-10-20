import { sanityFetch, sanityFetchNoCache } from "./fetch";
import type {
  CATEGORY_BY_SLUG_QUERYResult,
  CATEGORY_CHILDREN_QUERYResult,
  CATEGORY_FILTER_VALUES_QUERYResult,
  USER_BY_GOOGLE_ID_QUERYResult,
  USER_ID_BY_GOOGLE_ID_QUERYResult,
  COLORS_BY_NAMEResult,
  FILTERED_PRODUCTS_COUNT_BY_CATEGORYID_QUERYResult,
  NAVBAR_CATEGORIES_QUERYResult,
  PAGINATED_FILTERED_PRODUCTS_BY_CATEGORYID_QUERYResult,
  PAGINATED_PRODUCTS_BY_CATEGORYID_QUERYResult,
  PRODUCTS_BY_CATEGORYID_QUERYResult,
  PRODUCTS_COUNT_BY_CATEGORYID_QUERYResult,
  PRODUCTS_FILTERED_PAGINATED_BY_CATEGORY_QUERYResult,
  GET_COLORS_FOR_CATEGORY_QUERYResult,
  GET_SIZES_FOR_CATEGORY_QUERYResult,
  PRODUCTS_WITH_FILTERS_QUERYResult,
  PRODUCTS_COUNT_WITH_FILTERS_QUERYResult,
  SIZES_BY_CODEResult,
  GET_PRICE_RANGE_FOR_CATEGORY_QUERYResult,
  PRODUCT_BY_ID_QUERYResult,
  USER_BY_EMAIL_QUERYResult,
} from "@/sanity/types/sanity.types";
import {
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_CHILDREN_QUERY,
  CATEGORY_FILTER_VALUES_QUERY,
  PRODUCTS_BY_CATEGORYID_QUERY,
  PRODUCTS_FILTERED_COUNT_BY_CATEGORY_QUERY,
  PRODUCTS_FILTERED_PAGINATED_BY_CATEGORY_QUERY,
  NAVBAR_CATEGORIES_QUERY,
  USER_BY_EMAIL_QUERY,
  USER_BY_GOOGLE_ID_QUERY,
  USER_ID_BY_GOOGLE_ID_QUERY,
  COLORS_BY_NAME,
  PAGINATED_PRODUCTS_BY_CATEGORYID_QUERY,
  PAGINATED_FILTERED_PRODUCTS_BY_CATEGORYID_QUERY,
  FILTERED_PRODUCTS_COUNT_BY_CATEGORYID_QUERY,
  PRODUCTS_COUNT_BY_CATEGORYID_QUERY,
  GET_COLORS_FOR_CATEGORY_QUERY,
  GET_SIZES_FOR_CATEGORY_QUERY,
  PRODUCTS_WITH_FILTERS_QUERY,
  PRODUCTS_COUNT_WITH_FILTERS_QUERY,
  SIZES_BY_CODE,
  GET_PRICE_RANGE_FOR_CATEGORY_QUERY,
  PRODUCT_BY_ID_QUERY,
} from "./queries";
import { PRODUCTS_PER_PAGE } from "@/constants/pagination";

// =============================================================================
// CATEGORY UTILITIES
// =============================================================================

/**
 * Fetch category by full slug path
 * Joins slug array into a single path string for GROQ query
 */
export async function getCategoryBySlug(
  slug: string[]
): Promise<CATEGORY_BY_SLUG_QUERYResult> {
  const fullSlug = slug.join("/");

  const category = await sanityFetch<CATEGORY_BY_SLUG_QUERYResult>({
    query: CATEGORY_BY_SLUG_QUERY,
    params: { slug: fullSlug },
    tags: ["category"],
  });

  return category;
}

/**
 * Fetch child categories for sidebar navigation
 * Returns direct children of the current category for sidebar display
 */
export async function getCategoryChildren(
  parentCategoryId: string
): Promise<CATEGORY_CHILDREN_QUERYResult> {
  const children = await sanityFetch<CATEGORY_CHILDREN_QUERYResult>({
    query: CATEGORY_CHILDREN_QUERY,
    params: { parentId: parentCategoryId },
    tags: ["category"],
  });

  return children;
}

/**
 * Fetch navbar categories with caching
 * Returns hierarchical category structure for navigation
 */
export async function getNavbarCategories(): Promise<NAVBAR_CATEGORIES_QUERYResult> {
  return await sanityFetch({
    query: NAVBAR_CATEGORIES_QUERY,
    tags: ["category"],
  });
}

// =============================================================================
// PRODUCT UTILITIES
// =============================================================================

/**
 * Fetch products by category ID using computed categoryHierarchy field (optimized!)
 * Single-query approach: Direct product fetch with category ID
 */
export async function getProductsByCategoryId(
  categoryId: string
): Promise<PRODUCTS_BY_CATEGORYID_QUERYResult> {
  return await sanityFetch<PRODUCTS_BY_CATEGORYID_QUERYResult>({
    query: PRODUCTS_BY_CATEGORYID_QUERY,
    params: { categoryId },
    tags: ["product", "category"],
  });
}

/**
 * Fetch paginated products by category ID
 * Used for specific page display - Step 2 of sequential pagination
 */
export async function getPaginatedProductsByCategoryId(
  categoryId: string,
  page: number
): Promise<PAGINATED_PRODUCTS_BY_CATEGORYID_QUERYResult> {
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  return await sanityFetch<PAGINATED_PRODUCTS_BY_CATEGORYID_QUERYResult>({
    query: PAGINATED_PRODUCTS_BY_CATEGORYID_QUERY,
    params: {
      categoryId,
      startIndex,
      endIndex,
    },
    tags: ["product", "category"],
  });
}

// =============================================================================
// PRODUCT UTILITIES
// =============================================================================

/**
 * Fetch product by ID
 * Used for product detail page
 */
export async function getProductById(
  id: string
): Promise<PRODUCT_BY_ID_QUERYResult> {
  return await sanityFetch({
    query: PRODUCT_BY_ID_QUERY,
    params: { id },
    tags: ["product"],
  });
}

// =============================================================================
// USER UTILITIES
// =============================================================================

/**
 * Fetch user by email
 * Used for account pages and authentication
 * Uses no-cache to always fetch fresh user data after profile updates
 */
export async function getUserByEmail(
  email: string
): Promise<USER_BY_EMAIL_QUERYResult> {
  return await sanityFetchNoCache({
    query: USER_BY_EMAIL_QUERY,
    params: { email },
  });
}

/**
 * Fetch user by Google OAuth ID
 * Preferred method for account pages (more stable than email)
 * Uses no-cache to always fetch fresh user data after profile updates
 */
export async function getUserByGoogleId(
  googleId: string
): Promise<USER_BY_GOOGLE_ID_QUERYResult> {
  return await sanityFetchNoCache({
    query: USER_BY_GOOGLE_ID_QUERY,
    params: { googleId },
  });
}

/**
 * Get user ID by Google ID (optimized for mutations)
 * Only fetches the _id field needed for patch operations
 * Uses no-cache to ensure immediate consistency after mutations
 * @returns The user's _id string, or null if not found
 */
export async function getUserIdByGoogleId(
  googleId: string
): Promise<string | null> {
  const result = await sanityFetchNoCache<USER_ID_BY_GOOGLE_ID_QUERYResult>({
    query: USER_ID_BY_GOOGLE_ID_QUERY,
    params: { googleId },
  });
  return result?._id ?? null;
}

// =============================================================================
// FILTER UTILITIES
// =============================================================================

/**
 * Fetch filter values for a category
 * Used for category page filters
 */
export async function getCategoryFilterValues(
  categoryId: string
): Promise<CATEGORY_FILTER_VALUES_QUERYResult> {
  return await sanityFetch({
    query: CATEGORY_FILTER_VALUES_QUERY,
    params: { categoryId },
    tags: ["product", "color"],
  });
}

export async function getColorsByName(
  colorNames: string[]
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
  categoryId: string
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
 * Get total count of filtered products by category ID
 * Used for pagination calculations when filters are applied
 */
export async function getProductsFilteredCountByCategoryId(
  categoryId: string,
  colorIds: string[]
): Promise<number> {
  return await sanityFetch<number>({
    query: PRODUCTS_FILTERED_COUNT_BY_CATEGORY_QUERY,
    params: { categoryId, colorIds },
    tags: ["product", "category", "color"],
  });
}

/**
 * Fetch filtered and paginated products by category ID
 * Used when color filters are applied
 */
export async function getProductsFilteredPaginatedByCategoryId(
  categoryId: string,
  page: number,
  colorIds: string[]
): Promise<PRODUCTS_FILTERED_PAGINATED_BY_CATEGORY_QUERYResult> {
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  return await sanityFetch<PRODUCTS_FILTERED_PAGINATED_BY_CATEGORY_QUERYResult>(
    {
      query: PRODUCTS_FILTERED_PAGINATED_BY_CATEGORY_QUERY,
      params: {
        categoryId,
        startIndex,
        endIndex,
        colorIds,
      },
      tags: ["product", "category", "color"],
    }
  );
}

export async function getPaginatedFilteredProductsByCategoryId(
  categoryId: string,
  colorIds: string[],
  pageNumber: number
): Promise<PAGINATED_FILTERED_PRODUCTS_BY_CATEGORYID_QUERYResult> {
  const startIndex = (pageNumber - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  return await sanityFetch<PAGINATED_FILTERED_PRODUCTS_BY_CATEGORYID_QUERYResult>(
    {
      query: PAGINATED_FILTERED_PRODUCTS_BY_CATEGORYID_QUERY,
      params: {
        categoryId,
        colorIds,
        startIndex,
        endIndex,
      },
      tags: ["product", "category", "color"],
    }
  );
}

export async function getFilteredProductsCountByCategoryId(
  categoryId: string,
  colorIds: string[]
): Promise<FILTERED_PRODUCTS_COUNT_BY_CATEGORYID_QUERYResult> {
  return await sanityFetch({
    query: FILTERED_PRODUCTS_COUNT_BY_CATEGORYID_QUERY,
    params: {
      categoryId,
      colorIds,
    },
  });
}

export async function getProductsCountByCategoryId(
  categoryId: string
): Promise<PRODUCTS_COUNT_BY_CATEGORYID_QUERYResult> {
  return await sanityFetch({
    query: PRODUCTS_COUNT_BY_CATEGORYID_QUERY,
    params: {
      categoryId,
    },
  });
}

/**
 * Get sizes by name (lowercase matching)
 * Used to convert size names from URL to size IDs
 */
export async function getSizesByCode(
  sizeCodes: string[]
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
  sizeIds?: string[] | null
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
  }
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
      sizeIds
    );
    if (priceRange.minPrice !== null && priceRange.maxPrice !== null) {
      filterResults.push({ type: "price", data: priceRange });
    }
  }

  return filterResults;
}

// =============================================================================
// UNIFIED FILTERING (Scalable with Optional Parameters)
// =============================================================================

/**
 * Get products with optional color, size, and price filters (unified approach)
 * This single function handles all filter combinations
 * @param categoryId - Category ID to filter by
 * @param page - Current page number for pagination
 * @param colorIds - Optional array of color IDs (pass null/undefined for no color filter)
 * @param sizeIds - Optional array of size IDs (pass null/undefined for no size filter)
 * @param minPrice - Optional minimum price filter
 * @param maxPrice - Optional maximum price filter
 * @param sortOrder - Sort order: "newest" (default), "price-asc", "price-desc"
 */
export async function getProductsWithFilters(
  categoryId: string,
  page: number,
  colorIds?: string[] | null,
  sizeIds?: string[] | null,
  minPrice?: number | null,
  maxPrice?: number | null,
  sortOrder?: string | null
): Promise<PRODUCTS_WITH_FILTERS_QUERYResult> {
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  return await sanityFetch<PRODUCTS_WITH_FILTERS_QUERYResult>({
    query: PRODUCTS_WITH_FILTERS_QUERY,
    params: {
      categoryId,
      startIndex,
      endIndex,
      colorIds: colorIds && colorIds.length > 0 ? colorIds : null,
      sizeIds: sizeIds && sizeIds.length > 0 ? sizeIds : null,
      minPrice: minPrice ?? null,
      maxPrice: maxPrice ?? null,
      sortOrder: sortOrder || "newest",
    },
    tags: ["product", "category", "color", "size"],
  });
}

/**
 * Get count of products with optional color, size, and price filters (unified approach)
 * @param categoryId - Category ID to filter by
 * @param colorIds - Optional array of color IDs (pass null/undefined for no color filter)
 * @param sizeIds - Optional array of size IDs (pass null/undefined for no size filter)
 * @param minPrice - Optional minimum price filter
 * @param maxPrice - Optional maximum price filter
 */
export async function getProductsCountWithFilters(
  categoryId: string,
  colorIds?: string[] | null,
  sizeIds?: string[] | null,
  minPrice?: number | null,
  maxPrice?: number | null
): Promise<PRODUCTS_COUNT_WITH_FILTERS_QUERYResult> {
  return await sanityFetch<PRODUCTS_COUNT_WITH_FILTERS_QUERYResult>({
    query: PRODUCTS_COUNT_WITH_FILTERS_QUERY,
    params: {
      categoryId,
      colorIds: colorIds && colorIds.length > 0 ? colorIds : null,
      sizeIds: sizeIds && sizeIds.length > 0 ? sizeIds : null,
      minPrice: minPrice ?? null,
      maxPrice: maxPrice ?? null,
    },
    tags: ["product", "category", "color", "size"],
  });
}
