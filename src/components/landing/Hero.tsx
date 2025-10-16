import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
            <span className="text-sm text-primary-700 font-medium">AI-Powered Construction Management</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 animate-slide-up">
            Reduce Payment Cycles
            <br />
            <span className="text-primary-600">from 83 to 30 days</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            AI-powered invoice validation and automated CIS compliance for UK construction companies.
            Save 10+ hours per week on subcontractor management.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/register" className="btn btn-primary btn-lg w-full sm:w-auto">
              Start Free Trial
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg w-full sm:w-auto">
              Watch Demo
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-neutral-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>4.9/5 rating</span>
            </div>
            <div className="w-px h-4 bg-neutral-200"></div>
            <div>
              <span className="font-semibold text-neutral-700">50+</span> contractors
            </div>
            <div className="w-px h-4 bg-neutral-200"></div>
            <div>
              <span className="font-semibold text-neutral-700">£2M+</span> processed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
