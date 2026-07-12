'use client';

import { HTMLMotionProps, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

// Common motion transition curve (Stripe-like)
export const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
} as any;

export const easeOutTransition = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
  duration: 0.3,
} as any;

// Fade In Wrapper
export const FadeIn = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={easeOutTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeIn.displayName = 'FadeIn';

// Slide Up Wrapper
export const SlideUp = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={easeOutTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
SlideUp.displayName = 'SlideUp';

// Staggered Container for Lists
export const StaggerContainer = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, className, ...props }, ref) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerContainer.displayName = 'StaggerContainer';

export const StaggerItem = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, className, ...props }, ref) => {
    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0, transition: easeOutTransition },
    };

    return (
      <motion.div
        ref={ref}
        variants={itemVariants}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerItem.displayName = 'StaggerItem';
