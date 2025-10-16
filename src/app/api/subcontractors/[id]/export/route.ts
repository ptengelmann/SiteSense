import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createAuditLog, getClientInfo } from '@/lib/audit';

// GET /api/subcontractors/[id]/export - GDPR Data Export (Article 20)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all subcontractor data including relations
    const subcontractor = await db.subcontractor.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
      include: {
        invoices: {
          include: {
            documents: true,
          },
        },
        cisVerifications: true,
      },
    });

    if (!subcontractor) {
      return NextResponse.json(
        { error: 'Subcontractor not found' },
        { status: 404 }
      );
    }

    // Update GDPR export timestamp
    await db.subcontractor.update({
      where: { id: params.id },
      data: { gdprDataExportedAt: new Date() },
    });

    // Prepare GDPR-compliant data export
    const gdprExport = {
      exportDate: new Date().toISOString(),
      exportType: 'GDPR Article 20 - Right to Data Portability',
      dataController: {
        name: session.user.companyName,
        contactEmail: session.user.email,
      },
      personalData: {
        // Identity Data
        identityInformation: {
          companyName: subcontractor.companyName,
          companyNumber: subcontractor.companyNumber,
          vatNumber: subcontractor.vatNumber,
          utr: subcontractor.utr,
          contactName: subcontractor.contactName,
          email: subcontractor.email,
          phone: subcontractor.phone,
        },
        // Address Data
        addressInformation: {
          addressLine1: subcontractor.addressLine1,
          addressLine2: subcontractor.addressLine2,
          city: subcontractor.city,
          postcode: subcontractor.postcode,
          country: subcontractor.country,
        },
        // Financial Data
        financialInformation: {
          bankName: subcontractor.bankName,
          bankAccountName: subcontractor.bankAccountName,
          // Only last 4 digits for security
          bankAccountNumber: subcontractor.bankAccountNumber
            ? `****${subcontractor.bankAccountNumber.slice(-4)}`
            : null,
          bankSortCode: subcontractor.bankSortCode,
          paymentTermsDays: subcontractor.paymentTermsDays,
          retentionPercentage: subcontractor.retentionPercentage,
          earlyPaymentDiscount: subcontractor.earlyPaymentDiscount,
        },
        // CIS Data
        cisInformation: {
          cisStatus: subcontractor.cisStatus,
          cisVerifiedAt: subcontractor.cisVerifiedAt,
          cisVerificationExpiresAt: subcontractor.cisVerificationExpiresAt,
          cisVerificationReference: subcontractor.cisVerificationReference,
          cisDeductionRate: subcontractor.cisDeductionRate,
          verificationHistory: subcontractor.cisVerifications,
        },
        // Insurance Data
        insuranceInformation: {
          publicLiability: {
            expiresAt: subcontractor.publicLiabilityExpiresAt,
            amount: subcontractor.publicLiabilityAmount,
            documentUrl: subcontractor.publicLiabilityDocUrl,
          },
          employersLiability: {
            expiresAt: subcontractor.employersLiabilityExpiresAt,
            documentUrl: subcontractor.employersLiabilityDocUrl,
          },
          professionalIndemnity: {
            expiresAt: subcontractor.professionalIndemnityExpiresAt,
            documentUrl: subcontractor.professionalIndemnityDocUrl,
          },
        },
        // Performance Data
        performanceMetrics: {
          performanceScore: subcontractor.performanceScore,
          riskScore: subcontractor.riskScore,
          totalPaid: subcontractor.totalPaid,
          totalInvoices: subcontractor.totalInvoices,
          onTimeDeliveryRate: subcontractor.onTimeDeliveryRate,
          invoiceAccuracyRate: subcontractor.invoiceAccuracyRate,
          disputeCount: subcontractor.disputeCount,
          averageResponseTime: subcontractor.averageResponseTime,
        },
        // Invoice History
        invoiceHistory: subcontractor.invoices.map((inv) => ({
          invoiceNumber: inv.invoiceNumber,
          invoiceDate: inv.invoiceDate,
          amount: inv.amount,
          cisDeduction: inv.cisDeduction,
          netPayment: inv.netPayment,
          status: inv.status,
          paymentDate: inv.paymentDate,
          documents: inv.documents.map((doc) => ({
            type: doc.documentType,
            fileName: doc.fileName,
            uploadDate: doc.createdAt,
          })),
        })),
      },
      // GDPR Compliance Information
      gdprInformation: {
        dataConsentGiven: subcontractor.dataConsentGiven,
        dataConsentDate: subcontractor.dataConsentDate,
        dataProcessingPurpose: subcontractor.dataProcessingPurpose,
        legalBasisForProcessing: subcontractor.legalBasisForProcessing,
        dataRetentionUntil: subcontractor.dataRetentionUntil,
        lastDataAccess: subcontractor.lastDataAccess,
        previousDataExports: subcontractor.gdprDataExportedAt,
      },
      // Metadata
      metadata: {
        accountCreated: subcontractor.createdAt,
        lastUpdated: subcontractor.updatedAt,
        isActive: subcontractor.isActive,
        archivedAt: subcontractor.archivedAt,
        scheduledForDeletion: subcontractor.scheduledForDeletion,
        deletionRequestedAt: subcontractor.deletionRequestedAt,
      },
    };

    // Audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog({
      companyId: session.user.companyId,
      userId: session.user.id,
      entityType: 'SUBCONTRACTOR',
      entityId: params.id,
      action: 'EXPORT',
      newValues: { exportDate: new Date(), exportType: 'GDPR' },
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    });

    // Return as downloadable JSON
    const fileName = `gdpr-export-${subcontractor.companyName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;

    return new NextResponse(JSON.stringify(gdprExport, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error exporting subcontractor data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
