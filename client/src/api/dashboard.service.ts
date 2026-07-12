import { api } from '@/lib/api';
import { 
  getMockKPIs, 
  getMockCarbonTrend, 
  getMockLeaderboard, 
  getMockActivities, 
  getMockAIInsights 
} from '@/lib/mock-data';

// Simulate network delay for mocks
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  getKPIs: async (dateRange: string, department: string | null) => {
    // Pending backend aggregation endpoint
    await delay(600);
    return getMockKPIs();
  },

  getCarbonTrends: async (dateRange: string, department: string | null) => {
    // Pending backend trend endpoint
    await delay(1200);
    return getMockCarbonTrend(dateRange === 'last_7_days' ? 7 : 30);
  },

  getDepartmentLeaderboard: async () => {
    try {
      const response = await api.get('/core/leaderboard/');
      // The backend returns an Employee leaderboard. 
      // We will aggregate it by Department for the dashboard component.
      const employees = response.data;
      
      const deptScores: Record<string, any> = {};
      
      employees.forEach((emp: any) => {
        const deptName = emp.department ? emp.department.name : 'Unassigned';
        if (!deptScores[deptName]) {
          deptScores[deptName] = { score: 0, count: 0 };
        }
        deptScores[deptName].score += emp.xp_total || 0;
        deptScores[deptName].count += 1;
      });

      const mapped = Object.keys(deptScores).map((dept, index) => ({
        id: `dept-${index}`,
        name: dept,
        // Average XP score
        score: Math.round(deptScores[dept].score / deptScores[dept].count) || 0,
        trend: Math.random() > 0.5 ? 'up' : 'down', // mock trend
        trendValue: (Math.random() * 5).toFixed(1),
        carbonTarget: Math.round(Math.random() * 100) + '%',
        participation: Math.round(Math.random() * 100) + '%'
      }));
      
      // Sort by highest score
      mapped.sort((a, b) => b.score - a.score);
      
      if (mapped.length > 0) return mapped;
      
      // Fallback if no employees exist yet
      return getMockLeaderboard();
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
      return getMockLeaderboard();
    }
  },

  getRecentActivity: async () => {
    // Pending backend activities endpoint
    await delay(500);
    return getMockActivities();
  },

  getAIInsights: async () => {
    // Pending backend AI generation endpoint
    await delay(1500);
    return getMockAIInsights();
  }
};
