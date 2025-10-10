// COMPONENTS
import { Suspense } from "react";
import CategoryHeader from "@/components/ui/CategoryHeader";
import Sidebar from "@/components/ui/Sidebar";
import ProductList from "@/components/ui/ProductList";
import SortFilter from "@/components/ui/SortFilter";
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";
// TYPES
import type { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";
import ActiveFilters from "../ui/ActiveFilters";

interface CategoryListingPageProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  searchParams?: { page?: string; colors?: string; sizes?: string; minPrice?: string; maxPrice?: string; sort?: string };
}

export default async function CategoryListingPage({
  category,
  searchParams,
}: CategoryListingPageProps) {
  return (
    <main className="max-w-8xl mx-auto px-6 py-8">
      <div className="flex gap-8">
        <Sidebar category={category} searchParams={searchParams} />

        <section className="flex-1">
          <CategoryHeader title={category.title} />

          <ActiveFilters />

          <SortFilter />

          <Suspense
            fallback={<ProductGridSkeleton />}
            key={JSON.stringify(searchParams)}
          >
            <ProductList searchParams={searchParams} category={category} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
