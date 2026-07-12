'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Award, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { CSRInitiative } from '@/lib/mock-social-data';

interface DrawerProps {
  initiative: CSRInitiative | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InitiativeDetailsDrawer({ initiative, isOpen, onClose }: DrawerProps) {
  if (!initiative) return null;

  const progressPercent = Math.min(100, Math.round((initiative.registered / initiative.totalSeats) * 100));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header Image */}
            <div className="relative h-48 w-full bg-muted">
              <img src={initiative.image} alt={initiative.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Button variant="outline" size="icon" onClick={onClose} className="absolute top-4 right-4 rounded-full bg-background/50 backdrop-blur border-none hover:bg-background/80 text-white">
                <X className="w-5 h-5" />
              </Button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground mb-2">
                  {initiative.category}
                </span>
                <h2 className="text-xl font-bold text-white shadow-sm">{initiative.title}</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Progress & Join */}
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{initiative.registered} / {initiative.totalSeats} Registered</span>
                  <span className="text-sm font-bold text-primary">{progressPercent}% Full</span>
                </div>
                <Progress value={progressPercent} className="h-2 mb-4" />
                <Button className="w-full" size="lg" disabled={initiative.status === 'Completed' || progressPercent === 100}>
                  {initiative.status === 'Completed' ? 'Initiative Concluded' : progressPercent === 100 ? 'Waitlist Full' : 'Join Initiative'}
                </Button>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar className="w-4 h-4 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Timeline</p>
                    <p className="text-sm font-medium">{initiative.startDate} - {initiative.endDate}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{initiative.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-4 h-4 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-medium">{initiative.duration} Hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reward</p>
                    <p className="text-sm font-bold text-amber-500">{initiative.rewardXP} XP</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">About this Initiative</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{initiative.description}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  Volunteers will participate in hands-on activities that directly contribute to our ESG goals. All necessary equipment and training will be provided on-site.
                </p>
              </div>

              {/* Requirements & Info */}
              <div>
                <h3 className="font-semibold mb-3">Requirements & Details</h3>
                <ul className="space-y-2">
                  <li className="flex text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-success mr-2 shrink-0" /> Open to all {initiative.department} employees</li>
                  <li className="flex text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-success mr-2 shrink-0" /> Manager approval required for hours logged</li>
                  <li className="flex text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-success mr-2 shrink-0" /> Organized by {initiative.organizer}</li>
                </ul>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
