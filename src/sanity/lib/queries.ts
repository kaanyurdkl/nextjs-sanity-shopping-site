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
    },
    enableSizeFilter,
    enableColorFilter,
    enablePriceFilter
  }
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
export const PRODUCTS_BY_CATEGORYID_QUERY = defineQuery(`
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
    "variants": variants[isActive == true && stockQuantity > 0] {
      size,
      stockQuantity,
      color->{
        _id,
        name,
        hexCode,
        code
      }
    },
    "hasStock": count(variants[isActive == true && stockQuantity > 0]) > 0
  }
`);

/**
 * Get total count of products by category hierarchy
 * Used for pagination calculations
 */
export const PRODUCTS_COUNT_BY_CATEGORY_QUERY = defineQuery(`
  count(*[_type == "product" && $categoryId in categoryHierarchy && isActive == true])
`);

/**
 * Fetch paginated products by category hierarchy
 * Used for specific page display with array slicing
 */
export const PAGINATED_PRODUCTS_BY_CATEGORYID_QUERY = defineQuery(`
  *[_type == "product" && $categoryId in categoryHierarchy && isActive == true] 
  | order(_createdAt desc) [$startIndex...$endIndex] {
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
    "variants": variants[isActive == true && stockQuantity > 0] {
      size,
      stockQuantity,
      color->{
        _id,
        name,
        hexCode,
        code
      }
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

// =============================================================================
// FILTER QUERIES
// =============================================================================

/**
 * Fetch available filter values for a category
 * Returns colors from products in the category hierarchy
 */
export const CATEGORY_FILTER_VALUES_QUERY = defineQuery(`
  {
    "colorValues": *[_type == "color" && _id in *[_type == "product" && $categoryId in categoryHierarchy && isActive == true]
      .variants[isActive == true && stockQuantity > 0]
      .color._ref]{_id, name, hexCode} | order(name asc)
  }
`);

export const COLORS_BY_NAME = defineQuery(`
  *[_type == "color" && string::lower(name) in $colorNames]{_id}
  `);

/**
 * Get total count of filtered products by category hierarchy
 * Used for pagination calculations when filters are applied
 */
export const PRODUCTS_FILTERED_COUNT_BY_CATEGORY_QUERY = defineQuery(`
  count(*[_type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && count(variants[isActive == true && stockQuantity > 0 && color._ref in $colorIds]) > 0
  ])
`);

/**
 * Fetch filtered and paginated products by category hierarchy
 * Used when color filters are applied
 */
export const PRODUCTS_FILTERED_PAGINATED_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && count(variants[isActive == true && stockQuantity > 0 && color._ref in $colorIds]) > 0
  ]
  | order(_createdAt desc) [$startIndex...$endIndex] {
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
    "variants": variants[isActive == true && stockQuantity > 0] {
      size->{
        _id,
        name,
        code
      },
      stockQuantity,
      color->{
        _id,
        name,
        hexCode,
        code
      }
    },
    "hasStock": count(variants[isActive == true && stockQuantity > 0]) > 0
  }
`);

export const PAGINATED_FILTERED_PRODUCTS_BY_CATEGORYID_QUERY = defineQuery(`
  *[_type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && count(variants[isActive == true && stockQuantity > 0 && color._ref in $colorIds]) > 0
  ]
  | order(_createdAt desc) [$startIndex...$endIndex] {
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
    "variants": variants[isActive == true && stockQuantity > 0] {
      size->{
        _id,
        name,
        code
      },
      stockQuantity,
      color->{
        _id,
        name,
        hexCode,
        code
      }
    },
    "hasStock": count(variants[isActive == true && stockQuantity > 0]) > 0
  }
`);

export const FILTERED_PRODUCTS_COUNT_BY_CATEGORYID_QUERY = defineQuery(`
  count(*[_type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && count(variants[isActive == true && stockQuantity > 0 && color._ref in $colorIds]) > 0
  ])
`);

export const PRODUCTS_COUNT_BY_CATEGORYID_QUERY = defineQuery(`
  count(*[_type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && count(variants[isActive == true && stockQuantity > 0]) > 0
  ])
`);

// =============================================================================
// DYNAMIC FILTER QUERIES (Context-Aware)
// =============================================================================

/**
 * Get available colors for a category with optional size filter
 * If sizeIds provided, only return colors from products that have those sizes
 */
export const GET_COLORS_FOR_CATEGORY_QUERY = defineQuery(`
  *[_type == "color" && _id in *[
    _type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && count(variants[
      isActive == true
      && stockQuantity > 0
      && (!defined($sizeIds) || size._ref in $sizeIds)
    ]) > 0
  ].variants[isActive == true && stockQuantity > 0].color._ref]
  {_id, name, hexCode} | order(name asc)
`);

/**
 * Get available sizes for a category with optional color filter
 * If colorIds provided, only return sizes from products that have those colors
 */
export const GET_SIZES_FOR_CATEGORY_QUERY = defineQuery(`
  *[_type == "size" && _id in *[
    _type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && count(variants[
      isActive == true
      && stockQuantity > 0
      && (!defined($colorIds) || color._ref in $colorIds)
    ]) > 0
  ].variants[isActive == true && stockQuantity > 0].size._ref]
  {_id, name, code, sortOrder} | order(sortOrder asc)
`);

/**
 * Get sizes by name (lowercase matching)
 * Used to convert size names from URL to size IDs
 */
export const SIZES_BY_CODE = defineQuery(`
  *[_type == "size" && string::lower(code) in $sizeCodes]{_id, name, code, sortOrder}
`);

// =============================================================================
// UNIFIED FILTER QUERIES (Scalable with Optional Parameters)
// =============================================================================

/**
 * Get paginated products with optional color and size filters
 * Uses !defined() pattern to make filters optional
 * This single query handles all filter combinations:
 * - No filters
 * - Color only
 * - Size only
 * - Both color and size
 */
export const PRODUCTS_WITH_FILTERS_QUERY = defineQuery(`
  *[_type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && count(variants[
      isActive == true
      && stockQuantity > 0
      && (!defined($colorIds) || color._ref in $colorIds)
      && (!defined($sizeIds) || size._ref in $sizeIds)
    ]) > 0
  ]
  | order(_createdAt desc) [$startIndex...$endIndex] {
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
    "variants": variants[isActive == true && stockQuantity > 0] {
      size->{
        _id,
        name,
        code
      },
      stockQuantity,
      color->{
        _id,
        name,
        hexCode,
        code
      }
    },
    "hasStock": count(variants[isActive == true && stockQuantity > 0]) > 0
  }
`);

/**
 * Get count of products with optional color and size filters
 * Mirrors the logic of PRODUCTS_WITH_FILTERS_QUERY for pagination
 */
export const PRODUCTS_COUNT_WITH_FILTERS_QUERY = defineQuery(`
  count(*[_type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && count(variants[
      isActive == true
      && stockQuantity > 0
      && (!defined($colorIds) || color._ref in $colorIds)
      && (!defined($sizeIds) || size._ref in $sizeIds)
    ]) > 0
  ])
`);
