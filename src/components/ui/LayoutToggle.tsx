"use client";

import { useState } from "react";
import { Grid2x2, Grid3x3 } from "lucide-react";

interface LayoutToggleProps {
  onLayoutChange: (columns: number) => void;
}

export default function LayoutToggle({ onLayoutChange }: LayoutToggleProps) {
  const [currentLayout, setCurrentLayout] = useState<number>(3);

  const handleLayoutChange = (columns: number) => {
    setCurrentLayout(columns);
    onLayoutChange(columns);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLayoutChange(2)}
        className={`p-2 border cursor-pointer border-black transition-colors ${
          currentLayout === 2
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-white text-black hover:bg-gray-100"
        }`}
        aria-label="2 column layout"
      >
        <Grid2x2 size={20} />
      </button>
      <button
        onClick={() => handleLayoutChange(3)}
        className={`p-2 border cursor-pointer border-black transition-colors ${
          currentLayout === 3
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-white text-black hover:bg-gray-100"
        }`}
        aria-label="3 column layout"
      >
        <Grid3x3 size={20} />
      </button>
    </div>
  );
}
