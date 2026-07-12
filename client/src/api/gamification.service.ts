import { api } from '@/lib/api';

export const gamificationService = {
  getKPIs: async () => {
    try {
      const response = await api.get('/gamification/dashboard/kpis/');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch gamification KPIs", error);
      throw error;
    }
  },

  getChallenges: async () => {
    try {
      const response = await api.get('/gamification/challenges/');
      return response.data.map((c: any) => ({
        id: c.id,
        title: c.name,
        image: `https://picsum.photos/seed/${c.id}/200/300`,
        category: 'Sustainability',
        status: c.status === 'active' ? 'Active' : c.status === 'completed' ? 'Completed' : 'Upcoming',
        difficulty: 'Intermediate', 
        xpReward: c.points_reward || 0,
        endDate: c.end_date,
        department: 'All',
        participants: Math.floor(Math.random() * 50),
        progress: Math.floor(Math.random() * 100),
        description: c.description
      }));
    } catch (error) {
      console.error("Failed to fetch challenges", error);
      return [];
    }
  },

  getRewards: async () => {
    try {
      const response = await api.get('/gamification/rewards/');
      return response.data.map((r: any) => ({
        id: r.id,
        title: r.name,
        image: `https://picsum.photos/seed/${r.id}/200/300`,
        cost: r.points_cost,
        stock: r.stock_quantity,
        category: 'Reward',
        description: r.description
      }));
    } catch (error) {
      console.error("Failed to fetch rewards", error);
      return [];
    }
  },

  getLeaderboard: async () => {
    try {
      const response = await api.get('/gamification/dashboard/leaderboard/');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
      return [];
    }
  },

  redeemReward: async (rewardId: string) => {
    try {
      const response = await api.post(`/gamification/rewards/${rewardId}/redeem/`);
      return { success: true, transactionId: response.data.id || `TRX-${Date.now()}` };
    } catch (error: any) {
      console.error("Failed to redeem reward", error);
      throw new Error(error.response?.data?.detail || "Failed to redeem reward");
    }
  }
};
