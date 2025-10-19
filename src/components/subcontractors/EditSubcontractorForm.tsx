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
    legalEntityType: subcontractor.legalEntityType || 'LIMITED_COMPANY',
    companyNumber: subcontractor.companyNumber || '',
    vatNumber: subcontractor.vatNumber || '',
    contactName: subcontractor.contactName || '',
    email: subcontractor.email || '',
    phone: subcontractor.phone || '',
    website: subcontractor.website || '',
    numberOfEmployees: subcontractor.numberOfEmployees || '',
    tradeSpecialties: subcontractor.tradeSpecialties || [],
    utr: subcontractor.utr || '',
    ir35Status: subcontractor.ir35Status || '',
    addressLine1: subcontractor.addressLine1 || '',
    addressLine2: subcontractor.addressLine2 || '',
    city: subcontractor.city || '',
    postcode: subcontractor.postcode || '',
    country: subcontractor.country || 'GB',

    // Emergency Contact
    emergencyContactName: subcontractor.emergencyContactName || '',
    emergencyContactPhone: subcontractor.emergencyContactPhone || '',

    // CIS
    cisStatus: subcontractor.cisStatus || 'NOT_VERIFIED',
    cisDeductionRate: subcontractor.cisDeductionRate || 20,

    // CSCS & Qualifications
    cscsCardNumber: subcontractor.cscsCardNumber || '',
    cscsCardType: subcontractor.cscsCardType || '',
    cscsCardExpiresAt: subcontractor.cscsCardExpiresAt
      ? new Date(subcontractor.cscsCardExpiresAt).toISOString().split('T')[0]
      : '',

    // Health & Safety Accreditations
    chasAccredited: subcontractor.chasAccredited || false,
    chasExpiresAt: subcontractor.chasExpiresAt
      ? new Date(subcontractor.chasExpiresAt).toISOString().split('T')[0]
      : '',
    safeContractorAccredited: subcontractor.safeContractorAccredited || false,
    safeContractorExpiresAt: subcontractor.safeContractorExpiresAt
      ? new Date(subcontractor.safeContractorExpiresAt).toISOString().split('T')[0]
      : '',
    constructionlineAccredited: subcontractor.constructionlineAccredited || false,
    constructionlineExpiresAt: subcontractor.constructionlineExpiresAt
      ? new Date(subcontractor.constructionlineExpiresAt).toISOString().split('T')[0]
      : '',
    otherAccreditations: subcontractor.otherAccreditations || [],

    // Insurance
    publicLiabilityExpiresAt: subcontractor.publicLiabilityExpiresAt
      ? new Date(subcontractor.publicLiabilityExpiresAt).toISOString().split('T')[0]
      : '',
    publicLiabilityAmount: subcontractor.publicLiabilityAmount || '',
    publicLiabilityPolicyNumber: subcontractor.publicLiabilityPolicyNumber || '',
    publicLiabilityInsurer: subcontractor.publicLiabilityInsurer || '',
    publicLiabilityDocUrl: subcontractor.publicLiabilityDocUrl || '',
    employersLiabilityExpiresAt: subcontractor.employersLiabilityExpiresAt
      ? new Date(subcontractor.employersLiabilityExpiresAt).toISOString().split('T')[0]
      : '',
    employersLiabilityPolicyNumber: subcontractor.employersLiabilityPolicyNumber || '',
    employersLiabilityInsurer: subcontractor.employersLiabilityInsurer || '',
    employersLiabilityDocUrl: subcontractor.employersLiabilityDocUrl || '',
    professionalIndemnityExpiresAt: subcontractor.professionalIndemnityExpiresAt
      ? new Date(subcontractor.professionalIndemnityExpiresAt).toISOString().split('T')[0]
      : '',
    professionalIndemnityPolicyNumber: subcontractor.professionalIndemnityPolicyNumber || '',
    professionalIndemnityInsurer: subcontractor.professionalIndemnityInsurer || '',
    professionalIndemnityDocUrl: subcontractor.professionalIndemnityDocUrl || '',

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
    { number: 2, title: 'CIS & Compliance', description: 'Tax, CSCS, and H&S accreditations' },
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

      const response = await fetch(`/api/subcontractors/${subcontractor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
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
      <div className="rounded-lg p-6 bg-white border border-neutral-200">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
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
                  <p className={`text-sm font-light ${step.number === currentStep ? 'text-primary-600' : 'text-neutral-600'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-neutral-500 font-light">{step.description}</p>
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
        <div className="rounded-lg p-8 bg-white border border-neutral-200">
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl text-neutral-900 mb-4 tracking-tight">Basic Company Information</h2>

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
                <h3 className="text-lg text-neutral-900 mb-4 tracking-tight">Primary Contact</h3>
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
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg text-neutral-900 mb-4 tracking-tight">Emergency Contact</h3>
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
                <h3 className="text-lg text-neutral-900 mb-4 tracking-tight">Address</h3>
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
              {/* CIS Section */}
              <div>
                <h2 className="text-xl text-neutral-900 mb-2 tracking-tight">CIS Verification Status</h2>
                <p className="text-neutral-600 mb-6 font-light">
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

              {/* CSCS Section */}
              <div className="border-t pt-6">
                <h2 className="text-xl text-neutral-900 mb-2 tracking-tight">CSCS Card & Qualifications</h2>
                <p className="text-neutral-600 mb-6 font-light">
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
                <h2 className="text-xl text-neutral-900 mb-2 tracking-tight">Health & Safety Accreditations</h2>
                <p className="text-neutral-600 mb-6 font-light">
                  Track industry-standard health and safety certifications.
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
                        CHAS Accredited
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Insurance */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl text-neutral-900 mb-2 tracking-tight">Insurance & Certifications</h2>
                <p className="text-neutral-600 mb-6 font-light">
                  Update insurance expiry dates and policy details.
                </p>

                <div className="space-y-6">
                  {/* Public Liability */}
                  <div className="p-6 bg-neutral-50 rounded-lg">
                    <h3 className="text-neutral-900 mb-4 tracking-tight">Public Liability Insurance</h3>
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
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="publicLiabilityDocUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                          Certificate URL
                        </label>
                        <input
                          type="url"
                          id="publicLiabilityDocUrl"
                          name="publicLiabilityDocUrl"
                          value={formData.publicLiabilityDocUrl}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Employers Liability */}
                  <div className="p-6 bg-neutral-50 rounded-lg">
                    <h3 className="text-neutral-900 mb-4 tracking-tight">Employers' Liability Insurance</h3>
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
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="employersLiabilityDocUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                          Certificate URL
                        </label>
                        <input
                          type="url"
                          id="employersLiabilityDocUrl"
                          name="employersLiabilityDocUrl"
                          value={formData.employersLiabilityDocUrl}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Indemnity */}
                  <div className="p-6 bg-neutral-50 rounded-lg">
                    <h3 className="text-neutral-900 mb-4 tracking-tight">Professional Indemnity Insurance</h3>
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
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="professionalIndemnityDocUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                          Certificate URL
                        </label>
                        <input
                          type="url"
                          id="professionalIndemnityDocUrl"
                          name="professionalIndemnityDocUrl"
                          value={formData.professionalIndemnityDocUrl}
                          onChange={handleChange}
                          className="input"
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
                <h2 className="text-xl text-neutral-900 mb-2 tracking-tight">Payment Configuration</h2>
                <p className="text-neutral-600 mb-6 font-light">
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
                    <h3 className="text-neutral-900 mb-4 tracking-tight">Bank Account Details</h3>
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
              className={`btn btn-secondary btn-thin ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary btn-thin"
              >
                Next Step
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-thin"
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
