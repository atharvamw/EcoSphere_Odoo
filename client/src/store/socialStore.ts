import { create } from 'zustand';

export type CSRViewMode = 'grid' | 'list';

interface SocialState {
  viewMode: CSRViewMode;
  setViewMode: (mode: CSRViewMode) => void;
  toggleViewMode: () => void;
}

export const useSocialStore = create<SocialState>((set) => ({
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () => set((state) => ({ viewMode: state.viewMode === 'grid' ? 'list' : 'grid' })),
}));
