'use client';

import React, { useState } from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn } from '@/components/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { governanceService } from '@/api/governance.service';
import { useGovernanceStore } from '@/store/governanceStore';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

import { IssueKanban } from '@/components/governance/IssueKanban';
import { IssueTable } from '@/components/governance/IssueTable';
import { IssueTimeline } from '@/components/governance/IssueTimeline';
import type { ComplianceIssue } from '@/lib/mock-gov-data';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function IssueTrackerPage() {
  const { issueViewMode, toggleIssueView } = useGovernanceStore();
  const [selectedIssue, setSelectedIssue] = useState<ComplianceIssue | null>(null);

  const { data: issues, isLoading } = useQuery({
    queryKey: ['govIssues'],
    queryFn: () => governanceService.getIssues(),
  });

  return (
    <FadeIn className="w-full pb-10 flex flex-col h-[calc(100vh-2rem)]">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0 flex-shrink-0">
        <div>
          <H1>Compliance Issue Tracker</H1>
          <Text>Triage, investigate, and resolve compliance flags and policy violations.</Text>
        </div>
        <div className="flex space-x-2 bg-muted/50 p-1 rounded-lg border border-border">
          <Button 
            variant={issueViewMode === 'table' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={issueViewMode === 'kanban' ? toggleIssueView : undefined}
            className="px-3"
          >
            <List className="w-4 h-4 mr-2" /> Data Table
          </Button>
          <Button 
            variant={issueViewMode === 'kanban' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={issueViewMode === 'table' ? toggleIssueView : undefined}
            className="px-3"
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> Kanban Board
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {issueViewMode === 'kanban' ? (
          <IssueKanban data={issues || []} isLoading={isLoading} onView={setSelectedIssue} />
        ) : (
          <IssueTable data={issues || []} isLoading={isLoading} onView={setSelectedIssue} />
        )}
      </div>

      {/* Simplified Timeline Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedIssue(null)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-xl overflow-hidden p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-bold text-xl mb-1">{selectedIssue.title}</h2>
                  <p className="text-sm text-muted-foreground">ID: {selectedIssue.id} • Assigned to: {selectedIssue.assignee}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedIssue(null)} className="rounded-full"><X className="w-5 h-5" /></Button>
              </div>
              
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Issue Lifecycle</h3>
                <IssueTimeline status={selectedIssue.status} createdDate={selectedIssue.createdDate} />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedIssue(null)}>Close</Button>
                <Button variant="default">Update Status</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </FadeIn>
  );
}
