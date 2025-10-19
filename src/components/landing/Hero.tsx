import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-24 pb-16 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-200 bg-primary-50">
            <div className="w-1 h-1 rounded-full bg-primary-500"></div>
            <span className="text-xs text-primary-700 tracking-wide">AI-POWERED INVOICE PROCESSING</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl lg:text-7xl text-center text-neutral-900 mb-6 tracking-tight leading-tight">
          Process invoices in<br />
          <span className="text-primary-500">30 seconds</span>, not 10 minutes
        </h1>

        {/* Subheading */}
        <p className="text-lg lg:text-xl text-center text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          AI-powered subcontractor payment platform for UK construction. Auto-extract invoice data, detect fraud, and automate CIS compliance.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <Link href="/register" className="btn btn-primary btn-md">
            Join Early Access
          </Link>
          <a href="#how-it-works" className="btn btn-secondary btn-md">
            See How It Works
          </a>
        </div>

        {/* Stats - Minimal */}
        <div className="flex items-center justify-center gap-12 mb-12 text-center">
          <div>
            <div className="text-3xl text-primary-500 mb-1">95%</div>
            <div className="text-xs text-neutral-500 tracking-wide">AI Accuracy</div>
          </div>
          <div className="w-px h-8 bg-neutral-200"></div>
          <div>
            <div className="text-3xl text-primary-500 mb-1">70%</div>
            <div className="text-xs text-neutral-500 tracking-wide">Auto-Approved</div>
          </div>
          <div className="w-px h-8 bg-neutral-200"></div>
          <div>
            <div className="text-3xl text-primary-500 mb-1">£50k</div>
            <div className="text-xs text-neutral-500 tracking-wide">Saved/Year</div>
          </div>
        </div>

        {/* Dashboard Preview - Ultra Minimal */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
            {/* Invoice Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-gradient-red flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-neutral-900">Invoice #2025-042</div>
                  <div className="text-xs text-neutral-500">ABC Electrical Ltd</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
                <div className="w-1 h-1 rounded-full bg-green-500"></div>
                <span className="text-xs text-green-700">Auto-Approved</span>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-neutral-500 mb-1">Amount</div>
                <div className="text-base text-neutral-900">£2,450.00</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">CIS Deduction (20%)</div>
                <div className="text-base text-neutral-900">-£490.00</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Net Payment</div>
                <div className="text-lg text-neutral-900">£1,960.00</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Risk Score</div>
                <div className="text-base text-green-600">12/100</div>
              </div>
            </div>

            {/* Risk Badge */}
            <div className="p-3 bg-green-50 rounded-md border border-green-200">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="text-xs text-green-700">No duplicates detected • Pricing validated • Budget check passed</div>
              </div>
            </div>
          </div>

          {/* Processing Time Badge */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-neutral-200 shadow-sm">
              <div className="text-xs text-neutral-500">Processed in</div>
              <div className="text-sm text-primary-600">28 seconds</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
