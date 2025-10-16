import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SubcontractorProfile from '@/components/subcontractors/SubcontractorProfile';
import { db } from '@/lib/db';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function SubcontractorDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Fetch subcontractor with all related data
  const subcontractor = await db.subcontractor.findFirst({
    where: {
      id: params.id,
      companyId: session.user.companyId,
    },
    include: {
      invoices: {
        select: {
          id: true,
          invoiceNumber: true,
          invoiceDate: true,
          amount: true,
          cisDeduction: true,
          netPayment: true,
          status: true,
          paymentDate: true,
        },
        orderBy: { invoiceDate: 'desc' },
        take: 10,
      },
      cisVerifications: {
        orderBy: { verificationDate: 'desc' },
        take: 5,
      },
    },
  });

  if (!subcontractor) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/dashboard/subcontractors"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Subcontractors
        </Link>

        {/* Profile Component */}
        <SubcontractorProfile subcontractor={subcontractor} />
      </div>
    </DashboardLayout>
  );
}
