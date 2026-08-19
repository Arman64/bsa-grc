import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Target, Eye, Award } from "lucide-react";
import { getPageContentCached, buildPageMetadata } from "@/lib/content";
import { PROFIL_DEFAULT } from "@/lib/content-defaults";
import SectionHeader from "@/components/ui/SectionHeader";
import AboutSection from "@/components/sections/AboutSection";
import StatsSection from "@/components/sections/StatsSection";
import CTASection from "@/components/sections/CTASection";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("profil", "/profil");
}

export default async function ProfilPage() {
  const content = await getPageContentCached("profil");
  const hero = content.sections.hero || PROFIL_DEFAULT.hero;
  const visi = content.sections.visi || PROFIL_DEFAULT.visi;
  const misi = content.sections.misi || PROFIL_DEFAULT.misi;
  const nilai = content.sections.nilai || PROFIL_DEFAULT.nilai;

  return (
    <>
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white to-gold-50/30 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeader
              badge={hero.badge}
              badgeVariant="maroon"
              title={
                <>
                  <span className="text-maroon-700">{hero.titleHighlight}</span> - {hero.titleRest}
                </>
              }
              description={hero.description}
            />

            <div className="relative w-full h-[360px] lg:h-[440px] bg-white rounded-[2rem] overflow-hidden border shadow-large mt-12">
              <Image
                src={hero.image || PROFIL_DEFAULT.hero.image}
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

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border shadow-soft p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon-700 to-gold-400" />
              <div className="w-12 h-12 rounded-xl bg-maroon-700 text-white flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3">{visi.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{visi.description}</p>
            </div>

            <div className="bg-white rounded-2xl border shadow-soft p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-maroon-700" />
              <div className="w-12 h-12 rounded-xl bg-gold-400 text-maroon-900 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3">{misi.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {(misi.points || []).map((m: string, idx: number) => (
                  <li key={idx} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-8 bg-maroon-900 text-white rounded-2xl p-8 border border-maroon-800">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-gold-400" />
              <h3 className="font-bold text-xl">{nilai.title}</h3>
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
