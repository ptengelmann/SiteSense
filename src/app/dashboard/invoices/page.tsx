import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import InvoiceTable from '@/components/invoices/InvoiceTable';
import { db } from '@/lib/db';

export default async function InvoicesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Fetch invoices from database
  const invoices = await db.invoice.findMany({
    where: {
      companyId: session.user.companyId,
    },
    select: {
      id: true,
      invoiceNumber: true,
      invoiceDate: true,
      dueDate: true,
      amount: true,
      cisDeduction: true,
      netPayment: true,
      description: true,
      status: true,
      paymentDate: true,
      validationStatus: true,
      createdAt: true,
      updatedAt: true,
      subcontractor: {
        select: {
          id: true,
          companyName: true,
          cisStatus: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          projectNumber: true,
        },
      },
    },
    orderBy: { invoiceDate: 'desc' },
  });

  // Calculate stats
  const totalInvoices = invoices.length;
  const submittedCount = invoices.filter(i => i.status === 'SUBMITTED').length;
  const underReviewCount = invoices.filter(i => i.status === 'UNDER_REVIEW').length;
  const approvedCount = invoices.filter(i => i.status === 'APPROVED').length;
  const paidCount = invoices.filter(i => i.status === 'PAID').length;

  // Financial stats
  const totalAmount = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalCisDeduction = invoices.reduce((sum, i) => sum + i.cisDeduction, 0);
  const totalNetPayment = invoices.reduce((sum, i) => sum + i.netPayment, 0);
  const amountDue = invoices
    .filter(i => i.status === 'APPROVED' && !i.paymentDate)
    .reduce((sum, i) => sum + i.netPayment, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Invoices</h1>
            <p className="text-neutral-600 mt-1">
              Manage subcontractor invoices with automated CIS deductions
            </p>
          </div>
          <Link
            href="/dashboard/invoices/new"
            className="btn btn-primary btn-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit Invoice
          </Link>
        </div>

        {invoices.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total Invoices */}
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Invoices</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">{totalInvoices}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 text-xs text-neutral-600">
                  <span className="text-amber-600 font-medium">{submittedCount}</span> submitted, {' '}
                  <span className="text-blue-600 font-medium">{underReviewCount}</span> in review
                </div>
              </div>

              {/* Approved & Paid */}
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Approved / Paid</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {approvedCount} / {paidCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Amount</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">
                      £{(totalAmount / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 text-xs text-neutral-600">
                  CIS: £{(totalCisDeduction / 1000).toFixed(1)}k • Net: £{(totalNetPayment / 1000).toFixed(1)}k
                </div>
              </div>

              {/* Amount Due */}
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Amount Due</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">
                      £{(amountDue / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 text-xs text-neutral-600">
                  Awaiting payment
                </div>
              </div>
            </div>

            {/* Data Table */}
            <InvoiceTable initialData={invoices} />
          </>
        ) : (
          /* Empty State */
          <div className="card p-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                No invoices yet
              </h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Get started by submitting your first invoice. CIS deductions will be calculated automatically based on subcontractor verification status.
              </p>
              <Link
                href="/dashboard/invoices/new"
                className="btn btn-primary btn-md inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Your First Invoice
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
