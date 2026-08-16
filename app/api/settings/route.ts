import { NextResponse } from "next/server";
import { getSettingsData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await getSettingsData();
    return NextResponse.json({
      success: true,
      data: {
        company: settings.company,
        hero: settings.hero,
        seo: settings.seo,
      },
      source: process.env.DATABASE_URL ? "neon-db" : "json-fallback",
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      }
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ success: false, message: "Gagal ambil pengaturan - cek DATABASE_URL" }, { status: 500 });
  }
}
