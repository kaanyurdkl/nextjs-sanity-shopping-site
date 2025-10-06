// COMPONENTS
import { Suspense } from "react";
import CategoryHeader from "@/components/ui/CategoryHeader";
import Sidebar from "@/components/ui/Sidebar";
import ProductList from "@/components/ui/ProductList";
// TYPES
import type { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";

interface CategoryListingPageProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  searchParams?: { page?: string; colors?: string };
}

export default async function CategoryListingPage({
  category,
  searchParams,
}: CategoryListingPageProps) {
  return (
    <main className="max-w-8xl mx-auto px-6 py-8">
      <div className="flex gap-8">
        <Sidebar category={category} />

        <section className="flex-1">
          <CategoryHeader title={category.title} />

          <Suspense
            fallback={<div className="text-center py-8">Loading...</div>}
            key={JSON.stringify(searchParams)}
          >
            <ProductList searchParams={searchParams} category={category} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
