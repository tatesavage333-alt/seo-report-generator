'use client';

import { useState, useEffect } from 'react';
import { FileText, Calendar, ExternalLink, Trash2, Eye } from 'lucide-react';
import { SeoReport } from '@/types';

interface SavedReportsListProps {
  onViewReport: (report: SeoReport) => void;
}

export default function SavedReportsList({ onViewReport }: SavedReportsListProps) {
  const [reports, setReports] = useState<SeoReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports');
      const data = await response.json();

      if (data.success) {
        setReports(data.data.reports);
      } else {
        setError(data.error || 'Failed to fetch reports');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/reports/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setReports(reports.filter(report => report.id !== id));
      } else {
        setError(data.error || 'Failed to delete report');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getScoreColor = (hasTitle: boolean, hasDescription: boolean, hasH1: boolean) => {
    const score = (hasTitle ? 1 : 0) + (hasDescription ? 1 : 0) + (hasH1 ? 1 : 0);
    if (score === 3) return 'text-green-600 bg-green-100';
    if (score === 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Loading reports...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchReports}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
          <p className="text-gray-600">Generate your first SEO report to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Saved Reports</h2>
              <p className="text-sm text-gray-600">{reports.length} report{reports.length !== 1 ? 's' : ''} saved</p>
            </div>
          </div>
          <button
            onClick={fetchReports}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="divide-y">
        {reports.map((report) => (
          <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 truncate"
                  >
                    {report.url}
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  </a>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(report.hasTitle, report.hasDescription, report.hasH1)}`}>
                    {(report.hasTitle ? 1 : 0) + (report.hasDescription ? 1 : 0) + (report.hasH1 ? 1 : 0)}/3
                  </div>
                </div>
                
                {report.title && (
                  <p className="text-gray-900 font-medium mb-1 truncate">{report.title}</p>
                )}
                
                {report.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{report.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(report.createdAt)}
                  </div>
                  {report.titleLength && (
                    <span>Title: {report.titleLength} chars</span>
                  )}
                  {report.descriptionLength && (
                    <span>Description: {report.descriptionLength} chars</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onViewReport(report)}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="View Report"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  disabled={deletingId === report.id}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Delete Report"
                >
                  {deletingId === report.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
