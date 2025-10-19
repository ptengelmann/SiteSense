import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SubcontractorTable from '@/components/subcontractors/SubcontractorTable';
import ExportButton from '@/components/subcontractors/ExportButton';
import { db } from '@/lib/db';

export default async function SubcontractorsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Fetch subcontractors from database
  const subcontractors = await db.subcontractor.findMany({
    where: {
      companyId: session.user.companyId,
    },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      phone: true,
      utr: true,
      cisStatus: true,
      cisVerificationExpiresAt: true,
      publicLiabilityExpiresAt: true,
      performanceScore: true,
      riskScore: true,
      totalPaid: true,
      totalInvoices: true,
      isActive: true,
      tags: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate stats
  const totalActive = subcontractors.filter(s => s.isActive).length;
  const cisVerified = subcontractors.filter(s =>
    s.cisStatus && s.cisStatus !== 'NOT_VERIFIED'
  ).length;

  // Expiring soon (within 30 days)
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  const expiringSoon = subcontractors.filter(s => {
    if (!s.publicLiabilityExpiresAt && !s.cisVerificationExpiresAt) return false;

    const plExpiry = s.publicLiabilityExpiresAt ? new Date(s.publicLiabilityExpiresAt) : null;
    const cisExpiry = s.cisVerificationExpiresAt ? new Date(s.cisVerificationExpiresAt) : null;

    const plExpiring = plExpiry && plExpiry > now && plExpiry <= thirtyDaysFromNow;
    const cisExpiring = cisExpiry && cisExpiry > now && cisExpiry <= thirtyDaysFromNow;

    return plExpiring || cisExpiring;
  }).length;

  const highPerformers = subcontractors.filter(s => s.performanceScore >= 80).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-neutral-900 tracking-tight">Subcontractors</h1>
            <p className="text-neutral-600 mt-1 font-light">
              Manage your subcontractor network with CIS compliance and performance tracking
            </p>
          </div>
          <div className="flex gap-3">
            <ExportButton subcontractors={subcontractors} />
            <Link
              href="/dashboard/subcontractors/new"
              className="btn btn-primary btn-thin"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Subcontractor
            </Link>
          </div>
        </div>

        {subcontractors.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <p className="text-sm text-neutral-600 font-light">Total Active</p>
                <p className="text-2xl text-neutral-900 mt-2 tracking-tight">{totalActive}</p>
              </div>

              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <p className="text-sm text-neutral-600 font-light">CIS Verified</p>
                <p className="text-2xl text-primary-500 mt-2 tracking-tight">{cisVerified}</p>
              </div>

              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <p className="text-sm text-neutral-600 font-light">Expiring Soon</p>
                <p className="text-2xl text-amber-600 mt-2 tracking-tight">{expiringSoon}</p>
              </div>

              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <p className="text-sm text-neutral-600 font-light">High Performers</p>
                <p className="text-2xl text-neutral-900 mt-2 tracking-tight">{highPerformers}</p>
              </div>
            </div>

            {/* Data Table */}
            <SubcontractorTable initialData={subcontractors} />
          </>
        ) : (
          /* Empty State */}
          <div className="rounded-lg p-12 bg-white border border-neutral-200">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg text-neutral-900 mb-2 tracking-tight">
                No subcontractors yet
              </h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto font-light">
                Get started by adding your first subcontractor. Track CIS compliance, insurance expiry, and performance metrics all in one place.
              </p>
              <Link
                href="/dashboard/subcontractors/new"
                className="btn btn-primary btn-thin inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Subcontractor
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
