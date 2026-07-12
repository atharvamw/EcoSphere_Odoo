'use client';

import React from 'react';
import { WidgetCard } from './WidgetCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartWrapper, StandardTooltip, getStandardAxes, getStandardGrid } from '@/components/shared/ChartWrapper';
import { useTheme } from 'next-themes';

interface CarbonTrendProps {
  data?: any[];
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
}

export function CarbonTrendChart({ data, isLoading, isError, onRefresh }: CarbonTrendProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const axes = getStandardAxes(isDark);
  const grid = getStandardGrid(isDark);

  return (
    <WidgetCard 
      title="Carbon Emissions Trend (tCO2e)" 
      isLoading={isLoading} 
      isError={isError}
      onRefresh={onRefresh}
      className="h-[320px]"
    >
      <ChartWrapper height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMfg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid {...grid} />
          <XAxis dataKey="date" {...axes} />
          <YAxis {...axes} />
          <Tooltip content={<StandardTooltip />} cursor={{ stroke: isDark ? '#3f3f46' : '#e4e4e7', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area type="monotone" dataKey="manufacturing" name="Manufacturing" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMfg)" />
          <Area type="monotone" dataKey="logistics" name="Logistics" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorLog)" />
          <Area type="monotone" dataKey="operations" name="Operations" stroke="#f59e0b" strokeWidth={2} fill="transparent" />
        </AreaChart>
      </ChartWrapper>
    </WidgetCard>
  );
}
