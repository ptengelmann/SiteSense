'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentRunActionsProps {
  paymentRun: {
    id: string;
    status: string;
    netPayment: number;
  };
}

export default function PaymentRunActions({ paymentRun }: PaymentRunActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const markAsReady = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/payment-runs/${paymentRun.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READY' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportBACS = () => {
    window.open(`/api/payment-runs/${paymentRun.id}/export?format=bacs`, '_blank');
    router.refresh();
  };

  const exportCSV = () => {
    window.open(`/api/payment-runs/${paymentRun.id}/export?format=csv`, '_blank');
  };

  const markAsPaid = async () => {
    if (!confirm('Mark this payment run as paid? All invoices will be updated.')) {
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/payment-runs/${paymentRun.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID', paidAt: new Date().toISOString() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRun = async () => {
    if (!confirm('Are you sure you want to delete this payment run? This cannot be undone.')) {
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/payment-runs/${paymentRun.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete');
      }

      router.push('/dashboard/payment-runs');
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
        {paymentRun.status === 'DRAFT' && (
          <button
            onClick={markAsReady}
            disabled={isLoading}
            className="btn btn-success btn-thin w-full"
          >
            Mark as Ready
          </button>
        )}

        {(paymentRun.status === 'READY' || paymentRun.status === 'EXPORTED') && (
          <>
            <button
              onClick={exportBACS}
              disabled={isLoading}
              className="btn btn-primary btn-thin w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Export BACS File
            </button>
            <button
              onClick={exportCSV}
              disabled={isLoading}
              className="btn btn-secondary btn-thin w-full"
            >
              Export CSV
            </button>
          </>
        )}

        {(paymentRun.status === 'READY' || paymentRun.status === 'EXPORTED') && (
          <button
            onClick={markAsPaid}
            disabled={isLoading}
            className="btn btn-success btn-thin w-full"
          >
            Mark as Paid
          </button>
        )}

        {paymentRun.status !== 'PAID' && (
          <button
            onClick={deleteRun}
            disabled={isLoading}
            className="btn btn-secondary btn-thin w-full text-red-600 hover:bg-red-50 mt-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Payment Run
          </button>
        )}
      </div>
    </div>
  );
}
