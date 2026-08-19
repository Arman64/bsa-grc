import Image from "next/image";
import { Phone, ArrowRight, ShieldCheck, Award, Sparkles, CheckCircle2, MapPin, Users } from "lucide-react";
import { getPageContentCached, getSettingsCached, waLink } from "@/lib/content";
import { HOME_DEFAULT } from "@/lib/content-defaults";
import IslamicPattern from "@/components/common/IslamicPattern";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const iconMap: Record<string, any> = {
  "Tahan Lama": ShieldCheck,
  "Harga Terjangkau": Award,
  "Desain Kustom": Sparkles,
  "Tahan Cuaca": CheckCircle2,
};

export default async function HeroSection() {
  let company: any = {};
  let hero: any = HOME_DEFAULT.hero;
  try {
    const [settings, content] = await Promise.all([getSettingsCached(), getPageContentCached("beranda")]);
    company = settings?.company || {};
    hero = content.sections.hero || HOME_DEFAULT.hero;
  } catch {
    company = { yearsExperience: 10, projectsCompleted: 500, address: { regency: "Trenggalek" } };
  }

  const usp: any[] = hero.usp?.length ? hero.usp : HOME_DEFAULT.hero.usp;
  const whatsappLink = waLink(company?.whatsapp);
  const regency = company?.address?.regency || "Trenggalek";
  const projects = company?.projectsCompleted || 500;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#FFFBF5] to-gold-50/30">
      <IslamicPattern variant="subtle" className="opacity-20 lg:opacity-40 hidden sm:block" />

      <div className="absolute -top-20 -right-20 lg:-top-40 lg:-right-40 w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] bg-gradient-to-br from-maroon-100/60 to-gold-100/40 rounded-full blur-2xl lg:blur-3xl opacity-30 lg:opacity-50 pointer-events-none will-change-transform" />
      <div className="absolute -bottom-20 -left-20 lg:-bottom-40 lg:-left-40 w-[250px] h-[250px] lg:w-[600px] lg:h-[600px] bg-gradient-to-tr from-gold-100/50 to-maroon-50/30 rounded-full blur-2xl lg:blur-3xl opacity-20 lg:opacity-40 pointer-events-none will-change-transform" />

      <div className="relative container mx-auto px-4 lg:px-8 py-10 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="flex flex-wrap items-center gap-2 animate-fade-in">
              {(hero.badges || []).map((b: string, i: number) =>
                i === 0 ? (
                  <Badge key={i} variant="maroon" className="gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    {b}
                  </Badge>
                ) : i === 1 ? (
                  <Badge key={i} variant="gold">{b}</Badge>
                ) : (
                  <Badge key={i} variant="outline" className="gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {b}
                  </Badge>
                )
              )}
            </div>

            <div className="space-y-5">
              <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold leading-[1.08] tracking-tight">
                <span className="block text-foreground">{hero.titleLine1}</span>
                <span className="block text-maroon-700">{hero.titleLine2}</span>
                <span className="block">
                  <span className="text-maroon-700">{hero.titleLine3}</span>{" "}
                  <span className="relative inline-block">
                    <span className="text-gold-gradient relative z-10">{hero.titleHighlight}</span>
                    <span className="absolute bottom-1 left-0 right-0 h-3 bg-gold-100 -z-0 -rotate-1" aria-hidden />
                  </span>
                </span>
              </h1>

              <p className="text-[15px] sm:text-[16px] lg:text-[18px] leading-relaxed text-muted-foreground max-w-[60ch]">
                {hero.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {usp.map((uspItem: any) => {
                const Icon = iconMap[uspItem.title] || CheckCircle2;
                return (
                  <div
                    key={uspItem.title}
                    className="flex items-start gap-3 bg-white/80 backdrop-blur rounded-xl p-3.5 border border-border shadow-soft hover:shadow-medium hover:border-gold-200 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-50 to-gold-50 border border-gold-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-maroon-700" />
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-foreground leading-tight">{uspItem.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug mt-1">{uspItem.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="xl" href={whatsappLink} external className="group w-full sm:w-auto">
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {hero.primaryCta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" href="/portofolio" className="w-full sm:w-auto">
                {hero.secondaryCta}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-2 bg-white rounded-full border px-3 py-1.5 shadow-soft">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {hero.trustText}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-maroon-500" />
                {hero.locationText}
              </span>
            </div>
          </div>

          <div className="relative h-[380px] sm:h-[460px] lg:h-[580px] order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-br from-maroon-700 to-maroon-900 rounded-[2rem] rotate-3 scale-[0.97] opacity-10 lg:rotate-2" />

            <div className="absolute inset-0 bg-white rounded-[2rem] shadow-large border border-border overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={hero.image || HOME_DEFAULT.hero.image}
                  alt="Kubah GRC, Menara GRC, Krawangan GRC BSA"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-5 lg:p-8 bg-gradient-to-br from-white via-white to-gold-50/70"
                  priority={true}
                  fetchPriority="high"
                />

                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-medium border border-gold-200">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-maroon-600 to-maroon-800 text-white flex items-center justify-center font-bold text-lg shadow-maroon">
                        {projects}+
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{hero.statLabel}</p>
                        <p className="text-xs text-muted-foreground">{hero.statSub}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="w-3 h-3 text-gold-500">★</span>
                          ))}
                          <span className="text-[11px] text-muted-foreground ml-1">{hero.ratingText}</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 border-2 border-white flex items-center justify-center">
                            <Users className="w-4 h-4 text-gold-700" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-3 -right-2 lg:top-6 lg:-right-4 bg-gold-400 text-maroon-900 font-bold text-xs px-3.5 py-2 rounded-full shadow-gold animate-float hidden sm:flex items-center gap-1.5 border border-gold-300">
              <span className="w-2 h-2 bg-maroon-900 rounded-full animate-pulse" />
              {hero.floatBadge1}
            </div>
            <div className="absolute -bottom-2 -left-2 lg:bottom-20 lg:-left-6 bg-white border border-maroon-100 text-foreground font-semibold text-xs px-3.5 py-2.5 rounded-full shadow-large animate-float hidden sm:flex items-center gap-2 [animation-delay:1.5s]">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              {hero.floatBadge2}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
