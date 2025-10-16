import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createAuditLog, getClientInfo } from '@/lib/audit';
import { z } from 'zod';

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  projectNumber: z.string().optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'SNAGGING', 'COMPLETED', 'CANCELLED']).optional(),
  clientName: z.string().optional(),
  clientCompany: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
  siteContactName: z.string().optional(),
  siteContactPhone: z.string().optional(),
  projectType: z.enum([
    'NEW_BUILD', 'REFURBISHMENT', 'EXTENSION', 'CONVERSION',
    'RENOVATION', 'FIT_OUT', 'INFRASTRUCTURE', 'DEMOLITION',
    'MAINTENANCE', 'OTHER'
  ]).optional(),
  contractType: z.enum([
    'FIXED_PRICE', 'TIME_MATERIALS', 'COST_PLUS',
    'MEASURE_TERM', 'FRAMEWORK', 'NEC', 'JCT', 'OTHER'
  ]).optional(),
  contractValue: z.number().optional(),
  retentionPercentage: z.number().min(0).max(20).optional(),
  budget: z.number().optional(),
  actualCost: z.number().optional(),
  approvedVariations: z.number().optional(),
  pendingVariations: z.number().optional(),
  startDate: z.string().optional(),
  estimatedCompletionDate: z.string().optional(),
  actualCompletionDate: z.string().optional(),
  handoverDate: z.string().optional(),
  principalContractor: z.string().optional(),
  principalDesigner: z.string().optional(),
  hsePlanRequired: z.boolean().optional(),
  hsePlanApproved: z.boolean().optional(),
  hsePlanApprovedDate: z.string().optional(),
  f10NotificationNumber: z.string().optional(),
  rampsRequired: z.boolean().optional(),
  planningPermissionRef: z.string().optional(),
  planningPermissionDate: z.string().optional(),
  buildingControlRef: z.string().optional(),
  buildingControlBody: z.string().optional(),
  contractWorksInsurance: z.number().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceExpiryDate: z.string().optional(),
  onSchedule: z.boolean().optional(),
  daysDelay: z.number().optional(),
  qualityScore: z.number().min(1).max(5).optional(),
  clientSatisfaction: z.number().min(1).max(5).optional(),
  isArchived: z.boolean().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/projects/[id] - Get single project with all details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await db.project.findUnique({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
      include: {
        projectSubcontractors: {
          include: {
            subcontractor: {
              select: {
                id: true,
                companyName: true,
                contactName: true,
                email: true,
                phone: true,
                tradeSpecialties: true,
                cisStatus: true,
                publicLiabilityExpiresAt: true,
                isActive: true,
              },
            },
          },
          orderBy: { assignedAt: 'desc' },
        },
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            amount: true,
            cisDeduction: true,
            netPayment: true,
            status: true,
            invoiceDate: true,
            subcontractor: {
              select: {
                companyName: true,
              },
            },
          },
          orderBy: { invoiceDate: 'desc' },
          take: 10,
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check project exists and belongs to company
    const existingProject = await db.project.findUnique({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updateProjectSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage = validation.error.issues?.[0]?.message || 'Validation failed';
      return NextResponse.json(
        { error: errorMessage, errors: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Prepare update data with date conversions
    const updateData: any = { ...data };

    // Convert date strings to Date objects
    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if (data.estimatedCompletionDate !== undefined) {
      updateData.estimatedCompletionDate = data.estimatedCompletionDate ? new Date(data.estimatedCompletionDate) : null;
    }
    if (data.actualCompletionDate !== undefined) {
      updateData.actualCompletionDate = data.actualCompletionDate ? new Date(data.actualCompletionDate) : null;
    }
    if (data.handoverDate !== undefined) {
      updateData.handoverDate = data.handoverDate ? new Date(data.handoverDate) : null;
    }
    if (data.hsePlanApprovedDate !== undefined) {
      updateData.hsePlanApprovedDate = data.hsePlanApprovedDate ? new Date(data.hsePlanApprovedDate) : null;
    }
    if (data.planningPermissionDate !== undefined) {
      updateData.planningPermissionDate = data.planningPermissionDate ? new Date(data.planningPermissionDate) : null;
    }
    if (data.insuranceExpiryDate !== undefined) {
      updateData.insuranceExpiryDate = data.insuranceExpiryDate ? new Date(data.insuranceExpiryDate) : null;
    }

    // Handle archive
    if (data.isArchived === true && !existingProject.isArchived) {
      updateData.archivedAt = new Date();
    } else if (data.isArchived === false && existingProject.isArchived) {
      updateData.archivedAt = null;
    }

    // Update project
    const project = await db.project.update({
      where: { id: params.id },
      data: updateData,
    });

    // Audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog({
      companyId: session.user.companyId,
      userId: session.user.id,
      entityType: 'PROJECT',
      entityId: project.id,
      action: 'UPDATE',
      oldValues: existingProject,
      newValues: project,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error('Error updating project:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A project with this project number already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check project exists and belongs to company
    const project = await db.project.findUnique({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete project (cascades to project_subcontractors)
    await db.project.delete({
      where: { id: params.id },
    });

    // Audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog({
      companyId: session.user.companyId,
      userId: session.user.id,
      entityType: 'PROJECT',
      entityId: params.id,
      action: 'DELETE',
      oldValues: project,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
