import { type SchemaTypeDefinition } from 'sanity'

import {addressType} from './addressType'
import {blockContentType} from './blockContentType'
import {productType} from './productType'
import {reviewType} from './reviewType'
import {userType} from './userType'
import {orderType} from './orderType'
import {promotionType} from './promotionType'

/**
 * Schema registry for all content types in your Sanity project
 * 
 * This is where you register all your document types, object types,
 * and other schema definitions. Every schema you create must be
 * imported and added to the types array to be available in Sanity Studio.
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Object types (reusable components)
    addressType,
    
    // Content types
    blockContentType,
    
    // E-commerce core
    productType,
    reviewType,
    userType,
    orderType,
    promotionType,
  ],
}
