"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Color {
  _id: string;
  name: string;
  hexCode: string;
}
interface ColorFilterProps {
  colors: Color[];
}

export default function ColorFilter({ colors }: ColorFilterProps) {
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

    if (newSelectedColorNames.length > 0) {
      const params = new URLSearchParams();

      params.set("colors", newSelectedColorNames.join(","));

      router.push(`?${params.toString()}`);
    } else {
      router.push(pathname);
    }
  }

  return (
    <div>
      <h4 className="font-medium mb-3">Color</h4>
      <div className="space-y-2">
        {colors.map((color) => {
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
