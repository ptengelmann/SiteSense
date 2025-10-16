import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
          Ready to reduce your payment cycles?
        </h2>
        <p className="text-lg text-neutral-600 mb-10 max-w-2xl mx-auto">
          Join 50+ UK construction companies using SiteSense to automate compliance and get paid faster.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="btn btn-primary btn-lg w-full sm:w-auto">
            Start 14-Day Free Trial
          </Link>
          <a href="#features" className="btn btn-secondary btn-lg w-full sm:w-auto">
            Schedule a Demo
          </a>
        </div>
        <p className="mt-6 text-sm text-neutral-500">
          No credit card required • Cancel anytime • Full support
        </p>
      </div>
    </section>
  );
}
