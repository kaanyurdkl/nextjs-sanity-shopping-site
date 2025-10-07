"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Size {
  _id: string;
  name: string;
  code: string;
  sortOrder: number;
}

interface SizeFilterProps {
  data: Size[];
}

export default function SizeFilter({ data }: SizeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedSizeNames, setSelectedSizeNames] = useState<string[]>([]);

  useEffect(() => {
    const sizesParam: string | null = searchParams.get("sizes");
    const currentSelectedSizeNames = sizesParam
      ? sizesParam
          .split(",")
          .map((sizeName) => sizeName.trim().toLowerCase())
      : [];

    setSelectedSizeNames(currentSelectedSizeNames);
  }, [searchParams]);

  function handleChange(size: Size, isChecked: boolean) {
    const changedSizeName = size.name.toLowerCase();

    let newSelectedSizeNames: string[];

    if (isChecked) {
      newSelectedSizeNames = [...selectedSizeNames, changedSizeName];
      setSelectedSizeNames(newSelectedSizeNames);
    } else {
      newSelectedSizeNames = selectedSizeNames.filter(
        (sizeName) => sizeName !== changedSizeName
      );
      setSelectedSizeNames(newSelectedSizeNames);
    }

    // Build new URL with updated filters
    const params = new URLSearchParams(searchParams.toString());

    if (newSelectedSizeNames.length > 0) {
      params.set("sizes", newSelectedSizeNames.join(","));
    } else {
      params.delete("sizes");
    }

    // Remove page parameter when filter changes (reset to page 1)
    params.delete("page");

    const newUrl = params.toString() ? `?${params.toString()}` : pathname;
    router.push(newUrl);
  }

  return (
    <div>
      <h4 className="font-medium mb-3">Size</h4>
      <div className="space-y-2">
        {data.map((size) => {
          return (
            <label
              key={size._id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                onChange={(e) => handleChange(size, Boolean(e.target.checked))}
                checked={selectedSizeNames?.includes(size.name.toLowerCase())}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm">{size.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
