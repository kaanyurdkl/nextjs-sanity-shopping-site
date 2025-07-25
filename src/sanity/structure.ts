import type {StructureResolver} from 'sanity/structure'

/**
 * Customizes the structure and navigation of your Sanity Studio
 * 
 * This controls how content types are organized in the studio sidebar,
 * allowing you to group related content, add custom sections, and
 * create a better content management experience.
 * 
 * Learn more: https://www.sanity.io/docs/structure-builder-cheat-sheet
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Blog') // Main sidebar title - change this for your e-commerce site
    .items([
      // Custom document type items with friendly titles
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      
      // Visual separator between sections
      S.divider(),
      
      // Automatically include any other document types not explicitly listed above
      // This ensures new schemas are still accessible in the studio
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'author'].includes(item.getId()!),
      ),
    ])
