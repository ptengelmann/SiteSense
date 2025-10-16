import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const invoices = await db.invoice.findMany({
      where: { companyId: session.user.companyId },
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        amount: true,
        dueDate: true,
        subcontractor: { select: { companyName: true } },
      },
    });

    const byStatus: Record<string, number> = {};
    const amountByStatus: Record<string, number> = {};

    invoices.forEach(inv => {
      byStatus[inv.status] = (byStatus[inv.status] || 0) + 1;
      amountByStatus[inv.status] = (amountByStatus[inv.status] || 0) + inv.amount;
    });

    const now = new Date();
    const overdue = invoices
      .filter(inv => inv.status !== 'PAID' && inv.dueDate && new Date(inv.dueDate) < now)
      .map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        subcontractorName: inv.subcontractor.companyName,
        dueDate: inv.dueDate,
        amount: inv.amount,
        daysOverdue: Math.floor((now.getTime() - new Date(inv.dueDate!).getTime()) / (1000 * 60 * 60 * 24)),
      }));

    return NextResponse.json({
      success: true,
      data: {
        byStatus,
        amountByStatus,
        overdue: {
          count: overdue.length,
          amount: overdue.reduce((sum, inv) => sum + inv.amount, 0),
          invoices: overdue,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
