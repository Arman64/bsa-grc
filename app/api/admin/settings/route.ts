import { NextRequest, NextResponse } from "next/server";
import { getSettingsData, saveSettingsData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSettingsData();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal ambil pengaturan, cek DATABASE_URL Neon" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.company?.name || !body.company?.whatsapp) {
      return NextResponse.json({ success: false, message: "Nama perusahaan dan WhatsApp wajib" }, { status: 400 });
    }

    const saved = await saveSettingsData(body);

    if (!saved) throw new Error("Gagal menyimpan");

    return NextResponse.json({ success: true, message: "Pengaturan berhasil diupdate di Neon DB", data: body });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal update pengaturan - cek DATABASE_URL & tabel settings" }, { status: 500 });
  }
}
