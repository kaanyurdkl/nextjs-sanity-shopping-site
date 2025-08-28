/**
 * Breadcrumb utilities for URL-path based navigation
 * Converts slug arrays into breadcrumb items with proper formatting
 */

export interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

/**
 * Formats a slug segment into a readable breadcrumb label
 * Examples: "mens" → "Mens", "t-shirts" → "T Shirts", "dress-shirts" → "Dress Shirts"
 */
export function formatSlugForBreadcrumb(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Builds breadcrumb items from a URL slug array
 * Creates incremental paths for navigation hierarchy
 * 
 * @param slugArray - Array of URL segments (e.g., ['mens', 'tops', 'shirts'])
 * @returns Array of breadcrumb items with labels, hrefs, and isLast flags
 * 
 * Example:
 * Input: ['mens', 'tops', 'shirts']
 * Output: [
 *   { label: 'Home', href: '/', isLast: false },
 *   { label: 'Mens', href: '/mens', isLast: false },
 *   { label: 'Tops', href: '/mens/tops', isLast: false },
 *   { label: 'Shirts', href: '/mens/tops/shirts', isLast: true }
 * ]
 */
export function buildBreadcrumbs(slugArray: string[]): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '/',
      isLast: false,
    },
  ];

  // Build incremental paths for each slug segment
  slugArray.forEach((slug, index) => {
    const href = '/' + slugArray.slice(0, index + 1).join('/');
    const isLast = index === slugArray.length - 1;
    
    breadcrumbs.push({
      label: formatSlugForBreadcrumb(slug),
      href,
      isLast,
    });
  });

  return breadcrumbs;
}