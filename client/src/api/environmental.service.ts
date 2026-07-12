import { generateTransactions, getMockEnvKPIs, getMockGoals } from '@/lib/mock-env-data';

// Singleton instance to persist the 1000 records in memory during session
let memoryTransactions = generateTransactions(1000);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const envService = {
  getKPIs: async () => {
    await delay(500);
    return getMockEnvKPIs();
  },

  getTransactions: async (page: number = 1, limit: number = 50, search: string = '') => {
    await delay(600);
    let filtered = memoryTransactions;
    
    if (search) {
      const lower = search.toLowerCase();
      filtered = memoryTransactions.filter(t => 
        t.source.toLowerCase().includes(lower) || 
        t.department.toLowerCase().includes(lower) ||
        t.location.toLowerCase().includes(lower) ||
        t.id.toLowerCase().includes(lower)
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit)
      }
    };
  },

  getGoals: async () => {
    await delay(800);
    return getMockGoals();
  },

  importTransactions: async (file: File) => {
    // Simulate complex validation and upload
    await delay(2000);
    // Generate some fake new records to simulate the import
    const newRecords = generateTransactions(Math.floor(Math.random() * 50) + 10);
    memoryTransactions = [...newRecords, ...memoryTransactions];
    return { success: true, count: newRecords.length };
  }
};
