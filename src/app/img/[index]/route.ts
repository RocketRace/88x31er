import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-static'

// Using explicit routes, since we are returning raw images
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ index: string }> }
) {
  const index = (await params).index;
  return new NextResponse(
    `You schmorgled: ${index}`,
    { headers: { 
      'content-type': 'text/plain',
      'cache-control': 'public, max-age=31536000, immutable',
    } 
  });
}
