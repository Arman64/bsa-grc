import { NextRequest, NextResponse } from "next/server";
import { getPageContent, savePageContent } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const slug = new URL(request.url).searchParams.get("slug");
    if (!slug) return NextResponse.json({ success: false, message: "slug wajib" }, { status: 400 });
    const data = await getPageContent(slug);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal ambil konten halaman" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.slug) return NextResponse.json({ success: false, message: "slug wajib" }, { status: 400 });
    await savePageContent({
      slug: body.slug,
      title: body.title,
      description: body.description,
      sections: body.sections || {},
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
    });
    return NextResponse.json({ success: true, message: "Konten halaman tersimpan & langsung tayang" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal simpan: " + String(e) }, { status: 500 });
  }
}
