'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Compass, Leaf, Users, ShieldAlert, Award, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';

// Standard styling for command palette using tailwind classes
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-popover rounded-xl shadow-2xl border border-border overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full">
          <div className="flex items-center px-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Command.Input 
              autoFocus 
              placeholder="Search EcoSphere or type a command..." 
              className="w-full bg-transparent border-0 h-14 text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none text-lg"
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-muted-foreground">No results found.</Command.Empty>

            <Command.Group heading="Navigation" className="px-2 text-xs font-semibold text-muted-foreground py-2">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center px-2 py-3 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground text-sm text-foreground mt-1"
              >
                <Compass className="w-4 h-4 mr-3 text-muted-foreground" />
                Dashboard
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/environmental'))}
                className="flex items-center px-2 py-3 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground text-sm text-foreground"
              >
                <Leaf className="w-4 h-4 mr-3 text-env-500" />
                Environmental Impact
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/social'))}
                className="flex items-center px-2 py-3 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground text-sm text-foreground"
              >
                <Users className="w-4 h-4 mr-3 text-social-500" />
                Social & CSR
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/governance'))}
                className="flex items-center px-2 py-3 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground text-sm text-foreground"
              >
                <ShieldAlert className="w-4 h-4 mr-3 text-gov-500" />
                Governance & Compliance
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading="Quick Actions" className="px-2 text-xs font-semibold text-muted-foreground py-2 border-t border-border mt-2">
              <Command.Item 
                onSelect={() => runCommand(() => console.log('Log Carbon'))}
                className="flex items-center px-2 py-3 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground text-sm text-foreground mt-1"
              >
                <Leaf className="w-4 h-4 mr-3 text-muted-foreground" />
                Log Carbon Transaction
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => console.log('Create CSR'))}
                className="flex items-center px-2 py-3 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground text-sm text-foreground"
              >
                <Users className="w-4 h-4 mr-3 text-muted-foreground" />
                Propose CSR Activity
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
