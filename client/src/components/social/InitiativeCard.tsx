'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Award, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { CSRInitiative } from '@/lib/mock-social-data';

interface CardProps {
  initiative: CSRInitiative;
  onClick: (initiative: CSRInitiative) => void;
}

export function InitiativeCard({ initiative, onClick }: CardProps) {
  const progressPercent = Math.min(100, Math.round((initiative.registered / initiative.totalSeats) * 100));

  const statusColors = {
    Upcoming: 'bg-blue-500/10 text-blue-500',
    Active: 'bg-success/10 text-success',
    Completed: 'bg-muted text-muted-foreground'
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
      onClick={() => onClick(initiative)}
    >
      {/* Cover Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <img 
          src={initiative.image} 
          alt={initiative.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur shadow-sm">
            {initiative.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur ${statusColors[initiative.status]}`}>
            {initiative.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">{initiative.title}</h3>
        
        <div className="flex items-center text-xs text-muted-foreground mb-4 space-x-3">
          <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {initiative.location}</span>
          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {initiative.duration}h</span>
        </div>

        {/* Spacer to push progress down */}
        <div className="flex-1" />

        {/* Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground flex items-center"><Users className="w-3 h-3 mr-1" /> {initiative.registered} Joined</span>
            <span className="text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center text-sm font-bold text-amber-500">
            <Award className="w-4 h-4 mr-1" />
            {initiative.rewardXP} XP
          </div>
          <Button variant="ghost" size="sm" className="h-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
