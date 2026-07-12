'use client';

import React from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn } from '@/components/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { gamificationService } from '@/api/gamification.service';
import { LeaderboardTabs } from '@/components/gamification/LeaderboardTabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['gameLeaderboard'],
    queryFn: () => gamificationService.getLeaderboard(),
  });

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <H1>Global Leaderboard</H1>
          <Text>See who is driving the most sustainable impact across the organization.</Text>
        </div>
        <div>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Rankings</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8">
        <LeaderboardTabs data={data || []} isLoading={isLoading} />
      </div>

    </FadeIn>
  );
}
