import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

interface ProductGridSkeletonProps {
  columns?: number;
  count?: number;
}

export default function ProductGridSkeleton({
  columns = 3,
  count = 3,
}: ProductGridSkeletonProps) {
  const gridClass =
    columns === 2
      ? "grid grid-cols-1 gap-6 sm:grid-cols-2"
      : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className={gridClass}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </section>
  );
}
