'use client';

import React from 'react';
import { WidgetCard } from '@/components/dashboard/WidgetCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartWrapper } from '@/components/shared/ChartWrapper';

export function ParticipationTrendChart({ isLoading }: { isLoading?: boolean }) {
  const data = [
    { month: 'Jan', participants: 120, hours: 450 },
    { month: 'Feb', participants: 150, hours: 620 },
    { month: 'Mar', participants: 180, hours: 800 },
    { month: 'Apr', participants: 140, hours: 550 },
    { month: 'May', participants: 210, hours: 950 },
    { month: 'Jun', participants: 250, hours: 1100 },
  ];

  return (
    <WidgetCard title="Volunteer Participation Trend" isLoading={isLoading} className="h-[320px]">
      <ChartWrapper height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Area 
            type="monotone" 
            dataKey="participants" 
            name="Active Volunteers"
            stroke="var(--color-primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorParticipants)" 
          />
        </AreaChart>
      </ChartWrapper>
    </WidgetCard>
  );
}
