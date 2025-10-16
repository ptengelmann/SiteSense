import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schema for invoice creation
const createInvoiceSchema = z.object({
  subcontractorId: z.string().uuid(),
  projectId: z.string().uuid().optional().nullable(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string().transform(str => new Date(str)),
  dueDate: z.string().transform(str => new Date(str)).optional().nullable(),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional().nullable(),
  cisDeduction: z.number().min(0).optional(),
  invoiceFileUrl: z.string().url().optional().nullable(),
});

// GET /api/invoices - List all invoices for the company
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const subcontractorId = searchParams.get('subcontractorId');
    const projectId = searchParams.get('projectId');

    // Build where clause
    const where: any = {
      companyId: session.user.companyId,
    };

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status !== 'all') {
      where.status = status;
    }

    if (subcontractorId) {
      where.subcontractorId = subcontractorId;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    const invoices = await db.invoice.findMany({
      where,
      select: {
        id: true,
        invoiceNumber: true,
        invoiceDate: true,
        dueDate: true,
        amount: true,
        cisDeduction: true,
        netPayment: true,
        description: true,
        status: true,
        paymentDate: true,
        paymentReference: true,
        validationStatus: true,
        createdAt: true,
        updatedAt: true,
        subcontractor: {
          select: {
            id: true,
            companyName: true,
            cisStatus: true,
            cisDeductionRate: true,
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
      orderBy: { invoiceDate: 'desc' },
    });

    return NextResponse.json({ invoices });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createInvoiceSchema.parse(body);

    // Verify subcontractor exists and belongs to company
    const subcontractor = await db.subcontractor.findFirst({
      where: {
        id: validatedData.subcontractorId,
        companyId: session.user.companyId,
      },
      select: {
        id: true,
        companyName: true,
        cisStatus: true,
        cisDeductionRate: true,
      },
    });

    if (!subcontractor) {
      return NextResponse.json(
        { error: 'Subcontractor not found' },
        { status: 404 }
      );
    }

    // If project specified, verify it exists
    if (validatedData.projectId) {
      const project = await db.project.findFirst({
        where: {
          id: validatedData.projectId,
          companyId: session.user.companyId,
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
    }

    // Calculate CIS deduction if not provided
    let cisDeduction = validatedData.cisDeduction ?? 0;

    if (subcontractor.cisStatus && subcontractor.cisDeductionRate !== null) {
      // CIS deduction = Invoice Amount × Deduction Rate
      // For materials, typically 40% of invoice is materials (not subject to CIS)
      // But for simplicity, we'll apply rate to full amount
      cisDeduction = validatedData.amount * (subcontractor.cisDeductionRate / 100);
    }

    const netPayment = validatedData.amount - cisDeduction;

    // Check for duplicate invoice number from same subcontractor
    const existingInvoice = await db.invoice.findUnique({
      where: {
        subcontractorId_invoiceNumber: {
          subcontractorId: validatedData.subcontractorId,
          invoiceNumber: validatedData.invoiceNumber,
        },
      },
    });

    if (existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice number already exists for this subcontractor' },
        { status: 400 }
      );
    }

    // Create invoice
    const invoice = await db.invoice.create({
      data: {
        companyId: session.user.companyId,
        subcontractorId: validatedData.subcontractorId,
        projectId: validatedData.projectId,
        invoiceNumber: validatedData.invoiceNumber,
        invoiceDate: validatedData.invoiceDate,
        dueDate: validatedData.dueDate,
        amount: validatedData.amount,
        cisDeduction,
        netPayment,
        description: validatedData.description,
        status: 'SUBMITTED',
        submittedBy: session.user.id,
        invoiceFileUrl: validatedData.invoiceFileUrl,
      },
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
        action: 'CREATE',
        newValues: invoice,
      },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
