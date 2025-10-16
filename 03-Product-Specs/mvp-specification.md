# SiteSense MVP - Product Specification

## Product Vision

**SiteSense** is an AI-powered subcontractor management and compliance platform that helps SME principal contractors reduce payment cycles from 83 days to 30 days while automating UK construction compliance requirements.

---

## Target Customer

**Primary**: SME Principal Contractors
- Company size: 5-50 employees
- Project volume: 3-20 active projects per year
- Sector: Residential and commercial construction
- Geography: UK (starting with Preston/Northwest England)
- Current tools: Spreadsheets, Xero/QuickBooks, email, WhatsApp

**User Personas**:

1. **Project Manager Sarah** (Primary User)
   - Manages 3-8 active projects simultaneously
   - Coordinates 15-40 subcontractors across projects
   - Spends 10+ hours/week on invoice processing and compliance
   - Frustrated with payment delays causing subcontractor relationship issues
   - Tech-savvy but needs simple, fast tools

2. **Finance Manager David** (Secondary User)
   - Processes 50-200 invoices per month
   - Handles CIS verification and deductions
   - Creates payment runs twice monthly
   - Needs compliance audit trails
   - Uses Xero/QuickBooks

3. **Director Emma** (Decision Maker)
   - Concerned about cash flow and subcontractor relationships
   - Wants visibility into project costs and payment obligations
   - Needs to reduce admin overhead
   - Worried about compliance fines
   - Budget-conscious, ROI-focused

---

## Core Problem Statement

SME principal contractors lose 10-15 hours per week on manual subcontractor management:
- Chasing invoices via email/phone
- Manual CIS verification with HMRC
- Duplicate invoice detection
- Payment deadline tracking
- Compliance documentation for audits

This causes:
- 83-day average payment delays
- Damaged subcontractor relationships
- Compliance risks (fines averaging £11M+ in H1 2025)
- Cash flow unpredictability
- Lost productivity on admin vs. building

---

## MVP Solution

### Core Value Proposition
**"Reduce your subcontractor payment cycle by 50+ days with AI-powered compliance automation"**

### Key Features (MVP Scope)

#### 1. Subcontractor Management Portal

**Admin Side (Principal Contractor)**:
- Add subcontractor details (company name, UTR, contact info)
- View all subcontractors in searchable/filterable list
- See subcontractor status: Active, Pending Verification, Inactive
- Track subcontractor performance score (simple: on-time %, total paid, active since)

**Subcontractor Side**:
- Self-service onboarding portal
- Upload required documents (insurance certificates, qualifications)
- Submit timesheets/work completed
- Upload and submit invoices
- View payment status
- Receive automated reminders

#### 2. Automated CIS Verification

**Integration**: HMRC CIS API
- Automatic verification on subcontractor signup
- Real-time UTR validation
- CIS status check (standard rate, higher rate, gross payment)
- Automatic re-verification quarterly
- Alert when verification expires
- Store verification records for 6 years (compliance requirement)

**User Experience**:
- Admin enters subcontractor UTR → system verifies instantly
- Dashboard shows: "5 subcontractors verified, 2 pending verification, 1 expired"
- One-click re-verification

#### 3. Invoice Submission & Management

**Subcontractor Experience**:
- Upload invoice PDF or photo via web/mobile
- Fill in basic details: amount, date, project, work description
- Attach supporting documents (timesheets, photos)
- Submit for review
- Track status: Submitted → Under Review → Approved → Paid

**Admin Experience**:
- Receive notification of new invoice submission
- View invoice details and attached documents
- Quick approval/rejection workflow
- Batch approve multiple invoices
- Export approved invoices to Xero/QuickBooks

#### 4. AI Invoice Validation (KILLER FEATURE)

**Automated Checks** (runs on every invoice submission):

1. **Duplicate Detection**
   - Check against all invoices in system
   - Flag if invoice number already exists from same subcontractor
   - Flag if similar amount + date combination detected
   - Confidence score: "95% likely duplicate of INV-2024-123"

2. **Pricing Anomaly Detection**
   - Compare against historical rates for same subcontractor
   - Flag if invoice amount >20% higher than typical
   - Compare against project budget allocations
   - Alert: "This invoice is 35% higher than average for this subcontractor"

3. **CIS Compliance Validation**
   - Check if subcontractor CIS verification is current
   - Verify correct CIS deduction rate applied
   - Flag if invoice would exceed £1,000 threshold without verification
   - Auto-block payment if verification missing

4. **Document Completeness Check**
   - Verify invoice has required fields (date, amount, description, UTR)
   - Check if supporting documents attached when required
   - Flag missing information: "Missing: Timesheet, Work photos"

5. **Purchase Order Matching** (if PO provided)
   - Match invoice to project PO
   - Check if amount exceeds PO value
   - Verify work description matches PO scope
   - Alert on overage: "Invoice exceeds PO by £450"

**AI Output**:
- Risk Score: Low, Medium, High
- Validation Status: ✓ Passed All Checks | ⚠ Review Required | ✗ Rejected
- Specific Issues: List of flagged items with explanations
- Recommendations: "Review with subcontractor before approving"

**Technology**:
- GPT-4 Vision for invoice OCR and extraction
- Custom ML model for pricing anomaly detection (train on customer's historical data)
- Rule-based validation for CIS/compliance checks
- Vector database for duplicate detection

#### 5. Payment Tracking & Compliance

**Payment Dashboard**:
- Upcoming payments (due this week, next week, overdue)
- Payment obligations by project
- Total outstanding: £45,230
- Average payment cycle: 32 days (down from 83!)

**Compliance Features**:
- Construction Act deadline tracking (30 days from invoice receipt)
- Automated reminders: 7 days before deadline, 1 day before, on deadline
- Payment history audit trail (who approved, when, amount)
- CIS deduction tracking and reporting
- Generate monthly CIS return for HMRC

**Payment Workflow**:
1. Invoice approved → added to payment queue
2. Calculate CIS deduction automatically
3. Group by payment run date
4. Export to Xero/QuickBooks for actual payment
5. Mark as "Paid" in system
6. Notify subcontractor

#### 6. Analytics Dashboard

**Key Metrics** (simple, actionable):
- Average payment cycle time (track improvement!)
- Total paid this month vs. budget
- Outstanding payment obligations
- Top 5 subcontractors by spend
- Invoices by status (submitted, approved, paid)
- Compliance alerts (verifications expiring, payment deadlines)

**Project View**:
- Subcontractor costs by project
- Budget vs. actual spend
- Payment velocity (how fast are we paying?)

#### 7. Integrations

**Must-Have for MVP**:
1. **HMRC CIS API** - CIS verification and submission
2. **Xero Integration** - Export approved invoices as bills, sync subcontractors as suppliers
3. **QuickBooks Integration** - Same as Xero

**Nice-to-Have** (post-MVP):
- Email integration (forward invoices to system)
- WhatsApp integration (notifications)
- Banking API (auto-match payments)

---

## User Journeys

### Journey 1: Onboarding a New Subcontractor

**Sarah (Project Manager)** needs to onboard electrician for new project

1. Logs into SiteSense → "Subcontractors" → "Add New"
2. Enters: Name, Company, UTR, Email, Phone
3. System auto-verifies CIS with HMRC → "✓ Verified - Standard Rate (20%)"
4. System sends automated email to subcontractor: "Welcome to SiteSense! Upload your documents"
5. Subcontractor uploads insurance certificate, qualifications
6. System validates expiry dates → "Insurance expires in 45 days - reminder set"
7. Status changes to "Active - Ready to Invoice"
8. Sarah assigns subcontractor to "Maple Street Project"

**Time**: 3 minutes (vs. 20 minutes manual process)

### Journey 2: Subcontractor Submits Invoice

**John (Electrician)** completed work, needs to submit invoice

1. Receives notification: "Submit your invoice for Maple Street work"
2. Opens SiteSense subcontractor portal on phone
3. Takes photo of invoice → uploads
4. AI extracts: Invoice #EL-2024-089, £2,450, Date: 15/10/2025
5. Selects project: "Maple Street", adds description: "First fix electrical"
6. Uploads 3 work photos
7. Clicks "Submit" → Status: "Under Review"
8. AI runs validation checks:
   - ✓ No duplicates found
   - ✓ CIS verification current
   - ✓ Within typical rate range
   - ⚠ Missing timesheet
9. System sends message: "Invoice submitted. Admin will review within 24 hours."

**Time**: 2 minutes

### Journey 3: Admin Reviews & Approves Invoice

**Sarah (Project Manager)** reviews John's invoice

1. Receives notification: "New invoice from John's Electrical - £2,450"
2. Opens invoice in dashboard
3. Sees AI validation:
   - Risk Score: **Low**
   - ✓ All compliance checks passed
   - ⚠ Missing timesheet (flagged)
   - Recommendation: "Safe to approve"
4. Views invoice PDF, work photos
5. Notes missing timesheet, messages John: "Please upload timesheet"
6. John uploads timesheet within 5 minutes
7. Sarah clicks "Approve" → Invoice moves to "Approved" status
8. System calculates: £2,450 - £490 CIS (20%) = £1,960 net payment
9. Adds to next payment run (scheduled for 25/10/2025)
10. John receives notification: "Invoice approved! Payment scheduled for 25/10"

**Time**: 3 minutes (vs. 15-20 minutes checking manually)

### Journey 4: Processing Payment Run

**David (Finance Manager)** processes bi-weekly payments

1. Opens SiteSense → "Payments" → "Payment Runs"
2. Sees: "15 invoices ready for payment - Total: £23,450 (£18,760 net after CIS)"
3. Reviews list of invoices
4. Clicks "Export to Xero"
5. System creates bills in Xero with CIS deductions pre-calculated
6. David processes payment in Xero
7. Returns to SiteSense → "Mark Payment Run as Paid"
8. System updates all 15 invoices to "Paid" status
9. Sends notifications to all 15 subcontractors
10. Records payment date for compliance tracking

**Time**: 10 minutes (vs. 1-2 hours manual processing)

### Journey 5: Monthly Compliance Reporting

**David (Finance Manager)** prepares monthly CIS return for HMRC

1. End of month → Opens SiteSense
2. Navigates to "Compliance" → "CIS Returns"
3. Selects month: October 2025
4. System auto-generates CIS return with all subcontractor payments
5. Shows: 32 payments, £67,890 total, £13,578 CIS deducted
6. Click "Export for HMRC Submission"
7. Downloads XML file
8. Uploads to HMRC Gateway
9. Returns to SiteSense → "Mark as Submitted"
10. System archives return with 6-year retention

**Time**: 5 minutes (vs. 2-3 hours manual reconciliation)

---

## Technical Requirements

### Performance
- Page load time: <2 seconds
- Invoice upload: <5 seconds for processing
- AI validation: <10 seconds per invoice
- CIS verification: <3 seconds (HMRC API)
- Support 100 concurrent users minimum

### Security
- SOC 2 Type II compliance path
- Data encryption at rest and in transit (AES-256)
- Role-based access control (Admin, Finance, Subcontractor)
- Audit logs for all financial actions
- GDPR compliant (UK data residency)
- 2FA for admin users

### Reliability
- 99.9% uptime SLA
- Automated backups (hourly)
- Disaster recovery plan
- Data retention: 6 years (UK requirement)

### Scalability
- Support 1,000 principal contractors
- 20,000 subcontractors
- 50,000 invoices per month
- 1M+ invoice validations per month

---

## Success Metrics

### Primary Metrics
1. **Average Payment Cycle Time**: Target <35 days (from 83 days)
2. **Invoice Processing Time**: Target 3-5 minutes (from 15-20 minutes)
3. **AI Validation Accuracy**: Target >95% (catches duplicates, errors without false positives)
4. **Customer Retention**: Target >85% annual retention
5. **NPS Score**: Target >50

### Secondary Metrics
1. Subcontractor invoices submitted via platform: >80%
2. Auto-approval rate (AI validates as low-risk): >60%
3. CIS compliance errors caught: 100% before payment
4. Time to onboard new subcontractor: <5 minutes
5. Monthly payment runs: 2-4 per customer

### Business Metrics
1. Monthly Recurring Revenue: £20k by month 6
2. Customer Acquisition Cost: <£500
3. Lifetime Value: >£10k (>20:1 LTV:CAC)
4. Churn Rate: <15% annually
5. Customers: 50 by month 6, 200 by month 12

---

## Out of Scope for MVP

**Deliberately excluded** (add in v2+):

1. Mobile native apps (web responsive is enough)
2. AI site safety monitoring (separate vertical)
3. Material tracking
4. Project scheduling/Gantt charts
5. Document management beyond invoices
6. Integrated payments (banking API)
7. Advanced analytics (forecasting, ML insights beyond invoice validation)
8. Multi-language support (UK only)
9. Custom workflows/automation builder
10. Payroll integration

**Why**: MVP must nail the core payment cycle + compliance problem. These features dilute focus.

---

## Pricing (MVP)

### Tiers

**Starter - £199/month**
- 1-3 active projects
- Up to 10 subcontractors
- 50 invoices per month
- AI invoice validation
- CIS verification
- 1 integration (Xero OR QuickBooks)
- Email support

**Professional - £399/month** (Target tier)
- 5-10 active projects
- Up to 30 subcontractors
- 200 invoices per month
- AI invoice validation
- CIS verification
- 2 integrations
- Priority email support
- Phone support
- Custom fields

**Business - £799/month**
- Unlimited projects
- Unlimited subcontractors
- Unlimited invoices
- AI invoice validation
- CIS verification
- All integrations
- Dedicated account manager
- Priority phone support
- API access
- Custom reporting

**Add-ons**:
- Additional user seats: £25/month per user
- Advanced analytics: £99/month
- Accelerated payment feature: 0.5% transaction fee

### Free Trial
- 14-day free trial (no credit card required)
- Full access to Professional tier features
- Up to 10 invoice submissions
- Onboard up to 5 subcontractors

---

## Go-to-Market Strategy

### Phase 1: Preston Pilot (Month 1-3)
- Target: 5-10 local principal contractors
- Approach: Direct outreach (LinkedIn, local construction networks)
- Offer: Free for 3 months in exchange for feedback
- Goal: Validate product, gather testimonials, refine features

### Phase 2: Northwest Expansion (Month 4-6)
- Target: 30-50 customers across NW England
- Approach: Case studies from pilot, cold email, LinkedIn outreach
- Offer: 50% off first 3 months
- Goal: Reach £20k MRR

### Phase 3: National Rollout (Month 7-12)
- Target: 200+ customers across UK
- Channels: Content marketing, SEO, partnerships (accountants), paid ads
- Goal: £80k MRR, establish brand

### Value Proposition by Channel
- **Cold Email**: "Reduce your subcontractor payment cycle by 50+ days"
- **LinkedIn**: Case studies showing real time savings
- **Content**: "Ultimate Guide to CIS Compliance for SME Contractors"
- **Referral**: "Give £100, Get £100" program

---

## Development Roadmap

### Phase 1: Foundation (Weeks 1-4)
- User authentication (admin, subcontractor roles)
- Database schema and models
- Basic CRUD for subcontractors and projects
- Admin dashboard shell
- Subcontractor portal shell

### Phase 2: CIS Integration (Weeks 5-6)
- HMRC CIS API integration
- CIS verification workflow
- Verification status tracking
- Automated re-verification

### Phase 3: Invoice Management (Weeks 7-9)
- Invoice upload (PDF, photo)
- Invoice form and submission
- Admin review and approval workflow
- Status tracking
- Document storage (S3)

### Phase 4: AI Invoice Validation (Weeks 10-12) - **CRITICAL**
- GPT-4 Vision for invoice OCR
- Duplicate detection system
- Pricing anomaly detection
- CIS compliance checks
- Risk scoring algorithm
- Admin review interface with AI insights

### Phase 5: Payment Tracking (Weeks 13-14)
- Payment dashboard
- CIS deduction calculations
- Payment run creation
- Payment deadline tracking
- Compliance reminders

### Phase 6: Integrations (Weeks 15-16)
- Xero API integration
- QuickBooks API integration
- Export approved invoices
- Sync subcontractors as suppliers

### Phase 7: Analytics & Polish (Weeks 17-18)
- Analytics dashboard
- Performance metrics
- Reporting exports
- UI/UX refinements
- Mobile responsive design

### Phase 8: Testing & Launch (Weeks 19-20)
- End-to-end testing
- Security audit
- Performance optimization
- Beta testing with pilot customers
- Launch preparation

**Total: 20 weeks (5 months) to production-ready MVP**

---

## Tech Stack (Recommended)

**Frontend**:
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Recharts for analytics

**Backend**:
- Next.js API routes (serverless)
- Supabase (PostgreSQL + Auth + Storage)
- Prisma ORM

**AI/ML**:
- OpenAI GPT-4 Vision API (invoice OCR)
- OpenAI GPT-4 (validation logic)
- Pinecone (vector database for duplicate detection)
- Custom ML model (pricing anomalies) - TensorFlow or scikit-learn

**Integrations**:
- HMRC CIS API
- Xero API (OAuth 2.0)
- QuickBooks API (OAuth 2.0)

**Infrastructure**:
- Vercel (hosting + edge functions)
- Supabase (database, auth, storage)
- AWS S3 (document storage backup)
- Stripe (billing)

**Monitoring/Analytics**:
- Sentry (error tracking)
- Vercel Analytics
- PostHog (product analytics)

---

## Risk Assessment

### Technical Risks

**High Risk**:
1. **AI validation accuracy** - False positives frustrate users
   - Mitigation: Start with conservative rules, tune over time, allow override

2. **HMRC API reliability** - Government API downtime blocks workflows
   - Mitigation: Cache verification results, manual fallback option, retry logic

**Medium Risk**:
3. **Xero/QuickBooks API changes** - Breaking changes impact integrations
   - Mitigation: Use official SDKs, monitor changelogs, have test accounts

4. **Data migration complexity** - Customers want historical data imported
   - Mitigation: MVP doesn't require migration, CSV import for invoices post-launch

**Low Risk**:
5. **Scalability** - User growth exceeds infrastructure capacity
   - Mitigation: Serverless architecture scales automatically, monitor usage

### Business Risks

**High Risk**:
1. **Customer acquisition** - SMEs are slow adopters, skeptical of new tools
   - Mitigation: Free pilots, case studies, ROI calculator, money-back guarantee

2. **Competition** - Large player (Procore, Oracle) launches SME product
   - Mitigation: Move fast, build relationships, focus on niche (UK compliance)

**Medium Risk**:
3. **Regulatory changes** - CIS rules change, invalidate features
   - Mitigation: Monitor HMRC updates, build flexible compliance engine

4. **Economic downturn** - Construction slows, customers cut costs
   - Mitigation: Product saves money (reduces admin time), essential for compliance

**Low Risk**:
5. **Pricing** - Customers unwilling to pay £200-800/month
   - Mitigation: Clear ROI story (saves 10+ hours/week = £400+/month in labor), flexible pricing

---

## Next Steps

1. **Technical Architecture Document** - Detail system design, API contracts, database schema
2. **Design Mockups** - Wireframes and high-fidelity designs for key flows
3. **AI Validation Prototype** - Prove out invoice OCR and validation accuracy
4. **Development Setup** - Initialize repo, configure infrastructure, set up CI/CD
5. **Build Sprint 1** - Authentication, database, basic CRUD (Weeks 1-4)

---

**Document Version**: 1.0
**Last Updated**: 16 October 2025
**Owner**: Pedro (Founder)
**Status**: Ready for Technical Planning
