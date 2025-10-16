import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createAuditLog, getClientInfo } from '@/lib/audit';
import { z } from 'zod';

// Validation schema with GDPR consent requirement
const createSubcontractorSchema = z.object({
  // Basic Details
  companyName: z.string().min(1, 'Company name is required'),
  companyNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  utr: z.string().min(10, 'Valid UTR required'),

  // Address
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('GB'),

  // CIS
  cisStatus: z.enum(['GROSS', 'STANDARD', 'HIGHER', 'NOT_VERIFIED']).optional(),
  cisDeductionRate: z.number().min(0).max(30).optional(),

  // Insurance
  publicLiabilityExpiresAt: z.string().optional(),
  publicLiabilityAmount: z.number().optional(),
  employersLiabilityExpiresAt: z.string().optional(),
  professionalIndemnityExpiresAt: z.string().optional(),

  // Payment Terms
  paymentTermsDays: z.number().default(30),
  retentionPercentage: z.number().min(0).max(10).default(0),
  earlyPaymentDiscount: z.number().optional(),

  // Bank Details
  bankName: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankSortCode: z.string().optional(),

  // GDPR Compliance - REQUIRED
  dataConsentGiven: z.boolean().refine((val) => val === true, {
    message: 'Data processing consent is required',
  }),
  dataProcessingPurpose: z.string().min(1, 'Processing purpose is required'),

  // Meta
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
  internalRating: z.number().min(1).max(5).optional(),
});

// GET /api/subcontractors - List all subcontractors
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status'); // active, inactive, all
    const cisStatus = searchParams.get('cisStatus');
    const riskScore = searchParams.get('riskScore');

    const where: any = {
      companyId: session.user.companyId,
    };

    // Search filter
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { utr: { contains: search } },
      ];
    }

    // Status filter
    if (status === 'active') {
      where.isActive = true;
      where.scheduledForDeletion = false;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    // CIS status filter
    if (cisStatus && cisStatus !== 'all') {
      where.cisStatus = cisStatus;
    }

    // Risk score filter
    if (riskScore && riskScore !== 'all') {
      where.riskScore = riskScore;
    }

    const subcontractors = await db.subcontractor.findMany({
      where,
      select: {
        id: true,
        companyName: true,
        contactName: true,
        email: true,
        phone: true,
        utr: true,
        cisStatus: true,
        cisVerificationExpiresAt: true,
        publicLiabilityExpiresAt: true,
        performanceScore: true,
        riskScore: true,
        totalPaid: true,
        totalInvoices: true,
        isActive: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ subcontractors });
  } catch (error) {
    console.error('Error fetching subcontractors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcontractors' },
      { status: 500 }
    );
  }
}

// POST /api/subcontractors - Create new subcontractor
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createSubcontractorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Calculate data retention date (7 years per HMRC requirement)
    const dataRetentionUntil = new Date();
    dataRetentionUntil.setFullYear(dataRetentionUntil.getFullYear() + 7);

    // Create subcontractor
    const subcontractor = await db.subcontractor.create({
      data: {
        companyId: session.user.companyId,
        companyName: data.companyName,
        companyNumber: data.companyNumber,
        vatNumber: data.vatNumber,
        contactName: data.contactName,
        email: data.email || null,
        phone: data.phone,
        utr: data.utr,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        postcode: data.postcode,
        country: data.country,
        cisStatus: data.cisStatus,
        cisDeductionRate: data.cisDeductionRate,
        publicLiabilityExpiresAt: data.publicLiabilityExpiresAt ? new Date(data.publicLiabilityExpiresAt) : null,
        publicLiabilityAmount: data.publicLiabilityAmount,
        employersLiabilityExpiresAt: data.employersLiabilityExpiresAt ? new Date(data.employersLiabilityExpiresAt) : null,
        professionalIndemnityExpiresAt: data.professionalIndemnityExpiresAt ? new Date(data.professionalIndemnityExpiresAt) : null,
        paymentTermsDays: data.paymentTermsDays,
        retentionPercentage: data.retentionPercentage,
        earlyPaymentDiscount: data.earlyPaymentDiscount,
        bankName: data.bankName,
        bankAccountName: data.bankAccountName,
        bankAccountNumber: data.bankAccountNumber,
        bankSortCode: data.bankSortCode,
        // GDPR
        dataConsentGiven: data.dataConsentGiven,
        dataConsentDate: new Date(),
        dataProcessingPurpose: data.dataProcessingPurpose,
        dataRetentionUntil,
        legalBasisForProcessing: 'Contract',
        // Meta
        notes: data.notes,
        tags: data.tags,
        internalRating: data.internalRating,
      },
    });

    // Audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog({
      companyId: session.user.companyId,
      userId: session.user.id,
      entityType: 'SUBCONTRACTOR',
      entityId: subcontractor.id,
      action: 'CREATE',
      newValues: subcontractor,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    return NextResponse.json({
      success: true,
      subcontractor,
    });
  } catch (error: any) {
    console.error('Error creating subcontractor:', error);

    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A subcontractor with this UTR already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create subcontractor' },
      { status: 500 }
    );
  }
}
