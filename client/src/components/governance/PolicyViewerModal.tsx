'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PolicyDocument } from '@/lib/mock-gov-data';

interface ModalProps {
  policy: PolicyDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: (id: string) => Promise<void>;
}

export function PolicyViewerModal({ policy, isOpen, onClose, onAcknowledge }: ModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  if (!policy) return null;

  const handleScroll = () => {
    if (contentRef.current && !hasScrolledToBottom) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      // Allow a 50px buffer
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onAcknowledge(policy.id);
      setIsSuccess(true);
    } catch (error) {
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setHasScrolledToBottom(false);
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing && !isSuccess ? handleClose : undefined}
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-4xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg"><FileText className="w-5 h-5 text-primary" /></div>
                <div>
                  <h2 className="font-bold text-lg leading-tight">{policy.title}</h2>
                  <p className="text-xs text-muted-foreground">Version {policy.version} • Effective: {policy.effectiveDate}</p>
                </div>
              </div>
              {!isProcessing && !isSuccess && (
                <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full shrink-0">
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Document Body */}
            {!isSuccess ? (
              <>
                <div 
                  ref={contentRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-8 bg-background prose prose-sm md:prose-base dark:prose-invert max-w-none relative"
                >
                  {/* We use dangerouslySetInnerHTML safely with mock data for demonstration. In prod, use DOMPurify. */}
                  <div dangerouslySetInnerHTML={{ __html: policy.content }} />
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    {!policy.isAcknowledgedByMe ? (
                      hasScrolledToBottom ? (
                        <span className="text-success flex items-center font-medium"><CheckCircle2 className="w-4 h-4 mr-2" /> Ready to acknowledge</span>
                      ) : (
                        <span className="text-amber-500 flex items-center font-medium"><AlertCircle className="w-4 h-4 mr-2" /> Please read to the bottom</span>
                      )
                    ) : (
                      <span className="text-success flex items-center font-bold"><CheckCircle2 className="w-4 h-4 mr-2" /> Acknowledged on {new Date().toISOString().split('T')[0]}</span>
                    )}
                  </div>
                  
                  {!policy.isAcknowledgedByMe && (
                    <Button 
                      onClick={handleConfirm}
                      disabled={!hasScrolledToBottom || isProcessing}
                      className="min-w-[150px]"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'I Acknowledge'}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="p-16 flex flex-col items-center justify-center text-center flex-1 bg-muted/10">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Policy Acknowledged</h3>
                <p className="text-muted-foreground mb-6 max-w-md">Your digital acknowledgement has been recorded in the system audit log. Thank you for maintaining compliance.</p>
                <Button onClick={handleClose}>Return to Policy Center</Button>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
