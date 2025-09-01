import type {
  PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult,
} from "@/sanity/types/sanity.types";
import ProductCard from "./ProductCard";

type Products = PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult;

interface ProductGridProps {
  products: Products;
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            There are no products in this category yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Results count */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Showing {products.length} products
        </p>
      </div>
    </div>
  );
}
