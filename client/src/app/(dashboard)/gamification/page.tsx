'use client';

import React from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { gamificationService } from '@/api/gamification.service';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { BadgeItem } from '@/components/gamification/BadgeItem';
import { AIAssistantPanel } from '@/components/dashboard/AIAssistantPanel';
import { dashboardService } from '@/api/dashboard.service';

export default function GamificationOverviewPage() {
  const { data: kpis, isLoading: isKpisLoading } = useQuery({
    queryKey: ['gameKpis'],
    queryFn: () => gamificationService.getKPIs(),
  });

  const { data: aiInsights, isLoading: isAiLoading } = useQuery({
    queryKey: ['gameAi'],
    queryFn: () => dashboardService.getAIInsights(),
  });

  const mockBadges = [
    { name: 'Eco Warrior', description: 'Complete 10 Energy Challenges', icon: '🌿', isUnlocked: true, rarity: 'Rare' as const },
    { name: 'Zero Waste Hero', description: 'Log zero paper waste for a month', icon: '♻️', isUnlocked: true, rarity: 'Epic' as const },
    { name: 'Carbon Neutralizer', description: 'Offset 1000kg of CO2', icon: '🔋', isUnlocked: false, rarity: 'Legendary' as const, progress: 65 },
    { name: 'Community Leader', description: 'Organize a local cleanup event', icon: '🤝', isUnlocked: false, rarity: 'Common' as const, progress: 20 },
  ];

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <H1>Gamification Engine</H1>
          <Text>Track organizational participation, challenge completion, and overall ESG engagement.</Text>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          title="Total XP Earned" 
          value={kpis?.totalXPEarned.value || 0}
          unit="XP"
          trend={kpis?.totalXPEarned.trend || '0'}
          trendDirection="up"
          trendGoodIs="up"
          isLoading={isKpisLoading}
        />
        <MetricCard 
          title="Active Challenges" 
          value={kpis?.activeChallenges.value || 0}
          unit=""
          trend={kpis?.activeChallenges.trend || '0'}
          trendDirection="up"
          trendGoodIs="up"
          isLoading={isKpisLoading}
        />
        <MetricCard 
          title="Completed Challenges" 
          value={kpis?.completedChallenges.value || 0}
          unit=""
          trend={kpis?.completedChallenges.trend || '0'}
          trendDirection="up"
          trendGoodIs="up"
          isLoading={isKpisLoading}
        />
        <MetricCard 
          title="Rewards Redeemed" 
          value={kpis?.rewardsRedeemed.value || 0}
          unit="items"
          trend={kpis?.rewardsRedeemed.trend || '0'}
          trendDirection="up"
          trendGoodIs="up"
          isLoading={isKpisLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Badges Preview */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Your Recent Badges</h3>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {mockBadges.map((badge, i) => (
              <StaggerItem key={i}>
                <BadgeItem {...badge} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-1">
          <AIAssistantPanel data={aiInsights} isLoading={isAiLoading} />
        </div>

      </div>
    </FadeIn>
  );
}
