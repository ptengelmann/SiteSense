import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createAuditLog, getClientInfo } from '@/lib/audit';
import { z } from 'zod';

// Comprehensive validation schema for UK construction projects
const createProjectSchema = z.object({
  // Basic Details
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  projectNumber: z.string().optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'SNAGGING', 'COMPLETED', 'CANCELLED']).default('PLANNING'),

  // Client Information
  clientName: z.string().optional(),
  clientCompany: z.string().optional(),
  clientEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  clientPhone: z.string().optional(),

  // Site Address
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('GB'),
  siteContactName: z.string().optional(),
  siteContactPhone: z.string().optional(),

  // Project Type & Contract
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
  retentionPercentage: z.number().min(0).max(20).default(5), // Typical 5% retention

  // Budget & Cost Tracking
  budget: z.number().optional(),
  actualCost: z.number().default(0),
  approvedVariations: z.number().default(0),
  pendingVariations: z.number().default(0),

  // Dates
  startDate: z.string().optional(),
  estimatedCompletionDate: z.string().optional(),
  actualCompletionDate: z.string().optional(),
  handoverDate: z.string().optional(),

  // Health & Safety (CDM 2015 Requirements)
  principalContractor: z.string().optional(),
  principalDesigner: z.string().optional(),
  hsePlanRequired: z.boolean().default(true),
  hsePlanApproved: z.boolean().default(false),
  hsePlanApprovedDate: z.string().optional(),
  f10NotificationNumber: z.string().optional(), // HSE F10 for notifiable projects
  rampsRequired: z.boolean().default(true),

  // Planning & Building Control
  planningPermissionRef: z.string().optional(),
  planningPermissionDate: z.string().optional(),
  buildingControlRef: z.string().optional(),
  buildingControlBody: z.string().optional(),

  // Insurance
  contractWorksInsurance: z.number().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceExpiryDate: z.string().optional(),

  // Performance Metrics
  onSchedule: z.boolean().default(true),
  daysDelay: z.number().default(0),
  qualityScore: z.number().min(1).max(5).optional(),
  clientSatisfaction: z.number().min(1).max(5).optional(),

  // Meta
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

// GET /api/projects - List all projects
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const projectType = searchParams.get('projectType');
    const includeArchived = searchParams.get('includeArchived') === 'true';

    const where: any = {
      companyId: session.user.companyId,
    };

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { projectNumber: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { clientCompany: { contains: search, mode: 'insensitive' } },
        { postcode: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Project type filter
    if (projectType && projectType !== 'all') {
      where.projectType = projectType;
    }

    // Archive filter
    if (!includeArchived) {
      where.isArchived = false;
    }

    const projects = await db.project.findMany({
      where,
      select: {
        id: true,
        name: true,
        projectNumber: true,
        status: true,
        projectType: true,
        contractType: true,
        clientName: true,
        clientCompany: true,
        addressLine1: true,
        city: true,
        postcode: true,
        budget: true,
        actualCost: true,
        contractValue: true,
        startDate: true,
        estimatedCompletionDate: true,
        actualCompletionDate: true,
        onSchedule: true,
        daysDelay: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage = validation.error.issues?.[0]?.message || 'Validation failed';
      console.error('Validation error:', validation.error.issues);
      return NextResponse.json(
        { error: errorMessage, errors: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create project
    const project = await db.project.create({
      data: {
        companyId: session.user.companyId,
        // Basic Details
        name: data.name,
        description: data.description,
        projectNumber: data.projectNumber,
        status: data.status,
        // Client Information
        clientName: data.clientName,
        clientCompany: data.clientCompany,
        clientEmail: data.clientEmail || undefined,
        clientPhone: data.clientPhone,
        // Site Address
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        postcode: data.postcode,
        country: data.country,
        siteContactName: data.siteContactName,
        siteContactPhone: data.siteContactPhone,
        // Project Type & Contract
        projectType: data.projectType,
        contractType: data.contractType,
        contractValue: data.contractValue,
        retentionPercentage: data.retentionPercentage,
        // Budget & Cost Tracking
        budget: data.budget,
        actualCost: data.actualCost,
        approvedVariations: data.approvedVariations,
        pendingVariations: data.pendingVariations,
        // Dates
        startDate: data.startDate ? new Date(data.startDate) : null,
        estimatedCompletionDate: data.estimatedCompletionDate ? new Date(data.estimatedCompletionDate) : null,
        actualCompletionDate: data.actualCompletionDate ? new Date(data.actualCompletionDate) : null,
        handoverDate: data.handoverDate ? new Date(data.handoverDate) : null,
        // Health & Safety
        principalContractor: data.principalContractor,
        principalDesigner: data.principalDesigner,
        hsePlanRequired: data.hsePlanRequired,
        hsePlanApproved: data.hsePlanApproved,
        hsePlanApprovedDate: data.hsePlanApprovedDate ? new Date(data.hsePlanApprovedDate) : null,
        f10NotificationNumber: data.f10NotificationNumber,
        rampsRequired: data.rampsRequired,
        // Planning & Building Control
        planningPermissionRef: data.planningPermissionRef,
        planningPermissionDate: data.planningPermissionDate ? new Date(data.planningPermissionDate) : null,
        buildingControlRef: data.buildingControlRef,
        buildingControlBody: data.buildingControlBody,
        // Insurance
        contractWorksInsurance: data.contractWorksInsurance,
        insurancePolicyNumber: data.insurancePolicyNumber,
        insuranceExpiryDate: data.insuranceExpiryDate ? new Date(data.insuranceExpiryDate) : null,
        // Performance Metrics
        onSchedule: data.onSchedule,
        daysDelay: data.daysDelay,
        qualityScore: data.qualityScore,
        clientSatisfaction: data.clientSatisfaction,
        // Meta
        notes: data.notes,
        tags: data.tags,
        createdBy: session.user.id,
      },
    });

    // Audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog({
      companyId: session.user.companyId,
      userId: session.user.id,
      entityType: 'PROJECT',
      entityId: project.id,
      action: 'CREATE',
      newValues: project,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);

    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A project with this project number already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
