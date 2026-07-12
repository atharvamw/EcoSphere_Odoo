'use client';

import React from 'react';
import { WidgetCard } from './WidgetCard';
import { LineChart, Line, YAxis } from 'recharts';
import { ChartWrapper, StandardTooltip } from '@/components/shared/ChartWrapper';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'flat';
  trendGoodIs: 'up' | 'down'; // In ESG, less carbon is good (down), but higher score is good (up)
  sparklineData?: { name: string; value: number }[];
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
  tooltipDesc?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  trendDirection,
  trendGoodIs,
  sparklineData,
  isLoading,
  isError,
  onRefresh,
  tooltipDesc = "Compare to previous period."
}: MetricCardProps) {

  const isGood = trendDirection === trendGoodIs;
  const isFlat = trendDirection === 'flat';
  
  const TrendIcon = isFlat ? Minus : (trendDirection === 'up' ? ArrowUpRight : ArrowDownRight);
  const trendColor = isFlat ? 'text-muted-foreground' : (isGood ? 'text-env-500 bg-env-500/10' : 'text-destructive bg-destructive/10');
  const strokeColor = isFlat ? '#a1a1aa' : (isGood ? '#10b981' : '#ef4444');

  return (
    <WidgetCard 
      title={title} 
      isLoading={isLoading} 
      isError={isError} 
      onRefresh={onRefresh}
      className="col-span-1 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground flex items-baseline">
              {value}
              {unit && <span className="text-sm font-medium text-muted-foreground ml-1">{unit}</span>}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className={cn("inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-semibold", trendColor)}>
                    <TrendIcon className="w-3 h-3 mr-1" />
                    {trend}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-popover border border-border text-foreground px-3 py-1.5 rounded-md text-sm shadow-lg z-50">
                  {tooltipDesc}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <div className="h-16 w-full mt-auto -mx-1">
            <ChartWrapper height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={strokeColor} 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
                />
              </LineChart>
            </ChartWrapper>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
