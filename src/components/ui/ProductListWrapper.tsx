"use client";

import { useState } from "react";
import { Suspense } from "react";
import LayoutToggle from "@/components/ui/LayoutToggle";
import ProductGrid from "@/components/ui/ProductGrid";
import type { PRODUCTS_WITH_FILTERS_QUERYResult } from "@/services/sanity/types/sanity.types";

interface ProductListWrapperProps {
  products: PRODUCTS_WITH_FILTERS_QUERYResult;
  productsCount: number;
  totalPages: number;
}

export default function ProductListWrapper({
  products,
  productsCount,
  totalPages,
}: ProductListWrapperProps) {
  const [gridColumns, setGridColumns] = useState<number>(3);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{productsCount} products</p>
        <LayoutToggle onLayoutChange={setGridColumns} />
      </div>

      <Suspense fallback={null}>
        <ProductGrid products={products} columns={gridColumns} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
