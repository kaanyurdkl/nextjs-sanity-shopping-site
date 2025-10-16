// LIBRARIES
import { create } from "zustand";
import { persist } from "zustand/middleware";
// TYPES
import { PRODUCT_BY_ID_QUERYResult } from "@/sanity/types/sanity.types";

interface CartItem {
  productId: string;
  productName: string;
  variantSku: string;
  color: string;
  colorHex: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartStore {
  cartItems: CartItem[];
  addCartItem: (product: Omit<CartItem, "quantity">) => void;
  getCartItemsCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addCartItem: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem.variantSku === item.variantSku
          );

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((cartItem) =>
                cartItem.variantSku === item.variantSku
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          } else {
            return {
              cartItems: [...state.cartItems, { ...item, quantity: 1 }],
            };
          }
        }),
      getCartItemsCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    { name: "cart-storage" }
  )
);
