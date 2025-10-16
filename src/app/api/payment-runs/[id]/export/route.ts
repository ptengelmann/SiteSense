import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/payment-runs/[id]/export - Export payment run to BACS format
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'bacs';

    // Fetch payment run with invoices and subcontractor bank details
    const paymentRun = await db.paymentRun.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
      },
      include: {
        invoices: {
          include: {
            invoice: {
              include: {
                subcontractor: {
                  select: {
                    id: true,
                    companyName: true,
                    bankName: true,
                    bankAccountName: true,
                    bankAccountNumber: true,
                    bankSortCode: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!paymentRun) {
      return NextResponse.json({ error: 'Payment run not found' }, { status: 404 });
    }

    if (format === 'bacs') {
      // Generate BACS Standard 18 format file
      const bacsLines: string[] = [];

      // Header record (Type 0)
      const today = new Date();
      const processingDate = today.toISOString().split('T')[0].replace(/-/g, '');

      bacsLines.push(`0,${processingDate},${paymentRun.name.substring(0, 18).padEnd(18, ' ')}`);

      // Payment records (Type 1)
      paymentRun.invoices.forEach((pi, index) => {
        const invoice = pi.invoice;
        const sub = invoice.subcontractor;

        // Skip if missing bank details
        if (!sub.bankSortCode || !sub.bankAccountNumber) {
          return;
        }

        const sortCode = sub.bankSortCode.replace(/-/g, '').padStart(6, '0');
        const accountNumber = sub.bankAccountNumber.padStart(8, '0');
        const amount = Math.round(invoice.netPayment * 100).toString().padStart(11, '0'); // Pence
        const reference = `INV${invoice.invoiceNumber}`.substring(0, 18).padEnd(18, ' ');
        const accountName = (sub.bankAccountName || sub.companyName).substring(0, 18).padEnd(18, ' ');

        bacsLines.push(`1,${sortCode},${accountNumber},${amount},${reference},${accountName}`);
      });

      // Trailer record (Type 9)
      const totalAmount = paymentRun.invoices.reduce((sum, pi) => sum + pi.invoice.netPayment, 0);
      const totalPence = Math.round(totalAmount * 100).toString().padStart(13, '0');
      const recordCount = (bacsLines.length - 1).toString().padStart(6, '0'); // Exclude header

      bacsLines.push(`9,${recordCount},${totalPence}`);

      const bacsContent = bacsLines.join('\n');

      // Mark as exported
      await db.paymentRun.update({
        where: { id: params.id },
        data: {
          status: 'EXPORTED',
          exportedAt: new Date(),
        },
      });

      return new NextResponse(bacsContent, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="payment-run-${paymentRun.name.replace(/[^a-z0-9]/gi, '_')}-${processingDate}.txt"`,
        },
      });
    } else if (format === 'csv') {
      // Generate CSV format
      const csvLines: string[] = [];

      // Header
      csvLines.push('Invoice Number,Subcontractor,Sort Code,Account Number,Account Name,Amount,Net Payment,Reference');

      // Rows
      paymentRun.invoices.forEach(pi => {
        const invoice = pi.invoice;
        const sub = invoice.subcontractor;

        csvLines.push([
          invoice.invoiceNumber,
          sub.companyName,
          sub.bankSortCode || '',
          sub.bankAccountNumber || '',
          sub.bankAccountName || '',
          invoice.amount.toFixed(2),
          invoice.netPayment.toFixed(2),
          `Payment Run ${paymentRun.name}`,
        ].join(','));
      });

      const csvContent = csvLines.join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="payment-run-${paymentRun.name.replace(/[^a-z0-9]/gi, '_')}.csv"`,
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error exporting payment run:', error);
    return NextResponse.json(
      { error: 'Failed to export payment run' },
      { status: 500 }
    );
  }
}
