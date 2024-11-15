import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = new URL(request.url).searchParams;
  console.log(query);
  return new NextResponse("Hello, world!");
}
