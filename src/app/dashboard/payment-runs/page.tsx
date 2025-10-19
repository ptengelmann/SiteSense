import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PaymentRunTable from '@/components/payment-runs/PaymentRunTable';
import { db } from '@/lib/db';

export default async function PaymentRunsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Fetch payment runs from database
  const paymentRuns = await db.paymentRun.findMany({
    where: {
      companyId: session.user.companyId,
    },
    select: {
      id: true,
      name: true,
      scheduledDate: true,
      status: true,
      totalAmount: true,
      totalCisDeduction: true,
      netPayment: true,
      invoiceCount: true,
      exportedAt: true,
      paidAt: true,
      createdAt: true,
      creator: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { scheduledDate: 'desc' },
  });

  // Calculate stats
  const totalRuns = paymentRuns.length;
  const draftCount = paymentRuns.filter(pr => pr.status === 'DRAFT').length;
  const readyCount = paymentRuns.filter(pr => pr.status === 'READY').length;
  const paidCount = paymentRuns.filter(pr => pr.status === 'PAID').length;

  // Financial stats
  const totalPayments = paymentRuns.reduce((sum, pr) => sum + pr.netPayment, 0);
  const pendingPayments = paymentRuns
    .filter(pr => pr.status === 'READY' || pr.status === 'EXPORTED')
    .reduce((sum, pr) => sum + pr.netPayment, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-neutral-900 tracking-tight">Payment Runs</h1>
            <p className="text-neutral-600 mt-1 font-light">
              Batch process approved invoices and export to BACS
            </p>
          </div>
          <Link
            href="/dashboard/payment-runs/new"
            className="btn btn-primary btn-thin"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Payment Run
          </Link>
        </div>

        {paymentRuns.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total Payment Runs */}
              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 font-light">Total Payment Runs</p>
                    <p className="text-2xl text-neutral-900 mt-1 tracking-tight">{totalRuns}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 text-xs text-neutral-600">
                  <span className="text-amber-600 font-medium">{draftCount}</span> draft, {' '}
                  <span className="text-blue-600 font-medium">{readyCount}</span> ready
                </div>
              </div>

              {/* Paid Runs */}
              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 font-light">Paid Runs</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{paidCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Payments */}
              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 font-light">Total Payments</p>
                    <p className="text-2xl text-neutral-900 mt-1 tracking-tight">
                      £{(totalPayments / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pending Payments */}
              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 font-light">Pending Payments</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">
                      £{(pendingPayments / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 text-xs text-neutral-600">
                  Ready for processing
                </div>
              </div>
            </div>

            {/* Data Table */}
            <PaymentRunTable initialData={paymentRuns} />
          </>
        ) : (
          /* Empty State */
          <div className="rounded-lg p-12 bg-white border border-neutral-200">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg text-neutral-900 mb-2 tracking-tight">
                No payment runs yet
              </h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Get started by creating your first payment run. Batch multiple approved invoices together and export to BACS format for bank processing.
              </p>
              <Link
                href="/dashboard/payment-runs/new"
                className="btn btn-primary btn-thin inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Payment Run
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
