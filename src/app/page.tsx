export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-semibold text-neutral-900">SiteSense</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Pricing
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <button className="btn btn-ghost btn-thin hidden md:inline-flex">
                Sign In
              </button>
              <button className="btn btn-primary btn-thin">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
              <button className="btn btn-primary btn-lg w-full sm:w-auto">
                Start Free Trial
              </button>
              <button className="btn btn-secondary btn-lg w-full sm:w-auto">
                Watch Demo
              </button>
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

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gradient-blue-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Everything you need to manage subcontractors
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Automate compliance, reduce admin time, and get paid faster with our AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">AI Invoice Validation</h3>
              <p className="text-neutral-600 leading-relaxed">
                Automatically detect duplicates, pricing anomalies, and compliance issues. Save 5-10 hours per week.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">HMRC CIS Integration</h3>
              <p className="text-neutral-600 leading-relaxed">
                Automated subcontractor verification and CIS deduction calculations. Always compliant, zero hassle.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Payment Tracking</h3>
              <p className="text-neutral-600 leading-relaxed">
                Track payment runs, reduce delays, and improve cash flow visibility. Pay on time, every time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-8 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Invoice OCR</h3>
              <p className="text-neutral-600 leading-relaxed">
                Extract data from PDF and image invoices automatically. No more manual data entry.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card p-8 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Xero & QuickBooks</h3>
              <p className="text-neutral-600 leading-relaxed">
                Seamless integration with your accounting software. Sync invoices, payments, and subcontractors.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card p-8 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Analytics Dashboard</h3>
              <p className="text-neutral-600 leading-relaxed">
                Track payment cycles, project costs, and subcontractor performance. Data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
            Ready to reduce your payment cycles?
          </h2>
          <p className="text-lg text-neutral-600 mb-10 max-w-2xl mx-auto">
            Join 50+ UK construction companies using SiteSense to automate compliance and get paid faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn btn-primary btn-lg w-full sm:w-auto">
              Start 14-Day Free Trial
            </button>
            <button className="btn btn-secondary btn-lg w-full sm:w-auto">
              Schedule a Demo
            </button>
          </div>
          <p className="mt-6 text-sm text-neutral-500">
            No credit card required • Cancel anytime • Full support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-semibold text-neutral-900">SiteSense</span>
            </div>
            <p className="text-sm text-neutral-500">
              © 2025 SiteSense. Built for UK construction companies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
