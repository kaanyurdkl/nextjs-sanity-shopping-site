// COMPONENTS
import CategoryFilters from "@/components/ui/CategoryFilters";
import CategorySelectors from "@/components/ui/CategorySelectors";
// TYPES
import type { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";

interface SidebarProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  searchParams?: { page?: string; colors?: string; sizes?: string };
}

export default async function Sidebar({
  category,
  searchParams,
}: SidebarProps) {
  const categoryHasFilters =
    category.enableColorFilter ||
    category.enableSizeFilter ||
    category.enablePriceFilter;

  console.log("Sidebar");

  return (
    <aside className="w-64 flex-shrink-0">
      <nav aria-label="Category navigation">
        <CategorySelectors category={category} />
      </nav>
      {categoryHasFilters && (
        <section aria-label="Product filters">
          <CategoryFilters category={category} searchParams={searchParams} />
        </section>
      )}
    </aside>
  );
}
