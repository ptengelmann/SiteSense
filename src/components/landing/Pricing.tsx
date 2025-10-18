import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: 'Early Access',
      price: '199',
      description: 'All core features included',
      features: [
        'AI invoice OCR',
        'Fraud detection',
        'CIS automation',
        'Payment runs & BACS export',
        'Subcontractor management',
        'Project tracking',
        'Dashboard & reporting',
        'Email support',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            Early Access Pricing
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            One price. All core features. No limits during early access.
          </p>
        </div>

        {/* Single Pricing Card */}
        <div className="max-w-lg mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative rounded-2xl border-2 border-primary-500 shadow-2xl bg-white p-8"
            >
              {/* Early Access Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-500 text-white text-sm font-medium shadow-lg">
                  Early Access
                </span>
              </div>

              {/* Plan Name */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                <p className="text-neutral-600 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-bold text-neutral-900">£{plan.price}</span>
                  <span className="text-neutral-600 ml-2">/month</span>
                </div>
                <p className="text-sm text-neutral-500 mt-2">No contracts • No limits</p>
              </div>

              {/* CTA Button */}
              <Link
                href="/register"
                className="block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all mb-8 bg-primary-500 text-white hover:bg-primary-600 text-lg"
              >
                {plan.cta}
              </Link>

              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-neutral-700">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Coming Soon Note */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm text-neutral-600 text-center">
                  + Advanced features coming soon (included free)
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-neutral-600 mb-4">
            Need custom features or on-premise deployment?{' '}
            <a href="/contact" className="text-primary-600 font-semibold hover:underline">
              Contact us
            </a>{' '}
            for custom pricing.
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
