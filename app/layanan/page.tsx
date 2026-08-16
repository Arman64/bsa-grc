import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { COMPANY_INFO } from "@/lib/constants";
import ServicesSection from "@/components/sections/ServicesSection";
import CTASection from "@/components/sections/CTASection";
import StatsSection from "@/components/sections/StatsSection";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = generateSEOMetadata({
  title: "Layanan - Kubah GRC, Menara, Lisplang, Krawangan, Mihrab ACP",
  description: "Layanan lengkap BSA GRC: Kubah Masjid GRC, Menara Masjid, Lisplang GRC, Krawangan & Ornamen GRC, Mihrab ACP. Produksi pabrik Trenggalek, melayani nasional 34 provinsi.",
  url: `${COMPANY_INFO.website}/layanan`,
});

export default function LayananPage() {
  return (
    <>
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white to-maroon-50/30 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            badge="5 Spesialisasi Utama"
            badgeVariant="gold"
            title={
              <>
                Layanan <span className="text-maroon-700">BSA GRC</span> - Solusi Lengkap Masjid
              </>
            }
            description={`Dari pabrik ${COMPANY_INFO.address.regency} untuk seluruh Indonesia: kubah, menara, lisplang, krawangan GRC & mihrab ACP premium finishing gold.`}
          />
        </div>
      </section>

      <StatsSection />
      <ServicesSection />
      <CTASection />
    </>
  );
}
