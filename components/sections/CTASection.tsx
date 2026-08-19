import Link from "next/link";
import { Phone, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { getPageContentCached, getSettingsCached, waLink } from "@/lib/content";
import { HOME_DEFAULT } from "@/lib/content-defaults";

export default async function CTASection() {
  let cta: any = HOME_DEFAULT.cta;
  let company: any = {};
  try {
    const [content, settings] = await Promise.all([getPageContentCached("beranda"), getSettingsCached()]);
    cta = content.sections.cta || HOME_DEFAULT.cta;
    company = settings?.company || {};
  } catch {}

  const whatsappLink = waLink(company?.whatsapp);
  const whatsappDisplay = company?.whatsappDisplay || "0812-3046-9914";
  const address = company?.address || "Trenggalek, Jawa Timur";
  const steps = cta.steps?.length ? cta.steps : HOME_DEFAULT.cta.steps;
  const bullets = cta.bullets?.length ? cta.bullets : HOME_DEFAULT.cta.bullets;

  return (
    <section className="cv-auto py-16 lg:py-20 bg-maroon-900 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-[0.05]" />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-maroon-700 via-gold-400 to-maroon-700" />

      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-maroon-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-large border border-gold-100 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {cta.badge}
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl lg:text-[32px] font-bold leading-[1.15] tracking-tight text-foreground">{cta.title}</h2>
                <p className="text-sm lg:text-[15px] text-muted-foreground leading-relaxed">{cta.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {bullets.map((item: string) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={whatsappLink}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 bg-maroon-700 hover:bg-maroon-800 text-white font-bold px-6 py-3.5 rounded-xl shadow-maroon hover:shadow-large hover:-translate-y-0.5 transition-all text-sm"
                >
                  <Phone className="w-4 h-4" />
                  {cta.primaryLabel} {whatsappDisplay}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/kontak"
                  className="inline-flex items-center justify-center gap-2 border-2 border-maroon-200 text-maroon-700 hover:bg-maroon-50 font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
                >
                  {cta.secondaryLabel}
                </Link>
              </div>

              <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {address} • Respon &lt;5 Menit • Senin-Sabtu 08:00-17:00
              </p>
            </div>

            <div className="bg-gradient-to-br from-gold-50 to-maroon-50/50 p-8 lg:p-10 border-l border-gold-100 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-4 right-4 w-20 h-20 border-2 border-gold-200 rounded-full opacity-20" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-maroon-200 rounded-lg rotate-12 opacity-20" />

              <div className="relative space-y-5">
                <h3 className="font-bold text-foreground">Alur Pemesanan Mudah</h3>

                {steps.map((process: any, idx: number, arr: any[]) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-maroon-700 text-white font-bold text-xs flex items-center justify-center shadow-maroon">
                        {process.step}
                      </div>
                      {idx !== arr.length - 1 && <div className="w-0.5 h-8 bg-gradient-to-b from-maroon-200 to-gold-100 mt-1" />}
                    </div>
                    <div className="pb-2">
                      <p className="font-bold text-sm text-foreground">{process.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{process.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
