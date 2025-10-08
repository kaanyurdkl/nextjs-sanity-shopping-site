"use client";

// LIBRARIES
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
// COMPONENTS
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// STORE
import { useFilterStore } from "@/stores/filter-store";

interface Color {
  _id: string;
  name: string;
  hexCode: string;
  productCount: number;
}
interface ColorFilterProps {
  data: Color[];
}

export default function ColorFilter({ data }: ColorFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { addColor, removeColor, selectedColors } = useFilterStore();
  const [selectedColorNames, setSelectedColorNames] = useState<string[]>([]);

  // Sync Zustand store with URL params on mount/change
  useEffect(() => {
    const colorsParam: string | null = searchParams.get("colors");
    const currentSelectedColorNames = colorsParam
      ? colorsParam
          .split(",")
          .map((colorName) => colorName.trim().toLowerCase())
      : [];

    setSelectedColorNames(currentSelectedColorNames);

    // Sync store with URL - add colors that are in URL but not in store
    currentSelectedColorNames.forEach((colorName) => {
      const colorInData = data.find((c) => c.name.toLowerCase() === colorName);
      const isInStore = selectedColors.some(
        (c) => c.name.toLowerCase() === colorName
      );

      if (colorInData && !isInStore) {
        addColor({
          _id: colorInData._id,
          name: colorInData.name,
          hexCode: colorInData.hexCode,
        });
      }
    });

    // Remove colors from store that are not in URL
    selectedColors.forEach((color) => {
      const isInUrl = currentSelectedColorNames.includes(
        color.name.toLowerCase()
      );
      if (!isInUrl) {
        removeColor(color._id);
      }
    });
  }, [searchParams, data, selectedColors, addColor, removeColor]);

  function handleChange(color: Color, isChecked: Boolean) {
    const changedColorName = color.name.toLowerCase();

    // Update Zustand store
    if (isChecked) {
      addColor({
        _id: color._id,
        name: color.name,
        hexCode: color.hexCode,
      });
    } else {
      removeColor(color._id);
    }

    // Update URL
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
    <Accordion
      type="single"
      className="border border-black px-4"
      collapsible
      defaultValue="colorFilter"
    >
      <AccordionItem value="colorFilter">
        <AccordionTrigger className="cursor-pointer uppercase font-bold">
          Colour
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 pt-2">
            {data.map((color) => {
              const isChecked = selectedColorNames?.includes(
                color.name.toLowerCase()
              );
              return (
                <div
                  key={color._id}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleChange(color, !isChecked)}
                >
                  <div className="w-4 h-4 border border-black flex items-center justify-center bg-white flex-shrink-0">
                    {isChecked && <div className="w-3 h-3 bg-black" />}
                  </div>
                  <span className="text-sm">{color.name}</span>
                  <span className="text-sm">[{color.productCount}]</span>
                  <div
                    className="w-6 h-6 border border-black ml-auto flex-shrink-0"
                    style={{ backgroundColor: color.hexCode }}
                  />
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
