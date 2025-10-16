import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-semibold text-neutral-900">SiteSense</span>
          </Link>
          <p className="text-sm text-neutral-500">
            © 2025 SiteSense. Built for UK construction companies.
          </p>
        </div>
      </div>
    </footer>
  );
}
