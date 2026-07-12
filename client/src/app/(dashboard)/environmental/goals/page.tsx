'use client';

import React from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { envService } from '@/api/environmental.service';
import { GoalProgressCard } from '@/components/environmental/GoalProgressCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function EnvironmentalGoalsPage() {
  const { data: goals, isLoading } = useQuery({
    queryKey: ['envGoals'],
    queryFn: () => envService.getGoals(),
  });

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <H1>Net-Zero Goals Tracker</H1>
          <Text>Monitor progress on enterprise sustainability and emission reduction targets.</Text>
        </div>
        <div className="flex space-x-3">
          <Button variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <StaggerItem key={i}>
              <GoalProgressCard goal={null} isLoading={true} />
            </StaggerItem>
          ))
        ) : (
          goals?.map((goal) => (
            <StaggerItem key={goal.id}>
              <GoalProgressCard goal={goal} isLoading={false} />
            </StaggerItem>
          ))
        )}
      </StaggerContainer>
    </FadeIn>
  );
}
