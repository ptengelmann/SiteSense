'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  amount: number;
  cisDeduction: number;
  netPayment: number;
  subcontractor: {
    companyName: string;
  };
  project: {
    name: string;
  } | null;
}

export default function NewPaymentRunPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [approvedInvoices, setApprovedInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    name: `Payment Run ${new Date().toISOString().split('T')[0]}`,
    scheduledDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchApprovedInvoices();
  }, []);

  const fetchApprovedInvoices = async () => {
    try {
      const response = await fetch('/api/invoices?status=APPROVED');
      const data = await response.json();
      setApprovedInvoices(data.invoices || []);
    } catch (err) {
      console.error('Error fetching approved invoices:', err);
    }
  };

  const toggleInvoice = (invoiceId: string) => {
    const newSelected = new Set(selectedInvoiceIds);
    if (newSelected.has(invoiceId)) {
      newSelected.delete(invoiceId);
    } else {
      newSelected.add(invoiceId);
    }
    setSelectedInvoiceIds(newSelected);
  };

  const selectAll = () => {
    if (selectedInvoiceIds.size === approvedInvoices.length) {
      setSelectedInvoiceIds(new Set());
    } else {
      setSelectedInvoiceIds(new Set(approvedInvoices.map(inv => inv.id)));
    }
  };

  const selectedInvoices = approvedInvoices.filter(inv => selectedInvoiceIds.has(inv.id));
  const totalAmount = selectedInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCisDeduction = selectedInvoices.reduce((sum, inv) => sum + inv.cisDeduction, 0);
  const totalNetPayment = selectedInvoices.reduce((sum, inv) => sum + inv.netPayment, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (selectedInvoiceIds.size === 0) {
      setError('Please select at least one invoice');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/payment-runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          invoiceIds: Array.from(selectedInvoiceIds),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment run');
      }

      router.push('/dashboard/payment-runs');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/dashboard/payment-runs" className="text-neutral-400 hover:text-neutral-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl text-neutral-900 tracking-tight">New Payment Run</h1>
          </div>
          <p className="text-neutral-600">Select approved invoices to process for payment</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
            )}

            <div className="rounded-lg p-6 bg-white border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment Run Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Payment Run Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Scheduled Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Select Invoices ({approvedInvoices.length} approved)
                </h2>
                <button type="button" onClick={selectAll} className="btn btn-secondary btn-sm">
                  {selectedInvoiceIds.size === approvedInvoices.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {approvedInvoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="w-12"></th>
                        <th>Invoice</th>
                        <th>Subcontractor</th>
                        <th className="text-right">Amount</th>
                        <th className="text-right">CIS</th>
                        <th className="text-right">Net Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-neutral-50">
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedInvoiceIds.has(invoice.id)}
                              onChange={() => toggleInvoice(invoice.id)}
                              className="w-4 h-4 rounded border-neutral-300"
                            />
                          </td>
                          <td>
                            <div className="font-medium">{invoice.invoiceNumber}</div>
                            <div className="text-xs text-neutral-500">{formatDate(invoice.invoiceDate)}</div>
                          </td>
                          <td>
                            <div>{invoice.subcontractor.companyName}</div>
                            {invoice.project && (
                              <div className="text-xs text-neutral-500">{invoice.project.name}</div>
                            )}
                          </td>
                          <td className="text-right">{formatCurrency(invoice.amount)}</td>
                          <td className="text-right text-red-600">-{formatCurrency(invoice.cisDeduction)}</td>
                          <td className="text-right font-medium text-green-600">{formatCurrency(invoice.netPayment)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <p>No approved invoices available for payment</p>
                  <Link href="/dashboard/invoices" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
                    View all invoices →
                  </Link>
                </div>
              )}
            </div>

            {selectedInvoiceIds.size > 0 && (
              <div className="rounded-lg p-6 bg-primary-50 border border-primary-200">
                <h3 className="font-semibold text-neutral-900 mb-3">Payment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Selected Invoices:</span>
                    <span className="font-medium">{selectedInvoiceIds.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total CIS Deduction:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(totalCisDeduction)}</span>
                  </div>
                  <div className="pt-2 border-t border-primary-300 flex justify-between">
                    <span className="font-semibold">Net Payment:</span>
                    <span className="font-bold text-green-600 text-lg">{formatCurrency(totalNetPayment)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Link href="/dashboard/payment-runs" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={isLoading || selectedInvoiceIds.size === 0}>
                {isLoading ? 'Creating...' : 'Create Payment Run'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
