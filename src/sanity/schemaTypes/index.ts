import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'

/**
 * Schema registry for all content types in your Sanity project
 * 
 * This is where you register all your document types, object types,
 * and other schema definitions. Every schema you create must be
 * imported and added to the types array to be available in Sanity Studio.
 * 
 * Current schemas:
 * - blockContentType: Rich text content blocks
 * - categoryType: Content categories/tags
 * - postType: Blog post documents
 * - authorType: Author profiles
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType],
}
