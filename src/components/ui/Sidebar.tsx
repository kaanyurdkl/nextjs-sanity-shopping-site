// COMPONENTS
import CategoryFilters from "@/components/ui/CategoryFilters";
import CategorySelectors from "@/components/ui/CategorySelectors";
// TYPES
import type { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";

interface SidebarProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
}

export default async function Sidebar({ category }: SidebarProps) {
  const categoryHasFilters =
    category.enableColorFilter ||
    category.enableSizeFilter ||
    category.enablePriceFilter;

  return (
    <aside className="w-48 flex-shrink-0">
      <nav aria-label="Category navigation">
        <CategorySelectors category={category} />
      </nav>
      {categoryHasFilters && (
        <section aria-label="Product filters">
          <CategoryFilters category={category} />
        </section>
      )}
    </aside>
  );
}
