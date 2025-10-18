import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

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
      <section className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-blue-subtle">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            About Us
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            We're fixing broken payments in UK construction
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed">
            Built by engineers who've seen construction finance teams drowning in manual work while subcontractors wait months to get paid.
          </p>
        </div>
      </section>

      {/* The Problem (Stats) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">The problem is massive</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              UK construction has a payment crisis. And it's getting worse.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="card p-6 text-center bg-neutral-50">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 bg-gradient-blue-subtle">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">How SiteSense was born</h2>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-neutral-700 leading-relaxed">
              In 2024, we spoke with 50+ UK construction companies. Every single one had the same nightmare:
            </p>

            <div className="card p-6 bg-white border-l-4 border-primary-500">
              <p className="text-neutral-700 italic">
                "Our finance manager spends 10 hours a week typing invoice data into Excel. She's manually calculating CIS deductions, checking for duplicates, and chasing missing insurance certificates. Meanwhile, our subcontractors are waiting 60-90 days to get paid and calling us angry every week."
              </p>
              <p className="text-neutral-600 text-sm mt-3">— Director, £40M/year residential contractor</p>
            </div>

            <p className="text-neutral-700 leading-relaxed">
              This is insane. It's 2025. We have AI that can write code, generate images, and diagnose diseases. Yet construction finance teams are still manually typing invoice numbers into spreadsheets?
            </p>

            <p className="text-neutral-700 leading-relaxed">
              The worst part? <strong>This manual process doesn't just waste time—it delays payments.</strong> Subcontractors wait an average of 83 days to get paid. Small firms go bankrupt waiting for money they're owed. 25% of construction business failures are caused by cash flow problems.
            </p>

            <p className="text-neutral-700 leading-relaxed">
              <strong>So we built SiteSense.</strong>
            </p>

            <p className="text-neutral-700 leading-relaxed">
              An AI-powered platform that processes invoices in 30 seconds, detects fraud automatically, calculates CIS with zero errors, and cuts payment cycles from 83 days to 30 days. No complex setup. No 3-hour training sessions. Just upload an invoice and watch the AI do the work.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">What makes us different</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We're not a generic invoicing tool with a construction label slapped on. We're built specifically for UK construction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Built for UK Construction</h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                CIS compliance is baked in. We understand gross vs net payment, 0%/20%/30% deduction rates, verification expiries, and HMRC monthly returns. This isn't bolted on—it's core.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Auto CIS rate detection (gross, 20%, 30%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>HMRC-ready monthly CIS returns</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Verification expiry tracking</span>
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">AI That Actually Works</h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                We're not using basic OCR from 2015. Our AI is trained on thousands of UK construction invoices—including messy handwritten ones, multi-page PDFs, and scanned documents.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>95% accuracy on real-world invoices</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Handles handwritten notes & annotations</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Learns from your invoices over time</span>
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Fraud Prevention</h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Construction fraud costs UK contractors £10k-£50k/year. Our AI catches duplicates, pricing anomalies, budget overruns, and document tampering automatically.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Duplicate invoice detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Budget validation (flags overruns)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Historical pricing anomaly detection</span>
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Built for Speed</h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Every extra day of processing is a day your subcontractors wait for payment. We're obsessed with speed without sacrificing accuracy.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>30-second invoice processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>70% of invoices auto-approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>One-click BACS export</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our values</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="card p-6 bg-white">
                <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center text-white mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-2xl text-white leading-relaxed mb-8 font-semibold">
            Eliminate the 83-day payment cycle that's killing UK construction businesses.
          </p>
          <p className="text-lg text-primary-100 leading-relaxed mb-12">
            By 2027, we want to process £50B in subcontractor payments annually, cutting average payment times from 83 days to 30 days, and saving contractors £500M in admin costs and fraud prevention.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-sm text-primary-200">UK contractors by 2027</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">£50B</div>
              <div className="text-sm text-primary-200">Payments processed annually</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">30 days</div>
              <div className="text-sm text-primary-200">Average payment cycle</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Join us in fixing construction payments
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Help us eliminate the 83-day payment cycle. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn btn-primary btn-lg">
              Join Early Access
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
