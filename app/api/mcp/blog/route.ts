import { NextRequest, NextResponse } from "next/server";
import { getBlogData, createBlog, updateBlog, slugify, calculateReadingTime } from "@/lib/data";
import { validateToken } from "@/lib/tokens";
import { pingUrl } from "@/lib/sitemap-ping";

async function checkAuth(request: NextRequest, permission: string): Promise<boolean> {
  const apiKey =
    request.headers.get("x-api-key") ||
    request.headers.get("x-mcp-key") ||
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    "";
  if (!apiKey) return false;
  // 1) DB-managed tokens (generated in /admin/mcp) with per-permission + expiry checks
  const result = await validateToken(apiKey, permission);
  if (result.ok) return true;
  // 2) Legacy env key (full access) for backward compatibility
  const legacyKey = process.env.MCP_API_KEY || process.env.BLOG_API_KEY;
  if (legacyKey && apiKey === legacyKey) return true;
  return false;
}

function getDocs() {
 return {
  endpoint: "/api/mcp/blog",
  description: "BSA GRC Blog Automation via MCP / n8n / AI Agent",
  auth: {
   required: true,
   headers: ["X-API-KEY: your-secret-key", "X-MCP-KEY", "Authorization: Bearer"],
   default_key: "Buat & kelola token di Admin → Sistem → Token MCP / API (dengan kadaluarsa & permission). Legacy: ENV MCP_API_KEY.",
  },
  how_to_test: {
   curl_get: `curl -X GET https://your-domain.vercel.app/api/mcp/blog -H "X-API-KEY: bsa-grc-mcp-2026-secret"`,
   curl_post: `curl -X POST https://your-domain.vercel.app/api/mcp/blog -H "X-API-KEY: bsa-grc-mcp-2026-secret" -H "Content-Type: application/json" -d '{"title":"Judul","content":"## Isi Markdown","category":"Panduan Kubah","isPublished":true}'`,
   curl_patch: `curl -X PATCH https://your-domain.vercel.app/api/mcp/blog -H "X-API-KEY: bsa-grc-mcp-2026-secret" -H "Content-Type: application/json" -d '{"slug":"judul-artikel","content":"## Update isi","isPublished":true}'`,
  },
  permissions: { "blog:read": "GET", "blog:write": "POST (buat artikel baru)", "blog:edit": "PATCH (edit konten & publish/unpublish artikel yang sudah ada)" },
  storage: "Database",
 };
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
 if (!(await checkAuth(request, "blog:write"))) {
  return NextResponse.json(
   {
    success: false,
    message: "Unauthorized - Endpoint ini butuh API Key, tidak bisa dibuka langsung di browser",
    docs: getDocs(),
   },
   { status: 401 }
  );
 }

 try {
  const body = (await request.json()) as {
   title: string;
   content: string;
   excerpt?: string;
   coverImage?: string;
   category?: string;
   tags?: string[] | string;
   author?: string;
   slug?: string;
   seoTitle?: string;
   seoDescription?: string;
   keywords?: string[] | string;
   isPublished?: boolean;
   publishedAt?: string;
  };

  if (!body.title || !body.content) {
   return NextResponse.json({ success: false, message: "title & content wajib" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.title);

  const tagsArray = Array.isArray(body.tags) ? body.tags : typeof body.tags === "string" ? body.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const keywordsArray = Array.isArray(body.keywords) ? body.keywords : typeof body.keywords === "string" ? body.keywords.split(",").map((k) => k.trim()).filter(Boolean) : tagsArray;

  const newBlog = await createBlog({
   slug,
   title: body.title.trim(),
   excerpt: body.excerpt?.trim() || body.content.replace(/[#*`]/g, "").slice(0, 160).trim() + "...",
   content: body.content,
   coverImage: body.coverImage || "https://bsagrc.co.id/wp-content/uploads/2023/10/Kubah_Masjid-GRC1.webp",
   category: body.category || "Artikel",
   tags: tagsArray,
   author: body.author || "Tim BSA GRC",
   publishedAt: body.publishedAt || new Date().toISOString(),
   updatedAt: new Date().toISOString(),
   seoTitle: body.seoTitle || `${body.title} | BSA GRC - Kontraktor Kubah GRC`,
   seoDescription: body.seoDescription || body.excerpt || body.content.replace(/[#*`]/g, "").slice(0, 160),
   keywords: keywordsArray,
   isPublished: body.isPublished ?? true,
   views: 0,
   readingTime: calculateReadingTime(body.content),
  } as any);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bsagrc.co.id";
  const articleUrl = `${siteUrl}/${newBlog.slug}`;
  if (newBlog.isPublished) pingUrl(articleUrl).catch(() => {});

  return NextResponse.json(
   {
    success: true,
    message: "Artikel berhasil dipublish otomatis via MCP ke",
    data: {
     id: newBlog.id,
     slug: newBlog.slug,
     title: newBlog.title,
     url: articleUrl,
     readingTime: newBlog.readingTime,
    },
   },
   { status: 201 }
  );
 } catch (error) {
  console.error("MCP Blog error:", error);
  return NextResponse.json({ success: false, message: "Gagal publish via MCP - cek DATABASE_URL & tabel blogs", error: String(error) }, { status: 500 });
 }
}

export async function PATCH(request: NextRequest) {
 if (!(await checkAuth(request, "blog:edit"))) {
  return NextResponse.json(
   {
    success: false,
    message: "Unauthorized - Endpoint ini butuh permission blog:edit",
    docs: getDocs(),
   },
   { status: 401 }
  );
 }

 try {
  const body = (await request.json()) as {
   slug?: string;
   id?: number;
   title?: string;
   content?: string;
   excerpt?: string;
   coverImage?: string;
   category?: string;
   tags?: string[] | string;
   seoTitle?: string;
   seoDescription?: string;
   keywords?: string[] | string;
   isPublished?: boolean;
  };

  if (!body.slug && !body.id) {
   return NextResponse.json({ success: false, message: "slug atau id wajib diisi untuk edit artikel" }, { status: 400 });
  }

  const allBlogs = await getBlogData();
  const target = body.id ? allBlogs.find((b) => b.id === Number(body.id)) : allBlogs.find((b) => b.slug === body.slug);
  if (!target) {
   return NextResponse.json({ success: false, message: "Artikel tidak ditemukan" }, { status: 404 });
  }

  const patch: Record<string, any> = {};
  if (body.title !== undefined) patch.title = body.title;
  if (body.content !== undefined) {
   patch.content = body.content;
   patch.readingTime = calculateReadingTime(body.content);
  }
  if (body.excerpt !== undefined) patch.excerpt = body.excerpt;
  if (body.coverImage !== undefined) patch.coverImage = body.coverImage;
  if (body.category !== undefined) patch.category = body.category;
  if (body.tags !== undefined) patch.tags = Array.isArray(body.tags) ? body.tags : String(body.tags).split(",").map((t) => t.trim()).filter(Boolean);
  if (body.seoTitle !== undefined) patch.seoTitle = body.seoTitle;
  if (body.seoDescription !== undefined) patch.seoDescription = body.seoDescription;
  if (body.keywords !== undefined) patch.keywords = Array.isArray(body.keywords) ? body.keywords : String(body.keywords).split(",").map((k) => k.trim()).filter(Boolean);
  if (body.isPublished !== undefined) patch.isPublished = Boolean(body.isPublished);

  if (Object.keys(patch).length === 0) {
   return NextResponse.json({ success: false, message: "Tidak ada field yang diupdate" }, { status: 400 });
  }

  const updated = await updateBlog(target.id, patch);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bsagrc.co.id";
  const articleUrl = `${siteUrl}/${updated.slug}`;
  if (patch.isPublished) pingUrl(articleUrl).catch(() => {});

  return NextResponse.json({
   success: true,
   message: "Artikel berhasil diupdate via MCP",
   data: { id: updated.id, slug: updated.slug, title: updated.title, isPublished: updated.isPublished, url: articleUrl },
  });
 } catch (error) {
  console.error("MCP Blog PATCH error:", error);
  return NextResponse.json({ success: false, message: "Gagal update artikel via MCP", error: String(error) }, { status: 500 });
 }
}

export async function GET(request: NextRequest) {
 if (!(await checkAuth(request, "blog:read"))) {
  return NextResponse.json(
   {
    success: false,
    message: "Unauthorized - Butuh API Key",
    docs: getDocs(),
    manual_alternative: "Kelola blog manual: /admin/blog",
   },
   { status: 401 }
  );
 }

 try {
  const blogs = await getBlogData();
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || "10");

  return NextResponse.json({
   success: true,
   total: blogs.length,
   source: "neon-db",
   data: blogs.slice(0, limit).map((b) => ({ id: b.id, slug: b.slug, title: b.title, url: `/${b.slug}`, isPublished: b.isPublished, publishedAt: b.publishedAt })),
  });
 } catch (e) {
  return NextResponse.json({ success: false, message: "Gagal ambil blog - cek DATABASE_URL" }, { status: 500 });
 }
}
