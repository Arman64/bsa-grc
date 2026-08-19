import { NextRequest, NextResponse } from "next/server";
import { getSiteChrome, saveChrome } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSiteChrome();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal ambil pengaturan tampilan" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const patch: any = {};
    if (body.appearance) patch.appearance = body.appearance;
    if (body.navigation) patch.navigation = body.navigation;
    if (body.footer) patch.footer = body.footer;
    if (body.integrations) patch.integrations = body.integrations;
    await saveChrome(patch);
    return NextResponse.json({ success: true, message: "Tersimpan & langsung tayang di website" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal simpan: " + String(e) }, { status: 500 });
  }
}
