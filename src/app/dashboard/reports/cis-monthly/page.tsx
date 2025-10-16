'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface CISData {
  subcontractorId: string;
  subcontractorName: string;
  utr: string | null;
  grossPayment: number;
  cisDeduction: number;
  netPayment: number;
  invoiceCount: number;
}

export default function CISMonthlyReportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<CISData[]>([]);
  const [error, setError] = useState('');

  // Default to previous month
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [selectedMonth, setSelectedMonth] = useState(previousMonth.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(previousMonth.getFullYear());

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const fetchReport = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/reports/cis-monthly?month=${selectedMonth}&year=${selectedYear}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch report');
      }

      setReportData(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (reportData.length === 0) {
      alert('No data to export');
      return;
    }

    // CSV headers
    const headers = [
      'Subcontractor Name',
      'UTR',
      'Gross Payment (£)',
      'CIS Deduction (£)',
      'Net Payment (£)',
      'Invoice Count',
    ];

    // CSV rows
    const rows = reportData.map(item => [
      item.subcontractorName,
      item.utr || 'N/A',
      item.grossPayment.toFixed(2),
      item.cisDeduction.toFixed(2),
      item.netPayment.toFixed(2),
      item.invoiceCount.toString(),
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      '', // Empty row
      `Total,,${totalGross.toFixed(2)},${totalCIS.toFixed(2)},${totalNet.toFixed(2)},${totalInvoices}`,
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `CIS_Return_${selectedYear}_${String(selectedMonth).padStart(2, '0')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleDateString('en-GB', { month: 'long' });
  };

  // Calculate totals
  const totalGross = reportData.reduce((sum, item) => sum + item.grossPayment, 0);
  const totalCIS = reportData.reduce((sum, item) => sum + item.cisDeduction, 0);
  const totalNet = reportData.reduce((sum, item) => sum + item.netPayment, 0);
  const totalInvoices = reportData.reduce((sum, item) => sum + item.invoiceCount, 0);

  // Generate month options (last 24 months)
  const monthOptions = [];
  for (let i = 0; i < 24; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthOptions.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/reports" className="text-neutral-400 hover:text-neutral-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">CIS Monthly Return</h1>
              <p className="text-neutral-600 mt-1">
                Report for {getMonthName(selectedMonth)} {selectedYear}
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div>
                <label className="label text-sm">Select Period</label>
                <select
                  value={`${selectedYear}-${selectedMonth}`}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split('-');
                    setSelectedYear(parseInt(year));
                    setSelectedMonth(parseInt(month));
                  }}
                  className="input min-w-[200px]"
                >
                  {monthOptions.map((option) => (
                    <option key={`${option.year}-${option.month}`} value={`${option.year}-${option.month}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchReport}
                disabled={isLoading}
                className="btn btn-secondary btn-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                disabled={isLoading || reportData.length === 0}
                className="btn btn-primary btn-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="card p-4 bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-neutral-700">
              This report must be submitted to HMRC by the 19th of each month for the previous month's CIS deductions.
              Export to CSV and upload to the HMRC CIS online service.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        {reportData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <p className="text-sm text-neutral-600">Total Gross Payment</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{formatCurrency(totalGross)}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-neutral-600">Total CIS Deduction</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalCIS)}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-neutral-600">Total Net Payment</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalNet)}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-neutral-600">Total Invoices</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{totalInvoices}</p>
            </div>
          </div>
        )}

        {/* Report Table */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Subcontractor Breakdown</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-neutral-600 mt-3">Loading report...</p>
            </div>
          ) : reportData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Subcontractor</th>
                    <th>UTR</th>
                    <th className="text-right">Gross Payment</th>
                    <th className="text-right">CIS Deduction</th>
                    <th className="text-right">Net Payment</th>
                    <th className="text-center">Invoices</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item) => (
                    <tr key={item.subcontractorId}>
                      <td>
                        <Link
                          href={`/dashboard/subcontractors/${item.subcontractorId}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {item.subcontractorName}
                        </Link>
                      </td>
                      <td>
                        {item.utr ? (
                          <span className="font-mono text-sm">{item.utr}</span>
                        ) : (
                          <span className="text-red-600 text-sm">Missing UTR</span>
                        )}
                      </td>
                      <td className="text-right">{formatCurrency(item.grossPayment)}</td>
                      <td className="text-right text-red-600">-{formatCurrency(item.cisDeduction)}</td>
                      <td className="text-right font-medium text-green-600">{formatCurrency(item.netPayment)}</td>
                      <td className="text-center">
                        <span className="badge badge-neutral">{item.invoiceCount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <td colSpan={2}>Total</td>
                    <td className="text-right">{formatCurrency(totalGross)}</td>
                    <td className="text-right text-red-600">-{formatCurrency(totalCIS)}</td>
                    <td className="text-right text-green-600">{formatCurrency(totalNet)}</td>
                    <td className="text-center">{totalInvoices}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-neutral-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg">No CIS deductions for this period</p>
              <p className="text-sm mt-1">
                No invoices with CIS deductions were paid in {getMonthName(selectedMonth)} {selectedYear}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
