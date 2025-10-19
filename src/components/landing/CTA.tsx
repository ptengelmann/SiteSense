import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-16 bg-primary-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 border border-primary-200 mb-4">
          <div className="w-1 h-1 rounded-full bg-primary-500 animate-pulse"></div>
          <span className="text-xs text-primary-700 tracking-wide">READY TO GET STARTED?</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl text-neutral-900 mb-4 tracking-tight">
          Cut invoice processing time by 95%
        </h2>

        {/* Subheading */}
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto font-light">
          Join UK construction companies saving £50k/year in admin costs. Start processing invoices in 30 seconds with AI automation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link href="/register" className="btn btn-primary btn-md w-full sm:w-auto">
            Join Early Access (Free)
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a href="#how-it-works" className="btn btn-secondary btn-md w-full sm:w-auto">
            See How It Works
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500">
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
            <span className="font-light">Early adopter pricing</span>
          </div>
        </div>
      </div>
    </section>
  );
}
