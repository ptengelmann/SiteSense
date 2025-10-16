/**
 * CSV Export Utility for SiteSense
 * Provides functions to export data to CSV format
 */

export function downloadCSV(filename: string, data: string) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function arrayToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) {
    return '';
  }

  // If headers not provided, extract from first object
  const csvHeaders = headers || Object.keys(data[0]);

  // Escape and quote values
  const escapeValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    // If value contains comma, newline, or quote, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  // Build CSV string
  const csvRows: string[] = [];

  // Add headers
  csvRows.push(csvHeaders.map(escapeValue).join(','));

  // Add data rows
  for (const row of data) {
    const values = csvHeaders.map(header => escapeValue(row[header]));
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

export function formatDateForCSV(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB');
}

export function formatCurrencyForCSV(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '';
  return amount.toFixed(2);
}

// Specific export functions

export function exportSubcontractorsToCSV(subcontractors: any[]) {
  const data = subcontractors.map(sub => ({
    'Company Name': sub.companyName,
    'Contact Name': sub.contactName,
    'Email': sub.email,
    'Phone': sub.phone,
    'UTR': sub.utr,
    'CIS Status': sub.cisStatus || 'N/A',
    'CIS Expiry': formatDateForCSV(sub.cisVerificationExpiresAt),
    'Public Liability Expiry': formatDateForCSV(sub.publicLiabilityExpiresAt),
    'CSCS Card Expiry': formatDateForCSV(sub.cscsCardExpiresAt),
    'Payment Terms (Days)': sub.paymentTermsDays,
    'Total Paid (£)': formatCurrencyForCSV(sub.totalPaid),
    'Total Invoices': sub.totalInvoices,
    'Active': sub.isActive ? 'Yes' : 'No',
  }));

  const csv = arrayToCSV(data);
  const filename = `subcontractors-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(filename, csv);
}

export function exportInvoicesToCSV(invoices: any[]) {
  const data = invoices.map(inv => ({
    'Invoice Number': inv.invoiceNumber,
    'Date': formatDateForCSV(inv.invoiceDate),
    'Subcontractor': inv.subcontractor?.companyName || 'N/A',
    'Project': inv.project?.name || 'N/A',
    'Amount (£)': formatCurrencyForCSV(inv.amount),
    'CIS Deduction (£)': formatCurrencyForCSV(inv.cisDeduction),
    'Net Payment (£)': formatCurrencyForCSV(inv.netPayment),
    'Status': inv.status,
    'Due Date': formatDateForCSV(inv.dueDate),
    'Payment Date': formatDateForCSV(inv.paymentDate),
  }));

  const csv = arrayToCSV(data);
  const filename = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(filename, csv);
}

export function exportPaymentRunsToCSV(paymentRuns: any[]) {
  const data = paymentRuns.map(pr => ({
    'Payment Run Name': pr.name,
    'Scheduled Date': formatDateForCSV(pr.scheduledDate),
    'Status': pr.status,
    'Invoice Count': pr.invoiceCount,
    'Total Amount (£)': formatCurrencyForCSV(pr.totalAmount),
    'CIS Deductions (£)': formatCurrencyForCSV(pr.totalCisDeduction),
    'Net Payment (£)': formatCurrencyForCSV(pr.netPayment),
    'Exported At': formatDateForCSV(pr.exportedAt),
    'Paid At': formatDateForCSV(pr.paidAt),
  }));

  const csv = arrayToCSV(data);
  const filename = `payment-runs-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(filename, csv);
}

export function exportProjectsToCSV(projects: any[]) {
  const data = projects.map(proj => ({
    'Project Name': proj.name,
    'Project Number': proj.projectNumber || 'N/A',
    'Status': proj.status,
    'Client': proj.clientName || 'N/A',
    'Budget (£)': formatCurrencyForCSV(proj.budget),
    'Actual Cost (£)': formatCurrencyForCSV(proj.actualCost),
    'Start Date': formatDateForCSV(proj.startDate),
    'Completion Date': formatDateForCSV(proj.estimatedCompletionDate),
    'On Schedule': proj.onSchedule ? 'Yes' : 'No',
    'Days Delay': proj.daysDelay || 0,
  }));

  const csv = arrayToCSV(data);
  const filename = `projects-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(filename, csv);
}
