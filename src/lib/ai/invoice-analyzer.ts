import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface SubcontractorHistory {
  averageAmount: number;
  lastInvoiceDate: string | null;
  invoiceFrequency: string;
  totalInvoices: number;
  previousInvoiceNumbers: string[];
}

export interface InvoiceExtractedData {
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  supplierName: string;
  amount: number;
  vat?: number;
  lineItems: Array<{
    description: string;
    quantity?: number;
    rate?: number;
    amount: number;
  }>;
  confidence: number;
}

export interface FraudFlag {
  type: 'DUPLICATE' | 'AMOUNT_ANOMALY' | 'FREQUENCY' | 'BUDGET' | 'AUTHENTICITY' | 'COMPLETENESS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
  recommendation: string;
}

export interface FraudAnalysis {
  riskScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: FraudFlag[];
  summary: string;
  confidence: number;
}

export interface InvoiceAnalysisResult {
  extractedData: InvoiceExtractedData;
  fraudAnalysis: FraudAnalysis;
}

function buildAnalysisPrompt(history: SubcontractorHistory, projectBudget?: number): string {
  return `You are an expert invoice fraud analyst for UK construction companies specializing in CIS compliance.

TASK: Extract invoice data and analyze for fraud risks.

EXTRACT the following data from the invoice:
- Invoice number
- Invoice date (format: YYYY-MM-DD)
- Due date (format: YYYY-MM-DD, if present)
- Supplier name and address
- Line items with descriptions, quantities, rates, and amounts
- Subtotal
- VAT amount and rate
- Total amount
- Any handwritten notes or amendments

ANALYZE for fraud using this historical context:
- Subcontractor average invoice: £${history.averageAmount.toFixed(2)}
- Last invoice submitted: ${history.lastInvoiceDate || 'N/A'}
- Typical submission frequency: ${history.invoiceFrequency}
- Previous invoices submitted: ${history.totalInvoices}
- Previous invoice numbers: ${history.previousInvoiceNumbers.slice(0, 5).join(', ')}
${projectBudget ? `- Project budget remaining: £${projectBudget.toFixed(2)}` : ''}

FRAUD DETECTION CHECKS:
1. **Duplicate Detection** - Does this invoice number match any previous invoices?
2. **Amount Anomaly** - Is the amount unusually high or low compared to history?
3. **Frequency Analysis** - Is the submission timing suspicious?
4. **Budget Validation** - Does it fit within the project budget?
5. **Price Reasonableness** - Are rates typical for UK construction (e.g., electricians £35-50/hr)?
6. **Completeness** - Are all required fields present and valid?
7. **Authenticity** - Any signs of document tampering, forgery, or digital manipulation?
8. **Format Consistency** - Does it match previous invoices from this supplier?

RESPONSE FORMAT:
Return ONLY valid JSON matching this exact schema (no markdown, no code blocks):
{
  "extractedData": {
    "invoiceNumber": "string",
    "date": "YYYY-MM-DD",
    "dueDate": "YYYY-MM-DD or null",
    "supplierName": "string",
    "amount": number,
    "vat": number or null,
    "lineItems": [
      {
        "description": "string",
        "quantity": number or null,
        "rate": number or null,
        "amount": number
      }
    ],
    "confidence": 0.0-1.0 (your confidence in the extraction accuracy)
  },
  "fraudAnalysis": {
    "riskScore": 0-100 (overall fraud risk percentage),
    "riskLevel": "LOW" | "MEDIUM" | "HIGH",
    "flags": [
      {
        "type": "DUPLICATE" | "AMOUNT_ANOMALY" | "FREQUENCY" | "BUDGET" | "AUTHENTICITY" | "COMPLETENESS",
        "severity": "LOW" | "MEDIUM" | "HIGH",
        "reason": "Detailed explanation",
        "recommendation": "Actionable advice"
      }
    ],
    "summary": "2-3 sentence summary of the analysis and key concerns",
    "confidence": 0.0-1.0 (your confidence in the fraud analysis)
  }
}

IMPORTANT:
- If any field cannot be extracted, use null
- Be conservative with fraud detection - legitimate invoices should score LOW risk
- High-value invoices (>£20k) warrant extra scrutiny
- Consistent patterns are good; sudden changes are suspicious
- Return ONLY the JSON, no additional text`;
}

export async function analyzeInvoice(
  pdfBase64: string,
  history: SubcontractorHistory,
  projectBudget?: number,
  useHaiku: boolean = true
): Promise<InvoiceAnalysisResult> {
  const model = useHaiku ? 'claude-3-5-haiku-20241022' : 'claude-3-5-sonnet-20241022';

  try {
    const message = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'application/pdf' as any, // PDF support exists but not in TS types for this SDK version
                data: pdfBase64,
              },
            },
            {
              type: 'text',
              text: buildAnalysisPrompt(history, projectBudget),
            },
          ],
        },
      ],
    });

    // Extract the text response
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse the JSON response
    const result = JSON.parse(textContent.text) as InvoiceAnalysisResult;

    // If confidence is low or amount is high, retry with Sonnet for better accuracy
    if (useHaiku && (result.extractedData.confidence < 0.85 || result.extractedData.amount > 20000)) {
      console.log('Low confidence or high value detected, retrying with Sonnet...');
      return analyzeInvoice(pdfBase64, history, projectBudget, false);
    }

    return result;
  } catch (error) {
    console.error('Error analyzing invoice:', error);
    throw new Error('Failed to analyze invoice. Please try again.');
  }
}

/**
 * Convenience function to analyze invoice with automatic history lookup
 * Used by email webhook and manual invoice upload
 */
export async function analyzeInvoiceWithAI(
  pdfBase64: string,
  context: {
    subcontractorId: string;
    subcontractorName: string;
    projectId?: string;
  }
): Promise<{
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date | null;
  totalAmount: number;
  vat: number | null;
  lineItems: any[];
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  fraudChecks: Array<{
    type: string;
    severity: string;
    issue: string;
    recommendation: string;
  }>;
  confidence: number;
}> {
  const { db } = await import('@/lib/db');

  // Build subcontractor history
  const invoices = await db.invoice.findMany({
    where: { subcontractorId: context.subcontractorId },
    select: {
      amount: true,
      invoiceNumber: true,
      invoiceDate: true,
    },
    orderBy: { invoiceDate: 'desc' },
    take: 20,
  });

  const history: SubcontractorHistory = {
    totalInvoices: invoices.length,
    averageAmount: invoices.length > 0
      ? invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length
      : 0,
    lastInvoiceDate: invoices[0]?.invoiceDate?.toISOString() || null,
    invoiceFrequency: invoices.length > 1 ? 'Regular' : 'First invoice',
    previousInvoiceNumbers: invoices.map(inv => inv.invoiceNumber),
  };

  // Get project budget if projectId provided
  let projectBudget: number | undefined;
  if (context.projectId) {
    const project = await db.project.findUnique({
      where: { id: context.projectId },
      select: { budget: true, actualCost: true },
    });

    if (project) {
      projectBudget = project.budget - (project.actualCost || 0);
    }
  }

  // Run AI analysis
  const result = await analyzeInvoice(pdfBase64, history, projectBudget);

  // Transform to simplified format
  return {
    invoiceNumber: result.extractedData.invoiceNumber,
    invoiceDate: new Date(result.extractedData.date),
    dueDate: result.extractedData.dueDate ? new Date(result.extractedData.dueDate) : null,
    totalAmount: result.extractedData.amount,
    vat: result.extractedData.vat || null,
    lineItems: result.extractedData.lineItems,
    riskScore: result.fraudAnalysis.riskScore,
    riskLevel: result.fraudAnalysis.riskLevel,
    fraudChecks: result.fraudAnalysis.flags.map(flag => ({
      type: flag.type,
      severity: flag.severity,
      issue: flag.reason,
      recommendation: flag.recommendation,
    })),
    confidence: result.extractedData.confidence,
  };
}
