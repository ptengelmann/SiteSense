import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import InvoiceActions from '@/components/invoices/InvoiceActions';
import EntityDocuments from '@/components/documents/EntityDocuments';
import { db } from '@/lib/db';

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Fetch invoice with all relationships
  const invoice = await db.invoice.findFirst({
    where: {
      id: params.id,
      companyId: session.user.companyId,
    },
    include: {
      subcontractor: {
        select: {
          id: true,
          companyName: true,
          contactName: true,
          email: true,
          phone: true,
          cisStatus: true,
          cisDeductionRate: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          postcode: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          projectNumber: true,
          clientName: true,
          addressLine1: true,
          city: true,
          postcode: true,
        },
      },
      submitter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      SUBMITTED: { class: 'badge-warning', label: 'Submitted' },
      UNDER_REVIEW: { class: 'badge-info', label: 'Under Review' },
      APPROVED: { class: 'badge-success', label: 'Approved' },
      PAID: { class: 'badge-success', label: 'Paid' },
      REJECTED: { class: 'badge-error', label: 'Rejected' },
    };
    return badges[status as keyof typeof badges] || { class: 'badge-neutral', label: status };
  };

  const statusBadge = getStatusBadge(invoice.status);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/invoices"
              className="text-neutral-400 hover:text-neutral-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Invoice {invoice.invoiceNumber}</h1>
              <p className="text-neutral-600 mt-1">
                Submitted {formatDate(invoice.invoiceDate)}
              </p>
            </div>
          </div>
          <span className={`badge ${statusBadge.class} badge-lg`}>
            {statusBadge.label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Details Card */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Invoice Details</h2>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-600">Invoice Number</p>
                  <p className="font-medium text-neutral-900 mt-1">{invoice.invoiceNumber}</p>
                </div>

                <div>
                  <p className="text-neutral-600">Invoice Date</p>
                  <p className="font-medium text-neutral-900 mt-1">{formatDate(invoice.invoiceDate)}</p>
                </div>

                <div>
                  <p className="text-neutral-600">Due Date</p>
                  <p className="font-medium text-neutral-900 mt-1">
                    {invoice.dueDate ? formatDate(invoice.dueDate) : 'Not set'}
                  </p>
                </div>

                <div>
                  <p className="text-neutral-600">Payment Date</p>
                  <p className="font-medium text-neutral-900 mt-1">
                    {invoice.paymentDate ? formatDate(invoice.paymentDate) : 'Not paid'}
                  </p>
                </div>
              </div>

              {invoice.description && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-neutral-600 text-sm">Description</p>
                  <p className="text-neutral-900 mt-1">{invoice.description}</p>
                </div>
              )}
            </div>

            {/* Subcontractor Card */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Subcontractor</h2>

              <div>
                <h3 className="font-medium text-neutral-900 text-lg">
                  {invoice.subcontractor.companyName}
                </h3>
                {invoice.subcontractor.contactName && (
                  <p className="text-neutral-600 text-sm mt-1">
                    Contact: {invoice.subcontractor.contactName}
                  </p>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-600">Email</p>
                  <p className="font-medium text-neutral-900 mt-1">
                    {invoice.subcontractor.email || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-neutral-600">Phone</p>
                  <p className="font-medium text-neutral-900 mt-1">
                    {invoice.subcontractor.phone || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-neutral-600">CIS Status</p>
                  <p className="font-medium text-neutral-900 mt-1">
                    {invoice.subcontractor.cisStatus || 'Not Verified'}
                  </p>
                </div>

                {invoice.subcontractor.cisDeductionRate !== null && (
                  <div>
                    <p className="text-neutral-600">CIS Deduction Rate</p>
                    <p className="font-medium text-amber-600 mt-1">
                      {invoice.subcontractor.cisDeductionRate}%
                    </p>
                  </div>
                )}
              </div>

              {invoice.subcontractor.addressLine1 && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-neutral-600 text-sm">Address</p>
                  <p className="text-neutral-900 mt-1">
                    {invoice.subcontractor.addressLine1}
                    {invoice.subcontractor.addressLine2 && `, ${invoice.subcontractor.addressLine2}`}
                    <br />
                    {invoice.subcontractor.city} {invoice.subcontractor.postcode}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <Link
                  href={`/dashboard/subcontractors/${invoice.subcontractor.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Subcontractor →
                </Link>
              </div>
            </div>

            {/* Project Card */}
            {invoice.project && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Project</h2>

                <div>
                  <h3 className="font-medium text-neutral-900 text-lg">
                    {invoice.project.name}
                  </h3>
                  {invoice.project.projectNumber && (
                    <p className="text-neutral-600 text-sm mt-1">
                      #{invoice.project.projectNumber}
                    </p>
                  )}
                </div>

                {invoice.project.clientName && (
                  <div className="mt-4 text-sm">
                    <p className="text-neutral-600">Client</p>
                    <p className="font-medium text-neutral-900 mt-1">{invoice.project.clientName}</p>
                  </div>
                )}

                <div className="mt-4">
                  <Link
                    href={`/dashboard/projects/${invoice.project.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Project →
                  </Link>
                </div>
              </div>
            )}

            {/* Audit Trail */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Audit Trail</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">Submitted</span>
                  <span className="font-medium text-neutral-900">
                    {formatDate(invoice.createdAt)}
                    {invoice.submitter && (
                      <span className="text-neutral-600 ml-2">
                        by {invoice.submitter.firstName} {invoice.submitter.lastName}
                      </span>
                    )}
                  </span>
                </div>

                {invoice.reviewedAt && (
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-600">Reviewed</span>
                    <span className="font-medium text-neutral-900">
                      {formatDate(invoice.reviewedAt)}
                      {invoice.reviewer && (
                        <span className="text-neutral-600 ml-2">
                          by {invoice.reviewer.firstName} {invoice.reviewer.lastName}
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {invoice.paymentDate && (
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-600">Paid</span>
                    <span className="font-medium text-neutral-900">
                      {formatDate(invoice.paymentDate)}
                      {invoice.paymentReference && (
                        <span className="text-neutral-600 ml-2">
                          Ref: {invoice.paymentReference}
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="card p-6">
              <EntityDocuments
                entityType="Invoice"
                entityId={invoice.id}
                allowedCategories={['INVOICE', 'CONTRACT', 'PHOTO', 'OTHER']}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary Card */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Invoice Amount</span>
                  <span className="font-medium text-neutral-900">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>

                {invoice.cisDeduction > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">CIS Deduction</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(invoice.cisDeduction)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-900">Net Payment</span>
                    <span className="font-bold text-green-600 text-xl">
                      {formatCurrency(invoice.netPayment)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <InvoiceActions invoice={invoice} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
