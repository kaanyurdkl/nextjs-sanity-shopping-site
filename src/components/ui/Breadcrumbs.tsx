import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import BreadcrumbItem from "./BreadcrumbItem";

interface BreadcrumbsProps {
  /**
   * Array of URL slug segments to build breadcrumbs from
   * Example: ['mens', 'tops', 'shirts', 't-shirts']
   */
  slugArray: string[];
  
  /**
   * Optional className for custom styling
   */
  className?: string;
}

/**
 * Breadcrumbs component for hierarchical navigation
 * Uses URL path segments to generate navigation breadcrumbs
 * 
 * Features:
 * - Unlimited hierarchy depth support
 * - Automatic slug-to-label formatting
 * - Accessible markup with proper ARIA labels
 * - Responsive design with proper hover states
 */
export default function Breadcrumbs({ slugArray, className = "" }: BreadcrumbsProps) {
  const breadcrumbItems = buildBreadcrumbs(slugArray);

  return (
    <nav aria-label="Breadcrumb" className={`mb-6 ${className}`}>
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem 
            key={item.href} 
            item={item} 
            showSeparator={index > 0} 
          />
        ))}
      </ol>
    </nav>
  );
}