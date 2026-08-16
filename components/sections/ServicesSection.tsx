import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Sparkles, Building2, LayoutDashboard, Grid3x3, Frame, Church } from "lucide-react";
import { getServicesData } from "@/lib/data";
import IslamicPattern from "@/components/common/IslamicPattern";
import SectionHeader from "@/components/ui/SectionHeader";

const iconMap: Record<string, React.ElementType> = {
  Dome: Church,
  Church: Church,
  Tower: Building2,
  Building2: Building2,
  Layout: LayoutDashboard,
  LayoutDashboard: LayoutDashboard,
  Grid3x3: Grid3x3,
  Frame: Frame,
};

export default async function ServicesSection() {
  let services: any[] = [];
  try {
    const dynamic = await getServicesData();
    if (dynamic.length > 0) services = dynamic as any;
  } catch {}

  if (services.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <SectionHeader
            badge="Layanan Utama - Neon DB Kosong"
            badgeVariant="gold"
            title={<>Spesialis Kubah, Menara & Ornamen GRC</>}
            description="Database layanan kosong. Set DATABASE_URL Neon & jalankan npm run db:seed untuk import 5 layanan."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <IslamicPattern variant="gold" className="opacity-30" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Layanan Utama - Neon DB"
          badgeVariant="gold"
          title={
            <>
              Spesialis <span className="text-maroon-700">Kubah, Menara</span> & <span className="text-gold-600">Ornamen GRC</span>
            </>
          }
          description="Fokus produksi GRC dengan detil presisi dari database Neon, harga terjangkau, pelayanan nasional. Termasuk Mihrab ACP premium."
        />

        <div className="mt-12 lg:mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service: any, idx: number) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <Link
                key={service.id}
                href={`/layanan/${service.slug}`}
                className="card-portfolio group p-6 lg:p-7 flex flex-col bg-white border border-border rounded-2xl shadow-soft hover:shadow-large hover:-translate-y-1.5 hover:border-gold-200 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-maroon-600 to-maroon-800 text-white flex items-center justify-center shadow-maroon group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-widest uppercase text-gold-600 bg-gold-50 border border-gold-100 px-2 py-0.5 rounded-full">
                          0{idx + 1}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{service.shortTitle}</span>
                      </div>
                      <h3 className="font-bold text-[15px] text-foreground group-hover:text-maroon-700 transition-colors mt-1 line-clamp-1">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-maroon-50 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-maroon-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                <div className="relative h-44 rounded-xl overflow-hidden bg-gradient-to-br from-gold-50 via-white to-maroon-50/30 mb-5 border border-border group-hover:border-gold-100 transition-colors">
                  <Image
                    src={service.originalImage}
                    alt={`${service.title} - BSA GRC`}
                    fill
                    className="object-contain p-5 group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-gold-200 rounded-tr-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-maroon-200 rounded-bl-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                  {service.description}
                </p>

                <div className="space-y-3 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {service.features?.slice(0, 3).map((feature: string) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1 text-[11px] bg-maroon-50 text-maroon-700 border border-maroon-100 px-2.5 py-1 rounded-full font-medium group-hover:bg-maroon-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-gold-100">
                    <span className="text-xs font-bold tracking-wide text-gold-700 bg-gold-50 px-2.5 py-1 rounded-full border border-gold-100">
                      {service.priceRange}
                    </span>
                    <span className="text-xs text-maroon-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Detail layanan
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          <div className="card-portfolio p-7 bg-gradient-to-br from-maroon-700 via-maroon-700 to-maroon-900 text-white flex flex-col justify-between relative overflow-hidden rounded-2xl shadow-maroon border-0 min-h-[380px]">
            <div className="absolute inset-0 islamic-pattern opacity-[0.06]" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold-400/20 rounded-full blur-2xl" />

            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gold-400 text-maroon-900 flex items-center justify-center mb-5 shadow-gold">
                <Sparkles className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-[22px] leading-tight mb-3">
                Butuh <span className="text-gold-300">Konsultasi Gratis</span>?
              </h3>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                Gratis jasa Desain, Konsultasi & Survey lokasi Kubah Masjid, Menara, Ornamen GRC di seluruh Indonesia. Data dari Neon DB.
              </p>

              <div className="space-y-3 mb-6">
                {["✓ Gratis Desain 3D Custom", "✓ Survey Lokasi Nasional", "✓ Garansi Kebocoran 1 Tahun", "✓ Harga Pabrik Langsung"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs bg-white/10 rounded-full px-3 py-1.5 border border-white/10 w-fit">
                    <span className="text-gold-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative space-y-3">
              <Link
                href="https://api.whatsapp.com/send?phone=6281230469914"
                target="_blank"
                className="w-full bg-white text-maroon-800 font-bold px-5 py-3.5 rounded-xl hover:bg-gold-50 transition-colors flex items-center justify-center gap-2 shadow-soft"
              >
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">WA</span>
                Konsultasi WhatsApp
              </Link>
              <p className="text-[11px] text-white/60 text-center">Respon &lt; 5 Menit • Senin - Sabtu 08:00-17:00 WIB • Neon DB</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
