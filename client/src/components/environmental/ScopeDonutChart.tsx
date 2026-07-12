'use client';

import React from 'react';
import { WidgetCard } from '@/components/dashboard/WidgetCard';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { useEnvStore } from '@/store/envStore';

interface ScopeChartProps {
  data?: any;
  isLoading?: boolean;
}

export function ScopeDonutChart({ data, isLoading }: ScopeChartProps) {
  const { globalUnit } = useEnvStore();

  const chartData = [
    { name: 'Scope 1 (Direct)', value: data?.scope1.value || 4200, color: '#3b82f6' }, // Blue
    { name: 'Scope 2 (Indirect)', value: data?.scope2.value || 3800, color: '#f59e0b' }, // Amber
    { name: 'Scope 3 (Supply Chain)', value: data?.scope3.value || 4450, color: '#8b5cf6' }, // Violet
  ];

  // Adjust values based on unit
  const displayData = chartData.map(d => ({
    ...d,
    value: globalUnit === 'tCO2e' ? d.value : d.value * 1000
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-lg shadow-lg text-sm border-border">
          <p className="font-semibold mb-1" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-foreground font-medium">
            {payload[0].value.toLocaleString()} {globalUnit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <WidgetCard title="Emissions by Scope" isLoading={isLoading} className="h-[320px]">
      <ChartWrapper height="100%">
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ChartWrapper>
    </WidgetCard>
  );
}
