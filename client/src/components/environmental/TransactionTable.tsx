'use client';

import React, { useState } from 'react';
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getPaginationRowModel,
  getSortedRowModel,
  SortingState
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowUpDown, Search, Download } from 'lucide-react';
import { useEnvStore } from '@/store/envStore';
import type { CarbonTransaction } from '@/lib/mock-env-data';
import { TransactionDetailsDrawer } from './TransactionDetailsDrawer';

interface TableProps {
  data: CarbonTransaction[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
}

export function TransactionTable({ data, isLoading, totalPages, currentPage, onPageChange, onSearch }: TableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { globalUnit } = useEnvStore();
  const [selectedRow, setSelectedRow] = useState<CarbonTransaction | null>(null);

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'date', header: 'Date', 
      cell: ({ row }: any) => <span className="text-muted-foreground whitespace-nowrap">{row.getValue('date')}</span>
    },
    { accessorKey: 'source', header: 'Source',
      cell: ({ row }: any) => <span className="font-medium">{row.getValue('source')}</span>
    },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'scope', header: 'Scope',
      cell: ({ row }: any) => {
        const val = row.getValue('scope') as string;
        const color = val === 'Scope 1' ? 'text-blue-500 bg-blue-500/10' : val === 'Scope 2' ? 'text-amber-500 bg-amber-500/10' : 'text-purple-500 bg-purple-500/10';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{val}</span>;
      }
    },
    { accessorKey: 'tco2e', header: () => (
        <Button variant="ghost" onClick={() => setSorting([{ id: 'tco2e', desc: !sorting[0]?.desc }])} className="-ml-4 h-8 data-[state=open]:bg-accent">
          Emissions ({globalUnit}) <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: any) => {
        const val = row.getValue('tco2e') as number;
        const displayVal = globalUnit === 'tCO2e' ? val : (val * 1000);
        return <span className="font-bold">{displayVal.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>;
      }
    },
    { accessorKey: 'status', header: 'Status',
      cell: ({ row }: any) => {
        const val = row.getValue('status') as string;
        const color = val === 'Verified' ? 'text-success bg-success/10' : 'text-amber-500 bg-amber-500/10';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{val}</span>;
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Table Toolbar */}
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-md border border-border overflow-hidden bg-card flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium border-b border-border">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-3 whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50 animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-32"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-28"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <tr 
                    key={row.id} 
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedRow(row.original)}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Server Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <div>
          Showing page <span className="font-medium text-foreground">{currentPage}</span> of <span className="font-medium text-foreground">{totalPages || 1}</span>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Drawer */}
      <TransactionDetailsDrawer 
        transaction={selectedRow} 
        isOpen={!!selectedRow} 
        onClose={() => setSelectedRow(null)} 
      />
    </div>
  );
}
