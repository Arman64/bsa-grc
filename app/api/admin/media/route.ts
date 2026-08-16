import { NextRequest, NextResponse } from "next/server";
import { getMediaData, createMedia, deleteMedia } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getMediaData();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal ambil media" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.url || !body.fileName) {
      return NextResponse.json({ success: false, message: "URL & fileName wajib" }, { status: 400 });
    }
    const created = await createMedia({
      url: body.url,
      fileName: body.fileName,
      originalName: body.originalName,
      size: body.size || 0,
      type: body.type || "image/avif",
      folder: body.folder || "general",
      alt: body.alt,
      width: body.width,
      height: body.height,
    });
    return NextResponse.json({ success: true, message: "Media ditambah", data: created }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal tambah media" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
    await deleteMedia(Number(id));
    // Note: file di public/images tetap ada, hanya record DB dihapus. Untuk hapus file fisik butuh fs.unlink
    return NextResponse.json({ success: true, message: "Media dihapus dari DB (file fisik masih ada di public/images)" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Gagal hapus" }, { status: 500 });
  }
}
