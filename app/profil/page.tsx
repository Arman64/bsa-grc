import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { COMPANY_INFO } from "@/lib/constants";
import { getPageSettingsBySlug, getSettingsData } from "@/lib/data";
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

export default async function ProfilPage() {
  // Fetch page settings from Neon DB for dynamic editing via /admin/pages
  let pageSettings: any = null;
  let company: any = null;
  try {
    const [ps, settings] = await Promise.all([
      getPageSettingsBySlug("profil").catch(() => null),
      getSettingsData().catch(() => null),
    ]);
    pageSettings = ps;
    company = settings?.company || null;
  } catch {}

  const hero = pageSettings?.sections?.hero || {};
  const visi = pageSettings?.sections?.visi || {
    title: "Visi",
    description: "Menjadi kontraktor kubah & ornamen masjid GRC terpercaya nomor 1 di Indonesia dengan kualitas terbaik, harga terjangkau, dan pelayanan nasional hingga pelosok.",
  };
  const misi = pageSettings?.sections?.misi || {
    title: "Misi",
    points: [
      "Memberikan produk GRC kualitas tinggi, tahan lama, ringan, awet, rapi & presisi",
      "Gratis jasa desain, konsultasi & survey lokasi seluruh Indonesia",
      "Melayani dengan harga pabrik langsung - transparan",
      "Menjaga kepuasan panitia masjid & institusi dengan garansi",
    ],
  };
  const nilai = pageSettings?.sections?.nilai || {
    title: "Nilai Profesionalisme BSA GRC",
    points: [
      { title: "Cepat", desc: "Pengerjaan cepat tanpa mengorbankan presisi & kerapian." },
      { title: "Kuat & Ringan", desc: "Bahan GRC kualitas SNI, rangka Kremona kokoh." },
      { title: "Awet & Tahan Cuaca", desc: "Anti bocor dengan pelapis membran bakar berkualitas." },
      { title: "Rapi & Presisi", desc: "Detil motif sesuai keinginan customer dengan tenaga ahli." },
    ],
  };

  const companyName = company?.name || COMPANY_INFO.name;
  const companyDesc = company?.description || COMPANY_INFO.description;
  const companyAddress = company?.address || COMPANY_INFO.address.full;
  const projectsCompleted = company?.projectsCompleted || COMPANY_INFO.projectsCompleted;

  return (
    <>
      {/* Hero Profil - Editable via /admin/pages */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white to-gold-50/30 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeader
              badge={hero.badge || "Tentang Kami"}
              badgeVariant="maroon"
              title={
                <>
                  <span className="text-maroon-700">{hero.title?.split(" - ")[0] || companyName}</span> - {hero.title?.split(" - ")[1] || "Kontraktor Profesional"}
                </>
              }
              description={hero.description || `${companyDesc} Pabrik di ${companyAddress}. Melayani ${projectsCompleted}+ proyek di seluruh Indonesia.`}
            />

            <div className="relative w-full h-[360px] lg:h-[440px] bg-white rounded-[2rem] overflow-hidden border shadow-large mt-12">
              <Image
                src={hero.image || "https://bsagrc.co.id/wp-content/uploads/2023/10/Profil-BSA.png"}
                alt={hero.title || "Profil BSA GRC"}
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

      {/* Visi Misi - Editable */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border shadow-soft p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon-700 to-gold-400" />
              <div className="w-12 h-12 rounded-xl bg-maroon-700 text-white flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3">{visi.title || "Visi"}</h3>
              <p className="text-muted-foreground leading-relaxed">{visi.description}</p>
            </div>

            <div className="bg-white rounded-2xl border shadow-soft p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-maroon-700" />
              <div className="w-12 h-12 rounded-xl bg-gold-400 text-maroon-900 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3">{misi.title || "Misi"}</h3>
              <ul className="space-y-2.5 text-sm">
                {(misi.points || []).map((m: string) => (
                  <li key={m} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nilai - Editable */}
          <div className="max-w-5xl mx-auto mt-8 bg-maroon-900 text-white rounded-2xl p-8 border border-maroon-800">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-gold-400" />
              <h3 className="font-bold text-xl">{nilai.title || "Nilai Profesionalisme BSA GRC"}</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              {(nilai.points || []).map((p: any, idx: number) => (
                <div key={idx}>
                  <p className="font-bold text-gold-300">{p.title}</p>
                  <p className="text-white/70 mt-1">{p.desc || p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
