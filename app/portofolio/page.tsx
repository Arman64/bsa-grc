import type { Metadata } from "next";
import Link from "next/link";
import { Images } from "lucide-react";
import { getPageContentCached, buildPageMetadata } from "@/lib/content";
import { PORTOFOLIO_DEFAULT } from "@/lib/content-defaults";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import StatsSection from "@/components/sections/StatsSection";
import { PortfolioGrid } from "@/components/ui/PortfolioCard";
import { getPortfolioData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("portofolio", "/portofolio");
}

export default async function PortofolioPage() {
  const [projects, content] = await Promise.all([getPortfolioData(), getPageContentCached("portofolio")]);
  const hero = content.sections.hero || PORTOFOLIO_DEFAULT.hero;
  const categories = content.sections.filter?.categories || PORTOFOLIO_DEFAULT.filter.categories;

  return (
    <>
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white to-gold-50/30 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader badge={hero.badge} badgeVariant="maroon" title={hero.title} description={hero.description} />
        </div>
      </section>

      <StatsSection />

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {projects.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-2xl border-2 border-dashed">
              <Images className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-bold text-lg">Belum Ada Data Portofolio</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">Belum ada proyek yang ditampilkan. Silakan tambah data portofolio melalui halaman admin.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/admin/portfolio" className="bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold">Tambah Portofolio</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((cat: string) => (
                  <span
                    key={cat}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${cat === "Semua" ? "bg-maroon-700 text-white border-maroon-700" : "bg-white text-muted-foreground hover:border-maroon-200 hover:text-maroon-700"}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <PortfolioGrid items={projects as any} />
            </>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
