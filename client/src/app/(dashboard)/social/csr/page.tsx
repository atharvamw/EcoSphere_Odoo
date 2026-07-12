'use client';

import React, { useState } from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { socialService } from '@/api/social.service';
import { InitiativeCard } from '@/components/social/InitiativeCard';
import { InitiativeDetailsDrawer } from '@/components/social/InitiativeDetailsDrawer';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import type { CSRInitiative } from '@/lib/mock-social-data';

export default function CSRMarketplacePage() {
  const { viewMode, toggleViewMode } = useSocialStore();
  const [selectedInitiative, setSelectedInitiative] = useState<CSRInitiative | null>(null);

  const { data: initiatives, isLoading } = useQuery({
    queryKey: ['socialInitiatives'],
    queryFn: () => socialService.getInitiatives(),
  });

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <H1>CSR Marketplace</H1>
          <Text>Discover and join active social initiatives across the organization.</Text>
        </div>
        <div className="flex space-x-2 bg-muted/50 p-1 rounded-lg border border-border">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={viewMode === 'list' ? toggleViewMode : undefined}
            className="px-3"
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={viewMode === 'grid' ? toggleViewMode : undefined}
            className="px-3"
          >
            <List className="w-4 h-4 mr-2" /> List
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <StaggerItem key={i}>
                <div className="h-80 bg-muted/50 rounded-xl animate-pulse" />
              </StaggerItem>
            ))
          ) : (
            initiatives?.map((initiative) => (
              <StaggerItem key={initiative.id}>
                <InitiativeCard initiative={initiative} onClick={setSelectedInitiative} />
              </StaggerItem>
            ))
          )}
        </StaggerContainer>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* List View placeholder for enterprise data grid fallback */}
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Initiative Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Reward</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {initiatives?.map(init => (
                <tr key={init.id} className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setSelectedInitiative(init)}>
                  <td className="px-6 py-4 font-semibold">{init.title}</td>
                  <td className="px-6 py-4">{init.category}</td>
                  <td className="px-6 py-4 text-muted-foreground">{init.startDate}</td>
                  <td className="px-6 py-4 font-bold text-amber-500">{init.rewardXP} XP</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {init.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer Overlay */}
      <InitiativeDetailsDrawer 
        initiative={selectedInitiative} 
        isOpen={!!selectedInitiative} 
        onClose={() => setSelectedInitiative(null)} 
      />
    </FadeIn>
  );
}
