import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { analyzeInvoice, type SubcontractorHistory } from '@/lib/ai/invoice-analyzer';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const subcontractorId = formData.get('subcontractorId') as string;
    const projectId = formData.get('projectId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!subcontractorId) {
      return NextResponse.json({ error: 'Subcontractor ID required' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Verify subcontractor belongs to user's company
    const subcontractor = await db.subcontractor.findFirst({
      where: {
        id: subcontractorId,
        companyId: session.user.companyId,
      },
    });

    if (!subcontractor) {
      return NextResponse.json(
        { error: 'Subcontractor not found' },
        { status: 404 }
      );
    }

    // Get subcontractor's invoice history
    const invoices = await db.invoice.findMany({
      where: {
        subcontractorId,
        companyId: session.user.companyId,
      },
      select: {
        invoiceNumber: true,
        amount: true,
        invoiceDate: true,
      },
      orderBy: {
        invoiceDate: 'desc',
      },
      take: 50,
    });

    // Calculate history metrics
    const totalInvoices = invoices.length;
    const averageAmount =
      totalInvoices > 0
        ? invoices.reduce((sum, inv) => sum + inv.amount, 0) / totalInvoices
        : 0;

    const lastInvoiceDate = invoices[0]?.invoiceDate.toISOString() || null;

    // Calculate invoice frequency
    let invoiceFrequency = 'Unknown';
    if (invoices.length >= 2) {
      const dates = invoices.map((inv) => inv.invoiceDate.getTime());
      const intervals = [];
      for (let i = 0; i < Math.min(dates.length - 1, 5); i++) {
        intervals.push((dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24)); // days
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

      if (avgInterval < 10) invoiceFrequency = 'Weekly';
      else if (avgInterval < 20) invoiceFrequency = 'Bi-weekly';
      else if (avgInterval < 35) invoiceFrequency = 'Monthly';
      else invoiceFrequency = 'Irregular';
    }

    const history: SubcontractorHistory = {
      averageAmount,
      lastInvoiceDate,
      invoiceFrequency,
      totalInvoices,
      previousInvoiceNumbers: invoices.map((inv) => inv.invoiceNumber),
    };

    // Get project budget if projectId provided
    let projectBudget: number | undefined;
    if (projectId) {
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          companyId: session.user.companyId,
        },
        select: {
          budget: true,
          actualCost: true,
        },
      });

      if (project?.budget) {
        projectBudget = project.budget - project.actualCost;
      }
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Analyze invoice with AI
    console.log('Analyzing invoice for subcontractor:', subcontractor.companyName);
    const result = await analyzeInvoice(base64, history, projectBudget);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error analyzing invoice:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze invoice' },
      { status: 500 }
    );
  }
}
