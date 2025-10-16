// LIBRARIES
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  incrementCartItemQuantity: (sku: string) => void;
  decrementCartItemQuantity: (sku: string) => void;
  removeCartItem: (sku: string) => void;
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
        return get().cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
      },
      incrementCartItemQuantity: (sku) => {
        set((state) => {
          return {
            cartItems: state.cartItems.map((cartItem) =>
              cartItem.variantSku === sku
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          };
        });
      },
      decrementCartItemQuantity: (sku) => {
        set((state) => {
          return {
            cartItems: state.cartItems
              .map((cartItem) =>
                cartItem.variantSku === sku
                  ? { ...cartItem, quantity: cartItem.quantity - 1 }
                  : cartItem
              )
              .filter((cartItem) => cartItem.quantity > 0),
          };
        });
      },
      removeCartItem: (sku) => {
        set((state) => {
          return {
            cartItems: state.cartItems.filter(
              (cartItem) => cartItem.variantSku !== sku
            ),
          };
        });
      },
    }),
    { name: "cart-storage" }
  )
);
