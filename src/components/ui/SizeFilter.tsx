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

  const [selectedSizeCodes, setSelectedSizeCodes] = useState<string[]>([]);

  useEffect(() => {
    const sizesParam: string | null = searchParams.get("sizes");
    const currentSelectedSizeCodes = sizesParam
      ? sizesParam.split(",").map((sizeCode) => sizeCode.trim().toLowerCase())
      : [];

    setSelectedSizeCodes(currentSelectedSizeCodes);
  }, [searchParams]);

  function handleChange(size: Size, isChecked: boolean) {
    const changedSizeCode = size.code.toLowerCase();

    let newSelectedSizeCodes: string[];

    if (isChecked) {
      newSelectedSizeCodes = [...selectedSizeCodes, changedSizeCode];
      setSelectedSizeCodes(newSelectedSizeCodes);
    } else {
      newSelectedSizeCodes = selectedSizeCodes.filter(
        (sizeCode) => sizeCode !== changedSizeCode
      );
      setSelectedSizeCodes(newSelectedSizeCodes);
    }

    // Build new URL with updated filters
    const params = new URLSearchParams(searchParams.toString());

    if (newSelectedSizeCodes.length > 0) {
      params.set("sizes", newSelectedSizeCodes.join(","));
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
                checked={selectedSizeCodes?.includes(size.code.toLowerCase())}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm">{size.code}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
