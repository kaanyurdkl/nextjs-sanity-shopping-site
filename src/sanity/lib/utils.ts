import { sanityFetch } from "./fetch";
import type {
  CATEGORY_BY_SLUG_QUERYResult,
  CATEGORY_CHILDREN_QUERYResult,
  PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult,
} from "@/sanity/types/sanity.types";
import {
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_ID_BY_SLUG_QUERY,
  CATEGORY_CHILDREN_QUERY,
  PRODUCTS_BY_CATEGORY_HIERARCHY_QUERY,
  NAVBAR_CATEGORIES_QUERY,
  USER_BY_EMAIL_QUERY,
} from "./queries";

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
 * Fetch products by category using computed categoryHierarchy field (optimized!)
 * Two-query approach: Get category ID first, then products by ID
 */
export async function getProductsByCategory(
  categorySlug: string
): Promise<PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult> {
  // First, get the category ID for this slug
  const categoryId = await sanityFetch<string>({
    query: CATEGORY_ID_BY_SLUG_QUERY,
    params: { slug: categorySlug },
    tags: ["category"],
  });

  if (!categoryId) {
    return [];
  }

  // Then fetch products that have this category ID in their hierarchy
  return await sanityFetch<PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult>({
    query: PRODUCTS_BY_CATEGORY_HIERARCHY_QUERY,
    params: { categoryId },
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