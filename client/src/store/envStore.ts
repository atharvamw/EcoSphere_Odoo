import { create } from 'zustand';

export type EmissionUnit = 'tCO2e' | 'kgCO2e';

interface EnvState {
  globalUnit: EmissionUnit;
  setGlobalUnit: (unit: EmissionUnit) => void;
  toggleUnit: () => void;
}

export const useEnvStore = create<EnvState>((set) => ({
  globalUnit: 'tCO2e',
  setGlobalUnit: (unit) => set({ globalUnit: unit }),
  toggleUnit: () => set((state) => ({ globalUnit: state.globalUnit === 'tCO2e' ? 'kgCO2e' : 'tCO2e' })),
}));
