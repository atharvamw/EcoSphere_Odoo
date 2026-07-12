import React from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from '../ui/motion';
import { H3, Text } from '../ui/typography';
import { Button } from '../ui/button';
import { SearchX } from 'lucide-react'; // Default icon

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  actionLabel, 
  onAction, 
  className 
}: EmptyStateProps) {
  return (
    <FadeIn className={cn("flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed border-border bg-muted/20", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground mb-6">
        {icon || <SearchX className="h-10 w-10" />}
      </div>
      <H3 className="mb-2">{title}</H3>
      <Text className="max-w-sm mb-6">{description}</Text>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </FadeIn>
  );
}
