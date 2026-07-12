'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Clock, Zap, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { GameChallenge } from '@/lib/mock-game-data';

interface CardProps {
  challenge: GameChallenge;
  onClick: (challenge: GameChallenge) => void;
}

export function ChallengeCard({ challenge, onClick }: CardProps) {
  const statusColors = {
    Upcoming: 'bg-blue-500/10 text-blue-500',
    Active: 'bg-success/10 text-success',
    Completed: 'bg-muted text-muted-foreground'
  };

  const difficultyColors = {
    Beginner: 'text-success',
    Intermediate: 'text-amber-500',
    Expert: 'text-destructive',
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
      onClick={() => onClick(challenge)}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img 
          src={challenge.image} 
          alt={challenge.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur shadow-sm">
            {challenge.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur ${statusColors[challenge.status]}`}>
            {challenge.status}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <span className={`text-xs font-bold uppercase tracking-wider ${difficultyColors[challenge.difficulty as keyof typeof difficultyColors]}`}>
            {challenge.difficulty}
          </span>
          <span className="text-sm font-bold text-amber-400 flex items-center bg-black/50 px-2 py-1 rounded-md backdrop-blur">
            <Zap className="w-4 h-4 mr-1 text-amber-400 fill-amber-400" />
            {challenge.xpReward} XP
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{challenge.title}</h3>
        
        <div className="flex items-center text-xs text-muted-foreground mb-4 space-x-4">
          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {challenge.endDate}</span>
          <span className="flex items-center"><Target className="w-3 h-3 mr-1" /> {challenge.department}</span>
        </div>

        <div className="flex-1" />

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground flex items-center"><Users className="w-3 h-3 mr-1" /> {challenge.participants} Enrolled</span>
            <span className="text-primary">{challenge.progress}% Complete</span>
          </div>
          <Progress value={challenge.progress} className="h-1.5" />
        </div>

        <div className="pt-4 border-t border-border">
          <Button className="w-full" variant={challenge.status === 'Completed' ? 'secondary' : 'default'} disabled={challenge.status === 'Completed'}>
            {challenge.status === 'Completed' ? 'View Results' : 'Join Challenge'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
