# SiteSense MVP - Development Roadmap

## Timeline Overview

**Total Duration**: 20 weeks (5 months)
**Target Launch**: Week 20
**Beta Testing**: Weeks 17-19
**First Pilot Customer**: Week 16

---

## Sprint Structure

- **Sprint Duration**: 2 weeks
- **Total Sprints**: 10
- **Sprint Planning**: Monday of Week 1
- **Sprint Review & Retro**: Friday of Week 2
- **Working Days**: Assume 5 days/week

---

## Sprints Breakdown

### Sprint 1 (Weeks 1-2): Foundation & Setup

**Goals**: Set up development environment, initialize project, implement authentication

**Tasks**:

**Week 1**:
- [x] Set up development machine
  - Install Node.js 20+, pnpm, VS Code
  - Install PostgreSQL (or Supabase CLI)
  - Set up Git and GitHub repo
- [ ] Initialize Next.js 14 project
  - `npx create-next-app@latest sitesense --typescript --tailwind --app`
  - Configure ESLint, Prettier
  - Set up folder structure
- [ ] Set up Supabase project
  - Create project on Supabase cloud
  - Get connection strings and API keys
  - Set up local development environment
- [ ] Install dependencies
  - Prisma, NextAuth.js, Zod, React Hook Form
  - Shadcn/ui components
  - date-fns, clsx, etc.
- [ ] Configure Prisma
  - Initialize Prisma: `npx prisma init`
  - Configure database connection
  - Create initial schema (users, companies)

**Week 2**:
- [ ] Implement authentication (NextAuth.js)
  - Set up NextAuth.js configuration
  - Create login/register pages
  - Implement credentials provider
  - Add JWT session strategy
  - Create middleware for protected routes
- [ ] Create auth API routes
  - `/api/auth/register` (POST)
  - `/api/auth/login` (POST)
  - `/api/auth/me` (GET)
- [ ] Build login/register UI
  - Login form with email/password
  - Register form with company details
  - Password strength validation
  - Error handling
- [ ] Set up environment variables
  - `.env.local` for local development
  - Document required variables in README

**Deliverable**: Working authentication system, users can register and log in

---

### Sprint 2 (Weeks 3-4): Database Schema & Core Models

**Goals**: Implement database schema, create CRUD operations for core entities

**Tasks**:

**Week 3**:
- [ ] Complete Prisma schema
  - Companies table
  - Users table
  - Subcontractors table
  - Projects table
  - Invoices table (basic)
  - Audit logs table
- [ ] Run first migration
  - `npx prisma migrate dev --name init`
  - Verify tables created in database
  - Seed database with test data
- [ ] Create Prisma client wrapper
  - Singleton pattern for Next.js
  - Error handling utilities
  - Type exports
- [ ] Build company onboarding flow
  - Company details form (name, address, etc.)
  - Save to database on registration
  - Redirect to dashboard after setup

**Week 4**:
- [ ] Implement subcontractor CRUD API
  - `/api/subcontractors` (GET, POST)
  - `/api/subcontractors/[id]` (GET, PUT, DELETE)
  - Validation with Zod schemas
  - Pagination support
- [ ] Implement projects CRUD API
  - `/api/projects` (GET, POST)
  - `/api/projects/[id]` (GET, PUT, DELETE)
  - Link projects to company
- [ ] Create base dashboard layout
  - Navigation sidebar
  - Header with user menu
  - Breadcrumbs
  - Responsive design
- [ ] Set up React Query
  - Configure QueryClient
  - Create custom hooks for API calls
  - Add loading and error states

**Deliverable**: Database fully set up, API routes for subcontractors and projects working

---

### Sprint 3 (Weeks 5-6): Subcontractor Management UI

**Goals**: Build subcontractor management interface

**Tasks**:

**Week 5**:
- [ ] Build subcontractor list page
  - Table with subcontractor data
  - Search and filter functionality
  - Pagination
  - Actions (view, edit, delete)
- [ ] Create subcontractor detail page
  - Display all subcontractor information
  - Show associated invoices
  - Performance metrics (basic)
  - Edit mode
- [ ] Build add/edit subcontractor form
  - Form with all fields (name, UTR, contact, address)
  - Validation (UTR format, required fields)
  - Submit to API
  - Success/error notifications

**Week 6**:
- [ ] Implement CIS verification UI placeholder
  - "Verify CIS" button on subcontractor detail
  - Show verification status (verified, pending, expired)
  - Mock verification for now (real HMRC integration in Sprint 6)
- [ ] Create project list page
  - Table with project data
  - Filters by status
  - Create new project button
- [ ] Build project detail page
  - Project information
  - Budget tracking (placeholder)
  - Assigned subcontractors list
  - Associated invoices
- [ ] Add/edit project form
  - Project name, address, budget, dates
  - Validation
  - Submit to API

**Deliverable**: Complete subcontractor and project management UI

---

### Sprint 4 (Weeks 7-8): Invoice Submission & Management

**Goals**: Build invoice submission flow for subcontractors and admin review interface

**Tasks**:

**Week 7**:
- [ ] Implement file upload infrastructure
  - Set up Supabase Storage bucket
  - Create upload utility functions
  - Handle PDF and image formats
  - Virus scanning (basic validation for now)
  - Generate signed URLs
- [ ] Build invoice submission API
  - `/api/invoices` (POST)
  - Handle file uploads
  - Store invoice metadata
  - Link to subcontractor and project
  - Calculate CIS deduction (basic formula)
- [ ] Create subcontractor portal
  - Separate login for subcontractors
  - Dashboard showing their invoices
  - Submit new invoice button
- [ ] Build invoice submission form (subcontractor side)
  - Upload invoice file (PDF/image)
  - Select project
  - Enter amount, date, description
  - Upload supporting documents
  - Submit button

**Week 8**:
- [ ] Build admin invoice list page
  - Table with all submitted invoices
  - Filter by status, subcontractor, project
  - Search functionality
  - Pagination
  - Status badges (submitted, approved, paid)
- [ ] Create invoice detail page (admin)
  - Display invoice information
  - Show uploaded documents (PDF viewer)
  - Show extracted data (when OCR added)
  - Approval workflow buttons
- [ ] Implement invoice approval workflow
  - `/api/invoices/[id]/approve` (POST)
  - `/api/invoices/[id]/reject` (POST)
  - Update invoice status
  - Send notifications
  - Record in audit log
- [ ] Add invoice status tracking
  - Timeline view (submitted → reviewed → approved → paid)
  - Date stamps for each status change
  - Who approved/reviewed

**Deliverable**: Working invoice submission and approval system (without AI validation yet)

---

### Sprint 5 (Weeks 9-10): HMRC CIS Integration

**Goals**: Integrate with HMRC CIS API for subcontractor verification

**Tasks**:

**Week 9**:
- [ ] Research HMRC CIS API
  - Read documentation
  - Set up test account on HMRC Developer Hub
  - Obtain test credentials
  - Understand OAuth 2.0 flow
- [ ] Implement HMRC OAuth 2.0
  - `/api/integrations/hmrc/connect` (initiate OAuth)
  - `/api/integrations/hmrc/callback` (handle redirect)
  - Store access/refresh tokens (encrypted)
  - Token refresh middleware
- [ ] Create CIS verification API
  - `/api/subcontractors/[id]/verify-cis` (POST)
  - Call HMRC verification endpoint
  - Parse response
  - Store verification result
  - Update subcontractor CIS status
- [ ] Handle HMRC API errors
  - API downtime handling
  - Invalid UTR errors
  - Rate limiting
  - Queue system for retry

**Week 10**:
- [ ] Build HMRC integration UI
  - Settings page for HMRC connection
  - "Connect to HMRC" button (OAuth flow)
  - Connection status indicator
  - Disconnect button
- [ ] Update subcontractor detail page
  - Real CIS verification button
  - Show verification details (status, date, expires)
  - Re-verification button
  - Verification history log
- [ ] Implement CIS deduction calculation
  - Update invoice creation to use verified CIS status
  - Calculate correct deduction rate (0%, 20%, 30%)
  - Show gross vs net payment amounts
- [ ] Add CIS expiry alerts
  - Background job to check expiring verifications
  - Email alerts 7 days before expiry
  - Dashboard notification

**Deliverable**: Full HMRC CIS integration working, automatic verification

---

### Sprint 6 (Weeks 11-12): AI Invoice OCR

**Goals**: Implement GPT-4 Vision for invoice data extraction

**Tasks**:

**Week 11**:
- [ ] Set up OpenAI API
  - Get API key
  - Install OpenAI SDK
  - Create wrapper utilities
  - Set up cost tracking
- [ ] Build invoice OCR function
  - Create `/lib/ai/extractInvoiceData.ts`
  - Implement GPT-4 Vision API call
  - Design prompt for invoice extraction
  - Parse JSON response
  - Handle errors and retries
- [ ] Implement PDF to image conversion
  - Install pdf-lib or pdf2pic
  - Convert first page of PDF to JPEG
  - Handle different PDF types
  - Store converted image
- [ ] Create OCR API endpoint
  - `/api/ai/ocr-invoice` (POST)
  - Accept image or PDF URL
  - Call OCR function
  - Return extracted data
  - Store result in database

**Week 12**:
- [ ] Integrate OCR into invoice submission
  - Auto-trigger OCR on file upload
  - Pre-fill form fields with extracted data
  - Show confidence scores
  - Allow manual correction
  - Flag low-confidence fields
- [ ] Build OCR review interface
  - Side-by-side view: document + extracted data
  - Highlight low-confidence fields
  - Edit extracted values
  - Re-run OCR button
  - Confirm and continue
- [ ] Handle OCR edge cases
  - Low-resolution images
  - Handwritten invoices
  - Multiple pages
  - Non-standard formats
  - Fallback to manual entry
- [ ] Add OCR analytics
  - Track accuracy (manual corrections)
  - Monitor API costs
  - Log failed extractions

**Deliverable**: Automatic invoice data extraction working, saves 80% of data entry time

---

### Sprint 7 (Weeks 13-14): AI Invoice Validation - Part 1

**Goals**: Implement duplicate detection and pricing anomaly detection

**Tasks**:

**Week 13**:
- [ ] Set up Pinecone vector database
  - Create Pinecone account
  - Set up index for invoice vectors
  - Configure dimensions for embeddings
  - Get API key
- [ ] Implement duplicate detection
  - Create `/lib/ai/duplicateDetection.ts`
  - Generate embeddings with OpenAI
  - Store vectors in Pinecone
  - Query for similar invoices
  - Return matched invoices with similarity score
- [ ] Build duplicate detection API
  - `/api/ai/check-duplicates` (POST)
  - Accept invoice data
  - Call duplicate detection function
  - Return results
- [ ] Integrate duplicate check into validation
  - Trigger on invoice submission
  - Show warning if potential duplicate
  - Allow override with reason
  - Record in audit log

**Week 14**:
- [ ] Implement pricing anomaly detection
  - Create `/lib/ai/pricingAnomalyDetection.ts`
  - Fetch historical invoices for subcontractor
  - Calculate statistics (mean, std dev)
  - Detect outliers
  - Check against project budget
- [ ] Build pricing anomaly API
  - `/api/ai/check-pricing-anomaly` (POST)
  - Accept invoice data
  - Call anomaly detection function
  - Return analysis
- [ ] Integrate pricing check into validation
  - Trigger on invoice submission
  - Show warning if anomaly detected
  - Display statistics (historical average, % above/below)
  - Allow approval with notes
- [ ] Build validation results UI (basic)
  - Show check results on invoice detail page
  - Color-coded badges (passed, warning, failed)
  - Expandable details for each check

**Deliverable**: Duplicate detection and pricing anomaly detection working

---

### Sprint 8 (Weeks 15-16): AI Invoice Validation - Part 2

**Goals**: Complete CIS compliance and document completeness checks, build risk scoring

**Tasks**:

**Week 15**:
- [ ] Implement CIS compliance check
  - Create `/lib/ai/cisComplianceCheck.ts`
  - Check CIS verification status and expiry
  - Validate deduction calculation
  - Check £1,000 threshold rule
  - Validate UTR format
- [ ] Implement document completeness check
  - Create `/lib/ai/documentCompletenessCheck.ts`
  - Check required documents present
  - Validate document types
  - Check file sizes and formats
  - Verify supporting documents (timesheets, photos)
- [ ] Build validation orchestrator
  - Create `/lib/ai/validateInvoice.ts`
  - Run all checks in parallel
  - Aggregate results
  - Handle errors gracefully
  - Return combined result
- [ ] Create validation API endpoint
  - `/api/invoices/[id]/validate` (POST)
  - Trigger full validation
  - Store result in database
  - Return result to frontend

**Week 16**:
- [ ] Implement risk scoring algorithm
  - Create `/lib/ai/riskScoring.ts`
  - Calculate weighted point system
  - Classify risk level (low, medium, high)
  - Generate recommendations
  - Generate suggested actions
- [ ] Build comprehensive validation UI
  - Invoice detail page validation section
  - Show all check results
  - Display risk score and level
  - Show recommended actions
  - Allow manual override
- [ ] Add validation to invoice workflow
  - Auto-validate on submission
  - Show validation status in invoice list
  - Filter by risk level
  - Email alerts for high-risk invoices
- [ ] Create validation dashboard
  - Overview of validation metrics
  - Chart: invoices by risk level
  - Most common issues
  - Validation accuracy tracking

**Deliverable**: Complete AI validation system working end-to-end

---

### Sprint 9 (Weeks 17-18): Integrations & Analytics

**Goals**: Integrate with Xero/QuickBooks, build analytics dashboard

**Tasks**:

**Week 17**:
- [ ] Implement Xero integration
  - Set up Xero app on Xero Developer Portal
  - Implement OAuth 2.0 flow
  - `/api/integrations/xero/connect` (GET)
  - `/api/integrations/xero/callback` (GET)
  - Store tokens in database
- [ ] Build Xero sync functions
  - Sync subcontractors to Xero contacts
  - Export approved invoices as bills
  - Map fields correctly
  - Handle API errors
  - Webhook handler for payment updates
- [ ] Build Xero integration UI
  - Settings page for Xero connection
  - "Connect to Xero" button
  - Sync status indicators
  - Manual sync buttons
  - Connection status
- [ ] Create payment runs feature
  - `/api/payment-runs` (GET, POST)
  - Group approved invoices
  - Set payment date
  - Calculate totals
  - Export to Xero/QuickBooks

**Week 18**:
- [ ] Implement QuickBooks integration
  - Similar to Xero (OAuth, sync, export)
  - `/api/integrations/quickbooks/*`
  - Test with sandbox account
- [ ] Build payment tracking
  - Payment runs list page
  - Payment run detail page
  - Mark as paid workflow
  - Notify subcontractors
- [ ] Create analytics dashboard
  - Key metrics cards (payment cycle, outstanding, etc.)
  - Charts (payment trends, subcontractor spend)
  - Project cost tracking
  - CIS deduction summary
- [ ] Build reports
  - Monthly CIS return data
  - Subcontractor payment history
  - Project cost reports
  - Export to CSV/PDF

**Deliverable**: Xero/QuickBooks integration working, analytics dashboard live

---

### Sprint 10 (Weeks 19-20): Polish, Testing & Launch Prep

**Goals**: Bug fixes, performance optimization, security audit, launch preparation

**Tasks**:

**Week 19**:
- [ ] End-to-end testing
  - Test full user journeys
  - Register → onboard subcontractor → submit invoice → validate → approve → pay
  - Test all edge cases
  - Fix critical bugs
- [ ] Performance optimization
  - Optimize database queries (add indexes)
  - Implement caching where appropriate
  - Lazy load heavy components
  - Optimize image loading
  - Test with large datasets (1000+ invoices)
- [ ] Security audit
  - Review authentication flows
  - Check authorization on all API routes
  - Validate input sanitization
  - Test rate limiting
  - Review data encryption
  - CSRF protection
- [ ] Mobile responsiveness
  - Test all pages on mobile devices
  - Fix layout issues
  - Optimize touch interactions
  - Test file uploads on mobile

**Week 20**:
- [ ] UI/UX polish
  - Consistent styling across all pages
  - Loading states for all async operations
  - Error messages user-friendly
  - Success notifications
  - Empty states (no data yet)
  - Onboarding tooltips
- [ ] Documentation
  - README with setup instructions
  - API documentation
  - Environment variables documentation
  - Deployment guide
  - User guide (basic)
- [ ] Set up production environment
  - Deploy to Vercel
  - Configure production database (Supabase)
  - Set up production API keys (OpenAI, Pinecone, HMRC)
  - Configure DNS and SSL
  - Set up monitoring (Sentry, Vercel Analytics)
- [ ] Prepare for beta launch
  - Create onboarding materials for pilot customers
  - Set up support email/chat
  - Prepare launch announcement
  - Invite 5-10 pilot customers
  - Schedule launch for Week 20 Friday

**Deliverable**: Production-ready MVP launched to pilot customers

---

## Development Best Practices

### Code Quality
- **TypeScript**: Use strict mode, no `any` types
- **Linting**: ESLint + Prettier, auto-format on save
- **Testing**: Write tests for critical functions (AI validation, calculations)
- **Code Review**: Self-review before committing (checklist: types, errors handled, tested)

### Git Workflow
- **Branches**: `main` (production), `develop` (staging), feature branches
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **PRs**: Create PR for each feature, merge to `develop`, then to `main`

### Documentation
- **Code Comments**: For complex logic, especially AI functions
- **README**: Keep updated with setup instructions
- **API Docs**: Document all API endpoints (OpenAPI)
- **Inline Docs**: JSDoc for functions

### Performance
- **Database**: Use indexes, avoid N+1 queries
- **API**: Implement pagination, use React Query for caching
- **Frontend**: Code splitting, lazy loading, optimize images

### Security
- **Environment Variables**: Never commit secrets, use `.env.local`
- **Input Validation**: Zod schemas for all user input
- **SQL Injection**: Use Prisma parameterized queries
- **XSS**: Sanitize user input, use React's built-in escaping

---

## Risk Management

### Technical Risks

**Risk**: HMRC API is unreliable or slow
**Mitigation**: Implement robust retry logic, cache verifications, provide manual override

**Risk**: AI validation accuracy below expectations
**Mitigation**: Start with human-in-the-loop, tune thresholds based on feedback, allow overrides

**Risk**: Database performance degrades with large datasets
**Mitigation**: Implement pagination, add database indexes, optimize queries early

**Risk**: Xero/QuickBooks API changes break integration
**Mitigation**: Use official SDKs, monitor changelogs, implement graceful degradation

### Timeline Risks

**Risk**: Features take longer than estimated
**Mitigation**: Start with core features (invoices, validation), defer nice-to-haves, parallelize work where possible

**Risk**: Waiting on external approvals (HMRC developer access)
**Mitigation**: Start application early, use test/sandbox credentials, mock APIs if needed

### Scope Risks

**Risk**: Feature creep during development
**Mitigation**: Strict MVP scope, say no to new features, create backlog for v2

---

## Post-Launch Roadmap (Weeks 21-30)

### Phase 1: Stabilization (Weeks 21-22)
- Monitor errors and crashes (Sentry)
- Fix critical bugs reported by pilot customers
- Optimize performance based on real usage
- Improve AI validation based on feedback

### Phase 2: Iteration (Weeks 23-26)
- Add features based on customer requests
- Improve UI/UX based on feedback
- Expand integrations (more accounting software)
- Add mobile app (if demand)

### Phase 3: Scale (Weeks 27-30)
- Marketing push (content, SEO, ads)
- Onboard 50+ customers
- Build sales funnel
- Hire first support person

### Phase 4: V2 Features (Month 7+)
- Safety monitoring (AI PPE detection)
- Material tracking
- Project scheduling
- Advanced analytics
- Mobile native apps

---

## Success Metrics (Track Weekly)

### Development Velocity
- Features completed vs. planned
- Bugs introduced vs. fixed
- Code quality (TypeScript errors, lint warnings)

### Product Metrics (Post-Launch)
- Active users (DAU, WAU, MAU)
- Invoices processed per week
- AI validation accuracy (% requiring manual override)
- Average payment cycle time (goal: <35 days)
- Customer satisfaction (NPS, support tickets)

### Business Metrics (Post-Launch)
- New customer signups per week
- Trial to paid conversion rate
- Monthly recurring revenue (MRR)
- Churn rate
- Customer acquisition cost (CAC)

---

## Resource Requirements

### Solo Founder (You)
**Hours per Week**: 40-50 hours (full-time)

**Weekly Breakdown**:
- Development: 30-35 hours (6-7 hours/day)
- Planning & Meetings: 3-5 hours
- Customer Research: 2-3 hours
- Learning (new tech, APIs): 3-5 hours
- Admin & misc: 2-3 hours

**Recommended Schedule**:
- Monday: Planning, admin (lighter coding day)
- Tuesday-Thursday: Deep work, feature development
- Friday: Testing, bug fixes, review, planning next week
- Weekend: Breaks! (or catch-up if behind)

### Tools & Services Required

**Development** (~$100/month):
- GitHub (free for personal)
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Domain: $12/year
- Vercel KV (Redis): $10/month

**AI/ML** (~$200/month initially, scales with usage):
- OpenAI API: ~$150/month (est. 500 invoices)
- Pinecone: $70/month (starter)

**Integrations** (mostly free):
- HMRC API: Free
- Xero API: Free (OAuth)
- QuickBooks API: Free (OAuth)

**Services** (~$50/month):
- Resend (email): $20/month
- Sentry: Free tier initially
- PostHog: Free tier initially

**Total Monthly Cost**: ~$350-400

---

## Key Milestones

- **Week 2**: Authentication working
- **Week 4**: Database schema complete
- **Week 8**: Invoice submission and approval working
- **Week 10**: HMRC CIS integration live
- **Week 12**: Invoice OCR working
- **Week 16**: AI validation system complete
- **Week 18**: Xero integration working
- **Week 20**: MVP LAUNCHED 🚀

---

## Next Steps to Start Development

1. **Today**: Set up development environment (Node, pnpm, VS Code, Git)
2. **Tomorrow**: Initialize Next.js project, create GitHub repo
3. **This Week**: Complete Sprint 1 (authentication)
4. **Next Week**: Start Sprint 2 (database schema)

Ready to start coding?
