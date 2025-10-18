import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function PricingPage() {
  const workingFeatures = [
    'AI-powered invoice OCR (PDF & image upload)',
    'Automated fraud detection (duplicates, pricing anomalies)',
    'CIS deduction calculations (0%, 20%, 30%)',
    'Subcontractor management',
    'Project tracking & budget monitoring',
    'Payment run creation',
    'BACS file export',
    'Invoice status tracking',
    'Dashboard & basic reporting',
    'Email support',
  ];

  const comingSoonFeatures = [
    'Auto-approval workflows',
    'Multi-user accounts & permissions',
    'Compliance alerts (insurance/CIS expiry)',
    'Advanced analytics & reports',
    'API access',
    'Xero & QuickBooks integration',
    'Email-to-invoice import',
    'Mobile app',
  ];

  const faqs = [
    {
      question: 'Is this really free?',
      answer: "Yes! During early access, SiteSense is 100% free. We're focused on building the best product with real user feedback. When we launch paid plans in the future, early access users will get special pricing.",
    },
    {
      question: 'Is this ready for production use?',
      answer: "Core features (invoice OCR, fraud detection, CIS calculations, payment runs) are working and tested. Some advanced features are still being built. You'll get access to new features as they launch.",
    },
    {
      question: 'Are there any usage limits?',
      answer: "No hard limits during early access. You can add unlimited subcontractors and process unlimited invoices. Fair use policy applies - we're here to support real construction businesses, not stress test the servers.",
    },
    {
      question: 'What happens when you start charging?',
      answer: "Early access users will be grandfathered in with special lifetime pricing. We'll notify you well in advance (at least 60 days) before any charges. You can keep using the free tier or upgrade to access advanced features.",
    },
    {
      question: 'What if I need features that are coming soon?',
      answer: "Contact us! Early customers help shape our roadmap. If you need a specific feature urgently, we can prioritize development. Your feedback directly influences what we build next.",
    },
    {
      question: 'How can I help as an early user?',
      answer: "Use it daily, report bugs, suggest improvements, and tell us what features matter most. The more feedback you provide, the better the product becomes. Early users are building this with us.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-blue-subtle">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            Free Early Access
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Free during early access
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed mb-8">
            Join now and get lifetime access to core features. Help us build the future of construction payments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% free during beta</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Shape the product</span>
            </div>
          </div>
        </div>
      </section>

      {/* Single Pricing Card */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-2xl border-2 border-primary-500 shadow-2xl bg-white p-8">
            {/* Early Access Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-500 text-white text-sm font-medium shadow-lg">
                Early Access
              </span>
            </div>

            {/* Plan Name */}
            <div className="text-center mb-8 mt-4">
              <h3 className="text-3xl font-bold text-neutral-900 mb-2">SiteSense Early Access</h3>
              <p className="text-neutral-600">For UK construction companies</p>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-6xl font-bold text-green-600">FREE</span>
              </div>
              <p className="text-sm text-neutral-500">During early access • Help us build the product</p>
            </div>

            {/* CTA Button */}
            <Link
              href="/register"
              className="block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all mb-8 bg-primary-500 text-white hover:bg-primary-600 text-lg"
            >
              Join Early Access
            </Link>

            {/* What's Included */}
            <div className="mb-8">
              <h4 className="font-semibold text-neutral-900 text-sm uppercase tracking-wide mb-4">Working Now</h4>
              <ul className="space-y-3">
                {workingFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coming Soon */}
            <div className="pt-6 border-t border-neutral-200">
              <h4 className="font-semibold text-neutral-900 text-sm uppercase tracking-wide mb-4">Coming Soon (Included Free)</h4>
              <ul className="space-y-3">
                {comingSoonFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>GDPR compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>UK company</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Note */}
          <div className="mt-12 text-center card p-8 bg-gradient-blue-subtle border-2 border-primary-200">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Need something custom?</h3>
            <p className="text-neutral-600 mb-6">
              Processing 500+ invoices/month? Need on-premise deployment? Want features prioritized?
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Contact Us About Enterprise
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-neutral-600">Everything you need to know</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6 bg-white">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">{faq.question}</h3>
                <p className="text-neutral-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center card p-8 bg-white border-2 border-primary-200">
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Still have questions?</h3>
            <p className="text-neutral-600 mb-6">
              We&apos;re here to help. Get in touch and we&apos;ll answer anything you need to know.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-blue-subtle">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Ready to automate your subcontractor payments?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Join UK contractors saving hours every week on invoice processing. Free during early access.
          </p>
          <Link href="/register" className="btn btn-primary btn-lg">
            Join Early Access
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
