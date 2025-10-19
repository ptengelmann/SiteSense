import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About SiteSense | Eliminating Late Payments in UK Construction',
  description: 'Learn why we built SiteSense to solve the 83-day payment cycle in UK construction. AI-powered tools helping contractors cut payment times from 83 to 30 days.',
  keywords: 'construction payment crisis UK, late payments construction, subcontractor cash flow, construction invoice automation, UK CIS software company, about SiteSense',
  openGraph: {
    title: 'About SiteSense - Fixing the UK Construction Payment Crisis',
    description: 'We\'re on a mission to eliminate the 83-day payment wait in UK construction. Built by people who understand the industry\'s challenges.',
    url: 'https://sitesense.co.uk/about',
    siteName: 'SiteSense',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SiteSense - Built to Fix Construction Payments',
    description: '83 days to get paid is unacceptable in 2025. We\'re using AI to cut that to 30 days for UK construction.',
  },
};

export default function AboutPage() {
  const values = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Speed',
      description: 'Every day a subcontractor waits for payment is a day they struggle with cash flow. We obsess over speed.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Accuracy',
      description: 'Wrong CIS calculations = HMRC penalties. Wrong payments = angry subcontractors. We build for 99.9% accuracy.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: 'Simplicity',
      description: "Finance teams don't have time for 3-hour onboarding calls. You should be processing invoices in 5 minutes.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Fairness',
      description: 'Small contractors deserve the same automation as big firms. Our pricing is transparent, affordable, and scales.',
    },
  ];

  const stats = [
    { number: '£2.6B', label: 'Lost to late payments annually in UK construction' },
    { number: '83 days', label: 'Average payment time for subcontractors' },
    { number: '25%', label: 'Of construction failures caused by cash flow' },
    { number: '5-10 hrs', label: 'Spent weekly on manual invoice processing' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 lg:px-8 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-200 bg-primary-100 mb-4">
            <div className="w-1 h-1 rounded-full bg-primary-500"></div>
            <span className="text-xs text-primary-700 tracking-wide">ABOUT US</span>
          </div>
          <h1 className="text-4xl lg:text-5xl text-neutral-900 mb-4 tracking-tight">
            We're fixing broken payments in UK construction
          </h1>
          <p className="text-lg text-neutral-600 font-light">
            Building AI-powered tools to help construction finance teams process invoices faster and pay subcontractors on time.
          </p>
        </div>
      </section>

      {/* The Problem (Stats) */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-neutral-900 mb-3 tracking-tight">The problem is massive</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto font-light">
              UK construction has a payment crisis. And it's getting worse.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-lg p-6 text-center bg-white border border-neutral-200">
                <div className="text-3xl text-primary-500 mb-2 tracking-tight">{stat.number}</div>
                <div className="text-sm text-neutral-600 font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl text-neutral-900 mb-8 tracking-tight">How SiteSense was born</h2>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-neutral-700 leading-relaxed font-light">
              We've been talking with UK construction companies throughout 2024. The same pain points keep coming up:
            </p>

            <div className="rounded-lg p-6 bg-white border-l-4 border-primary-500">
              <p className="text-neutral-700 italic font-light">
                "Our finance manager spends 10 hours a week typing invoice data into Excel. She's manually calculating CIS deductions, checking for duplicates, and chasing missing insurance certificates. Meanwhile, our subcontractors are waiting 60-90 days to get paid and calling us angry every week."
              </p>
              <p className="text-neutral-600 text-sm mt-3 font-light">— Director, £40M/year residential contractor</p>
            </div>

            <p className="text-neutral-700 leading-relaxed font-light">
              This is insane. It's 2025. We have AI that can write code, generate images, and diagnose diseases. Yet construction finance teams are still manually typing invoice numbers into spreadsheets?
            </p>

            <p className="text-neutral-700 leading-relaxed font-light">
              The worst part? <span className="text-neutral-900">This manual process doesn't just waste time—it delays payments.</span> Subcontractors wait an average of 83 days to get paid. Small firms go bankrupt waiting for money they're owed. 25% of construction business failures are caused by cash flow problems.
            </p>

            <p className="text-neutral-700 leading-relaxed font-light">
              <span className="text-neutral-900">So we're building SiteSense.</span>
            </p>

            <p className="text-neutral-700 leading-relaxed font-light">
              An AI-powered platform designed to process invoices in 30 seconds, detect fraud automatically, calculate CIS accurately, and help cut payment cycles from 83 days to 30 days. No complex setup. No 3-hour training sessions. Just upload an invoice and let the AI do the heavy lifting.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-neutral-900 mb-3 tracking-tight">What makes us different</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto font-light">
              We're not a generic invoicing tool with a construction label slapped on. We're building specifically for UK construction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg p-8 bg-white border border-neutral-200">
              <div className="w-12 h-12 rounded-md gradient-red flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">Built for UK Construction</h3>
              <p className="text-neutral-600 leading-relaxed mb-4 font-light">
                CIS compliance is baked in. We understand gross vs net payment, 0%/20%/30% deduction rates, verification expiries, and HMRC monthly returns. This isn't bolted on—it's core.
              </p>
              <ul className="space-y-2.5 text-sm text-neutral-600">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">Auto CIS rate detection (gross, 20%, 30%)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">HMRC-ready monthly CIS returns</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">Verification expiry tracking</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg p-8 bg-white border border-neutral-200">
              <div className="w-12 h-12 rounded-md gradient-red flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">AI That Actually Works</h3>
              <p className="text-neutral-600 leading-relaxed mb-4 font-light">
                We're building modern AI trained on UK construction invoices—including messy handwritten ones, multi-page PDFs, and scanned documents. Targeting high accuracy on real-world invoices.
              </p>
              <ul className="space-y-2.5 text-sm text-neutral-600">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">Targeting 95%+ accuracy on real-world invoices</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">Handles handwritten notes & annotations</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">Learns from your invoices over time</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg p-8 bg-white border border-neutral-200">
              <div className="w-12 h-12 rounded-md gradient-red flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">Fraud Prevention</h3>
              <p className="text-neutral-600 leading-relaxed mb-4 font-light">
                Construction fraud costs UK contractors £10k-£50k/year. Our AI is designed to catch duplicates, pricing anomalies, budget overruns, and document tampering automatically.
              </p>
              <ul className="space-y-2.5 text-sm text-neutral-600">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">Duplicate invoice detection</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">Budget validation (flags overruns)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">Historical pricing anomaly detection</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg p-8 bg-white border border-neutral-200">
              <div className="w-12 h-12 rounded-md gradient-red flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-neutral-900 mb-3 tracking-tight">Built for Speed</h3>
              <p className="text-neutral-600 leading-relaxed mb-4 font-light">
                Every extra day of processing is a day your subcontractors wait for payment. We're obsessed with speed without sacrificing accuracy.
              </p>
              <ul className="space-y-2.5 text-sm text-neutral-600">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">30-second invoice processing</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">70% of invoices auto-approved</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                  <span className="font-light">One-click BACS export</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-neutral-900 mb-3 tracking-tight">Our values</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto font-light">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="rounded-lg p-6 bg-white border border-neutral-200">
                <div className="w-10 h-10 rounded-md gradient-red flex items-center justify-center text-white mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg text-neutral-900 mb-2 tracking-tight">{value.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl text-neutral-900 mb-6 tracking-tight">Our Mission</h2>
          <p className="text-2xl text-neutral-900 leading-relaxed mb-6 tracking-tight">
            Eliminate the 83-day payment cycle that's killing UK construction businesses.
          </p>
          <p className="text-lg text-neutral-600 leading-relaxed mb-12 font-light">
            By 2027, we want to process £50B in subcontractor payments annually, cutting average payment times from 83 days to 30 days, and saving contractors £500M in admin costs and fraud prevention.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center rounded-lg p-6 bg-white border border-neutral-200">
              <div className="text-3xl text-primary-500 mb-2 tracking-tight">10,000+</div>
              <div className="text-sm text-neutral-600 font-light">UK contractors by 2027</div>
            </div>
            <div className="text-center rounded-lg p-6 bg-white border border-neutral-200">
              <div className="text-3xl text-primary-500 mb-2 tracking-tight">£50B</div>
              <div className="text-sm text-neutral-600 font-light">Payments processed annually</div>
            </div>
            <div className="text-center rounded-lg p-6 bg-white border border-neutral-200">
              <div className="text-3xl text-primary-500 mb-2 tracking-tight">30 days</div>
              <div className="text-sm text-neutral-600 font-light">Average payment cycle</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl text-neutral-900 mb-4 tracking-tight">
            Join us in fixing construction payments
          </h2>
          <p className="text-lg text-neutral-600 mb-8 font-light">
            Help us eliminate the 83-day payment cycle. Start free early access today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="btn btn-primary btn-md">
              Join Early Access
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-md">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
