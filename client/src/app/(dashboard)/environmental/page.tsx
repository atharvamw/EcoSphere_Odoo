'use client';

import React from 'react';
import { H1, Text } from '@/components/ui/typography';
import { FadeIn } from '@/components/ui/motion';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { useQuery } from '@tanstack/react-query';
import { envService } from '@/api/environmental.service';
import { useEnvStore } from '@/store/envStore';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';

import { MetricCard } from '@/components/dashboard/MetricCard';
import { ScopeDonutChart } from '@/components/environmental/ScopeDonutChart';
import { AIAssistantPanel } from '@/components/dashboard/AIAssistantPanel';
import { dashboardService } from '@/api/dashboard.service';
import { CarbonTrendChart } from '@/components/dashboard/CarbonTrendChart';

export default function EnvironmentalOverviewPage() {
  const { globalUnit, toggleUnit } = useEnvStore();

  const { data: kpis, isLoading: isKpisLoading, refetch: refetchKpis } = useQuery({
    queryKey: ['envKpis'],
    queryFn: () => envService.getKPIs(),
  });

  const { data: aiInsights, isLoading: isAiLoading } = useQuery({
    queryKey: ['envAi'],
    queryFn: () => dashboardService.getAIInsights(), // Reusing AI mock from dashboard for now
  });

  const { data: carbonTrend, isLoading: isTrendLoading, refetch: refetchTrend } = useQuery({
    queryKey: ['envTrend'],
    queryFn: () => dashboardService.getCarbonTrends('this_quarter', null), // Reusing trend mock
  });

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <H1>Environmental Intelligence</H1>
          <Text>Deep dive into organizational carbon footprint and Scope 1-3 metrics.</Text>
        </div>
        <div>
          <Button variant="outline" onClick={toggleUnit} className="bg-background">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Switch to {globalUnit === 'tCO2e' ? 'kgCO2e' : 'tCO2e'}
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <MetricCard 
          title="Total Emissions" 
          value={globalUnit === 'tCO2e' ? kpis?.totalEmissions.value || 0 : (kpis?.totalEmissions.value || 0) * 1000}
          unit={globalUnit}
          trend={kpis?.totalEmissions.trend || '0'}
          trendDirection={kpis?.totalEmissions.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="down"
          isLoading={isKpisLoading}
          onRefresh={refetchKpis}
        />
        <MetricCard 
          title="Scope 1 (Direct)" 
          value={globalUnit === 'tCO2e' ? kpis?.scope1.value || 0 : (kpis?.scope1.value || 0) * 1000}
          unit={globalUnit}
          trend={kpis?.scope1.trend || '0'}
          trendDirection={kpis?.scope1.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="down"
          isLoading={isKpisLoading}
          onRefresh={refetchKpis}
        />
        <MetricCard 
          title="Scope 2 (Indirect)" 
          value={globalUnit === 'tCO2e' ? kpis?.scope2.value || 0 : (kpis?.scope2.value || 0) * 1000}
          unit={globalUnit}
          trend={kpis?.scope2.trend || '0'}
          trendDirection={kpis?.scope2.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="down"
          isLoading={isKpisLoading}
          onRefresh={refetchKpis}
        />
        <MetricCard 
          title="Carbon Intensity" 
          value={globalUnit === 'tCO2e' ? kpis?.intensity.value || 0 : (kpis?.intensity.value || 0) * 1000}
          unit={`${globalUnit}/FTE`}
          trend={kpis?.intensity.trend || '0'}
          trendDirection={kpis?.intensity.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="down"
          isLoading={isKpisLoading}
          onRefresh={refetchKpis}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Scope Donut Chart */}
        <div className="lg:col-span-1">
          <ScopeDonutChart data={kpis} isLoading={isKpisLoading} />
        </div>
        
        {/* AI Insight Placeholder */}
        <div className="lg:col-span-2">
          <AIAssistantPanel data={aiInsights} isLoading={isAiLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <CarbonTrendChart data={carbonTrend} isLoading={isTrendLoading} onRefresh={refetchTrend} />
      </div>

    </FadeIn>
  );
}
