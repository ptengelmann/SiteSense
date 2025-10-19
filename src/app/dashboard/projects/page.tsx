import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectTable from '@/components/projects/ProjectTable';
import { db } from '@/lib/db';

export default async function ProjectsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Fetch projects from database
  const projects = await db.project.findMany({
    where: {
      companyId: session.user.companyId,
      isArchived: false,
    },
    select: {
      id: true,
      name: true,
      projectNumber: true,
      status: true,
      projectType: true,
      contractType: true,
      clientName: true,
      clientCompany: true,
      addressLine1: true,
      city: true,
      postcode: true,
      budget: true,
      actualCost: true,
      contractValue: true,
      startDate: true,
      estimatedCompletionDate: true,
      actualCompletionDate: true,
      onSchedule: true,
      daysDelay: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          projectSubcontractors: true,
          invoices: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;

  // Delayed projects (not on schedule and not completed/cancelled)
  const delayedProjects = projects.filter(
    p => !p.onSchedule && p.status !== 'COMPLETED' && p.status !== 'CANCELLED'
  ).length;

  // Total budget value
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-neutral-900 tracking-tight">Projects</h1>
            <p className="text-neutral-600 mt-1 font-light">
              Manage construction projects with compliance tracking and subcontractor assignments
            </p>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="btn btn-primary btn-thin"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>

        {projects.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 font-light">Total Projects</p>
                    <p className="text-2xl text-neutral-900 mt-1 tracking-tight">{totalProjects}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 font-light">Active</p>
                    <p className="text-2xl text-neutral-900 mt-1 tracking-tight">{activeProjects}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 font-light">Delayed</p>
                    <p className="text-2xl text-amber-600 mt-1 tracking-tight">{delayedProjects}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-6 bg-white border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 font-light">Total Budget</p>
                    <p className="text-2xl text-green-600 mt-1 tracking-tight">
                      £{(totalBudget / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <ProjectTable initialData={projects} />
          </>
        ) : (
          /* Empty State */
          <div className="rounded-lg p-12 bg-white border border-neutral-200">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg text-neutral-900 mb-2 tracking-tight">
                No projects yet
              </h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto font-light">
                Get started by creating your first construction project. Track subcontractors, manage compliance, and monitor project progress all in one place.
              </p>
              <Link
                href="/dashboard/projects/new"
                className="btn btn-primary btn-thin inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
