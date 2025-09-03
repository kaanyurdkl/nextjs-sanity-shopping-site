import type { PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult } from "@/sanity/types/sanity.types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult;
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
