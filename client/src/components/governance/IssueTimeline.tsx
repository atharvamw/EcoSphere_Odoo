import React from 'react';
import { CheckCircle2, Clock, PlayCircle, XCircle } from 'lucide-react';

interface IssueTimelineProps {
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed';
  createdDate: string;
}

export function IssueTimeline({ status, createdDate }: IssueTimelineProps) {
  const stages = [
    { label: 'Issue Raised', state: 'Open', icon: XCircle },
    { label: 'Under Investigation', state: 'Investigating', icon: PlayCircle },
    { label: 'Resolved', state: 'Resolved', icon: CheckCircle2 },
    { label: 'Closed (Audited)', state: 'Closed', icon: CheckCircle2 },
  ];

  const currentIndex = stages.findIndex(s => s.state === status);

  return (
    <div className="flex flex-col space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {stages.map((stage, i) => {
        const isPast = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = stage.icon;

        return (
          <div key={stage.label} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-colors ${
              isCurrent ? 'bg-primary border-primary/30 text-primary-foreground' : 
              isPast ? 'bg-success border-success/30 text-success-foreground' : 'bg-muted border-background text-muted-foreground'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className={`font-bold ${isCurrent ? 'text-primary' : isPast ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.label}</div>
                {i === 0 && <time className="font-mono text-xs text-muted-foreground">{createdDate}</time>}
              </div>
              <div className="text-sm text-muted-foreground">
                {isCurrent ? 'Current active stage.' : isPast ? 'Stage completed successfully.' : 'Pending progression.'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
