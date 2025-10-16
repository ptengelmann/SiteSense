import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-semibold text-neutral-900">SiteSense</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Features
            </a>
            <a href="/#how-it-works" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              How It Works
            </a>
            <a href="/#pricing" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Pricing
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Link href="/login" className="btn btn-ghost btn-thin hidden md:inline-flex">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary btn-thin">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
