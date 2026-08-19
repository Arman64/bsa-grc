/**
 * BSA GRC - WordPress WXR (eksport XML) parser untuk bulk import artikel blog.
 */
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";
import { slugify } from "./data";
import { downloadAndStoreImage } from "./storage";

export interface ParsedWpPost {
  title: string;
  slug: string;
  contentHtml: string;
  excerpt: string;
  status: string;
  pubDate: string;
  categories: string[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  featuredImageId?: string;
}

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });

function getText(v: any): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object") {
    if ("cdata" in v) return String(v.cdata ?? "");
    if ("#text" in v) return String(v["#text"]);
  }
  return "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function extractImageUrls(html: string): string[] {
  const urls = new Set<string>();
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html))) urls.add(m[1]);
  return Array.from(urls);
}

export function parseWxr(xml: string): { posts: ParsedWpPost[]; attachments: Map<string, string> } {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    cdataPropName: "cdata",
    isArray: (name) => ["item", "wp:postmeta", "category"].includes(name),
  });
  const doc = parser.parse(xml);
  const items: any[] = doc?.rss?.channel?.item || [];

  const attachments = new Map<string, string>();
  for (const it of items) {
    if (getText(it["wp:post_type"]) === "attachment") {
      const id = getText(it["wp:post_id"]);
      const url = getText(it["wp:attachment_url"]);
      if (id && url) attachments.set(id, url);
    }
  }

  const posts: ParsedWpPost[] = [];
  for (const it of items) {
    if (getText(it["wp:post_type"]) !== "post") continue;

    const title = getText(it.title) || "Untitled";
    const slug = slugify(getText(it["wp:post_name"]) || title);
    const contentHtml = getText(it["content:encoded"]);
    if (!contentHtml.trim()) continue;

    const excerptRaw = getText(it["excerpt:encoded"]);
    const status = getText(it["wp:status"]) || "draft";
    const pubDate = getText(it["wp:post_date"]) || getText(it.pubDate);

    const cats: any[] = it.category || [];
    const categories = cats.filter((c) => c["@_domain"] === "category").map((c) => getText(c)).filter(Boolean);
    const tags = cats.filter((c) => c["@_domain"] === "post_tag").map((c) => getText(c)).filter(Boolean);

    const postmetaArr: any[] = it["wp:postmeta"] || [];
    let seoTitle: string | undefined, seoDescription: string | undefined, featuredImageId: string | undefined;
    for (const meta of postmetaArr) {
      const key = getText(meta["wp:meta_key"]);
      const value = getText(meta["wp:meta_value"]);
      if (key === "_yoast_wpseo_title") seoTitle = value;
      if (key === "_yoast_wpseo_metadesc") seoDescription = value;
      if (key === "_thumbnail_id") featuredImageId = value;
    }

    posts.push({
      title,
      slug,
      contentHtml,
      excerpt: stripHtml(excerptRaw).slice(0, 200),
      status,
      pubDate,
      categories,
      tags,
      seoTitle,
      seoDescription,
      featuredImageId,
    });
  }

  return { posts, attachments };
}

/** Rewrites <img> URLs (optionally re-hosting them) then converts HTML -> Markdown. */
export async function rewriteAndConvertContent(html: string, downloadImages: boolean, folder: string): Promise<string> {
  let processed = html.replace(/<!--\s*\/?wp:[^>]*-->/g, "");

  if (downloadImages) {
    const urls = extractImageUrls(processed);
    const concurrency = 4;
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency);
      const newUrls = await Promise.all(batch.map((u) => downloadAndStoreImage(u, folder)));
      batch.forEach((oldUrl, idx) => {
        if (newUrls[idx] !== oldUrl) processed = processed.split(oldUrl).join(newUrls[idx]);
      });
    }
  }

  return turndown.turndown(processed);
}

export async function resolveFeaturedImage(
  featuredImageId: string | undefined,
  attachments: Map<string, string>,
  downloadImages: boolean,
  folder: string
): Promise<string | undefined> {
  if (!featuredImageId) return undefined;
  const url = attachments.get(featuredImageId);
  if (!url) return undefined;
  return downloadImages ? await downloadAndStoreImage(url, folder) : url;
}
