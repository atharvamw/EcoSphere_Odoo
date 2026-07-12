'use client';

import React, { useState } from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationService } from '@/api/gamification.service';
import { RewardCard } from '@/components/gamification/RewardCard';
import { RedemptionModal } from '@/components/gamification/RedemptionModal';
import { useGameStore } from '@/store/gameStore';
import { Zap, Clock, Package } from 'lucide-react';
import type { GameReward } from '@/lib/mock-game-data';

export default function RewardsPage() {
  const queryClient = useQueryClient();
  const { userXP, deductXP, history, addRewardToHistory } = useGameStore();
  const [selectedReward, setSelectedReward] = useState<GameReward | null>(null);

  const { data: rewards, isLoading } = useQuery({
    queryKey: ['gameRewards'],
    queryFn: () => gamificationService.getRewards(),
  });

  const redeemMutation = useMutation({
    mutationFn: (id: string) => gamificationService.redeemReward(id),
    onSuccess: (data, variables) => {
      const reward = rewards?.find(r => r.id === variables);
      if (reward) {
        deductXP(reward.xpCost);
        addRewardToHistory({
          id: `HIST-${Math.floor(Math.random() * 10000)}`,
          rewardId: reward.id,
          title: reward.title,
          xpSpent: reward.xpCost,
          date: new Date().toISOString().split('T')[0],
          status: 'Pending'
        });
      }
      queryClient.invalidateQueries({ queryKey: ['gameRewards'] });
    }
  });

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      {/* Wallet Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0 bg-primary/5 border border-primary/20 p-6 rounded-2xl">
        <div>
          <H1>Rewards Store</H1>
          <Text>Redeem your hard-earned XP for digital perks and physical merchandise.</Text>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm text-center min-w-[200px]">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-amber-500 flex items-center justify-center">
            <Zap className="w-6 h-6 mr-2 fill-current" />
            {userXP.toLocaleString()} XP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Store */}
        <div className="lg:col-span-3">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <StaggerItem key={i}>
                  <div className="h-[320px] bg-muted/50 rounded-xl animate-pulse" />
                </StaggerItem>
              ))
            ) : (
              rewards?.map((reward) => (
                <StaggerItem key={reward.id}>
                  <RewardCard reward={reward} onRedeem={setSelectedReward} userXP={userXP} />
                </StaggerItem>
              ))
            )}
          </StaggerContainer>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">Redemption History</h3>
          {history.map(item => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-sm line-clamp-2">{item.title}</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.status === 'Delivered' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {item.date}</span>
                <span className="font-bold text-destructive">-{item.xpSpent} XP</span>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-center p-6 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No rewards redeemed yet.
            </div>
          )}
        </div>
      </div>

      <RedemptionModal 
        reward={selectedReward} 
        isOpen={!!selectedReward} 
        onClose={() => setSelectedReward(null)} 
        onConfirm={async (id) => { await redeemMutation.mutateAsync(id); }}
        userXP={userXP}
      />
    </FadeIn>
  );
}
