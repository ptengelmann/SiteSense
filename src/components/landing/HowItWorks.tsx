export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            From invoice to payment in 3 simple steps
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            No complex setup. No training required. Start processing invoices in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" style={{ top: '80px' }}></div>

          {/* Step 1 */}
          <div className="relative">
            {/* Number Badge */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 rounded-full gradient-blue flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">
                1
              </div>
            </div>

            <div className="bg-gradient-blue-subtle rounded-2xl p-8 pt-12 text-center border border-primary-100">
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl gradient-blue flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Upload Invoice</h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Drag & drop PDF invoices or forward emails directly. Supports bulk uploads.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-primary-700 text-xs font-medium border border-primary-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  PDF, Images
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-primary-700 text-xs font-medium border border-primary-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Bulk Upload
                </span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            {/* Number Badge */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 rounded-full gradient-blue flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">
                2
              </div>
            </div>

            <div className="bg-gradient-blue-subtle rounded-2xl p-8 pt-12 text-center border border-primary-100">
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl gradient-blue flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-neutral-900 mb-3">AI Analyzes & Validates</h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Claude AI extracts data, detects fraud, calculates CIS, and scores risk in 30 seconds.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-primary-700 text-xs font-medium border border-primary-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  OCR Extract
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-primary-700 text-xs font-medium border border-primary-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Fraud Check
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-primary-700 text-xs font-medium border border-primary-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  CIS Calc
                </span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            {/* Number Badge */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 rounded-full gradient-blue flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">
                3
              </div>
            </div>

            <div className="bg-gradient-blue-subtle rounded-2xl p-8 pt-12 text-center border border-primary-100">
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl gradient-blue flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Approve & Pay</h3>
              <p className="text-neutral-600 leading-relaxed mb-4">
                70% auto-approved. Review rest in 1-click. Export BACS file. Done!
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-primary-700 text-xs font-medium border border-primary-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Auto-Approve
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-primary-700 text-xs font-medium border border-primary-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  BACS Export
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-neutral-600 mb-6">
            <span className="font-semibold text-neutral-900">From 10 minutes to 30 seconds.</span> That's 95% faster.
          </p>
          <a href="#pricing" className="btn btn-primary btn-lg">
            See Pricing
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
