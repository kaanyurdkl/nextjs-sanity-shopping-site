import React, { useMemo } from "react";
import { StringInputProps, set } from "sanity";
import tailwindColors from "tailwindcss/colors";

// Constants
const EXCLUDED_COLORS = ["inherit", "current", "transparent", "black", "white"];

const SPECIAL_COLOR_MAP: Record<string, string> = {
  "bg-black": "#000000",
  "bg-white": "#ffffff",
  "text-black": "#000000",
  "text-white": "#ffffff",
};

// Types
type TailwindColorShades = Record<string, string>;
type ColorInfo = {
  name: string;
  shade: string;
  className: string;
};

// Filter out non-color values and create color palette
const getTailwindColorPalette = (): [string, TailwindColorShades][] => {
  return Object.entries(tailwindColors).filter(
    ([key, value]) =>
      typeof value === "object" &&
      value !== null &&
      !EXCLUDED_COLORS.includes(key) &&
      Object.keys(value).some((k) => /^\d+$/.test(k)) // Has numeric shade keys
  ) as [string, TailwindColorShades][];
};

// Helper function to extract hex value from Tailwind class
const getHexFromTailwindClass = (tailwindClass: string): string => {
  if (!tailwindClass) return "#000000";

  // Handle special cases
  if (SPECIAL_COLOR_MAP[tailwindClass]) {
    return SPECIAL_COLOR_MAP[tailwindClass];
  }

  const match = tailwindClass.match(/(?:bg-|text-)(\w+)-(\d+)/);
  if (!match) return "#000000";

  const [, colorName, shade] = match;
  const shadeCollection = tailwindColors[colorName as keyof typeof tailwindColors];

  if (typeof shadeCollection === "object" && shadeCollection !== null) {
    return (shadeCollection as TailwindColorShades)[shade] || "#000000";
  }

  return "#000000";
};

// Helper function to parse color information from Tailwind class
const parseTailwindClass = (tailwindClass: string): ColorInfo => {
  if (!tailwindClass) return { name: "None", shade: "None", className: "None" };

  const match = tailwindClass.match(/(?:bg-|text-)(\w+)-(\d+)/);
  if (match) {
    const [, colorName, shadeNumber] = match;
    return {
      name: colorName,
      shade: shadeNumber,
      className: tailwindClass,
    };
  }

  return { name: "Unknown", shade: "Unknown", className: tailwindClass };
};

const TailwindColorPicker = (props: StringInputProps) => {
  const { value, onChange } = props;
  
  // Memoize expensive computations
  const colorPalette = useMemo(() => getTailwindColorPalette(), []);
  const selectedColorInfo = useMemo(() => parseTailwindClass(value || ""), [value]);
  const selectedColorHex = useMemo(() => getHexFromTailwindClass(value || ""), [value]);

  // Determine if this is for text or background colors based on field name
  const isTextColor =
    props.schemaType?.name?.includes("text") ||
    props.schemaType?.name?.includes("Text");
  const cssClassPrefix = isTextColor ? "text" : "bg";

  const handleColorSelect = (colorName: string, shade: string) => {
    const tailwindClass = `${cssClassPrefix}-${colorName}-${shade}`;
    onChange(set(tailwindClass));
  };

  return (
    <div>
      {/* Current Selection Display */}
      <div className="mb-3 p-3 bg-[var(--card-bg-color)] border border-[var(--card-border-color)] rounded-md">
        <div className="text-xs font-medium mb-3 text-[var(--card-muted-fg-color)]">
          Selected color
        </div>
        {value && (
          <div>
            <div
              className="w-10 mb-3 aspect-square border border-[var(--card-border-color)] rounded-md"
              style={{ backgroundColor: selectedColorHex }}
              title={`${value} (${selectedColorHex})`}
            />
            <div className="grid grid-cols-3 text-xs text-[var(--card-muted-fg-color)]">
              <div>
                <div>Color name: </div>
                <div className="text-[var(--card-fg-color)] capitalize">
                  {selectedColorInfo.name}
                </div>
              </div>
              <div>
                <div>Color shade: </div>
                <div className="text-[var(--card-fg-color)]">
                  {selectedColorInfo.shade}
                </div>
              </div>
              <div>
                <div>Class name: </div>
                <div className="text-[var(--card-fg-color)]">
                  {selectedColorInfo.className}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Color Palette Grid */}
      <div className="max-h-96 overflow-y-auto border border-[var(--card-border-color)] rounded-md p-3">
        {colorPalette.map(([colorName, shades]) => (
          <div key={colorName} className="sm:flex sm:items-center mb-2">
            <h4 className="text-xs sm:w-20 mb-1 sm:mb-0 font-semibold text-[var(--card-fg-color)] capitalize">
              {colorName}
            </h4>
            <div className="grid grow grid-cols-[repeat(auto-fit,minmax(20px,1fr))] gap-0.5 sm:gap-2 max-w-full">
              {Object.entries(shades)
                .filter(([shade]) => /^\d+$/.test(shade)) // Only numeric shades
                .sort(([a], [b]) => parseInt(a) - parseInt(b)) // Sort by shade number
                .map(([shade, hex]) => {
                  const tailwindClass = `${cssClassPrefix}-${colorName}-${shade}`;
                  // Check if this color matches the selected value (regardless of prefix)
                  const isSelected = value === tailwindClass || 
                    (value && value.endsWith(`-${colorName}-${shade}`));

                  return (
                    <button
                      key={`${colorName}-${shade}`}
                      type="button"
                      className={`
                        w-full aspect-square rounded-sm cursor-pointer transition-all duration-100 outline-none
                        border border-[var(--card-border-color)]
                        ${
                          isSelected
                            ? "ring-2 ring-[var(--card-focus-ring-color)]"
                            : ""
                        }
                      `}
                      onClick={() => handleColorSelect(colorName, shade)}
                      style={{ backgroundColor: hex }}
                      title={`${colorName}-${shade} (${hex})`}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Helper Text */}
      <div className="mt-2 text-xs text-[var(--card-muted-fg-color)] italic">
        Click any color swatch to select it. Hover to see color details.
      </div>
    </div>
  );
};

export default TailwindColorPicker;
