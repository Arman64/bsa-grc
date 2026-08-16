import Link from "next/link";
import { ArrowRight, MapPin, Building2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { PortfolioGrid } from "@/components/ui/PortfolioCard";
import { COMPANY_INFO } from "@/lib/constants";
import { getPortfolioData } from "@/lib/data";

export default async function PortfolioSection() {
  let portfolioData: any[] = [];
  try {
    const dynamic = await getPortfolioData();
    if (dynamic.length > 0) portfolioData = dynamic.slice(0, 6) as any[];
  } catch {}

  return (
    <section className="py-16 lg:py-24 bg-muted/40 relative overflow-hidden border-y border-gold-100/50">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-200 to-transparent" />
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-gold-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge={`${COMPANY_INFO.projectsCompleted}+ Proyek Selesai - Neon DB`}
          badgeVariant="maroon"
          title={
            <>
              Portofolio <span className="text-maroon-700">Proyek Nyata</span> di Seluruh Indonesia
            </>
          }
          description={`Dokumentasi pengerjaan kubah, menara, krawangan & mihrab ACP presisi dari Neon DB. Dari ${COMPANY_INFO.address.regency} untuk 34 provinsi.`}
        />

        <div className="mt-12 lg:mt-16">
          {portfolioData.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed">
              <p className="font-semibold">Belum ada data portofolio di Neon DB</p>
              <p className="text-sm text-muted-foreground mt-1">Set DATABASE_URL Neon & jalankan npm run db:seed, atau tambah via /admin/portfolio</p>
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
                34 Provinsi
              </span>
              <span className="w-px h-6 bg-border hidden sm:block" />
              <span className="flex items-center gap-2 font-semibold text-foreground">
                <span className="w-8 h-8 rounded-full bg-gold-50 border border-gold-100 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-gold-700" />
                </span>
                {COMPANY_INFO.projectsCompleted}+ Klien Masjid - Neon DB
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/portofolio"
                className="inline-flex items-center gap-2 bg-maroon-700 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-maroon-800 transition-colors text-sm shadow-maroon"
              >
                Lihat Semua Portofolio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
