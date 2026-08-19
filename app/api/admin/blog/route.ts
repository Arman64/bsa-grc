import { NextRequest, NextResponse } from "next/server";
import { getBlogData, createBlog, updateBlog, deleteBlog, slugify, calculateReadingTime } from "@/lib/data";
import { pingUrl } from "@/lib/sitemap-ping";
import { COMPANY_INFO } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
 try {
  const data = await getBlogData();
  return NextResponse.json({ success: true, data });
 } catch (e) {
  console.error(e);
  return NextResponse.json({ success: false, message: "Gagal ambil blog, cek DATABASE_URL" }, { status: 500 });
 }
}

export async function POST(request: NextRequest) {
 try {
  const body = await request.json();

  if (!body.title || !body.content) {
   return NextResponse.json({ success: false, message: "Judul dan konten wajib" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.title);

  const newBlog = await createBlog({
   slug,
   title: body.title.trim(),
   excerpt: body.excerpt?.trim() || body.content.slice(0, 160).trim() + "...",
   content: body.content,
   coverImage: body.coverImage || "https://bsagrc.co.id/wp-content/uploads/2023/10/Kubah_Masjid-GRC1.webp",
   category: body.category || "Artikel",
   tags: body.tags || [],
   author: body.author || "Tim BSA GRC",
   publishedAt: body.publishedAt || new Date().toISOString(),
   updatedAt: new Date().toISOString(),
   seoTitle: body.seoTitle || `${body.title} | BSA GRC`,
   seoDescription: body.seoDescription || body.excerpt || body.content.slice(0, 160),
   keywords: body.keywords || [],
   isPublished: body.isPublished ?? true,
   views: 0,
   readingTime: body.readingTime || calculateReadingTime(body.content),
  } as any);

  if (newBlog.isPublished) pingUrl(`${COMPANY_INFO.website}/${newBlog.slug}`).catch(() => {});

  return NextResponse.json({ success: true, message: "Artikel berhasil ditambah ke", data: newBlog }, { status: 201 });
 } catch (error) {
  console.error(error);
  return NextResponse.json({ success: false, message: "Gagal tambah artikel - cek DATABASE_URL & tabel blogs" }, { status: 500 });
 }
}

export async function PUT(request: NextRequest) {
 try {
  const body = await request.json();

  if (!body.id) {
   return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
  }

  const updated = await updateBlog(Number(body.id), body);

  if (updated.isPublished) pingUrl(`${COMPANY_INFO.website}/${updated.slug}`).catch(() => {});

  return NextResponse.json({ success: true, message: "Artikel berhasil diupdate di", data: updated });
 } catch (error) {
  console.error(error);
  return NextResponse.json({ success: false, message: "Gagal update artikel" }, { status: 500 });
 }
}

export async function DELETE(request: NextRequest) {
 try {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });

  await deleteBlog(Number(id));
  return NextResponse.json({ success: true, message: "Artikel berhasil dihapus dari" });
 } catch (error) {
  console.error(error);
  return NextResponse.json({ success: false, message: "Gagal hapus" }, { status: 500 });
 }
}
