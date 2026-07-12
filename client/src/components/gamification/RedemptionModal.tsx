'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GameReward } from '@/lib/mock-game-data';

interface ModalProps {
  reward: GameReward | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rewardId: string) => Promise<void>;
  userXP: number;
}

export function RedemptionModal({ reward, isOpen, onClose, onConfirm, userXP }: ModalProps) {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');

  if (!reward) return null;

  const handleConfirm = async () => {
    setStep('processing');
    try {
      await onConfirm(reward.id);
      setStep('success');
    } catch (error) {
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('confirm');
    onClose();
  };

  const remainingXP = userXP - reward.xpCost;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step !== 'processing' ? handleClose : undefined}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          >
            {step === 'confirm' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-xl font-bold">Confirm Redemption</h2>
                  <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <img src={reward.image} alt={reward.title} className="w-20 h-20 rounded-lg object-cover border border-border" />
                    <div>
                      <h3 className="font-semibold text-lg">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground">{reward.category} Delivery</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-xl p-4 space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Balance</span>
                      <span className="font-semibold">{userXP} XP</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="font-bold text-destructive">-{reward.xpCost} XP</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining Balance</span>
                      <span className="font-semibold">{remainingXP} XP</span>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-3">
                    <Button variant="outline" className="w-full" onClick={handleClose}>Cancel</Button>
                    <Button variant="default" className="w-full" onClick={handleConfirm}>Confirm Redeem</Button>
                  </div>
                </div>
              </>
            )}

            {step === 'processing' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-bold">Processing Transaction...</h3>
                <p className="text-sm text-muted-foreground mt-2">Validating XP balance and reserving inventory.</p>
              </div>
            )}

            {step === 'success' && (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Redemption Successful!</h3>
                <p className="text-muted-foreground mb-6">Your "{reward.title}" has been claimed. You will receive an email shortly with delivery details.</p>
                <Button className="w-full" onClick={handleClose}>Awesome, thanks!</Button>
              </div>
            )}

            {step === 'error' && (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Transaction Failed</h3>
                <p className="text-muted-foreground mb-6">There was an issue processing your redemption. Please try again later.</p>
                <Button variant="outline" className="w-full" onClick={handleClose}>Close</Button>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
