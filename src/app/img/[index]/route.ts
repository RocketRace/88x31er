import { NextRequest, NextResponse } from "next/server";
import { Jimp } from "jimp";

export const dynamic = 'force-static'

// chunk of code annoyingly copied over
const width = 88;
const height = 31;
const totalBits = width * height * (8 + 8 + 8);
const totalBanners = 1n << BigInt(totalBits);
// randomly selected coefficients satisfying the Hull-Dobell theorem
// ~> m (= totalBanners), c coprime (m power of 2 and c odd)
// ~> a-1 divisible by prime factors of m (m power of 2 => a odd)
// ~> a-1 divisible by 4 if m divisible by 4 (m divisible by 4 => a = 1 mod 4)
const a = ((totalBanners - 3n ** 41308n) | 0b11n) ^ 0b10n;
const c = ((totalBanners - 5n ** 28195n)) | 1n;

// Using explicit routes, since we are returning raw images
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ index: string }> }
) {
  const index = (await params).index;
  const input = BigInt(index);
  const hex = BigInt.asUintN(totalBits, input * a + c).toString(16);
  const bits = Buffer.from(hex, "hex");
  const image = new Jimp({ width: 88, height: 31, color: 0xffffffff });
  for (let x = 0; x < 88; x++) {
    for (let y = 0; y < 31; y++) {
      const i = (y * 88 + x) * 3;
      // Not using bitwise ops because JS is bees
      const rgb = bits[i] * 2**24 + bits[i + 1] * 2**16 + bits[i + 2] * 2**8 + 0xff;
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
