'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md gradient-red flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white text-xs font-medium">S</span>
            </div>
            <span className="text-base text-neutral-900 font-light">SiteSense</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-xs text-neutral-600 hover:text-primary-500 transition-colors font-light">
              Features
            </Link>
            <Link href="/how-it-works" className="text-xs text-neutral-600 hover:text-primary-500 transition-colors font-light">
              How It Works
            </Link>
            <Link href="/pricing" className="text-xs text-neutral-600 hover:text-primary-500 transition-colors font-light">
              Pricing
            </Link>
            <Link href="/about" className="text-xs text-neutral-600 hover:text-primary-500 transition-colors font-light">
              About
            </Link>
            <Link href="/contact" className="text-xs text-neutral-600 hover:text-primary-500 transition-colors font-light">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs text-neutral-600 hover:text-primary-500 transition-colors font-light hidden md:inline-flex">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary btn-thin">
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-100">
            <div className="flex flex-col space-y-3">
              <Link
                href="/features"
                className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="text-sm text-neutral-600 hover:text-primary-500 transition-colors font-light pt-2 border-t border-neutral-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
