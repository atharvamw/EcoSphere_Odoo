'use client';

import React from 'react';
import { WidgetCard } from './WidgetCard';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';

interface LeaderboardProps {
  data?: any[];
  isLoading?: boolean;
}

export function DepartmentLeaderboard({ data, isLoading }: LeaderboardProps) {
  return (
    <WidgetCard 
      title="Department ESG Ranking" 
      isLoading={isLoading}
      className="h-[320px]"
    >
      <div className="flex text-xs font-semibold text-muted-foreground pb-2 mb-2 border-b border-border px-2">
        <div className="w-8">Rank</div>
        <div className="flex-1">Department</div>
        <div className="w-20 text-right">Score</div>
        <div className="w-16 text-right">Trend</div>
      </div>
      
      <StaggerContainer className="space-y-1 overflow-x-hidden">
        {data?.map((dept, index) => {
          const isTop = index < 3;
          const TrendIcon = dept.trend === 'up' ? ArrowUpRight : (dept.trend === 'down' ? ArrowDownRight : Minus);
          const trendColor = dept.trend === 'up' ? 'text-success' : (dept.trend === 'down' ? 'text-destructive' : 'text-muted-foreground');

          return (
            <StaggerItem key={dept.id}>
              <div className="flex items-center px-2 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
                <div className={cn("w-8 font-bold text-sm", isTop ? "text-foreground" : "text-muted-foreground")}>
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div className="font-medium text-sm text-foreground truncate">{dept.name}</div>
                  {/* Mini visual bar for score */}
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.score}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                      className={cn("h-full rounded-full", isTop ? "bg-primary" : "bg-muted-foreground/50")}
                    />
                  </div>
                </div>
                <div className="w-20 text-right font-semibold text-foreground">
                  {dept.score}
                </div>
                <div className={cn("w-16 flex items-center justify-end text-xs font-medium", trendColor)}>
                  {dept.trendValue}
                  <TrendIcon className="w-3 h-3 ml-0.5" />
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </WidgetCard>
  );
}
