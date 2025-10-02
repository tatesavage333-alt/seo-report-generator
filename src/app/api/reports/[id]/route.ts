import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Report ID is required' 
        },
        { status: 400 }
      );
    }

    const report = await prisma.seoReport.findUnique({
      where: { id }
    });

    if (!report) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Report not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Error fetching report:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch report' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Report ID is required' 
        },
        { status: 400 }
      );
    }

    const report = await prisma.seoReport.findUnique({
      where: { id }
    });

    if (!report) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Report not found' 
        },
        { status: 404 }
      );
    }

    await prisma.seoReport.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting report:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete report' 
      },
      { status: 500 }
    );
  }
}
