import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md gradient-red flex items-center justify-center">
                <span className="text-white text-xs">S</span>
              </div>
              <span className="text-base text-neutral-900">SiteSense</span>
            </Link>
            <p className="text-sm text-neutral-600 mb-4 font-light leading-relaxed">
              AI-powered subcontractor payment automation for UK construction.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com/sitesense"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-neutral-100 hover:bg-primary-50 hover:text-primary-500 flex items-center justify-center transition-colors text-neutral-600"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/sitesense"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-neutral-100 hover:bg-primary-50 hover:text-primary-500 flex items-center justify-center transition-colors text-neutral-600"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-xs text-neutral-500 tracking-wide mb-3">PRODUCT</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/features" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-xs text-neutral-500 tracking-wide mb-3">RESOURCES</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/contact" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  Contact Sales
                </Link>
              </li>
              <li>
                <a href="/dashboard" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  Dashboard
                </a>
              </li>
              <li>
                <Link href="/login" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs text-neutral-500 tracking-wide mb-3">LEGAL</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 font-light">
              © {currentYear} SiteSense. AI-powered payments for UK construction.
            </p>
            <div className="flex items-center gap-6 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-2 font-light">
                <div className="w-1 h-1 rounded-full bg-primary-500"></div>
                Bank-level security
              </span>
              <span className="inline-flex items-center gap-2 font-light">
                <div className="w-1 h-1 rounded-full bg-primary-500"></div>
                GDPR compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
