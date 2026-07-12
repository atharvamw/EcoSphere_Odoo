'use client';

import React from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn } from '@/components/ui/motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialService } from '@/api/social.service';
import { ApprovalTable } from '@/components/social/ApprovalTable';

export default function ManagerApprovalPage() {
  const queryClient = useQueryClient();

  const { data: approvals, isLoading } = useQuery({
    queryKey: ['socialApprovals'],
    queryFn: () => socialService.getApprovals(),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => socialService.processApproval(id, 'Approve'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['socialApprovals'] })
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => socialService.processApproval(id, 'Reject'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['socialApprovals'] })
  });

  const bulkApproveMutation = useMutation({
    mutationFn: (ids: string[]) => socialService.processBulkApproval(ids, 'Approve'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['socialApprovals'] })
  });

  return (
    <FadeIn className="w-full pb-10 flex flex-col h-[calc(100vh-2rem)]">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0 flex-shrink-0">
        <div>
          <H1>Manager Approvals</H1>
          <Text>Review and approve employee CSR participation and volunteer hours.</Text>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ApprovalTable 
          data={approvals || []} 
          isLoading={isLoading} 
          onApprove={(id) => approveMutation.mutate(id)}
          onReject={(id) => rejectMutation.mutate(id)}
          onBulkApprove={(ids) => bulkApproveMutation.mutate(ids)}
        />
      </div>
    </FadeIn>
  );
}
