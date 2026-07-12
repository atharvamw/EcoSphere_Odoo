'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Target, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { GameChallenge } from '@/lib/mock-game-data';

interface DrawerProps {
  challenge: GameChallenge | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ChallengeDetailsDrawer({ challenge, isOpen, onClose }: DrawerProps) {
  if (!challenge) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="relative h-48 w-full bg-muted">
              <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <Button variant="outline" size="icon" onClick={onClose} className="absolute top-4 right-4 rounded-full bg-background/50 backdrop-blur border-none hover:bg-background/80 text-white">
                <X className="w-5 h-5" />
              </Button>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    {challenge.category}
                  </span>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center">
                    <Zap className="w-3 h-3 mr-1 fill-white" /> {challenge.xpReward} XP
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white shadow-sm">{challenge.title}</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Your Progress</span>
                  <span className="text-sm font-bold text-primary">{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} className="h-2 mb-4" />
                <Button className="w-full" size="lg" variant={challenge.progress === 100 ? 'outline' : 'default'} disabled={challenge.status === 'Completed'}>
                  {challenge.progress === 100 ? 'Claim Reward' : 'Upload Evidence'}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Clock className="w-4 h-4 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium">{challenge.endDate}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="w-4 h-4 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                    <p className="text-sm font-medium">{challenge.difficulty}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Mission Briefing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{challenge.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Rules & Evidence</h3>
                <ul className="space-y-3">
                  <li className="flex text-sm text-muted-foreground items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 shrink-0 mt-0.5" /> 
                    Must be completed during the active challenge window.
                  </li>
                  <li className="flex text-sm text-muted-foreground items-start">
                    <ShieldAlert className="w-4 h-4 text-amber-500 mr-2 shrink-0 mt-0.5" /> 
                    Photographic or systemic evidence is required for manager approval before XP is awarded.
                  </li>
                </ul>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
