'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

interface BadgeProps {
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  progress?: number;
}

export function BadgeItem({ name, description, icon, isUnlocked, rarity, progress }: BadgeProps) {
  const rarityColors = {
    Common: 'border-muted-foreground text-muted-foreground',
    Rare: 'border-blue-500 text-blue-500',
    Epic: 'border-purple-500 text-purple-500',
    Legendary: 'border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
  };

  return (
    <motion.div 
      whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
      className={`relative p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
        isUnlocked 
          ? `bg-card ${rarityColors[rarity]}` 
          : 'bg-muted/20 border-border opacity-70 grayscale'
      }`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="font-bold text-sm text-foreground mb-1">{name}</h4>
      <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
      
      {!isUnlocked && progress !== undefined && (
        <div className="w-full mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
      )}

      {!isUnlocked && (
        <div className="absolute top-2 right-2 p-1 bg-background rounded-full border border-border shadow-sm">
          <Lock className="w-3 h-3 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
}
