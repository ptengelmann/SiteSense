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
      description: 'Claude AI powered invoice OCR',
    },
  ];

  return (
    <section className="py-20 bg-primary-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            The numbers speak for themselves
          </h2>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            UK construction companies using SiteSense save thousands in admin costs and eliminate payment delays
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-primary-100 mb-2">{stat.label}</div>
              <div className="text-sm text-primary-200">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Bottom ROI Calculator */}
        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Calculate Your Savings</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div>
                <div className="text-sm text-primary-100 mb-2">Invoices per week</div>
                <div className="text-3xl font-bold text-white">20</div>
              </div>
              <div>
                <div className="text-sm text-primary-100 mb-2">Time saved per invoice</div>
                <div className="text-3xl font-bold text-white">9.5 min</div>
              </div>
              <div>
                <div className="text-sm text-primary-100 mb-2">Annual savings</div>
                <div className="text-3xl font-bold text-green-300">£49,400</div>
              </div>
            </div>
            <p className="text-sm text-primary-200 mt-6">
              Based on 20 invoices/week × 9.5 min saved × £50/hour × 52 weeks
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
