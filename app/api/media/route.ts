import { NextResponse } from "next/server";
import { getMediaData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getMediaData();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal ambil media" }, { status: 500 });
  }
}
