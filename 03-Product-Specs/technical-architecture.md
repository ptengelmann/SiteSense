# SiteSense - Technical Architecture

## System Overview

SiteSense is a serverless, cloud-native web application built on Next.js with AI-powered invoice validation capabilities. The system follows a modern jamstack architecture with API routes, PostgreSQL database, and third-party integrations.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│  Next.js 14 + React + TypeScript + Tailwind CSS + Shadcn/ui   │
│                    (Deployed on Vercel)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS/JSON
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      API LAYER (Next.js)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │ Auth Routes │  │ CRUD Routes  │  │ Integration Routes  │   │
│  └─────────────┘  └──────────────┘  └─────────────────────┘   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │ AI Routes   │  │ Webhook      │  │ Background Jobs     │   │
│  └─────────────┘  └──────────────┘  └─────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
┌───────────────▼──┐  ┌──────▼─────┐  ┌─▼──────────────────┐
│   DATABASE       │  │  STORAGE   │  │  AI/ML SERVICES    │
│  (Supabase       │  │ (Supabase  │  │  - OpenAI GPT-4V   │
│   PostgreSQL)    │  │  Storage)  │  │  - Pinecone        │
│                  │  │            │  │  - Custom ML       │
└──────────────────┘  └────────────┘  └────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
┌───────────────▼──┐  ┌──────▼─────┐  ┌─▼──────────────────┐
│  HMRC CIS API    │  │ Xero API   │  │ QuickBooks API     │
│  (Gov Gateway)   │  │ (OAuth2)   │  │ (OAuth2)           │
└──────────────────┘  └────────────┘  └────────────────────┘
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn/ui (radix-ui primitives)
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Query (TanStack Query) + Zustand
- **Charts**: Recharts
- **Date Handling**: date-fns
- **File Upload**: react-dropzone

### Backend
- **API**: Next.js API Routes (App Router)
- **Language**: TypeScript
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Credentials + Magic Link)
- **Validation**: Zod schemas
- **Background Jobs**: Inngest (serverless queue)

### Database & Storage
- **Database**: Supabase (PostgreSQL 15)
- **File Storage**: Supabase Storage (S3-compatible)
- **Cache**: Vercel KV (Redis)
- **Search**: PostgreSQL Full Text Search

### AI/ML
- **Invoice OCR**: OpenAI GPT-4 Vision API
- **Validation Logic**: OpenAI GPT-4 API
- **Vector Database**: Pinecone (duplicate detection)
- **Anomaly Detection**: scikit-learn (Python microservice)

### External Integrations
- **HMRC CIS**: REST API with OAuth 2.0
- **Xero**: REST API with OAuth 2.0
- **QuickBooks**: REST API with OAuth 2.0
- **Stripe**: Payment processing (billing)

### DevOps & Infrastructure
- **Hosting**: Vercel (Frontend + API)
- **Database**: Supabase Cloud
- **CDN**: Vercel Edge Network
- **DNS**: Vercel/Cloudflare
- **Monitoring**: Sentry (errors) + Vercel Analytics
- **Analytics**: PostHog (product analytics)
- **Email**: Resend (transactional emails)
- **CI/CD**: GitHub Actions + Vercel

### Development Tools
- **Version Control**: Git + GitHub
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier
- **Testing**: Vitest + React Testing Library + Playwright
- **API Documentation**: OpenAPI/Swagger

---

## Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) NOT NULL, -- 'admin', 'finance', 'project_manager', 'subcontractor'
  company_id UUID REFERENCES companies(id),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);
```

#### companies
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  company_number VARCHAR(50), -- Companies House number
  vat_number VARCHAR(50),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  postcode VARCHAR(20),
  country VARCHAR(2) DEFAULT 'GB',
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  subscription_tier VARCHAR(20) DEFAULT 'starter', -- 'starter', 'professional', 'business'
  subscription_status VARCHAR(20) DEFAULT 'trial', -- 'trial', 'active', 'cancelled'
  trial_ends_at TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_companies_subscription_status ON companies(subscription_status);
```

#### subcontractors
```sql
CREATE TABLE subcontractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  utr VARCHAR(10) NOT NULL, -- Unique Taxpayer Reference
  cis_status VARCHAR(20), -- 'gross', 'standard', 'higher', 'not_verified'
  cis_verified_at TIMESTAMP,
  cis_verification_expires_at TIMESTAMP,
  cis_verification_reference VARCHAR(100),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  postcode VARCHAR(20),
  insurance_expires_at DATE,
  insurance_document_url VARCHAR(500),
  performance_score DECIMAL(3,2) DEFAULT 0, -- 0.00 to 5.00
  total_paid DECIMAL(12,2) DEFAULT 0,
  total_invoices INT DEFAULT 0,
  on_time_percentage DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subcontractors_company_id ON subcontractors(company_id);
CREATE INDEX idx_subcontractors_utr ON subcontractors(utr);
CREATE INDEX idx_subcontractors_cis_expires ON subcontractors(cis_verification_expires_at);
```

#### projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_number VARCHAR(50),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  postcode VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active', -- 'planning', 'active', 'on_hold', 'completed'
  budget DECIMAL(12,2),
  start_date DATE,
  estimated_completion_date DATE,
  actual_completion_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_projects_status ON projects(status);
```

#### invoices
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  subcontractor_id UUID REFERENCES subcontractors(id) NOT NULL,
  project_id UUID REFERENCES projects(id),
  invoice_number VARCHAR(100) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,
  amount DECIMAL(12,2) NOT NULL,
  cis_deduction DECIMAL(12,2) DEFAULT 0,
  net_payment DECIMAL(12,2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'submitted', -- 'submitted', 'under_review', 'approved', 'paid', 'rejected'
  payment_date DATE,
  payment_reference VARCHAR(100),
  invoice_file_url VARCHAR(500),
  validation_status VARCHAR(20), -- 'pending', 'passed', 'review_required', 'failed'
  validation_risk_score VARCHAR(10), -- 'low', 'medium', 'high'
  validation_result JSONB, -- stores AI validation details
  submitted_by UUID REFERENCES users(id),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_subcontractor_id ON invoices(subcontractor_id);
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE UNIQUE INDEX idx_invoices_unique_number ON invoices(subcontractor_id, invoice_number);
```

#### invoice_documents
```sql
CREATE TABLE invoice_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) NOT NULL,
  document_type VARCHAR(50) NOT NULL, -- 'invoice', 'timesheet', 'photo', 'supporting_doc'
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invoice_documents_invoice_id ON invoice_documents(invoice_id);
```

#### payment_runs
```sql
CREATE TABLE payment_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  scheduled_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'ready', 'exported', 'paid'
  total_amount DECIMAL(12,2) DEFAULT 0,
  total_cis_deduction DECIMAL(12,2) DEFAULT 0,
  net_payment DECIMAL(12,2) DEFAULT 0,
  invoice_count INT DEFAULT 0,
  exported_at TIMESTAMP,
  paid_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_runs_company_id ON payment_runs(company_id);
CREATE INDEX idx_payment_runs_status ON payment_runs(status);
```

#### payment_run_invoices
```sql
CREATE TABLE payment_run_invoices (
  payment_run_id UUID REFERENCES payment_runs(id) NOT NULL,
  invoice_id UUID REFERENCES invoices(id) NOT NULL,
  PRIMARY KEY (payment_run_id, invoice_id)
);

CREATE INDEX idx_payment_run_invoices_payment_run_id ON payment_run_invoices(payment_run_id);
CREATE INDEX idx_payment_run_invoices_invoice_id ON payment_run_invoices(invoice_id);
```

#### cis_verifications
```sql
CREATE TABLE cis_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcontractor_id UUID REFERENCES subcontractors(id) NOT NULL,
  verification_date TIMESTAMP NOT NULL,
  verification_reference VARCHAR(100),
  utr VARCHAR(10) NOT NULL,
  cis_status VARCHAR(20) NOT NULL, -- 'gross', 'standard', 'higher', 'not_verified'
  deduction_rate DECIMAL(5,2), -- 0, 20, 30
  verification_response JSONB, -- full HMRC response
  verified_by UUID REFERENCES users(id),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cis_verifications_subcontractor_id ON cis_verifications(subcontractor_id);
CREATE INDEX idx_cis_verifications_expires_at ON cis_verifications(expires_at);
```

#### integrations
```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'xero', 'quickbooks', 'hmrc'
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  tenant_id VARCHAR(255), -- Xero organization ID / QB company ID
  is_active BOOLEAN DEFAULT true,
  settings JSONB, -- provider-specific settings
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_integrations_company_id ON integrations(company_id);
CREATE UNIQUE INDEX idx_integrations_company_provider ON integrations(company_id, provider);
```

#### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES users(id),
  entity_type VARCHAR(50) NOT NULL, -- 'invoice', 'payment', 'subcontractor'
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'deleted', 'approved', 'paid'
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

## API Architecture

### Authentication

**NextAuth.js Configuration**:
- Credentials provider (email/password)
- Magic link provider (passwordless)
- JWT strategy for session management
- Secure httpOnly cookies

**Auth Flow**:
1. User submits email/password
2. API validates credentials, checks 2FA if enabled
3. Generate JWT with user ID, company ID, role
4. Return secure httpOnly cookie
5. Middleware validates JWT on protected routes

**Role-Based Access Control**:
- `admin`: Full access to company data
- `finance`: Payment runs, approve invoices, reports
- `project_manager`: View invoices, approve, manage subcontractors
- `subcontractor`: Submit invoices, view own data only

### API Routes Structure

```
/api
  /auth
    /login (POST)
    /logout (POST)
    /register (POST)
    /verify-email (POST)
    /reset-password (POST)

  /subcontractors
    / (GET, POST) - list/create
    /[id] (GET, PUT, DELETE) - single subcontractor
    /[id]/verify-cis (POST) - trigger CIS verification
    /[id]/invoices (GET) - subcontractor's invoices

  /invoices
    / (GET, POST) - list/create
    /[id] (GET, PUT, DELETE)
    /[id]/upload (POST) - upload invoice file
    /[id]/validate (POST) - trigger AI validation
    /[id]/approve (POST) - approve invoice
    /[id]/reject (POST) - reject invoice
    /[id]/documents (GET, POST) - supporting documents

  /projects
    / (GET, POST)
    /[id] (GET, PUT, DELETE)
    /[id]/invoices (GET) - project invoices
    /[id]/subcontractors (GET) - project subcontractors

  /payment-runs
    / (GET, POST)
    /[id] (GET, PUT, DELETE)
    /[id]/add-invoices (POST) - add invoices to run
    /[id]/export-xero (POST) - export to Xero
    /[id]/export-quickbooks (POST) - export to QB
    /[id]/mark-paid (POST) - mark as paid

  /integrations
    /hmrc
      /verify-cis (POST) - verify subcontractor with HMRC
      /submit-return (POST) - submit monthly CIS return
    /xero
      /connect (GET) - initiate OAuth
      /callback (GET) - OAuth callback
      /disconnect (POST)
      /sync-suppliers (POST) - sync subcontractors to Xero
    /quickbooks
      /connect (GET)
      /callback (GET)
      /disconnect (POST)

  /analytics
    /dashboard (GET) - main dashboard metrics
    /payment-cycle (GET) - payment cycle trends
    /subcontractor-performance (GET)
    /project-costs (GET)

  /ai
    /ocr-invoice (POST) - extract data from invoice image
    /validate-invoice (POST) - run AI validation checks
    /check-duplicates (POST) - vector search for duplicates

  /webhooks
    /stripe (POST) - Stripe billing webhooks
    /xero (POST) - Xero webhooks
    /quickbooks (POST) - QuickBooks webhooks
```

### API Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Invoice created successfully",
  "timestamp": "2025-10-16T10:30:00Z"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invoice number already exists",
    "details": {
      "field": "invoice_number",
      "existingInvoice": "inv-123"
    }
  },
  "timestamp": "2025-10-16T10:30:00Z"
}
```

**Pagination**:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalRecords": 87
  }
}
```

---

## AI/ML Architecture

### Invoice OCR Pipeline

**Flow**:
1. User uploads invoice (PDF or image)
2. Convert PDF to image if needed (pdf-lib)
3. Send to OpenAI GPT-4 Vision API
4. Extract structured data: invoice number, date, amount, UTR, description
5. Store extracted data in database
6. Return to user for confirmation/editing

**Prompt Template**:
```
Extract the following information from this invoice:
- Invoice number
- Invoice date (DD/MM/YYYY)
- Amount (total including VAT if shown)
- Subcontractor name
- Subcontractor UTR (if visible)
- Work description
- Any CIS deduction noted

Return as JSON with confidence scores for each field.
```

**Error Handling**:
- If confidence <80%, flag for manual review
- Multiple OCR attempts with different preprocessing
- Fallback to manual entry

### AI Invoice Validation System

**Architecture**:
```
┌──────────────┐
│ Invoice      │
│ Submitted    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Validation Orchestrator              │
│ (runs all checks in parallel)        │
└──────┬───────────────────────────────┘
       │
       ├─────────┬────────┬─────────┬────────────┐
       ▼         ▼        ▼         ▼            ▼
   ┌──────┐ ┌──────┐ ┌──────┐ ┌─────────┐  ┌──────────┐
   │Dupli-│ │Price │ │ CIS  │ │Document │  │ PO Match │
   │cate  │ │Anom  │ │Check │ │Complete │  │ (if PO)  │
   │Check │ │aly   │ │      │ │         │  │          │
   └───┬──┘ └───┬──┘ └───┬──┘ └────┬────┘  └────┬─────┘
       │        │        │         │            │
       └────────┴────────┴─────────┴────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Risk Scorer  │
                  │ (ML model)   │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Return       │
                  │ Validation   │
                  │ Result       │
                  └──────────────┘
```

### Validation Checks Detail

#### 1. Duplicate Detection
**Technology**: Pinecone vector database

**Process**:
1. Generate embedding of invoice (invoice number + amount + date + subcontractor)
2. Query Pinecone for similar vectors (cosine similarity >0.95)
3. If match found, flag as potential duplicate
4. Return matched invoice details

**Data Structure**:
```typescript
{
  vector: [0.123, -0.456, ...], // embedding
  metadata: {
    invoiceId: "uuid",
    invoiceNumber: "INV-123",
    amount: 2450.00,
    date: "2025-10-15",
    subcontractorId: "uuid"
  }
}
```

#### 2. Pricing Anomaly Detection
**Technology**: scikit-learn (Isolation Forest)

**Process**:
1. Fetch historical invoices for subcontractor (last 12 months)
2. Calculate statistics: mean, std dev, quartiles
3. Check if new invoice is outlier (>2 std dev or >20% above Q3)
4. If project budget available, check if invoice exceeds remaining budget
5. Return anomaly score and details

**Model Training**:
- Train on customer's historical data after 20+ invoices
- Retrain monthly
- Features: amount, day_of_week, invoice_frequency, project_stage

#### 3. CIS Compliance Check
**Technology**: Rule-based validation

**Checks**:
- Is subcontractor CIS verified? (check expiry date)
- Is CIS deduction calculated correctly? (20% standard, 30% higher, 0% gross)
- Does invoice exceed £1,000 threshold requiring verification?
- Is UTR valid format? (10 digits)

#### 4. Document Completeness Check
**Technology**: Rule-based + GPT-4 for document classification

**Checks**:
- Invoice file attached?
- If amount >£5,000, timesheet required?
- If first invoice from subcontractor, insurance certificate required?
- Work photos attached for site work?

#### 5. Purchase Order Matching (if PO exists)
**Technology**: GPT-4 text comparison

**Process**:
1. Fetch PO for project/subcontractor
2. Use GPT-4 to compare PO description vs invoice description
3. Check amount vs PO value
4. Flag if overage or scope mismatch

### Risk Scoring Algorithm

**Weights**:
- Duplicate detected: +40 points (High Risk)
- Pricing anomaly >50%: +30 points (High Risk)
- CIS verification missing/expired: +40 points (High Risk)
- Missing required documents: +20 points (Medium Risk)
- Pricing anomaly 20-50%: +15 points (Medium Risk)
- PO overage: +15 points (Medium Risk)

**Risk Levels**:
- 0-20 points: Low Risk (auto-approve eligible)
- 21-50 points: Medium Risk (review recommended)
- 51+ points: High Risk (manual review required)

**Output**:
```json
{
  "riskScore": 65,
  "riskLevel": "high",
  "checks": {
    "duplicateCheck": {
      "passed": false,
      "confidence": 0.96,
      "details": "Potential duplicate of INV-2024-088",
      "points": 40
    },
    "pricingAnomalyCheck": {
      "passed": true,
      "confidence": 1.0,
      "details": "Invoice amount within normal range",
      "points": 0
    },
    "cisComplianceCheck": {
      "passed": false,
      "confidence": 1.0,
      "details": "CIS verification expired on 01/10/2025",
      "points": 40
    },
    "documentCompletenessCheck": {
      "passed": true,
      "confidence": 1.0,
      "details": "All required documents present",
      "points": 0
    }
  },
  "recommendation": "Manual review required before approval",
  "suggestedActions": [
    "Verify this is not a duplicate invoice",
    "Re-verify subcontractor CIS status before payment"
  ]
}
```

---

## Integrations Architecture

### HMRC CIS API Integration

**Authentication**: OAuth 2.0
**Base URL**: `https://api.service.hmrc.gov.uk`

**Key Endpoints**:
1. `POST /organisations/cis/verification` - Verify subcontractor
2. `POST /organisations/cis/returns` - Submit monthly return
3. `GET /organisations/cis/returns/{id}` - Get return status

**Implementation**:
- Store access/refresh tokens encrypted in database
- Token refresh middleware (tokens expire after 4 hours)
- Retry logic for API failures (3 attempts with exponential backoff)
- Cache verification results for 24 hours

**Error Handling**:
- API downtime: Queue verification requests, process when available
- Invalid UTR: Mark subcontractor as "Verification Failed", notify admin
- Rate limiting: Implement queue with rate limiting

### Xero API Integration

**Authentication**: OAuth 2.0
**SDK**: xero-node SDK

**Key Operations**:
1. **Sync Subcontractors to Suppliers**:
   - Create contact in Xero for each subcontractor
   - Map fields: name, email, phone, address
   - Store Xero contact ID in integrations table

2. **Export Invoices as Bills**:
   - Create bill in Xero for each approved invoice
   - Set: supplier, amount, date, reference (invoice number)
   - Add line item for CIS deduction (negative amount)
   - Store Xero bill ID in invoice record

3. **Webhook Handling**:
   - Subscribe to bill payment events
   - Update invoice status to "Paid" when bill paid in Xero
   - Record payment date and reference

**Data Mapping**:
```typescript
// SiteSense → Xero
{
  subcontractor: {
    name → contact.name,
    email → contact.emailAddress,
    phone → contact.phones[0].phoneNumber,
    address → contact.addresses[0]
  },
  invoice: {
    invoiceNumber → bill.reference,
    amount → bill.lineItems[0].lineAmount,
    cisDeduction → bill.lineItems[1].lineAmount (negative),
    invoiceDate → bill.date,
    dueDate → bill.dueDate
  }
}
```

### QuickBooks API Integration

**Authentication**: OAuth 2.0
**SDK**: node-quickbooks

**Similar operations to Xero**:
- Sync subcontractors as Vendors
- Export invoices as Bills
- Webhook for bill payments

---

## Security Architecture

### Authentication & Authorization

**Password Security**:
- bcrypt hashing (10 rounds)
- Minimum password strength: 8 chars, 1 uppercase, 1 number
- Rate limiting: 5 failed attempts → 15min lockout

**JWT Structure**:
```json
{
  "userId": "uuid",
  "companyId": "uuid",
  "role": "admin",
  "email": "user@example.com",
  "iat": 1697454600,
  "exp": 1697458200
}
```

**Session Management**:
- JWT expiry: 1 hour
- Refresh token: 30 days
- Rotate refresh tokens on use
- Revoke all sessions on password change

**API Security**:
- HTTPS only (TLS 1.3)
- Rate limiting: 100 req/min per IP, 1000 req/min per authenticated user
- CORS: Restrict to app domain
- CSRF protection: SameSite cookies

### Data Security

**Encryption**:
- At rest: Database encryption (Supabase AES-256)
- In transit: TLS 1.3
- Sensitive fields: Encrypt access tokens, refresh tokens (AES-256)

**File Security**:
- Signed URLs for document access (expire in 1 hour)
- Virus scanning on upload (ClamAV)
- File type validation (PDF, JPG, PNG only)
- Max file size: 10MB

**Audit Logging**:
- Log all financial actions (invoice approval, payments)
- Log all CIS verifications
- Log all integration actions (export, sync)
- Retain logs for 6 years (UK requirement)

### Compliance

**GDPR**:
- Data processing agreement with customers
- Right to erasure (anonymize data, keep financial records)
- Data export (JSON/CSV)
- Cookie consent
- Privacy policy + Terms of Service

**Data Retention**:
- CIS records: 6 years
- Invoices: 6 years
- Audit logs: 6 years
- User activity logs: 2 years

---

## Performance Optimization

### Caching Strategy

**Redis (Vercel KV)**:
- User sessions: 1 hour TTL
- CIS verifications: 24 hour TTL
- Dashboard analytics: 5 minute TTL
- Subcontractor lists: 15 minute TTL

**CDN Caching**:
- Static assets: 1 year (immutable)
- Invoice PDFs: No cache (signed URLs)
- API responses: No cache (dynamic data)

### Database Optimization

**Indexes** (see schema above):
- Primary keys: UUID (gen_random_uuid)
- Foreign keys: Indexed
- Query filters: Indexed (status, created_at, company_id)

**Query Optimization**:
- Use Prisma query optimization
- Pagination on all lists (20 items per page)
- Lazy load invoice documents (fetch on demand)
- Aggregate queries for analytics (use views)

**Connection Pooling**:
- Prisma connection pool: 10 connections
- Supabase pooler: 100 connections

### API Performance

**Response Times (Target)**:
- List endpoints: <200ms
- Single resource: <100ms
- Create/Update: <300ms
- AI validation: <10s
- OCR: <5s

**Optimization Techniques**:
- Parallel processing (AI checks run concurrently)
- Background jobs for non-urgent tasks (email, webhooks)
- Streaming responses for large datasets
- Compression (gzip)

---

## Monitoring & Observability

### Error Tracking
**Sentry**:
- JavaScript errors (frontend)
- API errors (backend)
- Integration errors
- AI/ML errors
- Alert on >1% error rate

### Performance Monitoring
**Vercel Analytics**:
- Core Web Vitals (LCP, FID, CLS)
- API response times
- Edge function execution time
- Cache hit rates

### Product Analytics
**PostHog**:
- User actions: invoice submitted, approved, paid
- Feature usage: AI validation, integrations, reports
- Funnel analysis: signup → first invoice → first payment
- Retention cohorts

### Logging
**Vercel Logs + Supabase Logs**:
- API requests/responses
- Integration calls (HMRC, Xero, QB)
- AI API calls (cost tracking)
- Database queries (slow query log)

### Alerts
- Error rate >1%: Slack + email
- API response time >2s: Slack
- AI validation failure rate >10%: Email
- HMRC API failure: Immediate Slack alert
- Database connection failures: Immediate alert

---

## Deployment Strategy

### Environments

1. **Development** (local)
   - Local Next.js dev server
   - Supabase local dev (Docker)
   - Mock external APIs (MSW)

2. **Staging** (Vercel preview)
   - Deploys on every PR
   - Uses staging Supabase instance
   - Test integrations (sandbox APIs)

3. **Production** (Vercel production)
   - Deploys on main branch merge
   - Production Supabase
   - Live integrations

### CI/CD Pipeline

**GitHub Actions Workflow**:
```yaml
1. Lint & Format Check (ESLint, Prettier)
2. Type Check (TypeScript)
3. Unit Tests (Vitest)
4. Build (Next.js)
5. E2E Tests (Playwright) - staging only
6. Deploy to Vercel (auto)
```

### Database Migrations

**Prisma Migrate**:
- Dev: `prisma migrate dev` (local)
- Staging: `prisma migrate deploy` (on push)
- Production: `prisma migrate deploy` (on main merge, with backup)

**Migration Safety**:
- Always backward compatible
- No destructive changes without approval
- Backup before production migration
- Rollback plan for each migration

### Rollback Strategy

**Vercel**:
- Instant rollback to previous deployment (one-click)
- Keep last 10 deployments available

**Database**:
- Automated backups every 6 hours
- Point-in-time recovery (7 days)
- Manual backup before migrations

---

## Disaster Recovery

### Backup Strategy
- **Database**: Automated daily backups (Supabase), retained 30 days
- **Files**: S3 versioning enabled, retained 90 days
- **Configurations**: Stored in Git, env vars in Vercel

### Recovery Time Objectives
- **RTO** (Recovery Time Objective): 4 hours
- **RPO** (Recovery Point Objective): 6 hours (max data loss)

### Incident Response Plan
1. Detect incident (monitoring alerts)
2. Triage severity (P0: service down, P1: degraded, P2: minor)
3. Notify team (Slack alert)
4. Investigate and fix
5. Post-mortem (for P0/P1)

---

## Scalability Plan

### Current Architecture Limits
- 1,000 companies
- 20,000 subcontractors
- 50,000 invoices/month
- 1M AI validation checks/month

### Scaling Strategy (when needed)

**Phase 1** (1K → 10K companies):
- Increase Supabase plan (more connections, storage)
- Increase Vercel plan (more function executions)
- Implement more aggressive caching
- Optimize database queries

**Phase 2** (10K → 100K companies):
- Read replicas for database (Supabase)
- Separate AI/ML service (Python microservice)
- Multi-region deployment (EU + UK)
- Implement sharding by company_id

**Phase 3** (100K+ companies):
- Microservices architecture (invoice service, payment service, etc.)
- Event-driven architecture (Kafka/RabbitMQ)
- Dedicated AI infrastructure
- Multi-tenant database per shard

---

## Cost Estimation (MVP)

### Monthly Costs (Estimated)

**Infrastructure**:
- Vercel Pro: $20/month (1 team member)
- Supabase Pro: $25/month (8GB database, 100GB bandwidth)
- Vercel KV (Redis): $10/month (basic plan)
- Domain: $1/month

**AI/ML**:
- OpenAI API: ~$200/month (est. 1,000 invoices OCR + validation)
- Pinecone: $70/month (starter plan, 100k vectors)

**Integrations**:
- HMRC API: Free
- Xero API: Free (per-company OAuth)
- QuickBooks API: Free (per-company OAuth)

**Services**:
- Resend (email): $20/month (50k emails)
- Sentry: Free tier (5k events)
- PostHog: Free tier (1M events)

**Total MVP Cost**: ~$350/month

**At 50 customers (avg £350/month)**:
- Monthly Revenue: £17,500
- Monthly Costs: £2,000 (includes $1,500 AI costs for 50 customers)
- Gross Margin: 89%

---

## Next Steps

1. **Set up development environment**
2. **Initialize Next.js project with TypeScript**
3. **Set up Supabase project and database schema**
4. **Implement authentication (NextAuth.js)**
5. **Build API routes foundation**
6. **Start with subcontractor management CRUD**

Ready to start building?
