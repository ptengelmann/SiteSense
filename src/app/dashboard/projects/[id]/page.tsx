import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { db } from '@/lib/db';
import AssignSubcontractorModal from '@/components/projects/AssignSubcontractorModal';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Fetch project with related data
  const project = await db.project.findUnique({
    where: {
      id: params.id,
      companyId: session.user.companyId,
    },
    include: {
      projectSubcontractors: {
        include: {
          subcontractor: {
            select: {
              id: true,
              companyName: true,
              contactName: true,
              email: true,
              phone: true,
              tradeSpecialties: true,
              cisStatus: true,
              publicLiabilityExpiresAt: true,
              employersLiabilityExpiresAt: true,
              cscsCardExpiresAt: true,
              chasAccredited: true,
              chasExpiresAt: true,
              isActive: true,
            },
          },
        },
        orderBy: { assignedAt: 'desc' },
      },
      invoices: {
        select: {
          id: true,
          invoiceNumber: true,
          amount: true,
          cisDeduction: true,
          netPayment: true,
          status: true,
          invoiceDate: true,
          subcontractor: {
            select: {
              companyName: true,
            },
          },
        },
        orderBy: { invoiceDate: 'desc' },
        take: 10,
      },
    },
  });

  if (!project) {
    notFound();
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      PLANNING: 'bg-blue-100 text-blue-700 border-blue-200',
      ACTIVE: 'bg-green-100 text-green-700 border-green-200',
      ON_HOLD: 'bg-amber-100 text-amber-700 border-amber-200',
      SNAGGING: 'bg-purple-100 text-purple-700 border-purple-200',
      COMPLETED: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    };

    const labels: Record<string, string> = {
      PLANNING: 'Planning',
      ACTIVE: 'Active',
      ON_HOLD: 'On Hold',
      SNAGGING: 'Snagging',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded border ${badges[status] || 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getSubcontractorStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      ASSIGNED: 'bg-blue-100 text-blue-700',
      MOBILIZING: 'bg-amber-100 text-amber-700',
      ACTIVE: 'bg-green-100 text-green-700',
      DEMOBILIZED: 'bg-neutral-100 text-neutral-700',
      SUSPENDED: 'bg-red-100 text-red-700',
      REMOVED: 'bg-neutral-100 text-neutral-500',
    };

    const labels: Record<string, string> = {
      ASSIGNED: 'Assigned',
      MOBILIZING: 'Mobilizing',
      ACTIVE: 'Active',
      DEMOBILIZED: 'Demobilized',
      SUSPENDED: 'Suspended',
      REMOVED: 'Removed',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${badges[status] || 'bg-neutral-100 text-neutral-600'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const budgetProgress = project.budget ? (project.actualCost / project.budget) * 100 : null;
  const isOverBudget = budgetProgress && budgetProgress > 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/projects"
                className="text-neutral-400 hover:text-neutral-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-3xl text-neutral-900 tracking-tight">{project.name}</h1>
              {getStatusBadge(project.status)}
            </div>
            {project.projectNumber && (
              <p className="text-neutral-600 mt-1 font-light">Project #{project.projectNumber}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/projects/${project.id}/edit`}
              className="btn btn-secondary btn-thin"
            >
              Edit Project
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="rounded-lg p-6 bg-white border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Budget</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {formatCurrency(project.budget)}
                </p>
                {project.budget && (
                  <div className="text-xs text-neutral-500 mt-1">
                    Spent: {formatCurrency(project.actualCost)} ({budgetProgress?.toFixed(0)}%)
                  </div>
                )}
              </div>
              <div className={`w-12 h-12 rounded-lg ${isOverBudget ? 'bg-red-50' : 'bg-green-50'} flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-6 bg-white border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Subcontractors</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {project.projectSubcontractors.length}
                </p>
                <div className="text-xs text-neutral-500 mt-1">
                  {project.projectSubcontractors.filter(ps => ps.status === 'ACTIVE').length} active
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-6 bg-white border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Invoices</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {project.invoices.length}
                </p>
                <div className="text-xs text-neutral-500 mt-1">
                  {project.invoices.filter(inv => inv.status === 'PAID').length} paid
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-6 bg-white border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Schedule</p>
                <p className={`text-2xl font-bold mt-1 ${project.onSchedule ? 'text-green-600' : 'text-amber-600'}`}>
                  {project.onSchedule ? 'On Track' : `${project.daysDelay}d Late`}
                </p>
                {project.estimatedCompletionDate && (
                  <div className="text-xs text-neutral-500 mt-1">
                    Due: {formatDate(project.estimatedCompletionDate)}
                  </div>
                )}
              </div>
              <div className={`w-12 h-12 rounded-lg ${project.onSchedule ? 'bg-green-50' : 'bg-amber-50'} flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${project.onSchedule ? 'text-green-600' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details */}
            <div className="rounded-lg p-6 bg-white border border-neutral-200">
              <h2 className="text-lg text-neutral-900 mb-4 tracking-tight">Project Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {project.projectType && (
                  <div>
                    <p className="text-neutral-600">Type</p>
                    <p className="font-medium text-neutral-900">{project.projectType.replace('_', ' ')}</p>
                  </div>
                )}
                {project.contractType && (
                  <div>
                    <p className="text-neutral-600">Contract</p>
                    <p className="font-medium text-neutral-900">{project.contractType.replace('_', ' ')}</p>
                  </div>
                )}
                {project.startDate && (
                  <div>
                    <p className="text-neutral-600">Start Date</p>
                    <p className="font-medium text-neutral-900">{formatDate(project.startDate)}</p>
                  </div>
                )}
                {project.estimatedCompletionDate && (
                  <div>
                    <p className="text-neutral-600">Est. Completion</p>
                    <p className="font-medium text-neutral-900">{formatDate(project.estimatedCompletionDate)}</p>
                  </div>
                )}
              </div>

              {project.description && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-neutral-600 text-sm mb-2">Description</p>
                  <p className="text-neutral-900">{project.description}</p>
                </div>
              )}
            </div>

            {/* Client & Location */}
            <div className="rounded-lg p-6 bg-white border border-neutral-200">
              <h2 className="text-lg text-neutral-900 mb-4 tracking-tight">Client & Location</h2>
              <div className="space-y-4">
                {(project.clientName || project.clientCompany) && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Client</p>
                    {project.clientName && <p className="font-medium text-neutral-900">{project.clientName}</p>}
                    {project.clientCompany && <p className="text-neutral-700">{project.clientCompany}</p>}
                    <div className="flex gap-4 mt-2 text-sm text-neutral-600">
                      {project.clientEmail && <span>{project.clientEmail}</span>}
                      {project.clientPhone && <span>{project.clientPhone}</span>}
                    </div>
                  </div>
                )}

                {project.addressLine1 && (
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Site Address</p>
                    <p className="text-neutral-900">{project.addressLine1}</p>
                    {project.addressLine2 && <p className="text-neutral-900">{project.addressLine2}</p>}
                    <p className="text-neutral-900">
                      {project.city && `${project.city}, `}
                      {project.postcode}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Subcontractors */}
            <div className="rounded-lg p-6 bg-white border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-neutral-900 tracking-tight">Assigned Subcontractors</h2>
                <AssignSubcontractorModal projectId={project.id} />
              </div>

              {project.projectSubcontractors.length > 0 ? (
                <div className="space-y-4">
                  {project.projectSubcontractors.map((assignment) => (
                    <div key={assignment.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-neutral-900">
                              {assignment.subcontractor.companyName}
                            </h3>
                            {getSubcontractorStatusBadge(assignment.status)}
                          </div>
                          {assignment.role && (
                            <p className="text-sm text-neutral-600">Role: {assignment.role}</p>
                          )}
                          {assignment.tradePackage && (
                            <p className="text-sm text-neutral-600">Package: {assignment.tradePackage}</p>
                          )}
                          <div className="flex gap-4 mt-2 text-xs text-neutral-500">
                            {assignment.startDate && <span>Start: {formatDate(assignment.startDate)}</span>}
                            {assignment.endDate && <span>End: {formatDate(assignment.endDate)}</span>}
                          </div>
                          {assignment.contractValue && (
                            <div className="mt-2 text-sm font-medium text-neutral-900">
                              Value: {formatCurrency(assignment.contractValue)}
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/dashboard/subcontractors/${assignment.subcontractorId}`}
                          className="text-primary-600 hover:text-primary-700 text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <p>No subcontractors assigned yet.</p>
                  <p className="text-sm mt-1">Click "Assign Subcontractor" to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Health & Safety */}
            {(project.principalContractor || project.principalDesigner || project.f10NotificationNumber) && (
              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <h2 className="text-lg text-neutral-900 mb-4 tracking-tight">Health & Safety</h2>
                <div className="space-y-3 text-sm">
                  {project.principalContractor && (
                    <div>
                      <p className="text-neutral-600">Principal Contractor</p>
                      <p className="font-medium text-neutral-900">{project.principalContractor}</p>
                    </div>
                  )}
                  {project.principalDesigner && (
                    <div>
                      <p className="text-neutral-600">Principal Designer</p>
                      <p className="font-medium text-neutral-900">{project.principalDesigner}</p>
                    </div>
                  )}
                  {project.f10NotificationNumber && (
                    <div>
                      <p className="text-neutral-600">F10 Notification</p>
                      <p className="font-medium text-neutral-900">{project.f10NotificationNumber}</p>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    {project.hsePlanRequired && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">H&S Plan Required</span>
                    )}
                    {project.rampsRequired && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">RAMS Required</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Planning & Building Control */}
            {(project.planningPermissionRef || project.buildingControlRef) && (
              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <h2 className="text-lg text-neutral-900 mb-4 tracking-tight">Planning & Building Control</h2>
                <div className="space-y-3 text-sm">
                  {project.planningPermissionRef && (
                    <div>
                      <p className="text-neutral-600">Planning Permission</p>
                      <p className="font-medium text-neutral-900">{project.planningPermissionRef}</p>
                      {project.planningPermissionDate && (
                        <p className="text-xs text-neutral-500">{formatDate(project.planningPermissionDate)}</p>
                      )}
                    </div>
                  )}
                  {project.buildingControlRef && (
                    <div>
                      <p className="text-neutral-600">Building Control</p>
                      <p className="font-medium text-neutral-900">{project.buildingControlRef}</p>
                      {project.buildingControlBody && (
                        <p className="text-xs text-neutral-500">{project.buildingControlBody}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Invoices */}
            {project.invoices.length > 0 && (
              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <h2 className="text-lg text-neutral-900 mb-4 tracking-tight">Recent Invoices</h2>
                <div className="space-y-3">
                  {project.invoices.slice(0, 5).map((invoice) => (
                    <Link
                      key={invoice.id}
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="block p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900 text-sm">{invoice.invoiceNumber}</p>
                          <p className="text-xs text-neutral-600">{invoice.subcontractor.companyName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-neutral-900 text-sm">{formatCurrency(invoice.amount)}</p>
                          <p className="text-xs text-neutral-500">{formatDate(invoice.invoiceDate)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {project.invoices.length > 5 && (
                  <Link
                    href={`/dashboard/invoices?projectId=${project.id}`}
                    className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4"
                  >
                    View all invoices →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
