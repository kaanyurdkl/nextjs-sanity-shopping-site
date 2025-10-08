"use client";

// LIBRARIES
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const colors = searchParams.get("colors")?.split(",") || [];
  const sizes = searchParams.get("sizes")?.split(",") || [];

  const hasActiveFilters = colors.length > 0 || sizes.length > 0;

  function removeFilter(type: "colors" | "sizes", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(type)?.split(",") || [];
    const updated = current.filter(
      (v) => v.toLowerCase() !== value.toLowerCase()
    );

    if (updated.length > 0) {
      params.set(type, updated.join(","));
    } else {
      params.delete(type);
    }

    params.delete("page");

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("colors");
    params.delete("sizes");
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

        {colors.map((color) => (
          <button
            key={`color-${color}`}
            onClick={() => removeFilter("colors", color)}
            className="px-3 py-1 bg-black text-white text-sm flex items-center gap-2 hover:bg-gray-800"
          >
            {color}
            <span>✕</span>
          </button>
        ))}

        {sizes.map((size) => (
          <button
            key={`size-${size}`}
            onClick={() => removeFilter("sizes", size)}
            className="px-3 py-1 bg-black text-white text-sm flex items-center gap-2 hover:bg-gray-800"
          >
            {size}
            <span>✕</span>
          </button>
        ))}

        <button
          onClick={clearAll}
          className="text-sm underline hover:no-underline"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
