"use client";

// LIBRARIES
import { useRouter, usePathname, useSearchParams } from "next/navigation";
// STORE
import { useFilterStore } from "@/stores/filter-store";

export default function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    selectedColors,
    selectedSizes,
    removeColor,
    removeSize,
    clearPriceRange,
    clearAll: clearStore,
  } = useFilterStore();

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const hasPriceFilter = minPriceParam || maxPriceParam;

  const hasActiveFilters =
    selectedColors.length > 0 || selectedSizes.length > 0 || hasPriceFilter;

  function removeColorFilter(colorId: string, colorName: string) {
    removeColor(colorId);

    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("colors")?.split(",") || [];
    const updated = current.filter(
      (v) => v.toLowerCase() !== colorName.toLowerCase()
    );

    if (updated.length > 0) {
      params.set("colors", updated.join(","));
    } else {
      params.delete("colors");
    }

    params.delete("page");

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl);
  }

  function removeSizeFilter(sizeId: string, sizeCode: string) {
    removeSize(sizeId);

    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("sizes")?.split(",") || [];
    const updated = current.filter(
      (v) => v.toLowerCase() !== sizeCode.toLowerCase()
    );

    if (updated.length > 0) {
      params.set("sizes", updated.join(","));
    } else {
      params.delete("sizes");
    }

    params.delete("page");

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl);
  }

  function removePriceFilter() {
    clearPriceRange();

    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl);
  }

  function clearAll() {
    clearStore();

    const params = new URLSearchParams(searchParams.toString());
    params.delete("colors");
    params.delete("sizes");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl);
  }

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-sm font-medium">Active Filters:</span>

        {selectedColors.map((color) => (
          <button
            key={`color-${color._id}`}
            onClick={() => removeColorFilter(color._id, color.name)}
            className="px-3 py-1 cursor-pointer bg-black text-white text-sm flex items-center gap-2 hover:bg-gray-800"
          >
            {color.name}
            <span>✕</span>
          </button>
        ))}

        {selectedSizes.map((size) => (
          <button
            key={`size-${size._id}`}
            onClick={() => removeSizeFilter(size._id, size.code)}
            className="px-3 py-1 cursor-pointer bg-black text-white text-sm flex items-center gap-2 hover:bg-gray-800"
          >
            {size.code}
            <span>✕</span>
          </button>
        ))}

        {hasPriceFilter && (
          <button
            onClick={removePriceFilter}
            className="px-3 py-1 cursor-pointer bg-black text-white text-sm flex items-center gap-2 hover:bg-gray-800"
          >
            ${minPriceParam || "0"} - ${maxPriceParam || "0"}
            <span>✕</span>
          </button>
        )}

        <button
          onClick={clearAll}
          className="text-sm cursor-pointer underline hover:no-underline"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
