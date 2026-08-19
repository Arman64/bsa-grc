import { cache } from "react";
import type { Metadata } from "next";
import { getPageContent } from "./cms";
import { getSiteChrome } from "./cms";
import { getSettingsData } from "./data";
import { generateSEOMetadata } from "./seo";

export const getPageContentCached = cache((slug: string) => getPageContent(slug));
export const getSiteChromeCached = cache(() => getSiteChrome());
export const getSettingsCached = cache(() => getSettingsData());

export async function buildPageMetadata(slug: string, path: string): Promise<Metadata> {
  const [content, settings] = await Promise.all([getPageContentCached(slug), getSettingsCached().catch(() => null)]);
  const seo = (settings as any)?.seo || {};
  const siteUrl = seo.siteUrl || "https://bsagrc.co.id";
  return generateSEOMetadata({
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.description || "",
    url: `${siteUrl}${path}`,
    image: seo.ogImage || "https://bsagrc.co.id/wp-content/uploads/2023/11/kubah-grc-menara-grc-krawangan-grc.png",
  });
}

export function waLink(whatsapp?: string): string {
  const num = (whatsapp || "6281230469914").replace(/[^0-9]/g, "");
  return `https://api.whatsapp.com/send?phone=${num}`;
}
