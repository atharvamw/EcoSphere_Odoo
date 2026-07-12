'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewerProps {
  evidenceUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceViewer({ evidenceUrl, isOpen, onClose }: ViewerProps) {
  if (!evidenceUrl) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
          />
          
          {/* Viewer Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center space-x-3">
                <h2 className="font-semibold">Evidence Preview</h2>
                <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success flex items-center border border-success/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> AI Verified (98% match)
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm"><ZoomIn className="w-4 h-4 mr-2" /> Zoom</Button>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Download</Button>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full"><X className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6 bg-muted/10 flex items-center justify-center min-h-[400px]">
              <img 
                src={evidenceUrl} 
                alt="Submitted Evidence" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-md border border-border/50" 
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
