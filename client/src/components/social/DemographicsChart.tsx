'use client';

import React from 'react';
import { WidgetCard } from '@/components/dashboard/WidgetCard';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartWrapper } from '@/components/shared/ChartWrapper';

export function DemographicsChart({ isLoading }: { isLoading?: boolean }) {
  const data = [
    { subject: 'Gender Diversity', A: 85, fullMark: 100 },
    { subject: 'Age Distribution', A: 78, fullMark: 100 },
    { subject: 'Ethnic Diversity', A: 82, fullMark: 100 },
    { subject: 'Disability Inclusion', A: 65, fullMark: 100 },
    { subject: 'Leadership Diversity', A: 70, fullMark: 100 },
    { subject: 'Pay Equity', A: 92, fullMark: 100 },
  ];

  return (
    <WidgetCard title="Corporate Diversity (DEI) Score" isLoading={isLoading} className="h-[320px]">
      <ChartWrapper height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="DEI Score" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.4} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--primary)' }}
          />
        </RadarChart>
      </ChartWrapper>
    </WidgetCard>
  );
}
