'use client';

import { useState, useEffect } from 'react';

type Document = {
  id: string;
  title: string;
  description: string | null;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  category: string;
  tags: string[];
  expiresAt: string | null;
  createdAt: string;
};

interface EntityDocumentsProps {
  entityType: string;
  entityId: string;
  allowedCategories?: string[];
}

const DEFAULT_CATEGORIES = [
  'INVOICE',
  'CONTRACT',
  'INSURANCE_CERTIFICATE',
  'CIS_CERTIFICATE',
  'QUALIFICATION',
  'HEALTH_SAFETY',
  'PHOTO',
  'REPORT',
  'OTHER',
];

export default function EntityDocuments({
  entityType,
  entityId,
  allowedCategories = DEFAULT_CATEGORIES,
}: EntityDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: allowedCategories[0],
    tags: '',
    expiresAt: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [entityType, entityId]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `/api/documents?entityType=${entityType}&entityId=${entityId}`
      );
      const data = await response.json();
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);
      formData.append('tags', uploadForm.tags);
      formData.append('entityType', entityType);
      formData.append('entityId', entityId);
      if (uploadForm.expiresAt) {
        formData.append('expiresAt', uploadForm.expiresAt);
      }

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload');
      }

      setMessage({ type: 'success', text: 'File uploaded successfully!' });
      setShowUploadModal(false);
      resetUploadForm();
      fetchDocuments();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      description: '',
      category: allowedCategories[0],
      tags: '',
      expiresAt: '',
    });
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete');
      }

      setMessage({ type: 'success', text: 'Document deleted successfully' });
      fetchDocuments();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return '📄';
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    return '📄';
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <p className="text-neutral-600 text-sm mt-2">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-900">Documents</h3>
        <button onClick={() => setShowUploadModal(true)} className="btn btn-sm btn-outline">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg border text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-neutral-200 rounded-lg">
          <svg
            className="w-12 h-12 mx-auto text-neutral-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm text-neutral-600">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.map(doc => (
            <div key={doc.id} className="border border-neutral-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="text-2xl">{getFileIcon(doc.mimeType)}</div>
                <div className="flex gap-2">
                  <a
                    href={doc.fileUrl}
                    download
                    className="text-primary-600 hover:text-primary-700"
                    title="Download"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <h4 className="font-medium text-neutral-900 text-sm mb-1 truncate" title={doc.title}>
                {doc.title}
              </h4>
              <p className="text-xs text-neutral-600 mb-2 truncate" title={doc.fileName}>
                {doc.fileName}
              </p>

              {doc.description && (
                <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
                  {doc.description}
                </p>
              )}

              <div className="flex flex-wrap gap-1 mb-2">
                <span className="badge badge-primary text-xs">
                  {formatCategory(doc.category)}
                </span>
                {doc.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="badge text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-xs text-neutral-500">
                <div>{formatFileSize(doc.fileSize)} • {new Date(doc.createdAt).toLocaleDateString()}</div>
                {doc.expiresAt && (
                  <div className="text-orange-600 font-medium">
                    Expires: {new Date(doc.expiresAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-neutral-900">Upload Document</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="label text-sm">File <span className="text-red-500">*</span></label>
                  <input
                    type="file"
                    required
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="input text-sm"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
                  />
                  <p className="text-xs text-neutral-600 mt-1">Max 10MB</p>
                </div>

                <div>
                  <label className="label text-sm">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="input text-sm"
                  />
                </div>

                <div>
                  <label className="label text-sm">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="input text-sm"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="label text-sm">Category <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="input text-sm"
                  >
                    {allowedCategories.map(cat => (
                      <option key={cat} value={cat}>{formatCategory(cat)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label text-sm">Tags</label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    className="input text-sm"
                    placeholder="urgent, renewal (comma-separated)"
                  />
                </div>

                <div>
                  <label className="label text-sm">Expiry Date</label>
                  <input
                    type="date"
                    value={uploadForm.expiresAt}
                    onChange={(e) => setUploadForm({ ...uploadForm, expiresAt: e.target.value })}
                    className="input text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      resetUploadForm();
                    }}
                    className="btn btn-outline btn-sm"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="btn btn-primary btn-sm"
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
