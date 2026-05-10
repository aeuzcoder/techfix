import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/types';

interface UiState {
  language: Language;
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  premiumModalOpen: boolean;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  openPremiumModal: () => void;
  closePremiumModal: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      language: 'uz',
      theme: 'dark',
      sidebarOpen: false,
      premiumModalOpen: false,
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      openPremiumModal: () => set({ premiumModalOpen: true }),
      closePremiumModal: () => set({ premiumModalOpen: false }),
    }),
    {
      name: 'techfix-ui-storage',
      partialize: (state) => ({ language: state.language, theme: state.theme }),
    }
  )
);
