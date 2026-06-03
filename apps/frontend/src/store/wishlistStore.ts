import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface WishlistStore {
  items: string[];
  toggle: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  setItems: (items: string[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: async (productId) => {
        const isIn = get().items.includes(productId);
        // Optimistic update
        set((state) => ({
          items: isIn
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
        try {
          if (isIn) {
            await api.delete(`/users/wishlist/${productId}`);
          } else {
            await api.post(`/users/wishlist/${productId}`);
          }
        } catch {
          // Revert on error
          set((state) => ({
            items: isIn
              ? [...state.items, productId]
              : state.items.filter((id) => id !== productId),
          }));
        }
      },

      isWishlisted: (productId) => get().items.includes(productId),

      setItems: (items) => set({ items }),
    }),
    { name: 'kaarvan-wishlist' }
  )
);
