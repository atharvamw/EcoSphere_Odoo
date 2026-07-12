'use client';

import React from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn } from '@/components/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { governanceService } from '@/api/governance.service';

import { MetricCard } from '@/components/dashboard/MetricCard';
import { AIAssistantPanel } from '@/components/dashboard/AIAssistantPanel';
import { RiskDistributionChart } from '@/components/governance/RiskDistributionChart';
import { ComplianceTrendChart } from '@/components/governance/ComplianceTrendChart';
import { dashboardService } from '@/api/dashboard.service';

export default function GovernanceOverviewPage() {
  const { data: kpis, isLoading: isKpisLoading } = useQuery({
    queryKey: ['govKpis'],
    queryFn: () => governanceService.getKPIs(),
  });

  const { data: aiInsights, isLoading: isAiLoading } = useQuery({
    queryKey: ['govAi'],
    queryFn: () => dashboardService.getAIInsights(),
  });

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <H1>Governance & Compliance</H1>
          <Text>Monitor enterprise risk, policy adherence, and organizational audit logs.</Text>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <MetricCard 
          title="Global Compliance Score" 
          value={kpis?.complianceScore.value || 0}
          unit="/100"
          trend={kpis?.complianceScore.trend || '0'}
          trendDirection={kpis?.complianceScore.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="up"
          isLoading={isKpisLoading}
        />
        <MetricCard 
          title="Open Issues" 
          value={kpis?.openIssues.value || 0}
          unit=""
          trend={kpis?.openIssues.trend || '0'}
          trendDirection={kpis?.openIssues.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="down"
          isLoading={isKpisLoading}
        />
        <MetricCard 
          title="Critical Violations" 
          value={kpis?.criticalIssues.value || 0}
          unit=""
          trend={kpis?.criticalIssues.trend || '0'}
          trendDirection={kpis?.criticalIssues.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="down"
          isLoading={isKpisLoading}
        />
        <MetricCard 
          title="Policies Acknowledged" 
          value={kpis?.policiesAcknowledged.value || 0}
          unit="docs"
          trend={kpis?.policiesAcknowledged.trend || '0'}
          trendDirection={kpis?.policiesAcknowledged.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="up"
          isLoading={isKpisLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          <RiskDistributionChart isLoading={isKpisLoading} />
        </div>
        <div className="lg:col-span-2">
          <AIAssistantPanel data={aiInsights} isLoading={isAiLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ComplianceTrendChart isLoading={isKpisLoading} />
      </div>

    </FadeIn>
  );
}
