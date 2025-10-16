import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createAuditLog, getClientInfo } from '@/lib/audit';
import { z } from 'zod';

const updateSubcontractorSchema = z.object({
  companyName: z.string().min(1).optional(),
  companyNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  utr: z.string().min(10).optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  cisStatus: z.enum(['GROSS', 'STANDARD', 'HIGHER', 'NOT_VERIFIED']).optional(),
  cisDeductionRate: z.number().min(0).max(30).optional(),
  publicLiabilityExpiresAt: z.string().optional().nullable(),
  publicLiabilityAmount: z.number().optional().nullable(),
  employersLiabilityExpiresAt: z.string().optional().nullable(),
  professionalIndemnityExpiresAt: z.string().optional().nullable(),
  paymentTermsDays: z.number().optional(),
  retentionPercentage: z.number().min(0).max(10).optional(),
  earlyPaymentDiscount: z.number().optional().nullable(),
  bankName: z.string().optional().nullable(),
  bankAccountName: z.string().optional().nullable(),
  bankAccountNumber: z.string().optional().nullable(),
  bankSortCode: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  internalRating: z.number().min(1).max(5).optional().nullable(),
});

// GET /api/subcontractors/[id] - Get single subcontractor
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
            amount: true,
            status: true,
            invoiceDate: true,
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
      return NextResponse.json(
        { error: 'Subcontractor not found' },
        { status: 404 }
      );
    }

    // Update last data access for GDPR tracking
    await db.subcontractor.update({
      where: { id: params.id },
      data: { lastDataAccess: new Date() },
    });

    // Audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog({
      companyId: session.user.companyId,
      userId: session.user.id,
      entityType: 'SUBCONTRACTOR',
      entityId: params.id,
      action: 'VIEW',
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return NextResponse.json({ subcontractor });
  } catch (error) {
    console.error('Error fetching subcontractor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcontractor' },
      { status: 500 }
    );
  }
}

// PUT /api/subcontractors/[id] - Update subcontractor
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateSubcontractorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Get existing data for audit log
    const existing = await db.subcontractor.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Subcontractor not found' },
        { status: 404 }
      );
    }

    const data = validation.data;

    // Update subcontractor
    const subcontractor = await db.subcontractor.update({
      where: { id: params.id },
      data: {
        ...data,
        email: data.email || null,
        publicLiabilityExpiresAt: data.publicLiabilityExpiresAt ? new Date(data.publicLiabilityExpiresAt) : null,
        employersLiabilityExpiresAt: data.employersLiabilityExpiresAt ? new Date(data.employersLiabilityExpiresAt) : null,
        professionalIndemnityExpiresAt: data.professionalIndemnityExpiresAt ? new Date(data.professionalIndemnityExpiresAt) : null,
      },
    });

    // Audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog({
      companyId: session.user.companyId,
      userId: session.user.id,
      entityType: 'SUBCONTRACTOR',
      entityId: params.id,
      action: 'UPDATE',
      oldValues: existing,
      newValues: subcontractor,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return NextResponse.json({
      success: true,
      subcontractor,
    });
  } catch (error: any) {
    console.error('Error updating subcontractor:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A subcontractor with this UTR already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update subcontractor' },
      { status: 500 }
    );
  }
}

// DELETE /api/subcontractors/[id] - Delete subcontractor (GDPR compliant)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get existing data for audit log
    const existing = await db.subcontractor.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Subcontractor not found' },
        { status: 404 }
      );
    }

    // Check if there are invoices (can't delete if there are)
    const invoiceCount = await db.invoice.count({
      where: { subcontractorId: params.id },
    });

    if (invoiceCount > 0) {
      // Mark for deletion instead of deleting (HMRC requires 7-year retention)
      await db.subcontractor.update({
        where: { id: params.id },
        data: {
          isActive: false,
          scheduledForDeletion: true,
          deletionRequestedAt: new Date(),
          archivedAt: new Date(),
        },
      });

      // Audit log
      const clientInfo = getClientInfo(request);
      await createAuditLog({
        companyId: session.user.companyId,
        userId: session.user.id,
        entityType: 'SUBCONTRACTOR',
        entityId: params.id,
        action: 'DELETE',
        oldValues: existing,
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
      });

      return NextResponse.json({
        success: true,
        message: 'Subcontractor marked for deletion. Data will be retained for 7 years per HMRC requirements.',
        scheduledDeletion: true,
      });
    }

    // No invoices - can hard delete
    await db.subcontractor.delete({
      where: { id: params.id },
    });

    // Audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog({
      companyId: session.user.companyId,
      userId: session.user.id,
      entityType: 'SUBCONTRACTOR',
      entityId: params.id,
      action: 'DELETE',
      oldValues: existing,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return NextResponse.json({
      success: true,
      message: 'Subcontractor deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting subcontractor:', error);
    return NextResponse.json(
      { error: 'Failed to delete subcontractor' },
      { status: 500 }
    );
  }
}
