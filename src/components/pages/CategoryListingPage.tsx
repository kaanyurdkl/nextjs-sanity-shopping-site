import type { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CategorySidebar from "@/components/ui/CategorySidebar";
import ProductGrid from "@/components/ui/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import {
  getProductsCountByCategoryId,
  getProductsPaginatedByCategoryId,
} from "@/sanity/lib/utils";
import { redirect } from "next/navigation";

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
  const currentPage = Number(searchParams?.page) || 1;

  // Handle invalid page numbers
  if (currentPage < 1) {
    const basePath = `/${slugArray.join("/")}`;
    redirect(basePath);
  }

  const pageSize = 3; // Products per page

  // Step 1: Get total count first (Sequential Logic)
  const totalCount = await getProductsCountByCategoryId(category._id);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Handle invalid page numbers (redirect to page 1)
  if (totalPages > 0 && currentPage > totalPages) {
    const basePath = `/${slugArray.join("/")}`;
    redirect(basePath);
  }

  // Step 2: Get products for current page
  const products = await getProductsPaginatedByCategoryId(
    category._id,
    currentPage,
    pageSize
  );

  const basePath = `/${slugArray.join("/")}`;

  return (
    <div className="max-w-8xl mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs slugArray={slugArray} />

      <div className="flex gap-8">
        {/* Category Sidebar */}
        <CategorySidebar category={category} slugArray={slugArray} />

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">
              {category.title}
            </h1>
            {totalCount > 0 && (
              <p className="text-gray-600">{totalCount} products</p>
            )}
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={basePath}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
