import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const data = await db.invoice.findMany({
      where: {
        companyId: session.user.companyId,
        status: 'PAID',
        paymentDate: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate + 'T23:59:59') : undefined,
        },
      },
      select: {
        id: true,
        invoiceNumber: true,
        paymentDate: true,
        amount: true,
        cisDeduction: true,
        netPayment: true,
        status: true,
        subcontractor: { select: { companyName: true } },
        project: { select: { name: true } },
      },
      orderBy: { paymentDate: 'desc' },
    });

    const formatted = data.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      subcontractorName: inv.subcontractor.companyName,
      projectName: inv.project?.name || null,
      paymentDate: inv.paymentDate,
      amount: inv.amount,
      cisDeduction: inv.cisDeduction,
      netPayment: inv.netPayment,
      status: inv.status,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
