"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface ColorFilterProps {
  colors: Array<{
    _id: string;
    name: string;
    hexCode: string;
  }>;
  selectedColorNames: string[];
}

export default function ColorFilter({
  colors,
  selectedColorNames,
}: ColorFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleColorChange = useCallback(
    (colorName: string, checked: boolean) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      const currentColors = currentParams.get("colors")?.split(",") || [];

      let newColors: string[];
      if (checked) {
        // Add color if not already present
        newColors = currentColors.includes(colorName)
          ? currentColors
          : [...currentColors, colorName];
      } else {
        // Remove color
        newColors = currentColors.filter(c => c !== colorName);
      }

      // Update URL
      if (newColors.length > 0 && newColors[0] !== "") {
        currentParams.set("colors", newColors.join(","));
      } else {
        currentParams.delete("colors");
      }

      // Reset to page 1 when filters change
      currentParams.delete("page");

      // Navigate to new URL
      const newUrl = currentParams.toString()
        ? `?${currentParams.toString()}`
        : window.location.pathname;

      router.push(newUrl);
    },
    [router, searchParams]
  );

  return (
    <div>
      <h4 className="font-medium mb-3">Color</h4>
      <div className="space-y-2">
        {colors.map((color) => {
          const isChecked = selectedColorNames.includes(color.name.toLowerCase());
          return (
            <label
              key={color._id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleColorChange(color.name, e.target.checked)}
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