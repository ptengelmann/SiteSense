# SiteSense: Value Proposition & User Workflow Guide

## Executive Summary

**What is SiteSense?**
SiteSense is a construction-focused **invoice management and subcontractor compliance platform** specifically designed for UK main contractors who work with multiple subcontractors under the Construction Industry Scheme (CIS).

**The Core Problem We Solve:**
UK main contractors waste 5-10 hours per week manually processing invoices, calculating CIS deductions, tracking subcontractor compliance documents (CIS certificates, insurance, CSCS cards), and managing payment runs. This administrative burden leads to payment delays, compliance risks, and frustrated subcontractors.

**Our Solution:**
Centralize all subcontractor data, automate CIS calculations, use AI to validate invoices and detect fraud, and streamline payment processing - cutting admin time by 80%.

---

## What's Actually Built (Current State)

### ✅ Core Features (Fully Functional)

#### 1. **AI-Powered Invoice OCR & Fraud Detection**
- Upload PDF invoices and extract data automatically (invoice number, date, line items, amounts)
- AI fraud detection checks for:
  - Duplicate invoice numbers
  - Pricing anomalies (compared to historical averages)
  - Budget validation (project budget overruns)
  - Amount reasonableness for UK construction rates
  - Document authenticity and completeness
- Risk scoring (LOW/MEDIUM/HIGH) with actionable recommendations
- Uses Anthropic Claude 3.5 (Haiku for speed, Sonnet for high-value/complex invoices)

#### 2. **Comprehensive Subcontractor Management**
- Store all subcontractor details:
  - Company info (name, legal entity type, UTR, company number)
  - Contact information (email, phone, emergency contacts)
  - CIS status (GROSS, STANDARD, HIGHER) and verification expiry tracking
  - Insurance certificates (public liability, employers liability, professional indemnity) with expiry alerts
  - CSCS cards and expiry tracking
  - Health & safety accreditations (CHAS, SafeContractor, Constructionline)
  - Bank details for payments
  - Performance metrics (on-time delivery, invoice accuracy, risk scores)
- GDPR-compliant data management (consent tracking, scheduled deletion)
- Expiry alerts for CIS certificates, insurance, and CSCS cards

#### 3. **Project Management**
- Create and track construction projects with:
  - Client and site information
  - Budget tracking (budget vs. actual cost vs. variations)
  - Project timeline and delays
  - Health & Safety (F10 notifications, RAMS, HSE plans)
  - CDM 2015 compliance (Principal Contractor, Principal Designer)
  - Assign subcontractors to projects with scope of work
  - Track subcontractor performance per project

#### 4. **Invoice Management with CIS Deductions**
- Create invoices manually or via AI OCR
- Automatic CIS deduction calculation (0%, 20%, or 30% based on subcontractor status)
- Invoice status workflow: SUBMITTED → UNDER_REVIEW → APPROVED → PAID
- Link invoices to projects and subcontractors
- Attach supporting documents (timesheets, photos)
- Track due dates and overdue invoices

#### 5. **Payment Runs (Batch Payments)**
- Group multiple invoices into payment runs
- Scheduled payment dates
- Calculate total amounts, CIS deductions, and net payments
- Export payment data for bank transfers or accounting software
- Payment run statuses: DRAFT → READY → EXPORTED → PAID

#### 6. **Reporting & Analytics**
- CIS Monthly Return Report (HMRC submission prep)
- Payment History Report (audit trail)
- Subcontractor Performance Report (ratings, disputes, accuracy)
- Invoice Status Report (pending, overdue, paid)
- Dashboard with financial metrics:
  - Pending invoices
  - Paid this month
  - Pending payment runs
  - Total CIS deductions
  - Overdue invoices and expiring documents alerts

#### 7. **Document Management**
- Store and categorize documents:
  - Invoices
  - Contracts
  - Insurance certificates
  - CIS certificates
  - Qualifications
  - Health & safety documents
  - Photos and reports
- Link documents to entities (subcontractors, projects, invoices)
- Expiry tracking for time-sensitive documents

#### 8. **User Management & Security**
- Role-based access control (ADMIN, FINANCE, PROJECT_MANAGER, SUBCONTRACTOR)
- Company-level data isolation (multi-tenancy)
- Audit logging for all financial actions
- Session management with NextAuth.js
- Secure password hashing (bcrypt)

### ⚠️ Features Promised But NOT Fully Implemented

#### 1. **HMRC CIS Integration**
- **Status**: Schema exists, but NO actual API integration
- **What's missing**:
  - OAuth connection to HMRC API
  - Automated CIS verification lookups
  - Automated CIS monthly return submission
- **Current workaround**: Manual CIS status entry

#### 2. **Xero & QuickBooks Integration**
- **Status**: Schema exists for integrations, but NO actual API connections
- **What's missing**:
  - OAuth flows for Xero/QuickBooks
  - Invoice sync
  - Payment sync
  - Subcontractor sync
- **Current workaround**: Manual data entry or CSV export

#### 3. **Advanced Analytics Dashboard**
- **Status**: Basic metrics available, but NOT comprehensive analytics
- **What's missing**:
  - Cash flow forecasting
  - Project profitability analysis
  - Subcontractor trend analysis
  - Cost prediction models
- **Current state**: Summary metrics only (totals, counts, basic alerts)

#### 4. **Email Notifications**
- **Status**: Environment variable exists for Resend, but NOT implemented
- **What's missing**:
  - Invoice submission notifications
  - Expiry alerts (CIS, insurance, CSCS)
  - Payment confirmation emails
  - Overdue invoice reminders
- **Current workaround**: Users must check dashboard manually

#### 5. **Vector Database for Duplicate Detection**
- **Status**: Pinecone env vars exist, but NOT implemented
- **What's missing**:
  - Semantic duplicate detection across companies
  - Cross-invoice similarity search
- **Current state**: AI checks duplicate invoice numbers within same subcontractor only

---

## Target Customers: Who Should Use SiteSense?

### ✅ Ideal Customer Profile

**UK SME Main Contractors** (annual turnover £500k-£20M) who:
- Manage 10-100+ subcontractors
- Process 50-500 invoices per month
- Struggle with CIS compliance and payment delays
- Lack dedicated accounting software or find it too complex
- Want to reduce admin time and improve subcontractor relationships

**Specific Verticals:**
1. **General Builders** (residential and commercial)
2. **Refurbishment Contractors** (high subcontractor churn)
3. **Fit-Out Contractors** (multiple trades per project)
4. **Facilities Management** (maintenance contracts with recurring subcontractors)
5. **Principal Contractors** (CDM 2015 compliance requirements)

**Typical Personas:**
- **Finance Manager Sarah**: Drowning in invoice paperwork, worried about CIS penalties
- **Project Manager Tom**: Can't track which subcontractors have valid insurance/CSCS cards
- **MD Claire**: Frustrated by 60-90 day payment cycles, wants better cash flow visibility
- **Site Supervisor Mark**: Needs to verify subcontractor compliance before site access

### ❌ NOT a Good Fit For

1. **Large Tier 1 Contractors** (£100M+ turnover)
   - Why: They already have enterprise ERPs (Procore, Viewpoint, SAP)
   - Why: They need deeper integrations with project management and procurement systems

2. **Solo Traders / Micro-Contractors** (<£250k turnover)
   - Why: Too few subcontractors to justify the cost
   - Why: Can manage with spreadsheets or basic accounting software

3. **Domestic/Residential Builders** (direct homeowner clients only)
   - Why: They don't use many subcontractors or CIS
   - Why: Invoice volumes too low

4. **Specialist Subcontractors**
   - Why: They're the ones submitting invoices, not receiving them
   - Why: Different pain points (getting paid, not paying others)

---

## Value Proposition: Why Companies Choose SiteSense

### Primary Benefits

#### 1. **Time Savings: 5-10 hours/week → 1 hour/week**
**Before SiteSense:**
- Finance manager spends 2 hours/week manually entering invoice data from PDFs into Excel
- Office manager spends 3 hours/week chasing missing CIS certificates and insurance docs
- Accountant spends 3 hours/week calculating CIS deductions and reconciling payments
- MD spends 2 hours/week reviewing overdue invoices and project budgets

**After SiteSense:**
- AI OCR extracts invoice data in 30 seconds → **80% faster data entry**
- Automated expiry alerts eliminate chasing → **90% reduction in compliance admin**
- Automatic CIS calculations eliminate errors → **100% accuracy, zero HMRC penalties**
- Real-time dashboard provides instant visibility → **No manual reporting**

**Annual ROI**: 400-500 hours saved × £25/hour = **£10,000-£12,500 value**

#### 2. **Faster Payments: 60-83 days → 30 days**
**The Problem:**
- Manual invoice processing delays approval by 7-14 days
- CIS verification delays payment by another 3-7 days
- Payment runs are ad-hoc and chaotic
- Subcontractors complain and demand upfront payment (cash flow risk)

**SiteSense Solution:**
- Invoices reviewed and approved within 24-48 hours (AI pre-validation)
- CIS status always up-to-date (expiry alerts prevent re-verification delays)
- Scheduled payment runs (weekly or bi-weekly batches)
- Subcontractors see real-time status (reduces chasing calls)

**Business Impact:**
- Happier subcontractors → better rates and priority scheduling
- Improved reputation → attract top-tier tradespeople
- Better cash flow management → predictable payment schedules

#### 3. **Risk Reduction: Fraud & Compliance**
**Fraud Detection:**
- Duplicate invoice detection → prevent double-payments (avg. £5k-£20k saved/year)
- Pricing anomaly alerts → catch inflated invoices (2-5% of invoice value)
- Budget validation → prevent project cost overruns

**CIS Compliance:**
- HMRC penalties for late/incorrect CIS returns: £100-£3,000 per month
- Automatic CIS deduction calculations eliminate errors
- Expiry tracking prevents working with unverified subcontractors (HMRC penalties up to £3,000/subcontractor)

**Insurance Compliance:**
- Prevent subcontractors working with expired insurance → avoid liability claims (potentially £100k-£1M exposure)
- CSCS card tracking → site safety compliance
- Health & safety accreditations → tender requirements

#### 4. **Project Profitability Visibility**
**Before SiteSense:**
- Project budgets tracked in spreadsheets
- No real-time visibility into actual costs vs. budget
- Variation orders lost in email chains
- End-of-project surprises ("We went 20% over budget!")

**After SiteSense:**
- Every invoice linked to a project → real-time cost tracking
- Budget vs. actual cost dashboard → catch overruns early
- Variation tracking → document approved changes
- Project profitability per subcontractor → identify high performers

#### 5. **Subcontractor Relationship Management**
**The Hidden Value:**
- Performance tracking → reward best subcontractors with more work
- Internal ratings and notes → avoid problem subcontractors
- Complete history → reference for future projects
- Consolidated data → no more searching through emails and folders

**Business Impact:**
- Build a preferred supplier list
- Negotiate better rates with high-volume subcontractors
- Reduce disputes and rework
- Faster project delivery with reliable trades

---

## Typical User Workflow

### Scenario 1: Onboarding a New Subcontractor

**Step 1: Add Subcontractor Profile**
1. Navigate to **Dashboard → Subcontractors → Add New**
2. Enter basic details:
   - Company name (e.g., "ABC Electrical Ltd")
   - Legal entity type (Limited Company, Sole Trader, etc.)
   - UTR (Unique Taxpayer Reference)
   - Contact info (email, phone)
   - Address
3. Enter CIS details:
   - CIS status (GROSS/STANDARD/HIGHER)
   - Verification expiry date (auto-alert when approaching expiry)
4. Upload insurance certificates:
   - Public liability insurance (£5M+ typically)
   - Employers liability (if they have employees)
   - Professional indemnity (for consultants)
   - Set expiry dates → system alerts 30 days before expiry
5. Add CSCS card info (if required for site access)
6. Enter bank details (account number, sort code) for payments
7. Set payment terms (30 days, 60 days, etc.)
8. Save profile

**Time Required**: 5-10 minutes (one-time setup)

**Benefit**: All subcontractor compliance data centralized. No more chasing documents before each project.

---

### Scenario 2: Processing an Invoice (with AI OCR)

**Step 2A: Subcontractor Submits Invoice**
1. Subcontractor emails invoice PDF to finance@company.com
2. Finance manager logs into SiteSense
3. Navigate to **Dashboard → Invoices → Create Invoice**
4. Click "Upload Invoice PDF" and select file
5. Select subcontractor from dropdown (ABC Electrical Ltd)
6. Select project (if applicable, e.g., "Meadow View Refurb")
7. Click "Analyze with AI"

**Step 2B: AI Extraction & Validation (30 seconds)**
8. AI extracts:
   - Invoice number: INV-2025-0042
   - Date: 2025-10-15
   - Line items:
     - "1st fix electrical - 3 days @ £450/day" = £1,350
     - "Materials (cable, sockets, switches)" = £280
   - Total: £1,630
   - VAT: £326 (if applicable)
9. AI fraud detection checks:
   - ✅ Invoice number unique (not a duplicate)
   - ✅ Amount within 10% of average (£1,500 avg for ABC Electrical)
   - ✅ Submission frequency normal (weekly invoicing pattern)
   - ✅ Within project budget (£45k budget, £12k spent so far)
   - ✅ Rates reasonable (£450/day is typical for UK electricians)
   - **Risk Score: LOW (15/100)**
10. System auto-calculates CIS deduction:
    - ABC Electrical has STANDARD CIS status (20% deduction)
    - CIS deduction: £1,630 × 20% = £326
    - Net payment: £1,630 - £326 = £1,304

**Step 2C: Review & Approve**
11. Finance manager reviews extracted data
12. Verifies line items match timesheet (if needed)
13. Clicks "Approve Invoice"
14. Invoice status: SUBMITTED → APPROVED
15. Due date automatically set (30 days from invoice date)

**Time Required**: 2-3 minutes (vs. 10-15 minutes manual entry)

**Benefit**: 80% faster processing, zero calculation errors, fraud detection built-in.

---

### Scenario 3: Creating a Payment Run

**Step 3A: Group Invoices for Payment**
1. Navigate to **Dashboard → Payment Runs → New Payment Run**
2. Name payment run: "Weekly Payment Run - Oct 16, 2025"
3. Set scheduled payment date: 2025-10-23 (7 days from now)
4. System shows all APPROVED invoices not yet in a payment run
5. Select invoices to include:
   - ☑ ABC Electrical - INV-2025-0042 (£1,304 net)
   - ☑ XYZ Plumbing - INV-1234 (£2,450 net)
   - ☑ DEF Carpentry - INV-5678 (£3,120 net)
   - (15 invoices total)
6. System calculates totals:
   - Total invoice amount: £48,500
   - Total CIS deductions: £9,700
   - **Net payment required: £38,800**
   - Invoice count: 15 invoices across 12 subcontractors
7. Click "Create Payment Run"

**Step 3B: Export for Banking**
8. Click "Export Payment Run"
9. Choose format:
   - CSV for bank import (BACS file)
   - PDF for approval/records
   - Excel for accounting review
10. Download file and upload to banking portal
11. Mark payment run as "EXPORTED"

**Step 3C: Record Payment**
12. After bank processes payments (1-2 days), return to payment run
13. Click "Mark as PAID"
14. Enter payment reference (e.g., BACS batch number)
15. System updates all invoices to PAID status
16. Records payment date for audit trail

**Time Required**: 10-15 minutes (vs. 2-3 hours manual reconciliation)

**Benefit**: One-click export, zero data entry, automatic status updates.

---

### Scenario 4: Monthly CIS Reporting

**Step 4A: Generate CIS Monthly Return**
1. Navigate to **Dashboard → Reports → CIS Monthly Return**
2. Select month: October 2025
3. Click "Generate Report"
4. System shows all payments made in October:
   - Subcontractor: ABC Electrical Ltd
     - UTR: 1234567890
     - Total paid: £5,200
     - CIS deducted: £1,040 (20%)
   - (Repeat for all subcontractors)
5. System calculates HMRC submission totals:
   - Total gross payments: £156,000
   - Total CIS deductions: £31,200 (to remit to HMRC by 22nd of following month)
6. Export report as CSV for HMRC online portal upload
7. Download PDF for company records

**Time Required**: 5 minutes (vs. 2-3 hours manual calculation)

**Benefit**: HMRC-ready format, zero calculation errors, full audit trail.

---

### Scenario 5: Compliance Monitoring

**Step 5A: Dashboard Alerts**
1. Log into SiteSense dashboard
2. "Attention Required" section shows:
   - 🔴 **3 Expiring CIS Certificates** (within 30 days)
     - ABC Electrical Ltd - expires Oct 30
     - XYZ Plumbing - expires Nov 5
     - DEF Carpentry - expires Nov 12
   - 🔴 **1 Expired Insurance** (public liability)
     - GHI Scaffolding - expired Oct 10 ⚠️
   - 🔴 **2 Missing Bank Details**
     - JKL Decorating
     - MNO Groundworks
   - 🔴 **5 Overdue Invoices** (past due date, not yet paid)

**Step 5B: Take Action**
3. Click on "ABC Electrical Ltd - CIS expiring Oct 30"
4. System opens subcontractor profile
5. Contact subcontractor via email/phone to request updated CIS certificate
6. Upload new certificate when received
7. Update expiry date → alert cleared
8. Repeat for other alerts

**Time Required**: 15-20 minutes per week (vs. 2-3 hours chasing manually)

**Benefit**: Proactive alerts prevent compliance issues, avoid working with unverified/uninsured subcontractors.

---

## Key Differentiators vs. Alternatives

### vs. Spreadsheets (Current State for Most SMEs)

| Feature | Spreadsheets | SiteSense |
|---------|-------------|-----------|
| Data entry speed | 10-15 min/invoice | 2-3 min/invoice (AI OCR) |
| CIS calculations | Manual (error-prone) | Automatic (100% accurate) |
| Duplicate detection | Manual checking | AI-powered |
| Expiry tracking | Manual calendar reminders | Automated alerts |
| Document storage | Email/folders chaos | Centralized, searchable |
| Audit trail | None | Full logging |
| Multi-user access | Version control nightmare | Real-time collaboration |
| Cost | Free | £99-£299/month |

**When Spreadsheets Work Better:** <5 subcontractors, <20 invoices/month

### vs. Accounting Software (Xero, QuickBooks, Sage)

| Feature | Accounting Software | SiteSense |
|---------|---------------------|-----------|
| AI invoice OCR | ❌ | ✅ |
| CIS-specific features | Basic | Advanced (expiry tracking, verification status) |
| Subcontractor compliance | ❌ | ✅ (insurance, CSCS, H&S) |
| Project budget tracking | ❌ (add-ons required) | ✅ Built-in |
| Fraud detection | ❌ | ✅ AI-powered |
| Construction-specific | Generic | Built for construction |
| Learning curve | Steep | Moderate |
| Cost | £30-£50/month | £99-£299/month |

**When Accounting Software Works Better:** You need full double-entry accounting, invoicing to clients, inventory management

### vs. Construction ERPs (Procore, Viewpoint, Fieldwire)

| Feature | Construction ERP | SiteSense |
|---------|------------------|-----------|
| Scope | End-to-end project management | Subcontractor & invoice management only |
| Target customer | Large contractors (£50M+) | SMEs (£500k-£20M) |
| Cost | £500-£2,000/month | £99-£299/month |
| Implementation time | 3-6 months | 1 day |
| Complexity | High | Low |
| AI invoice validation | ❌ (most) | ✅ |

**When ERPs Work Better:** Large company, need full project management (scheduling, RFIs, drawing management, procurement)

---

## Pricing & ROI

### Pricing Tiers (Estimated)

**Starter:** £99/month
- Up to 25 subcontractors
- Up to 100 invoices/month
- 1 company user
- AI invoice OCR (20/month)
- Basic reporting

**Professional:** £199/month
- Up to 100 subcontractors
- Unlimited invoices
- 5 company users
- Unlimited AI invoice OCR
- Advanced reporting
- Email support

**Business:** £299/month
- Unlimited subcontractors
- Unlimited invoices
- Unlimited users
- Unlimited AI invoice OCR
- Priority support
- Custom integrations
- Dedicated account manager

### ROI Calculation (Professional Tier Example)

**Annual Cost:** £199/month × 12 = **£2,388/year**

**Annual Savings:**
- Time savings: 400 hours/year × £25/hour = **£10,000**
- Fraud prevention: 2 duplicate invoices/year × £5,000 avg = **£10,000**
- Avoided HMRC penalties: 1 CIS error avoided/year = **£1,000**
- Faster payment cycles: Better subcontractor rates (1% discount) × £500k annual subcontractor spend = **£5,000**

**Total Annual Benefit:** £26,000
**Net ROI:** £26,000 - £2,388 = **£23,612 (990% ROI)**

**Payback Period:** 4 weeks

---

## Honest Assessment: Gaps & Future Development

### Critical Gaps (Should Be Built ASAP)

1. **HMRC CIS Integration** (6-8 weeks development)
   - Without this, "Automated CIS verification" is false advertising
   - Manual workaround is acceptable for MVP but limits scalability
   - Recommendation: Partner with HMRC-approved gateway provider or build OAuth integration

2. **Email Notifications** (2 weeks development)
   - Users need expiry alerts via email, not just dashboard
   - Invoice status updates should email subcontractors
   - Critical for user retention

3. **Xero/QuickBooks Integration** (4-6 weeks each)
   - Many customers already use accounting software
   - Without integration, creates double data entry
   - Recommendation: Build Xero first (more popular in UK construction)

### Nice-to-Have Enhancements

4. **Mobile App** (3-4 months development)
   - Site managers need to verify subcontractor compliance on-site
   - Photo uploads from site (timesheets, progress photos)
   - Recommendation: Start with responsive web, then native app

5. **Subcontractor Portal** (6 weeks development)
   - Let subcontractors submit invoices directly
   - View payment status in real-time
   - Reduces finance admin burden

6. **Advanced Analytics** (4-6 weeks development)
   - Cash flow forecasting
   - Profitability per project/trade
   - Subcontractor benchmarking

### Current MVP Status: **70% Complete**

**What Works Well:**
- Core subcontractor and invoice management is solid
- AI invoice OCR is impressive and production-ready
- Database schema is comprehensive and well-designed
- UI is clean and construction-focused

**What Needs Work:**
- Landing page over-promises ("HMRC integration", "Xero sync") without disclaimers
- Missing integrations create manual workarounds
- No email notifications reduces stickiness
- No onboarding flow for new users

---

## Go-to-Market Recommendation

### Phase 1: Beta Launch (Current State)

**Target:** 5-10 pilot customers (friendly SME contractors)

**Positioning:**
"AI-powered invoice and compliance management for UK contractors. Reduce admin time by 80% and never miss a CIS expiry again."

**Key Messaging:**
- Focus on time savings and compliance alerts (proven features)
- De-emphasize integrations (coming soon)
- Offer discounted pricing (£99/month flat during beta)
- Gather feedback on most critical missing features

**Success Metrics:**
- 5 paying beta customers within 3 months
- 80% retention after 6 months
- 3+ case studies with quantified ROI
- Net Promoter Score (NPS) >40

### Phase 2: Public Launch (After Integrations)

**Target:** UK SME contractors (£500k-£20M turnover)

**Requirements Before Launch:**
- ✅ HMRC CIS integration (must-have)
- ✅ Xero integration (must-have for UK market)
- ✅ Email notifications (must-have)
- ⚠️ QuickBooks integration (nice-to-have)
- ⚠️ Subcontractor portal (nice-to-have)

**Positioning:**
"The only AI-powered CIS compliance platform built for UK main contractors. Automate invoice processing, catch fraud, and pay on time - every time."

**Channels:**
- Google Ads ("CIS compliance software", "subcontractor management UK")
- LinkedIn Ads (target Finance Managers at construction companies)
- Construction trade publications (Construction News, Building Magazine)
- Trade shows (UK Construction Week, Build Show)
- Referrals (incentivize pilot customers)

---

## Conclusion: Should Companies Use SiteSense?

### ✅ Strong Yes If:

1. You manage 10+ subcontractors and process 50+ invoices/month
2. You spend 5+ hours/week on invoice admin and CIS calculations
3. You've had HMRC CIS penalties or near-misses
4. You struggle to track subcontractor compliance documents (insurance, CIS, CSCS)
5. You pay subcontractors 60-90 days late due to admin delays
6. You want better project cost visibility (budget vs. actual)

**Value:** £10k-£25k annual savings, <1 month payback

### ⚠️ Proceed with Caution If:

1. You need real-time HMRC CIS verification (manual workaround required)
2. You require deep Xero/QuickBooks integration (coming soon)
3. You need mobile site access (responsive web only)
4. You're in the middle of implementing a full ERP (wait until stable)

**Value:** Still significant time savings, but workarounds add friction

### ❌ Not a Good Fit If:

1. You manage <5 subcontractors and <20 invoices/month (spreadsheets are fine)
2. You're a large Tier 1 contractor with existing ERP (Procore, Viewpoint, SAP)
3. You're a subcontractor looking to get paid faster (different product needed)
4. You don't use CIS (domestic/residential only, no subcontractors)

**Value:** Cost doesn't justify benefit

---

## Quick Start Guide (Next Steps)

1. **Access the application**: http://localhost:3000
2. **Register a company account**: Create your first user
3. **Add 2-3 sample subcontractors**: Test compliance tracking
4. **Create a sample project**: Link to subcontractors
5. **Upload a test invoice PDF**: Experience AI OCR and fraud detection
6. **Create a payment run**: Group invoices and export
7. **Review reports**: CIS monthly return, payment history
8. **Explore dashboard alerts**: See expiry tracking in action

**Time to Value:** 1 hour to set up, immediate benefits on first invoice

---

## Contact & Support

**Developer:** Pedro Tengelmann
**Email:** pedro@sitesense.co.uk
**GitHub:** https://github.com/ptengelmann/SiteSense

For questions, feature requests, or partnership inquiries, reach out via email.

---

**Built with ❤️ for UK construction companies**
