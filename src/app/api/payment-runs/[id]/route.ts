import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updatePaymentRunSchema = z.object({
  name: z.string().min(1).optional(),
  scheduledDate: z.string().transform(str => new Date(str)).optional(),
  status: z.enum(['DRAFT', 'READY', 'EXPORTED', 'PAID']).optional(),
  exportedAt: z.string().transform(str => new Date(str)).optional().nullable(),
  paidAt: z.string().transform(str => new Date(str)).optional().nullable(),
});

// GET /api/payment-runs/[id] - Get payment run by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const paymentRun = await db.paymentRun.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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
                    contactName: true,
                    email: true,
                    bankName: true,
                    bankAccountName: true,
                    bankAccountNumber: true,
                    bankSortCode: true,
                  },
                },
                project: {
                  select: {
                    id: true,
                    name: true,
                    projectNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!paymentRun) {
      return NextResponse.json({ error: 'Payment run not found' }, { status: 404 });
    }

    return NextResponse.json({ paymentRun });
  } catch (error: any) {
    console.error('Error fetching payment run:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment run' },
      { status: 500 }
    );
  }
}

// PUT /api/payment-runs/[id] - Update payment run
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updatePaymentRunSchema.parse(body);

    // Verify payment run exists and belongs to company
    const existingPaymentRun = await db.paymentRun.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
      include: {
        invoices: {
          include: {
            invoice: true,
          },
        },
      },
    });

    if (!existingPaymentRun) {
      return NextResponse.json({ error: 'Payment run not found' }, { status: 404 });
    }

    // Don't allow editing paid payment runs
    if (existingPaymentRun.status === 'PAID' && validatedData.status !== 'PAID') {
      return NextResponse.json(
        { error: 'Cannot edit paid payment runs' },
        { status: 400 }
      );
    }

    // If marking as PAID, update all invoices to PAID status
    if (validatedData.status === 'PAID' && existingPaymentRun.status !== 'PAID') {
      const invoiceIds = existingPaymentRun.invoices.map(pi => pi.invoiceId);

      await db.invoice.updateMany({
        where: {
          id: { in: invoiceIds },
        },
        data: {
          status: 'PAID',
          paymentDate: validatedData.paidAt || new Date(),
          paymentReference: `Payment Run ${existingPaymentRun.name}`,
        },
      });
    }

    const paymentRun = await db.paymentRun.update({
      where: { id: params.id },
      data: validatedData,
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
        action: 'UPDATE',
        oldValues: existingPaymentRun,
        newValues: paymentRun,
      },
    });

    return NextResponse.json({ paymentRun });
  } catch (error: any) {
    console.error('Error updating payment run:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update payment run' },
      { status: 500 }
    );
  }
}

// DELETE /api/payment-runs/[id] - Delete payment run
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify payment run exists and belongs to company
    const paymentRun = await db.paymentRun.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
    });

    if (!paymentRun) {
      return NextResponse.json({ error: 'Payment run not found' }, { status: 404 });
    }

    // Don't allow deletion of exported or paid payment runs
    if (paymentRun.status === 'EXPORTED' || paymentRun.status === 'PAID') {
      return NextResponse.json(
        { error: 'Cannot delete exported or paid payment runs' },
        { status: 400 }
      );
    }

    await db.paymentRun.delete({
      where: { id: params.id },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        companyId: session.user.companyId,
        userId: session.user.id,
        entityType: 'PaymentRun',
        entityId: paymentRun.id,
        action: 'DELETE',
        oldValues: paymentRun,
      },
    });

    return NextResponse.json({ message: 'Payment run deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting payment run:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment run' },
      { status: 500 }
    );
  }
}
