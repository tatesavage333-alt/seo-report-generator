import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const url = searchParams.get('url');

    // Validate parameters
    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Limit must be between 1 and 50' 
        },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Offset must be non-negative' 
        },
        { status: 400 }
      );
    }

    // Build query conditions
    const whereCondition = url ? {
      url: {
        contains: url,
        mode: 'insensitive' as const
      }
    } : {};

    // Get reports with pagination
    const [reports, totalCount] = await Promise.all([
      prisma.seoReport.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          url: true,
          title: true,
          description: true,
          titleLength: true,
          descriptionLength: true,
          hasTitle: true,
          hasDescription: true,
          hasKeywords: true,
          hasH1: true,
          createdAt: true,
          updatedAt: true,
        }
      }),
      prisma.seoReport.count({
        where: whereCondition
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        reports,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch reports' 
      },
      { status: 500 }
    );
  }
}
