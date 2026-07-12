import { api } from '@/lib/api';

export const governanceService = {
  getKPIs: async () => {
    try {
      const response = await api.get('/governance/dashboard/kpis/');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch governance KPIs", error);
      throw error;
    }
  },

  getPolicies: async () => {
    try {
      const response = await api.get('/governance/policies/');
      return response.data.map((p: any) => ({
        id: p.id,
        title: p.title,
        version: p.version || '1.0',
        effectiveDate: p.effective_date ? new Date(p.effective_date).toISOString().split('T')[0] : 'N/A',
        content: p.content || '<p>No content provided</p>',
        isAcknowledgedByMe: false 
      }));
    } catch (error) {
      console.error("Failed to fetch policies", error);
      return [];
    }
  },

  getIssues: async () => {
    try {
      const response = await api.get('/governance/compliance-issues/');
      return response.data.map((i: any) => ({
        id: i.id,
        title: i.title,
        severity: i.severity === 'high' ? 'High' : i.severity === 'medium' ? 'Medium' : 'Low',
        department: 'Governance',
        assignee: 'Unassigned',
        dueDate: i.due_date ? new Date(i.due_date).toISOString().split('T')[0] : 'N/A',
        status: i.status === 'open' ? 'Open' : i.status === 'in_progress' ? 'In Progress' : 'Resolved'
      }));
    } catch (error) {
      console.error("Failed to fetch issues", error);
      return [];
    }
  },

  getAuditLogs: async () => {
    try {
      const response = await api.get('/governance/audits/');
      return response.data.map((a: any) => ({
        id: a.id,
        user: 'System', 
        action: a.action,
        module: a.module,
        details: a.details,
        timestamp: new Date(a.timestamp).toLocaleString(),
        ipAddress: '127.0.0.1' 
      }));
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
      return [];
    }
  },

  acknowledgePolicy: async (policyId: string) => {
    try {
      const response = await api.post(`/governance/policies/${policyId}/acknowledge/`);
      return { success: true };
    } catch (error: any) {
      console.error("Failed to acknowledge policy", error);
      throw error;
    }
  },

  updateIssueStatus: async (issueId: string, status: any) => {
    try {
      const backendStatus = status === 'Open' ? 'open' : status === 'In Progress' ? 'in_progress' : 'resolved';
      const response = await api.patch(`/governance/compliance-issues/${issueId}/`, { status: backendStatus });
      return { success: true };
    } catch (error: any) {
      console.error("Failed to update issue status", error);
      throw error;
    }
  }
};
