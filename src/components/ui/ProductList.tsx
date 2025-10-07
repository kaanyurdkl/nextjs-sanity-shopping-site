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

interface ProductListProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  searchParams?: { page?: string; colors?: string; sizes?: string };
}

export default async function ProductList({
  category,
  searchParams,
}: ProductListProps) {
  const currentPage = Number(searchParams?.page) || 1;

  // Parse filter parameters
  let colorIds: string[] | null = null;
  let sizeIds: string[] | null = null;

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

  // Fetch products and count using unified filter approach
  const products = await getProductsWithFilters(
    category._id,
    currentPage,
    colorIds,
    sizeIds
  );

  const productsCount = await getProductsCountWithFilters(
    category._id,
    colorIds,
    sizeIds
  );

  const totalPages = Math.ceil(productsCount / PRODUCTS_PER_PAGE);

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-600">{productsCount} products</p>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mb-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>

      {totalPages && totalPages > 1 && (
        <nav aria-label="Product pagination">
          <Pagination totalPages={totalPages} />
        </nav>
      )}
    </div>
  );
}
