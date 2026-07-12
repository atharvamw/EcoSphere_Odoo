'use client';

import React from 'react';
import { WidgetCard } from './WidgetCard';
import { Leaf, Users, ShieldAlert, Trophy, Circle } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
  data?: any[];
  isLoading?: boolean;
}

const typeConfig: Record<string, any> = {
  environmental: { icon: Leaf, color: 'text-env-500', bg: 'bg-env-500/10' },
  social: { icon: Users, color: 'text-social-500', bg: 'bg-social-500/10' },
  governance: { icon: ShieldAlert, color: 'text-gov-500', bg: 'bg-gov-500/10' },
  gamification: { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

export function ActivityTimeline({ data, isLoading }: ActivityTimelineProps) {
  return (
    <WidgetCard 
      title="Recent Enterprise Activity" 
      isLoading={isLoading}
      className="h-[400px]"
    >
      <div className="relative pl-6 py-2">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border" />
        
        <StaggerContainer className="space-y-6">
          {data?.map((activity) => {
            const config = typeConfig[activity.type] || { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted' };
            const Icon = config.icon;
            
            return (
              <StaggerItem key={activity.id} className="relative">
                {/* Node */}
                <div className={cn("absolute -left-[30px] p-1 rounded-full border-4 border-card bg-card", config.color, config.bg)}>
                  <Icon className="w-3.5 h-3.5 fill-current" />
                </div>
                
                {/* Content */}
                <div className="pl-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{activity.desc}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 flex-shrink-0">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </WidgetCard>
  );
}
