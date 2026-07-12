'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeverityBadge } from './SeverityBadge';
import { Calendar, User, FileText } from 'lucide-react';
import type { ComplianceIssue } from '@/lib/mock-gov-data';

interface KanbanProps {
  data: ComplianceIssue[];
  isLoading: boolean;
  onView: (issue: ComplianceIssue) => void;
}

export function IssueKanban({ data, isLoading, onView }: KanbanProps) {
  const columns = [
    { id: 'Open', title: 'Open', color: 'border-destructive' },
    { id: 'Investigating', title: 'Investigating', color: 'border-amber-500' },
    { id: 'Resolved', title: 'Resolved', color: 'border-success' },
    { id: 'Closed', title: 'Closed (Audited)', color: 'border-muted-foreground' }
  ] as const;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
        {columns.map(col => (
          <div key={col.id} className="bg-muted/30 rounded-xl p-4 border border-border animate-pulse">
            <div className="h-6 w-24 bg-muted rounded mb-4" />
            <div className="h-32 bg-muted rounded-lg mb-3" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
      {columns.map(col => {
        const columnIssues = data.filter(i => i.status === col.id);
        
        return (
          <div key={col.id} className="bg-muted/20 rounded-xl border border-border flex flex-col h-full min-h-[500px]">
            <div className={`p-4 border-b-2 font-bold flex justify-between items-center ${col.color}`}>
              {col.title}
              <span className="bg-background px-2 py-0.5 rounded-full text-xs text-muted-foreground border border-border">
                {columnIssues.length}
              </span>
            </div>
            
            <div className="p-3 flex-1 flex flex-col space-y-3 overflow-y-auto">
              <AnimatePresence>
                {columnIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => onView(issue)}
                    className="bg-card border border-border shadow-sm hover:shadow-md rounded-lg p-4 cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-muted-foreground">{issue.id}</span>
                      <SeverityBadge level={issue.severity} />
                    </div>
                    
                    <h4 className="font-semibold text-sm leading-tight mb-3 group-hover:text-primary transition-colors">{issue.title}</h4>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <FileText className="w-3 h-3 mr-1.5 shrink-0" />
                        <span className="truncate">{issue.department}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="w-3 h-3 mr-1.5 shrink-0" />
                        <span className="truncate">{issue.assignee}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1.5 shrink-0 text-amber-500" />
                        <span>Due: {issue.dueDate}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {columnIssues.length === 0 && (
                <div className="text-center p-6 text-muted-foreground text-xs italic">
                  No issues in this stage.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
