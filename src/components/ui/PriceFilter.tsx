"use client";

// LIBRARIES
import { useState, useEffect, useRef } from "react";
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
// TYPES
import type { GET_PRICE_RANGE_FOR_CATEGORY_QUERYResult } from "@/sanity/types/sanity.types";

interface PriceFilterProps {
  data: GET_PRICE_RANGE_FOR_CATEGORY_QUERYResult;
}

export default function PriceFilter({ data }: PriceFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { setPriceRange } = useFilterStore();

  const minPrice = data.minPrice ?? 0;
  const maxPrice = data.maxPrice ?? 100;

  const [localMin, setLocalMin] = useState<number>(minPrice);
  const [localMax, setLocalMax] = useState<number>(maxPrice);
  const [minInputValue, setMinInputValue] = useState<string>(minPrice.toFixed(0));
  const [maxInputValue, setMaxInputValue] = useState<string>(maxPrice.toFixed(0));
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  // Sync with URL on mount
  useEffect(() => {
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");

    const min = urlMinPrice ? parseFloat(urlMinPrice) : minPrice;
    const max = urlMaxPrice ? parseFloat(urlMaxPrice) : maxPrice;

    setLocalMin(min);
    setLocalMax(max);
    setMinInputValue(min.toFixed(0));
    setMaxInputValue(max.toFixed(0));
    setPriceRange({ min, max });
    setHasChanges(false);
  }, [searchParams, minPrice, maxPrice, setPriceRange]);

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInputValue(e.target.value);
    setHasChanges(true);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInputValue(e.target.value);
    setHasChanges(true);
  };

  const handleMinInputBlur = () => {
    const value = parseFloat(minInputValue) || minPrice;
    const clampedValue = Math.min(Math.max(value, minPrice), localMax);

    setLocalMin(clampedValue);
    setMinInputValue(clampedValue.toFixed(0));
  };

  const handleMaxInputBlur = () => {
    const value = parseFloat(maxInputValue) || maxPrice;
    const clampedValue = Math.max(Math.min(value, maxPrice), localMin);

    setLocalMax(clampedValue);
    setMaxInputValue(clampedValue.toFixed(0));
  };

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (localMin > minPrice || localMax < maxPrice) {
      params.set("minPrice", localMin.toFixed(0));
      params.set("maxPrice", localMax.toFixed(0));
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    params.delete("page");

    setPriceRange({ min: localMin, max: localMax });
    setHasChanges(false);

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl);
  };

  const handleSliderMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    handle: "min" | "max"
  ) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      const value = minPrice + percentage * (maxPrice - minPrice);

      if (isDragging === "min") {
        const newMin = Math.min(value, localMax);
        setLocalMin(newMin);
        setMinInputValue(newMin.toFixed(0));
        setHasChanges(true);
      } else {
        const newMax = Math.max(value, localMin);
        setLocalMax(newMax);
        setMaxInputValue(newMax.toFixed(0));
        setHasChanges(true);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(null);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, localMin, localMax, minPrice, maxPrice]);

  const minPercentage = ((localMin - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercentage = ((localMax - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <Accordion
      type="single"
      className="border border-black px-4"
      collapsible
      defaultValue="priceFilter"
    >
      <AccordionItem value="priceFilter">
        <AccordionTrigger className="cursor-pointer uppercase font-bold">
          Price
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            {/* Price Inputs */}
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    value={minInputValue}
                    onChange={handleMinInputChange}
                    onBlur={handleMinInputBlur}
                    className="w-full border border-black px-6 py-1 text-sm"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    value={maxInputValue}
                    onChange={handleMaxInputChange}
                    onBlur={handleMaxInputBlur}
                    className="w-full border border-black px-6 py-1 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Dual Handle Slider */}
            <div className="relative pt-2 pb-4 px-2">
              <div
                ref={sliderRef}
                className="relative h-1 bg-gray-300 cursor-pointer"
              >
                {/* Active Range */}
                <div
                  className="absolute h-full bg-black"
                  style={{
                    left: `${minPercentage}%`,
                    right: `${100 - maxPercentage}%`,
                  }}
                />

                {/* Min Handle */}
                <div
                  className="absolute w-4 h-4 bg-black cursor-pointer -translate-x-1/2 -translate-y-1/2 top-1/2"
                  style={{ left: `${minPercentage}%` }}
                  onMouseDown={(e) => handleSliderMouseDown(e, "min")}
                />

                {/* Max Handle */}
                <div
                  className="absolute w-4 h-4 bg-black cursor-pointer -translate-x-1/2 -translate-y-1/2 top-1/2"
                  style={{ left: `${maxPercentage}%` }}
                  onMouseDown={(e) => handleSliderMouseDown(e, "max")}
                />
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyFilter}
              disabled={!hasChanges}
              className="w-full bg-black text-white py-2 text-sm font-medium uppercase disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
