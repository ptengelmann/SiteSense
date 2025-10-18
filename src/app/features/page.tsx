import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'AI Invoice OCR',
      description: 'Extract invoice data automatically from PDFs and images with 95% accuracy. No more manual typing of invoice numbers, dates, amounts, and line items.',
      benefits: [
        'Upload PDF or image invoices',
        'AI extracts all fields in 30 seconds',
        '95% accuracy rate',
        'Handles handwritten notes',
        'Multi-page invoice support',
      ],
      stats: '10 min → 30 sec per invoice',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Fraud Detection',
      description: 'AI-powered fraud detection catches duplicates, pricing anomalies, budget overruns, and document tampering before you pay.',
      benefits: [
        'Duplicate invoice detection',
        'Pricing anomaly alerts',
        'Budget validation',
        'Document tampering detection',
        'Historical pattern analysis',
      ],
      stats: 'Catches 98% of fraud attempts',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'CIS Compliance Automation',
      description: 'Automatically calculate CIS deductions, generate monthly returns, and track verification expiries. Zero HMRC penalties.',
      benefits: [
        'Auto CIS deduction calculation (0%, 20%, 30%)',
        'Monthly CIS return generation',
        'Verification expiry tracking',
        'HMRC-ready reports',
        'Audit trail for all deductions',
      ],
      stats: 'Zero CIS penalties for customers',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Auto-Approval Logic',
      description: 'Low-risk invoices (< £5k, trusted subcontractors) auto-approved. High-risk invoices flagged for manual review.',
      benefits: [
        '70% of invoices auto-approved',
        'Risk scoring (0-100)',
        'Customizable approval rules',
        'Trust score per subcontractor',
        'Full audit trail',
      ],
      stats: '70% auto-approved',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Payment Runs',
      description: 'Create weekly payment runs, export BACS files for your bank, track payment status automatically.',
      benefits: [
        'One-click payment runs',
        'BACS file export',
        'Payment status tracking',
        'Scheduled payment runs',
        'Bank integration ready',
      ],
      stats: 'Export to bank in 1 click',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Reports & Analytics',
      description: 'CIS monthly returns, payment history, subcontractor performance, invoice status - all automated with Excel/CSV export.',
      benefits: [
        'CIS monthly returns',
        'Payment history reports',
        'Subcontractor performance',
        'Invoice status tracking',
        'Excel & CSV export',
      ],
      stats: 'HMRC-ready in 1 click',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Compliance Alerts',
      description: 'Auto-alerts for expiring insurance, CIS certificates, CSCS cards, and qualifications via email.',
      benefits: [
        'Insurance expiry alerts (30/14/7 days)',
        'CIS verification tracking',
        'CSCS card expiry',
        'Qualification tracking',
        'Email & dashboard notifications',
      ],
      stats: 'Never miss an expiry',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Bank Details Vault',
      description: 'Securely store subcontractor bank details with bank-level encryption. Auto-fill payment runs.',
      benefits: [
        'Encrypted storage (AES-256)',
        'Auto-fill payment runs',
        'Sort code validation',
        'Account number verification',
        'Secure audit log',
      ],
      stats: 'Bank-level security',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-blue-subtle">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            Features
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Everything you need to automate subcontractor payments
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed mb-8">
            From AI invoice processing to HMRC compliance - all in one platform built specifically for UK construction.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="btn btn-primary btn-lg">
              Start Free Trial
            </Link>
            <Link href="/pricing" className="btn btn-secondary btn-lg">
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="w-16 h-16 rounded-2xl gradient-blue flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-neutral-900 mb-4">{feature.title}</h3>
                  <p className="text-lg text-neutral-600 mb-6 leading-relaxed">{feature.description}</p>

                  {/* Benefits List */}
                  <ul className="space-y-3 mb-6">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-neutral-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stats Badge */}
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-semibold border border-primary-200">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature.stats}
                  </div>
                </div>

                {/* Visual */}
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <div className="card p-8 bg-gradient-blue-subtle border border-primary-100">
                    <div className="aspect-video bg-white rounded-xl flex items-center justify-center border-2 border-neutral-200">
                      <div className="text-center p-8">
                        <div className="w-20 h-20 rounded-2xl gradient-blue flex items-center justify-center mx-auto mb-4">
                          {feature.icon}
                        </div>
                        <div className="text-2xl font-bold text-neutral-900 mb-2">{feature.title}</div>
                        <div className="text-primary-600 font-semibold">{feature.stats}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-blue-subtle">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Ready to save £50k/year in admin costs?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Start your 14-day free trial. No credit card required.
          </p>
          <Link href="/register" className="btn btn-primary btn-lg">
            Start Free Trial
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
