'use client';

import React from 'react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from 'recharts';
import { useTheme } from 'next-themes';

interface ChartWrapperProps {
  children: React.ReactNode;
  height?: number | string;
}

/**
 * Standardizes styling, responsiveness, and tooltips for Recharts
 */
export function ChartWrapper({ children, height = 300 }: ChartWrapperProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {/* We use React.cloneElement to inject standardized props to the chart component if needed, 
            but standard children passing works best when wrapping ComposedChart etc. */}
        {children as any}
      </ResponsiveContainer>
    </div>
  );
}

// Reusable standard chart tooltip
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StandardTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg shadow-lg text-sm border-border">
        <p className="font-medium mb-1 text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Standardized grid and axes props
export const getStandardAxes = (isDark: boolean) => ({
  axisLine: false,
  tickLine: false,
  tick: { fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 12 },
});

export const getStandardGrid = (isDark: boolean) => ({
  strokeDasharray: "3 3",
  vertical: false,
  stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
});
