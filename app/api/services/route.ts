import { NextResponse } from "next/server";
import { getServicesData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
 try {
  const data = await getServicesData();
  return NextResponse.json({ success: true, data, source: "neon-db" });
 } catch (e) {
  console.error(e);
  return NextResponse.json({ success: false, message: "Gagal ambil layanan" }, { status: 500 });
 }
}
