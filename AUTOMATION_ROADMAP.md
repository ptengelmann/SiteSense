# End-to-End Automation Roadmap for SiteSense

## Current State vs. Full Automation

### Current Manual Steps:
1. ❌ Subcontractor emails invoice → Finance manager uploads PDF to SiteSense
2. ❌ AI extracts data → Finance manager reviews and approves
3. ❌ Approved invoices pile up → Finance manager creates payment run manually
4. ❌ Export BACS file → Finance manager uploads to bank portal
5. ❌ Bank processes payments → Finance manager marks as paid in SiteSense
6. ❌ Generate CIS report → Finance manager uploads to HMRC portal

### Fully Automated Vision:
1. ✅ Email arrives → Auto-imported, AI-processed, low-risk auto-approved
2. ✅ Every Friday 5pm → Auto-create payment run with all approved invoices
3. ✅ Payment run created → Auto-submit to bank via Open Banking API
4. ✅ Bank confirms payment → Auto-mark invoices as paid via webhook
5. ✅ End of month → Auto-generate and submit CIS return to HMRC
6. ✅ Compliance expiring → Auto-send email alerts to subcontractors

---

## 🎯 Automation Components (Ranked by Difficulty)

### ✅ EASY WINS (1-4 weeks each)

#### 1. **Email-to-Invoice Auto-Import** ⭐ HIGH IMPACT
**Complexity:** Low-Medium
**Time:** 2-3 weeks
**Cost:** $0-50/month

**How it works:**
```
Subcontractor sends invoice to: invoices@yourcompany.sitesense.com
     ↓
Email service (Mailgun/SendGrid/AWS SES) receives email
     ↓
Webhook triggers SiteSense API
     ↓
Extract PDF attachment
     ↓
Auto-run AI OCR
     ↓
Create invoice in SUBMITTED status
     ↓
Send notification to finance manager: "New invoice needs review"
```

**Technical Implementation:**
```typescript
// 1. Set up email receiving endpoint
// POST /api/webhooks/email-invoice
export async function POST(request: Request) {
  const emailData = await request.json();

  // Extract PDF attachment
  const pdfBuffer = Buffer.from(emailData.attachment, 'base64');

  // Upload to storage (S3/Cloudflare R2)
  const fileUrl = await uploadFile(pdfBuffer, 'invoices/');

  // Trigger AI analysis
  const aiResult = await analyzeInvoiceWithAI(fileUrl);

  // Create invoice (SUBMITTED status)
  const invoice = await db.invoice.create({
    data: {
      invoiceNumber: aiResult.invoiceNumber,
      amount: aiResult.amount,
      // ... extracted data
      status: 'SUBMITTED',
      aiAnalysis: aiResult.fraudCheck,
      riskScore: aiResult.riskScore,
    },
  });

  // Notify finance team
  await sendEmailNotification({
    to: 'finance@company.com',
    subject: `New invoice: ${invoice.invoiceNumber}`,
    body: `Risk: ${invoice.riskScore}/100. Review at: ${appUrl}/invoices/${invoice.id}`,
  });

  return NextResponse.json({ success: true });
}
```

**Services to use:**
- **Mailgun** (best): $0.80/1000 emails, dedicated invoice@ email
- **SendGrid** Inbound Parse: Free up to 100 emails/day
- **AWS SES**: $0.10/1000 emails

**Why easy:** Just webhook integration + existing AI OCR code.

---

#### 2. **Auto-Approve Low-Risk Invoices** ⭐ MEDIUM IMPACT
**Complexity:** Low
**Time:** 1 week
**Cost:** $0

**How it works:**
```
AI analyzes invoice → Risk score: 15/100 (LOW)
     ↓
Check rules:
  - Is risk score < 30? ✅
  - Is subcontractor trusted (>10 previous invoices)? ✅
  - Is amount < £5,000? ✅
  - Is invoice unique (not duplicate)? ✅
     ↓
Auto-approve: Status → APPROVED
     ↓
Log audit trail: "Auto-approved by AI (risk: 15/100)"
```

**Implementation:**
```typescript
// After AI analysis
if (aiResult.riskScore < 30 &&
    subcontractor.invoiceCount > 10 &&
    amount < 5000 &&
    !aiResult.isDuplicate) {

  await db.invoice.update({
    where: { id: invoice.id },
    data: {
      status: 'APPROVED',
      approvedBy: 'SYSTEM_AI',
      approvedAt: new Date(),
      auditLog: {
        create: {
          action: 'AUTO_APPROVED',
          reason: `Low risk (${aiResult.riskScore}/100), trusted subcontractor`,
        },
      },
    },
  });

  // Still notify, but as FYI
  await sendEmailNotification({
    to: 'finance@company.com',
    subject: `Auto-approved: ${invoice.invoiceNumber}`,
    body: `Low risk invoice auto-approved. Net payment: £${invoice.netPayment}`,
  });
}
```

**Risk mitigation:**
- Only auto-approve if risk score < 30
- Only auto-approve trusted subcontractors (>10 previous invoices)
- Set maximum auto-approve limit (e.g., £5,000)
- Always send notification (so finance can spot-check)
- Allow finance to override/reject later

---

#### 3. **Scheduled Payment Runs** ⭐ HIGH IMPACT
**Complexity:** Low
**Time:** 1 week
**Cost:** $0

**How it works:**
```
Every Friday at 5:00 PM (cron job):
     ↓
Find all APPROVED invoices (not yet in a payment run)
     ↓
Auto-create payment run:
  - Name: "Auto Payment Run - [Date]"
  - Scheduled date: Next Wednesday (5 business days)
  - Status: DRAFT
     ↓
Send notification: "Payment run created with 12 invoices (£45k net)"
     ↓
Finance manager reviews → Clicks "Mark as Ready" → Continues workflow
```

**Implementation:**
```typescript
// Using Vercel Cron or external service (cron-job.org)
// GET /api/cron/create-payment-run?secret=your_secret

export async function GET(request: Request) {
  // Security: check secret token
  if (request.headers.get('authorization') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For each company (multi-tenant)
  const companies = await db.company.findMany({
    where: { settings: { autoPaymentRuns: true } },
  });

  for (const company of companies) {
    // Find approved invoices
    const approvedInvoices = await db.invoice.findMany({
      where: {
        companyId: company.id,
        status: 'APPROVED',
        paymentRunId: null, // Not yet in a payment run
      },
    });

    if (approvedInvoices.length === 0) continue;

    // Calculate totals
    const totalAmount = approvedInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCis = approvedInvoices.reduce((sum, inv) => sum + inv.cisDeduction, 0);
    const netPayment = totalAmount - totalCis;

    // Create payment run
    const paymentRun = await db.paymentRun.create({
      data: {
        companyId: company.id,
        name: `Auto Payment Run - ${new Date().toLocaleDateString('en-GB')}`,
        scheduledDate: getNextBusinessDay(5), // 5 days from now
        status: 'DRAFT',
        totalAmount,
        totalCisDeduction: totalCis,
        netPayment,
        invoiceCount: approvedInvoices.length,
        invoices: {
          create: approvedInvoices.map(inv => ({
            invoiceId: inv.id,
          })),
        },
      },
    });

    // Notify finance team
    await sendEmailNotification({
      to: company.financeEmail,
      subject: `Payment Run Created: ${approvedInvoices.length} invoices (£${(netPayment/1000).toFixed(1)}k)`,
      body: `Review at: ${appUrl}/payment-runs/${paymentRun.id}`,
    });
  }

  return NextResponse.json({ success: true });
}
```

**Cron services:**
- **Vercel Cron**: Free, runs every minute/hour/day
- **cron-job.org**: Free, more reliable
- **AWS EventBridge**: $1/million events

---

### 🟡 MEDIUM DIFFICULTY (6-12 weeks each)

#### 4. **Open Banking API - Direct Payment Submission** ⭐ HIGHEST IMPACT
**Complexity:** Medium-High
**Time:** 8-12 weeks
**Cost:** £500-2,000 setup + £0.20-0.50 per payment

**How it works:**
```
Finance manager clicks "Submit to Bank" (instead of "Export BACS")
     ↓
SiteSense connects to bank via Open Banking API (PSD2)
     ↓
User authenticates with bank (one-time OAuth)
     ↓
SiteSense submits payment instructions:
  - Payee: ABC Electrical Ltd
  - Sort code: 12-34-56
  - Account: 12345678
  - Amount: £1,304
  - Reference: INV-2025-0042
     ↓
Bank processes payment (instant or next business day)
     ↓
Bank sends webhook → "Payment completed"
     ↓
SiteSense auto-marks invoice as PAID
```

**Technical Implementation:**

**Option A: Use Payment Initiation Service Provider (PISP)**

Popular UK PISPs:
- **TrueLayer** (best for UK): £0.25/payment, supports all major banks
- **Yapily**: £0.20/payment
- **Token.io**: £0.30/payment
- **Plaid** (US-focused but expanding to UK)

**Implementation with TrueLayer:**
```typescript
// 1. One-time bank connection
// GET /api/banking/connect
import { TrueLayerClient } from 'truelayer-client';

const client = new TrueLayerClient({
  client_id: process.env.TRUELAYER_CLIENT_ID,
  client_secret: process.env.TRUELAYER_CLIENT_SECRET,
});

export async function GET() {
  // Generate OAuth link
  const authUrl = client.getAuthUrl({
    redirect_uri: `${appUrl}/api/banking/callback`,
    scope: 'payments',
  });

  return NextResponse.redirect(authUrl);
}

// 2. After user authenticates
// GET /api/banking/callback
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Exchange code for access token
  const tokens = await client.exchangeCodeForToken(code);

  // Store tokens in database (encrypted)
  await db.company.update({
    where: { id: session.user.companyId },
    data: {
      bankingProvider: 'truelayer',
      bankingAccessToken: encrypt(tokens.access_token),
      bankingRefreshToken: encrypt(tokens.refresh_token),
    },
  });

  return NextResponse.redirect('/dashboard/settings?banking=connected');
}

// 3. Submit payment
// POST /api/payment-runs/[id]/submit-to-bank
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const paymentRun = await db.paymentRun.findUnique({
    where: { id: params.id },
    include: { invoices: { include: { invoice: { include: { subcontractor: true } } } } },
  });

  const company = await db.company.findUnique({
    where: { id: session.user.companyId },
  });

  // Initialize TrueLayer with stored tokens
  const accessToken = decrypt(company.bankingAccessToken);

  // Create payment for each invoice
  for (const pi of paymentRun.invoices) {
    const invoice = pi.invoice;
    const sub = invoice.subcontractor;

    const payment = await client.createPayment({
      access_token: accessToken,
      amount: invoice.netPayment,
      currency: 'GBP',
      beneficiary: {
        type: 'sort_code_account_number',
        name: sub.bankAccountName || sub.companyName,
        sort_code: sub.bankSortCode.replace(/-/g, ''),
        account_number: sub.bankAccountNumber,
      },
      reference: `INV${invoice.invoiceNumber}`.substring(0, 18),
    });

    // Store payment ID for tracking
    await db.invoice.update({
      where: { id: invoice.id },
      data: {
        bankPaymentId: payment.id,
        status: 'PAYMENT_SUBMITTED',
      },
    });
  }

  // Mark payment run as submitted
  await db.paymentRun.update({
    where: { id: params.id },
    data: { status: 'SUBMITTED_TO_BANK', submittedAt: new Date() },
  });

  return NextResponse.json({ success: true, message: 'Payments submitted to bank' });
}

// 4. Handle bank webhooks (payment completed)
// POST /api/webhooks/banking
export async function POST(request: Request) {
  const event = await request.json();

  if (event.type === 'payment.executed') {
    const paymentId = event.payment_id;

    // Find invoice with this payment ID
    const invoice = await db.invoice.findFirst({
      where: { bankPaymentId: paymentId },
    });

    if (invoice) {
      // Mark as paid
      await db.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'PAID',
          paymentDate: new Date(),
        },
      });

      // Send confirmation email
      await sendEmailNotification({
        to: invoice.subcontractor.email,
        subject: `Payment Confirmed: £${invoice.netPayment}`,
        body: `Your payment for invoice ${invoice.invoiceNumber} has been processed.`,
      });
    }
  }

  return NextResponse.json({ success: true });
}
```

**Regulatory Considerations:**
- **FCA Authorization**: TrueLayer/Yapily are FCA-authorized (you don't need to be)
- **PSD2 Compliance**: These services handle compliance
- **Strong Customer Authentication (SCA)**: Required every 90 days (user re-authenticates)
- **Liability**: Bank is liable for fraudulent payments (not you)

**Cost breakdown:**
- **Setup**: £500-1,000 (developer time)
- **Per payment**: £0.20-0.50 (vs. £0.00 for BACS file)
- **Savings**: Eliminate 30 minutes of manual bank upload work per week

**Pros:**
- ✅ True end-to-end automation
- ✅ Payments execute instantly (or same-day)
- ✅ Auto-confirmation via webhooks
- ✅ No manual bank portal login

**Cons:**
- ❌ Users must re-authenticate every 90 days (SCA requirement)
- ❌ Cost per transaction (vs. free BACS)
- ❌ Not all banks fully support Open Banking yet
- ❌ Complex error handling (payment failures)

**Recommendation:** Build AFTER you have 20+ paying customers to justify cost.

---

#### 5. **HMRC CIS Gateway Integration** ⭐ HIGH IMPACT (UK-specific)
**Complexity:** High
**Time:** 8-12 weeks
**Cost:** £1,000-3,000 (HMRC Gateway vendor fees)

**How it works:**
```
End of month → Auto-generate CIS return
     ↓
System submits to HMRC via API:
  - Subcontractor UTRs
  - Gross payments
  - CIS deductions
     ↓
HMRC validates and accepts
     ↓
Confirmation received → "CIS return submitted successfully"
     ↓
Store submission reference for records
```

**Technical Options:**

**Option A: Use HMRC Gateway Vendor (Easiest)**
- **Capium** or **Taxfiler**: £10-30/submission
- They handle OAuth, XML formatting, error handling
- You just send JSON data via their API

**Option B: Direct HMRC API (Complex)**
- Register as HMRC software vendor
- Implement OAuth 2.0 (HMRC-specific flow)
- Generate XML in HMRC CIS format
- Handle HMRC validation errors
- Maintain when HMRC changes API (frequently)

**Recommendation:** Use a vendor (Capium) - HMRC APIs are notoriously painful.

**Implementation with Capium:**
```typescript
// POST /api/cis/submit-monthly-return
export async function POST(request: Request) {
  const { month, year } = await request.json();

  // Get all payments for this month
  const invoices = await db.invoice.findMany({
    where: {
      companyId: session.user.companyId,
      status: 'PAID',
      paymentDate: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
    include: { subcontractor: true },
  });

  // Group by subcontractor
  const cisSummary = invoices.reduce((acc, inv) => {
    const key = inv.subcontractorId;
    if (!acc[key]) {
      acc[key] = {
        utr: inv.subcontractor.utr,
        companyName: inv.subcontractor.companyName,
        totalGross: 0,
        totalDeduction: 0,
      };
    }
    acc[key].totalGross += inv.amount;
    acc[key].totalDeduction += inv.cisDeduction;
    return acc;
  }, {});

  // Submit to Capium API
  const capiumResponse = await fetch('https://api.capium.com/cis/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CAPIUM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tax_year: year,
      tax_month: month,
      contractor_utr: session.user.company.utr,
      subcontractors: Object.values(cisSummary),
    }),
  });

  const result = await capiumResponse.json();

  // Store submission record
  await db.cisReturn.create({
    data: {
      companyId: session.user.companyId,
      month,
      year,
      submissionDate: new Date(),
      hmrcReference: result.submission_id,
      status: result.status, // 'ACCEPTED' or 'REJECTED'
      totalGross: Object.values(cisSummary).reduce((sum, s) => sum + s.totalGross, 0),
      totalDeduction: Object.values(cisSummary).reduce((sum, s) => sum + s.totalDeduction, 0),
    },
  });

  return NextResponse.json({ success: true, reference: result.submission_id });
}
```

**Regulatory:**
- Must use HMRC-recognized software
- Contractor needs HMRC credentials (one-time OAuth)
- Submissions due by 19th of following month
- Penalties for late submission: £100-3,000

---

#### 6. **Xero/QuickBooks Two-Way Sync** ⭐ MEDIUM IMPACT
**Complexity:** Medium
**Time:** 6-8 weeks (each integration)
**Cost:** $0 (APIs are free)

**How it works:**
```
SiteSense creates invoice → Syncs to Xero
Xero records payment → Syncs back to SiteSense
Both systems stay in sync (two-way)
```

**Implementation:**
```typescript
// Xero OAuth setup
import { XeroClient } from 'xero-node';

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [`${appUrl}/api/integrations/xero/callback`],
  scopes: ['accounting.transactions'],
});

// After invoice approved in SiteSense
await createXeroInvoice(invoice);

async function createXeroInvoice(invoice: Invoice) {
  const xeroInvoice = {
    Type: 'ACCPAY', // Accounts Payable (bill)
    Contact: {
      Name: invoice.subcontractor.companyName,
    },
    LineItems: [
      {
        Description: 'Subcontractor work',
        Quantity: 1,
        UnitAmount: invoice.amount,
        AccountCode: '200', // Cost of Sales
      },
    ],
    Status: 'AUTHORISED',
    Reference: invoice.invoiceNumber,
  };

  const response = await xero.accountingApi.createInvoices({
    invoices: [xeroInvoice],
  });

  // Store Xero ID for sync
  await db.invoice.update({
    where: { id: invoice.id },
    data: { xeroInvoiceId: response.body.invoices[0].invoiceID },
  });
}
```

**Pros:**
- ✅ Eliminates double data entry
- ✅ Accountants can work in Xero, you work in SiteSense
- ✅ Automatic bank reconciliation

**Cons:**
- ❌ Complex mapping (Xero's data model ≠ yours)
- ❌ Error handling (what if sync fails?)
- ❌ Conflicts (what if someone edits in both systems?)

**Recommendation:** Build Xero first (more popular in UK), QuickBooks later.

---

### 🔴 HARD / RISKY (3-6 months each)

#### 7. **AI-Powered Email Parsing (Subcontractor Detection)**
**Complexity:** High
**Time:** 3-4 months

**Challenge:** When invoice email arrives, how do you know which subcontractor it's from?

**Current limitation:**
```
Email from: john@abcelectrical.com
Subject: Invoice INV-2025-0042
     ↓
System doesn't know if this is "ABC Electrical Ltd" or "ABC Electrical Services"
     ↓
Manual: User selects subcontractor from dropdown
```

**AI solution:**
```
Extract sender email → Check against subcontractor database
If no match → Use AI to parse email signature and compare company names
If still unsure → Ask user to confirm
```

---

#### 8. **Subcontractor Self-Service Portal**
**Complexity:** Medium
**Time:** 8 weeks

**How it works:**
```
Subcontractor logs in → Uploads invoice directly
     ↓
AI processes automatically
     ↓
Subcontractor sees: "Status: Approved, Payment scheduled: Oct 23"
     ↓
No more email back-and-forth
```

**Value:** Reduce finance team workload by 50%.

---

## 🏆 Recommended Implementation Order

### Phase 1: Quick Wins (3 months)
**Goal:** 70% automation with minimal risk

1. **Email-to-Invoice** (3 weeks) - Biggest time saver
2. **Scheduled Payment Runs** (1 week) - Remove weekly manual task
3. **Auto-Approve Low-Risk** (1 week) - Reduce review workload by 50%
4. **Email Notifications** (2 weeks) - Compliance alerts, payment confirmations

**Result:**
- Finance manager saves 4 hours/week
- Still reviews medium/high-risk invoices manually
- Still uploads BACS file to bank manually
- **Automation level: 70%**

---

### Phase 2: Bank Integration (6 months)
**Goal:** 90% automation, eliminate bank portal

5. **Open Banking API** (12 weeks) - Direct payment submission
6. **HMRC CIS Gateway** (12 weeks) - Auto-submit monthly returns

**Result:**
- Finance manager saves 8 hours/week
- Only reviews high-risk invoices manually
- No bank portal login needed
- **Automation level: 90%**

---

### Phase 3: Ecosystem Integration (9 months)
**Goal:** 95% automation, full ecosystem

7. **Xero Integration** (8 weeks)
8. **Subcontractor Portal** (8 weeks)
9. **AI Email Parsing** (12 weeks)

**Result:**
- Finance manager saves 10 hours/week
- Subcontractors submit directly
- Accountant works in Xero, data syncs automatically
- **Automation level: 95%**

---

## 💰 Cost-Benefit Analysis

### Phase 1 (Quick Wins)
**Investment:**
- Dev time: 7 weeks × £500/week = £3,500
- Email service: £20/month
- Total: **£3,740 (one-time) + £20/month**

**Savings:**
- 4 hours/week × £25/hour × 50 weeks = **£5,000/year**
- **ROI: 34% in year 1**

---

### Phase 2 (Bank Integration)
**Investment:**
- Dev time: 24 weeks × £500/week = £12,000
- TrueLayer setup: £500
- TrueLayer fees: 100 payments/month × £0.30 × 12 = £360/year
- Capium CIS: £20/month × 12 = £240/year
- Total: **£12,500 (one-time) + £600/year**

**Savings:**
- 8 hours/week × £25/hour × 50 weeks = **£10,000/year**
- **ROI: -20% in year 1, +60% in year 2**

---

### Phase 3 (Ecosystem)
**Investment:**
- Dev time: 28 weeks × £500/week = £14,000
- Total: **£14,000 (one-time)**

**Savings:**
- 10 hours/week × £25/hour × 50 weeks = **£12,500/year**
- **ROI: -11% in year 1, +89% in year 2**

---

## 🚦 Risk Assessment

### Low Risk ✅
- Email import
- Scheduled payment runs
- Email notifications
- CSV exports

### Medium Risk ⚠️
- Auto-approve (limit to £5k and trusted subs)
- Xero integration (data conflicts possible)
- Subcontractor portal (authentication security)

### High Risk 🔴
- Open Banking API (SCA re-auth friction, payment failures)
- HMRC CIS (penalties if submission fails)
- AI email parsing (false positives)

---

## 🎯 My Recommendation

**Start with Phase 1 (Quick Wins) immediately:**

1. **Week 1-3**: Email-to-invoice auto-import
2. **Week 4**: Scheduled payment runs
3. **Week 5**: Auto-approve low-risk invoices
4. **Week 6-7**: Email notifications (compliance alerts, payment confirmations)

**This gives you:**
- ✅ 70% automation with minimal risk
- ✅ £5,000/year savings for £3,740 investment
- ✅ Proven value before investing in harder integrations
- ✅ Beta customers see immediate value ("wow, this is magic!")

**Then decide Phase 2 after 20+ paying customers** (to justify Open Banking costs).

---

## 🛠️ Technical Stack for Automation

**Email Processing:**
- Mailgun Inbound Routes
- AWS S3 for PDF storage
- Existing Anthropic AI for OCR

**Scheduling:**
- Vercel Cron (free)
- Or cron-job.org (more reliable)

**Payments:**
- TrueLayer (UK Open Banking)
- Fallback: Manual BACS export

**CIS Submission:**
- Capium CIS API
- Fallback: Manual CSV upload to HMRC

**Notifications:**
- Resend (already integrated)

**Total monthly cost:** £20-100 (depending on volume)

---

## 📊 Benchmarking: What Competitors Do

### Xero
- ✅ Email-to-invoice (via Hubdoc add-on)
- ❌ No AI fraud detection
- ✅ Bank feed auto-reconciliation
- ❌ No CIS-specific features

### Procore (Construction ERP)
- ✅ Subcontractor portal
- ❌ No AI invoice OCR
- ✅ Bank integration
- ❌ No CIS compliance

### **Your Competitive Advantage:**
- AI fraud detection (unique)
- UK CIS compliance (niche)
- Affordable for SMEs (£99-299 vs. £500+)

---

## Next Steps

1. **Implement Phase 1** (7 weeks, £3,500)
2. Get 10 beta customers using it
3. Measure time savings (survey: "How many hours/week saved?")
4. If average savings > 5 hours/week → Proceed to Phase 2
5. If average savings < 3 hours/week → Fix UX issues first

**Want me to start building Phase 1 automation now?** I can implement email-to-invoice in the next session.
