// REACT
import React, { useMemo } from "react";

// LIBRARIES
import { StringInputProps, set } from "sanity";
import tailwindColors from "tailwindcss/colors";

// TYPES
import { CustomStringOptions } from "../types/components";
import { TailwindColorShades, ColorInfo } from "../types/tailwind";

// CONSTANTS
import { EXCLUDED_COLORS } from "../constants/tailwind";

// Get filtered Tailwind color palette excluding non-color values
const getTailwindColorPalette = (): [string, TailwindColorShades][] => {
  return Object.entries(tailwindColors).filter(
    ([key, value]) =>
      typeof value === "object" &&
      value !== null &&
      !EXCLUDED_COLORS.includes(key)
  ) as [string, TailwindColorShades][];
};

// Parse Tailwind class name to extract color information
const parseTailwindClass = (tailwindClass: string): ColorInfo => {
  if (!tailwindClass)
    return {
      name: "None",
      shade: "None",
      className: "None",
      colorValue: "oklch(0 0 0)", // Fallback to black in oklch format
    };

  const parts = tailwindClass.split("-");
  const colorName = parts[1];
  const shade = parts[2];

  // Extract color value from Tailwind colors object (oklch format)
  const shadeCollection =
    tailwindColors[colorName as keyof typeof tailwindColors];
  const colorValue =
    (shadeCollection as TailwindColorShades)?.[shade] || "oklch(0 0 0)"; // Fallback to black in oklch format

  return {
    name: colorName,
    shade: shade,
    className: tailwindClass,
    colorValue: colorValue,
  };
};

const TailwindColorPicker = (props: StringInputProps) => {
  const { value, onChange } = props;

  // Memoize color palette generation and selected color parsing
  const colorPalette = useMemo(() => getTailwindColorPalette(), []);
  const selectedColorInfo = useMemo(
    () => parseTailwindClass(value || ""),
    [value]
  );

  // Get CSS class prefix from schema options (e.g., 'bg', 'text')
  const cssClassPrefix = (props.schemaType.options as CustomStringOptions)?.cssClassPrefix;

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
              style={{ backgroundColor: selectedColorInfo.colorValue }}
              title={`${value} (${selectedColorInfo.colorValue})`}
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
              {Object.entries(shades).map(([shade, colorValue]) => {
                const tailwindClass = `${cssClassPrefix}-${colorName}-${shade}`;
                const isSelected = value === tailwindClass;

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
                    style={{ backgroundColor: colorValue }}
                    title={`${colorName}-${shade} (${colorValue})`}
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
