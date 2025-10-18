import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '99',
      description: 'Perfect for smaller contractors',
      features: [
        'Up to 10 subcontractors',
        'Up to 50 invoices/month',
        'AI invoice OCR',
        'Fraud detection',
        'CIS automation',
        'Payment runs',
        'BACS export',
        'Email support',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      price: '299',
      description: 'Most popular for SME contractors',
      features: [
        'Up to 50 subcontractors',
        'Up to 250 invoices/month',
        'Everything in Starter, plus:',
        'Auto-approval logic',
        'Compliance alerts',
        'CIS monthly reports',
        'Priority email support',
        'Onboarding call',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Business',
      price: '699',
      description: 'For mid-market contractors',
      features: [
        'Up to 200 subcontractors',
        'Up to 1,000 invoices/month',
        'Everything in Professional, plus:',
        'Multi-user accounts',
        'Custom workflows',
        'API access',
        'Dedicated account manager',
        'Phone support',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border-2 ${
                plan.popular
                  ? 'border-primary-500 shadow-2xl scale-105'
                  : 'border-neutral-200 shadow-lg'
              } bg-white p-8`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-500 text-white text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                <p className="text-neutral-600 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-neutral-900">£{plan.price}</span>
                  <span className="text-neutral-600 ml-2">/month</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={plan.cta === 'Contact Sales' ? '/contact' : '/register'}
                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all mb-8 ${
                  plan.popular
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 ${plan.popular ? 'text-primary-500' : 'text-green-500'} flex-shrink-0 mt-0.5`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={feature.startsWith('Everything') ? 'font-semibold text-neutral-900' : 'text-neutral-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-neutral-600 mb-4">
            Need a custom plan? Processing 1,000+ invoices/month?{' '}
            <a href="/contact" className="text-primary-600 font-semibold hover:underline">
              Contact us
            </a>{' '}
            for Enterprise pricing.
          </p>
          <div className="inline-flex items-center gap-6 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
