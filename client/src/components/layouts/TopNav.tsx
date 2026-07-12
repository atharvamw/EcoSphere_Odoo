'use client';

import React from 'react';
import { Search, Bell, Sun, Moon, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function TopNav() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      {/* Global Search Trigger */}
      <div className="flex-1 max-w-md">
        <button 
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="flex items-center w-full px-3 py-2 text-sm text-muted-foreground bg-muted/50 border border-border rounded-md hover:bg-muted transition-colors group"
        >
          <Search className="w-4 h-4 mr-2 group-hover:text-foreground transition-colors" />
          <span>Search EcoSphere...</span>
          <span className="ml-auto text-xs border border-border rounded px-1.5 py-0.5 bg-background">⌘K</span>
        </button>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center space-x-3">
        <Button variant="ai" size="sm" className="hidden md:flex">
          <Zap className="w-4 h-4 mr-2 fill-current" />
          AI Insights
        </Button>

        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground" />
        </Button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="z-50 min-w-[280px] bg-popover border border-border rounded-xl p-1 shadow-lg mt-2 mr-6 animate-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-border mb-1">
                <span className="text-sm font-semibold">Notifications</span>
              </div>
              <DropdownMenu.Item className="px-3 py-2 text-sm cursor-pointer outline-none hover:bg-accent hover:text-accent-foreground rounded-md flex flex-col">
                <span className="font-medium text-gov-600">Compliance Alert</span>
                <span className="text-muted-foreground text-xs mt-0.5">Missing policy acknowledgement.</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="px-3 py-2 text-sm cursor-pointer outline-none hover:bg-accent hover:text-accent-foreground rounded-md flex flex-col">
                <span className="font-medium text-social-600">CSR Approval</span>
                <span className="text-muted-foreground text-xs mt-0.5">3 pending approvals for your team.</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 cursor-pointer ring-2 ring-transparent hover:ring-border transition-all" />
      </div>
    </header>
  );
}
