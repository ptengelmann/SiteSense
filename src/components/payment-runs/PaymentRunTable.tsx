'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PaymentRun {
  id: string;
  name: string;
  scheduledDate: Date;
  status: string;
  totalAmount: number;
  totalCisDeduction: number;
  netPayment: number;
  invoiceCount: number;
  exportedAt: Date | null;
  paidAt: Date | null;
  createdAt: Date;
  creator: {
    firstName: string | null;
    lastName: string | null;
  } | null;
}

interface PaymentRunTableProps {
  initialData: PaymentRun[];
}

export default function PaymentRunTable({ initialData }: PaymentRunTableProps) {
  const [paymentRuns] = useState(initialData);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter payment runs
  const filteredData = paymentRuns.filter((run) => {
    return statusFilter === 'all' || run.status === statusFilter;
  });

  // Sort payment runs
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'date') {
      comparison = new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    } else if (sortBy === 'amount') {
      comparison = a.netPayment - b.netPayment;
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      DRAFT: 'badge-neutral',
      READY: 'badge-info',
      EXPORTED: 'badge-warning',
      PAID: 'badge-success',
    };
    return badges[status as keyof typeof badges] || 'badge-neutral';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const handleSort = (column: 'date' | 'amount' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="rounded-lg p-6 bg-white border border-neutral-200">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="READY">Ready</option>
            <option value="EXPORTED">Exported</option>
            <option value="PAID">Paid</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th
                className="cursor-pointer hover:bg-neutral-50"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  Scheduled Date
                  {sortBy === 'date' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th>Payment Run Name</th>
              <th className="text-center">Invoices</th>
              <th
                className="text-right cursor-pointer hover:bg-neutral-50"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-2">
                  Net Payment
                  {sortBy === 'amount' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="cursor-pointer hover:bg-neutral-50"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  {sortBy === 'status' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th>Created By</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((run) => (
                <tr key={run.id} className="hover:bg-neutral-50">
                  <td>{formatDate(run.scheduledDate)}</td>
                  <td>
                    <Link
                      href={`/dashboard/payment-runs/${run.id}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {run.name}
                    </Link>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-neutral">{run.invoiceCount}</span>
                  </td>
                  <td className="text-right">
                    <div className="font-medium text-green-600">
                      {formatCurrency(run.netPayment)}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Total: {formatCurrency(run.totalAmount)}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(run.status)}`}>
                      {run.status}
                    </span>
                  </td>
                  <td>
                    {run.creator ? (
                      <span className="text-sm text-neutral-700">
                        {run.creator.firstName} {run.creator.lastName}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <Link
                      href={`/dashboard/payment-runs/${run.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-neutral-500">
                  No payment runs found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between text-sm text-neutral-600">
        <div>
          Showing {sortedData.length} of {paymentRuns.length} payment runs
        </div>
        <div className="font-medium">
          Total: {formatCurrency(sortedData.reduce((sum, run) => sum + run.netPayment, 0))}
        </div>
      </div>
    </div>
  );
}
