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
      <section className="pt-32 pb-16 px-6 lg:px-8 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-200 bg-primary-100 mb-4">
            <div className="w-1 h-1 rounded-full bg-primary-500"></div>
            <span className="text-xs text-primary-700 tracking-wide">FREE EARLY ACCESS</span>
          </div>
          <h1 className="text-4xl lg:text-5xl text-neutral-900 mb-4 tracking-tight">
            Free during early access
          </h1>
          <p className="text-lg text-neutral-600 mb-8 font-light">
            Join now and get lifetime access to core features. Help us build the future of construction payments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-500"></div>
              <span className="font-light">100% free during beta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-500"></div>
              <span className="font-light">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-500"></div>
              <span className="font-light">Shape the product</span>
            </div>
          </div>
        </div>
      </section>

      {/* Single Pricing Card */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-lg border border-primary-200 bg-white p-8">
            {/* Early Access Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500 text-white text-xs border-4 border-white">
                <div className="w-1 h-1 rounded-full bg-white"></div>
                Early Access
              </span>
            </div>

            {/* Plan Name */}
            <div className="text-center mb-6 mt-2">
              <h3 className="text-2xl text-neutral-900 mb-1">SiteSense Early Access</h3>
              <p className="text-sm text-neutral-600 font-light">For UK construction companies</p>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-5xl text-primary-500 tracking-tight">FREE</span>
              </div>
              <p className="text-xs text-neutral-500 font-light">During early access • Help us build the product</p>
            </div>

            {/* CTA Button */}
            <Link
              href="/register"
              className="btn btn-primary btn-md w-full justify-center mb-6"
            >
              Join Early Access
            </Link>

            {/* What's Included */}
            <div className="mb-6">
              <h4 className="text-xs text-neutral-500 uppercase tracking-wide mb-3">WORKING NOW</h4>
              <ul className="space-y-2.5">
                {workingFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                    <span className="text-sm text-neutral-700 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coming Soon */}
            <div className="pt-6 border-t border-neutral-200">
              <h4 className="text-xs text-neutral-500 uppercase tracking-wide mb-3">COMING SOON (INCLUDED FREE)</h4>
              <ul className="space-y-2.5">
                {comingSoonFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-300 flex-shrink-0 mt-1.5"></div>
                    <span className="text-sm text-neutral-600 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-2 font-light">
                  <div className="w-1 h-1 rounded-full bg-primary-500"></div>
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center gap-2 font-light">
                  <div className="w-1 h-1 rounded-full bg-primary-500"></div>
                  <span>GDPR compliant</span>
                </div>
                <div className="flex items-center gap-2 font-light">
                  <div className="w-1 h-1 rounded-full bg-primary-500"></div>
                  <span>UK company</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Note */}
          <div className="mt-12 text-center bg-primary-50 rounded-lg p-6 border border-primary-200">
            <h3 className="text-xl text-neutral-900 mb-3">Need something custom?</h3>
            <p className="text-sm text-neutral-600 mb-6 font-light">
              Processing 500+ invoices/month? Need on-premise deployment? Want features prioritized?
            </p>
            <Link href="/contact" className="btn btn-primary btn-md">
              Contact Us About Enterprise
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-neutral-900 mb-3 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-neutral-600 font-light">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-neutral-200">
                <h3 className="text-base text-neutral-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-light">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-white rounded-lg p-6 border border-primary-200">
            <h3 className="text-lg text-neutral-900 mb-2">Still have questions?</h3>
            <p className="text-sm text-neutral-600 mb-6 font-light">
              We&apos;re here to help. Get in touch and we&apos;ll answer anything you need to know.
            </p>
            <Link href="/contact" className="btn btn-primary btn-md">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl text-neutral-900 mb-4 tracking-tight">
            Ready to automate your subcontractor payments?
          </h2>
          <p className="text-lg text-neutral-600 mb-8 font-light">
            Join UK contractors saving hours every week on invoice processing. Free during early access.
          </p>
          <Link href="/register" className="btn btn-primary btn-md">
            Join Early Access
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
