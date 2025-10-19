'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EntityDocuments from '@/components/documents/EntityDocuments';

interface SubcontractorProfileProps {
  subcontractor: any;
}

export default function SubcontractorProfile({ subcontractor }: SubcontractorProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this subcontractor? This action cannot be undone immediately due to HMRC 7-year retention requirements.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/subcontractors/${subcontractor.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/subcontractors');
      } else {
        alert('Failed to delete subcontractor');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    window.location.href = `/api/subcontractors/${subcontractor.id}/export`;
  };

  const getCISBadge = (status: string | null) => {
    const badges = {
      GROSS: 'bg-green-100 text-green-700 border-green-200',
      STANDARD: 'bg-blue-100 text-blue-700 border-blue-200',
      HIGHER: 'bg-amber-100 text-amber-700 border-amber-200',
      NOT_VERIFIED: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    };

    const labels = {
      GROSS: 'Gross Payment (0%)',
      STANDARD: 'Standard Rate (20%)',
      HIGHER: 'Higher Rate (30%)',
      NOT_VERIFIED: 'Not Verified',
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-lg border ${badges[status as keyof typeof badges] || badges.NOT_VERIFIED}`}>
        {labels[status as keyof typeof labels] || 'Unknown'}
      </span>
    );
  };

  const getRiskBadge = (risk: string | null) => {
    const badges = {
      GREEN: 'bg-green-100 text-green-700',
      AMBER: 'bg-amber-100 text-amber-700',
      RED: 'bg-red-100 text-red-700',
    };

    if (!risk) return <span className="px-3 py-1 text-sm bg-neutral-100 text-neutral-600 rounded-lg">Not Assessed</span>;

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-lg ${badges[risk as keyof typeof badges]}`}>
        {risk} Risk
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isExpired = (date: Date | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const isExpiringSoon = (date: Date | null) => {
    if (!date) return false;
    const daysUntilExpiry = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'invoices', label: `Invoices (${subcontractor.invoices?.length || 0})`, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'documents', label: 'Documents', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'cis', label: 'CIS History', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-lg p-6 bg-white border border-neutral-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl text-neutral-900 tracking-tight">{subcontractor.companyName}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-lg ${
                subcontractor.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-neutral-100 text-neutral-600'
              }`}>
                {subcontractor.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{subcontractor.contactName || 'No contact name'}</span>
              </div>
              {subcontractor.email && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${subcontractor.email}`} className="hover:text-primary-600">{subcontractor.email}</a>
                </div>
              )}
              {subcontractor.phone && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{subcontractor.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/dashboard/subcontractors/${subcontractor.id}/edit`}
              className="btn btn-primary btn-thin"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={handleExport}
              className="btn btn-secondary btn-thin"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-secondary btn-thin text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div>
            <div className="text-sm text-neutral-600 mb-1 font-light">Performance Score</div>
            <div className="text-2xl text-neutral-900 tracking-tight">{subcontractor.performanceScore.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-neutral-600 mb-1 font-light">Total Paid</div>
            <div className="text-2xl text-neutral-900 tracking-tight">{formatCurrency(subcontractor.totalPaid)}</div>
            <div className="text-xs text-neutral-500 font-light">{subcontractor.totalInvoices} invoices</div>
          </div>
          <div>
            <div className="text-sm text-neutral-600 mb-1 font-light">CIS Status</div>
            <div className="mt-1">{getCISBadge(subcontractor.cisStatus)}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-600 mb-1 font-light">Risk Score</div>
            <div className="mt-1">{getRiskBadge(subcontractor.riskScore)}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-lg bg-white border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="flex gap-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Company Details */}
              <div>
                <h3 className="text-lg text-neutral-900 mb-4 tracking-tight">Company Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">UTR (Unique Taxpayer Reference)</label>
                    <p className="mt-1 text-neutral-900">{subcontractor.utr}</p>
                  </div>
                  {subcontractor.companyNumber && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Companies House Number</label>
                      <p className="mt-1 text-neutral-900">{subcontractor.companyNumber}</p>
                    </div>
                  )}
                  {subcontractor.vatNumber && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">VAT Number</label>
                      <p className="mt-1 text-neutral-900">{subcontractor.vatNumber}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Member Since</label>
                    <p className="mt-1 text-neutral-900">{formatDate(subcontractor.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              {(subcontractor.addressLine1 || subcontractor.city) && (
                <div>
                  <h3 className="text-lg text-neutral-900 mb-4 tracking-tight">Address</h3>
                  <div className="text-neutral-900">
                    {subcontractor.addressLine1 && <p>{subcontractor.addressLine1}</p>}
                    {subcontractor.addressLine2 && <p>{subcontractor.addressLine2}</p>}
                    {(subcontractor.city || subcontractor.postcode) && (
                      <p>{subcontractor.city} {subcontractor.postcode}</p>
                    )}
                    {subcontractor.country && <p>{subcontractor.country === 'GB' ? 'United Kingdom' : subcontractor.country}</p>}
                  </div>
                </div>
              )}

              {/* CIS Compliance */}
              <div>
                <h3 className="text-lg text-neutral-900 mb-4 tracking-tight">CIS Compliance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">CIS Status</label>
                    <div className="mt-2">{getCISBadge(subcontractor.cisStatus)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Deduction Rate</label>
                    <p className="mt-1 text-neutral-900">{subcontractor.cisDeductionRate}%</p>
                  </div>
                  {subcontractor.cisVerifiedAt && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Last Verified</label>
                      <p className="mt-1 text-neutral-900">{formatDate(subcontractor.cisVerifiedAt)}</p>
                    </div>
                  )}
                  {subcontractor.cisVerificationExpiresAt && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Verification Expires</label>
                      <p className={`mt-1 font-medium ${
                        isExpired(subcontractor.cisVerificationExpiresAt)
                          ? 'text-red-600'
                          : isExpiringSoon(subcontractor.cisVerificationExpiresAt)
                          ? 'text-amber-600'
                          : 'text-neutral-900'
                      }`}>
                        {formatDate(subcontractor.cisVerificationExpiresAt)}
                        {isExpired(subcontractor.cisVerificationExpiresAt) && ' (EXPIRED)'}
                        {isExpiringSoon(subcontractor.cisVerificationExpiresAt) && ' (Expiring Soon)'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Insurance */}
              <div>
                <h3 className="text-lg text-neutral-900 mb-4 tracking-tight">Insurance</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">Public Liability Insurance</p>
                        {subcontractor.publicLiabilityAmount && (
                          <p className="text-sm text-neutral-600">Coverage: {formatCurrency(subcontractor.publicLiabilityAmount)}</p>
                        )}
                      </div>
                      {subcontractor.publicLiabilityExpiresAt && (
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            isExpired(subcontractor.publicLiabilityExpiresAt)
                              ? 'text-red-600'
                              : isExpiringSoon(subcontractor.publicLiabilityExpiresAt)
                              ? 'text-amber-600'
                              : 'text-neutral-600'
                          }`}>
                            Expires: {formatDate(subcontractor.publicLiabilityExpiresAt)}
                          </p>
                          {isExpired(subcontractor.publicLiabilityExpiresAt) && (
                            <span className="text-xs text-red-600">EXPIRED</span>
                          )}
                          {isExpiringSoon(subcontractor.publicLiabilityExpiresAt) && !isExpired(subcontractor.publicLiabilityExpiresAt) && (
                            <span className="text-xs text-amber-600">EXPIRING SOON</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">Employers' Liability Insurance</p>
                      </div>
                      {subcontractor.employersLiabilityExpiresAt && (
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            isExpired(subcontractor.employersLiabilityExpiresAt)
                              ? 'text-red-600'
                              : isExpiringSoon(subcontractor.employersLiabilityExpiresAt)
                              ? 'text-amber-600'
                              : 'text-neutral-600'
                          }`}>
                            Expires: {formatDate(subcontractor.employersLiabilityExpiresAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {subcontractor.professionalIndemnityExpiresAt && (
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-neutral-900">Professional Indemnity Insurance</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            isExpired(subcontractor.professionalIndemnityExpiresAt)
                              ? 'text-red-600'
                              : isExpiringSoon(subcontractor.professionalIndemnityExpiresAt)
                              ? 'text-amber-600'
                              : 'text-neutral-600'
                          }`}>
                            Expires: {formatDate(subcontractor.professionalIndemnityExpiresAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <h3 className="text-lg text-neutral-900 mb-4 tracking-tight">Payment Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Payment Terms</label>
                    <p className="mt-1 text-neutral-900">{subcontractor.paymentTermsDays} days</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Retention</label>
                    <p className="mt-1 text-neutral-900">{subcontractor.retentionPercentage}%</p>
                  </div>
                  {subcontractor.earlyPaymentDiscount && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Early Payment Discount</label>
                      <p className="mt-1 text-neutral-900">{subcontractor.earlyPaymentDiscount}%</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              {subcontractor.bankName && (
                <div>
                  <h3 className="text-lg text-neutral-900 mb-4 tracking-tight">Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Bank Name</label>
                      <p className="mt-1 text-neutral-900">{subcontractor.bankName}</p>
                    </div>
                    {subcontractor.bankAccountName && (
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Account Name</label>
                        <p className="mt-1 text-neutral-900">{subcontractor.bankAccountName}</p>
                      </div>
                    )}
                    {subcontractor.bankAccountNumber && (
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Account Number</label>
                        <p className="mt-1 text-neutral-900">****{subcontractor.bankAccountNumber.slice(-4)}</p>
                      </div>
                    )}
                    {subcontractor.bankSortCode && (
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Sort Code</label>
                        <p className="mt-1 text-neutral-900">{subcontractor.bankSortCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {subcontractor.notes && (
                <div>
                  <h3 className="text-lg text-neutral-900 mb-4 tracking-tight">Notes</h3>
                  <p className="text-neutral-700 whitespace-pre-wrap font-light">{subcontractor.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div>
              {subcontractor.invoices && subcontractor.invoices.length > 0 ? (
                <div className="space-y-4">
                  {subcontractor.invoices.map((invoice: any) => (
                    <div key={invoice.id} className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-neutral-900">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-neutral-600">{formatDate(invoice.invoiceDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-neutral-900">{formatCurrency(invoice.amount)}</p>
                          <p className="text-sm text-neutral-600">
                            CIS: {formatCurrency(invoice.cisDeduction)} |
                            Net: {formatCurrency(invoice.netPayment)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-lg ${
                          invoice.status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : invoice.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-neutral-600">No invoices yet</p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <EntityDocuments
              entityType="Subcontractor"
              entityId={subcontractor.id}
              allowedCategories={[
                'INSURANCE_CERTIFICATE',
                'CIS_CERTIFICATE',
                'QUALIFICATION',
                'HEALTH_SAFETY',
                'PHOTO',
                'CONTRACT',
                'OTHER',
              ]}
            />
          )}

          {/* CIS History Tab */}
          {activeTab === 'cis' && (
            <div>
              {subcontractor.cisVerifications && subcontractor.cisVerifications.length > 0 ? (
                <div className="space-y-4">
                  {subcontractor.cisVerifications.map((verification: any) => (
                    <div key={verification.id} className="p-4 border border-neutral-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-neutral-900">{formatDate(verification.verificationDate)}</p>
                          {verification.verificationReference && (
                            <p className="text-sm text-neutral-600">Ref: {verification.verificationReference}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {getCISBadge(verification.cisStatus)}
                          {verification.expiresAt && (
                            <p className="text-sm text-neutral-600 mt-1">Expires: {formatDate(verification.expiresAt)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-neutral-600">No CIS verification history</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
