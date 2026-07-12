'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LeaderboardUser } from '@/lib/mock-game-data';

interface LeaderboardProps {
  data: LeaderboardUser[];
  isLoading: boolean;
}

export function LeaderboardTabs({ data, isLoading }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'individual' | 'department'>('individual');

  const top3Colors = ['text-yellow-500 fill-yellow-500', 'text-gray-400 fill-gray-400', 'text-amber-700 fill-amber-700'];

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border mb-6">
        <Button 
          variant="ghost" 
          className={`rounded-none border-b-2 px-6 ${activeTab === 'individual' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('individual')}
        >
          Individual Employees
        </Button>
        <Button 
          variant="ghost" 
          className={`rounded-none border-b-2 px-6 ${activeTab === 'department' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('department')}
        >
          Departments
        </Button>
      </div>

      {/* List Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 rounded-t-xl border border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <div className="col-span-1 text-center">Rank</div>
        <div className="col-span-6 md:col-span-4">Name</div>
        <div className="hidden md:block col-span-4">Department</div>
        <div className="col-span-5 md:col-span-3 text-right">Total XP</div>
      </div>

      {/* Rows */}
      <div className="border border-t-0 border-border rounded-b-xl bg-card">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border/50 animate-pulse">
              <div className="col-span-1 h-4 bg-muted rounded"></div>
              <div className="col-span-6 md:col-span-4 h-4 bg-muted rounded"></div>
              <div className="hidden md:block col-span-4 h-4 bg-muted rounded"></div>
              <div className="col-span-5 md:col-span-3 h-4 bg-muted rounded"></div>
            </div>
          ))
        ) : (
          <div className="flex flex-col">
            <AnimatePresence>
              {data.map((user, index) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-border/50 transition-colors hover:bg-muted/30 ${user.name === 'Employee 12' ? 'bg-primary/5' : ''}`}
                >
                  <div className="col-span-1 flex justify-center items-center">
                    {index < 3 ? (
                      <Crown className={`w-6 h-6 ${top3Colors[index]}`} />
                    ) : (
                      <span className="font-bold text-muted-foreground text-lg">{user.rank}</span>
                    )}
                  </div>
                  
                  <div className="col-span-6 md:col-span-4 flex items-center space-x-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-border" />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      {user.name === 'Employee 12' && <span className="text-[10px] uppercase font-bold text-primary">You</span>}
                    </div>
                  </div>
                  
                  <div className="hidden md:block col-span-4">
                    <span className="text-sm text-muted-foreground">{user.department}</span>
                  </div>
                  
                  <div className="col-span-5 md:col-span-3 flex items-center justify-end space-x-4">
                    <span className="font-bold text-amber-500">{user.xp.toLocaleString()} XP</span>
                    <div className="w-6 flex justify-center">
                      {user.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                      {user.trend === 'down' && <TrendingDown className="w-4 h-4 text-destructive" />}
                      {user.trend === 'same' && <Minus className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
