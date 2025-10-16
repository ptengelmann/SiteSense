import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schema for payment run creation
const createPaymentRunSchema = z.object({
  name: z.string().min(1, 'Payment run name is required'),
  scheduledDate: z.string().transform(str => new Date(str)),
  invoiceIds: z.array(z.string().uuid()).min(1, 'At least one invoice is required'),
});

// GET /api/payment-runs - List all payment runs for the company
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    // Build where clause
    const where: any = {
      companyId: session.user.companyId,
    };

    if (status !== 'all') {
      where.status = status;
    }

    const paymentRuns = await db.paymentRun.findMany({
      where,
      select: {
        id: true,
        name: true,
        scheduledDate: true,
        status: true,
        totalAmount: true,
        totalCisDeduction: true,
        netPayment: true,
        invoiceCount: true,
        exportedAt: true,
        paidAt: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            invoices: true,
          },
        },
      },
      orderBy: { scheduledDate: 'desc' },
    });

    return NextResponse.json({ paymentRuns });
  } catch (error: any) {
    console.error('Error fetching payment runs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment runs' },
      { status: 500 }
    );
  }
}

// POST /api/payment-runs - Create new payment run
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPaymentRunSchema.parse(body);

    // Fetch selected invoices to calculate totals
    const invoices = await db.invoice.findMany({
      where: {
        id: { in: validatedData.invoiceIds },
        companyId: session.user.companyId,
        status: 'APPROVED', // Only approved invoices
      },
      select: {
        id: true,
        amount: true,
        cisDeduction: true,
        netPayment: true,
        subcontractor: {
          select: {
            companyName: true,
          },
        },
      },
    });

    if (invoices.length === 0) {
      return NextResponse.json(
        { error: 'No approved invoices found' },
        { status: 400 }
      );
    }

    if (invoices.length !== validatedData.invoiceIds.length) {
      return NextResponse.json(
        { error: 'Some invoices are not approved or do not exist' },
        { status: 400 }
      );
    }

    // Calculate totals
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCisDeduction = invoices.reduce((sum, inv) => sum + inv.cisDeduction, 0);
    const netPayment = invoices.reduce((sum, inv) => sum + inv.netPayment, 0);

    // Create payment run with invoices
    const paymentRun = await db.paymentRun.create({
      data: {
        companyId: session.user.companyId,
        name: validatedData.name,
        scheduledDate: validatedData.scheduledDate,
        status: 'DRAFT',
        totalAmount,
        totalCisDeduction,
        netPayment,
        invoiceCount: invoices.length,
        createdBy: session.user.id,
        invoices: {
          create: validatedData.invoiceIds.map(invoiceId => ({
            invoiceId,
          })),
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        invoices: {
          include: {
            invoice: {
              include: {
                subcontractor: {
                  select: {
                    id: true,
                    companyName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        companyId: session.user.companyId,
        userId: session.user.id,
        entityType: 'PaymentRun',
        entityId: paymentRun.id,
        action: 'CREATE',
        newValues: paymentRun,
      },
    });

    return NextResponse.json({ paymentRun }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating payment run:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create payment run' },
      { status: 500 }
    );
  }
}
