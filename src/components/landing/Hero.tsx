import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
              <span className="text-sm text-primary-700 font-medium">AI-Powered Invoice Processing</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 animate-slide-up">
              Process invoices in
              <br />
              <span className="text-primary-600">30 seconds, not 10 minutes</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-neutral-600 mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              AI-powered subcontractor payment platform for UK construction.{' '}
              <span className="font-semibold text-neutral-900">Auto-extract invoice data</span>,{' '}
              <span className="font-semibold text-neutral-900">detect fraud</span>, and{' '}
              <span className="font-semibold text-neutral-900">automate CIS compliance</span>.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="text-3xl font-bold text-primary-600">95%</div>
                <div className="text-sm text-neutral-600 mt-1">AI Accuracy</div>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="text-3xl font-bold text-primary-600">70%</div>
                <div className="text-sm text-neutral-600 mt-1">Auto-Approved</div>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="text-3xl font-bold text-primary-600">£50k</div>
                <div className="text-sm text-neutral-600 mt-1">Saved/Year</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/register" className="btn btn-primary btn-lg w-full sm:w-auto">
                Join Early Access (Free)
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a href="#how-it-works" className="btn btn-secondary btn-lg w-full sm:w-auto">
                See How It Works
              </a>
            </div>

            {/* Trust Badge */}
            <div className="mt-8 flex items-center gap-4 text-sm text-neutral-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-200 border-2 border-white flex items-center justify-center text-primary-700 font-semibold text-xs">JD</div>
                <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-blue-700 font-semibold text-xs">AB</div>
                <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white flex items-center justify-center text-green-700 font-semibold text-xs">LC</div>
              </div>
              <p>Trusted by UK construction companies processing <span className="font-semibold text-neutral-700">£10M+</span> annually</p>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Dashboard Preview */}
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6">
                {/* Invoice Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">Invoice #2025-042</div>
                      <div className="text-sm text-neutral-500">ABC Electrical Ltd</div>
                    </div>
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                    Auto-Approved
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Amount Extracted</span>
                    <span className="font-semibold text-neutral-900">£2,450.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">CIS Deduction (20%)</span>
                    <span className="font-semibold text-neutral-900">-£490.00</span>
                  </div>
                  <div className="h-px bg-neutral-200"></div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 font-medium">Net Payment</span>
                    <span className="font-bold text-neutral-900 text-lg">£1,960.00</span>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-900">Fraud Risk Score</span>
                    <span className="text-2xl font-bold text-green-600">12/100</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-green-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No duplicates detected • Pricing validated • Budget check passed</span>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -right-4 top-1/4 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 transform rotate-3">
                <div className="text-xs text-neutral-500 mb-1">Processing Time</div>
                <div className="text-2xl font-bold text-primary-600">28s</div>
              </div>

              <div className="absolute -left-4 bottom-1/4 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 transform -rotate-3">
                <div className="text-xs text-neutral-500 mb-1">Time Saved</div>
                <div className="text-2xl font-bold text-green-600">9m 32s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
