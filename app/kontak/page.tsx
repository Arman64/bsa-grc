import type { Metadata } from "next";
import { getPageContentCached, buildPageMetadata } from "@/lib/content";
import ContactSection from "@/components/sections/ContactSection";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("kontak", "/kontak");
}

export default async function KontakPage() {
  const content = await getPageContentCached("kontak");
  return <ContactSection content={content.sections} />;
}
