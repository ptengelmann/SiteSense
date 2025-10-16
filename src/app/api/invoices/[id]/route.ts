import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1).optional(),
  invoiceDate: z.string().transform(str => new Date(str)).optional(),
  dueDate: z.string().transform(str => new Date(str)).optional().nullable(),
  amount: z.number().positive().optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PAID', 'REJECTED']).optional(),
  paymentDate: z.string().transform(str => new Date(str)).optional().nullable(),
  paymentReference: z.string().optional().nullable(),
  invoiceFileUrl: z.string().url().optional().nullable(),
});

// GET /api/invoices/[id] - Get invoice by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await db.invoice.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
      include: {
        subcontractor: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            email: true,
            phone: true,
            cisStatus: true,
            cisDeductionRate: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            postcode: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            projectNumber: true,
            clientName: true,
            addressLine1: true,
            city: true,
            postcode: true,
          },
        },
        documents: true,
        submitter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

// PUT /api/invoices/[id] - Update invoice
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
    const validatedData = updateInvoiceSchema.parse(body);

    // Verify invoice exists and belongs to company
    const existingInvoice = await db.invoice.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
      include: {
        subcontractor: {
          select: {
            cisDeductionRate: true,
          },
        },
      },
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Recalculate CIS deduction if amount changed
    let cisDeduction = existingInvoice.cisDeduction;
    let netPayment = existingInvoice.netPayment;

    if (validatedData.amount !== undefined) {
      const deductionRate = existingInvoice.subcontractor.cisDeductionRate || 0;
      cisDeduction = validatedData.amount * (deductionRate / 100);
      netPayment = validatedData.amount - cisDeduction;
    }

    // Update status workflow
    const updates: any = {
      ...validatedData,
    };

    if (validatedData.amount !== undefined) {
      updates.cisDeduction = cisDeduction;
      updates.netPayment = netPayment;
    }

    // Track reviewer if status changed to APPROVED/REJECTED
    if (
      validatedData.status &&
      ['APPROVED', 'REJECTED'].includes(validatedData.status) &&
      existingInvoice.status !== validatedData.status
    ) {
      updates.reviewedBy = session.user.id;
      updates.reviewedAt = new Date();
    }

    const invoice = await db.invoice.update({
      where: { id: params.id },
      data: updates,
      include: {
        subcontractor: {
          select: {
            id: true,
            companyName: true,
            cisStatus: true,
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
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        companyId: session.user.companyId,
        userId: session.user.id,
        entityType: 'Invoice',
        entityId: invoice.id,
        action: 'UPDATE',
        oldValues: existingInvoice,
        newValues: invoice,
      },
    });

    return NextResponse.json({ invoice });
  } catch (error: any) {
    console.error('Error updating invoice:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify invoice exists and belongs to company
    const invoice = await db.invoice.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Don't allow deletion of paid invoices
    if (invoice.status === 'PAID') {
      return NextResponse.json(
        { error: 'Cannot delete paid invoices' },
        { status: 400 }
      );
    }

    await db.invoice.delete({
      where: { id: params.id },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        companyId: session.user.companyId,
        userId: session.user.id,
        entityType: 'Invoice',
        entityId: invoice.id,
        action: 'DELETE',
        oldValues: invoice,
      },
    });

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
