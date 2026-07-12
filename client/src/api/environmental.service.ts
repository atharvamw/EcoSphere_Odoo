import { api } from '@/lib/api';
import { getMockEnvKPIs } from '@/lib/mock-env-data';

export const envService = {
  getKPIs: async () => {
    // Pending dedicated backend endpoint, falling back to mock KPIs
    return getMockEnvKPIs();
  },

  getTransactions: async (page: number = 1, limit: number = 50, search: string = '') => {
    try {
      // Backend may not have search filtering natively yet without drf search filter, but we can pass it
      const response = await api.get('/environmental/transactions/', {
        params: { search }
      });
      
      let data = response.data;
      if (data.results) {
        data = data.results;
      }
      
      // Filter locally if backend doesn't support search yet
      if (search && !data.results) {
        const lower = search.toLowerCase();
        data = data.filter((t: any) => 
          (t.source_record_type || '').toLowerCase().includes(lower) || 
          (t.id || '').toLowerCase().includes(lower)
        );
      }
      
      const mapped = data.map((item: any) => ({
        id: item.id,
        date: item.transaction_date,
        source: item.source_record_type || 'Unknown Source',
        department: item.department ? `Dept ${item.department}` : 'N/A',
        location: 'HQ', // Not in backend schema
        scope: 'Scope 1', // Placeholder
        quantity: Number(item.quantity),
        originalUnit: 'kg',
        emissionFactor: item.emission_factor || 1,
        tco2e: Number(item.co2e_amount),
        status: item.is_manual_override ? 'Flagged' : 'Verified',
        createdBy: 'System Integration'
      }));

      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        data: mapped.slice(start, end),
        meta: {
          total: mapped.length,
          page,
          limit,
          totalPages: Math.ceil(mapped.length / limit)
        }
      };
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      return { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 1 } };
    }
  },

  getGoals: async () => {
    try {
      const response = await api.get('/environmental/goals/');
      let data = response.data;
      if (data.results) data = data.results;
      
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        current: Number(item.current_value),
        target: Number(item.target_value),
        deadline: item.end_date,
        owner: item.department ? `Dept ${item.department}` : 'Organization',
        status: item.status === 'active' ? 'On Track' : item.status,
        risk: 'Low' // Placeholder
      }));
    } catch (error) {
      console.error("Failed to fetch goals", error);
      return [];
    }
  },

  importTransactions: async (file: File) => {
    // Pending backend bulk import endpoint
    return { success: true, count: 0 };
  }
};
