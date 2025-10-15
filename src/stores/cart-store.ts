// LIBRARIES
import { create } from "zustand";
import { persist } from "zustand/middleware";
// TYPES
import { PRODUCT_BY_ID_QUERYResult } from "@/sanity/types/sanity.types";

interface CartItem {
  product: PRODUCT_BY_ID_QUERYResult;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  addCartItem: (product: PRODUCT_BY_ID_QUERYResult) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartItems: [],
      addCartItem: (newProduct) =>
        set((state) => {
          let updatedCartItems;

          const existingItem = state.cartItems.find(
            (cartItem) => cartItem.product._id === newProduct._id
          );

          if (existingItem) {
            updatedCartItems = state.cartItems.map((cartItem) =>
              cartItem.product._id === existingItem.product?._id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );

            return { cartItems: updatedCartItems };
          } else {
            updatedCartItems = [
              ...state.cartItems,
              { product: newProduct, quantity: 1 },
            ];
          }

          return { cartItems: updatedCartItems };
        }),
    }),
    { name: "cart-storage" }
  )
);
