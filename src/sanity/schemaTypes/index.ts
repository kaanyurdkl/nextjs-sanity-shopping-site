import { type SchemaTypeDefinition } from 'sanity'

// Object types (embedded content)
import {addressType} from './objects/addressType'
import {blockContentType} from './objects/blockContentType'

// Document types (top-level content)
import {productType} from './documents/productType'
import {reviewType} from './documents/reviewType'
import {userType} from './documents/userType'
import {orderType} from './documents/orderType'
import {promotionType} from './documents/promotionType'

/**
 * Schema registry for all content types in your Sanity project
 * 
 * This is where you register all your document types, object types,
 * and other schema definitions. Every schema you create must be
 * imported and added to the types array to be available in Sanity Studio.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Object types (reusable components)
  addressType,
  blockContentType,
  
  // Document types (top-level content)
  productType,
  reviewType,
  userType,
  orderType,
  promotionType,
]

// Legacy export for compatibility
export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
