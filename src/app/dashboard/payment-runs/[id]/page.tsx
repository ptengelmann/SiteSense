import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PaymentRunActions from '@/components/payment-runs/PaymentRunActions';
import { db } from '@/lib/db';

export default async function PaymentRunDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const paymentRun = await db.paymentRun.findFirst({
    where: {
      id: params.id,
      companyId: session.user.companyId,
    },
    include: {
      creator: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      invoices: {
        include: {
          invoice: {
            include: {
              subcontractor: {
                select: {
                  id: true,
                  companyName: true,
                  bankSortCode: true,
                  bankAccountNumber: true,
                },
              },
              project: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!paymentRun) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      DRAFT: { class: 'badge-neutral', label: 'Draft' },
      READY: { class: 'badge-info', label: 'Ready' },
      EXPORTED: { class: 'badge-warning', label: 'Exported' },
      PAID: { class: 'badge-success', label: 'Paid' },
    };
    return badges[status as keyof typeof badges] || { class: 'badge-neutral', label: status };
  };

  const statusBadge = getStatusBadge(paymentRun.status);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/payment-runs" className="text-neutral-400 hover:text-neutral-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl text-neutral-900 tracking-tight">{paymentRun.name}</h1>
              <p className="text-neutral-600 mt-1">Scheduled for {formatDate(paymentRun.scheduledDate)}</p>
            </div>
          </div>
          <span className={`badge ${statusBadge.class} badge-lg`}>{statusBadge.label}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg p-6 bg-white border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Invoice Amount:</span>
                  <span className="font-medium">{formatCurrency(paymentRun.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total CIS Deduction:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(paymentRun.totalCisDeduction)}</span>
                </div>
                <div className="pt-3 border-t border-neutral-200 flex justify-between">
                  <span className="font-semibold text-neutral-900">Net Payment:</span>
                  <span className="font-bold text-green-600 text-xl">{formatCurrency(paymentRun.netPayment)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-6 bg-white border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Invoices ({paymentRun.invoiceCount})
              </h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Subcontractor</th>
                      <th>Project</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">Net Payment</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentRun.invoices.map((pi) => {
                      const invoice = pi.invoice;
                      return (
                        <tr key={invoice.id} className="hover:bg-neutral-50">
                          <td>
                            <Link
                              href={`/dashboard/invoices/${invoice.id}`}
                              className="font-medium text-primary-600 hover:text-primary-700"
                            >
                              {invoice.invoiceNumber}
                            </Link>
                          </td>
                          <td>
                            <div>{invoice.subcontractor.companyName}</div>
                            {(invoice.subcontractor.bankSortCode && invoice.subcontractor.bankAccountNumber) ? (
                              <div className="text-xs text-green-600">Bank details verified</div>
                            ) : (
                              <div className="text-xs text-red-600">Missing bank details</div>
                            )}
                          </td>
                          <td>
                            {invoice.project ? (
                              <Link
                                href={`/dashboard/projects/${invoice.project.id}`}
                                className="text-sm text-primary-600 hover:text-primary-700"
                              >
                                {invoice.project.name}
                              </Link>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="text-right">{formatCurrency(invoice.amount)}</td>
                          <td className="text-right font-medium text-green-600">
                            {formatCurrency(invoice.netPayment)}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg p-6 bg-white border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Audit Trail</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Created</span>
                  <span>
                    {formatDate(paymentRun.createdAt)}
                    {paymentRun.creator && (
                      <span className="text-neutral-600 ml-2">
                        by {paymentRun.creator.firstName} {paymentRun.creator.lastName}
                      </span>
                    )}
                  </span>
                </div>
                {paymentRun.exportedAt && (
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Exported</span>
                    <span>{formatDate(paymentRun.exportedAt)}</span>
                  </div>
                )}
                {paymentRun.paidAt && (
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-600">Paid</span>
                    <span>{formatDate(paymentRun.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <PaymentRunActions paymentRun={paymentRun} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
