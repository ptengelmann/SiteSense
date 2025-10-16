'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function NewSubcontractorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Basic Details
    companyName: '',
    legalEntityType: 'LIMITED_COMPANY',
    companyNumber: '',
    vatNumber: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    numberOfEmployees: '',
    tradeSpecialties: [] as string[],
    utr: '',
    ir35Status: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    country: 'GB',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',

    // CIS
    cisStatus: 'NOT_VERIFIED',
    cisDeductionRate: 20,

    // CSCS & Qualifications
    cscsCardNumber: '',
    cscsCardType: '',
    cscsCardExpiresAt: '',

    // Health & Safety Accreditations
    chasAccredited: false,
    chasExpiresAt: '',
    safeContractorAccredited: false,
    safeContractorExpiresAt: '',
    constructionlineAccredited: false,
    constructionlineExpiresAt: '',
    otherAccreditations: [] as string[],

    // Insurance
    publicLiabilityExpiresAt: '',
    publicLiabilityAmount: '',
    publicLiabilityPolicyNumber: '',
    publicLiabilityInsurer: '',
    publicLiabilityDocUrl: '',
    employersLiabilityExpiresAt: '',
    employersLiabilityPolicyNumber: '',
    employersLiabilityInsurer: '',
    employersLiabilityDocUrl: '',
    professionalIndemnityExpiresAt: '',
    professionalIndemnityPolicyNumber: '',
    professionalIndemnityInsurer: '',
    professionalIndemnityDocUrl: '',

    // Payment Terms
    paymentTermsDays: 30,
    retentionPercentage: 0,
    earlyPaymentDiscount: '',

    // Bank Details
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankSortCode: '',

    // GDPR
    dataConsentGiven: false,
    dataProcessingPurpose: 'CIS verification, invoice processing, payment processing, and subcontractor performance tracking',

    // Meta
    notes: '',
    tags: [] as string[],
    internalRating: '',
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
    { number: 2, title: 'CIS & Compliance', description: 'Tax, CSCS, and H&S accreditations' },
    { number: 3, title: 'Insurance', description: 'Liability and certification' },
    { number: 4, title: 'Payment Terms', description: 'Bank and payment configuration' },
    { number: 5, title: 'GDPR Consent', description: 'Data processing agreement' },
  ];

  const nextStep = () => {
    if (currentStep < 5) {
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
      // Clean up data - convert empty strings to undefined for optional fields
      const cleanedData = {
        ...formData,
        companyNumber: formData.companyNumber || undefined,
        vatNumber: formData.vatNumber || undefined,
        website: formData.website || undefined,
        numberOfEmployees: formData.numberOfEmployees || undefined,
        ir35Status: formData.ir35Status || undefined,
        addressLine1: formData.addressLine1 || undefined,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city || undefined,
        postcode: formData.postcode || undefined,
        emergencyContactName: formData.emergencyContactName || undefined,
        emergencyContactPhone: formData.emergencyContactPhone || undefined,
        cisDeductionRate: formData.cisDeductionRate || undefined,
        cscsCardNumber: formData.cscsCardNumber || undefined,
        cscsCardType: formData.cscsCardType || undefined,
        cscsCardExpiresAt: formData.cscsCardExpiresAt || undefined,
        chasExpiresAt: formData.chasExpiresAt || undefined,
        safeContractorExpiresAt: formData.safeContractorExpiresAt || undefined,
        constructionlineExpiresAt: formData.constructionlineExpiresAt || undefined,
        publicLiabilityExpiresAt: formData.publicLiabilityExpiresAt || undefined,
        publicLiabilityAmount: formData.publicLiabilityAmount || undefined,
        publicLiabilityPolicyNumber: formData.publicLiabilityPolicyNumber || undefined,
        publicLiabilityInsurer: formData.publicLiabilityInsurer || undefined,
        publicLiabilityDocUrl: formData.publicLiabilityDocUrl || undefined,
        employersLiabilityExpiresAt: formData.employersLiabilityExpiresAt || undefined,
        employersLiabilityPolicyNumber: formData.employersLiabilityPolicyNumber || undefined,
        employersLiabilityInsurer: formData.employersLiabilityInsurer || undefined,
        employersLiabilityDocUrl: formData.employersLiabilityDocUrl || undefined,
        professionalIndemnityExpiresAt: formData.professionalIndemnityExpiresAt || undefined,
        professionalIndemnityPolicyNumber: formData.professionalIndemnityPolicyNumber || undefined,
        professionalIndemnityInsurer: formData.professionalIndemnityInsurer || undefined,
        professionalIndemnityDocUrl: formData.professionalIndemnityDocUrl || undefined,
        earlyPaymentDiscount: formData.earlyPaymentDiscount || undefined,
        bankName: formData.bankName || undefined,
        bankAccountName: formData.bankAccountName || undefined,
        bankAccountNumber: formData.bankAccountNumber || undefined,
        bankSortCode: formData.bankSortCode || undefined,
        notes: formData.notes || undefined,
        internalRating: formData.internalRating || undefined,
      };

      const response = await fetch('/api/subcontractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create subcontractor');
      } else {
        router.push('/dashboard/subcontractors');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/subcontractors"
          className="w-10 h-10 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
        >
          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Add Subcontractor</h1>
          <p className="text-neutral-600 mt-1">
            Complete CIS-compliant onboarding with GDPR consent
          </p>
        </div>
      </div>

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
                      placeholder="Smith Construction Ltd"
                    />
                  </div>

                  <div>
                    <label htmlFor="legalEntityType" className="block text-sm font-medium text-neutral-700 mb-2">
                      Legal Entity Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="legalEntityType"
                      name="legalEntityType"
                      value={formData.legalEntityType}
                      onChange={handleChange}
                      required
                      className="input"
                    >
                      <option value="LIMITED_COMPANY">Limited Company (Ltd)</option>
                      <option value="SOLE_TRADER">Sole Trader</option>
                      <option value="PARTNERSHIP">Partnership</option>
                      <option value="LLP">Limited Liability Partnership (LLP)</option>
                      <option value="PLC">Public Limited Company (PLC)</option>
                      <option value="CHARITY">Charity</option>
                      <option value="OTHER">Other</option>
                    </select>
                    <p className="text-xs text-neutral-500 mt-1">Affects tax treatment and IR35 status</p>
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
                      placeholder="1234567890"
                    />
                    <p className="text-xs text-neutral-500 mt-1">10-digit HMRC number</p>
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
                      placeholder="12345678"
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
                      placeholder="GB123456789"
                    />
                  </div>

                  <div>
                    <label htmlFor="ir35Status" className="block text-sm font-medium text-neutral-700 mb-2">
                      IR35 Status
                    </label>
                    <select
                      id="ir35Status"
                      name="ir35Status"
                      value={formData.ir35Status}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Not Determined</option>
                      <option value="OUTSIDE">Outside IR35 (Self-employed)</option>
                      <option value="INSIDE">Inside IR35 (Treated as employee)</option>
                      <option value="NOT_APPLICABLE">Not Applicable</option>
                    </select>
                    <p className="text-xs text-neutral-500 mt-1">Tax status for contractors</p>
                  </div>

                  <div>
                    <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-neutral-700 mb-2">
                      Number of Employees
                    </label>
                    <input
                      type="number"
                      id="numberOfEmployees"
                      name="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={handleChange}
                      min="0"
                      className="input"
                      placeholder="5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="input"
                      placeholder="https://www.smithconstruction.co.uk"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="tradeSpecialties" className="block text-sm font-medium text-neutral-700 mb-2">
                      Trade Specialties
                    </label>
                    <input
                      type="text"
                      id="tradeSpecialties"
                      name="tradeSpecialties"
                      value={formData.tradeSpecialties.join(', ')}
                      onChange={(e) => {
                        const trades = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                        setFormData(prev => ({ ...prev, tradeSpecialties: trades }));
                      }}
                      className="input"
                      placeholder="Electrician, Plumber, HVAC, Carpentry"
                    />
                    <p className="text-xs text-neutral-500 mt-1">Separate multiple trades with commas</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Primary Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-neutral-700 mb-2">
                      Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="john@smithconstruction.co.uk"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="07123 456789"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="emergencyContactName" className="block text-sm font-medium text-neutral-700 mb-2">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      id="emergencyContactName"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      className="input"
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-neutral-700 mb-2">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      className="input"
                      placeholder="07123 456789"
                    />
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
                      placeholder="123 High Street"
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
                      placeholder="Unit 5"
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
                      placeholder="Preston"
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
                      placeholder="PR1 2AB"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: CIS & Compliance */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              {/* CIS Section */}
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">CIS Verification Status</h2>
                <p className="text-neutral-600 mb-6">
                  Construction Industry Scheme compliance tracking. This affects deduction rates on payments.
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
                    <p className="text-xs text-neutral-500 mt-1">
                      {formData.cisStatus === 'GROSS' && 'No CIS deduction applied'}
                      {formData.cisStatus === 'STANDARD' && '20% deduction on labour'}
                      {formData.cisStatus === 'HIGHER' && '30% deduction on labour'}
                      {formData.cisStatus === 'NOT_VERIFIED' && 'Verify with HMRC before first payment'}
                    </p>
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

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-900">HMRC CIS Integration Coming Soon</p>
                      <p className="text-sm text-blue-700 mt-1">
                        We'll automatically verify CIS status with HMRC and track expiry dates. For now, verify manually at gov.uk/verify-cis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CSCS Section */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">CSCS Card & Qualifications</h2>
                <p className="text-neutral-600 mb-6">
                  Construction Skills Certification Scheme - required for most UK construction sites.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="cscsCardNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                      CSCS Card Number
                    </label>
                    <input
                      type="text"
                      id="cscsCardNumber"
                      name="cscsCardNumber"
                      value={formData.cscsCardNumber}
                      onChange={handleChange}
                      className="input"
                      placeholder="1234567890123456"
                    />
                  </div>

                  <div>
                    <label htmlFor="cscsCardType" className="block text-sm font-medium text-neutral-700 mb-2">
                      CSCS Card Type
                    </label>
                    <select
                      id="cscsCardType"
                      name="cscsCardType"
                      value={formData.cscsCardType}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Not specified</option>
                      <option value="Green CSCS">Green CSCS (Labourer)</option>
                      <option value="Blue CSCS">Blue CSCS (Skilled Worker)</option>
                      <option value="Gold CSCS">Gold CSCS (Advanced Craft)</option>
                      <option value="Black CSCS">Black CSCS (Manager)</option>
                      <option value="White CSCS">White CSCS (Related Occupation)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cscsCardExpiresAt" className="block text-sm font-medium text-neutral-700 mb-2">
                      CSCS Expiry Date
                    </label>
                    <input
                      type="date"
                      id="cscsCardExpiresAt"
                      name="cscsCardExpiresAt"
                      value={formData.cscsCardExpiresAt}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Health & Safety Accreditations */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">Health & Safety Accreditations</h2>
                <p className="text-neutral-600 mb-6">
                  Track industry-standard health and safety certifications required by many contractors.
                </p>

                <div className="space-y-4">
                  {/* CHAS */}
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="chasAccredited"
                        name="chasAccredited"
                        checked={formData.chasAccredited}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="chasAccredited" className="text-sm font-medium text-neutral-900 cursor-pointer">
                        CHAS Accredited (Contractors Health and Safety Assessment Scheme)
                      </label>
                    </div>
                    {formData.chasAccredited && (
                      <div className="ml-8">
                        <label htmlFor="chasExpiresAt" className="block text-sm font-medium text-neutral-700 mb-2">
                          CHAS Expiry Date
                        </label>
                        <input
                          type="date"
                          id="chasExpiresAt"
                          name="chasExpiresAt"
                          value={formData.chasExpiresAt}
                          onChange={handleChange}
                          className="input max-w-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* SafeContractor */}
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="safeContractorAccredited"
                        name="safeContractorAccredited"
                        checked={formData.safeContractorAccredited}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="safeContractorAccredited" className="text-sm font-medium text-neutral-900 cursor-pointer">
                        SafeContractor Accredited
                      </label>
                    </div>
                    {formData.safeContractorAccredited && (
                      <div className="ml-8">
                        <label htmlFor="safeContractorExpiresAt" className="block text-sm font-medium text-neutral-700 mb-2">
                          SafeContractor Expiry Date
                        </label>
                        <input
                          type="date"
                          id="safeContractorExpiresAt"
                          name="safeContractorExpiresAt"
                          value={formData.safeContractorExpiresAt}
                          onChange={handleChange}
                          className="input max-w-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* Constructionline */}
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="constructionlineAccredited"
                        name="constructionlineAccredited"
                        checked={formData.constructionlineAccredited}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="constructionlineAccredited" className="text-sm font-medium text-neutral-900 cursor-pointer">
                        Constructionline Accredited
                      </label>
                    </div>
                    {formData.constructionlineAccredited && (
                      <div className="ml-8">
                        <label htmlFor="constructionlineExpiresAt" className="block text-sm font-medium text-neutral-700 mb-2">
                          Constructionline Expiry Date
                        </label>
                        <input
                          type="date"
                          id="constructionlineExpiresAt"
                          name="constructionlineExpiresAt"
                          value={formData.constructionlineExpiresAt}
                          onChange={handleChange}
                          className="input max-w-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* Other Accreditations */}
                  <div>
                    <label htmlFor="otherAccreditations" className="block text-sm font-medium text-neutral-700 mb-2">
                      Other Accreditations
                    </label>
                    <input
                      type="text"
                      id="otherAccreditations"
                      name="otherAccreditations"
                      value={formData.otherAccreditations.join(', ')}
                      onChange={(e) => {
                        const accreditations = e.target.value.split(',').map(a => a.trim()).filter(a => a);
                        setFormData(prev => ({ ...prev, otherAccreditations: accreditations }));
                      }}
                      className="input"
                      placeholder="NICEIC, Gas Safe, IPAF, PASMA"
                    />
                    <p className="text-xs text-neutral-500 mt-1">Separate multiple accreditations with commas (e.g., NICEIC, Gas Safe, IPAF)</p>
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
                  Track insurance expiry dates with automatic reminders at 30, 14, and 7 days before expiry.
                </p>

                <div className="space-y-6">
                  {/* Public Liability */}
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
                          placeholder="5000000"
                        />
                      </div>
                      <div>
                        <label htmlFor="publicLiabilityPolicyNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                          Policy Number
                        </label>
                        <input
                          type="text"
                          id="publicLiabilityPolicyNumber"
                          name="publicLiabilityPolicyNumber"
                          value={formData.publicLiabilityPolicyNumber}
                          onChange={handleChange}
                          className="input"
                          placeholder="PL-123456789"
                        />
                      </div>
                      <div>
                        <label htmlFor="publicLiabilityInsurer" className="block text-sm font-medium text-neutral-700 mb-2">
                          Insurer
                        </label>
                        <input
                          type="text"
                          id="publicLiabilityInsurer"
                          name="publicLiabilityInsurer"
                          value={formData.publicLiabilityInsurer}
                          onChange={handleChange}
                          className="input"
                          placeholder="Aviva, Zurich, AXA"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="publicLiabilityDocUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                          Certificate URL (optional)
                        </label>
                        <input
                          type="url"
                          id="publicLiabilityDocUrl"
                          name="publicLiabilityDocUrl"
                          value={formData.publicLiabilityDocUrl}
                          onChange={handleChange}
                          className="input"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Employers Liability */}
                  <div className="p-6 bg-neutral-50 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 mb-4">Employers' Liability Insurance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div>
                        <label htmlFor="employersLiabilityPolicyNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                          Policy Number
                        </label>
                        <input
                          type="text"
                          id="employersLiabilityPolicyNumber"
                          name="employersLiabilityPolicyNumber"
                          value={formData.employersLiabilityPolicyNumber}
                          onChange={handleChange}
                          className="input"
                          placeholder="EL-123456789"
                        />
                      </div>
                      <div>
                        <label htmlFor="employersLiabilityInsurer" className="block text-sm font-medium text-neutral-700 mb-2">
                          Insurer
                        </label>
                        <input
                          type="text"
                          id="employersLiabilityInsurer"
                          name="employersLiabilityInsurer"
                          value={formData.employersLiabilityInsurer}
                          onChange={handleChange}
                          className="input"
                          placeholder="Aviva, Zurich, AXA"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="employersLiabilityDocUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                          Certificate URL (optional)
                        </label>
                        <input
                          type="url"
                          id="employersLiabilityDocUrl"
                          name="employersLiabilityDocUrl"
                          value={formData.employersLiabilityDocUrl}
                          onChange={handleChange}
                          className="input"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Indemnity */}
                  <div className="p-6 bg-neutral-50 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 mb-4">Professional Indemnity Insurance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div>
                        <label htmlFor="professionalIndemnityPolicyNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                          Policy Number
                        </label>
                        <input
                          type="text"
                          id="professionalIndemnityPolicyNumber"
                          name="professionalIndemnityPolicyNumber"
                          value={formData.professionalIndemnityPolicyNumber}
                          onChange={handleChange}
                          className="input"
                          placeholder="PI-123456789"
                        />
                      </div>
                      <div>
                        <label htmlFor="professionalIndemnityInsurer" className="block text-sm font-medium text-neutral-700 mb-2">
                          Insurer
                        </label>
                        <input
                          type="text"
                          id="professionalIndemnityInsurer"
                          name="professionalIndemnityInsurer"
                          value={formData.professionalIndemnityInsurer}
                          onChange={handleChange}
                          className="input"
                          placeholder="Aviva, Zurich, AXA"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="professionalIndemnityDocUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                          Certificate URL (optional)
                        </label>
                        <input
                          type="url"
                          id="professionalIndemnityDocUrl"
                          name="professionalIndemnityDocUrl"
                          value={formData.professionalIndemnityDocUrl}
                          onChange={handleChange}
                          className="input"
                          placeholder="https://..."
                        />
                      </div>
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
                  Set payment terms, retention, and bank details for automated payment runs.
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
                      <p className="text-xs text-neutral-500 mt-1">Typically 5-10%</p>
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
                          placeholder="Barclays"
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
                          placeholder="Smith Construction Ltd"
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
                          placeholder="12345678"
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
                          placeholder="123456"
                        />
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex gap-2">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <p className="text-xs text-amber-800">
                          Bank details are stored securely and encrypted. Only last 4 digits displayed in the system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: GDPR Consent */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">GDPR Data Processing Consent</h2>
                <p className="text-neutral-600 mb-6">
                  Required under UK GDPR and Data Protection Act 2018
                </p>

                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3">What data we'll process:</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Company details, contact information, and UTR for CIS verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Invoice data for payment processing and CIS deduction calculations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Bank details for automated payment runs (encrypted at rest)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Performance metrics for subcontractor management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Insurance certificates for compliance monitoring</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-neutral-50 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 mb-3">Your GDPR rights:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-700">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Right to access your data</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Right to data portability</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Right to rectification</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Right to be forgotten*</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-3">
                      *Subject to 7-year HMRC retention requirement for CIS records
                    </p>
                  </div>

                  <div>
                    <label htmlFor="dataProcessingPurpose" className="block text-sm font-medium text-neutral-700 mb-2">
                      Data Processing Purpose
                    </label>
                    <textarea
                      id="dataProcessingPurpose"
                      name="dataProcessingPurpose"
                      value={formData.dataProcessingPurpose}
                      onChange={handleChange}
                      rows={3}
                      className="input"
                      readOnly
                    />
                  </div>

                  <div className="p-6 border-2 border-primary-200 bg-primary-50 rounded-lg">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="dataConsentGiven"
                        checked={formData.dataConsentGiven}
                        onChange={handleChange}
                        required
                        className="mt-1 w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900 mb-1">
                          I consent to the processing of this subcontractor's data <span className="text-red-500">*</span>
                        </p>
                        <p className="text-sm text-neutral-700">
                          I confirm that I have obtained consent from this subcontractor to process their personal and business data for CIS verification, invoice processing, payment processing, and compliance management. Data will be retained for 7 years per HMRC requirements. This consent can be withdrawn at any time, subject to legal retention obligations.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="text-sm text-neutral-600">
                    <p className="mb-2"><strong>Legal Basis:</strong> Contract and Legal Obligation</p>
                    <p className="mb-2"><strong>Data Retention:</strong> 7 years from last transaction (HMRC requirement)</p>
                    <p><strong>Data Controller:</strong> {formData.companyName || 'Your Company'}</p>
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

            {currentStep < 5 ? (
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
                disabled={loading || !formData.dataConsentGiven}
                className="btn btn-primary btn-md"
              >
                {loading ? 'Creating...' : 'Create Subcontractor'}
              </button>
            )}
          </div>
        </div>
      </form>
      </div>
    </DashboardLayout>
  );
}
