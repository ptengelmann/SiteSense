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
    const month = parseInt(searchParams.get('month') || '0');
    const year = parseInt(searchParams.get('year') || '0');

    if (!month || !year || month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'Invalid month or year' },
        { status: 400 }
      );
    }

    // Calculate date range for the selected month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Fetch all paid invoices for the selected month
    const invoices = await db.invoice.findMany({
      where: {
        companyId: session.user.companyId,
        status: 'PAID',
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        amount: true,
        cisDeduction: true,
        netPayment: true,
        subcontractorId: true,
        subcontractor: {
          select: {
            id: true,
            companyName: true,
            utr: true,
          },
        },
      },
    });

    // Group by subcontractor
    const groupedData = invoices.reduce((acc, invoice) => {
      const subId = invoice.subcontractorId;

      if (!acc[subId]) {
        acc[subId] = {
          subcontractorId: subId,
          subcontractorName: invoice.subcontractor.companyName,
          utr: invoice.subcontractor.utr,
          grossPayment: 0,
          cisDeduction: 0,
          netPayment: 0,
          invoiceCount: 0,
        };
      }

      acc[subId].grossPayment += invoice.amount;
      acc[subId].cisDeduction += invoice.cisDeduction;
      acc[subId].netPayment += invoice.netPayment;
      acc[subId].invoiceCount += 1;

      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by subcontractor name
    const reportData = Object.values(groupedData).sort((a: any, b: any) =>
      a.subcontractorName.localeCompare(b.subcontractorName)
    );

    return NextResponse.json({
      success: true,
      data: reportData,
      period: {
        month,
        year,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error('Error generating CIS monthly report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
