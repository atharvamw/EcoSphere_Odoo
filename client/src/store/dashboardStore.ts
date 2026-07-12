import { create } from 'zustand';

export type UserRole = 'employee' | 'department_head' | 'executive' | 'admin';
export type DateRange = 'today' | 'last_7_days' | 'last_30_days' | 'this_month' | 'this_quarter' | 'this_year';

interface DashboardState {
  // Global Filters
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  
  selectedDepartment: string | null;
  setSelectedDepartment: (dept: string | null) => void;

  // Personalization Mock
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dateRange: 'this_quarter',
  setDateRange: (range) => set({ dateRange: range }),
  
  selectedDepartment: null,
  setSelectedDepartment: (dept) => set({ selectedDepartment: dept }),

  activeRole: 'executive', // Defaulting to executive for development
  setActiveRole: (role) => set({ activeRole: role }),
}));
