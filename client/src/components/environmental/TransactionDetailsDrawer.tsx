'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Building, Activity, FileCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CarbonTransaction } from '@/lib/mock-env-data';
import { useEnvStore } from '@/store/envStore';

interface DrawerProps {
  transaction: CarbonTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailsDrawer({ transaction, isOpen, onClose }: DrawerProps) {
  const { globalUnit } = useEnvStore();
  
  if (!transaction) return null;

  const displayValue = globalUnit === 'tCO2e' ? transaction.tco2e : (transaction.tco2e * 1000);

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
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold">Transaction Details</h2>
                <p className="text-sm text-muted-foreground">{transaction.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Highlight KPI */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1">Calculated Emissions</p>
                <div className="text-3xl font-bold text-foreground">
                  {displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg text-primary">{globalUnit}</span>
                </div>
                <div className={`mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${transaction.status === 'Verified' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'}`}>
                  {transaction.status}
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center"><Calendar className="w-3 h-3 mr-1" /> Date</p>
                  <p className="text-sm font-medium">{transaction.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center"><Activity className="w-3 h-3 mr-1" /> Source</p>
                  <p className="text-sm font-medium">{transaction.source}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center"><Building className="w-3 h-3 mr-1" /> Department</p>
                  <p className="text-sm font-medium">{transaction.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center"><MapPin className="w-3 h-3 mr-1" /> Location</p>
                  <p className="text-sm font-medium">{transaction.location}</p>
                </div>
              </div>

              <div className="h-px bg-border my-2" />

              {/* Calculation Breakdown */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center"><Info className="w-4 h-4 mr-2" /> Calculation Variables</h3>
                <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Original Quantity</span>
                    <span className="font-medium">{transaction.quantity.toLocaleString()} {transaction.originalUnit}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Emission Factor</span>
                    <span className="font-medium">{transaction.emissionFactor} kgCO2e / {transaction.originalUnit}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Scope</span>
                    <span className="font-medium">{transaction.scope}</span>
                  </div>
                </div>
              </div>

              {/* Audit */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center"><FileCheck className="w-4 h-4 mr-2" /> Audit Trail</h3>
                <div className="border-l-2 border-primary/20 pl-4 py-1 space-y-4">
                  <div className="relative">
                    <div className="absolute w-2 h-2 bg-primary rounded-full -left-[21px] top-1.5" />
                    <p className="text-sm font-medium">Record Created</p>
                    <p className="text-xs text-muted-foreground">by {transaction.createdBy} on {transaction.date}</p>
                  </div>
                  {transaction.status === 'Verified' && (
                    <div className="relative">
                      <div className="absolute w-2 h-2 bg-success rounded-full -left-[21px] top-1.5" />
                      <p className="text-sm font-medium">Verified by Auditor</p>
                      <p className="text-xs text-muted-foreground">SGS Certification Body</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-border flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button variant="default">Edit Record</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
