"use client";

import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { Suspense } from "react";
import type { PRODUCTS_WITH_FILTERS_QUERYResult } from "@/services/sanity/types/sanity.types";

interface ProductGridProps {
  products: PRODUCTS_WITH_FILTERS_QUERYResult;
  columns: number;
  totalPages: number;
}

export default function ProductGrid({ products, columns, totalPages }: ProductGridProps) {
  const gridClass = columns === 2
    ? "grid grid-cols-1 gap-6 sm:grid-cols-2"
    : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <section className={gridClass}>
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
    </>
  );
}
