export default function Stats() {
  const stats = [
    {
      number: '10 min → 30 sec',
      label: 'Invoice processing time',
      description: 'AI automation saves 95% of manual work',
    },
    {
      number: '£50k',
      label: 'Average savings per year',
      description: 'Reduced admin costs + fraud prevention',
    },
    {
      number: '70%',
      label: 'Invoices auto-approved',
      description: 'Low-risk invoices processed instantly',
    },
    {
      number: '95%',
      label: 'AI extraction accuracy',
      description: 'Our AI powered invoice OCR',
    },
  ];

  return (
    <section className="py-16 bg-primary-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl text-neutral-900 mb-4 tracking-tight">
            The numbers speak for themselves
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-light">
            UK construction companies using SiteSense save thousands in admin costs and eliminate payment delays
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl text-primary-500 mb-2 tracking-tight">{stat.number}</div>
              <div className="text-base text-neutral-900 mb-1">{stat.label}</div>
              <div className="text-sm text-neutral-600 font-light">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Bottom ROI Calculator */}
        <div className="mt-12 bg-white rounded-lg border border-neutral-200 p-6">
          <div className="text-center">
            <h3 className="text-lg text-neutral-900 mb-6">Calculate Your Savings</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div>
                <div className="text-xs text-neutral-500 mb-1 tracking-wide">Invoices per week</div>
                <div className="text-2xl text-neutral-900">20</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1 tracking-wide">Time saved per invoice</div>
                <div className="text-2xl text-neutral-900">9.5 min</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1 tracking-wide">Annual savings</div>
                <div className="text-2xl text-primary-500">£49,400</div>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-6 font-light">
              Based on 20 invoices/week × 9.5 min saved × £50/hour × 52 weeks
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
