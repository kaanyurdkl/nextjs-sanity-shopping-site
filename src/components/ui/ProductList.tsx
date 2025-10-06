// COMPONENTS
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/Pagination";
// UTILS
import {
  getColorsByName,
  getFilteredProductsCountByCategoryId,
  getPaginatedFilteredProductsByCategoryId,
  getPaginatedProductsByCategoryId,
  getProductsCountByCategoryId,
} from "@/sanity/lib/utils";
// TYPES
import { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";
// CONSTANTS
import { PRODUCTS_PER_PAGE } from "@/constants/pagination";

interface ProductListProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  searchParams?: { page?: string; colors?: string };
}

export default async function ProductList({
  category,
  searchParams,
}: ProductListProps) {
  let products;
  let productsCount;

  const currentPage = Number(searchParams?.page) || 1;
  let totalPages;

  if (searchParams?.colors) {
    const colorParamsArray = searchParams.colors.split(",");

    const colors = await getColorsByName(colorParamsArray);

    const colorIds = colors.map((color) => color._id);

    products = await getPaginatedFilteredProductsByCategoryId(
      category._id,
      colorIds,
      currentPage
    );

    productsCount = await getFilteredProductsCountByCategoryId(
      category._id,
      colorIds
    );
  } else {
    products = await getPaginatedProductsByCategoryId(
      category._id,
      currentPage
    );

    productsCount = await getProductsCountByCategoryId(category._id);
  }

  totalPages = Math.ceil(productsCount / PRODUCTS_PER_PAGE);

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
