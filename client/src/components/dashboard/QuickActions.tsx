'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Zap, FileSpreadsheet, ShieldAlert, Target } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion';

const actions = [
  { label: 'Create Challenge', icon: Target, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Add CSR Activity', icon: PlusCircle, color: 'text-social-500', bg: 'bg-social-500/10' },
  { label: 'Import Data', icon: FileSpreadsheet, color: 'text-env-500', bg: 'bg-env-500/10' },
  { label: 'Generate Report', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'View Issues', icon: ShieldAlert, color: 'text-destructive', bg: 'bg-destructive/10' },
];

export function QuickActions() {
  return (
    <FadeIn className="w-full overflow-x-auto pb-2 -mx-2 px-2 hide-scrollbar">
      <div className="flex space-x-3 min-w-max">
        {actions.map((action, i) => (
          <Card key={i} interactive className="flex-shrink-0">
            <button className="flex items-center px-4 py-3 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
              <div className={`p-2 rounded-lg ${action.bg} mr-3 flex-shrink-0`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="font-medium text-sm text-foreground whitespace-nowrap">{action.label}</span>
            </button>
          </Card>
        ))}
      </div>
    </FadeIn>
  );
}
