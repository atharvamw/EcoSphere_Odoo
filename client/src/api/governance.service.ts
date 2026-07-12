import { generatePolicies, generateIssues, generateAuditLogs, getMockGovKPIs } from '@/lib/mock-gov-data';

let memoryPolicies = generatePolicies(25);
let memoryIssues = generateIssues(40);
let memoryAudits = generateAuditLogs(100);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const governanceService = {
  getKPIs: async () => {
    await delay(300);
    return getMockGovKPIs();
  },

  getPolicies: async () => {
    await delay(500);
    return memoryPolicies;
  },

  getIssues: async () => {
    await delay(600);
    return memoryIssues;
  },

  getAuditLogs: async () => {
    await delay(700);
    return memoryAudits;
  },

  acknowledgePolicy: async (policyId: string) => {
    await delay(1200); // Simulate document processing
    memoryPolicies = memoryPolicies.map(p => 
      p.id === policyId ? { ...p, isAcknowledgedByMe: true } : p
    );
    // Automatically inject an audit log entry
    memoryAudits = [{
      id: `AUD-${Date.now()}`,
      user: 'current_user@company.com',
      action: 'Acknowledged Policy',
      module: 'Governance',
      details: `Policy ID: ${policyId}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.1.1'
    }, ...memoryAudits];
    
    return { success: true };
  },

  updateIssueStatus: async (issueId: string, status: any) => {
    await delay(400);
    memoryIssues = memoryIssues.map(issue => 
      issue.id === issueId ? { ...issue, status } : issue
    );
    return { success: true };
  }
};
