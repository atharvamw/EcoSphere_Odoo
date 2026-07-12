import { generateChallenges, generateRewards, generateLeaderboard, getMockGameKPIs } from '@/lib/mock-game-data';

let memoryChallenges = generateChallenges(20);
let memoryRewards = generateRewards(20);
let memoryLeaderboard = generateLeaderboard();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const gamificationService = {
  getKPIs: async () => {
    await delay(400);
    return getMockGameKPIs();
  },

  getChallenges: async () => {
    await delay(600);
    return memoryChallenges;
  },

  getRewards: async () => {
    await delay(600);
    return memoryRewards;
  },

  getLeaderboard: async () => {
    await delay(500);
    return memoryLeaderboard;
  },

  redeemReward: async (rewardId: string) => {
    await delay(1500); // Simulate processing
    memoryRewards = memoryRewards.map(r => 
      r.id === rewardId ? { ...r, stock: Math.max(0, r.stock - 1) } : r
    );
    return { success: true, transactionId: `TRX-${Math.floor(Math.random() * 10000)}` };
  }
};
