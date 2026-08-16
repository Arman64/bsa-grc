import { NextRequest, NextResponse } from "next/server";
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAllTestimonials();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal ambil testimoni" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.text) {
      return NextResponse.json({ success: false, message: "Nama & testimoni wajib" }, { status: 400 });
    }
    const created = await createTestimonial({
      name: body.name,
      location: body.location || "Trenggalek",
      role: body.role || "Panitia Masjid",
      text: body.text,
      result: body.result,
      photo: body.photo,
      rating: body.rating || 5,
      category: body.category || "Kubah GRC",
      isActive: body.isActive ?? true,
    });
    return NextResponse.json({ success: true, message: "Testimoni ditambah ke Neon DB", data: created }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal tambah testimoni" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
    const updated = await updateTestimonial(Number(body.id), body);
    return NextResponse.json({ success: true, message: "Testimoni diupdate", data: updated });
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
    await deleteTestimonial(Number(id));
    return NextResponse.json({ success: true, message: "Testimoni dihapus" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal hapus" }, { status: 500 });
  }
}
