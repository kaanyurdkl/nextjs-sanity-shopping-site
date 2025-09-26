import { sanityFetch } from "./fetch";
import type {
  CATEGORY_BY_SLUG_QUERYResult,
  CATEGORY_CHILDREN_QUERYResult,
  CATEGORY_FILTER_VALUES_QUERYResult,
  PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult,
  PRODUCTS_FILTERED_PAGINATED_BY_CATEGORY_QUERYResult,
} from "@/sanity/types/sanity.types";
import {
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_CHILDREN_QUERY,
  CATEGORY_FILTER_VALUES_QUERY,
  PRODUCTS_BY_CATEGORY_HIERARCHY_QUERY,
  PRODUCTS_COUNT_BY_CATEGORY_QUERY,
  PRODUCTS_PAGINATED_BY_CATEGORY_QUERY,
  PRODUCTS_FILTERED_COUNT_BY_CATEGORY_QUERY,
  PRODUCTS_FILTERED_PAGINATED_BY_CATEGORY_QUERY,
  NAVBAR_CATEGORIES_QUERY,
  USER_BY_EMAIL_QUERY,
} from "./queries";
import { PRODUCTS_PER_PAGE } from "@/constants/pagination";

// =============================================================================
// CATEGORY UTILITIES
// =============================================================================

/**
 * Fetch category by full slug path
 * Joins slug array into a single path string for GROQ query
 */
export async function getCategoryBySlugPath(
  slugPath: string[]
): Promise<CATEGORY_BY_SLUG_QUERYResult> {
  const fullSlug = slugPath.join("/");

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
export async function getNavbarCategories() {
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
): Promise<PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult> {
  return await sanityFetch<PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult>({
    query: PRODUCTS_BY_CATEGORY_HIERARCHY_QUERY,
    params: { categoryId },
    tags: ["product", "category"],
  });
}

/**
 * Get total count of products by category ID
 * Used for pagination calculations - Step 1 of sequential pagination
 */
export async function getProductsCountByCategoryId(
  categoryId: string
): Promise<number> {
  return await sanityFetch<number>({
    query: PRODUCTS_COUNT_BY_CATEGORY_QUERY,
    params: { categoryId },
    tags: ["product", "category"],
  });
}

/**
 * Fetch paginated products by category ID
 * Used for specific page display - Step 2 of sequential pagination
 */
export async function getProductsPaginatedByCategoryId(
  categoryId: string,
  page: number
): Promise<PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult> {
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE; // Adjust for GROQ inclusive range behavior
  
  return await sanityFetch<PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult>({
    query: PRODUCTS_PAGINATED_BY_CATEGORY_QUERY,
    params: { 
      categoryId, 
      startIndex, 
      endIndex 
    },
    tags: ["product", "category"],
  });
}

// =============================================================================
// USER UTILITIES
// =============================================================================

/**
 * Fetch user by email
 * Used for account pages and authentication
 */
export async function getUserByEmail(email: string) {
  return await sanityFetch({
    query: USER_BY_EMAIL_QUERY,
    params: { email },
    tags: ["user"],
  });
}

// =============================================================================
// FILTER UTILITIES
// =============================================================================

/**
 * Fetch filter values for a category
 * Used for category page filters
 */
export async function getCategoryFilterValues(categoryId: string): Promise<CATEGORY_FILTER_VALUES_QUERYResult> {
  return await sanityFetch({
    query: CATEGORY_FILTER_VALUES_QUERY,
    params: { categoryId },
    tags: ["product", "color"],
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

  const colorNames = colorNamesString.split(',').map(name => name.trim().toLowerCase());

  // Get available colors for this category
  const filterData = await getCategoryFilterValues(categoryId);

  // Find color IDs that match the requested color names
  const colorIds = filterData.availableColors
    .filter(color => colorNames.includes(color.name.toLowerCase()))
    .map(color => color._id);

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

  return await sanityFetch<PRODUCTS_FILTERED_PAGINATED_BY_CATEGORY_QUERYResult>({
    query: PRODUCTS_FILTERED_PAGINATED_BY_CATEGORY_QUERY,
    params: {
      categoryId,
      startIndex,
      endIndex,
      colorIds
    },
    tags: ["product", "category", "color"],
  });
}