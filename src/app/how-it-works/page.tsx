import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '1',
      title: 'Upload Invoice',
      subtitle: 'Multiple ways to get invoices into the system',
      description: 'Flexible upload options designed for real construction workflows. Whether you receive invoices via email, post, or directly from subcontractors, we make it easy.',
      methods: [
        {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          ),
          name: 'Drag & Drop',
          desc: 'Drop PDF or image files directly into your dashboard',
        },
        {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
          name: 'Email Forward',
          desc: 'Forward invoices to invoices@sitesense.co.uk',
        },
        {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          name: 'Bulk Upload',
          desc: 'Upload 50+ invoices at once',
        },
      ],
      features: [
        'Supports PDF, PNG, JPG, HEIC',
        'Multi-page invoices',
        'Handwritten notes & annotations',
        'Scanned documents',
      ],
      time: 'Upload: 10 seconds',
    },
    {
      number: '2',
      title: 'AI Analyzes & Validates',
      subtitle: 'Our AI engine does the heavy lifting in 30 seconds',
      description: 'Advanced AI automatically extracts data, validates accuracy, detects fraud, and calculates CIS deductions - all without human intervention.',
      methods: [
        {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ),
          name: 'OCR Extraction',
          desc: '95% accuracy on all invoice fields',
        },
        {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          name: 'Fraud Detection',
          desc: 'Catches duplicates, pricing anomalies, tampering',
        },
        {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          ),
          name: 'CIS Calculation',
          desc: 'Auto-calculates 0%, 20%, 30% deductions',
        },
      ],
      features: [
        'Invoice #, Date, Amount, VAT',
        'Line items & descriptions',
        'Subcontractor name & UTR',
        'Project/PO matching',
        'Duplicate detection',
        'Budget validation',
      ],
      time: 'Processing: 30 seconds',
    },
    {
      number: '3',
      title: 'Approve & Pay',
      subtitle: '70% auto-approved, rest reviewed in 1 click',
      description: 'Smart auto-approval handles low-risk invoices automatically. High-risk invoices flagged for quick manual review. Export BACS file and pay.',
      methods: [
        {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          name: 'Auto-Approval',
          desc: 'Low-risk invoices (< £5k, trusted subs) auto-approved',
        },
        {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          name: 'Manual Review',
          desc: 'High-risk invoices flagged with reasons',
        },
        {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          name: 'Payment Run',
          desc: 'One-click BACS export for your bank',
        },
      ],
      features: [
        'Risk score (0-100) per invoice',
        'Customizable approval rules',
        'Trust score per subcontractor',
        'BACS file export',
        'Payment status tracking',
        'Full audit trail',
      ],
      time: 'Approval: 10 seconds',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-blue-subtle">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            How It Works
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            From invoice to payment in 3 simple steps
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed mb-8">
            No complex setup. No training required. Start processing invoices in minutes - not weeks.
          </p>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary-50 text-primary-700 font-semibold border-2 border-primary-200">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Total time: 50 seconds (vs 10 minutes manually)
          </div>
        </div>
      </section>

      {/* Steps Detail */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {steps.map((step, index) => (
            <div key={index} className="mb-24 last:mb-0">
              {/* Step Header */}
              <div className="flex items-start gap-6 mb-12">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl gradient-blue flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {step.number}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-900 mb-2">{step.title}</h2>
                  <p className="text-lg text-neutral-600">{step.subtitle}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Left: Description & Features */}
                <div>
                  <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                    {step.description}
                  </p>

                  {/* Methods */}
                  <div className="space-y-4 mb-8">
                    {step.methods.map((method, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-blue-subtle border border-primary-100">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-blue flex items-center justify-center text-white">
                          {method.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-1">{method.name}</h4>
                          <p className="text-sm text-neutral-600">{method.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time Badge */}
                  <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-green-50 text-green-700 font-semibold border-2 border-green-200">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {step.time}
                  </div>
                </div>

                {/* Right: Features List */}
                <div>
                  <div className="card p-8 bg-white border-2 border-neutral-200">
                    <h4 className="text-xl font-bold text-neutral-900 mb-6">What gets processed</h4>
                    <ul className="space-y-3">
                      {step.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Divider */}
              {index < steps.length - 1 && (
                <div className="mt-16 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Automation Benefits */}
      <section className="py-20 bg-gradient-blue-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Why automation matters
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              The average construction company processes 20 invoices per week. Here's what automation saves you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 bg-white text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-lg font-semibold text-neutral-900 mb-2">Time Saved</div>
              <div className="text-neutral-600">10 minutes → 30 seconds per invoice</div>
            </div>

            <div className="card p-8 bg-white text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">£50k</div>
              <div className="text-lg font-semibold text-neutral-900 mb-2">Annual Savings</div>
              <div className="text-neutral-600">Reduced admin + fraud prevention</div>
            </div>

            <div className="card p-8 bg-white text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">Zero</div>
              <div className="text-lg font-semibold text-neutral-900 mb-2">CIS Penalties</div>
              <div className="text-neutral-600">Auto-compliance with HMRC rules</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Ready to automate your invoice processing?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Start your 14-day free trial. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="btn btn-primary btn-lg">
              Join Early Access
            </Link>
            <Link href="/features" className="btn btn-secondary btn-lg">
              See All Features
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
