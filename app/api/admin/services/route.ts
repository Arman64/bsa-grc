import { NextRequest, NextResponse } from "next/server";
import { getServicesData, updateService } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
 try {
  const data = await getServicesData();
  return NextResponse.json({ success: true, data });
 } catch (e) {
  console.error(e);
  return NextResponse.json({ success: false, message: "Gagal ambil layanan" }, { status: 500 });
 }
}

export async function PUT(request: NextRequest) {
 try {
  const body = await request.json();

  if (!body.id) {
   return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
  }

  const updated = await updateService(body.id, body);

  return NextResponse.json({ success: true, message: "Layanan berhasil diupdate di", data: updated });
 } catch (error) {
  console.error(error);
  return NextResponse.json({ success: false, message: "Gagal update layanan - cek DATABASE_URL & tabel services" }, { status: 500 });
 }
}
