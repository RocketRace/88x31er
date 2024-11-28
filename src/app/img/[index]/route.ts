import { NextRequest, NextResponse } from "next/server";
import { Jimp } from "jimp";
import { randomBytes } from "crypto";

export const dynamic = 'force-static'

// Using explicit routes, since we are returning raw images
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ index: string }> }
) {
  const index = (await params).index;
  // const input = Buffer.from(index, "base64url");
  const input = randomBytes(65472 / 8);
  const image = new Jimp({ width: 88, height: 31, color: 0xffffffff });
  for (let x = 0; x < 88; x++) {
    for (let y = 0; y < 31; y++) {
      const i = (y * 88 + x) * 3;
      // Not using bitwise ops because JS is bees
      const rgb = input[i] * 2**24 + input[i + 1] * 2**16 + input[i + 2] * 2**8 + 0xff;
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
