import { create } from "zustand";

export interface SelectedColor {
  _id: string;
  name: string;
  hexCode: string;
}

export interface SelectedSize {
  _id: string;
  code: string;
  name: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

interface FilterStore {
  selectedColors: SelectedColor[];
  selectedSizes: SelectedSize[];
  priceRange: PriceRange | null;
  addColor: (color: SelectedColor) => void;
  removeColor: (colorId: string) => void;
  addSize: (size: SelectedSize) => void;
  removeSize: (sizeId: string) => void;
  setPriceRange: (range: PriceRange) => void;
  clearPriceRange: () => void;
  clearAll: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedColors: [],
  selectedSizes: [],
  priceRange: null,
  addColor: (color) =>
    set((state) => ({
      selectedColors: [...state.selectedColors, color],
    })),
  removeColor: (colorId) =>
    set((state) => ({
      selectedColors: state.selectedColors.filter((c) => c._id !== colorId),
    })),
  addSize: (size) =>
    set((state) => ({
      selectedSizes: [...state.selectedSizes, size],
    })),
  removeSize: (sizeId) =>
    set((state) => ({
      selectedSizes: state.selectedSizes.filter((s) => s._id !== sizeId),
    })),
  setPriceRange: (range) =>
    set({
      priceRange: range,
    }),
  clearPriceRange: () =>
    set({
      priceRange: null,
    }),
  clearAll: () =>
    set({
      selectedColors: [],
      selectedSizes: [],
      priceRange: null,
    }),
}));
