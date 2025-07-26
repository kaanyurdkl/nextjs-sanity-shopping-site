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
    .title('E-commerce Studio')
    .items([
      // E-commerce content types
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('review').title('Customer Reviews'),
      
      // Visual separator between sections
      S.divider(),
      
      // Automatically include any other document types not explicitly listed above
      // This ensures new schemas are still accessible in the studio
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['product', 'review'].includes(item.getId()!),
      ),
    ])
