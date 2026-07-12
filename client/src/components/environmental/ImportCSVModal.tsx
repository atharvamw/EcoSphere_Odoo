'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export function ImportCSVModal({ isOpen, onClose, onImportSuccess }: ImportModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 1500);
  };

  const handleSimulateImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    setFile(null);
    onClose();
    if (step === 3) onImportSuccess();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === 3 ? handleClose : undefined}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold">Import Carbon Transactions</h2>
                <p className="text-sm text-muted-foreground mt-1">Upload ERP export files (CSV, Excel) to calculate emissions.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} disabled={isProcessing} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Stepper indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
                <div className={`w-12 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
                <div className={`w-12 h-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-1">Drag & Drop your file here</h3>
                    <p className="text-sm text-muted-foreground mb-4">Supports .CSV, .XLSX (Max 50MB)</p>
                    <input type="file" id="file-upload" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                      Browse Files
                    </Button>
                  </div>
                  
                  {file && (
                    <div className="flex items-center p-3 border border-border rounded-lg bg-card">
                      <FileSpreadsheet className="w-8 h-8 text-success mr-3" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setFile(null)}><X className="w-4 h-4" /></Button>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSimulateUpload} disabled={!file || isProcessing} className="w-full">
                      {isProcessing ? 'Validating File...' : 'Upload & Validate'}
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="p-4 border border-border rounded-xl bg-card">
                    <h3 className="font-semibold flex items-center mb-4"><CheckCircle2 className="w-5 h-5 text-success mr-2" /> Validation Successful</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Total Rows Found:</span> <span className="font-medium">1,245</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Valid Rows:</span> <span className="font-medium text-success">1,243</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Invalid Rows (Skipped):</span> <span className="font-medium text-destructive">2</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Detected Date Range:</span> <span className="font-medium">Jan 1 - Dec 31, 2023</span></div>
                    </div>
                  </div>
                  
                  <div className="flex p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 items-start">
                    <AlertCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-700 dark:text-amber-400">2 rows are missing emission factor categories and will be skipped during import. You can fix them later in the Unmapped Records queue.</p>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)} disabled={isProcessing}>Back</Button>
                    <Button onClick={handleSimulateImport} disabled={isProcessing}>
                      {isProcessing ? 'Importing Data...' : 'Confirm Import'}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="text-2xl font-bold">Import Complete!</h3>
                  <p className="text-muted-foreground">1,243 transactions have been successfully imported and calculated into tCO2e.</p>
                  
                  <div className="pt-4">
                    <Button onClick={handleClose} className="w-full" variant="default">
                      View Ledger
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
