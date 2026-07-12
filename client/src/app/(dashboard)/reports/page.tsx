'use client';

import React from 'react';
import { H1, Text } from '@/components/ui/typography';
import { Breadcrumb } from '@/components/layouts/Breadcrumb';
import { FadeIn } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { Download, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ReportsPage() {
  const mockReports = [
    { id: 1, title: 'Q2 2026 Sustainability Report', date: '2026-07-01', type: 'Environmental', format: 'PDF' },
    { id: 2, title: 'Annual Diversity & Inclusion Review', date: '2026-06-15', type: 'Social', format: 'PDF' },
    { id: 3, title: 'Compliance Audit - Q2', date: '2026-06-10', type: 'Governance', format: 'CSV' },
    { id: 4, title: 'Carbon Emissions Summary (YTD)', date: '2026-07-10', type: 'Environmental', format: 'XLSX' },
  ];

  return (
    <FadeIn className="w-full pb-20">
      <Breadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <H1>Reports & Analytics</H1>
          <Text>Generate, view, and download ESG compliance and performance reports.</Text>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <FileText className="w-4 h-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search reports..." />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Report Title</th>
                <th className="px-6 py-4 font-medium">Date Generated</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Format</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      {report.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{report.format}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </FadeIn>
  );
}
