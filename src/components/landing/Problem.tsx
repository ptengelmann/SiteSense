export default function Problem() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-200 bg-primary-50 mb-4">
            <div className="w-1 h-1 rounded-full bg-primary-500"></div>
            <span className="text-xs text-primary-700 tracking-wide">THE PROBLEM</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-neutral-900 mb-4 tracking-tight">
            Invoice processing is killing<br />your productivity
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-light">
            UK construction finance teams waste 5-10 hours every week on manual invoice admin
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Pain Point 1 */}
          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg text-neutral-900 mb-2">Manual Data Entry Hell</h3>
            <p className="text-sm text-neutral-600 mb-3 leading-relaxed font-light">
              10 minutes per invoice typing invoice numbers, dates, amounts, and line items into your system.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200">
              <div className="w-1 h-1 rounded-full bg-primary-500"></div>
              <span className="text-xs text-primary-700">5 hours/week wasted</span>
            </div>
          </div>

          {/* Pain Point 2 */}
          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg text-neutral-900 mb-2">Fraud & Duplicate Invoices</h3>
            <p className="text-sm text-neutral-600 mb-3 leading-relaxed font-light">
              15% error rate: duplicate payments, wrong amounts, pricing anomalies that cost you thousands.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200">
              <div className="w-1 h-1 rounded-full bg-primary-500"></div>
              <span className="text-xs text-primary-700">£10k-50k/year lost</span>
            </div>
          </div>

          {/* Pain Point 3 */}
          <div className="bg-white rounded-lg p-6 border border-neutral-200">
            <div className="w-10 h-10 rounded-md bg-primary-50 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg text-neutral-900 mb-2">CIS Compliance Nightmare</h3>
            <p className="text-sm text-neutral-600 mb-3 leading-relaxed font-light">
              Monthly HMRC submissions, manual CIS calculations, tracking expiries. One mistake = £100-£3,000 fine.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200">
              <div className="w-1 h-1 rounded-full bg-primary-500"></div>
              <span className="text-xs text-primary-700">3 hours/week admin</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats - Minimal */}
        <div className="flex items-center justify-center gap-12 text-center">
          <div>
            <div className="text-3xl text-primary-500 mb-1">83 days</div>
            <div className="text-xs text-neutral-500 tracking-wide">Average payment cycle</div>
          </div>
          <div className="w-px h-8 bg-neutral-200"></div>
          <div>
            <div className="text-3xl text-primary-500 mb-1">25%</div>
            <div className="text-xs text-neutral-500 tracking-wide">Business failures from cash flow</div>
          </div>
          <div className="w-px h-8 bg-neutral-200"></div>
          <div>
            <div className="text-3xl text-primary-500 mb-1">£2.6B</div>
            <div className="text-xs text-neutral-500 tracking-wide">UK late payment cost/year</div>
          </div>
        </div>
      </div>
    </section>
  );
}
