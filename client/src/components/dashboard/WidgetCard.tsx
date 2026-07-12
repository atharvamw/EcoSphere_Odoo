'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Maximize2, Minimize2, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
  className?: string;
  headerAction?: React.ReactNode;
}

export function WidgetCard({
  title,
  children,
  isLoading,
  isError,
  onRefresh,
  className,
  headerAction
}: WidgetCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isError) {
    return (
      <Card className={cn("h-full flex flex-col justify-center items-center p-6 text-center border-destructive/20 bg-destructive/5", className)}>
        <AlertCircle className="h-8 w-8 text-destructive mb-3" />
        <h4 className="font-semibold mb-1">Failed to load {title}</h4>
        <p className="text-sm text-muted-foreground mb-4">An error occurred while fetching the data.</p>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        )}
      </Card>
    );
  }

  const containerClasses = isFullscreen 
    ? "fixed inset-4 z-50 overflow-hidden flex flex-col shadow-2xl" 
    : cn("h-full flex flex-col relative", className);

  return (
    <>
      {isFullscreen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsFullscreen(false)} />
      )}
      <Card className={containerClasses}>
        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border/50">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            {headerAction}
            {onRefresh && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onRefresh} disabled={isLoading}>
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 p-4"
              >
                <Skeleton className="h-full w-full rounded-md" />
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="h-full w-full p-4 overflow-y-auto"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </>
  );
}
