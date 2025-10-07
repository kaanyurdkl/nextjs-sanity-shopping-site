"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Color {
  _id: string;
  name: string;
  hexCode: string;
}
interface ColorFilterProps {
  data: Color[];
}

export default function ColorFilter({ data }: ColorFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedColorNames, setSelectedColorNames] = useState<string[]>([]);

  useEffect(() => {
    const colorsParam: string | null = searchParams.get("colors");
    const currentSelectedColorNames = colorsParam
      ? colorsParam
          .split(",")
          .map((colorName) => colorName.trim().toLowerCase())
      : [];

    setSelectedColorNames(currentSelectedColorNames);
  }, [searchParams]);

  function handleChange(color: Color, isChecked: Boolean) {
    const changedColorName = color.name.toLowerCase();

    let newSelectedColorNames: string[];

    if (isChecked) {
      newSelectedColorNames = [...selectedColorNames, changedColorName];
      setSelectedColorNames(newSelectedColorNames);
    } else {
      newSelectedColorNames = selectedColorNames.filter(
        (colorName) => colorName !== changedColorName
      );
      setSelectedColorNames(newSelectedColorNames);
    }

    // Build new URL with updated filters
    const params = new URLSearchParams(searchParams.toString());

    if (newSelectedColorNames.length > 0) {
      params.set("colors", newSelectedColorNames.join(","));
    } else {
      params.delete("colors");
    }

    // Remove page parameter when filter changes (reset to page 1)
    params.delete("page");

    const newUrl = params.toString() ? `?${params.toString()}` : pathname;
    router.push(newUrl);
  }

  return (
    <div>
      <h4 className="font-medium mb-3">Color</h4>
      <div className="space-y-2">
        {data.map((color) => {
          return (
            <label
              key={color._id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                onChange={(e) => handleChange(color, Boolean(e.target.checked))}
                checked={selectedColorNames?.includes(color.name.toLowerCase())}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm">{color.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
