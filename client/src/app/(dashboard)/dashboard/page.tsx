'use client';

import React from 'react';
import { H1, Text } from '@/components/ui/typography';
import { FadeIn, StaggerContainer } from '@/components/ui/motion';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/api/dashboard.service';
import { useDashboardStore } from '@/store/dashboardStore';

// Phase 2 Dashboard Components
import { DashboardFilterBar } from '@/components/dashboard/DashboardFilterBar';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AIAssistantPanel } from '@/components/dashboard/AIAssistantPanel';
import { CarbonTrendChart } from '@/components/dashboard/CarbonTrendChart';
import { DepartmentLeaderboard } from '@/components/dashboard/DepartmentLeaderboard';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { NotificationWidget } from '@/components/dashboard/NotificationWidget';

export default function DashboardPage() {
  const { dateRange, selectedDepartment, activeRole } = useDashboardStore();

  // 1. Independent Queries (Allows parts of dashboard to load independently)
  const { data: kpis, isLoading: isKpisLoading, isError: isKpisError, refetch: refetchKpis } = useQuery({
    queryKey: ['kpis', dateRange, selectedDepartment],
    queryFn: () => dashboardService.getKPIs(dateRange, selectedDepartment),
  });

  const { data: carbonTrend, isLoading: isTrendLoading, isError: isTrendError, refetch: refetchTrend } = useQuery({
    queryKey: ['carbonTrend', dateRange, selectedDepartment],
    queryFn: () => dashboardService.getCarbonTrends(dateRange, selectedDepartment),
  });

  const { data: aiInsights, isLoading: isAiLoading } = useQuery({
    queryKey: ['aiInsights', dateRange, selectedDepartment],
    queryFn: () => dashboardService.getAIInsights(),
  });

  const { data: leaderboard, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => dashboardService.getDepartmentLeaderboard(),
  });

  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: () => dashboardService.getRecentActivity(),
  });

  // Simplified Role Handling for Mock (In a real app, this would entirely swap sub-components or route layout)
  if (activeRole === 'employee') {
    return (
      <FadeIn className="w-full">
        <H1>My Impact</H1>
        <Text>Your personal ESG contributions.</Text>
        <div className="mt-8 flex justify-center items-center h-64 border border-dashed rounded-xl border-border bg-muted/10">
          <Text>Employee Dashboard View (Implementation Phase 4 - Social)</Text>
        </div>
      </FadeIn>
    );
  }

  // EXECUTIVE / ADMIN DASHBOARD VIEW
  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <H1>Executive Intelligence Center</H1>
          <Text>Enterprise overview of organizational health and ESG performance.</Text>
        </div>
      </div>

      <QuickActions />
      <div className="h-6" /> {/* Spacer */}
      <DashboardFilterBar />

      {/* Grid Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <MetricCard 
          title="Overall ESG Score" 
          value={kpis?.overallEsg.value || 0}
          trend={kpis?.overallEsg.trend || '0'}
          trendDirection={kpis?.overallEsg.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="up"
          sparklineData={kpis?.overallEsg.sparkline}
          isLoading={isKpisLoading}
          isError={isKpisError}
          onRefresh={refetchKpis}
        />
        <MetricCard 
          title="Environmental Score" 
          value={kpis?.environmental.value || 0}
          trend={kpis?.environmental.trend || '0'}
          trendDirection={kpis?.environmental.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="up"
          sparklineData={kpis?.environmental.sparkline}
          isLoading={isKpisLoading}
          isError={isKpisError}
          onRefresh={refetchKpis}
        />
        <MetricCard 
          title="Carbon Emissions" 
          unit={kpis?.carbonEmissions.unit}
          value={kpis?.carbonEmissions.value || 0}
          trend={kpis?.carbonEmissions.trend || '0'}
          trendDirection={kpis?.carbonEmissions.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="down" // Less is better
          sparklineData={kpis?.carbonEmissions.sparkline}
          isLoading={isKpisLoading}
          isError={isKpisError}
          onRefresh={refetchKpis}
        />
        <MetricCard 
          title="Social Participation" 
          value={kpis?.employeeParticipation.value || 0}
          trend={kpis?.employeeParticipation.trend || '0'}
          trendDirection={kpis?.employeeParticipation.trend.startsWith('-') ? 'down' : 'up'}
          trendGoodIs="up"
          sparklineData={kpis?.employeeParticipation.sparkline}
          isLoading={isKpisLoading}
          isError={isKpisError}
          onRefresh={refetchKpis}
        />
      </div>

      {/* Grid Row 2: Carbon Trend & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <CarbonTrendChart 
            data={carbonTrend} 
            isLoading={isTrendLoading} 
            isError={isTrendError}
            onRefresh={refetchTrend}
          />
        </div>
        <div className="lg:col-span-1">
          <DepartmentLeaderboard 
            data={leaderboard} 
            isLoading={isLeaderboardLoading} 
          />
        </div>
      </div>

      {/* Grid Row 3: AI Insights */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <AIAssistantPanel data={aiInsights} isLoading={isAiLoading} />
      </div>

      {/* Grid Row 4: Timeline & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ActivityTimeline data={activities} isLoading={isActivitiesLoading} />
        <NotificationWidget />
      </div>

    </FadeIn>
  );
}
