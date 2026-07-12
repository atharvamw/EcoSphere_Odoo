import { create } from 'zustand';

interface GovernanceState {
  issueViewMode: 'table' | 'kanban';
  toggleIssueView: () => void;
  setIssueView: (mode: 'table' | 'kanban') => void;
}

export const useGovernanceStore = create<GovernanceState>((set) => ({
  issueViewMode: 'table',
  toggleIssueView: () => set((state) => ({ issueViewMode: state.issueViewMode === 'table' ? 'kanban' : 'table' })),
  setIssueView: (mode) => set({ issueViewMode: mode }),
}));
