import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const { data } = await api.post('/auth/login', credentials);
        const { user, accessToken, refreshToken } = data.data;
        localStorage.setItem('kaarvan_token', accessToken);
        localStorage.setItem('kaarvan_refresh_token', refreshToken);
        set({ user, token: accessToken, refreshToken, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await api.post('/auth/logout', { refreshToken: get().refreshToken });
        } catch {}
        localStorage.removeItem('kaarvan_token');
        localStorage.removeItem('kaarvan_refresh_token');
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),

      setTokens: (token, refreshToken) => set({ token, refreshToken }),

      initialize: () => {
        const token = localStorage.getItem('kaarvan_token');
        if (token && !get().isAuthenticated) {
          set({ token, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'kaarvan-auth',
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);
