import { NextResponse } from "next/server";
import { getIndexNowKey } from "@/lib/sitemap-ping";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = await getIndexNowKey();
  return new NextResponse(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
