'use client';

import React from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Button } from '@/components/ui/button';
import { Calendar, Building, Download, FilterX, SlidersHorizontal } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const dateRanges = [
  { id: 'today', label: 'Today' },
  { id: 'last_7_days', label: 'Last 7 Days' },
  { id: 'last_30_days', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'this_quarter', label: 'This Quarter' },
  { id: 'this_year', label: 'This Year' },
];

export function DashboardFilterBar() {
  const { dateRange, setDateRange, selectedDepartment, setSelectedDepartment } = useDashboardStore();

  const handleReset = () => {
    setDateRange('this_quarter');
    setSelectedDepartment(null);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border rounded-xl p-2 mb-6 shadow-sm">
      <div className="flex items-center space-x-2 flex-wrap gap-y-2">
        {/* Date Range Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="outline" size="sm" className="bg-background">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              {dateRanges.find(d => d.id === dateRange)?.label || 'Date Range'}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="z-50 min-w-[200px] bg-popover border border-border rounded-xl p-1 shadow-lg mt-1 animate-in slide-in-from-top-2">
              {dateRanges.map((range) => (
                <DropdownMenu.Item
                  key={range.id}
                  onClick={() => setDateRange(range.id as any)}
                  className={`px-3 py-2 text-sm cursor-pointer outline-none rounded-md transition-colors ${dateRange === range.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent hover:text-accent-foreground'}`}
                >
                  {range.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Department Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="outline" size="sm" className="bg-background">
              <Building className="w-4 h-4 mr-2 text-muted-foreground" />
              {selectedDepartment || 'All Departments'}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="z-50 min-w-[240px] bg-popover border border-border rounded-xl p-1 shadow-lg mt-1 animate-in slide-in-from-top-2">
              <DropdownMenu.Item
                onClick={() => setSelectedDepartment(null)}
                className={`px-3 py-2 text-sm cursor-pointer outline-none rounded-md transition-colors ${!selectedDepartment ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent hover:text-accent-foreground'}`}
              >
                All Departments
              </DropdownMenu.Item>
              <div className="h-px bg-border my-1" />
              {/* Note: In a real app DEPARTMENTS would be imported from mock-data, but for ease it's hardcoded here or we fetch it. We will just use a hardcoded list for now */}
              {['Manufacturing', 'Logistics & Fleet', 'Research & Development', 'Human Resources', 'Sales & Marketing', 'Operations', 'IT & Infrastructure'].map((dept) => (
                <DropdownMenu.Item
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-2 text-sm cursor-pointer outline-none rounded-md transition-colors ${selectedDepartment === dept ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent hover:text-accent-foreground'}`}
                >
                  {dept}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Button variant="ghost" size="sm" className="hidden lg:flex text-muted-foreground hover:text-foreground">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          More Filters
        </Button>

        {(dateRange !== 'this_quarter' || selectedDepartment) && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <FilterX className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2 text-muted-foreground" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}
