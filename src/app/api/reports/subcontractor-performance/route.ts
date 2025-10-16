import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const subs = await db.subcontractor.findMany({
      where: { companyId: session.user.companyId },
      select: {
        id: true,
        companyName: true,
        cisStatus: true,
        totalPaid: true,
        totalInvoices: true,
      },
    });

    const data = subs.map(s => ({
      id: s.id,
      name: s.companyName,
      totalPaid: s.totalPaid,
      invoiceCount: s.totalInvoices,
      avgInvoiceValue: s.totalInvoices > 0 ? s.totalPaid / s.totalInvoices : 0,
      cisStatus: s.cisStatus,
    })).sort((a, b) => b.totalPaid - a.totalPaid);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
