'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function InvoiceStatusPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/invoice-status')
      .then(res => res.json())
      .then(result => setData(result.data))
      .finally(() => setIsLoading(false));
  }, []);

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/reports" className="text-neutral-400 hover:text-neutral-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900">Invoice Status Report</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card p-6">
                <p className="text-sm text-neutral-600">Draft</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{data.byStatus.DRAFT || 0}</p>
                <p className="text-sm text-neutral-600 mt-2">{formatCurrency(data.amountByStatus.DRAFT || 0)}</p>
              </div>
              <div className="card p-6">
                <p className="text-sm text-neutral-600">Approved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{data.byStatus.APPROVED || 0}</p>
                <p className="text-sm text-neutral-600 mt-2">{formatCurrency(data.amountByStatus.APPROVED || 0)}</p>
              </div>
              <div className="card p-6">
                <p className="text-sm text-neutral-600">Paid</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{data.byStatus.PAID || 0}</p>
                <p className="text-sm text-neutral-600 mt-2">{formatCurrency(data.amountByStatus.PAID || 0)}</p>
              </div>
              <div className="card p-6">
                <p className="text-sm text-neutral-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{data.overdue.count}</p>
                <p className="text-sm text-neutral-600 mt-2">{formatCurrency(data.overdue.amount)}</p>
              </div>
            </div>

            {data.overdue.count > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-red-600 mb-4">Overdue Invoices</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Subcontractor</th>
                      <th>Due Date</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">Days Overdue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.overdue.invoices.map((inv: any) => (
                      <tr key={inv.id}>
                        <td>
                          <Link href={`/dashboard/invoices/${inv.id}`} className="text-primary-600 hover:underline">
                            {inv.invoiceNumber}
                          </Link>
                        </td>
                        <td>{inv.subcontractorName}</td>
                        <td>{new Date(inv.dueDate).toLocaleDateString('en-GB')}</td>
                        <td className="text-right">{formatCurrency(inv.amount)}</td>
                        <td className="text-right text-red-600">{inv.daysOverdue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : <div className="text-center py-12 text-neutral-500">No data available</div>}
      </div>
    </DashboardLayout>
  );
}
