// COMPONENTS
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/Pagination";
// UTILS
import {
  getColorsByName,
  getSizesByCode,
  getProductsWithFilters,
  getProductsCountWithFilters,
} from "@/sanity/lib/utils";
// TYPES
import { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";
// CONSTANTS
import { PRODUCTS_PER_PAGE } from "@/constants/pagination";
import { Suspense } from "react";

interface ProductListProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  searchParams?: { page?: string; colors?: string; sizes?: string; minPrice?: string; maxPrice?: string };
}

export default async function ProductList({
  category,
  searchParams,
}: ProductListProps) {
  const currentPage = Number(searchParams?.page) || 1;

  // Parse filter parameters
  let colorIds: string[] | null = null;
  let sizeIds: string[] | null = null;
  let minPrice: number | null = null;
  let maxPrice: number | null = null;

  if (searchParams?.colors) {
    const colorNames = searchParams.colors.split(",");
    const colors = await getColorsByName(colorNames);
    colorIds = colors.map((color) => color._id);
  }

  if (searchParams?.sizes) {
    const sizeCodes = searchParams.sizes.split(",");
    const sizes = await getSizesByCode(sizeCodes);
    sizeIds = sizes.map((size) => size._id);
  }

  if (searchParams?.minPrice) {
    minPrice = parseFloat(searchParams.minPrice);
  }

  if (searchParams?.maxPrice) {
    maxPrice = parseFloat(searchParams.maxPrice);
  }

  // Fetch products and count using unified filter approach
  const products = await getProductsWithFilters(
    category._id,
    currentPage,
    colorIds,
    sizeIds,
    minPrice,
    maxPrice
  );

  const productsCount = await getProductsCountWithFilters(
    category._id,
    colorIds,
    sizeIds,
    minPrice,
    maxPrice
  );

  const totalPages = Math.ceil(productsCount / PRODUCTS_PER_PAGE);

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-600">{productsCount} products</p>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>

      {totalPages && totalPages > 1 && (
        <nav aria-label="Product pagination">
          <Suspense fallback={null}>
            <Pagination totalPages={totalPages} />
          </Suspense>
        </nav>
      )}
    </div>
  );
}
