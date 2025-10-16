# SiteSense - Quick Setup Guide

## Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- PostgreSQL database (Railway, Supabase, or local)
- Anthropic API key for AI invoice validation
- Resend API key for emails (optional but recommended)

## Step-by-Step Setup

### 1. Clone and Install

```bash
git clone https://github.com/ptengelmann/SiteSense.git
cd SiteSense
pnpm install
```

### 2. Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

#### Required Variables

```env
# Database (Railway)
DATABASE_URL="your-railway-postgres-url"
DIRECT_URL="your-railway-postgres-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# AI (Anthropic)
ANTHROPIC_API_KEY="sk-ant-api03-..."  # Get from https://console.anthropic.com/

# Email (Resend)
RESEND_API_KEY="re_..."  # Get from https://resend.com/api-keys

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Getting API Keys

**Anthropic API Key** (Required for AI invoice OCR):
1. Go to https://console.anthropic.com/
2. Sign up for an account
3. Navigate to API Keys
4. Create a new key
5. Copy the key starting with `sk-ant-api03-...`
6. Add to `.env.local` as `ANTHROPIC_API_KEY`

**Resend API Key** (Required for email verification):
1. Go to https://resend.com/
2. Sign up for an account (free tier: 100 emails/day)
3. Navigate to API Keys
4. Create a new key
5. Copy the key starting with `re_...`
6. Add to `.env.local` as `RESEND_API_KEY`

**For development**, Resend allows you to use `onboarding@resend.dev` as the from address.

**For production**, you'll need to verify your own domain in Resend.

### 3. Database Setup

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database (creates tables)
pnpm db:push

# Alternative: Use migrations (recommended for production)
pnpm db:migrate
```

### 4. Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000

### 5. Create Your First Account

1. Navigate to http://localhost:3000/register
2. Fill in the registration form
3. Check your email for verification link
4. Click the verification link
5. Sign in at http://localhost:3000/login
6. Complete the onboarding wizard

## Features Overview

### ✅ What Works Now

- **AI Invoice OCR**: Upload PDF invoices, extract data automatically
- **Fraud Detection**: Duplicate detection, pricing anomalies, budget validation
- **Subcontractor Management**: CIS tracking, insurance expiry, CSCS cards
- **Project Management**: Budget tracking, CDM 2015 compliance
- **Payment Runs**: Batch payments with CIS calculations
- **Reports**: CIS monthly return, payment history, performance reports
- **CSV Export**: Export all data for accounting software
- **Email Verification**: Secure account creation with email verification
- **Onboarding Wizard**: Guided setup for new users

### 🚧 Coming Soon (Q1 2026)

- **HMRC CIS Integration**: Automated verification with HMRC
- **Xero Integration**: Two-way sync with Xero
- **QuickBooks Integration**: Two-way sync with QuickBooks

## Troubleshooting

### Database Connection Issues

If you see `Can't reach database server`:
- Check your DATABASE_URL is correct
- For Railway: Make sure your database isn't paused
- Test connection: `npx prisma db pull`

### Email Not Sending

If verification emails aren't sending:
- Check RESEND_API_KEY is correct
- Verify you're using `onboarding@resend.dev` for development
- Check Resend dashboard for logs: https://resend.com/emails
- Free tier limit: 100 emails/day

### TypeScript Errors

If you see TypeScript errors:
```bash
# Regenerate Prisma types
pnpm db:generate

# Restart dev server
pnpm dev
```

### Port Already in Use

If port 3000 is in use:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

## Testing the Application

### 1. Test Registration Flow

1. Go to `/register`
2. Create an account
3. Check your email
4. Verify email
5. Sign in
6. Complete onboarding

### 2. Test AI Invoice OCR

1. Navigate to Invoices → Create Invoice
2. Upload a PDF invoice (sample PDFs in `/test-data/` if available)
3. Select a subcontractor
4. Click "Analyze with AI"
5. Review extracted data and fraud detection results

### 3. Test CSV Export

1. Add some test data (subcontractors, invoices, etc.)
2. Navigate to any list view
3. Click "Export to CSV"
4. Open the downloaded file in Excel

## Production Deployment

### Database Migration

For production, use migrations instead of `db:push`:

```bash
# Create migration
pnpm db:migrate

# Apply migrations
pnpm db:migrate deploy
```

### Environment Variables for Production

Update these in your production environment:

```env
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

### Resend Domain Verification

1. Add your domain in Resend dashboard
2. Add DNS records to your domain
3. Wait for verification
4. Update FROM_EMAIL in code (`src/lib/email/resend.ts`)

## Support

- Documentation: See `VALUE_PROPOSITION_AND_WORKFLOW.md` for detailed workflows
- Issues: https://github.com/ptengelmann/SiteSense/issues
- Email: support@sitesense.co.uk

## Quick Reference

### Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma Client
pnpm db:push          # Push schema changes
pnpm db:migrate       # Create migration
pnpm db:studio        # Open Prisma Studio GUI

# Code Quality
pnpm lint             # Run ESLint
```

### Default Ports

- Next.js: http://localhost:3000
- Prisma Studio: http://localhost:5555

### First Login Credentials

After registration and email verification, use:
- Email: The email you registered with
- Password: The password you set

### Sample Test Data

For testing, you can use these realistic UK construction data:

**Sample Subcontractor:**
- Company: "ABC Electrical Ltd"
- UTR: "1234567890"
- CIS Status: STANDARD (20% deduction)
- Contact: "John Smith"
- Email: "john@abcelectrical.co.uk"

**Sample Project:**
- Name: "Meadow View Refurbishment"
- Type: REFURBISHMENT
- Budget: £150,000
- Client: "Meadow View Properties Ltd"

---

**You're all set!** 🎉

If you run into any issues, check the troubleshooting section or contact support.
