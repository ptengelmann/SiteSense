'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Basic Details
    name: '',
    projectNumber: '',
    description: '',
    status: 'PLANNING',
    projectType: '',
    contractType: '',

    // Client Information
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',

    // Site Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    country: 'GB',
    siteContactName: '',
    siteContactPhone: '',

    // Contract & Budget
    contractValue: '',
    retentionPercentage: '5',
    budget: '',

    // Dates
    startDate: '',
    estimatedCompletionDate: '',

    // Health & Safety (CDM 2015)
    principalContractor: '',
    principalDesigner: '',
    hsePlanRequired: true,
    rampsRequired: true,
    f10NotificationNumber: '',

    // Planning & Building Control
    planningPermissionRef: '',
    planningPermissionDate: '',
    buildingControlRef: '',
    buildingControlBody: '',

    // Insurance
    contractWorksInsurance: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '',

    // Meta
    notes: '',
    tags: [] as string[],
  });

  const steps = [
    { number: 1, title: 'Basic Details', description: 'Project information' },
    { number: 2, title: 'Client & Location', description: 'Client and site details' },
    { number: 3, title: 'Contract & Budget', description: 'Commercial terms' },
    { number: 4, title: 'Health & Safety', description: 'CDM 2015 compliance' },
    { number: 5, title: 'Planning & Insurance', description: 'Regulatory requirements' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Convert string numbers to actual numbers
      const payload = {
        ...formData,
        contractValue: formData.contractValue ? parseFloat(formData.contractValue) : undefined,
        retentionPercentage: parseFloat(formData.retentionPercentage),
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        contractWorksInsurance: formData.contractWorksInsurance ? parseFloat(formData.contractWorksInsurance) : undefined,
        projectType: formData.projectType || undefined,
        contractType: formData.contractType || undefined,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      router.push(`/dashboard/projects/${data.project.id}`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Create New Project</h1>
            <p className="text-neutral-600 mt-1">
              Add a new construction project with full UK compliance tracking
            </p>
          </div>
          <Link href="/dashboard/projects" className="btn btn-secondary btn-md">
            Cancel
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step.number
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="ml-3">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-neutral-900' : 'text-neutral-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-neutral-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-primary-600' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card p-4 bg-red-50 border-red-200">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="card p-8">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-900">Project Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="label">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      placeholder="e.g., 123 High Street Renovation"
                    />
                  </div>

                  <div>
                    <label className="label">Project Number</label>
                    <input
                      type="text"
                      value={formData.projectNumber}
                      onChange={(e) => setFormData({ ...formData, projectNumber: e.target.value })}
                      className="input"
                      placeholder="e.g., P2025-001"
                    />
                  </div>

                  <div>
                    <label className="label">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input"
                    >
                      <option value="PLANNING">Planning</option>
                      <option value="ACTIVE">Active</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="SNAGGING">Snagging</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Project Type</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="input"
                    >
                      <option value="">Select type...</option>
                      <option value="NEW_BUILD">New Build</option>
                      <option value="REFURBISHMENT">Refurbishment</option>
                      <option value="EXTENSION">Extension</option>
                      <option value="CONVERSION">Conversion</option>
                      <option value="RENOVATION">Renovation</option>
                      <option value="FIT_OUT">Fit Out</option>
                      <option value="INFRASTRUCTURE">Infrastructure</option>
                      <option value="DEMOLITION">Demolition</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Contract Type</label>
                    <select
                      value={formData.contractType}
                      onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                      className="input"
                    >
                      <option value="">Select type...</option>
                      <option value="FIXED_PRICE">Fixed Price</option>
                      <option value="TIME_MATERIALS">Time & Materials</option>
                      <option value="COST_PLUS">Cost Plus</option>
                      <option value="MEASURE_TERM">Measured Term</option>
                      <option value="FRAMEWORK">Framework</option>
                      <option value="NEC">NEC Contract</option>
                      <option value="JCT">JCT Contract</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input"
                      rows={4}
                      placeholder="Brief description of the project scope and objectives..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Client & Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-900">Client & Site Information</h2>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-700 uppercase">Client Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Client Name</label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="input"
                        placeholder="e.g., John Smith"
                      />
                    </div>

                    <div>
                      <label className="label">Client Company</label>
                      <input
                        type="text"
                        value={formData.clientCompany}
                        onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                        className="input"
                        placeholder="e.g., ABC Properties Ltd"
                      />
                    </div>

                    <div>
                      <label className="label">Client Email</label>
                      <input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        className="input"
                        placeholder="client@example.com"
                      />
                    </div>

                    <div>
                      <label className="label">Client Phone</label>
                      <input
                        type="tel"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        className="input"
                        placeholder="020 1234 5678"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-700 uppercase">Site Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="label">Address Line 1</label>
                      <input
                        type="text"
                        value={formData.addressLine1}
                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                        className="input"
                        placeholder="123 High Street"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="label">Address Line 2</label>
                      <input
                        type="text"
                        value={formData.addressLine2}
                        onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                        className="input"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="label">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input"
                        placeholder="London"
                      />
                    </div>

                    <div>
                      <label className="label">Postcode</label>
                      <input
                        type="text"
                        value={formData.postcode}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                        className="input"
                        placeholder="SW1A 1AA"
                      />
                    </div>

                    <div>
                      <label className="label">Site Contact Name</label>
                      <input
                        type="text"
                        value={formData.siteContactName}
                        onChange={(e) => setFormData({ ...formData, siteContactName: e.target.value })}
                        className="input"
                        placeholder="On-site contact person"
                      />
                    </div>

                    <div>
                      <label className="label">Site Contact Phone</label>
                      <input
                        type="tel"
                        value={formData.siteContactPhone}
                        onChange={(e) => setFormData({ ...formData, siteContactPhone: e.target.value })}
                        className="input"
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contract & Budget */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-900">Contract & Budget</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Contract Value (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.contractValue}
                      onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                      className="input"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="label">Retention % (Typical 5%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={formData.retentionPercentage}
                      onChange={(e) => setFormData({ ...formData, retentionPercentage: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Project Budget (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="input"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="label">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Estimated Completion Date</label>
                    <input
                      type="date"
                      value={formData.estimatedCompletionDate}
                      onChange={(e) => setFormData({ ...formData, estimatedCompletionDate: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div className="card p-4 bg-blue-50">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Retention is typically 5% for UK construction projects. This amount is held back until project completion and any defects period.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Health & Safety */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-900">Health & Safety (CDM 2015)</h2>

                <div className="card p-4 bg-amber-50 border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>CDM 2015 Requirements:</strong> For notifiable projects (&gt;30 days or &gt;500 person days), you must appoint a Principal Designer and Principal Contractor, and notify HSE using Form F10.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Principal Contractor</label>
                    <input
                      type="text"
                      value={formData.principalContractor}
                      onChange={(e) => setFormData({ ...formData, principalContractor: e.target.value })}
                      className="input"
                      placeholder="Company name"
                    />
                  </div>

                  <div>
                    <label className="label">Principal Designer</label>
                    <input
                      type="text"
                      value={formData.principalDesigner}
                      onChange={(e) => setFormData({ ...formData, principalDesigner: e.target.value })}
                      className="input"
                      placeholder="Designer/Architect name"
                    />
                  </div>

                  <div>
                    <label className="label">F10 Notification Number</label>
                    <input
                      type="text"
                      value={formData.f10NotificationNumber}
                      onChange={(e) => setFormData({ ...formData, f10NotificationNumber: e.target.value })}
                      className="input"
                      placeholder="HSE notification reference"
                    />
                  </div>

                  <div className="flex items-center gap-4 md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hsePlanRequired}
                        onChange={(e) => setFormData({ ...formData, hsePlanRequired: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm text-neutral-700">H&S Plan Required</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rampsRequired}
                        onChange={(e) => setFormData({ ...formData, rampsRequired: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm text-neutral-700">RAMS Required</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Planning & Insurance */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-900">Planning & Insurance</h2>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-700 uppercase">Planning Permission</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Planning Permission Reference</label>
                      <input
                        type="text"
                        value={formData.planningPermissionRef}
                        onChange={(e) => setFormData({ ...formData, planningPermissionRef: e.target.value })}
                        className="input"
                        placeholder="e.g., PP/2025/001"
                      />
                    </div>

                    <div>
                      <label className="label">Planning Permission Date</label>
                      <input
                        type="date"
                        value={formData.planningPermissionDate}
                        onChange={(e) => setFormData({ ...formData, planningPermissionDate: e.target.value })}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Building Control Reference</label>
                      <input
                        type="text"
                        value={formData.buildingControlRef}
                        onChange={(e) => setFormData({ ...formData, buildingControlRef: e.target.value })}
                        className="input"
                        placeholder="e.g., BC/2025/001"
                      />
                    </div>

                    <div>
                      <label className="label">Building Control Body</label>
                      <input
                        type="text"
                        value={formData.buildingControlBody}
                        onChange={(e) => setFormData({ ...formData, buildingControlBody: e.target.value })}
                        className="input"
                        placeholder="Local Authority or Approved Inspector"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-700 uppercase">Contract Works Insurance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Coverage Amount (£)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.contractWorksInsurance}
                        onChange={(e) => setFormData({ ...formData, contractWorksInsurance: e.target.value })}
                        className="input"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="label">Policy Number</label>
                      <input
                        type="text"
                        value={formData.insurancePolicyNumber}
                        onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                        className="input"
                        placeholder="Policy reference"
                      />
                    </div>

                    <div>
                      <label className="label">Insurance Expiry Date</label>
                      <input
                        type="date"
                        value={formData.insuranceExpiryDate}
                        onChange={(e) => setFormData({ ...formData, insuranceExpiryDate: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input"
                    rows={4}
                    placeholder="Any additional project notes or requirements..."
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>

              <div className="text-sm text-neutral-600">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep < steps.length ? (
                <button type="button" onClick={nextStep} className="btn btn-primary">
                  Next
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
