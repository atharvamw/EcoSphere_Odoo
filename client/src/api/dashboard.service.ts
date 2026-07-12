import { 
  getMockKPIs, 
  getMockCarbonTrend, 
  getMockLeaderboard, 
  getMockActivities, 
  getMockAIInsights 
} from '@/lib/mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  getKPIs: async (dateRange: string, department: string | null) => {
    await delay(600); // simulate network
    return getMockKPIs();
  },

  getCarbonTrends: async (dateRange: string, department: string | null) => {
    await delay(1200); // heavier query
    return getMockCarbonTrend(dateRange === 'last_7_days' ? 7 : 30);
  },

  getDepartmentLeaderboard: async () => {
    await delay(800);
    return getMockLeaderboard();
  },

  getRecentActivity: async () => {
    await delay(500);
    return getMockActivities();
  },

  getAIInsights: async () => {
    await delay(1500); // AI generation delay
    return getMockAIInsights();
  }
};
