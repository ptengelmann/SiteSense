'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  subcontractorName: string;
  projectName: string | null;
  paymentDate: Date;
  amount: number;
  cisDeduction: number;
  netPayment: number;
  status: string;
}

export default function PaymentHistoryPage() {
  const [data, setData] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/reports/payment-history?startDate=${startDate}&endDate=${endDate}`
      );
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Invoice', 'Subcontractor', 'Project', 'Amount', 'CIS Deduction', 'Net Payment'];
    const rows = data.map(r => [
      new Date(r.paymentDate).toLocaleDateString('en-GB'),
      r.invoiceNumber,
      r.subcontractorName,
      r.projectName || 'N/A',
      r.amount.toFixed(2),
      r.cisDeduction.toFixed(2),
      r.netPayment.toFixed(2),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payment_History_${startDate}_${endDate}.csv`;
    a.click();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

  const total = data.reduce((sum, r) => sum + r.netPayment, 0);

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
            <div>
              <h1 className="text-3xl text-neutral-900 tracking-tight">Payment History</h1>
              <p className="text-neutral-600 mt-1 font-light">All payments to subcontractors</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-6 bg-white border border-neutral-200">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div className="flex gap-4">
              <div>
                <label className="label text-sm">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label text-sm">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <button onClick={exportCSV} disabled={data.length === 0} className="btn btn-primary btn-thin">
              Export CSV
            </button>
          </div>
        </div>

        <div className="rounded-lg p-6 bg-white border border-neutral-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg tracking-tight">Payment Records</h2>
            <div className="text-sm text-neutral-600">
              Total: <span className="font-medium text-green-600">{formatCurrency(total)}</span>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Invoice</th>
                    <th>Subcontractor</th>
                    <th>Project</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">CIS</th>
                    <th className="text-right">Net Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((record) => (
                    <tr key={record.id}>
                      <td>{new Date(record.paymentDate).toLocaleDateString('en-GB')}</td>
                      <td>
                        <Link href={`/dashboard/invoices/${record.id}`} className="text-primary-600 hover:underline">
                          {record.invoiceNumber}
                        </Link>
                      </td>
                      <td>{record.subcontractorName}</td>
                      <td>{record.projectName || '-'}</td>
                      <td className="text-right">{formatCurrency(record.amount)}</td>
                      <td className="text-right text-red-600">-{formatCurrency(record.cisDeduction)}</td>
                      <td className="text-right font-medium text-green-600">{formatCurrency(record.netPayment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">No payments found for this period</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
