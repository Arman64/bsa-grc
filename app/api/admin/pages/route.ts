import { NextRequest, NextResponse } from "next/server";
import { getPageSettingsData, createPageSettings, updatePageSettings, deletePageSettings } from "@/lib/data";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.slug || !body.title) {
      return NextResponse.json({ success: false, message: "Slug & title wajib" }, { status: 400 });
    }
    const created = await createPageSettings({
      slug: body.slug,
      title: body.title,
      description: body.description,
      sections: body.sections || {},
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      isActive: body.isActive ?? true,
    });
    return NextResponse.json({ success: true, message: "Page settings ditambah", data: created }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal tambah page settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
    const updated = await updatePageSettings(Number(body.id), body);
    return NextResponse.json({ success: true, message: "Page settings diupdate", data: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
    await deletePageSettings(Number(id));
    return NextResponse.json({ success: true, message: "Page settings dihapus" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal hapus" }, { status: 500 });
  }
}
