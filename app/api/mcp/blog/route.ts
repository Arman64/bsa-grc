import { NextRequest, NextResponse } from "next/server";
import { getBlogData, createBlog, slugify, calculateReadingTime } from "@/lib/data";

function checkAuth(request: NextRequest): boolean {
 const apiKey = request.headers.get("x-api-key") || request.headers.get("x-mcp-key") || request.headers.get("authorization")?.replace("Bearer ", "");
 const validKey = process.env.MCP_API_KEY || process.env.BLOG_API_KEY || "bsa-grc-mcp-2026-secret";
 if (!apiKey) return false;
 return apiKey === validKey;
}

function getDocs() {
 return {
  endpoint: "/api/mcp/blog",
  description: "BSA GRC Blog Automation via MCP / n8n / AI Agent",
  auth: {
   required: true,
   headers: ["X-API-KEY: your-secret-key", "X-MCP-KEY", "Authorization: Bearer"],
   default_key: "bsa-grc-mcp-2026-secret (ganti via ENV MCP_API_KEY di Vercel)",
  },
  how_to_test: {
   curl_get: `curl -X GET https://your-domain.vercel.app/api/mcp/blog -H "X-API-KEY: bsa-grc-mcp-2026-secret"`,
   curl_post: `curl -X POST https://your-domain.vercel.app/api/mcp/blog -H "X-API-KEY: bsa-grc-mcp-2026-secret" -H "Content-Type: application/json" -d '{"title":"Judul","content":"## Isi Markdown","category":"Panduan Kubah","isPublished":true}'`,
  },
  storage: "Database",
 };
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
 if (!checkAuth(request)) {
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
  const articleUrl = `${siteUrl}/blog/${newBlog.slug}`;

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

export async function GET(request: NextRequest) {
 if (!checkAuth(request)) {
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
   data: blogs.slice(0, limit).map((b) => ({ id: b.id, slug: b.slug, title: b.title, url: `/blog/${b.slug}`, isPublished: b.isPublished, publishedAt: b.publishedAt })),
  });
 } catch (e) {
  return NextResponse.json({ success: false, message: "Gagal ambil blog - cek DATABASE_URL" }, { status: 500 });
 }
}
