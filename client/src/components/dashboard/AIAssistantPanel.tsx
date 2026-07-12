'use client';

import React, { useState } from 'react';
import { WidgetCard } from './WidgetCard';
import { Zap, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AIInsightProps {
  data?: {
    alerts: Array<{ id: number, title: string, desc: string, type: string }>;
    recommendations: Array<{ id: number, title: string, desc: string, impact: string }>;
    summary: string;
  };
  isLoading?: boolean;
}

type Tab = 'summary' | 'alerts' | 'recommendations';

export function AIAssistantPanel({ data, isLoading }: AIInsightProps) {
  const [activeTab, setActiveTab] = useState<Tab>('recommendations');

  const tabs = [
    { id: 'recommendations', label: 'Recommendations', icon: TrendingUp, count: data?.recommendations.length },
    { id: 'alerts', label: 'Risk Alerts', icon: ShieldAlert, count: data?.alerts.length, color: 'text-destructive' },
    { id: 'summary', label: 'Executive Summary', icon: Zap },
  ];

  return (
    <WidgetCard 
      title="EcoSphere AI Assistant" 
      isLoading={isLoading}
      className="border-violet-500/30 bg-violet-500/5 dark:bg-violet-500/10 h-[320px]"
      headerAction={<div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">Predictive Engine Active</div>}
    >
      <div className="flex h-full flex-col">
        {/* Custom Tabs */}
        <div className="flex border-b border-border/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "flex-1 flex items-center justify-center py-3 text-sm font-medium transition-colors relative",
                  isActive ? "text-violet-700 dark:text-violet-300" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className={cn("w-4 h-4 mr-2", tab.color)} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-[10px]">
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="ai-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'summary' && (
                <div className="p-4 bg-background/50 rounded-lg border border-border text-sm leading-relaxed text-foreground">
                  {data?.summary}
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-3">
                  {data?.alerts.map(alert => (
                    <div key={alert.id} className="flex p-3 rounded-lg border border-destructive/30 bg-destructive/5 items-start">
                      <ShieldAlert className="w-5 h-5 text-destructive mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                        <p className="text-xs text-muted-foreground">{alert.desc}</p>
                      </div>
                    </div>
                  ))}
                  {data?.alerts.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No active risk alerts.</p>}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-3">
                  {data?.recommendations.map(rec => (
                    <div key={rec.id} className="flex p-3 rounded-lg border border-border bg-background/50 items-start justify-between group">
                      <div className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{rec.desc}</p>
                          <span className="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success">
                            Estimated Impact: {rec.impact}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ai" className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-4">
                        Simulate
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </WidgetCard>
  );
}
