'use client';

import React from 'react';
import { WidgetCard } from '@/components/dashboard/WidgetCard';
import { Target, TrendingDown, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GoalCardProps {
  goal: any;
  isLoading?: boolean;
}

export function GoalProgressCard({ goal, isLoading }: GoalCardProps) {
  if (isLoading || !goal) {
    return <WidgetCard title="Loading Goal..." isLoading={true} className="h-[220px]">{null}</WidgetCard>;
  }

  const progressPercent = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const isAtRisk = goal.risk === 'High';

  return (
    <WidgetCard title={goal.title} className="h-[220px]">
      <div className="flex flex-col h-full justify-between">
        
        {/* Header Metadata */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Owner</span>
            <p className="text-sm font-medium text-foreground">{goal.owner}</p>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center ${isAtRisk ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
            {isAtRisk ? <AlertTriangle className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {goal.status}
          </div>
        </div>

        {/* Progress Bar Area */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold">{progressPercent}% <span className="text-sm font-medium text-muted-foreground font-normal">Complete</span></span>
            <span className="text-sm font-medium text-muted-foreground">{goal.current} / {goal.target} Target</span>
          </div>
          <Progress value={progressPercent} className="h-2" indicatorColor={isAtRisk ? 'bg-destructive' : 'bg-primary'} />
        </div>

        {/* Footer Deadline */}
        <div className="flex items-center text-sm text-muted-foreground pt-3 border-t border-border">
          <Clock className="w-4 h-4 mr-2" />
          Target Deadline: <span className="font-medium text-foreground ml-1">{goal.deadline}</span>
        </div>
        
      </div>
    </WidgetCard>
  );
}
