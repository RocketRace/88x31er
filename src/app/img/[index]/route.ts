import { NextRequest, NextResponse } from "next/server";
import { Jimp } from "jimp";

export const dynamic = 'force-static'

// Using explicit routes, since we are returning raw images
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ index: string }> }
) {
  const index = (await params).index;
  const input = Buffer.from(index, "base64url");
  const image = new Jimp({ width: 88, height: 31, color: 0xffffffff });
  for (let x = 0; x < 88; x++) {
    for (let y = 0; y < 31; y++) {
      const i = (y * 88 + x) * 3;
      const rgb = (input[i] << 16) | (input[i + 1] << 8) | input[i + 2];
      image.setPixelColor(rgb, x, y);
    }
  }
  const jpeg = await image.getBuffer('image/jpeg');
  return new NextResponse(
    jpeg,
    {
      headers: {
        'content-type': 'image/jpeg',
        // 'cache-control': 'public, max-age=31536000, immutable',
      }
    });
}
