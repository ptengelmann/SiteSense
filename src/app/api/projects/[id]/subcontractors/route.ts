import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createAuditLog, getClientInfo } from '@/lib/audit';
import { z } from 'zod';

// Validation schema for assigning subcontractor to project
const assignSubcontractorSchema = z.object({
  subcontractorId: z.string().min(1, 'Subcontractor ID is required'),
  role: z.string().optional(),
  scopeOfWork: z.string().optional(),
  tradePackage: z.string().optional(),
  contractValue: z.number().optional(),
  agreedRate: z.number().optional(),
  rateType: z.enum(['DAY_RATE', 'FIXED_PRICE', 'MEASURED']).default('DAY_RATE'),
  paymentTerms: z.string().optional(),
  retentionHeld: z.number().default(0),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  actualStartDate: z.string().optional(),
  actualEndDate: z.string().optional(),
  status: z.enum(['ASSIGNED', 'MOBILIZING', 'ACTIVE', 'DEMOBILIZED', 'SUSPENDED', 'REMOVED']).default('ASSIGNED'),
  performanceRating: z.number().min(1).max(5).optional(),
  onSchedule: z.boolean().default(true),
  qualityIssues: z.number().default(0),
  rampsSubmitted: z.boolean().default(false),
  rampsApproved: z.boolean().default(false),
  inductionCompleted: z.boolean().default(false),
  inductionDate: z.string().optional(),
  notes: z.string().optional(),
});

// POST /api/projects/[id]/subcontractors - Assign subcontractor to project
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
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

    const body = await request.json();
    const validation = assignSubcontractorSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage = validation.error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json(
        { error: errorMessage, errors: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify subcontractor exists and belongs to same company
    const subcontractor = await db.subcontractor.findUnique({
      where: {
        id: data.subcontractorId,
        companyId: session.user.companyId,
      },
    });

    if (!subcontractor) {
      return NextResponse.json(
        { error: 'Subcontractor not found' },
        { status: 404 }
      );
    }

    // Check if already assigned
    const existing = await db.projectSubcontractor.findUnique({
      where: {
        projectId_subcontractorId: {
          projectId: params.id,
          subcontractorId: data.subcontractorId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Subcontractor is already assigned to this project' },
        { status: 400 }
      );
    }

    // Assign subcontractor to project
    const assignment = await db.projectSubcontractor.create({
      data: {
        projectId: params.id,
        subcontractorId: data.subcontractorId,
        role: data.role,
        scopeOfWork: data.scopeOfWork,
        tradePackage: data.tradePackage,
        contractValue: data.contractValue,
        agreedRate: data.agreedRate,
        rateType: data.rateType,
        paymentTerms: data.paymentTerms,
        retentionHeld: data.retentionHeld,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        actualStartDate: data.actualStartDate ? new Date(data.actualStartDate) : null,
        actualEndDate: data.actualEndDate ? new Date(data.actualEndDate) : null,
        status: data.status,
        performanceRating: data.performanceRating,
        onSchedule: data.onSchedule,
        qualityIssues: data.qualityIssues,
        rampsSubmitted: data.rampsSubmitted,
        rampsApproved: data.rampsApproved,
        inductionCompleted: data.inductionCompleted,
        inductionDate: data.inductionDate ? new Date(data.inductionDate) : null,
        notes: data.notes,
        assignedBy: session.user.id,
      },
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
      action: 'ASSIGN',
      newValues: assignment,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return NextResponse.json({
      success: true,
      assignment,
    });
  } catch (error: any) {
    console.error('Error assigning subcontractor:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Subcontractor is already assigned to this project' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to assign subcontractor' },
      { status: 500 }
    );
  }
}

// GET /api/projects/[id]/subcontractors - Get all subcontractors for a project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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

    const assignments = await db.projectSubcontractor.findMany({
      where: {
        projectId: params.id,
      },
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
            cscsCardExpiresAt: true,
            publicLiabilityExpiresAt: true,
            employersLiabilityExpiresAt: true,
            chasAccredited: true,
            chasExpiresAt: true,
            safeContractorAccredited: true,
            safeContractorExpiresAt: true,
            isActive: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Error fetching project subcontractors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcontractors' },
      { status: 500 }
    );
  }
}
