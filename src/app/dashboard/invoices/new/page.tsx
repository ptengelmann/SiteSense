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

interface AIAnalysisResult {
  extractedData: {
    invoiceNumber: string;
    date: string;
    dueDate?: string;
    supplierName: string;
    amount: number;
    vat?: number;
    lineItems: Array<{
      description: string;
      amount: number;
    }>;
    confidence: number;
  };
  fraudAnalysis: {
    riskScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    flags: Array<{
      type: string;
      severity: string;
      reason: string;
      recommendation: string;
    }>;
    summary: string;
    confidence: number;
  };
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // AI scanning state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
      setError('');
      setAiResult(null);
    }
  };

  const handleScanInvoice = async () => {
    if (!uploadedFile) {
      setError('Please upload an invoice first');
      return;
    }

    if (!formData.subcontractorId) {
      setError('Please select a subcontractor first');
      return;
    }

    setIsScanning(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', uploadedFile);
      formDataToSend.append('subcontractorId', formData.subcontractorId);
      if (formData.projectId) {
        formDataToSend.append('projectId', formData.projectId);
      }

      const response = await fetch('/api/invoices/analyze', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze invoice');
      }

      setAiResult(data.data);

      // Auto-populate form with extracted data
      setFormData({
        ...formData,
        invoiceNumber: data.data.extractedData.invoiceNumber || '',
        invoiceDate: data.data.extractedData.date || formData.invoiceDate,
        dueDate: data.data.extractedData.dueDate || '',
        amount: data.data.extractedData.amount?.toString() || '',
        description:
          data.data.extractedData.lineItems
            ?.map((item: any) => item.description)
            .join('\n') || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsScanning(false);
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

            {/* AI Scanner Section */}
            <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 border-2 border-primary-200 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-neutral-900">AI Invoice Scanner</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Upload an invoice PDF to automatically extract data and detect potential fraud
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Upload Invoice PDF
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-neutral-600
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-600 file:text-white
                      hover:file:bg-primary-700
                      file:cursor-pointer cursor-pointer"
                  />
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleScanInvoice}
                  disabled={!uploadedFile || !formData.subcontractorId || isScanning}
                  className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScanning ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning with AI...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Scan Invoice with AI
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Analysis Results */}
            {aiResult && (
              <div className="space-y-4">
                {/* Fraud Risk Score */}
                <div className={`p-4 rounded-lg border-2 ${
                  aiResult.fraudAnalysis.riskLevel === 'LOW'
                    ? 'bg-green-50 border-green-200'
                    : aiResult.fraudAnalysis.riskLevel === 'MEDIUM'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        aiResult.fraudAnalysis.riskLevel === 'LOW'
                          ? 'bg-green-100'
                          : aiResult.fraudAnalysis.riskLevel === 'MEDIUM'
                          ? 'bg-amber-100'
                          : 'bg-red-100'
                      }`}>
                        <span className={`text-2xl font-bold ${
                          aiResult.fraudAnalysis.riskLevel === 'LOW'
                            ? 'text-green-700'
                            : aiResult.fraudAnalysis.riskLevel === 'MEDIUM'
                            ? 'text-amber-700'
                            : 'text-red-700'
                        }`}>
                          {aiResult.fraudAnalysis.riskScore}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-neutral-900">
                          Fraud Risk: {aiResult.fraudAnalysis.riskLevel}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          Confidence: {(aiResult.fraudAnalysis.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-700 mb-3">
                    {aiResult.fraudAnalysis.summary}
                  </p>

                  {aiResult.fraudAnalysis.flags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-neutral-900">Detected Issues:</p>
                      {aiResult.fraudAnalysis.flags.map((flag, idx) => (
                        <div key={idx} className="p-3 bg-white rounded border border-neutral-200">
                          <div className="flex items-start gap-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              flag.severity === 'HIGH'
                                ? 'bg-red-100 text-red-700'
                                : flag.severity === 'MEDIUM'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {flag.type}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-700 mt-2">{flag.reason}</p>
                          <p className="text-sm text-primary-600 mt-1">
                            <strong>Recommendation:</strong> {flag.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Extracted Data Preview */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-neutral-900 mb-2">Extracted Data</h4>
                  <p className="text-sm text-neutral-600 mb-3">
                    Review and edit the auto-filled information below
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-neutral-600">Invoice #:</span>
                      <span className="ml-2 font-medium">{aiResult.extractedData.invoiceNumber}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Amount:</span>
                      <span className="ml-2 font-medium">£{aiResult.extractedData.amount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Date:</span>
                      <span className="ml-2 font-medium">{aiResult.extractedData.date}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Confidence:</span>
                      <span className="ml-2 font-medium">{(aiResult.extractedData.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
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
