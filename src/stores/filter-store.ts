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

interface FilterStore {
  selectedColors: SelectedColor[];
  selectedSizes: SelectedSize[];
  addColor: (color: SelectedColor) => void;
  removeColor: (colorId: string) => void;
  addSize: (size: SelectedSize) => void;
  removeSize: (sizeId: string) => void;
  clearAll: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedColors: [],
  selectedSizes: [],
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
  clearAll: () =>
    set({
      selectedColors: [],
      selectedSizes: [],
    }),
}));
