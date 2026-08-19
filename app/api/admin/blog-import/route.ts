import { NextRequest, NextResponse } from "next/server";
import { parseWxr, rewriteAndConvertContent, resolveFeaturedImage } from "@/lib/wp-import";
import { createBlog, updateBlog, getBlogData, slugify, calculateReadingTime } from "@/lib/data";
import { pingSitemap } from "@/lib/sitemap-ping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, message: "File XML wajib diupload" }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith(".xml")) {
      return NextResponse.json({ success: false, message: "File harus format .xml (WordPress export)" }, { status: 400 });
    }

    const overwriteExisting = formData.get("overwriteExisting") === "true";
    const downloadImages = formData.get("downloadImages") !== "false";
    const defaultStatus = (formData.get("defaultStatus") as string) || "publish"; // publish | draft | keep

    const xml = await file.text();
    const { posts, attachments } = parseWxr(xml);

    if (posts.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada artikel (post_type=post) yang ditemukan di file XML ini." },
        { status: 400 }
      );
    }

    const existing = await getBlogData();
    const existingBySlug = new Map(existing.map((b) => [b.slug, b]));

    const results: { slug: string; title: string; status: "imported" | "updated" | "skipped" | "failed"; url?: string; reason?: string }[] = [];
    let imported = 0;
    let updatedCount = 0;
    let skipped = 0;
    let failed = 0;

    for (const post of posts) {
      const slug = slugify(post.slug || post.title);
      try {
        const already = existingBySlug.get(slug);
        if (already && !overwriteExisting) {
          results.push({ slug, title: post.title, status: "skipped", reason: "Slug sudah ada di database" });
          skipped++;
          continue;
        }

        const markdown = await rewriteAndConvertContent(post.contentHtml, downloadImages, "blog-import");
        const coverImage =
          (await resolveFeaturedImage(post.featuredImageId, attachments, downloadImages, "blog-import")) ||
          "https://bsagrc.co.id/wp-content/uploads/2023/10/Kubah_Masjid-GRC1.webp";

        const isPublished = defaultStatus === "keep" ? post.status === "publish" : defaultStatus === "publish";
        const excerpt = post.excerpt || markdown.replace(/[#*`>-]/g, "").slice(0, 160).trim() + "...";

        const payload = {
          slug,
          title: post.title,
          excerpt,
          content: markdown,
          coverImage,
          category: post.categories[0] || "Artikel",
          tags: post.tags,
          author: "Tim BSA GRC",
          publishedAt: post.pubDate && !isNaN(new Date(post.pubDate).getTime()) ? new Date(post.pubDate).toISOString() : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          seoTitle: post.seoTitle || `${post.title} | BSA GRC - Kontraktor Kubah GRC`,
          seoDescription: post.seoDescription || excerpt,
          keywords: post.tags,
          isPublished,
          views: already?.views ?? 0,
          readingTime: calculateReadingTime(markdown),
        };

        if (already) {
          await updateBlog(already.id, payload as any);
          results.push({ slug, title: post.title, status: "updated", url: `/${slug}` });
          updatedCount++;
        } else {
          await createBlog(payload as any);
          results.push({ slug, title: post.title, status: "imported", url: `/${slug}` });
          imported++;
        }
      } catch (e) {
        failed++;
        results.push({ slug, title: post.title, status: "failed", reason: String((e as Error).message) });
      }
    }

    if (imported + updatedCount > 0) {
      pingSitemap().catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: `Import selesai: ${imported} artikel baru, ${updatedCount} diupdate, ${skipped} dilewati, ${failed} gagal (dari ${posts.length} artikel ditemukan)`,
      summary: { total: posts.length, imported, updated: updatedCount, skipped, failed },
      results,
    });
  } catch (error) {
    console.error("Blog import error:", error);
    return NextResponse.json({ success: false, message: "Gagal import - " + String((error as Error).message) }, { status: 500 });
  }
}
