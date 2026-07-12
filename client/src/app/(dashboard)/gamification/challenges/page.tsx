'use client';

import React, { useState } from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { gamificationService } from '@/api/gamification.service';
import { ChallengeCard } from '@/components/gamification/ChallengeCard';
import { ChallengeDetailsDrawer } from '@/components/gamification/ChallengeDetailsDrawer';
import type { GameChallenge } from '@/lib/mock-game-data';

export default function ChallengesPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<GameChallenge | null>(null);

  const { data: challenges, isLoading } = useQuery({
    queryKey: ['gameChallenges'],
    queryFn: () => gamificationService.getChallenges(),
  });

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <H1>ESG Challenges</H1>
          <Text>Join organizational initiatives, track progress, and earn XP towards rewards.</Text>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <StaggerItem key={i}>
              <div className="h-[380px] bg-muted/50 rounded-xl animate-pulse" />
            </StaggerItem>
          ))
        ) : (
          challenges?.map((challenge) => (
            <StaggerItem key={challenge.id}>
              <ChallengeCard challenge={challenge} onClick={setSelectedChallenge} />
            </StaggerItem>
          ))
        )}
      </StaggerContainer>

      <ChallengeDetailsDrawer 
        challenge={selectedChallenge} 
        isOpen={!!selectedChallenge} 
        onClose={() => setSelectedChallenge(null)} 
      />
    </FadeIn>
  );
}
