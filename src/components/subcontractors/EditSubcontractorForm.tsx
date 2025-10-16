'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditSubcontractorFormProps {
  subcontractor: any;
}

export default function EditSubcontractorForm({ subcontractor }: EditSubcontractorFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Basic Details
    companyName: subcontractor.companyName || '',
    companyNumber: subcontractor.companyNumber || '',
    vatNumber: subcontractor.vatNumber || '',
    contactName: subcontractor.contactName || '',
    email: subcontractor.email || '',
    phone: subcontractor.phone || '',
    utr: subcontractor.utr || '',
    addressLine1: subcontractor.addressLine1 || '',
    addressLine2: subcontractor.addressLine2 || '',
    city: subcontractor.city || '',
    postcode: subcontractor.postcode || '',
    country: subcontractor.country || 'GB',

    // CIS
    cisStatus: subcontractor.cisStatus || 'NOT_VERIFIED',
    cisDeductionRate: subcontractor.cisDeductionRate || 20,

    // Insurance
    publicLiabilityExpiresAt: subcontractor.publicLiabilityExpiresAt
      ? new Date(subcontractor.publicLiabilityExpiresAt).toISOString().split('T')[0]
      : '',
    publicLiabilityAmount: subcontractor.publicLiabilityAmount || '',
    employersLiabilityExpiresAt: subcontractor.employersLiabilityExpiresAt
      ? new Date(subcontractor.employersLiabilityExpiresAt).toISOString().split('T')[0]
      : '',
    professionalIndemnityExpiresAt: subcontractor.professionalIndemnityExpiresAt
      ? new Date(subcontractor.professionalIndemnityExpiresAt).toISOString().split('T')[0]
      : '',

    // Payment Terms
    paymentTermsDays: subcontractor.paymentTermsDays || 30,
    retentionPercentage: subcontractor.retentionPercentage || 0,
    earlyPaymentDiscount: subcontractor.earlyPaymentDiscount || '',

    // Bank Details
    bankName: subcontractor.bankName || '',
    bankAccountName: subcontractor.bankAccountName || '',
    bankAccountNumber: subcontractor.bankAccountNumber || '',
    bankSortCode: subcontractor.bankSortCode || '',

    // Meta
    notes: subcontractor.notes || '',
    internalRating: subcontractor.internalRating || '',
    isActive: subcontractor.isActive,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const steps = [
    { number: 1, title: 'Basic Details', description: 'Company information and contact' },
    { number: 2, title: 'CIS & Compliance', description: 'Tax and verification details' },
    { number: 3, title: 'Insurance', description: 'Liability and certification' },
    { number: 4, title: 'Payment Terms', description: 'Bank and payment configuration' },
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/subcontractors/${subcontractor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update subcontractor');
      } else {
        router.push(`/dashboard/subcontractors/${subcontractor.id}`);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step.number === currentStep
                      ? 'bg-primary-600 text-white'
                      : step.number < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {step.number < currentStep ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <div className="text-center mt-2 hidden md:block">
                  <p className={`text-sm font-medium ${step.number === currentStep ? 'text-primary-600' : 'text-neutral-600'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-neutral-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 ${step.number < currentStep ? 'bg-green-600' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="card p-8">
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Basic Company Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="utr" className="block text-sm font-medium text-neutral-700 mb-2">
                      UTR (Unique Taxpayer Reference) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="utr"
                      name="utr"
                      value={formData.utr}
                      onChange={handleChange}
                      required
                      minLength={10}
                      maxLength={10}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="companyNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                      Companies House Number
                    </label>
                    <input
                      type="text"
                      id="companyNumber"
                      name="companyNumber"
                      value={formData.companyNumber}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="vatNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                      VAT Number
                    </label>
                    <input
                      type="text"
                      id="vatNumber"
                      name="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-neutral-700 mb-2">
                      Primary Contact Name
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="isActive" className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-neutral-700">Active Status</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-neutral-700 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-neutral-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="postcode" className="block text-sm font-medium text-neutral-700 mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-2">
                  Internal Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="input"
                  placeholder="Add any internal notes or special instructions..."
                />
              </div>
            </div>
          )}

          {/* Step 2: CIS & Compliance */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">CIS Verification Status</h2>
                <p className="text-neutral-600 mb-6">
                  Construction Industry Scheme compliance tracking.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cisStatus" className="block text-sm font-medium text-neutral-700 mb-2">
                      CIS Status
                    </label>
                    <select
                      id="cisStatus"
                      name="cisStatus"
                      value={formData.cisStatus}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="NOT_VERIFIED">Not Yet Verified</option>
                      <option value="GROSS">Gross Payment (0%)</option>
                      <option value="STANDARD">Standard Rate (20%)</option>
                      <option value="HIGHER">Higher Rate (30%)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cisDeductionRate" className="block text-sm font-medium text-neutral-700 mb-2">
                      CIS Deduction Rate (%)
                    </label>
                    <input
                      type="number"
                      id="cisDeductionRate"
                      name="cisDeductionRate"
                      value={formData.cisDeductionRate}
                      onChange={handleChange}
                      min="0"
                      max="30"
                      step="1"
                      className="input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Insurance */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">Insurance & Certifications</h2>
                <p className="text-neutral-600 mb-6">
                  Update insurance expiry dates.
                </p>

                <div className="space-y-6">
                  <div className="p-6 bg-neutral-50 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 mb-4">Public Liability Insurance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="publicLiabilityExpiresAt" className="block text-sm font-medium text-neutral-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          id="publicLiabilityExpiresAt"
                          name="publicLiabilityExpiresAt"
                          value={formData.publicLiabilityExpiresAt}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      <div>
                        <label htmlFor="publicLiabilityAmount" className="block text-sm font-medium text-neutral-700 mb-2">
                          Coverage Amount (£)
                        </label>
                        <input
                          type="number"
                          id="publicLiabilityAmount"
                          name="publicLiabilityAmount"
                          value={formData.publicLiabilityAmount}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-50 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 mb-4">Employers' Liability Insurance</h3>
                    <div>
                      <label htmlFor="employersLiabilityExpiresAt" className="block text-sm font-medium text-neutral-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        id="employersLiabilityExpiresAt"
                        name="employersLiabilityExpiresAt"
                        value={formData.employersLiabilityExpiresAt}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-50 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 mb-4">Professional Indemnity Insurance</h3>
                    <div>
                      <label htmlFor="professionalIndemnityExpiresAt" className="block text-sm font-medium text-neutral-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        id="professionalIndemnityExpiresAt"
                        name="professionalIndemnityExpiresAt"
                        value={formData.professionalIndemnityExpiresAt}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment Terms */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">Payment Configuration</h2>
                <p className="text-neutral-600 mb-6">
                  Update payment terms and bank details.
                </p>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="paymentTermsDays" className="block text-sm font-medium text-neutral-700 mb-2">
                        Payment Terms (Days)
                      </label>
                      <select
                        id="paymentTermsDays"
                        name="paymentTermsDays"
                        value={formData.paymentTermsDays}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                        <option value={60}>60 days</option>
                        <option value={90}>90 days</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="retentionPercentage" className="block text-sm font-medium text-neutral-700 mb-2">
                        Retention (%)
                      </label>
                      <input
                        type="number"
                        id="retentionPercentage"
                        name="retentionPercentage"
                        value={formData.retentionPercentage}
                        onChange={handleChange}
                        min="0"
                        max="10"
                        step="0.5"
                        className="input"
                      />
                    </div>

                    <div>
                      <label htmlFor="earlyPaymentDiscount" className="block text-sm font-medium text-neutral-700 mb-2">
                        Early Payment Discount (%)
                      </label>
                      <input
                        type="number"
                        id="earlyPaymentDiscount"
                        name="earlyPaymentDiscount"
                        value={formData.earlyPaymentDiscount}
                        onChange={handleChange}
                        min="0"
                        max="10"
                        step="0.5"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-neutral-900 mb-4">Bank Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="bankName" className="block text-sm font-medium text-neutral-700 mb-2">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          id="bankName"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>

                      <div>
                        <label htmlFor="bankAccountName" className="block text-sm font-medium text-neutral-700 mb-2">
                          Account Name
                        </label>
                        <input
                          type="text"
                          id="bankAccountName"
                          name="bankAccountName"
                          value={formData.bankAccountName}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>

                      <div>
                        <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                          Account Number
                        </label>
                        <input
                          type="text"
                          id="bankAccountNumber"
                          name="bankAccountNumber"
                          value={formData.bankAccountNumber}
                          onChange={handleChange}
                          maxLength={8}
                          className="input"
                        />
                      </div>

                      <div>
                        <label htmlFor="bankSortCode" className="block text-sm font-medium text-neutral-700 mb-2">
                          Sort Code
                        </label>
                        <input
                          type="text"
                          id="bankSortCode"
                          name="bankSortCode"
                          value={formData.bankSortCode}
                          onChange={handleChange}
                          maxLength={6}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="internalRating" className="block text-sm font-medium text-neutral-700 mb-2">
                      Internal Rating (1-5 stars)
                    </label>
                    <input
                      type="number"
                      id="internalRating"
                      name="internalRating"
                      value={formData.internalRating}
                      onChange={handleChange}
                      min="1"
                      max="5"
                      className="input"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`btn btn-secondary btn-md ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary btn-md"
              >
                Next Step
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-md"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
