'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function SubcontractorPerformancePage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/subcontractor-performance')
      .then(res => res.json())
      .then(result => setData(result.data || []))
      .finally(() => setIsLoading(false));
  }, []);

  const exportCSV = () => {
    const headers = ['Subcontractor', 'Total Paid', 'Total Invoices', 'Avg Invoice Value', 'CIS Status'];
    const rows = data.map(s => [s.name, s.totalPaid.toFixed(2), s.invoiceCount, s.avgInvoiceValue.toFixed(2), s.cisStatus]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Subcontractor_Performance.csv';
    a.click();
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/reports" className="text-neutral-400 hover:text-neutral-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl text-neutral-900 tracking-tight">Subcontractor Performance</h1>
          </div>
          <button onClick={exportCSV} disabled={data.length === 0} className="btn btn-primary btn-thin">Export CSV</button>
        </div>

        <div className="rounded-lg p-6 bg-white border border-neutral-200">
          {isLoading ? <div className="text-center py-12">Loading...</div> : data.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Subcontractor</th>
                  <th className="text-right">Total Paid</th>
                  <th className="text-center">Invoices</th>
                  <th className="text-right">Avg Value</th>
                  <th>CIS Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map(s => (
                  <tr key={s.id}>
                    <td><Link href={`/dashboard/subcontractors/${s.id}`} className="text-primary-600 hover:underline">{s.name}</Link></td>
                    <td className="text-right font-medium">{formatCurrency(s.totalPaid)}</td>
                    <td className="text-center"><span className="badge badge-neutral">{s.invoiceCount}</span></td>
                    <td className="text-right">{formatCurrency(s.avgInvoiceValue)}</td>
                    <td><span className={`badge ${s.cisStatus === 'VERIFIED' ? 'badge-success' : 'badge-warning'}`}>{s.cisStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="text-center py-12 text-neutral-500">No data available</div>}
        </div>
      </div>
    </DashboardLayout>
  );
}
