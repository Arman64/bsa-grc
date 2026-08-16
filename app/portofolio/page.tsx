import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { COMPANY_INFO } from "@/lib/constants";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import StatsSection from "@/components/sections/StatsSection";
import { PortfolioGrid } from "@/components/ui/PortfolioCard";
import { getPortfolioData } from "@/lib/data";
import Link from "next/link";
import { Images } from "lucide-react";

export const metadata: Metadata = generateSEOMetadata({
 title: "Portofolio Proyek - Kubah, Menara, Ornamen GRC di Seluruh Indonesia",
 description: `Galeri portofolio ${COMPANY_INFO.projectsCompleted}+ proyek BSA GRC: kubah masjid, menara, krawangan GRC & mihrab ACP di seluruh Indonesia. Foto resolusi tinggi dengan detail info ikonografi.`,
 url: `${COMPANY_INFO.website}/portofolio`,
});

export default async function PortofolioPage() {
 const projects = await getPortfolioData();

 return (
 <>
  <section className="py-16 lg:py-20 bg-gradient-to-br from-white to-gold-50/30 border-b">
  <div className="container mx-auto px-4 lg:px-8">
   <SectionHeader
   badge={`${projects.length || COMPANY_INFO.projectsCompleted}+ Proyek`}
   badgeVariant="maroon"
   title={
    <>
    Portofolio <span className="text-maroon-700">Proyek Nyata</span> BSA GRC
    </>
   }
   description={`Galeri lengkap dokumentasi kubah, menara, krawangan & mihrab ACP dari database. Setiap kartu ada detail lokasi, tahun, diameter, material - klik untuk detail proyek.`}
   />
  </div>
  </section>

  <StatsSection />

  <section className="py-16 lg:py-24 bg-white">
  <div className="container mx-auto px-4 lg:px-8">
   {projects.length === 0 ? (
   <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-2xl border-2 border-dashed">
    <Images className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
    <h3 className="font-bold text-lg">Belum Ada Data Portofolio</h3>
    <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
    Belum ada proyek yang ditampilkan. Silakan tambah data portofolio melalui halaman admin.
    </p>
    <div className="mt-6 flex justify-center gap-3">
    <Link href="/admin/portfolio" className="bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold">
     Tambah Portofolio di Admin
    </Link>
    <Link href="/admin" className="border px-5 py-2.5 rounded-xl font-semibold">
     Dashboard Admin
    </Link>
    </div>
   </div>
   ) : (
   <>
    <div className="flex flex-wrap justify-center gap-2 mb-12">
    {["Semua", "Kubah GRC", "Menara GRC", "Krawangan", "Mihrab ACP"].map((cat) => (
     <span
     key={cat}
     className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
      cat === "Semua" ? "bg-maroon-700 text-white border-maroon-700" : "bg-white text-muted-foreground hover:border-maroon-200 hover:text-maroon-700"
     }`}
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
