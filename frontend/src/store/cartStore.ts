import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/constants';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, qty: number, color: string) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  subtotal: () => number;
  shippingFee: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty, color) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product._id === product._id && i.color === color
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === product._id && i.color === color
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
            };
          }
          const price = product.onSale && product.salePrice ? product.salePrice : product.price;
          return { items: [...state.items, { product, qty, color, price }] };
        });
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product._id !== productId) })),

      updateQty: (productId, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product._id === productId ? { ...i, qty } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      shippingFee: () => {
        const sub = get().subtotal();
        return sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
      },

      total: () => get().subtotal() + get().shippingFee(),

      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'kaarvan-cart' }
  )
);
