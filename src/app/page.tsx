'use client';

import { useState } from 'react';
import { Search, FileText, BarChart3 } from 'lucide-react';
import UrlForm from '@/components/UrlForm';
import SeoReportDisplay from '@/components/SeoReportDisplay';
import SavedReportsList from '@/components/SavedReportsList';
import { SeoReport, AnalysisResponse } from '@/types';

export default function Home() {
  const [currentReport, setCurrentReport] = useState<SeoReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyze' | 'reports'>('analyze');
  const [error, setError] = useState('');

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setError('');
    setCurrentReport(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data: AnalysisResponse = await response.json();

      if (data.success && data.data) {
        setCurrentReport(data.data);
      } else {
        setError(data.error || 'Failed to analyze website');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewReport = (report: SeoReport) => {
    setCurrentReport(report);
    setActiveTab('analyze');
  };

  const handleCloseReport = () => {
    setCurrentReport(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SEO Report Generator</h1>
              <p className="text-gray-600">Generate comprehensive SEO reports with AI-powered analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analyze'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Analyze Website
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Saved Reports
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {activeTab === 'analyze' ? (
          <div className="space-y-8">
            <UrlForm onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

            {currentReport && (
              <SeoReportDisplay 
                report={currentReport} 
                onClose={handleCloseReport}
              />
            )}
          </div>
        ) : (
          <SavedReportsList onViewReport={handleViewReport} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>SEO Report Generator - Powered by OpenAI and built with Next.js</p>
            <p className="text-sm mt-2">Analyze any website for SEO optimization opportunities</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
