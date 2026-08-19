/**
 * BSA GRC - Auto notify search engines saat artikel baru dipublish.
 * Google mematikan endpoint sitemap-ping sejak Juni 2023, jadi kita pakai kombinasi:
 * 1) Bing legacy sitemap ping (masih aktif)
 * 2) IndexNow protocol (dipakai Bing + Yandex, tanpa perlu akun apapun)
 */
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { COMPANY_INFO } from "./constants";
import { db, isDbEnabled } from "./db";
import { settings } from "./schema";

async function getOrCreateIndexNowKey(): Promise<string> {
  if (!isDbEnabled || !db) return randomBytes(16).toString("hex");
  try {
    const rows = await db.select().from(settings).limit(1).execute();
    const row: any = rows[0];
    const integrations = row?.integrations || {};
    if (integrations.indexNowKey) return integrations.indexNowKey;

    const key = randomBytes(16).toString("hex");
    if (row) {
      await db.update(settings).set({ integrations: { ...integrations, indexNowKey: key } }).where(eq(settings.id, row.id)).execute();
    }
    return key;
  } catch (e) {
    console.warn("getOrCreateIndexNowKey error:", (e as Error).message);
    return randomBytes(16).toString("hex");
  }
}

export async function getIndexNowKey(): Promise<string> {
  return getOrCreateIndexNowKey();
}

async function pingBing(sitemapUrl: string): Promise<void> {
  try {
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, { signal: AbortSignal.timeout(8000) });
  } catch (e) {
    console.warn("Bing sitemap ping gagal:", (e as Error).message);
  }
}

async function pingIndexNow(siteUrl: string, urlList: string[]): Promise<void> {
  try {
    const key = await getIndexNowKey();
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteUrl).hostname,
        key,
        keyLocation: `${siteUrl}/api/indexnow-key`,
        urlList,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    console.warn("IndexNow ping gagal:", (e as Error).message);
  }
}

/** Fire-and-forget: ping search engines that the sitemap changed (bulk import / new articles). */
export async function pingSitemap(): Promise<void> {
  const siteUrl = COMPANY_INFO.website;
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  await Promise.all([pingBing(sitemapUrl), pingIndexNow(siteUrl, [sitemapUrl, `${siteUrl}/blog`])]);
}

/** Fire-and-forget: notify search engines about one specific published/updated article URL. */
export async function pingUrl(articleUrl: string): Promise<void> {
  const siteUrl = COMPANY_INFO.website;
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  await Promise.all([pingBing(sitemapUrl), pingIndexNow(siteUrl, [articleUrl, sitemapUrl])]);
}
