import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="group relative">
      {/* Product Image Skeleton */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Product Info Skeleton */}
      <div className="mt-4 space-y-4">
        <div className="space-y-1">
          {/* Product Name Skeleton */}
          <Skeleton className="h-5 w-3/4" />
          {/* Price Skeleton */}
          <Skeleton className="h-5 w-1/4" />
        </div>
        {/* Available Colors Skeleton */}
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
    </div>
  );
}
