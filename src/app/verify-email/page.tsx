'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    // Verify email
    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-blue-subtle flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center">
            {/* Loading State */}
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 mx-auto mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                  Verifying your email
                </h2>
                <p className="text-neutral-600">Please wait while we verify your email address...</p>
              </>
            )}

            {/* Success State */}
            {status === 'success' && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-3">Email Verified!</h2>
                <p className="text-neutral-600 mb-6">{message}</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800">
                    Redirecting you to login in 3 seconds...
                  </p>
                </div>
                <Link href="/login" className="btn btn-primary btn-md w-full">
                  Go to Login
                </Link>
              </>
            )}

            {/* Error State */}
            {status === 'error' && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-3">Verification Failed</h2>
                <p className="text-neutral-600 mb-6">{message}</p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800 mb-3">
                    Your verification link may have expired or is invalid.
                  </p>
                  <p className="text-sm text-red-700">
                    Try requesting a new verification email from the login page.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/login" className="btn btn-primary btn-md w-full">
                    Go to Login
                  </Link>
                  <Link href="/register" className="btn btn-secondary btn-md w-full">
                    Create New Account
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-neutral-500 mt-6">
            Need help?{' '}
            <a href="mailto:support@site-sense.co.uk" className="text-primary-600 hover:text-primary-700">
              Contact support
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-blue-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
