import { NextResponse } from "next/server";
import { getFaqsData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
 try {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const data = category ? await getFaqsData().then((all) => all.filter((f) => f.category === category || f.serviceSlug === category)) : await getFaqsData();
  return NextResponse.json({ success: true, data, source: "neon-db" });
 } catch (e) {
  console.error(e);
  return NextResponse.json({ success: false, message: "Gagal ambil FAQ" }, { status: 500 });
 }
}
