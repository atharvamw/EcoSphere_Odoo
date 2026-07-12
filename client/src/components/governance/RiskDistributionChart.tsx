'use client';

import React from 'react';
import { WidgetCard } from '@/components/dashboard/WidgetCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartWrapper } from '@/components/shared/ChartWrapper';

export function RiskDistributionChart({ isLoading }: { isLoading?: boolean }) {
  const data = [
    { name: 'Low Risk', value: 45, color: 'var(--color-success)' },
    { name: 'Medium Risk', value: 30, color: 'var(--color-warning)' },
    { name: 'High Risk', value: 20, color: 'var(--color-destructive)' },
    { name: 'Critical Risk', value: 5, color: '#991b1b' },
  ];

  return (
    <WidgetCard title="Enterprise Risk Distribution" isLoading={isLoading} className="h-[320px]">
      <ChartWrapper height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--border)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ChartWrapper>
    </WidgetCard>
  );
}
