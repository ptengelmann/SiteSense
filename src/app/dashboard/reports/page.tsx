import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default async function ReportsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const reports = [
    {
      id: 'cis-monthly',
      name: 'CIS Monthly Return',
      description: 'Generate monthly CIS deduction report for HMRC submission',
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-50',
      href: '/dashboard/reports/cis-monthly',
    },
    {
      id: 'payment-history',
      name: 'Payment History',
      description: 'View all payments made to subcontractors within a date range',
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: 'bg-green-50',
      href: '/dashboard/reports/payment-history',
    },
    {
      id: 'subcontractor-performance',
      name: 'Subcontractor Performance',
      description: 'Analyze subcontractor performance metrics and payment history',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-blue-50',
      href: '/dashboard/reports/subcontractor-performance',
    },
    {
      id: 'invoice-status',
      name: 'Invoice Status Report',
      description: 'Current status breakdown of all invoices with aging analysis',
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-amber-50',
      href: '/dashboard/reports/invoice-status',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Reports</h1>
          <p className="text-neutral-600 mt-1">
            Generate business insights and compliance reports
          </p>
        </div>

        {/* Info Card */}
        <div className="card p-6 bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-neutral-900">Reporting Features</h3>
              <p className="text-sm text-neutral-700 mt-1">
                All reports can be exported to CSV format for further analysis or HMRC submission.
                Select a report type below to get started.
              </p>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={report.href}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-lg ${report.color} flex items-center justify-center flex-shrink-0`}>
                  {report.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {report.name}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    {report.description}
                  </p>
                  <div className="flex items-center text-primary-600 text-sm font-medium">
                    Generate Report
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Report Tips</h2>
          <div className="space-y-3 text-sm text-neutral-700">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                <span className="font-medium">CIS Monthly Return:</span> Required for all UK construction businesses.
                Submit to HMRC by the 19th of each month for the previous month.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                <span className="font-medium">Payment History:</span> Useful for reconciliation and tracking cash flow.
                Export to Excel for detailed analysis.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                <span className="font-medium">Subcontractor Performance:</span> Identify reliable subcontractors
                and track payment patterns to improve business relationships.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                <span className="font-medium">Invoice Status:</span> Monitor outstanding invoices and identify
                potential cash flow issues before they become problems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
