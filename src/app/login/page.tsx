'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  // Check for success messages from URL params
  useEffect(() => {
    const registered = searchParams.get('registered');
    const verified = searchParams.get('verified');

    if (registered === 'true') {
      setSuccess('Account created! Please check your email to verify your account.');
      setShowResend(true);
    } else if (verified === 'true') {
      setSuccess('Email verified successfully! You can now sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setShowResend(true); // Show resend option if login fails (might be unverified)
      } else if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Verification email sent! Please check your inbox.');
      } else {
        setError(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary-50 flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-neutral-900 mb-3 tracking-tight">Welcome back</h1>
            <p className="text-neutral-600 font-light">Sign in to your account to continue</p>
          </div>

          {/* Login Card */}
          <div className="rounded-lg p-8 bg-white border border-neutral-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-neutral-700 mb-2 font-light">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                  placeholder="you@company.com"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm text-neutral-700 font-light">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-500 hover:text-primary-600 transition-colors font-light"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* Success Message */}
              {success && (
                <div className="bg-primary-50 border border-primary-200 text-neutral-700 px-4 py-3 rounded-lg text-sm font-light">
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-light">
                  {error}
                  {showResend && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                      className="block mt-2 text-sm text-red-800 hover:text-red-900 underline font-light"
                    >
                      {resendLoading ? 'Sending...' : 'Resend verification email'}
                    </button>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-md w-full justify-center"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-neutral-500 font-light">New to SiteSense?</span>
              </div>
            </div>

            {/* Register Link */}
            <Link href="/register" className="btn btn-secondary btn-md w-full justify-center">
              Create an account
            </Link>
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-neutral-500 mt-8 font-light">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary-500 hover:text-primary-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-500 hover:text-primary-600">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-500"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
