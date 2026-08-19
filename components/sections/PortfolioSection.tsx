import Link from "next/link";
import { ArrowRight, MapPin, Building2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { PortfolioGrid } from "@/components/ui/PortfolioCard";
import { getPortfolioData } from "@/lib/data";
import { getPageContentCached } from "@/lib/content";
import { HOME_DEFAULT } from "@/lib/content-defaults";

export default async function PortfolioSection() {
  let portfolioData: any[] = [];
  let header: any = HOME_DEFAULT.portfolioHeader;
  try {
    const [dynamic, content] = await Promise.all([getPortfolioData(), getPageContentCached("beranda")]);
    if (dynamic.length > 0) portfolioData = dynamic.slice(0, 6) as any[];
    header = content.sections.portfolioHeader || header;
  } catch {}

  return (
    <section className="cv-auto py-16 lg:py-24 bg-muted/40 relative overflow-hidden border-y border-gold-100/50">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-200 to-transparent" />
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-gold-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <SectionHeader badge={header.badge} badgeVariant="maroon" title={header.title} description={header.description} />

        <div className="mt-12 lg:mt-16">
          {portfolioData.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed">
              <p className="font-semibold">Belum ada data portofolio</p>
              <p className="text-sm text-muted-foreground mt-1">Silakan tambah data melalui halaman admin.</p>
            </div>
          ) : (
            <PortfolioGrid items={portfolioData} />
          )}
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-gold-100 shadow-soft p-4 lg:p-5">
          <div className="flex flex-wrap items-center justify-center lg:justify-between gap-4 text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 font-semibold text-foreground">
                <span className="w-8 h-8 rounded-full bg-maroon-50 border border-maroon-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-maroon-600" />
                </span>
                {header.statLeft}
              </span>
              <span className="w-px h-6 bg-border hidden sm:block" />
              <span className="flex items-center gap-2 font-semibold text-foreground">
                <span className="w-8 h-8 rounded-full bg-gold-50 border border-gold-100 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-gold-700" />
                </span>
                {header.statRight}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/portofolio"
                className="inline-flex items-center gap-2 bg-maroon-700 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-maroon-800 transition-colors text-sm shadow-maroon"
              >
                {header.buttonLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
