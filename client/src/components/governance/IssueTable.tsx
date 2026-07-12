'use client';

import React, { useState } from 'react';
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import type { ComplianceIssue } from '@/lib/mock-gov-data';

interface IssueTableProps {
  data: ComplianceIssue[];
  isLoading: boolean;
  onView: (issue: ComplianceIssue) => void;
}

export function IssueTable({ data, isLoading, onView }: IssueTableProps) {
  const columns = [
    { accessorKey: 'id', header: 'ID', cell: ({ row }: any) => <span className="text-xs font-mono text-muted-foreground">{row.getValue('id')}</span> },
    { accessorKey: 'title', header: 'Issue Title', cell: ({ row }: any) => <span className="font-semibold">{row.getValue('title')}</span> },
    { accessorKey: 'department', header: 'Department' },
    { 
      accessorKey: 'severity', header: 'Severity',
      cell: ({ row }: any) => <SeverityBadge level={row.getValue('severity')} />
    },
    { 
      accessorKey: 'status', header: 'Status',
      cell: ({ row }: any) => {
        const val = row.getValue('status');
        const color = val === 'Open' ? 'bg-destructive/10 text-destructive' : val === 'Investigating' ? 'bg-amber-500/10 text-amber-500' : 'bg-success/10 text-success';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{val}</span>;
      }
    },
    { accessorKey: 'dueDate', header: 'Due Date' },
    {
      id: 'actions', header: '',
      cell: ({ row }: any) => (
        <Button variant="ghost" size="sm" onClick={() => onView(row.original)} className="h-8">
          <Eye className="w-4 h-4 mr-1" /> View
        </Button>
      )
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col h-full space-y-4">
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
                    <td className="px-4 py-4" colSpan={7}><div className="h-4 bg-muted rounded w-full"></div></td>
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
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
                    No compliance issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <div>
          Showing page <span className="font-medium text-foreground">{table.getState().pagination.pageIndex + 1}</span> of <span className="font-medium text-foreground">{table.getPageCount()}</span>
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
