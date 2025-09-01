import { defineQuery } from "next-sanity";

/**
 * GROQ queries for the application
 * All queries are defined here for better organization and type safety
 * Using defineQuery for automatic type inference and syntax highlighting
 */

// =============================================================================
// CATEGORY QUERIES
// =============================================================================

/**
 * Fetch a category by its slug with parent data
 * Used for page routing decisions and navigation
 */
export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug && isActive == true][0] {
    _id,
    title,
    "slug": slug.current,
    pageType,
    parent->{
      _id,
      title,
      "slug": slug.current
    }
  }
`);

/**
 * Get category ID by slug - for optimized product lookups
 */
export const CATEGORY_ID_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug && isActive == true][0]._id
`);

/**
 * Fetch child categories for sidebar navigation
 * Returns direct children of a given parent category
 */
export const CATEGORY_CHILDREN_QUERY = defineQuery(`
  *[_type == "category" && parent._ref == $parentId && isActive == true] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    pageType
  }
`);

/**
 * Fetch navbar categories with 3-level hierarchy
 * Used for main navigation with mega menu
 */
export const NAVBAR_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && !defined(parent) && isActive == true] | order(_createdAt) {
    _id,
    title,
    "slug": slug.current,
    pageType,
    "children": *[_type == "category" && parent._ref == ^._id && isActive == true] | order(_createdAt) {
      _id,
      title,
      "slug": slug.current,
      pageType,
      "children": *[_type == "category" && parent._ref == ^._id && isActive == true] | order(_createdAt) {
        _id,
        title,
        "slug": slug.current,
        pageType
      }
    }
  }
`);

/**
 * Check if a category has children
 * Used for determining if category is a leaf
 */
export const HAS_CHILDREN_QUERY = defineQuery(`
  count(*[_type == "category" && parent._ref == $categoryId && isActive == true]) > 0
`);

/**
 * Get all children of a category (IDs only)
 * Used for recursive leaf category discovery
 */
export const GET_CHILDREN_QUERY = defineQuery(`
  *[_type == "category" && parent._ref == $categoryId && isActive == true] {
    _id
  }
`);

// =============================================================================
// PRODUCT QUERIES
// =============================================================================


/**
 * Fetch products by category hierarchy (optimized with computed field)
 */
export const PRODUCTS_BY_CATEGORY_HIERARCHY_QUERY = defineQuery(`
  *[_type == "product" && $categoryId in categoryHierarchy && isActive == true] 
  | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    basePrice,
    thumbnail {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    hoverImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    "availableColors": variants[isActive == true && stockQuantity > 0].color->{
      _id,
      name,
      hexCode,
      code
    },
    "hasStock": count(variants[isActive == true && stockQuantity > 0]) > 0
  }
`);

// =============================================================================
// USER QUERIES
// =============================================================================

/**
 * Fetch user by email
 * Used for account pages and authentication
 */
export const USER_BY_EMAIL_QUERY = defineQuery(`
  *[_type == "user" && email == $email][0]{
    firstName,
    lastName,
    email
  }
`);