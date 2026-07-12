'use client';

import React from 'react';
import { WidgetCard } from './WidgetCard';
import { Button } from '@/components/ui/button';
import { Bell, Check, ArrowRight } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';

export function NotificationWidget() {
  const notifications = [
    { id: 1, title: 'Quarterly Audit Due', desc: 'Please upload Q3 logistics invoices.', time: '2h ago', unread: true },
    { id: 2, title: 'Challenge Expiring', desc: '"Zero Waste Week" ends in 24 hours.', time: '5h ago', unread: true },
    { id: 3, title: 'System Update', desc: 'New AI prediction models are now active.', time: '1d ago', unread: false },
  ];

  return (
    <WidgetCard title="Notifications" className="h-[400px]">
      <div className="flex flex-col h-full">
        <StaggerContainer className="flex-1 overflow-y-auto space-y-1 pr-2">
          {notifications.map((notif) => (
            <StaggerItem key={notif.id}>
              <div className="group flex gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer relative">
                {notif.unread && (
                  <div className="absolute top-4 left-2 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
                <div className="flex-1 ml-3">
                  <h4 className={`text-sm font-semibold ${notif.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.desc}</p>
                  <span className="text-[10px] text-muted-foreground font-medium mt-1.5 block">{notif.time}</span>
                </div>
                <div className="flex flex-col justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-success">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="pt-3 border-t border-border mt-auto">
          <Button variant="ghost" className="w-full text-xs font-semibold text-primary hover:text-primary hover:bg-primary/5">
            View All Notifications <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </div>
    </WidgetCard>
  );
}
