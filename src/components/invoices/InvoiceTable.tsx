'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date | null;
  amount: number;
  cisDeduction: number;
  netPayment: number;
  description: string | null;
  status: string;
  paymentDate: Date | null;
  validationStatus: string | null;
  createdAt: Date;
  updatedAt: Date;
  subcontractor: {
    id: string;
    companyName: string;
    cisStatus: string | null;
  };
  project: {
    id: string;
    name: string;
    projectNumber: string | null;
  } | null;
}

interface InvoiceTableProps {
  initialData: Invoice[];
}

export default function InvoiceTable({ initialData }: InvoiceTableProps) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initialData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter invoices
  const filteredData = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.subcontractor.companyName.toLowerCase().includes(search.toLowerCase()) ||
      (invoice.description && invoice.description.toLowerCase().includes(search.toLowerCase())) ||
      (invoice.project && invoice.project.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort invoices
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'date') {
      comparison = new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime();
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      SUBMITTED: 'badge-warning',
      UNDER_REVIEW: 'badge-info',
      APPROVED: 'badge-success',
      PAID: 'badge-success',
      REJECTED: 'badge-error',
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
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by invoice number, subcontractor, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="PAID">Paid</option>
            <option value="REJECTED">Rejected</option>
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
                  Invoice Date
                  {sortBy === 'date' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th>Invoice #</th>
              <th>Subcontractor</th>
              <th>Project</th>
              <th
                className="text-right cursor-pointer hover:bg-neutral-50"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-2">
                  Amount
                  {sortBy === 'amount' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="text-right">CIS Deduction</th>
              <th className="text-right">Net Payment</th>
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
              <th>Due Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-neutral-50">
                  <td>{formatDate(invoice.invoiceDate)}</td>
                  <td>
                    <Link
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td>
                    <div>
                      <div className="font-medium text-neutral-900">
                        {invoice.subcontractor.companyName}
                      </div>
                      {invoice.subcontractor.cisStatus && (
                        <div className="text-xs text-neutral-500">
                          CIS: {invoice.subcontractor.cisStatus}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {invoice.project ? (
                      <div>
                        <div className="text-sm text-neutral-900">{invoice.project.name}</div>
                        {invoice.project.projectNumber && (
                          <div className="text-xs text-neutral-500">#{invoice.project.projectNumber}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-neutral-400">No project</span>
                    )}
                  </td>
                  <td className="text-right font-medium">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="text-right text-red-600">
                    -{formatCurrency(invoice.cisDeduction)}
                  </td>
                  <td className="text-right font-medium text-green-600">
                    {formatCurrency(invoice.netPayment)}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(invoice.status)}`}>
                      {invoice.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {invoice.dueDate ? (
                      <span className={
                        new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID'
                          ? 'text-red-600 font-medium'
                          : 'text-neutral-700'
                      }>
                        {formatDate(invoice.dueDate)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <Link
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-8 text-neutral-500">
                  No invoices found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between text-sm text-neutral-600">
        <div>
          Showing {sortedData.length} of {invoices.length} invoices
        </div>
        <div className="font-medium">
          Total: {formatCurrency(sortedData.reduce((sum, inv) => sum + inv.amount, 0))} |
          Net: {formatCurrency(sortedData.reduce((sum, inv) => sum + inv.netPayment, 0))}
        </div>
      </div>
    </div>
  );
}
