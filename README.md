# SiteSense

AI-powered subcontractor management and compliance platform for UK construction companies.

## Overview

SiteSense helps SME principal contractors reduce payment cycles from 83 days to 30 days by automating invoice validation, CIS compliance, and payment processing.

### Key Features

- **AI Invoice Validation**: Automatically detect duplicates, pricing anomalies, and compliance issues
- **CIS Integration**: Automated subcontractor verification with HMRC
- **Invoice OCR**: Extract data from PDF and image invoices
- **Payment Management**: Track payment runs and reduce payment delays
- **Accounting Integration**: Sync with Xero and QuickBooks

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **AI**: Anthropic API (flexible architecture supports multiple providers)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- PostgreSQL database (Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ptengelmann/SiteSense.git
   cd SiteSense
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   The `.env.local` file has been created with your credentials. For production, update these values:

   ```env
   # Database
   DATABASE_URL="your-supabase-connection-string"

   # AI Provider (anthropic, openai, or local)
   AI_PROVIDER="anthropic"
   ANTHROPIC_API_KEY="your-api-key"

   # Authentication
   NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   pnpm db:generate

   # Push schema to database (creates tables)
   pnpm db:push

   # Or use migrations (recommended for production)
   pnpm db:migrate
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
SiteSense/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/
│   │   ├── ai/          # AI service architecture
│   │   ├── db.ts        # Prisma client
│   │   └── utils.ts     # Utility functions
│   └── types/           # TypeScript type definitions
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
├── 01-Research/         # Market research docs
├── 03-Product-Specs/    # Product specifications
└── README.md

```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Create and run migrations
- `pnpm db:studio` - Open Prisma Studio (database GUI)

## Database Schema

The application uses the following main models:

- **User**: Admin, finance, and project manager users
- **Company**: Construction companies
- **Subcontractor**: Subcontractor companies
- **Project**: Construction projects
- **Invoice**: Subcontractor invoices
- **PaymentRun**: Grouped invoices for payment
- **CISVerification**: HMRC CIS verification records
- **Integration**: External service connections (Xero, QuickBooks, HMRC)
- **AuditLog**: Activity tracking

See `prisma/schema.prisma` for the complete schema.

## AI Service Architecture

SiteSense uses a flexible AI architecture that supports multiple providers:

- **Anthropic**: Default provider (using your API key)
- **OpenAI**: Alternative provider (coming soon)
- **Local Python**: Run your own models (coming soon)

The architecture is provider-agnostic, making it easy to:
- Switch providers without code changes
- Use different providers for different tasks
- Run models locally for cost savings and data privacy

See `src/lib/ai/README.md` for details.

## Development Roadmap

### Sprint 1-2 (Weeks 1-4): Foundation ✅
- [x] Project setup
- [x] Authentication system
- [x] Database schema
- [ ] Basic UI components

### Sprint 3 (Weeks 5-6): Subcontractor Management
- [ ] Subcontractor CRUD operations
- [ ] Subcontractor list and detail pages
- [ ] Project management

### Sprint 4 (Weeks 7-8): Invoice Management
- [ ] Invoice submission flow
- [ ] File upload
- [ ] Admin review interface

### Sprint 5 (Weeks 9-10): HMRC CIS Integration
- [ ] OAuth integration with HMRC
- [ ] CIS verification API
- [ ] Automatic CIS deduction calculation

### Sprint 6-7 (Weeks 11-14): AI Invoice Validation
- [ ] Invoice OCR (data extraction)
- [ ] Duplicate detection
- [ ] Pricing anomaly detection
- [ ] CIS compliance checks
- [ ] Risk scoring

### Sprint 8 (Weeks 15-16): Integrations
- [ ] Xero integration
- [ ] QuickBooks integration
- [ ] Payment runs

### Sprint 9-10 (Weeks 17-20): Polish & Launch
- [ ] Analytics dashboard
- [ ] Performance optimization
- [ ] Security audit
- [ ] Beta launch

See `03-Product-Specs/development-roadmap.md` for the complete roadmap.

## Security

- All sensitive credentials are stored in `.env` and `.env.local` (git-ignored)
- Passwords are hashed with bcrypt
- JWTs for authentication
- Role-based access control
- Audit logging for all financial actions
- GDPR compliant

**⚠️ Never commit `.env` or `.env.local` files to Git!**

## Documentation

- [Market Analysis](01-Research/market-analysis-2025.md)
- [MVP Specification](03-Product-Specs/mvp-specification.md)
- [Technical Architecture](03-Product-Specs/technical-architecture.md)
- [AI Validation Plan](03-Product-Specs/ai-invoice-validation-plan.md)
- [Development Roadmap](03-Product-Specs/development-roadmap.md)

## Environment Variables

### Required for Development

```env
DATABASE_URL              # PostgreSQL connection string
ANTHROPIC_API_KEY        # AI provider API key
NEXTAUTH_SECRET          # Authentication secret
```

### Optional (for full functionality)

```env
HMRC_CLIENT_ID           # HMRC CIS API
XERO_CLIENT_ID           # Xero integration
QUICKBOOKS_CLIENT_ID     # QuickBooks integration
STRIPE_SECRET_KEY        # Payment processing
RESEND_API_KEY          # Email notifications
PINECONE_API_KEY        # Vector database for duplicate detection
```

## Contributing

This is a private project. For questions or issues, contact pedro@sitesense.co.uk

## License

Proprietary - All rights reserved

---

**Built with ❤️ for UK construction companies**
