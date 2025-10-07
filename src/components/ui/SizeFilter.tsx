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

interface Size {
  _id: string;
  name: string;
  code: string;
  sortOrder: number;
  productCount: number;
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
    <Accordion type="single" className="border border-black px-2" collapsible>
      <AccordionItem value="colorFilter">
        <AccordionTrigger className="cursor-pointer uppercase font-bold">
          Size
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2 pt-2">
            {data.map((size) => {
              const isSelected = selectedSizeCodes?.includes(
                size.code.toLowerCase()
              );
              return (
                <button
                  key={size._id}
                  onClick={() => handleChange(size, !isSelected)}
                  className={`p-2 text-sm space-x-1 font-medium cursor-pointer border transition-colors border-black ${
                    isSelected
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-white hover:bg-gray-100 text-black"
                  }`}
                >
                  <span>{size.code}</span> <span>[{size.productCount}]</span>
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
