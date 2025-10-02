export interface ScrapedMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  metaTags: Record<string, string>;
  url: string;
}

export interface SeoAnalysis {
  recommendations: string[];
  score: number;
  issues: string[];
  strengths: string[];
}

export interface SeoReport {
  id: string;
  url: string;
  title?: string;
  description?: string;
  keywords?: string;
  headings?: string;
  metaTags?: string;
  aiAnalysis: string;
  titleLength?: number;
  descriptionLength?: number;
  hasTitle: boolean;
  hasDescription: boolean;
  hasKeywords: boolean;
  hasH1: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisRequest {
  url: string;
}

export interface AnalysisResponse {
  success: boolean;
  data?: SeoReport;
  error?: string;
}
