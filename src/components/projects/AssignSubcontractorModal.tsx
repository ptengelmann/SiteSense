'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Subcontractor {
  id: string;
  companyName: string;
  contactName: string | null;
  tradeSpecialties: string[];
  cisStatus: string | null;
  isActive: boolean;
}

export default function AssignSubcontractorModal({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);

  const [formData, setFormData] = useState({
    subcontractorId: '',
    role: '',
    scopeOfWork: '',
    tradePackage: '',
    contractValue: '',
    agreedRate: '',
    rateType: 'DAY_RATE',
    paymentTerms: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchSubcontractors();
    }
  }, [isOpen]);

  const fetchSubcontractors = async () => {
    try {
      const response = await fetch('/api/subcontractors');
      const data = await response.json();
      setSubcontractors(data.subcontractors || []);
    } catch (err) {
      console.error('Error fetching subcontractors:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        contractValue: formData.contractValue ? parseFloat(formData.contractValue) : undefined,
        agreedRate: formData.agreedRate ? parseFloat(formData.agreedRate) : undefined,
      };

      const response = await fetch(`/api/projects/${projectId}/subcontractors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign subcontractor');
      }

      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSubcontractor = subcontractors.find(s => s.id === formData.subcontractorId);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary btn-sm"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Assign Subcontractor
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-900">Assign Subcontractor</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Subcontractor Selection */}
                <div>
                  <label className="label">
                    Select Subcontractor <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.subcontractorId}
                    onChange={(e) => setFormData({ ...formData, subcontractorId: e.target.value })}
                    className="input"
                  >
                    <option value="">Choose a subcontractor...</option>
                    {subcontractors
                      .filter(s => s.isActive)
                      .map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.companyName} {sub.tradeSpecialties.length > 0 && `(${sub.tradeSpecialties.join(', ')})`}
                        </option>
                      ))}
                  </select>
                  {selectedSubcontractor && (
                    <div className="mt-2 p-2 bg-neutral-50 rounded text-sm">
                      <p className="text-neutral-600">
                        Contact: {selectedSubcontractor.contactName || 'N/A'}
                      </p>
                      {selectedSubcontractor.cisStatus && (
                        <p className="text-neutral-600">
                          CIS Status: {selectedSubcontractor.cisStatus}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Role & Scope */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Role/Position</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="input"
                      placeholder="e.g., Lead Electrician"
                    />
                  </div>

                  <div>
                    <label className="label">Trade Package</label>
                    <input
                      type="text"
                      value={formData.tradePackage}
                      onChange={(e) => setFormData({ ...formData, tradePackage: e.target.value })}
                      className="input"
                      placeholder="e.g., First Fix Electrical"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Scope of Work</label>
                  <textarea
                    value={formData.scopeOfWork}
                    onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Brief description of work to be performed..."
                  />
                </div>

                {/* Commercial Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="label">Rate Type</label>
                    <select
                      value={formData.rateType}
                      onChange={(e) => setFormData({ ...formData, rateType: e.target.value })}
                      className="input"
                    >
                      <option value="DAY_RATE">Day Rate</option>
                      <option value="FIXED_PRICE">Fixed Price</option>
                      <option value="MEASURED">Measured</option>
                    </select>
                  </div>

                  {formData.rateType === 'DAY_RATE' && (
                    <div>
                      <label className="label">Daily Rate (£)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.agreedRate}
                        onChange={(e) => setFormData({ ...formData, agreedRate: e.target.value })}
                        className="input"
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  <div>
                    <label className="label">Payment Terms</label>
                    <input
                      type="text"
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                      className="input"
                      placeholder="e.g., 30 days, Stage payments"
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="label">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="label">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Any additional notes or requirements..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Assigning...' : 'Assign Subcontractor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
