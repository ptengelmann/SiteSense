export default function Problem() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            The Problem
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            Invoice processing is killing your productivity
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            UK construction finance teams waste 5-10 hours every week on manual invoice admin
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Pain Point 1 */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Manual Data Entry Hell</h3>
            <p className="text-neutral-600 mb-4 leading-relaxed">
              10 minutes per invoice typing invoice numbers, dates, amounts, and line items into your system.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              5 hours/week wasted
            </div>
          </div>

          {/* Pain Point 2 */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Fraud & Duplicate Invoices</h3>
            <p className="text-neutral-600 mb-4 leading-relaxed">
              15% error rate: duplicate payments, wrong amounts, pricing anomalies that cost you thousands.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              £10k-50k/year lost
            </div>
          </div>

          {/* Pain Point 3 */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">CIS Compliance Nightmare</h3>
            <p className="text-neutral-600 mb-4 leading-relaxed">
              Monthly HMRC submissions, manual CIS calculations, tracking expiries. One mistake = £100-£3,000 fine.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              3 hours/week admin
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-6 bg-white rounded-2xl border border-neutral-200 shadow-lg">
            <div>
              <div className="text-3xl font-bold text-primary-600">83 days</div>
              <div className="text-sm text-neutral-600 mt-1">Average payment cycle</div>
            </div>
            <div className="w-px h-12 bg-neutral-200"></div>
            <div>
              <div className="text-3xl font-bold text-primary-600">25%</div>
              <div className="text-sm text-neutral-600 mt-1">Business failures from cash flow</div>
            </div>
            <div className="w-px h-12 bg-neutral-200"></div>
            <div>
              <div className="text-3xl font-bold text-primary-600">£2.6B</div>
              <div className="text-sm text-neutral-600 mt-1">UK late payment cost/year</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
