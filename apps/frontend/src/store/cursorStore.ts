import { create } from 'zustand';

interface CursorState {
  isActive: boolean;
  title: string;
  subtitle: string;
  icon?: string;
  setCursor: (title: string, subtitle: string, icon?: string) => void;
  resetCursor: () => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  isActive: false,
  title: '',
  subtitle: '',
  icon: '✨',
  setCursor: (title, subtitle, icon = '✨') => set({ isActive: true, title, subtitle, icon }),
  resetCursor: () => set({ isActive: false, title: '', subtitle: '', icon: '✨' }),
}));
