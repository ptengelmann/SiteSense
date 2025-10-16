# Advanced Subcontractor Management - Implementation Plan

## Vision: Industry-Leading Subcontractor Management

We're not building basic CRUD. We're building the **most intelligent subcontractor management system in UK construction** by solving real, painful problems that cost contractors thousands per month.

---

## Phase 1: Advanced Subcontractor CRUD (This Session)

### 1.1 Subcontractor Profile - Beyond Basic Details

**Standard Features (Table Stakes):**
- Company name, registration number, VAT
- Contact details (email, phone, address)
- Bank details for payments

**ADVANCED Features (Our Differentiators):**

#### CIS Intelligence
- ✅ Real-time HMRC CIS verification status
- ✅ Automatic CIS rate calculation (20% or 30%)
- ✅ Gross payment status tracking
- ✅ CIS certificate expiry alerts (30/14/7 days before)
- ✅ Automatic reverification reminders
- ✅ Historical CIS status changes log

#### Insurance & Compliance Monitoring
- ✅ Public Liability Insurance tracking with expiry alerts
- ✅ Professional Indemnity tracking
- ✅ Employers Liability tracking
- ✅ Auto-notifications 30/14/7 days before expiry
- ✅ Document upload with OCR extraction of dates/amounts
- ✅ Compliance score based on up-to-date documents

#### Payment Terms Intelligence
- ✅ Custom payment terms per subcontractor (30/60/90 days)
- ✅ Retention percentage tracking (5-10% typical)
- ✅ Retention release date calculation
- ✅ Early payment discount tracking
- ✅ Payment history analytics

#### Performance Scoring System
**We'll track and score subcontractors on:**
- On-time delivery rate
- Invoice accuracy rate
- Dispute frequency
- Response time to queries
- Document compliance rate
- Payment cycle speed (how fast they submit invoices)

**Auto-calculated risk score:**
- 🟢 Green (90-100): Preferred supplier
- 🟡 Amber (70-89): Standard supplier
- 🔴 Red (0-69): High risk - requires review

---

## Phase 2: Intelligent Document Management

### 2.1 Smart Document Library
- Document types: CIS certs, insurance, contracts, certifications
- OCR extraction of key dates and amounts
- Auto-categorization using ML
- Version control
- Expiry tracking with smart notifications

### 2.2 Document OCR (Python Service)
**This is where we start building our ML capability:**
- Extract insurance expiry dates
- Extract policy numbers
- Extract coverage amounts
- Extract CIS numbers
- Extract company registration numbers

**Tech Stack:**
- Python FastAPI service
- Tesseract OCR / Google Vision API
- Custom ML model for construction document classification
- PostgreSQL for document metadata

---

## Phase 3: HMRC CIS API Integration

### 3.1 Real-time CIS Verification
**Using HMRC API:**
- Verify subcontractor CIS status
- Check verification number validity
- Get CIS deduction rate (0%, 20%, 30%)
- Store verification history
- Auto-update status monthly

**Value Proposition:**
- No more manual HMRC checks
- Instant verification on onboarding
- Automatic compliance
- Audit trail for HMRC inspections

---

## Phase 4: AI-Powered Insights (Future - Custom ML)

### 4.1 Risk Prediction Engine
**Python ML Service - Custom Models:**

#### Model 1: Payment Risk Predictor
- Predict likelihood of payment disputes
- Analyze historical invoice patterns
- Flag unusual invoice amounts
- Detect duplicate submissions early

#### Model 2: Performance Forecasting
- Predict project completion likelihood
- Estimate invoice submission timing
- Flag at-risk subcontractors before problems occur

#### Model 3: Cost Anomaly Detection
- Learn typical rates per subcontractor
- Flag unusually high/low invoices
- Detect pricing drift over time
- Benchmark against market rates

**Tech Stack:**
- Python with scikit-learn, TensorFlow
- Time-series analysis (Prophet, ARIMA)
- Anomaly detection algorithms
- Custom training on your data
- Self-improving models

### 4.2 Smart Recommendations
- Suggest best subcontractors for new projects
- Recommend payment terms based on history
- Flag compliance gaps before they're problems
- Predict cash flow impact of payment runs

---

## Phase 5: Invoice Validation AI (Weeks 11-14)

### 5.1 Multi-Stage Validation Pipeline

**Stage 1: Document Intelligence (Python ML)**
- OCR with 99%+ accuracy
- Extract: amounts, dates, line items, VAT, totals
- Classify document type
- Detect document quality issues

**Stage 2: Duplicate Detection (Vector Search)**
- Convert invoices to embeddings
- Semantic similarity search
- Detect near-duplicates (renamed PDFs, rescans)
- Flag suspicious patterns

**Stage 3: Anomaly Detection (Custom ML)**
- Price per unit anomalies
- Quantity spikes
- Unusual timing patterns
- Cross-project rate comparison

**Stage 4: Compliance Validation (Rules Engine)**
- CIS deduction correct?
- VAT calculation accurate?
- Payment terms match contract?
- Within approved purchase order?

**Stage 5: AI Reasoning (Claude API - for complex cases)**
- Natural language explanations
- Contextual recommendations
- Edge case handling
- Human-readable audit trails

**Why this hybrid approach wins:**
- Fast: Python ML for 90% of cases
- Accurate: Custom models trained on construction data
- Cost-effective: Only use Claude API for complex reasoning
- Scalable: Can process thousands of invoices
- Self-improving: Models learn from corrections

---

## Competitive Advantages

### vs. Procore/Buildertrend
❌ They do basic subcontractor lists
✅ We do predictive risk scoring + HMRC integration

### vs. Xero/QuickBooks
❌ They do basic accounting
✅ We do construction-specific compliance + AI validation

### vs. Manual Processes
❌ 83-day payment cycles
✅ 30-day cycles with automated validation

### Our Unique Value
1. **HMRC CIS Integration** (no one else does this well)
2. **Custom ML Models** (not just API wrappers)
3. **Predictive Analytics** (prevent problems before they happen)
4. **Construction-Specific** (deep industry knowledge)
5. **Self-Improving AI** (gets smarter with usage)

---

## Implementation Order (Next 3 Sessions)

### Session 1 (Today):
1. ✅ Subcontractor CRUD with advanced fields
2. ✅ List page with smart filters
3. ✅ Detail page with performance metrics
4. ✅ Document upload capability

### Session 2:
1. ✅ CIS verification status tracking
2. ✅ Insurance expiry monitoring
3. ✅ Performance scoring system
4. ✅ Payment terms tracking

### Session 3:
1. ✅ Python ML service setup (FastAPI)
2. ✅ Basic OCR for document extraction
3. ✅ HMRC API integration prep
4. ✅ Database optimization for analytics

---

## Tech Stack for Advanced Features

### Frontend
- Next.js 14 (current)
- React Query for caching
- Chart.js for analytics
- date-fns for date calculations

### Backend (Current)
- Next.js API routes
- Prisma ORM
- PostgreSQL

### Python ML Service (NEW)
- FastAPI for API
- scikit-learn for ML models
- Tesseract/Google Vision for OCR
- pandas for data processing
- PostgreSQL for storage
- Docker for deployment

### AI Stack
- **Primary**: Custom Python ML models (fast, cheap, scalable)
- **Secondary**: Claude API (complex reasoning only)
- **Future**: Fine-tuned models on your data

---

## Success Metrics

### User Impact
- 50% reduction in admin time
- 0% CIS compliance failures
- 100% insurance tracking
- 90%+ invoice auto-approval rate

### Business Impact
- 83 → 30 day payment cycles
- £10k+ saved per year on compliance
- 10+ hours saved per week
- Zero HMRC penalties

---

## Let's Build This! 🚀

Starting with the foundation today, then layering on advanced features. Every feature solves a real £££ problem for UK contractors.
