import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function H1({ className, children, ...props }: TypographyProps) {
  return (
    <h1
      className={cn("text-3xl md:text-4xl font-semibold tracking-tight text-foreground", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ className, children, ...props }: TypographyProps) {
  return (
    <h2
      className={cn("text-2xl md:text-3xl font-semibold tracking-tight text-foreground", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ className, children, ...props }: TypographyProps) {
  return (
    <h3
      className={cn("text-xl md:text-2xl font-semibold tracking-tight text-foreground", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function Text({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn("text-sm md:text-base leading-relaxed text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Label({ className, children, ...props }: TypographyProps) {
  return (
    <span
      className={cn("text-xs md:text-sm font-medium text-foreground", className)}
      {...props}
    >
      {children}
    </span>
  );
}
