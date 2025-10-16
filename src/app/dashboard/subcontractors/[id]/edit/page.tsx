import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EditSubcontractorForm from '@/components/subcontractors/EditSubcontractorForm';
import { db } from '@/lib/db';
import Link from 'next/link';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditSubcontractorPage({ params }: PageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Fetch subcontractor
  const subcontractor = await db.subcontractor.findFirst({
    where: {
      id: params.id,
      companyId: session.user.companyId,
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
          href={`/dashboard/subcontractors/${params.id}`}
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Profile
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Edit Subcontractor</h1>
          <p className="text-neutral-600 mt-1">
            Update {subcontractor.companyName}'s information
          </p>
        </div>

        {/* Form */}
        <EditSubcontractorForm subcontractor={subcontractor} />
      </div>
    </DashboardLayout>
  );
}
