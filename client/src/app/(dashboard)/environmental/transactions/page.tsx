'use client';

import React, { useState, useEffect } from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { UploadCloud, Plus } from 'lucide-react';
import { TransactionTable } from '@/components/environmental/TransactionTable';
import { ImportCSVModal } from '@/components/environmental/ImportCSVModal';
import { useQuery } from '@tanstack/react-query';
import { envService } from '@/api/environmental.service';

export default function TransactionsLedgerPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isImportModalOpen, setImportModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Transactions
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['transactions', page, debouncedSearch],
    queryFn: () => envService.getTransactions(page, 50, debouncedSearch),
  });

  return (
    <FadeIn className="w-full pb-10 flex flex-col h-[calc(100vh-2rem)]">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0 flex-shrink-0">
        <div>
          <H1>Carbon Ledger</H1>
          <Text>Enterprise transaction database for all tracked emissions.</Text>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setImportModalOpen(true)}>
            <UploadCloud className="w-4 h-4 mr-2" />
            Import ERP Data
          </Button>
          <Button variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <TransactionTable 
          data={data?.data || []} 
          isLoading={isLoading} 
          totalPages={data?.meta?.totalPages || 1}
          currentPage={page}
          onPageChange={setPage}
          onSearch={setSearch}
        />
      </div>

      <ImportCSVModal 
        isOpen={isImportModalOpen} 
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={() => {
          setPage(1);
          refetch(); // Automatically refresh table
        }}
      />
    </FadeIn>
  );
}
