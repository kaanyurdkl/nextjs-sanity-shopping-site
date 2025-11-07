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
// PRODUCT QUERIES
// =============================================================================

/**
 * Fetch product by ID with all details
 * Used for product detail page
 */
export const PRODUCT_BY_ID_QUERY = defineQuery(`
  *[_type == "product" && _id == $id && isActive == true][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    basePrice,
    category->{
      _id,
      title,
      "slug": slug.current,
      parent->{
        _id,
        title,
        "slug": slug.current
      }
    },
    sizeGroup->{
      _id,
      name,
      sizes
    },
    variants[] {
      size->{
        _id,
        name,
        code,
        sortOrder
      },
      color->{
        _id,
        name,
        code,
        hexCode
      },
      sku,
      stockQuantity,
      isActive
    },
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
    images[] {
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
    keyFeatures,
    materials,
    sizeAndFit,
    careInstructions,
    relatedProducts[]->{
      _id,
      name,
      "slug": slug.current,
      basePrice,
      thumbnail {
        asset->{
          _id,
          url
        },
        alt
      }
    },
    reviews[]->{
      _id,
      rating,
      title,
      comment,
      isVerifiedPurchase,
      createdAt,
      user->{
        firstName,
        lastName
      }
    },
    isFeatured
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
    _id,
    firstName,
    lastName,
    email,
    phoneNumber,
    addresses
  }
`);

/**
 * Fetch user by Google OAuth ID
 * Preferred method for account pages (more stable than email)
 */
export const USER_BY_GOOGLE_ID_QUERY = defineQuery(`
  *[_type == "user" && googleId == $googleId][0]{
    _id,
    firstName,
    lastName,
    email,
    phoneNumber,
    addresses
  }
`);

/**
 * Fetch user ID by Google OAuth ID
 * Used for mutations where only the document ID is needed
 */
export const USER_ID_BY_GOOGLE_ID_QUERY = defineQuery(`
  *[_type == "user" && googleId == $googleId][0]{ _id }
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
 * Includes product count for each color
 */
export const GET_COLORS_FOR_CATEGORY_QUERY = defineQuery(`
  *[_type == "color" && _id in *[
    _type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && (!defined($minPrice) || basePrice >= $minPrice)
    && (!defined($maxPrice) || basePrice <= $maxPrice)
    && count(variants[
      isActive == true
      && stockQuantity > 0
      && (!defined($sizeIds) || size._ref in $sizeIds)
    ]) > 0
  ].variants[isActive == true && stockQuantity > 0].color._ref]
  {
    _id,
    name,
    hexCode,
    "productCount": count(*[
      _type == "product"
      && $categoryId in categoryHierarchy
      && isActive == true
      && (!defined($minPrice) || basePrice >= $minPrice)
      && (!defined($maxPrice) || basePrice <= $maxPrice)
      && ^._id in variants[
        isActive == true
        && stockQuantity > 0
        && (!defined($sizeIds) || size._ref in $sizeIds)
      ].color._ref
    ])
  } | order(name asc)
`);

/**
 * Get available sizes for a category with optional color filter
 * If colorIds provided, only return sizes from products that have those colors
 * Includes product count for each size
 */
export const GET_SIZES_FOR_CATEGORY_QUERY = defineQuery(`
  *[_type == "size" && _id in *[
    _type == "product"
    && $categoryId in categoryHierarchy
    && isActive == true
    && (!defined($minPrice) || basePrice >= $minPrice)
    && (!defined($maxPrice) || basePrice <= $maxPrice)
    && count(variants[
      isActive == true
      && stockQuantity > 0
      && (!defined($colorIds) || color._ref in $colorIds)
    ]) > 0
  ].variants[isActive == true && stockQuantity > 0].size._ref]
  {
    _id,
    name,
    code,
    sortOrder,
    "productCount": count(*[
      _type == "product"
      && $categoryId in categoryHierarchy
      && isActive == true
      && (!defined($minPrice) || basePrice >= $minPrice)
      && (!defined($maxPrice) || basePrice <= $maxPrice)
      && ^._id in variants[
        isActive == true
        && stockQuantity > 0
        && (!defined($colorIds) || color._ref in $colorIds)
      ].size._ref
    ])
  } | order(sortOrder asc)
`);

/**
 * Get sizes by name (lowercase matching)
 * Used to convert size names from URL to size IDs
 */
export const SIZES_BY_CODE = defineQuery(`
  *[_type == "size" && string::lower(code) in $sizeCodes]{_id, name, code, sortOrder}
`);

/**
 * Get price range for products in a category
 * Returns min and max price values for active products with stock
 */
export const GET_PRICE_RANGE_FOR_CATEGORY_QUERY = defineQuery(`
  {
    "minPrice": math::min(*[
      _type == "product"
      && $categoryId in categoryHierarchy
      && isActive == true
      && count(variants[
        isActive == true
        && stockQuantity > 0
        && (!defined($colorIds) || length($colorIds) == 0 || color._ref in $colorIds)
        && (!defined($sizeIds) || length($sizeIds) == 0 || size._ref in $sizeIds)
      ]) > 0
    ].basePrice),
    "maxPrice": math::max(*[
      _type == "product"
      && $categoryId in categoryHierarchy
      && isActive == true
      && count(variants[
        isActive == true
        && stockQuantity > 0
        && (!defined($colorIds) || length($colorIds) == 0 || color._ref in $colorIds)
        && (!defined($sizeIds) || length($sizeIds) == 0 || size._ref in $sizeIds)
      ]) > 0
    ].basePrice)
  }
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
    && (!defined($minPrice) || basePrice >= $minPrice)
    && (!defined($maxPrice) || basePrice <= $maxPrice)
    && count(variants[
      isActive == true
      && stockQuantity > 0
      && (!defined($colorIds) || color._ref in $colorIds)
      && (!defined($sizeIds) || size._ref in $sizeIds)
    ]) > 0
  ]
  | order(
      select(
        $sortOrder == "price-asc" => 0 - basePrice,
        $sortOrder == "price-desc" => basePrice,
        0 - _createdAt
      ) desc
    ) [$startIndex...$endIndex] {
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
    && (!defined($minPrice) || basePrice >= $minPrice)
    && (!defined($maxPrice) || basePrice <= $maxPrice)
    && count(variants[
      isActive == true
      && stockQuantity > 0
      && (!defined($colorIds) || color._ref in $colorIds)
      && (!defined($sizeIds) || size._ref in $sizeIds)
    ]) > 0
  ])
`);

// =============================================================================
// CART QUERIES
// =============================================================================

/**
 * Fetch active cart with full product details for cart page
 * Joins cart items with product, variant, color, and size data
 */
export const CART_WITH_DETAILS_QUERY = defineQuery(`
  *[_type == "cart" && status == "active" && (
    (defined($userId) && user._ref == $userId) ||
    (defined($sessionId) && sessionId == $sessionId)
  )][0] {
    _id,
    items[] {
      _key,
      variantSku,
      quantity,
      priceSnapshot,
      "product": *[_type == "product" && _id == ^.product._ref][0] {
        _id,
        name,
        basePrice,
        thumbnail {
          asset-> { url }
        },
        "variant": variants[sku == ^.^.variantSku][0] {
          sku,
          stockQuantity,
          color-> {
            _id,
            name,
            hexCode
          },
          size-> {
            _id,
            name,
            code
          }
        }
      }
    }
  }
`);

export const GUEST_CART_WITH_DETAILS_QUERY = defineQuery(`
  *[_type == "cart" && status == "active" && sessionId == $sessionId
  ][0] {
    _id,
    items[] {
      _key,
      variantSku,
      quantity,
      priceSnapshot,
      "product": *[_type == "product" && _id == ^.product._ref][0] {
        _id,
        name,
        basePrice,
        thumbnail {
          asset-> { url }
        },
        "variant": variants[sku == ^.^.variantSku][0] {
          sku,
          stockQuantity,
          color-> {
            _id,
            name,
            hexCode
          },
          size-> {
            _id,
            name,
            code
          }
        }
      }
    }
  }
`);

export const USER_CART_WITH_DETAILS_QUERY = defineQuery(`
  *[_type == "cart" && status == "active" && user._ref == $userId
  ][0] {
    _id,
    items[] {
      _key,
      variantSku,
      quantity,
      priceSnapshot,
      "product": *[_type == "product" && _id == ^.product._ref][0] {
        _id,
        name,
        basePrice,
        thumbnail {
          asset-> { url }
        },
        "variant": variants[sku == ^.^.variantSku][0] {
          sku,
          stockQuantity,
          color-> {
            _id,
            name,
            hexCode
          },
          size-> {
            _id,
            name,
            code
          }
        }
      }
    }
  }
`);

export const USER_CART_QUERY = defineQuery(`
*[_type == "cart" && user._ref == $userId && status == "active"][0]
`);

export const GUEST_CART_QUERY = defineQuery(`
*[_type == "cart" && sessionId == $sessionId && status == "active"][0]
`);
