import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { COMPANY_INFO } from "@/lib/constants";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import AboutSection from "@/components/sections/AboutSection";
import StatsSection from "@/components/sections/StatsSection";
import CTASection from "@/components/sections/CTASection";
import { CheckCircle2, Target, Eye, Award } from "lucide-react";

export const metadata: Metadata = generateSEOMetadata({
  title: "Profil Perusahaan - Sejarah, Visi Misi BSA GRC",
  description: `Profil ${COMPANY_INFO.name} - Spesialis GRC berpengalaman ${COMPANY_INFO.yearsExperience}+ tahun di ${COMPANY_INFO.address.regency}. Visi, misi, lokasi pabrik & nilai profesionalisme. ${COMPANY_INFO.projectsCompleted}+ proyek.`,
  url: `${COMPANY_INFO.website}/profil`,
});

export default function ProfilPage() {
  return (
    <>
      {/* Hero Profil */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white to-gold-50/30 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeader
              badge="Tentang Kami"
              badgeVariant="maroon"
              title={
                <>
                  <span className="text-maroon-700">BSA GRC</span> - Kontraktor Profesional
                </>
              }
              description={`${COMPANY_INFO.description} Pabrik di ${COMPANY_INFO.address.full}. Melayani ${COMPANY_INFO.projectsCompleted}+ proyek di seluruh Indonesia.`}
            />

            <div className="relative w-full h-[360px] lg:h-[440px] bg-white rounded-[2rem] overflow-hidden border shadow-large mt-12">
              <Image
                src="https://bsagrc.co.id/wp-content/uploads/2023/10/Profil-BSA.png"
                alt="Profil BSA GRC"
                fill
                className="object-contain p-8 lg:p-12"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <StatsSection />
      <AboutSection />

      {/* Visi Misi */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border shadow-soft p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon-700 to-gold-400" />
              <div className="w-12 h-12 rounded-xl bg-maroon-700 text-white flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3">Visi</h3>
              <p className="text-muted-foreground leading-relaxed">
                Menjadi kontraktor kubah & ornamen masjid GRC terpercaya nomor 1 di Indonesia dengan kualitas terbaik, harga terjangkau, dan pelayanan nasional hingga pelosok.
              </p>
            </div>

            <div className="bg-white rounded-2xl border shadow-soft p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-maroon-700" />
              <div className="w-12 h-12 rounded-xl bg-gold-400 text-maroon-900 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3">Misi</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Memberikan produk GRC kualitas tinggi, tahan lama, ringan, awet, rapi & presisi",
                  "Gratis jasa desain, konsultasi & survey lokasi seluruh Indonesia",
                  "Melayani dengan harga pabrik langsung - transparan",
                  "Menjaga kepuasan panitia masjid & institusi dengan garansi",
                ].map((m) => (
                  <li key={m} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nilai */}
          <div className="max-w-5xl mx-auto mt-8 bg-maroon-900 text-white rounded-2xl p-8 border border-maroon-800">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-gold-400" />
              <h3 className="font-bold text-xl">Nilai Profesionalisme BSA GRC</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="font-bold text-gold-300">Cepat</p>
                <p className="text-white/70 mt-1">Pengerjaan cepat tanpa mengorbankan presisi & kerapian.</p>
              </div>
              <div>
                <p className="font-bold text-gold-300">Kuat & Ringan</p>
                <p className="text-white/70 mt-1">Bahan GRC kualitas SNI, rangka Kremona kokoh.</p>
              </div>
              <div>
                <p className="font-bold text-gold-300">Awet & Tahan Cuaca</p>
                <p className="text-white/70 mt-1">Anti bocor dengan pelapis membran bakar berkualitas.</p>
              </div>
              <div>
                <p className="font-bold text-gold-300">Rapi & Presisi</p>
                <p className="text-white/70 mt-1">Detil motif sesuai keinginan customer dengan tenaga ahli.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
