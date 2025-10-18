import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyzeInvoiceWithAI } from '@/lib/ai/invoice-analyzer';
import { sendEmailNotification } from '@/lib/email/send';

/**
 * Email-to-Invoice Webhook
 *
 * Receives emails from SendGrid Inbound Parse
 * Extracts PDF attachments, runs AI OCR, creates invoice
 *
 * SendGrid POST format:
 * - to: recipient email
 * - from: sender email
 * - subject: email subject
 * - attachments: number of attachments
 * - attachment1: first attachment file
 * - attachment-info: JSON with attachment metadata
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Email Webhook] Received email');

    // Parse multipart form data from SendGrid
    const formData = await request.formData();

    const to = formData.get('to') as string;
    const from = formData.get('from') as string;
    const subject = formData.get('subject') as string;
    const text = formData.get('text') as string;
    const attachmentsCount = parseInt(formData.get('attachments') as string || '0');

    console.log('[Email Webhook] Email details:', { to, from, subject, attachmentsCount });

    // Validate we have attachments
    if (attachmentsCount === 0) {
      console.log('[Email Webhook] No attachments found');
      return NextResponse.json({
        error: 'No attachments found. Please attach an invoice PDF.'
      }, { status: 400 });
    }

    // Extract attachment info
    const attachmentInfo = JSON.parse(formData.get('attachment-info') as string || '{}');

    // Find PDF attachment
    let pdfFile = null;
    let pdfFilename = '';

    for (let i = 1; i <= attachmentsCount; i++) {
      const attachment = formData.get(`attachment${i}`) as File;
      const info = attachmentInfo[`attachment${i}`];

      if (attachment && info?.type === 'application/pdf') {
        pdfFile = attachment;
        pdfFilename = info.filename || `invoice-${Date.now()}.pdf`;
        break;
      }
    }

    if (!pdfFile) {
      console.log('[Email Webhook] No PDF attachment found');
      return NextResponse.json({
        error: 'No PDF attachment found. Please attach an invoice as PDF.'
      }, { status: 400 });
    }

    console.log('[Email Webhook] Found PDF:', pdfFilename);

    // Convert File to Buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Pdf = buffer.toString('base64');

    // Try to match sender email to subcontractor
    const senderEmail = extractEmail(from);
    const subcontractor = await db.subcontractor.findFirst({
      where: {
        email: {
          contains: senderEmail,
          mode: 'insensitive',
        },
        isActive: true,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            users: {
              where: { role: 'ADMIN' },
              select: { email: true, firstName: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!subcontractor) {
      console.log('[Email Webhook] Subcontractor not found for email:', senderEmail);

      // Send notification to all companies (they can manually match)
      // For now, return error
      return NextResponse.json({
        error: `Subcontractor not found for email: ${senderEmail}. Please add this subcontractor first.`
      }, { status: 400 });
    }

    console.log('[Email Webhook] Matched subcontractor:', subcontractor.companyName);

    // Run AI analysis
    console.log('[Email Webhook] Starting AI analysis...');
    const aiResult = await analyzeInvoiceWithAI(base64Pdf, {
      subcontractorName: subcontractor.companyName,
      subcontractorId: subcontractor.id,
    });

    console.log('[Email Webhook] AI analysis complete. Risk score:', aiResult.riskScore);

    // Calculate CIS deduction
    const cisRate = subcontractor.cisStatus === 'GROSS' ? 0
                  : subcontractor.cisStatus === 'HIGHER' ? 0.30
                  : 0.20;

    const cisDeduction = aiResult.totalAmount * cisRate;
    const netPayment = aiResult.totalAmount - cisDeduction;

    // Determine initial status based on risk score
    let initialStatus: 'SUBMITTED' | 'APPROVED' = 'SUBMITTED';

    // Auto-approve if low risk AND trusted subcontractor
    if (aiResult.riskScore < 30 &&
        subcontractor.totalInvoices && subcontractor.totalInvoices > 10 &&
        aiResult.totalAmount < 5000) {
      initialStatus = 'APPROVED';
      console.log('[Email Webhook] Auto-approved (low risk + trusted subcontractor)');
    }

    // Create invoice in database
    const invoice = await db.invoice.create({
      data: {
        invoiceNumber: aiResult.invoiceNumber || `AUTO-${Date.now()}`,
        invoiceDate: aiResult.invoiceDate || new Date(),
        dueDate: aiResult.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount: aiResult.totalAmount,
        cisDeduction,
        netPayment,
        status: initialStatus,
        subcontractorId: subcontractor.id,
        companyId: subcontractor.companyId,

        // Store AI analysis results
        validationStatus: aiResult.riskScore < 30 ? 'PASSED' : aiResult.riskScore < 60 ? 'REVIEW_REQUIRED' : 'FAILED',
        validationRiskScore: aiResult.riskLevel,
        validationResult: aiResult as any,

        // Store email metadata
        description: `Auto-imported from email sent by ${from}\nSubject: ${subject}`,
      },
      include: {
        subcontractor: {
          select: {
            companyName: true,
            email: true,
          },
        },
      },
    });

    console.log('[Email Webhook] Invoice created:', invoice.id);

    // Send notification to finance team
    const adminEmail = subcontractor.company.users[0]?.email;
    const adminName = subcontractor.company.users[0]?.firstName || 'there';

    if (adminEmail) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const statusMessage = initialStatus === 'APPROVED'
        ? '✅ Auto-approved (low risk)'
        : '⚠️ Needs your review';

      await sendEmailNotification({
        to: adminEmail,
        subject: `New Invoice: ${invoice.invoiceNumber} - ${statusMessage}`,
        text: `
Hi ${adminName},

A new invoice has been automatically imported:

📄 Invoice: ${invoice.invoiceNumber}
🏢 Subcontractor: ${subcontractor.companyName}
💰 Amount: £${invoice.amount.toFixed(2)}
💷 Net Payment (after CIS): £${invoice.netPayment.toFixed(2)}
📊 AI Risk Score: ${aiResult.riskScore}/100 ${aiResult.riskLevel}

${initialStatus === 'APPROVED' ? '✅ This invoice was auto-approved because it\'s low risk from a trusted subcontractor.' : '⚠️ Please review this invoice in your dashboard.'}

${aiResult.fraudChecks && aiResult.fraudChecks.length > 0 ? '\n🚨 Fraud Alerts:\n' + aiResult.fraudChecks.map((check: any) => `- ${check.issue}`).join('\n') : ''}

View invoice: ${appUrl}/dashboard/invoices/${invoice.id}

---
Automated by SiteSense
        `.trim(),
      });

      console.log('[Email Webhook] Notification sent to:', adminEmail);
    }

    return NextResponse.json({
      success: true,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: initialStatus,
      riskScore: aiResult.riskScore,
      message: initialStatus === 'APPROVED'
        ? 'Invoice auto-imported and approved'
        : 'Invoice auto-imported, awaiting review',
    });

  } catch (error: any) {
    console.error('[Email Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process email', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Extract clean email address from "Name <email@example.com>" format
 */
function extractEmail(emailString: string): string {
  const match = emailString.match(/<(.+?)>/);
  return match ? match[1] : emailString;
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'email-invoice-webhook',
    timestamp: new Date().toISOString(),
  });
}
