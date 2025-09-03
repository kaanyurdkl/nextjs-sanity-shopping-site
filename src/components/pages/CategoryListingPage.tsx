import type { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CategorySidebar from "@/components/ui/CategorySidebar";
import CategoryMainContent from "@/components/ui/CategoryMainContent";

interface CategoryListingPageProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  slugArray: string[];
  searchParams?: { page?: string };
}

export default async function CategoryListingPage({
  category,
  slugArray,
  searchParams,
}: CategoryListingPageProps) {
  return (
    <div className="max-w-8xl mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs slugArray={slugArray} />

      <div className="flex gap-8">
        {/* Category Sidebar */}
        <CategorySidebar category={category} slugArray={slugArray} />

        {/* Main Content */}
        <CategoryMainContent
          slugArray={slugArray}
          searchParams={searchParams}
          category={category}
        />
      </div>
    </div>
  );
}
