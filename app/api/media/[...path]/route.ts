/**
 * BSA GRC - Streams private Vercel Blob files (store "bsa-grc-media" is access-mode Private,
 * so raw blob.url is not publicly fetchable - this proxy serves bytes using the same server token).
 */
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const pathname = params.path.join("/");
  // SEC: only serve blobs under our own upload prefix - prevents this public proxy from being used
  // to read arbitrary keys if the store is ever reused for other purposes.
  if (!pathname.startsWith("bsa-grc/") || pathname.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }
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
