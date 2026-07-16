import { create } from "zustand";
import { persist } from "zustand/middleware";

// This describes what one item in the cart looks like
export interface CartItem {
  id:       number;
  name:     string;
  price:    number;
  image:    string | null;
  quantity: number;
}

// This describes everything our cart can do
export interface CartStore {
  items:       CartItem[];
  addItem:     (item: CartItem) => void;
  removeItem:  (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  clearCart:   () => void;
  totalItems:  () => number;
  totalPrice:  () => number;
}

export const useCartStore = create<CartStore>()(
  // "persist" saves the cart to localStorage
  // so it survives page refresh
  persist(
    (set, get) => ({
      items: [],

      // Add item to cart (or increase quantity if already there)
      addItem: (newItem) => {
        const existing = get().items.find((i) => i.id === newItem.id);
        if (existing) {
          // already in cart → just increase quantity
          set({
            items: get().items.map((i) =>
              i.id === newItem.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          // new item → add to cart
          set({ items: [...get().items, { ...newItem, quantity: 1 }] });
        }
      },

      // Remove item completely from cart
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      // Increase quantity by 1
      increaseQty: (id) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        });
      },

      // Decrease quantity by 1 (remove if reaches 0)
      decreaseQty: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (item && item.quantity === 1) {
          set({ items: get().items.filter((i) => i.id !== id) });
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        }
      },

      // Empty the entire cart
      clearCart: () => set({ items: [] }),

      // Count total number of items
      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      // Calculate total price
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "food-cart", // key used in localStorage
    }
  )
);