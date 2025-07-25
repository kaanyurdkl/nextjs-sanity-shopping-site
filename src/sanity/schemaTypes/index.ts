import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'

/**
 * Schema registry for all content types in your Sanity project
 * 
 * This is where you register all your document types, object types,
 * and other schema definitions. Every schema you create must be
 * imported and added to the types array to be available in Sanity Studio.
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType],
}
