import { sanityFetch } from "@/services/sanity/lib/fetch";
import type {
  PAGINATED_PRODUCTS_BY_CATEGORYID_QUERYResult,
  PRODUCTS_BY_CATEGORYID_QUERYResult,
  PRODUCTS_COUNT_BY_CATEGORYID_QUERYResult,
  PRODUCTS_COUNT_WITH_FILTERS_QUERYResult,
  PRODUCTS_WITH_FILTERS_QUERYResult,
  PRODUCT_BY_ID_QUERYResult,
} from "@/services/sanity/types/sanity.types";
import {
  PAGINATED_PRODUCTS_BY_CATEGORYID_QUERY,
  PRODUCTS_BY_CATEGORYID_QUERY,
  PRODUCTS_COUNT_BY_CATEGORYID_QUERY,
  PRODUCTS_COUNT_WITH_FILTERS_QUERY,
  PRODUCTS_WITH_FILTERS_QUERY,
  PRODUCT_BY_ID_QUERY,
} from "@/services/sanity/lib/queries";
import { PRODUCTS_PER_PAGE } from "@/constants/pagination";

/**
 * Fetch products by category ID using computed categoryHierarchy field (optimized!)
 * Single-query approach: Direct product fetch with category ID
 */
export async function getProductsByCategoryId(
  categoryId: string,
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
  page: number,
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

/**
 * Fetch product by ID
 * Used for product detail page
 */
export async function getProductById(
  id: string,
): Promise<PRODUCT_BY_ID_QUERYResult> {
  return await sanityFetch({
    query: PRODUCT_BY_ID_QUERY,
    params: { id },
    tags: ["product"],
  });
}

/**
 * Get total count of products in a category
 * Used for pagination calculations
 */
export async function getProductsCountByCategoryId(
  categoryId: string,
): Promise<PRODUCTS_COUNT_BY_CATEGORYID_QUERYResult> {
  return await sanityFetch({
    query: PRODUCTS_COUNT_BY_CATEGORYID_QUERY,
    params: {
      categoryId,
    },
  });
}

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
  sortOrder?: string | null,
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
  maxPrice?: number | null,
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
