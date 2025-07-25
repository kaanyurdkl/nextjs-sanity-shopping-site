import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Category document type for organizing content
 * 
 * Used to categorize and group related content (posts, products, etc.)
 * Features:
 * - title: Display name for the category
 * - slug: URL-friendly identifier auto-generated from title
 * - description: Optional description text
 */
export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],
})
