import type { Metadata } from "next";
import { getPageContentCached, buildPageMetadata } from "@/lib/content";
import { LAYANAN_DEFAULT } from "@/lib/content-defaults";
import ServicesSection from "@/components/sections/ServicesSection";
import CTASection from "@/components/sections/CTASection";
import StatsSection from "@/components/sections/StatsSection";
import SectionHeader from "@/components/ui/SectionHeader";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("layanan", "/layanan");
}

export default async function LayananPage() {
  const content = await getPageContentCached("layanan");
  const hero = content.sections.hero || LAYANAN_DEFAULT.hero;

  return (
    <>
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white to-maroon-50/30 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader badge={hero.badge} badgeVariant="gold" title={hero.title} description={hero.description} />
        </div>
      </section>

      <StatsSection />
      <ServicesSection />
      <CTASection />
    </>
  );
}
