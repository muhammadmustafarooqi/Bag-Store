import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';


interface CartStore {
  items: CartItem[];
  addItem: (product: Product | any, qty: number, color: string, isBundle?: boolean, bundleItems?: any[]) => void;
  removeItem: (productId: string, color: string, isBundle?: boolean) => void;
  updateQty: (productId: string, color: string, qty: number, isBundle?: boolean) => void;
  clearCart: () => void;
  total: () => number;
  subtotal: () => number;
  shippingFee: () => number;
  itemCount: () => number;
  globalSettings: { freeShippingThreshold: number; shippingFee: number; whatsappNumber?: string } | null;
  setGlobalSettings: (settings: any) => void;
  appliedCoupon: { code: string; discount: number } | null;
  setAppliedCoupon: (coupon: { code: string; discount: number } | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      globalSettings: null,
      appliedCoupon: null,

      setGlobalSettings: (settings) => set({ globalSettings: settings }),
      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),

      addItem: (product, qty, color, isBundle = false, bundleItems = []) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product._id === product._id && i.color === color && i.isBundle === isBundle
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === product._id && i.color === color && i.isBundle === isBundle
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
            };
          }
          const price = isBundle ? product.bundlePrice : (product.onSale && product.salePrice ? product.salePrice : product.price);
          return { items: [...state.items, { product, qty, color, price, isBundle, bundleItems }] };
        });
      },

      removeItem: (productId, color, isBundle = false) =>
        set((state) => ({ items: state.items.filter((i) => !(i.product._id === productId && i.color === color && i.isBundle === isBundle)) })),

      updateQty: (productId, color, qty, isBundle = false) =>
        set((state) => ({
          items: state.items.map((i) =>
            (i.product._id === productId && i.color === color && i.isBundle === isBundle) ? { ...i, qty } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      shippingFee: () => {
        const sub = get().subtotal();
        const hasCoupon = !!get().appliedCoupon;
        const threshold = hasCoupon ? 7000 : 3500;
        const fee = get().globalSettings?.shippingFee || 200;
        return sub >= threshold ? 0 : fee;
      },

      total: () => get().subtotal() + get().shippingFee(),

      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'kaarvan-cart' }
  )
);
