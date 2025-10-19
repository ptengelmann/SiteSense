'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  projectNumber: string | null;
  status: string;
  projectType: string | null;
  contractType: string | null;
  clientName: string | null;
  clientCompany: string | null;
  addressLine1: string | null;
  city: string | null;
  postcode: string | null;
  budget: number | null;
  actualCost: number;
  contractValue: number | null;
  startDate: Date | null;
  estimatedCompletionDate: Date | null;
  actualCompletionDate: Date | null;
  onSchedule: boolean;
  daysDelay: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  _count: {
    projectSubcontractors: number;
    invoices: number;
  };
}

interface ProjectTableProps {
  initialData: Project[];
}

export default function ProjectTable({ initialData }: ProjectTableProps) {
  const [projects, setProjects] = useState<Project[]>(initialData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectTypeFilter, setProjectTypeFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Project>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Client-side filtering and sorting
  const filteredData = projects
    .filter((project) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          project.name.toLowerCase().includes(searchLower) ||
          project.projectNumber?.toLowerCase().includes(searchLower) ||
          project.clientName?.toLowerCase().includes(searchLower) ||
          project.clientCompany?.toLowerCase().includes(searchLower) ||
          project.postcode?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter((project) => {
      // Status filter
      if (statusFilter !== 'all') {
        return project.status === statusFilter;
      }
      return true;
    })
    .filter((project) => {
      // Project type filter
      if (projectTypeFilter !== 'all') {
        return project.projectType === projectTypeFilter;
      }
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

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PLANNING: 'bg-blue-100 text-blue-700 border-blue-200',
      ACTIVE: 'bg-green-100 text-green-700 border-green-200',
      ON_HOLD: 'bg-amber-100 text-amber-700 border-amber-200',
      SNAGGING: 'bg-purple-100 text-purple-700 border-purple-200',
      COMPLETED: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    };

    const labels = {
      PLANNING: 'Planning',
      ACTIVE: 'Active',
      ON_HOLD: 'On Hold',
      SNAGGING: 'Snagging',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${badges[status as keyof typeof badges] || 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getProjectTypeBadge = (type: string | null) => {
    if (!type) return null;

    const labels: Record<string, string> = {
      NEW_BUILD: 'New Build',
      REFURBISHMENT: 'Refurb',
      EXTENSION: 'Extension',
      CONVERSION: 'Conversion',
      RENOVATION: 'Renovation',
      FIT_OUT: 'Fit Out',
      INFRASTRUCTURE: 'Infrastructure',
      DEMOLITION: 'Demolition',
      MAINTENANCE: 'Maintenance',
      OTHER: 'Other',
    };

    return (
      <span className="px-2 py-1 text-xs font-medium rounded bg-neutral-100 text-neutral-700">
        {labels[type] || type}
      </span>
    );
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getBudgetProgress = (budget: number | null, actualCost: number) => {
    if (!budget || budget === 0) return null;
    const percentage = (actualCost / budget) * 100;
    return percentage;
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
                placeholder="Search by name, client, or postcode..."
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

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="SNAGGING">Snagging</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Project Type Filter */}
          <div>
            <select
              value={projectTypeFilter}
              onChange={(e) => setProjectTypeFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Types</option>
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
        </div>

        <div className="mt-3 text-sm text-neutral-600 font-light">
          Showing {filteredData.length} of {projects.length} projects
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
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Project
                    {sortField === 'name' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider">
                  Client & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider">
                  Budget & Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-light text-neutral-600 uppercase tracking-wider">
                  Resources
                </th>
                <th className="px-6 py-3 text-right text-xs font-light text-neutral-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredData.map((project) => {
                const budgetProgress = getBudgetProgress(project.budget, project.actualCost);
                const isOverBudget = budgetProgress && budgetProgress > 100;

                return (
                  <tr key={project.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-neutral-900">{project.name}</div>
                        {project.projectNumber && (
                          <div className="text-sm text-neutral-500">#{project.projectNumber}</div>
                        )}
                        <div className="mt-1">
                          {getProjectTypeBadge(project.projectType)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {project.clientName && (
                          <div className="text-neutral-900 font-medium">{project.clientName}</div>
                        )}
                        {project.clientCompany && (
                          <div className="text-neutral-600">{project.clientCompany}</div>
                        )}
                        {project.city && (
                          <div className="text-neutral-500 text-xs mt-1">
                            {project.city}{project.postcode && `, ${project.postcode}`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(project.status)}
                        {!project.onSchedule && project.status !== 'COMPLETED' && project.status !== 'CANCELLED' && (
                          <div className="text-xs text-amber-600 font-medium flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {project.daysDelay}d delay
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {project.budget && (
                          <>
                            <div className="text-neutral-900 font-medium">
                              Budget: {formatCurrency(project.budget)}
                            </div>
                            <div className={`text-xs ${isOverBudget ? 'text-red-600' : 'text-neutral-600'}`}>
                              Spent: {formatCurrency(project.actualCost)} ({budgetProgress?.toFixed(0)}%)
                            </div>
                            {budgetProgress && (
                              <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1">
                                <div
                                  className={`h-1.5 rounded-full ${isOverBudget ? 'bg-red-600' : 'bg-green-600'}`}
                                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                                ></div>
                              </div>
                            )}
                          </>
                        )}
                        {!project.budget && project.contractValue && (
                          <div className="text-neutral-900 font-medium">
                            Value: {formatCurrency(project.contractValue)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-neutral-600">
                        {project.startDate && (
                          <div>Start: {formatDate(project.startDate)}</div>
                        )}
                        {project.estimatedCompletionDate && (
                          <div>Est: {formatDate(project.estimatedCompletionDate)}</div>
                        )}
                        {project.actualCompletionDate && (
                          <div className="text-green-600 font-medium">
                            Done: {formatDate(project.actualCompletionDate)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 text-xs">
                        <div className="flex items-center gap-1 text-neutral-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {project._count.projectSubcontractors}
                        </div>
                        <div className="flex items-center gap-1 text-neutral-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {project._count.invoices}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            No projects found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
