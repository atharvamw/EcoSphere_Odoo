'use client';

import React from 'react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Compass, 
  Leaf, 
  Users, 
  ShieldCheck, 
  Trophy, 
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Compass, color: 'text-foreground' },
  { name: 'Environmental', href: '/environmental', icon: Leaf, color: 'text-env-500' },
  { name: 'Social', href: '/social', icon: Users, color: 'text-social-500' },
  { name: 'Governance', href: '/governance', icon: ShieldCheck, color: 'text-gov-500' },
  { name: 'Gamification', href: '/gamification', icon: Trophy, color: 'text-amber-500' },
  { name: 'Reports', href: '/reports', icon: FileBarChart, color: 'text-foreground' },
];

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <motion.aside
      initial={{ width: isSidebarOpen ? 240 : 80 }}
      animate={{ width: isSidebarOpen ? 240 : 80 }}
      transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
      className="h-screen bg-card border-r border-border flex flex-col relative z-20 flex-shrink-0"
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-border overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Leaf className="w-5 h-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 font-semibold text-lg tracking-tight whitespace-nowrap"
            >
              EcoSphere
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center px-3 py-2.5 rounded-md transition-all duration-200 group relative",
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeSidebar"
                  className="absolute left-0 w-1 h-5 rounded-r-full bg-primary"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? item.color : "text-muted-foreground group-hover:text-foreground")} />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-3 text-sm font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {/* Bottom Area */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => router.push('/settings')}
          className="w-full flex items-center px-3 py-2.5 rounded-md transition-all hover:bg-accent/50 text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-3 text-sm font-medium whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-background border border-border rounded-full p-1 shadow-sm hover:bg-accent transition-colors z-30"
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
