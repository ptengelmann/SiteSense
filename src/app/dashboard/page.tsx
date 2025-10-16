import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Fetch all data in parallel
  const [
    subcontractorsData,
    projectsData,
    invoicesData,
    paymentRunsData,
    recentActivity,
    expiringItems
  ] = await Promise.all([
    // Subcontractors
    db.subcontractor.findMany({
      where: { companyId: session.user.companyId },
      select: {
        id: true,
        isActive: true,
        cisVerificationExpiresAt: true,
        publicLiabilityExpiresAt: true,
        bankAccountNumber: true,
        bankSortCode: true,
      },
    }),

    // Projects
    db.project.findMany({
      where: {
        companyId: session.user.companyId,
        isArchived: false,
      },
      select: {
        id: true,
        status: true,
        onSchedule: true,
      },
    }),

    // Invoices
    db.invoice.findMany({
      where: { companyId: session.user.companyId },
      select: {
        id: true,
        status: true,
        amount: true,
        netPayment: true,
        cisDeduction: true,
        dueDate: true,
        paymentDate: true,
      },
    }),

    // Payment Runs
    db.paymentRun.findMany({
      where: { companyId: session.user.companyId },
      select: {
        id: true,
        status: true,
        netPayment: true,
        scheduledDate: true,
      },
    }),

    // Recent Activity (last 10 items)
    Promise.all([
      db.invoice.findMany({
        where: { companyId: session.user.companyId },
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          amount: true,
          createdAt: true,
          subcontractor: {
            select: { companyName: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.paymentRun.findMany({
        where: { companyId: session.user.companyId },
        select: {
          id: true,
          name: true,
          status: true,
          netPayment: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]),

    // Expiring items (next 30 days)
    db.subcontractor.findMany({
      where: {
        companyId: session.user.companyId,
        OR: [
          {
            cisVerificationExpiresAt: {
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              gte: new Date(),
            }
          },
          {
            publicLiabilityExpiresAt: {
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              gte: new Date(),
            }
          }
        ]
      },
      select: {
        id: true,
        companyName: true,
        cisVerificationExpiresAt: true,
        publicLiabilityExpiresAt: true,
      },
      take: 5,
    }),
  ]);

  // Calculate metrics
  const activeSubcontractors = subcontractorsData.filter(s => s.isActive).length;
  const totalSubcontractors = subcontractorsData.length;

  const activeProjects = projectsData.filter(p => p.status === 'IN_PROGRESS').length;
  const projectsDelayed = projectsData.filter(p => !p.onSchedule).length;

  const pendingInvoices = invoicesData.filter(i =>
    i.status === 'DRAFT' || i.status === 'SUBMITTED' || i.status === 'APPROVED'
  );
  const pendingInvoicesAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingInvoicesCount = pendingInvoices.length;

  const paidInvoices = invoicesData.filter(i => i.status === 'PAID');
  const paidThisMonth = paidInvoices.filter(i => {
    const paymentDate = i.paymentDate ? new Date(i.paymentDate) : null;
    if (!paymentDate) return false;
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() &&
           paymentDate.getFullYear() === now.getFullYear();
  });
  const paidThisMonthAmount = paidThisMonth.reduce((sum, inv) => sum + inv.netPayment, 0);

  const overdueInvoices = invoicesData.filter(i => {
    if (i.status === 'PAID') return false;
    const dueDate = new Date(i.dueDate);
    return dueDate < new Date();
  });

  const pendingPaymentRuns = paymentRunsData.filter(pr =>
    pr.status === 'READY' || pr.status === 'EXPORTED'
  );
  const pendingPaymentAmount = pendingPaymentRuns.reduce((sum, pr) => sum + pr.netPayment, 0);

  const totalCisDeduction = invoicesData.reduce((sum, inv) => sum + inv.cisDeduction, 0);

  const subcontractorsMissingBank = subcontractorsData.filter(s =>
    !s.bankAccountNumber || !s.bankSortCode
  ).length;

  // Combine and sort recent activity
  const [recentInvoices, recentPaymentRuns] = recentActivity;
  const allActivity = [
    ...recentInvoices.map(inv => ({
      type: 'invoice' as const,
      id: inv.id,
      title: `Invoice ${inv.invoiceNumber}`,
      subtitle: inv.subcontractor.companyName,
      status: inv.status,
      amount: inv.amount,
      date: inv.createdAt,
    })),
    ...recentPaymentRuns.map(pr => ({
      type: 'payment_run' as const,
      id: pr.id,
      title: pr.name,
      subtitle: `${pr.status}`,
      status: pr.status,
      amount: pr.netPayment,
      date: pr.createdAt,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      DRAFT: 'badge-neutral',
      SUBMITTED: 'badge-info',
      APPROVED: 'badge-success',
      REJECTED: 'badge-error',
      PAID: 'badge-success',
      READY: 'badge-info',
      EXPORTED: 'badge-warning',
    };
    return badges[status] || 'badge-neutral';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Welcome back, {session.user.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-neutral-600 mt-1">
            Here's what's happening with your business today
          </p>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pending Invoices */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pending Invoices</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {formatCurrency(pendingInvoicesAmount)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-600">
              {pendingInvoicesCount} invoice{pendingInvoicesCount !== 1 ? 's' : ''} awaiting payment
            </div>
          </div>

          {/* Paid This Month */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Paid This Month</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(paidThisMonthAmount)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-600">
              {paidThisMonth.length} invoice{paidThisMonth.length !== 1 ? 's' : ''} paid
            </div>
          </div>

          {/* Pending Payments */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pending Payments</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {formatCurrency(pendingPaymentAmount)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-600">
              {pendingPaymentRuns.length} payment run{pendingPaymentRuns.length !== 1 ? 's' : ''} ready
            </div>
          </div>

          {/* Total CIS Deductions */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total CIS Deductions</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {formatCurrency(totalCisDeduction)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-600">
              Lifetime deductions
            </div>
          </div>
        </div>

        {/* Risk Indicators */}
        {(overdueInvoices.length > 0 || expiringItems.length > 0 || subcontractorsMissingBank > 0 || projectsDelayed > 0) && (
          <div className="card p-6 bg-red-50 border border-red-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Attention Required
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {overdueInvoices.length > 0 && (
                <Link href="/dashboard/invoices" className="p-4 bg-white rounded-lg border border-red-200 hover:border-red-300 transition-colors">
                  <p className="text-2xl font-bold text-red-600">{overdueInvoices.length}</p>
                  <p className="text-sm text-neutral-700 mt-1">Overdue Invoice{overdueInvoices.length !== 1 ? 's' : ''}</p>
                </Link>
              )}
              {expiringItems.length > 0 && (
                <Link href="/dashboard/subcontractors" className="p-4 bg-white rounded-lg border border-red-200 hover:border-red-300 transition-colors">
                  <p className="text-2xl font-bold text-red-600">{expiringItems.length}</p>
                  <p className="text-sm text-neutral-700 mt-1">Expiring Document{expiringItems.length !== 1 ? 's' : ''}</p>
                </Link>
              )}
              {subcontractorsMissingBank > 0 && (
                <Link href="/dashboard/subcontractors" className="p-4 bg-white rounded-lg border border-red-200 hover:border-red-300 transition-colors">
                  <p className="text-2xl font-bold text-red-600">{subcontractorsMissingBank}</p>
                  <p className="text-sm text-neutral-700 mt-1">Missing Bank Details</p>
                </Link>
              )}
              {projectsDelayed > 0 && (
                <Link href="/dashboard/projects" className="p-4 bg-white rounded-lg border border-red-200 hover:border-red-300 transition-colors">
                  <p className="text-2xl font-bold text-red-600">{projectsDelayed}</p>
                  <p className="text-sm text-neutral-700 mt-1">Delayed Project{projectsDelayed !== 1 ? 's' : ''}</p>
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Recent Activity
              </h2>
              {allActivity.length > 0 ? (
                <div className="space-y-3">
                  {allActivity.map((item) => (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={item.type === 'invoice' ? `/dashboard/invoices/${item.id}` : `/dashboard/payment-runs/${item.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${
                          item.type === 'invoice' ? 'bg-blue-50' : 'bg-green-50'
                        } flex items-center justify-center`}>
                          {item.type === 'invoice' ? (
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{item.title}</p>
                          <p className="text-sm text-neutral-600">{item.subtitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${getStatusBadge(item.status)} badge-sm`}>
                          {item.status}
                        </span>
                        <p className="text-sm text-neutral-600 mt-1">{formatDate(item.date)}</p>
                      </div>
                    </Link>
                  ))}
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
                  <p className="text-lg">No recent activity</p>
                  <p className="text-sm mt-1">
                    Start by adding subcontractors or creating a project
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <Link href="/dashboard/invoices/new" className="btn btn-primary btn-sm w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Invoice
                </Link>
                <Link href="/dashboard/payment-runs/new" className="btn btn-primary btn-sm w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Payment Run
                </Link>
                <Link href="/dashboard/subcontractors/new" className="btn btn-secondary btn-sm w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Subcontractor
                </Link>
                <Link href="/dashboard/projects/new" className="btn btn-secondary btn-sm w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Project
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Quick Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Active Subcontractors</span>
                  <span className="font-semibold text-neutral-900">{activeSubcontractors} / {totalSubcontractors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Active Projects</span>
                  <span className="font-semibold text-neutral-900">{activeProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Total Invoices</span>
                  <span className="font-semibold text-neutral-900">{invoicesData.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Payment Runs</span>
                  <span className="font-semibold text-neutral-900">{paymentRunsData.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
