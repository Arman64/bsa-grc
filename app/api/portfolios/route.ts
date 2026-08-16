import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({ success: true, data, source: "neon-db" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal ambil portfolio" }, { status: 500 });
  }
}
