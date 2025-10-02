'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Calendar,
  FileText,
  Hash,
  Type,
  Eye,
  Copy,
  Download
} from 'lucide-react';
import { SeoReport } from '@/types';

interface SeoReportDisplayProps {
  report: SeoReport;
  onClose?: () => void;
}

export default function SeoReportDisplay({ report, onClose }: SeoReportDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreFromAnalysis = (analysis: string): number => {
    // Try to extract score from AI analysis
    const scoreMatch = analysis.match(/score[:\s]*(\d+)/i);
    if (scoreMatch) {
      return parseInt(scoreMatch[1]);
    }
    
    // Fallback: calculate basic score based on available elements
    let score = 0;
    if (report.hasTitle) score += 25;
    if (report.hasDescription) score += 25;
    if (report.hasH1) score += 20;
    if (report.hasKeywords) score += 10;
    if (report.titleLength && report.titleLength >= 30 && report.titleLength <= 60) score += 10;
    if (report.descriptionLength && report.descriptionLength >= 120 && report.descriptionLength <= 160) score += 10;
    
    return score;
  };

  const seoScore = getScoreFromAnalysis(report.aiAnalysis);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">SEO Report</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Generated on {formatDate(report.createdAt)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href={report.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                {report.url}
                <ExternalLink className="h-4 w-4" />
              </a>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(seoScore)}`}>
                SEO Score: {seoScore}/100
              </div>
            </div>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <XCircle className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-6 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            {report.hasTitle ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm font-medium">Title Tag</span>
          </div>
          
          <div className="flex items-center gap-2">
            {report.hasDescription ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm font-medium">Meta Description</span>
          </div>
          
          <div className="flex items-center gap-2">
            {report.hasH1 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm font-medium">H1 Heading</span>
          </div>
          
          <div className="flex items-center gap-2">
            {report.hasKeywords ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
            <span className="text-sm font-medium">Meta Keywords</span>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="p-6 space-y-6">
        {/* Title Analysis */}
        {report.title && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Title Tag</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between gap-2">
                <p className="text-gray-900 flex-1">{report.title}</p>
                <button
                  onClick={() => copyToClipboard(report.title!, 'title')}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {copiedField === 'title' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Length: {report.titleLength} characters
                {report.titleLength && (
                  <span className={`ml-2 ${
                    report.titleLength >= 30 && report.titleLength <= 60
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}>
                    ({report.titleLength >= 30 && report.titleLength <= 60 ? 'Good' : 'Needs improvement'})
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Meta Description */}
        {report.description && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Meta Description</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between gap-2">
                <p className="text-gray-900 flex-1">{report.description}</p>
                <button
                  onClick={() => copyToClipboard(report.description!, 'description')}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {copiedField === 'description' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Length: {report.descriptionLength} characters
                {report.descriptionLength && (
                  <span className={`ml-2 ${
                    report.descriptionLength >= 120 && report.descriptionLength <= 160
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}>
                    ({report.descriptionLength >= 120 && report.descriptionLength <= 160 ? 'Good' : 'Needs improvement'})
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Keywords */}
        {report.keywords && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Meta Keywords</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between gap-2">
                <p className="text-gray-900 flex-1">{report.keywords}</p>
                <button
                  onClick={() => copyToClipboard(report.keywords!, 'keywords')}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {copiedField === 'keywords' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered SEO Analysis</h3>
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-800">{report.aiAnalysis}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
