'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface Subcontractor {
  id: string;
  companyName: string;
  contactName: string | null;
  cisStatus: string | null;
  cisDeductionRate: number | null;
}

interface Project {
  id: string;
  name: string;
  projectNumber: string | null;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [formData, setFormData] = useState({
    subcontractorId: '',
    projectId: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    amount: '',
    description: '',
  });

  // CIS calculation preview
  const [cisPreview, setCisPreview] = useState({
    cisDeduction: 0,
    netPayment: 0,
    deductionRate: 0,
  });

  useEffect(() => {
    fetchSubcontractors();
    fetchProjects();
  }, []);

  // Update CIS preview when subcontractor or amount changes
  useEffect(() => {
    if (formData.subcontractorId && formData.amount) {
      const subcontractor = subcontractors.find(s => s.id === formData.subcontractorId);
      if (subcontractor && subcontractor.cisDeductionRate !== null) {
        const amount = parseFloat(formData.amount);
        const deductionRate = subcontractor.cisDeductionRate;
        const cisDeduction = amount * (deductionRate / 100);
        const netPayment = amount - cisDeduction;

        setCisPreview({
          cisDeduction,
          netPayment,
          deductionRate,
        });
      } else {
        setCisPreview({
          cisDeduction: 0,
          netPayment: parseFloat(formData.amount) || 0,
          deductionRate: 0,
        });
      }
    } else {
      setCisPreview({
        cisDeduction: 0,
        netPayment: 0,
        deductionRate: 0,
      });
    }
  }, [formData.subcontractorId, formData.amount, subcontractors]);

  const fetchSubcontractors = async () => {
    try {
      const response = await fetch('/api/subcontractors');
      const data = await response.json();
      setSubcontractors(data.subcontractors || []);
    } catch (err) {
      console.error('Error fetching subcontractors:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        projectId: formData.projectId || null,
        dueDate: formData.dueDate || null,
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create invoice');
      }

      router.push('/dashboard/invoices');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSubcontractor = subcontractors.find(s => s.id === formData.subcontractorId);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/dashboard/invoices"
              className="text-neutral-400 hover:text-neutral-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-neutral-900">Submit Invoice</h1>
          </div>
          <p className="text-neutral-600">
            Create a new invoice with automatic CIS deduction calculation
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Subcontractor Selection */}
            <div>
              <label className="label">
                Subcontractor <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.subcontractorId}
                onChange={(e) => setFormData({ ...formData, subcontractorId: e.target.value })}
                className="input"
              >
                <option value="">Select subcontractor...</option>
                {subcontractors
                  .filter(s => s.isActive !== false)
                  .map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.companyName}
                      {sub.cisStatus && ` (CIS: ${sub.cisStatus})`}
                    </option>
                  ))}
              </select>
              {selectedSubcontractor && (
                <div className="mt-2 p-3 bg-neutral-50 rounded text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">CIS Status:</span>
                    <span className="font-medium">
                      {selectedSubcontractor.cisStatus || 'Not Verified'}
                    </span>
                  </div>
                  {selectedSubcontractor.cisDeductionRate !== null && (
                    <div className="flex justify-between mt-1">
                      <span className="text-neutral-600">CIS Deduction Rate:</span>
                      <span className="font-medium text-amber-600">
                        {selectedSubcontractor.cisDeductionRate}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Project Selection (Optional) */}
            <div>
              <label className="label">
                Project (Optional)
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="input"
              >
                <option value="">No specific project</option>
                {projects
                  .filter(p => !p.isArchived)
                  .map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                      {project.projectNumber && ` (${project.projectNumber})`}
                    </option>
                  ))}
              </select>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="input"
                  placeholder="INV-001"
                />
              </div>

              <div>
                <label className="label">
                  Invoice Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">
                  Invoice Amount (£) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label">
                Description / Work Performed
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={4}
                placeholder="Brief description of work performed..."
              />
            </div>

            {/* CIS Calculation Preview */}
            {formData.amount && parseFloat(formData.amount) > 0 && (
              <div className="p-4 bg-primary-50 border border-primary-200 rounded">
                <h3 className="font-semibold text-neutral-900 mb-3">Payment Calculation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Invoice Amount:</span>
                    <span className="font-medium">
                      £{parseFloat(formData.amount).toFixed(2)}
                    </span>
                  </div>
                  {cisPreview.deductionRate > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">
                          CIS Deduction ({cisPreview.deductionRate}%):
                        </span>
                        <span className="font-medium text-red-600">
                          -£{cisPreview.cisDeduction.toFixed(2)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-primary-300 flex justify-between">
                        <span className="font-semibold text-neutral-900">Net Payment:</span>
                        <span className="font-bold text-green-600 text-lg">
                          £{cisPreview.netPayment.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  {cisPreview.deductionRate === 0 && (
                    <div className="pt-2 border-t border-primary-300 flex justify-between">
                      <span className="font-semibold text-neutral-900">Net Payment:</span>
                      <span className="font-bold text-green-600 text-lg">
                        £{cisPreview.netPayment.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                {cisPreview.deductionRate === 0 && selectedSubcontractor && (
                  <p className="mt-3 text-xs text-amber-700">
                    No CIS deduction applied - subcontractor may not be CIS verified or has gross payment status.
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <Link
                href="/dashboard/invoices"
                className="btn btn-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Invoice'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
