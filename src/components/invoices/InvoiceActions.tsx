'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface InvoiceActionsProps {
  invoice: {
    id: string;
    status: string;
    amount: number;
    netPayment: number;
  };
}

export default function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    paymentReference: '',
  });

  const updateStatus = async (newStatus: string, additionalData?: any) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...additionalData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update invoice');
      }

      router.refresh();
      if (showPaymentModal) {
        setShowPaymentModal(false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (confirm('Approve this invoice for payment?')) {
      updateStatus('APPROVED');
    }
  };

  const handleReject = () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      updateStatus('REJECTED', { description: reason });
    }
  };

  const handleMarkPaid = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus('PAID', paymentData);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete invoice');
      }

      router.push('/dashboard/invoices');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg p-6 bg-white border border-neutral-200">
      <h2 className="text-lg text-neutral-900 mb-4 tracking-tight">Actions</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {/* Approve Button - Show for SUBMITTED or UNDER_REVIEW */}
        {(invoice.status === 'SUBMITTED' || invoice.status === 'UNDER_REVIEW') && (
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className="btn btn-success w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Approve Invoice
          </button>
        )}

        {/* Mark as Paid Button - Show for APPROVED */}
        {invoice.status === 'APPROVED' && (
          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mark as Paid
          </button>
        )}

        {/* Reject Button - Show for SUBMITTED or UNDER_REVIEW */}
        {(invoice.status === 'SUBMITTED' || invoice.status === 'UNDER_REVIEW') && (
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="btn btn-error w-full"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject Invoice
          </button>
        )}

        {/* Under Review Button - Show for SUBMITTED */}
        {invoice.status === 'SUBMITTED' && (
          <button
            onClick={() => updateStatus('UNDER_REVIEW')}
            disabled={isLoading}
            className="btn btn-secondary w-full"
          >
            Start Review
          </button>
        )}

        {/* Delete Button - Show for all except PAID */}
        {invoice.status !== 'PAID' && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="btn btn-secondary w-full text-red-600 hover:bg-red-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Invoice
          </button>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-neutral-900 tracking-tight">Mark as Paid</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleMarkPaid} className="space-y-4">
              <div>
                <label className="label">Payment Date</label>
                <input
                  type="date"
                  required
                  value={paymentData.paymentDate}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label">Payment Reference</label>
                <input
                  type="text"
                  value={paymentData.paymentReference}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentReference: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., BACS-20250116-001"
                />
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-neutral-700">
                  Payment amount: <span className="font-bold text-green-600">£{invoice.netPayment.toFixed(2)}</span>
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="btn btn-secondary btn-thin"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-thin"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
