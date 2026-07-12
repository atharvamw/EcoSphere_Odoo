'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Package, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GameReward } from '@/lib/mock-game-data';

interface CardProps {
  reward: GameReward;
  onRedeem: (reward: GameReward) => void;
  userXP: number;
}

export function RewardCard({ reward, onRedeem, userXP }: CardProps) {
  const canAfford = userXP >= reward.xpCost;
  const isOutOfStock = reward.stock === 0;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col h-full"
    >
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        <img 
          src={reward.image} 
          alt={reward.title} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-70' : ''}`}
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur shadow-sm flex items-center">
            {reward.category === 'Digital' ? <Ticket className="w-3 h-3 mr-1" /> : <Package className="w-3 h-3 mr-1" />}
            {reward.category}
          </span>
        </div>
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <span className="font-bold text-lg rotate-[-15deg] border-2 border-destructive text-destructive px-4 py-1 rounded-md">OUT OF STOCK</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg leading-tight mb-2">{reward.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{reward.description}</p>
        
        <div className="flex-1" />

        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="text-muted-foreground">{reward.stock} remaining</span>
          <span className={`font-bold flex items-center ${canAfford ? 'text-amber-500' : 'text-destructive'}`}>
            <Zap className="w-4 h-4 mr-1 fill-current" />
            {reward.xpCost} XP
          </span>
        </div>

        <Button 
          className="w-full" 
          variant={canAfford && !isOutOfStock ? 'default' : 'secondary'}
          disabled={!canAfford || isOutOfStock}
          onClick={() => onRedeem(reward)}
        >
          {isOutOfStock ? 'Sold Out' : canAfford ? 'Redeem Reward' : 'Not Enough XP'}
        </Button>
      </div>
    </motion.div>
  );
}
