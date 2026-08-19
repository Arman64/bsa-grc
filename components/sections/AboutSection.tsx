import Image from "next/image";
import { CheckCircle2, Award, ShieldCheck, Users, MapPin, Factory } from "lucide-react";
import { getPageContentCached, getSettingsCached } from "@/lib/content";
import { HOME_DEFAULT } from "@/lib/content-defaults";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

const achIcons = [Factory, Users, Award, ShieldCheck];

export default async function AboutSection() {
  let company: any = {};
  let about: any = HOME_DEFAULT.about;
  try {
    const [settings, content] = await Promise.all([getSettingsCached(), getPageContentCached("beranda")]);
    company = settings?.company || {};
    about = content.sections.about || HOME_DEFAULT.about;
  } catch {}

  const address = company?.address || "Trenggalek, Jatim";
  const achievements = about.achievements?.length ? about.achievements : HOME_DEFAULT.about.achievements;
  const benefits = about.benefits?.length ? about.benefits : HOME_DEFAULT.about.benefits;
  const mapsQuery = encodeURIComponent(typeof address === "string" ? address : "Trenggalek");

  return (
    <section className="cv-auto py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative h-[420px] lg:h-[520px] rounded-[2rem] overflow-hidden bg-muted border shadow-large">
              <Image
                src={about.image || HOME_DEFAULT.about.image}
                alt="Profil BSA GRC - Pabrik Trenggalek"
                fill
                className="object-contain p-6 lg:p-10 bg-gradient-to-br from-white to-gold-50/30"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl p-4 border border-gold-200 shadow-medium">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-maroon-700 text-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-foreground">{about.factoryTitle}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{address}</p>
                    <p className="text-[11px] text-maroon-700 font-semibold mt-2 bg-maroon-50 px-2 py-1 rounded-full border border-maroon-100 inline-flex">
                      ✓ {about.factoryTag}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 lg:-right-6 grid grid-cols-2 gap-3">
              {achievements.map((ach: any, idx: number) => {
                const Icon = achIcons[idx % achIcons.length];
                return (
                  <div key={idx} className="bg-white rounded-2xl shadow-large border border-gold-100 p-3 w-[130px] text-center hover:-translate-y-1 transition-transform">
                    <div className="w-8 h-8 mx-auto rounded-full bg-maroon-50 flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4 text-maroon-700" />
                    </div>
                    <p className="font-bold text-sm text-foreground">{ach.value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{ach.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <SectionHeader
              badge={about.badge}
              badgeVariant="maroon"
              title={
                <>
                  <span className="text-maroon-700">{about.titleHighlight}</span> - {about.titleRest}
                </>
              }
              description={about.description}
              align="left"
              className="max-w-none"
              withDivider={false}
            />

            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-foreground">{about.whyTitle}</h3>
              <div className="grid sm:grid-cols-1 gap-2.5">
                {benefits.map((benefit: string) => (
                  <div key={benefit} className="flex items-start gap-3 bg-muted/60 border rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="primary" href="/profil">
                {about.ctaPrimary}
              </Button>
              <Button variant="gold" href={`https://www.google.com/maps/search/${mapsQuery}`} external>
                <MapPin className="w-4 h-4" />
                {about.ctaSecondary}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
