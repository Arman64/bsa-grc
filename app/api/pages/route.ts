import { NextResponse } from "next/server";
import { getPageSettingsData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPageSettingsData();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal ambil page settings" }, { status: 500 });
  }
}
