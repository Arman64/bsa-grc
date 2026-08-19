/**
 * BSA GRC - Streams private Vercel Blob files (store "bsa-grc-media" is access-mode Private,
 * so raw blob.url is not publicly fetchable - this proxy serves bytes using the same server token).
 */
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const pathname = params.path.join("/");
  try {
    const { get } = await import("@vercel/blob");
    const result = await get(pathname, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }
    return new NextResponse(result.stream as any, {
      headers: {
        "Content-Type": result.blob.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    console.error("Media proxy error:", e);
    return new NextResponse("Not found", { status: 404 });
  }
}
