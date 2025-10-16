'use client';

import { exportSubcontractorsToCSV } from '@/lib/csv-export';

interface ExportButtonProps {
  subcontractors: any[];
}

export default function ExportButton({ subcontractors }: ExportButtonProps) {
  const handleExport = () => {
    exportSubcontractorsToCSV(subcontractors);
  };

  return (
    <button
      onClick={handleExport}
      className="btn btn-secondary btn-md"
      disabled={subcontractors.length === 0}
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export to CSV
    </button>
  );
}
