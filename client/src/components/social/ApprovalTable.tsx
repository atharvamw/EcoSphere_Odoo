'use client';

import React, { useState } from 'react';
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getPaginationRowModel,
  RowSelectionState
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, X, FileImage, Layers } from 'lucide-react';
import type { CSRApproval } from '@/lib/mock-social-data';
import { EvidenceViewer } from './EvidenceViewer';

interface TableProps {
  data: CSRApproval[];
  isLoading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBulkApprove: (ids: string[]) => void;
}

export function ApprovalTable({ data, isLoading, onApprove, onReject, onBulkApprove }: TableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null);

  const columns = [
    { 
      id: 'select',
      header: ({ table }: any) => (
        <input 
          type="checkbox" 
          className="rounded border-border"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }: any) => (
        <input 
          type="checkbox"
          className="rounded border-border"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    { accessorKey: 'employeeName', header: 'Employee', cell: ({ row }: any) => <span className="font-semibold">{row.getValue('employeeName')}</span> },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'initiativeTitle', header: 'Initiative' },
    { accessorKey: 'hours', header: 'Hours', cell: ({ row }: any) => <span className="font-medium">{row.getValue('hours')}h</span> },
    { accessorKey: 'dateSubmitted', header: 'Submitted' },
    { 
      id: 'evidence', header: 'Evidence',
      cell: ({ row }: any) => (
        <Button variant="ghost" size="sm" className="h-8 px-2 text-primary" onClick={() => setEvidenceUrl(row.original.evidenceUrl)}>
          <FileImage className="w-4 h-4 mr-1" /> View
        </Button>
      )
    },
    { 
      accessorKey: 'status', header: 'Status',
      cell: ({ row }: any) => {
        const val = row.getValue('status');
        const color = val === 'Approved' ? 'bg-success/10 text-success' : val === 'Rejected' ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-500';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{val}</span>;
      }
    },
    {
      id: 'actions', header: '',
      cell: ({ row }: any) => {
        const isPending = row.getValue('status') === 'Pending';
        if (!isPending) return null;
        return (
          <div className="flex justify-end space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10" onClick={() => onApprove(row.original.id)}>
              <Check className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onReject(row.original.id)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const pendingSelected = selectedRows.filter(r => r.original.status === 'Pending').map(r => r.original.id);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Table Toolbar */}
      <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border">
        <div className="text-sm font-medium">
          {Object.keys(rowSelection).length} row(s) selected.
        </div>
        <div className="flex space-x-2">
          {pendingSelected.length > 0 && (
            <Button variant="default" size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => {
              onBulkApprove(pendingSelected);
              setRowSelection({});
            }}>
              <Layers className="w-4 h-4 mr-2" /> Bulk Approve ({pendingSelected.length})
            </Button>
          )}
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
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50 animate-pulse">
                    <td className="px-4 py-4" colSpan={9}><div className="h-4 bg-muted rounded w-full"></div></td>
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${row.getIsSelected() ? 'bg-primary/5' : ''}`}>
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
                    No approval requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <div>
          Showing page <span className="font-medium text-foreground">{table.getState().pagination.pageIndex + 1}</span> of <span className="font-medium text-foreground">{table.getPageCount()}</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* View Evidence Modal */}
      <EvidenceViewer evidenceUrl={evidenceUrl} isOpen={!!evidenceUrl} onClose={() => setEvidenceUrl(null)} />
    </div>
  );
}
