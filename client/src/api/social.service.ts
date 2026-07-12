import { generateInitiatives, generateApprovals, getMockSocialKPIs, CSRApproval } from '@/lib/mock-social-data';

// Singleton instances
let memoryInitiatives = generateInitiatives(30);
let memoryApprovals = generateApprovals(100);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const socialService = {
  getKPIs: async () => {
    await delay(500);
    return getMockSocialKPIs();
  },

  getInitiatives: async () => {
    await delay(600);
    return memoryInitiatives;
  },

  getApprovals: async (statusFilter?: string) => {
    await delay(600);
    if (statusFilter && statusFilter !== 'All') {
      return memoryApprovals.filter(a => a.status === statusFilter);
    }
    return memoryApprovals;
  },

  processApproval: async (id: string, action: 'Approve' | 'Reject') => {
    await delay(400);
    memoryApprovals = memoryApprovals.map(req => 
      req.id === id ? { ...req, status: action === 'Approve' ? 'Approved' : 'Rejected' } : req
    );
    return { success: true };
  },

  processBulkApproval: async (ids: string[], action: 'Approve' | 'Reject') => {
    await delay(800);
    memoryApprovals = memoryApprovals.map(req => 
      ids.includes(req.id) ? { ...req, status: action === 'Approve' ? 'Approved' : 'Rejected' } : req
    );
    return { success: true };
  }
};
