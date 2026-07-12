'use client';

import React from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn } from '@/components/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { governanceService } from '@/api/governance.service';
import { AuditDataTable } from '@/components/governance/AuditDataTable';

export default function AuditLogsPage() {
  const { data: audits, isLoading } = useQuery({
    queryKey: ['govAudits'],
    queryFn: () => governanceService.getAuditLogs(),
  });

  return (
    <FadeIn className="w-full pb-10 flex flex-col h-[calc(100vh-2rem)]">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0 flex-shrink-0">
        <div>
          <H1>System Audit Logs</H1>
          <Text>Immutable trail of all organizational interactions, approvals, and data mutations.</Text>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <AuditDataTable data={audits || []} isLoading={isLoading} />
      </div>
    </FadeIn>
  );
}
