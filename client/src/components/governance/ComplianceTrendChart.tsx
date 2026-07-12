'use client';

import React from 'react';
import { WidgetCard } from '@/components/dashboard/WidgetCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartWrapper } from '@/components/shared/ChartWrapper';

export function ComplianceTrendChart({ isLoading }: { isLoading?: boolean }) {
  const data = [
    { month: 'Jan', score: 85 },
    { month: 'Feb', score: 86 },
    { month: 'Mar', score: 89 },
    { month: 'Apr', score: 88 },
    { month: 'May', score: 90 },
    { month: 'Jun', score: 92 },
  ];

  return (
    <WidgetCard title="Overall Compliance Score Trend" isLoading={isLoading} className="h-[320px]">
      <ChartWrapper height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={[50, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            name="Score"
            stroke="var(--color-primary)" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: 'var(--color-primary)' }}
          />
        </LineChart>
      </ChartWrapper>
    </WidgetCard>
  );
}
