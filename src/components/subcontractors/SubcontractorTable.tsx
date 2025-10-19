'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Subcontractor {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  utr: string;
  cisStatus: string | null;
  cisVerificationExpiresAt: Date | null;
  publicLiabilityExpiresAt: Date | null;
  performanceScore: number;
  riskScore: string | null;
  totalPaid: number;
  totalInvoices: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
}

interface SubcontractorTableProps {
  initialData: Subcontractor[];
}

export default function SubcontractorTable({ initialData }: SubcontractorTableProps) {
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(initialData);
  const [search, setSearch] = useState('');
  const [cisFilter, setCisFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Subcontractor>('companyName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Client-side filtering and sorting
  const filteredData = subcontractors
    .filter((sub) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          sub.companyName.toLowerCase().includes(searchLower) ||
          sub.contactName?.toLowerCase().includes(searchLower) ||
          sub.email?.toLowerCase().includes(searchLower) ||
          sub.utr.includes(search)
        );
      }
      return true;
    })
    .filter((sub) => {
      // CIS status filter
      if (cisFilter !== 'all') {
        return sub.cisStatus === cisFilter;
      }
      return true;
    })
    .filter((sub) => {
      // Active status filter
      if (statusFilter === 'active') return sub.isActive;
      if (statusFilter === 'inactive') return !sub.isActive;
      return true;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

  const handleSort = (field: keyof Subcontractor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getCISBadge = (status: string | null) => {
    const badges = {
      GROSS: 'bg-green-100 text-green-700 border-green-200',
      STANDARD: 'bg-blue-100 text-blue-700 border-blue-200',
      HIGHER: 'bg-amber-100 text-amber-700 border-amber-200',
      NOT_VERIFIED: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    };

    const labels = {
      GROSS: 'Gross (0%)',
      STANDARD: 'Standard (20%)',
      HIGHER: 'Higher (30%)',
      NOT_VERIFIED: 'Not Verified',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${badges[status as keyof typeof badges] || badges.NOT_VERIFIED}`}>
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

    if (!risk) return null;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${badges[risk as keyof typeof badges]}`}>
        {risk}
      </span>
    );
  };

  const isInsuranceExpiringSoon = (date: Date | null) => {
    if (!date) return false;
    const daysUntilExpiry = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isInsuranceExpired = (date: Date | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="rounded-lg p-4 bg-white border border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or UTR..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* CIS Status Filter */}
          <div>
            <select
              value={cisFilter}
              onChange={(e) => setCisFilter(e.target.value)}
              className="input"
            >
              <option value="all">All CIS Status</option>
              <option value="GROSS">Gross (0%)</option>
              <option value="STANDARD">Standard (20%)</option>
              <option value="HIGHER">Higher (30%)</option>
              <option value="NOT_VERIFIED">Not Verified</option>
            </select>
          </div>

          {/* Active Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-sm text-neutral-600 font-light">
          Showing {filteredData.length} of {subcontractors.length} subcontractors
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden bg-white border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100"
                  onClick={() => handleSort('companyName')}
                >
                  <div className="flex items-center gap-2">
                    Company
                    {sortField === 'companyName' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider">
                  CIS Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100"
                  onClick={() => handleSort('performanceScore')}
                >
                  <div className="flex items-center gap-2">
                    Performance
                    {sortField === 'performanceScore' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100"
                  onClick={() => handleSort('totalPaid')}
                >
                  <div className="flex items-center gap-2">
                    Total Paid
                    {sortField === 'totalPaid' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-light text-neutral-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredData.map((sub) => (
                <tr key={sub.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-neutral-900">{sub.companyName}</div>
                      <div className="text-sm text-neutral-500 font-light">UTR: {sub.utr}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light">
                      {sub.contactName && <div className="text-neutral-900">{sub.contactName}</div>}
                      {sub.email && <div className="text-neutral-500">{sub.email}</div>}
                      {sub.phone && <div className="text-neutral-500">{sub.phone}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getCISBadge(sub.cisStatus)}
                      {sub.cisVerificationExpiresAt && (
                        <div className="text-xs text-neutral-500 font-light">
                          Expires: {new Date(sub.cisVerificationExpiresAt).toLocaleDateString('en-GB')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-neutral-900">
                        {sub.performanceScore.toFixed(1)}%
                      </div>
                      {getRiskBadge(sub.riskScore)}
                    </div>
                    {isInsuranceExpired(sub.publicLiabilityExpiresAt) && (
                      <div className="text-xs text-red-600 font-light mt-1">⚠ Insurance Expired</div>
                    )}
                    {!isInsuranceExpired(sub.publicLiabilityExpiresAt) && isInsuranceExpiringSoon(sub.publicLiabilityExpiresAt) && (
                      <div className="text-xs text-amber-600 font-light mt-1">⚠ Insurance Expiring Soon</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light">
                      <div className="text-neutral-900">{formatCurrency(sub.totalPaid)}</div>
                      <div className="text-neutral-500">{sub.totalInvoices} invoices</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      sub.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {sub.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-light">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/subcontractors/${sub.id}`}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        View
                      </Link>
                      <a
                        href={`/api/subcontractors/${sub.id}/export`}
                        className="text-neutral-600 hover:text-neutral-700"
                        title="Export GDPR Data"
                      >
                        Export
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
