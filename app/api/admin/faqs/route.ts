import { NextRequest, NextResponse } from "next/server";
import { getAllFaqs, createFaq, updateFaq, deleteFaq } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAllFaqs();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal ambil FAQ" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ success: false, message: "Pertanyaan & jawaban wajib" }, { status: 400 });
    }
    const created = await createFaq({
      question: body.question,
      answer: body.answer,
      category: body.category || "Umum",
      serviceSlug: body.serviceSlug,
      isActive: body.isActive ?? true,
    });
    return NextResponse.json({ success: true, message: "FAQ ditambah ke Neon DB", data: created }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal tambah FAQ" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
    const updated = await updateFaq(Number(body.id), body);
    return NextResponse.json({ success: true, message: "FAQ diupdate", data: updated });
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
    await deleteFaq(Number(id));
    return NextResponse.json({ success: true, message: "FAQ dihapus" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal hapus" }, { status: 500 });
  }
}
