import { create } from 'zustand';

export interface RewardHistoryItem {
  id: string;
  rewardId: string;
  title: string;
  xpSpent: number;
  date: string;
  status: 'Pending' | 'Delivered' | 'Cancelled';
}

interface GameState {
  userXP: number;
  history: RewardHistoryItem[];
  deductXP: (amount: number) => void;
  addRewardToHistory: (item: RewardHistoryItem) => void;
}

export const useGameStore = create<GameState>((set) => ({
  userXP: 4250, // Starting Mock XP
  history: [
    { id: 'HIST-001', rewardId: 'REW-001', title: 'Free Coffee Gift Card', xpSpent: 500, date: '2023-10-12', status: 'Delivered' }
  ],
  deductXP: (amount) => set((state) => ({ userXP: Math.max(0, state.userXP - amount) })),
  addRewardToHistory: (item) => set((state) => ({ history: [item, ...state.history] })),
}));
