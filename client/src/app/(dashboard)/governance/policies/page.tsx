'use client';

import React, { useState } from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceService } from '@/api/governance.service';
import { PolicyViewerModal } from '@/components/governance/PolicyViewerModal';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { PolicyDocument } from '@/lib/mock-gov-data';

export default function PolicyCenterPage() {
  const queryClient = useQueryClient();
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(null);

  const { data: policies, isLoading } = useQuery({
    queryKey: ['govPolicies'],
    queryFn: () => governanceService.getPolicies(),
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (id: string) => governanceService.acknowledgePolicy(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['govPolicies'] })
  });

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <H1>Policy Center</H1>
          <Text>Review and digitally acknowledge organizational compliance protocols.</Text>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <StaggerItem key={i}>
              <div className="h-64 bg-muted/50 rounded-xl animate-pulse" />
            </StaggerItem>
          ))
        ) : (
          policies?.map(policy => (
            <StaggerItem key={policy.id}>
              <div className="bg-card border border-border shadow-sm hover:shadow-md rounded-xl p-5 flex flex-col h-full transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  {policy.priority === 'High' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20 uppercase tracking-wider">High Priority</span>
                  )}
                </div>
                
                <h3 className="font-bold text-lg leading-tight mb-1">{policy.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">Effective: {policy.effectiveDate} • Owner: {policy.owner}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-muted-foreground">Org Acknowledgement</span>
                    <span className="text-primary">{policy.acknowledgedPercent}%</span>
                  </div>
                  <Progress value={policy.acknowledgedPercent} className="h-1.5" />
                </div>

                <div className="flex-1" />
                
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  {policy.isAcknowledgedByMe ? (
                    <span className="text-success flex items-center text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Acknowledged
                    </span>
                  ) : (
                    <span className="text-amber-500 flex items-center text-sm font-bold">
                      <AlertCircle className="w-4 h-4 mr-1.5" /> Action Required
                    </span>
                  )}
                  
                  <Button variant={policy.isAcknowledgedByMe ? "outline" : "default"} size="sm" onClick={() => setSelectedPolicy(policy)}>
                    {policy.isAcknowledgedByMe ? 'Review Again' : 'Read & Sign'}
                  </Button>
                </div>
              </div>
            </StaggerItem>
          ))
        )}
      </StaggerContainer>

      <PolicyViewerModal 
        policy={selectedPolicy} 
        isOpen={!!selectedPolicy} 
        onClose={() => setSelectedPolicy(null)} 
        onAcknowledge={async (id) => { await acknowledgeMutation.mutateAsync(id); }}
      />
    </FadeIn>
  );
}
