import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, createPortfolio, updatePortfolio, deletePortfolio } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("GET portfolio error:", e);
    return NextResponse.json({ success: false, message: "Gagal ambil data, cek DATABASE_URL Neon" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.category || !body.image) {
      return NextResponse.json({ success: false, message: "Judul, kategori, dan gambar wajib diisi" }, { status: 400 });
    }

    const newItem = await createPortfolio({
      title: body.title.trim(),
      category: body.category,
      location: body.location?.trim() || "Trenggalek, Jatim",
      year: body.year || new Date().getFullYear().toString(),
      image: body.image.trim(),
      diameter: body.diameter,
      height: body.height,
      material: body.material,
      client: body.client,
      description: body.description,
    });

    return NextResponse.json({ success: true, message: "Portofolio berhasil ditambah ke Neon DB", data: newItem }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal menambah portofolio - cek DATABASE_URL & tabel portfolios" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
    }

    const updated = await updatePortfolio(Number(body.id), body);

    return NextResponse.json({ success: true, message: "Portofolio berhasil diupdate di Neon DB", data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal update portofolio" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
    }

    await deletePortfolio(Number(id));

    return NextResponse.json({ success: true, message: "Portofolio berhasil dihapus dari Neon DB" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal hapus portofolio" }, { status: 500 });
  }
}
