import { NextRequest, NextResponse } from 'next/server';
import { WebScraper } from '@/lib/scraper';
import { generateSeoAnalysis } from '@/lib/openai';
import { prisma } from '@/lib/db';
import { AnalysisRequest, AnalysisResponse } from '@/types';

// Rate limiting (simple in-memory store)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Lower limit for scraping

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(key);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.' 
        } as AnalysisResponse,
        { status: 429 }
      );
    }

    const body = await request.json() as AnalysisRequest;
    const { url } = body;

    // Validation
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URL is required and must be a non-empty string' 
        } as AnalysisResponse,
        { status: 400 }
      );
    }

    // Log analysis attempt
    const analysisHistory = await prisma.analysisHistory.create({
      data: {
        url: url.trim(),
        status: 'pending'
      }
    });

    try {
      // Step 1: Scrape the website
      const metadata = await WebScraper.scrapeUrl(url.trim());
      
      // Step 2: Generate AI analysis
      const aiAnalysis = await generateSeoAnalysis(metadata);
      
      // Step 3: Calculate basic SEO metrics
      const titleLength = metadata.title?.length || 0;
      const descriptionLength = metadata.description?.length || 0;
      const hasTitle = !!metadata.title;
      const hasDescription = !!metadata.description;
      const hasKeywords = !!metadata.keywords;
      const hasH1 = metadata.headings.h1.length > 0;

      // Step 4: Save the report to database
      const seoReport = await prisma.seoReport.create({
        data: {
          url: metadata.url,
          title: metadata.title,
          description: metadata.description,
          keywords: metadata.keywords,
          headings: JSON.stringify(metadata.headings),
          metaTags: JSON.stringify(metadata.metaTags),
          aiAnalysis,
          titleLength,
          descriptionLength,
          hasTitle,
          hasDescription,
          hasKeywords,
          hasH1,
        }
      });

      // Update analysis history as successful
      await prisma.analysisHistory.update({
        where: { id: analysisHistory.id },
        data: { status: 'success' }
      });

      return NextResponse.json({
        success: true,
        data: seoReport
      } as AnalysisResponse);

    } catch (error) {
      // Update analysis history with error
      await prisma.analysisHistory.update({
        where: { id: analysisHistory.id },
        data: { 
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      throw error;
    }

  } catch (error) {
    console.error('Error in analyze API:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to analyze website' 
      } as AnalysisResponse,
      { status: 500 }
    );
  }
}
