'use client';

import React from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn } from '@/components/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { socialService } from '@/api/social.service';

import { MetricCard } from '@/components/dashboard/MetricCard';
import { AIAssistantPanel } from '@/components/dashboard/AIAssistantPanel';
import { DemographicsChart } from '@/components/social/DemographicsChart';
import { ParticipationTrendChart } from '@/components/social/ParticipationTrendChart';
import { dashboardService } from '@/api/dashboard.service';

export default function SocialOverviewPage() {
  const { data: kpis, isLoading: isKpisLoading } = useQuery({
    queryKey: ['socialKpis'],
    queryFn: () => socialService.getKPIs(),
  });

  const { data: aiInsights, isLoading: isAiLoading } = useQuery({
    queryKey: ['socialAi'],
    queryFn: () => dashboardService.getAIInsights(), // Reusing AI mock
  });

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <H1>Social Impact Dashboard</H1>
          <Text>Track corporate social responsibility (CSR) initiatives and organizational diversity.</Text>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <MetricCard 
          title="Total Volunteer Hours" 
          value={kpis?.hours.value || 0}
          unit="hrs"
          trend={kpis?.hours.trend || '0'}
          trendDirection={kpis?.hours.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="up"
          isLoading={isKpisLoading}
        />
        <MetricCard 
          title="Active Volunteers" 
          value={kpis?.volunteers.value || 0}
          unit="emp"
          trend={kpis?.volunteers.trend || '0'}
          trendDirection={kpis?.volunteers.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="up"
          isLoading={isKpisLoading}
        />
        <MetricCard 
          title="Community Impact Score" 
          value={kpis?.impactScore.value || 0}
          unit="/100"
          trend={kpis?.impactScore.trend || '0'}
          trendDirection={kpis?.impactScore.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="up"
          isLoading={isKpisLoading}
        />
        <MetricCard 
          title="Diversity Index" 
          value={kpis?.diversity.value || 0}
          unit="/100"
          trend={kpis?.diversity.trend || '0'}
          trendDirection={kpis?.diversity.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="up"
          isLoading={isKpisLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          <DemographicsChart isLoading={isKpisLoading} />
        </div>
        <div className="lg:col-span-2">
          <AIAssistantPanel data={aiInsights} isLoading={isAiLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ParticipationTrendChart isLoading={isKpisLoading} />
      </div>

    </FadeIn>
  );
}
