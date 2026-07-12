'use client';

import React, { useState } from 'react';
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import type { AuditLog } from '@/lib/mock-gov-data';

interface AuditTableProps {
  data: AuditLog[];
  isLoading: boolean;
}

export function AuditDataTable({ data, isLoading }: AuditTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = [
    { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ row }: any) => <span className="font-mono text-xs">{row.getValue('timestamp')}</span> },
    { accessorKey: 'user', header: 'User', cell: ({ row }: any) => <span className="font-semibold text-primary">{row.getValue('user')}</span> },
    { accessorKey: 'action', header: 'Action', cell: ({ row }: any) => <span className="font-medium bg-muted/50 px-2 py-0.5 rounded text-xs">{row.getValue('action')}</span> },
    { accessorKey: 'module', header: 'Module' },
    { accessorKey: 'details', header: 'Details', cell: ({ row }: any) => <span className="text-muted-foreground text-xs">{row.getValue('details')}</span> },
    { accessorKey: 'ipAddress', header: 'IP Address', cell: ({ row }: any) => <span className="font-mono text-[10px] text-muted-foreground">{row.getValue('ipAddress')}</span> },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-card p-3 rounded-lg border border-border shadow-sm">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search audit trails..." 
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="rounded-md border border-border overflow-hidden bg-card flex-1 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground text-[10px] uppercase font-bold tracking-wider border-b border-border">
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
                Array.from({ length: 15 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50 animate-pulse">
                    <td className="px-4 py-3" colSpan={6}><div className="h-4 bg-muted rounded w-full"></div></td>
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                    No matching audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <div>
          Showing page <span className="font-medium text-foreground">{table.getState().pagination.pageIndex + 1}</span> of <span className="font-medium text-foreground">{table.getPageCount() || 1}</span>
          <span className="ml-4">({table.getFilteredRowModel().rows.length} total records)</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
