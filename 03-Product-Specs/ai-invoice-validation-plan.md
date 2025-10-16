# AI Invoice Validation System - Detailed Plan

## Overview

The AI Invoice Validation system is SiteSense's killer feature that automatically validates subcontractor invoices for duplicates, pricing anomalies, compliance issues, and completeness. This saves 5-10 hours/week of admin time and reduces payment errors by 80%+.

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     Invoice Submitted                          │
│              (PDF/Image + Metadata)                            │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  STAGE 1: Document Processing                   │
│  ┌─────────────┐                           ┌────────────────┐  │
│  │ File Upload │──────────────────────────▶│ Virus Scan     │  │
│  └─────────────┘                           │ (ClamAV)       │  │
│                                             └────────┬───────┘  │
│                                                      │          │
│                           ┌──────────────────────────┘          │
│                           ▼                                     │
│                    ┌──────────────┐                             │
│                    │ PDF→Image    │                             │
│                    │ Conversion   │                             │
│                    └──────┬───────┘                             │
│                           │                                     │
│                           ▼                                     │
│                    ┌──────────────┐                             │
│                    │ Store in S3  │                             │
│                    └──────┬───────┘                             │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  STAGE 2: Data Extraction (OCR)                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ GPT-4 Vision API                                       │    │
│  │ ┌────────────────────────────────────────────┐        │    │
│  │ │ Prompt:                                    │        │    │
│  │ │ "Extract: invoice #, date, amount, UTR,   │        │    │
│  │ │  description, CIS deduction"               │        │    │
│  │ └────────────────────────────────────────────┘        │    │
│  │                                                        │    │
│  │ Returns: JSON with extracted fields + confidence      │    │
│  └────────────────────────────┬───────────────────────────┘    │
│                               │                                │
│                               ▼                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Confidence Check                                       │   │
│  │ - If any field <80% confidence → flag for review      │   │
│  │ - Store extracted data in database                    │   │
│  └────────────────────────────┬───────────────────────────┘   │
└────────────────────────────────┬───────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│           STAGE 3: Validation Checks (Parallel Execution)       │
│                                                                 │
│  ┌───────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ Duplicate     │  │ Pricing      │  │ CIS Compliance     │  │
│  │ Detection     │  │ Anomaly      │  │ Check              │  │
│  │               │  │ Detection    │  │                    │  │
│  │ (Pinecone)    │  │ (ML Model)   │  │ (Rule-based)       │  │
│  └───────┬───────┘  └──────┬───────┘  └─────────┬──────────┘  │
│          │                 │                     │             │
│          │                 │                     │             │
│  ┌───────▼─────────────────▼─────────────────────▼──────────┐ │
│  │        Document Completeness + PO Matching               │ │
│  │              (Rule-based + GPT-4)                        │ │
│  └───────┬──────────────────────────────────────────────────┘ │
│          │                                                     │
│          ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Aggregate Results                                       │  │
│  │ - Collect all check results                            │  │
│  │ - Calculate risk points                                │  │
│  └───────┬─────────────────────────────────────────────────┘  │
└──────────┬──────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│              STAGE 4: Risk Scoring & Recommendation             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Risk Scoring Engine                                     │   │
│  │ - Sum weighted points from all checks                   │   │
│  │ - Classify: Low (0-20), Medium (21-50), High (51+)     │   │
│  │ - Generate recommendation and action items             │   │
│  └───────┬─────────────────────────────────────────────────┘   │
│          │                                                     │
│          ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Store Validation Result                                 │  │
│  │ - Update invoice.validation_status                      │  │
│  │ - Store full result JSON                                │  │
│  │ - Create audit log entry                                │  │
│  └───────┬─────────────────────────────────────────────────┘  │
└──────────┬──────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                 STAGE 5: User Notification                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ - Send notification to admin (email + in-app)           │   │
│  │ - Send status update to subcontractor                   │   │
│  │ - Display validation results in dashboard               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 1: Document Processing

### File Upload & Validation

**Accepted Formats**:
- PDF (max 10MB)
- JPEG/JPG (max 10MB)
- PNG (max 10MB)

**Validation Steps**:
1. Check file size (<10MB)
2. Verify MIME type
3. Virus scan (ClamAV or VirusTotal API)
4. Generate unique filename: `{invoiceId}_{timestamp}_{original}.pdf`

**Storage**:
- Upload to Supabase Storage (or AWS S3)
- Set metadata: invoice_id, uploaded_by, upload_date
- Generate signed URL (1-hour expiry for access)

**PDF Processing**:
- If PDF: Extract first page as image (use pdf-lib or pdf2pic)
- Convert to JPEG at 300 DPI
- Store both original PDF and extracted image

**Code Structure**:
```typescript
// /lib/storage/uploadInvoice.ts
export async function uploadInvoiceDocument(
  file: File,
  invoiceId: string,
  userId: string
): Promise<{ fileUrl: string; imageUrl?: string }> {
  // 1. Validate file
  await validateFile(file);

  // 2. Virus scan
  await scanForViruses(file);

  // 3. Upload to storage
  const fileUrl = await uploadToStorage(file, invoiceId);

  // 4. If PDF, extract image
  let imageUrl = fileUrl;
  if (file.type === 'application/pdf') {
    imageUrl = await convertPdfToImage(fileUrl);
  }

  // 5. Store in database
  await createInvoiceDocument({
    invoiceId,
    fileUrl,
    imageUrl,
    uploadedBy: userId
  });

  return { fileUrl, imageUrl };
}
```

---

## Stage 2: Data Extraction (OCR)

### GPT-4 Vision Integration

**API Call**:
```typescript
// /lib/ai/extractInvoiceData.ts
import OpenAI from 'openai';

export async function extractInvoiceData(imageUrl: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Extract the following information from this construction invoice and return as JSON:

{
  "invoiceNumber": "string",
  "invoiceDate": "DD/MM/YYYY",
  "amount": "number (total amount including VAT)",
  "amountExcludingVAT": "number (if shown separately)",
  "vatAmount": "number (if shown)",
  "subcontractorName": "string",
  "subcontractorUTR": "string (10 digits, if visible)",
  "workDescription": "string (brief summary)",
  "cisDeduction": "number (if noted on invoice)",
  "projectReference": "string (if visible)",
  "paymentTerms": "string (if visible)"
}

For each field, also return a confidence score (0-1).
If a field is not found or unclear, set value to null and confidence to 0.

Return ONLY valid JSON, no additional text.`
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ],
    max_tokens: 1000,
    temperature: 0.1 // Low temperature for consistency
  });

  const content = response.choices[0].message.content;
  const extracted = JSON.parse(content);

  // Validate structure
  return validateExtractedData(extracted);
}

interface ExtractedInvoiceData {
  invoiceNumber: { value: string | null; confidence: number };
  invoiceDate: { value: string | null; confidence: number };
  amount: { value: number | null; confidence: number };
  amountExcludingVAT: { value: number | null; confidence: number };
  vatAmount: { value: number | null; confidence: number };
  subcontractorName: { value: string | null; confidence: number };
  subcontractorUTR: { value: string | null; confidence: number };
  workDescription: { value: string | null; confidence: number };
  cisDeduction: { value: number | null; confidence: number };
  projectReference: { value: string | null; confidence: number };
  paymentTerms: { value: string | null; confidence: number };
}
```

### Confidence Thresholds

**Field-specific thresholds**:
- Invoice number: 80% (critical)
- Invoice date: 80% (critical)
- Amount: 90% (critical)
- UTR: 75% (can verify separately)
- Description: 70% (less critical)

**Handling Low Confidence**:
```typescript
function checkConfidence(extracted: ExtractedInvoiceData): {
  needsReview: boolean;
  flaggedFields: string[];
} {
  const flagged: string[] = [];

  if (extracted.invoiceNumber.confidence < 0.8) flagged.push('Invoice Number');
  if (extracted.invoiceDate.confidence < 0.8) flagged.push('Invoice Date');
  if (extracted.amount.confidence < 0.9) flagged.push('Amount');

  return {
    needsReview: flagged.length > 0,
    flaggedFields: flagged
  };
}
```

### Retry Logic

If OCR fails or confidence too low:
1. Try preprocessing image (sharpen, contrast)
2. Retry GPT-4 Vision with adjusted prompt
3. If still fails, flag for manual entry

---

## Stage 3: Validation Checks

### Check 1: Duplicate Detection

**Technology**: Pinecone vector database

**Implementation**:
```typescript
// /lib/ai/duplicateDetection.ts
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index('invoice-vectors');
const openai = new OpenAI();

export async function checkForDuplicates(invoice: {
  invoiceNumber: string;
  amount: number;
  invoiceDate: string;
  subcontractorId: string;
}) {
  // 1. Generate embedding
  const text = `Invoice: ${invoice.invoiceNumber}, Amount: £${invoice.amount}, Date: ${invoice.invoiceDate}, Subcontractor: ${invoice.subcontractorId}`;

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });

  const vector = embedding.data[0].embedding;

  // 2. Query Pinecone for similar vectors
  const queryResponse = await index.query({
    vector,
    topK: 5,
    includeMetadata: true,
    filter: {
      subcontractorId: invoice.subcontractorId // Only check same subcontractor
    }
  });

  // 3. Check similarity threshold
  const matches = queryResponse.matches || [];
  const duplicates = matches.filter(match => match.score > 0.95);

  if (duplicates.length > 0) {
    return {
      passed: false,
      confidence: duplicates[0].score,
      details: `Potential duplicate of invoice ${duplicates[0].metadata?.invoiceNumber}`,
      matchedInvoiceId: duplicates[0].id,
      points: 40
    };
  }

  // 4. Store this invoice's embedding for future checks
  await index.upsert([{
    id: invoice.id,
    values: vector,
    metadata: {
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      invoiceDate: invoice.invoiceDate,
      subcontractorId: invoice.subcontractorId
    }
  }]);

  return {
    passed: true,
    confidence: 1.0,
    details: 'No duplicates found',
    points: 0
  };
}
```

### Check 2: Pricing Anomaly Detection

**Technology**: Statistical analysis + scikit-learn Isolation Forest

**Phase 1 (MVP)**: Rule-based statistical checks
```typescript
// /lib/ai/pricingAnomalyDetection.ts
export async function checkPricingAnomaly(invoice: {
  subcontractorId: string;
  amount: number;
  projectId: string | null;
}) {
  // 1. Fetch historical invoices for this subcontractor (last 12 months)
  const historicalInvoices = await db.invoice.findMany({
    where: {
      subcontractorId: invoice.subcontractorId,
      status: { in: ['approved', 'paid'] },
      invoiceDate: {
        gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      }
    },
    select: { amount: true }
  });

  if (historicalInvoices.length < 3) {
    // Not enough data to determine anomaly
    return {
      passed: true,
      confidence: 0.5,
      details: 'Insufficient historical data for comparison',
      points: 0
    };
  }

  // 2. Calculate statistics
  const amounts = historicalInvoices.map(inv => inv.amount);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const stdDev = Math.sqrt(
    amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length
  );

  // 3. Check if invoice is outlier (>2 std dev or >50% above mean)
  const zScore = (invoice.amount - mean) / stdDev;
  const percentAboveMean = ((invoice.amount - mean) / mean) * 100;

  if (zScore > 2 || percentAboveMean > 50) {
    let points = 0;
    if (percentAboveMean > 50) points = 30;
    else if (percentAboveMean > 20) points = 15;

    return {
      passed: false,
      confidence: 0.85,
      details: `Invoice amount is ${percentAboveMean.toFixed(0)}% higher than historical average (£${mean.toFixed(2)})`,
      points,
      statistics: {
        mean,
        stdDev,
        zScore,
        percentAboveMean
      }
    };
  }

  // 4. If project budget exists, check against remaining budget
  if (invoice.projectId) {
    const project = await db.project.findUnique({
      where: { id: invoice.projectId },
      include: {
        invoices: {
          where: { status: { in: ['approved', 'paid'] } },
          select: { amount: true }
        }
      }
    });

    if (project?.budget) {
      const spent = project.invoices.reduce((sum, inv) => sum + inv.amount, 0);
      const remaining = project.budget - spent;

      if (invoice.amount > remaining) {
        return {
          passed: false,
          confidence: 1.0,
          details: `Invoice amount (£${invoice.amount}) exceeds remaining project budget (£${remaining})`,
          points: 15
        };
      }
    }
  }

  return {
    passed: true,
    confidence: 1.0,
    details: 'Invoice amount within normal range',
    points: 0
  };
}
```

**Phase 2 (Post-MVP)**: ML-based anomaly detection
```python
# /ai-services/pricing_anomaly_model.py
from sklearn.ensemble import IsolationForest
import pandas as pd

def train_anomaly_detector(historical_data):
    """
    Train isolation forest on customer's historical invoice data
    Features: amount, day_of_week, days_since_last_invoice, project_stage
    """
    df = pd.DataFrame(historical_data)

    features = df[['amount', 'day_of_week', 'days_since_last_invoice', 'project_stage_encoded']]

    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(features)

    return model

def predict_anomaly(model, new_invoice):
    """
    Returns: -1 for anomaly, 1 for normal
    """
    features = extract_features(new_invoice)
    prediction = model.predict([features])[0]
    anomaly_score = model.score_samples([features])[0]

    return {
        'is_anomaly': prediction == -1,
        'anomaly_score': anomaly_score,
        'confidence': abs(anomaly_score)
    }
```

### Check 3: CIS Compliance

**Technology**: Rule-based validation

```typescript
// /lib/ai/cisComplianceCheck.ts
export async function checkCISCompliance(invoice: {
  subcontractorId: string;
  amount: number;
  cisDeduction: number | null;
}) {
  const points: number[] = [];
  const issues: string[] = [];

  // 1. Fetch subcontractor CIS status
  const subcontractor = await db.subcontractor.findUnique({
    where: { id: invoice.subcontractorId },
    select: {
      cisStatus: true,
      cisVerifiedAt: true,
      cisVerificationExpiresAt: true,
      utr: true
    }
  });

  if (!subcontractor) {
    return {
      passed: false,
      confidence: 1.0,
      details: 'Subcontractor not found',
      points: 40
    };
  }

  // 2. Check if CIS verification is current
  const now = new Date();
  if (!subcontractor.cisVerifiedAt) {
    issues.push('Subcontractor has never been CIS verified');
    points.push(40);
  } else if (subcontractor.cisVerificationExpiresAt && subcontractor.cisVerificationExpiresAt < now) {
    issues.push(`CIS verification expired on ${subcontractor.cisVerificationExpiresAt.toLocaleDateString()}`);
    points.push(40);
  }

  // 3. Check if invoice exceeds £1,000 threshold (requires verification)
  if (invoice.amount >= 1000 && !subcontractor.cisVerifiedAt) {
    issues.push('Invoice exceeds £1,000 threshold but subcontractor not verified');
    points.push(40);
  }

  // 4. Validate CIS deduction rate
  if (invoice.cisDeduction) {
    const expectedDeduction = calculateCISDeduction(
      invoice.amount,
      subcontractor.cisStatus
    );

    const deductionDiff = Math.abs(invoice.cisDeduction - expectedDeduction);
    if (deductionDiff > 1) { // Allow £1 rounding difference
      issues.push(
        `CIS deduction (£${invoice.cisDeduction}) does not match expected rate for ${subcontractor.cisStatus} status (£${expectedDeduction})`
      );
      points.push(20);
    }
  } else if (subcontractor.cisStatus !== 'gross') {
    // CIS deduction should be applied but wasn't
    issues.push('CIS deduction not specified but subcontractor is not on gross payment status');
    points.push(20);
  }

  // 5. Validate UTR format
  if (subcontractor.utr && !/^\d{10}$/.test(subcontractor.utr)) {
    issues.push('Subcontractor UTR is not in valid format (10 digits)');
    points.push(10);
  }

  const totalPoints = points.reduce((sum, p) => sum + p, 0);

  if (issues.length > 0) {
    return {
      passed: false,
      confidence: 1.0,
      details: issues.join('; '),
      points: totalPoints,
      issues
    };
  }

  return {
    passed: true,
    confidence: 1.0,
    details: 'All CIS compliance checks passed',
    points: 0
  };
}

function calculateCISDeduction(amount: number, cisStatus: string): number {
  switch (cisStatus) {
    case 'gross':
      return 0;
    case 'standard':
      return amount * 0.20; // 20%
    case 'higher':
      return amount * 0.30; // 30%
    default:
      return amount * 0.30; // Default to highest rate if not verified
  }
}
```

### Check 4: Document Completeness

**Technology**: Rule-based validation

```typescript
// /lib/ai/documentCompletenessCheck.ts
export async function checkDocumentCompleteness(invoiceId: string) {
  const issues: string[] = [];
  const points: number[] = [];

  // 1. Fetch invoice and related documents
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      documents: true,
      subcontractor: true
    }
  });

  if (!invoice) {
    return {
      passed: false,
      confidence: 1.0,
      details: 'Invoice not found',
      points: 20
    };
  }

  // 2. Check if invoice file exists
  const invoiceDoc = invoice.documents.find(d => d.documentType === 'invoice');
  if (!invoiceDoc) {
    issues.push('Invoice document not uploaded');
    points.push(20);
  }

  // 3. Check for timesheet (required for invoices >£5,000)
  if (invoice.amount > 5000) {
    const timesheetDoc = invoice.documents.find(d => d.documentType === 'timesheet');
    if (!timesheetDoc) {
      issues.push('Timesheet required for invoices over £5,000');
      points.push(15);
    }
  }

  // 4. Check for work photos (recommended for site work)
  const photoCount = invoice.documents.filter(d => d.documentType === 'photo').length;
  if (photoCount === 0) {
    issues.push('No work photos attached (recommended for verification)');
    points.push(5);
  }

  // 5. Check subcontractor documents (first-time invoice)
  const invoiceCount = await db.invoice.count({
    where: {
      subcontractorId: invoice.subcontractorId,
      status: { in: ['approved', 'paid'] }
    }
  });

  if (invoiceCount === 0) {
    // First invoice from this subcontractor
    if (!invoice.subcontractor.insuranceDocumentUrl) {
      issues.push('Insurance certificate not uploaded for new subcontractor');
      points.push(20);
    }

    const insuranceExpiry = invoice.subcontractor.insuranceExpiresAt;
    if (insuranceExpiry && insuranceExpiry < new Date()) {
      issues.push(`Insurance certificate expired on ${insuranceExpiry.toLocaleDateString()}`);
      points.push(20);
    }
  }

  const totalPoints = points.reduce((sum, p) => sum + p, 0);

  if (issues.length > 0) {
    return {
      passed: false,
      confidence: 1.0,
      details: issues.join('; '),
      points: totalPoints,
      issues,
      missingDocuments: issues
    };
  }

  return {
    passed: true,
    confidence: 1.0,
    details: 'All required documents present',
    points: 0
  };
}
```

### Check 5: Purchase Order Matching (Optional)

**Technology**: GPT-4 for semantic comparison

```typescript
// /lib/ai/poMatching.ts
export async function checkPOMatch(invoice: {
  projectId: string;
  subcontractorId: string;
  amount: number;
  description: string;
}) {
  // 1. Find relevant PO
  const po = await db.purchaseOrder.findFirst({
    where: {
      projectId: invoice.projectId,
      subcontractorId: invoice.subcontractorId,
      status: 'active'
    }
  });

  if (!po) {
    // No PO required
    return {
      passed: true,
      confidence: 1.0,
      details: 'No purchase order on file',
      points: 0
    };
  }

  const issues: string[] = [];
  const points: number[] = [];

  // 2. Check amount against PO
  if (invoice.amount > po.value) {
    issues.push(`Invoice amount (£${invoice.amount}) exceeds PO value (£${po.value})`);
    points.push(15);
  }

  // 3. Check description match using GPT-4
  const scopeMatch = await compareDescriptions(
    po.description,
    invoice.description
  );

  if (scopeMatch.similarity < 0.7) {
    issues.push(`Work description may not match PO scope (${Math.round(scopeMatch.similarity * 100)}% match)`);
    points.push(10);
  }

  const totalPoints = points.reduce((sum, p) => sum + p, 0);

  if (issues.length > 0) {
    return {
      passed: false,
      confidence: scopeMatch.confidence,
      details: issues.join('; '),
      points: totalPoints,
      issues,
      poReference: po.number
    };
  }

  return {
    passed: true,
    confidence: 1.0,
    details: 'Invoice matches purchase order',
    points: 0,
    poReference: po.number
  };
}

async function compareDescriptions(poDescription: string, invoiceDescription: string) {
  const openai = new OpenAI();

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are comparing a purchase order description with an invoice description. Return a JSON object with 'similarity' (0-1) and 'explanation'."
      },
      {
        role: "user",
        content: `Purchase Order: "${poDescription}"\n\nInvoice Description: "${invoiceDescription}"\n\nDo these describe the same work? Return JSON only.`
      }
    ],
    temperature: 0.3
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');

  return {
    similarity: result.similarity || 0,
    explanation: result.explanation || 'Unable to compare',
    confidence: 0.85
  };
}
```

---

## Stage 4: Risk Scoring & Recommendation

### Risk Scoring Engine

```typescript
// /lib/ai/riskScoring.ts
export interface ValidationResult {
  duplicateCheck: CheckResult;
  pricingAnomalyCheck: CheckResult;
  cisComplianceCheck: CheckResult;
  documentCompletenessCheck: CheckResult;
  poMatchCheck?: CheckResult;
}

export interface CheckResult {
  passed: boolean;
  confidence: number;
  details: string;
  points: number;
  issues?: string[];
}

export function calculateRiskScore(results: ValidationResult) {
  // 1. Sum all points
  const totalPoints =
    results.duplicateCheck.points +
    results.pricingAnomalyCheck.points +
    results.cisComplianceCheck.points +
    results.documentCompletenessCheck.points +
    (results.poMatchCheck?.points || 0);

  // 2. Determine risk level
  let riskLevel: 'low' | 'medium' | 'high';
  if (totalPoints <= 20) {
    riskLevel = 'low';
  } else if (totalPoints <= 50) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }

  // 3. Generate recommendation
  const recommendation = generateRecommendation(riskLevel, results);

  // 4. Generate suggested actions
  const suggestedActions = generateSuggestedActions(results);

  return {
    riskScore: totalPoints,
    riskLevel,
    checks: results,
    recommendation,
    suggestedActions,
    autoApproveEligible: riskLevel === 'low'
  };
}

function generateRecommendation(
  riskLevel: string,
  results: ValidationResult
): string {
  if (riskLevel === 'low') {
    return 'All validation checks passed. Invoice is safe to approve.';
  } else if (riskLevel === 'medium') {
    return 'Some issues detected. Review recommended before approval.';
  } else {
    return 'Critical issues detected. Manual review required before approval.';
  }
}

function generateSuggestedActions(results: ValidationResult): string[] {
  const actions: string[] = [];

  if (!results.duplicateCheck.passed) {
    actions.push('Verify this is not a duplicate invoice with the subcontractor');
  }

  if (!results.pricingAnomalyCheck.passed) {
    actions.push('Confirm the invoice amount with the subcontractor');
    actions.push('Review the work scope to justify the higher-than-usual amount');
  }

  if (!results.cisComplianceCheck.passed) {
    if (results.cisComplianceCheck.issues?.some(i => i.includes('expired'))) {
      actions.push('Re-verify subcontractor CIS status with HMRC before payment');
    }
    if (results.cisComplianceCheck.issues?.some(i => i.includes('deduction'))) {
      actions.push('Correct the CIS deduction amount before approval');
    }
  }

  if (!results.documentCompletenessCheck.passed) {
    const missing = results.documentCompletenessCheck.issues || [];
    missing.forEach(issue => {
      actions.push(`Request ${issue.toLowerCase()} from subcontractor`);
    });
  }

  if (results.poMatchCheck && !results.poMatchCheck.passed) {
    actions.push('Verify the work performed matches the purchase order scope');
  }

  return actions;
}
```

---

## Stage 5: User Notification & Display

### Validation Result UI

**Admin Dashboard - Invoice List**:
```
┌──────────────────────────────────────────────────────────────┐
│ Invoice #     Subcontractor    Amount    Status    Risk      │
├──────────────────────────────────────────────────────────────┤
│ INV-2024-123  John's Electric  £2,450    Review    🟢 Low    │
│ INV-2024-124  ABC Plumbing     £8,920    Review    🟡 Medium │
│ INV-2024-125  Smith Roofing    £15,200   Review    🔴 High   │
└──────────────────────────────────────────────────────────────┘
```

**Invoice Detail View**:
```
┌────────────────────────────────────────────────────────────────┐
│ Invoice INV-2024-125                        Risk Score: 65/100 │
│ Smith Roofing Ltd                           Risk Level: 🔴 High │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ AI Validation Results                                          │
│                                                                │
│ ✓ Duplicate Check         PASSED                              │
│   No duplicate invoices found                                  │
│                                                                │
│ ✓ Pricing Anomaly         PASSED                              │
│   Invoice amount within normal range                           │
│                                                                │
│ ✗ CIS Compliance          FAILED (+40 points)                 │
│   • CIS verification expired on 01/10/2025                    │
│   → Action: Re-verify subcontractor with HMRC                 │
│                                                                │
│ ⚠ Document Completeness   REVIEW REQUIRED (+15 points)       │
│   • Timesheet required for invoices over £5,000               │
│   → Action: Request timesheet from subcontractor              │
│                                                                │
│ ⚠ PO Matching            REVIEW REQUIRED (+10 points)        │
│   • Invoice exceeds PO value by £1,200                        │
│   → Action: Verify additional work was authorized             │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│ Recommendation:                                                │
│ Critical issues detected. Manual review required.              │
│                                                                │
│ [Request Missing Documents]  [Reject Invoice]  [Override & Approve] │
└────────────────────────────────────────────────────────────────┘
```

### Notification System

**Real-time Notifications**:
```typescript
// Send notification when validation completes
await sendNotification({
  userId: invoice.companyAdminId,
  type: 'invoice_validation_complete',
  title: `Invoice ${invoice.invoiceNumber} validated`,
  message: `Risk level: ${validationResult.riskLevel}`,
  link: `/invoices/${invoice.id}`,
  priority: validationResult.riskLevel === 'high' ? 'high' : 'normal'
});

// Send email for high-risk invoices
if (validationResult.riskLevel === 'high') {
  await sendEmail({
    to: adminEmail,
    subject: `High-risk invoice requires review - ${invoice.invoiceNumber}`,
    template: 'high-risk-invoice',
    data: {
      invoiceNumber: invoice.invoiceNumber,
      subcontractorName: invoice.subcontractor.name,
      amount: invoice.amount,
      issues: validationResult.suggestedActions,
      link: `${process.env.APP_URL}/invoices/${invoice.id}`
    }
  });
}
```

---

## Performance Optimization

### Parallel Execution

All validation checks run in parallel:
```typescript
export async function validateInvoice(invoiceId: string) {
  const invoice = await fetchInvoiceData(invoiceId);

  // Run all checks in parallel
  const [
    duplicateCheck,
    pricingAnomalyCheck,
    cisComplianceCheck,
    documentCompletenessCheck,
    poMatchCheck
  ] = await Promise.all([
    checkForDuplicates(invoice),
    checkPricingAnomaly(invoice),
    checkCISCompliance(invoice),
    checkDocumentCompleteness(invoiceId),
    invoice.projectId ? checkPOMatch(invoice) : Promise.resolve(null)
  ]);

  // Calculate risk score
  const riskScore = calculateRiskScore({
    duplicateCheck,
    pricingAnomalyCheck,
    cisComplianceCheck,
    documentCompletenessCheck,
    poMatchCheck
  });

  // Store result
  await db.invoice.update({
    where: { id: invoiceId },
    data: {
      validationStatus: riskScore.riskLevel === 'low' ? 'passed' : 'review_required',
      validationRiskScore: riskScore.riskLevel,
      validationResult: riskScore
    }
  });

  return riskScore;
}
```

### Caching

```typescript
// Cache CIS verifications for 24 hours
async function getCISVerification(subcontractorId: string) {
  const cacheKey = `cis:${subcontractorId}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const verification = await db.subcontractor.findUnique({
    where: { id: subcontractorId },
    select: { cisStatus: true, cisVerifiedAt: true, cisVerificationExpiresAt: true }
  });

  await redis.setex(cacheKey, 86400, JSON.stringify(verification)); // 24 hours

  return verification;
}
```

---

## Cost Estimation

**Per Invoice Validation**:
- GPT-4 Vision (OCR): ~$0.02
- GPT-4 (PO matching if used): ~$0.01
- OpenAI Embeddings (duplicate check): ~$0.0001
- Pinecone query: ~$0.001
- Total: ~$0.03 per invoice

**Monthly Costs** (example scenarios):
- 100 invoices/month: $3
- 500 invoices/month: $15
- 1,000 invoices/month: $30
- 5,000 invoices/month: $150

**Compared to Manual Processing**:
- Admin time saved: 5-10 min per invoice
- At £15/hour admin rate: ~£2.50 saved per invoice
- ROI: 80x return on AI cost

---

## Testing Strategy

### Unit Tests
- Test each validation check independently
- Mock API calls (OpenAI, Pinecone)
- Test edge cases (missing data, extreme values)

### Integration Tests
- Test full validation pipeline
- Use real test invoices (anonymized)
- Verify accuracy against known results

### Accuracy Metrics
- **Duplicate Detection**: Target 95%+ precision, 90%+ recall
- **Pricing Anomaly**: Target 85%+ precision (minimize false positives)
- **CIS Compliance**: Target 100% accuracy (rule-based)
- **Overall Risk Score**: Validate against 100+ real invoices

---

## Rollout Plan

### Phase 1: Beta Testing (Week 1-2)
- Enable for 3-5 pilot customers
- Manual review of ALL AI validations
- Collect feedback on accuracy
- Tune thresholds based on real data

### Phase 2: Assisted Mode (Week 3-4)
- Roll out to all customers
- AI recommendations shown, but require manual approval
- Track override rate (how often admins override AI)
- Continue tuning

### Phase 3: Auto-Approve Low Risk (Week 5+)
- Enable auto-approval for low-risk invoices (with opt-in)
- Monitor for any missed issues
- Provide "undo" function if auto-approved incorrectly

---

## Future Enhancements (Post-MVP)

1. **Learning from Overrides**: ML model learns when admins override AI decisions
2. **Custom Rules**: Allow customers to set custom validation rules
3. **Batch Processing**: Validate multiple invoices at once
4. **Historical Analysis**: Show trends in invoice patterns over time
5. **Predictive Alerts**: Warn before issues occur (e.g., "Subcontractor CIS expires in 7 days")

---

Ready to implement this system?
