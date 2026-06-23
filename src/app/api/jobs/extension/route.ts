import { NextRequest, NextResponse } from 'next/server';
import { extensionJobs, addExtensionJob } from '@/lib/extensionStore';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, role, company } = body;
    const finalRole = title || role;

    if (!finalRole || !company) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing title/role or company name',
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const newJob = addExtensionJob({ company, role: finalRole });
    console.log('Successfully saved job data from extension:', newJob);

    return NextResponse.json(
      {
        success: true,
        message: 'Job data received by backend!',
        job: newJob,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } 
  catch (error) {
    console.error('Error parsing extension job data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid JSON payload received',
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    jobs: extensionJobs,
  });
}
