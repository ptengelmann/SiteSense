import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: 'Early Access',
      price: 'FREE',
      description: 'All core features included during beta',
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
      cta: 'Join Early Access',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-200 bg-primary-50 mb-4">
            <div className="w-1 h-1 rounded-full bg-primary-500"></div>
            <span className="text-xs text-primary-700 tracking-wide">FREE EARLY ACCESS</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-neutral-900 mb-4 tracking-tight">
            Free during early access
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-light">
            All core features included. No limits. Help us build the future of construction payments.
          </p>
        </div>

        {/* Single Pricing Card */}
        <div className="max-w-lg mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative rounded-lg border border-primary-200 bg-white p-8"
            >
              {/* Early Access Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500 text-white text-xs border-4 border-white">
                  <div className="w-1 h-1 rounded-full bg-white"></div>
                  Early Access
                </span>
              </div>

              {/* Plan Name */}
              <div className="text-center mb-6 mt-2">
                <h3 className="text-2xl text-neutral-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-neutral-600 font-light">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl text-primary-500 tracking-tight">{plan.price}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2 font-light">During early access • No limits</p>
              </div>

              {/* CTA Button */}
              <Link
                href="/register"
                className="btn btn-primary btn-md w-full justify-center mb-6"
              >
                {plan.cta}
              </Link>

              {/* Features List */}
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></div>
                    <span className="text-sm text-neutral-700 font-light">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Coming Soon Note */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-xs text-neutral-600 text-center font-light">
                  + Advanced features coming soon (included free)
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600 mb-6 font-light">
            Need custom features or on-premise deployment?{' '}
            <a href="/contact" className="text-primary-500 hover:underline">
              Contact us
            </a>{' '}
            about enterprise options.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-500"></div>
              <span className="font-light">100% free during beta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-500"></div>
              <span className="font-light">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary-500"></div>
              <span className="font-light">Early adopter pricing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
