import type { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";
import ProductGrid from "@/components/ui/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import CategoryHeader from "@/components/ui/CategoryHeader";
import {
  getProductsCountByCategoryId,
  getProductsPaginatedByCategoryId,
} from "@/sanity/lib/utils";
import { redirect } from "next/navigation";
import { PRODUCTS_PER_PAGE } from "@/constants/pagination";

interface CategoryMainContentProps {
  slugArray: string[];
  searchParams?: { page?: string };
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
}

export default async function CategoryMainContent({
  slugArray,
  searchParams,
  category,
}: CategoryMainContentProps) {
  const basePath = `/${slugArray.join("/")}`;

  const currentPage = Number(searchParams?.page) || 1;

  // Handle invalid page number (redirect to page 1)
  if (currentPage < 1) {
    redirect(basePath);
  }

  // Get total count of products
  const totalCount = await getProductsCountByCategoryId(category._id);
  // Get total count of pages
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  // Handle invalid page number (redirect to page 1)
  if (totalPages > 0 && currentPage > totalPages) {
    redirect(basePath);
  }

  // Get category products of selected page
  const products = await getProductsPaginatedByCategoryId(
    category._id,
    currentPage
  );

  return (
    <main className="flex-1">
      <CategoryHeader title={category.title} totalCount={totalCount} />

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
  );
}
