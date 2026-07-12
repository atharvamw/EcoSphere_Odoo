import { api } from '@/lib/api';

export const socialService = {
  getKPIs: async () => {
    try {
      const response = await api.get('/social/dashboard/kpis/');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch social KPIs", error);
      throw error;
    }
  },

  getInitiatives: async () => {
    try {
      const response = await api.get('/social/activities/');
      return response.data.map((a: any) => ({
        id: a.id,
        title: a.name || a.title,
        image: `https://picsum.photos/seed/${a.id}/200/300`,
        category: 'Community',
        status: a.status === 'active' ? 'Active' : a.status === 'completed' ? 'Completed' : 'Upcoming',
        registered: 0,
        totalSeats: a.capacity || 50,
        startDate: a.start_date ? new Date(a.start_date).toISOString().split('T')[0] : 'N/A',
        endDate: a.end_date ? new Date(a.end_date).toISOString().split('T')[0] : 'N/A',
        location: a.location || 'Remote',
        duration: 2,
        rewardXP: a.points_reward || 0,
        description: a.description,
        department: 'All',
        organizer: 'CSR Team'
      }));
    } catch (error) {
      console.error("Failed to fetch initiatives", error);
      return [];
    }
  },

  getApprovals: async (statusFilter?: string) => {
    try {
      const response = await api.get('/social/participations/');
      const participations = response.data.map((p: any) => ({
        id: p.id,
        employeeName: p.employee?.user?.username || 'Employee',
        department: 'General',
        type: 'CSR',
        date: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : 'N/A',
        status: p.status === 'pending' ? 'Pending' : p.status === 'approved' ? 'Approved' : 'Rejected',
        evidence: 'No evidence provided',
        xpReward: 50
      }));

      if (statusFilter && statusFilter !== 'All') {
        return participations.filter((p: any) => p.status === statusFilter);
      }
      return participations;
    } catch (error) {
      console.error("Failed to fetch approvals", error);
      return [];
    }
  },

  processApproval: async (id: string, action: 'Approve' | 'Reject') => {
    try {
      if (action === 'Approve') {
        await api.post(`/social/participations/${id}/approve/`);
      } else {
        await api.patch(`/social/participations/${id}/`, { status: 'rejected' });
      }
      return { success: true };
    } catch (error) {
      console.error(`Failed to ${action.toLowerCase()} participation`, error);
      throw error;
    }
  },

  processBulkApproval: async (ids: string[], action: 'Approve' | 'Reject') => {
    try {
      if (action === 'Approve') {
        await api.post('/social/participations/bulk_approve/', { ids });
      } else {
        await Promise.all(ids.map(id => api.patch(`/social/participations/${id}/`, { status: 'rejected' })));
      }
      return { success: true };
    } catch (error) {
      console.error(`Failed to bulk ${action.toLowerCase()}`, error);
      throw error;
    }
  }
};
