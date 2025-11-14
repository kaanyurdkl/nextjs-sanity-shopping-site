import { sanityFetch } from "@/services/sanity/lib/fetch";
import type {
  CATEGORY_BY_SLUG_QUERYResult,
  CATEGORY_CHILDREN_QUERYResult,
  NAVBAR_CATEGORIES_QUERYResult,
} from "@/services/sanity/types/sanity.types";
import {
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_CHILDREN_QUERY,
  NAVBAR_CATEGORIES_QUERY,
} from "@/services/sanity/lib/queries";

/**
 * Fetch category by full slug path
 * Joins slug array into a single path string for GROQ query
 */
export async function getCategoryBySlug(
  slug: string[],
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
  parentCategoryId: string,
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
