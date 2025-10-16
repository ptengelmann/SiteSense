import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createAuditLog, getClientInfo } from '@/lib/audit';
import { z } from 'zod';

const updateAssignmentSchema = z.object({
  role: z.string().optional(),
  scopeOfWork: z.string().optional(),
  tradePackage: z.string().optional(),
  contractValue: z.number().optional(),
  agreedRate: z.number().optional(),
  rateType: z.enum(['DAY_RATE', 'FIXED_PRICE', 'MEASURED']).optional(),
  paymentTerms: z.string().optional(),
  retentionHeld: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  actualStartDate: z.string().optional(),
  actualEndDate: z.string().optional(),
  status: z.enum(['ASSIGNED', 'MOBILIZING', 'ACTIVE', 'DEMOBILIZED', 'SUSPENDED', 'REMOVED']).optional(),
  performanceRating: z.number().min(1).max(5).optional(),
  onSchedule: z.boolean().optional(),
  qualityIssues: z.number().optional(),
  rampsSubmitted: z.boolean().optional(),
  rampsApproved: z.boolean().optional(),
  inductionCompleted: z.boolean().optional(),
  inductionDate: z.string().optional(),
  notes: z.string().optional(),
});

// PUT /api/projects/[id]/subcontractors/[assignmentId] - Update subcontractor assignment
export async function PUT(
  request: Request,
  { params }: { params: { id: string; assignmentId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project exists and belongs to company
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

    // Verify assignment exists
    const existingAssignment = await db.projectSubcontractor.findUnique({
      where: {
        id: params.assignmentId,
        projectId: params.id,
      },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updateAssignmentSchema.safeParse(body);

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

    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    }
    if (data.actualStartDate !== undefined) {
      updateData.actualStartDate = data.actualStartDate ? new Date(data.actualStartDate) : null;
    }
    if (data.actualEndDate !== undefined) {
      updateData.actualEndDate = data.actualEndDate ? new Date(data.actualEndDate) : null;
    }
    if (data.inductionDate !== undefined) {
      updateData.inductionDate = data.inductionDate ? new Date(data.inductionDate) : null;
    }

    // Update assignment
    const assignment = await db.projectSubcontractor.update({
      where: { id: params.assignmentId },
      data: updateData,
      include: {
        subcontractor: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            email: true,
            phone: true,
            tradeSpecialties: true,
          },
        },
      },
    });

    // Audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog({
      companyId: session.user.companyId,
      userId: session.user.id,
      entityType: 'PROJECT_SUBCONTRACTOR',
      entityId: assignment.id,
      action: 'UPDATE',
      oldValues: existingAssignment,
      newValues: assignment,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return NextResponse.json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/subcontractors/[assignmentId] - Remove subcontractor from project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; assignmentId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project exists and belongs to company
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

    // Verify assignment exists
    const assignment = await db.projectSubcontractor.findUnique({
      where: {
        id: params.assignmentId,
        projectId: params.id,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Delete assignment
    await db.projectSubcontractor.delete({
      where: { id: params.assignmentId },
    });

    // Audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog({
      companyId: session.user.companyId,
      userId: session.user.id,
      entityType: 'PROJECT_SUBCONTRACTOR',
      entityId: params.assignmentId,
      action: 'DELETE',
      oldValues: assignment,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return NextResponse.json({
      success: true,
      message: 'Subcontractor removed from project',
    });
  } catch (error) {
    console.error('Error removing subcontractor:', error);
    return NextResponse.json(
      { error: 'Failed to remove subcontractor' },
      { status: 500 }
    );
  }
}
