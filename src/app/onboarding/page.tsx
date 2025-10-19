'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [companyData, setCompanyData] = useState({
    addressLine1: '',
    city: '',
    postcode: '',
    phone: '',
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-blue-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const totalSteps = 4;

  const handleComplete = () => {
    router.push('/dashboard');
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-blue-subtle">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-primary-600">SiteSense</h1>
            <span className="text-neutral-400">|</span>
            <span className="text-neutral-600">Getting Started</span>
          </div>
          <button
            onClick={handleSkip}
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    s <= step
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {s < step ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < totalSteps && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step ? 'bg-primary-600' : 'bg-neutral-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="card p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-3">
                Welcome to SiteSense, {session.user.name?.split(' ')[0]}!
              </h1>
              <p className="text-lg text-neutral-600">
                You're about to save hours every week on CIS compliance and invoice processing.
                Let's get you set up in just 4 quick steps.
              </p>
            </div>

            <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-neutral-900 mb-3">What we'll cover:</h3>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Complete your company profile</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Add your first subcontractor</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>See AI invoice validation in action (optional)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Quick tour of your dashboard</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <button onClick={() => setStep(2)} className="btn btn-primary btn-lg">
                Let's Get Started
              </button>
              <p className="text-sm text-neutral-500 mt-4">Takes about 5 minutes</p>
            </div>
          </div>
        )}

        {/* Step 2: Company Profile */}
        {step === 2 && (
          <div className="card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Complete Your Company Profile</h2>
            <p className="text-neutral-600 mb-8">
              Help us set up your account properly. You can always update this later.
            </p>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Company Address
                </label>
                <input
                  type="text"
                  placeholder="Street address"
                  className="input mb-3"
                  value={companyData.addressLine1}
                  onChange={(e) => setCompanyData({ ...companyData, addressLine1: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    className="input"
                    value={companyData.city}
                    onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Postcode"
                    className="input"
                    value={companyData.postcode}
                    onChange={(e) => setCompanyData({ ...companyData, postcode: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Company Phone
                </label>
                <input
                  type="tel"
                  placeholder="01234 567890"
                  className="input"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> You can add more details like CIS registration number and VAT number in Settings later.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                >
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-sm text-neutral-600 hover:text-neutral-900 px-4"
                  >
                    Skip this step
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Add First Subcontractor */}
        {step === 3 && (
          <div className="card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Add Your First Subcontractor</h2>
            <p className="text-neutral-600 mb-8">
              Let's add a subcontractor so you can start tracking compliance and processing invoices.
            </p>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Ready to add a subcontractor?
                </h3>
                <p className="text-sm text-neutral-700 mb-6">
                  This is where you'll store all their details: CIS status, insurance, CSCS cards, and bank details for payments.
                </p>
                <Link href="/dashboard/subcontractors/new" className="btn btn-primary btn-lg inline-block">
                  Add Subcontractor Now
                </Link>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                <h4 className="font-semibold text-neutral-900 mb-3">What you'll need:</h4>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Company name and UTR (Unique Taxpayer Reference)
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Contact details (email and phone)
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    CIS status (if known) and insurance details
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(2)} className="btn btn-secondary">
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(4)}
                    className="text-sm text-neutral-600 hover:text-neutral-900 px-4"
                  >
                    I'll do this later
                  </button>
                  <Link href="/dashboard/subcontractors/new" className="btn btn-primary">
                    Add Subcontractor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Dashboard Tour */}
        {step === 4 && (
          <div className="card p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">You're All Set!</h2>
              <p className="text-lg text-neutral-600">
                Your account is ready. Here's a quick overview of what you can do:
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-white border border-neutral-200 rounded-lg p-5 hover:border-primary-300 transition-colors">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Process Invoices</h3>
                    <p className="text-sm text-neutral-600">Upload PDF invoices and let AI extract data, detect fraud, and calculate CIS deductions automatically.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-lg p-5 hover:border-primary-300 transition-colors">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Track Compliance</h3>
                    <p className="text-sm text-neutral-600">Get alerts when CIS certificates, insurance, or CSCS cards are about to expire.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-lg p-5 hover:border-primary-300 transition-colors">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Manage Payment Runs</h3>
                    <p className="text-sm text-neutral-600">Group invoices into payment runs and export for bank transfers or accounting software.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-lg p-5 hover:border-primary-300 transition-colors">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Generate Reports</h3>
                    <p className="text-sm text-neutral-600">CIS monthly returns, payment history, and subcontractor performance reports - all ready for HMRC.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 mb-8">
              <p className="text-sm text-primary-800 mb-1">
                <strong>Your 14-day free trial is active!</strong>
              </p>
              <p className="text-sm text-primary-700">
                No credit card required. Full access to all features.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <button onClick={handleComplete} className="btn btn-primary btn-lg">
                Go to Dashboard
              </button>
            </div>

            <p className="text-center text-sm text-neutral-500 mt-6">
              Need help? Check out our{' '}
              <a href="mailto:support@site-sense.co.uk" className="text-primary-600 hover:text-primary-700">
                support center
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
