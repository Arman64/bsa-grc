/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Building2, Ruler, Award, CheckCircle2, ArrowLeft, Phone, Clock, Eye, Share2, Star, Quote } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { getPortfolioData, getPortfolioById, getTestimonialsData } from "@/lib/data";
import { generateSEOMetadata } from "@/lib/seo";
import SectionHeader from "@/components/ui/SectionHeader";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { PortfolioGrid } from "@/components/ui/PortfolioCard";
import PortfolioCarousel from "@/components/ui/PortfolioCarousel";

type Props = { params: { id: string } };

export async function generateStaticParams() {
  try {
    const portfolios = await getPortfolioData();
    return portfolios.map((p) => ({ id: p.id.toString() }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);
  if (isNaN(id)) return {};

  try {
    const item = await getPortfolioById(id);
    if (!item) return {};

    return generateSEOMetadata({
      title: `${item.title} - Portofolio BSA GRC`,
      description: `${item.title} - ${item.category} di ${item.location} tahun ${item.year}. ${item.description || `Proyek ${item.category} BSA GRC`}. Diameter ${item.diameter || "Ø 6m"}, Material ${item.material || "GRC Premium"}.`,
      image: item.image,
      url: `${COMPANY_INFO.website}/portofolio/${item.id}`,
    });
  } catch {
    return {};
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  let item;
  try {
    item = await getPortfolioById(id);
  } catch {
    notFound();
  }

  if (!item) notFound();

  // Related projects same category
  let related: any[] = [];
  let testimonials: any[] = [];
  try {
    const all = await getPortfolioData();
    related = all.filter((p) => p.id !== item!.id && p.category === item!.category).slice(0, 3);
    if (related.length < 3) {
      const others = all.filter((p) => p.id !== item!.id && !related.some((r) => r.id === p.id)).slice(0, 3 - related.length);
      related = [...related, ...others];
    }

    // Testimonials for same category
    const allTestimonials = await getTestimonialsData();
    testimonials = allTestimonials.filter((t) => t.category === item!.category || t.category === "Kubah GRC").slice(0, 3);
    if (testimonials.length === 0) {
      testimonials = allTestimonials.slice(0, 2);
    }
  } catch {}

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.description || `${item.category} di ${item.location}`,
    image: item.image,
    creator: {
      "@type": "Organization",
      name: COMPANY_INFO.name,
      url: COMPANY_INFO.website,
    },
    locationCreated: {
      "@type": "Place",
      name: item.location,
    },
    dateCreated: `${item.year}-01-01`,
    keywords: `${item.category}, ${item.material}, kubah masjid, BSA GRC`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />

      <div className="min-h-screen bg-white">
        <div className="border-b bg-white sticky top-0 z-30">
          <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
            <Breadcrumb items={[{ label: "Portofolio", href: "/portofolio" }, { label: item.title }]} />
            <Link href="/portofolio" className="hidden sm:inline-flex items-center gap-2 text-sm border px-4 py-2 rounded-xl hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </div>
        </div>

        <section className="py-8 lg:py-12 bg-gradient-to-br from-white to-gold-50/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Carousel - Supports >5 images */}
              <div>
                <PortfolioCarousel images={item.images || []} title={item.title} mainImage={item.image} />
              </div>

              {/* Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-maroon-50 text-maroon-700 border border-maroon-100 px-3 py-1 rounded-full text-xs font-bold">{item.category}</span>
                    <span className="bg-gold-50 text-gold-700 border border-gold-100 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Real Project
                    </span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold leading-tight tracking-tight">{item.title}</h1>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{item.description || `${item.category} BSA GRC di ${item.location} tahun ${item.year}. Pengerjaan presisi pabrik Trenggalek, rangka Kremona kokoh, tahan cuaca ekstrim.`}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-white border rounded-xl p-3 shadow-soft">
                    <div className="w-9 h-9 rounded-lg bg-maroon-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-maroon-700" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Lokasi</p>
                      <p className="text-sm font-semibold">{item.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white border rounded-xl p-3 shadow-soft">
                    <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-gold-700" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Tahun</p>
                      <p className="text-sm font-semibold">{item.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white border rounded-xl p-3 shadow-soft">
                    <div className="w-9 h-9 rounded-lg bg-maroon-50 flex items-center justify-center flex-shrink-0">
                      <Ruler className="w-4 h-4 text-maroon-700" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Diameter / Ukuran</p>
                      <p className="text-sm font-semibold">{item.diameter || "Ø 6m"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white border rounded-xl p-3 shadow-soft">
                    <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-gold-700" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Material</p>
                      <p className="text-sm font-semibold">{item.material || "GRC Premium"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white border rounded-xl p-3 shadow-soft">
                    <div className="w-9 h-9 rounded-lg bg-maroon-50 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-maroon-700" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Klien</p>
                      <p className="text-sm font-semibold">{item.client || "Masjid Jami'"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white border rounded-xl p-3 shadow-soft">
                    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-700" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Status</p>
                      <p className="text-sm font-semibold">Selesai</p>
                    </div>
                  </div>
                </div>

                <div className="bg-maroon-900 text-white rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                  <div className="relative">
                    <h3 className="font-bold">Ingin Proyek Seperti Ini?</h3>
                    <p className="text-sm text-white/70 mt-2 leading-relaxed">Tim BSA GRC siap buatkan desain 3D gratis & RAB transparan untuk {item.category} di lokasi Anda. Gratis survey se-Indonesia.</p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <Link href={`https://api.whatsapp.com/send?phone=6281230469914&text=${encodeURIComponent(`Halo BSA GRC, saya tertarik proyek seperti ${item.title} di ${item.location}. Mohon penawaran.`)}`} target="_blank" className="bg-gold-400 text-maroon-900 font-bold px-5 py-3 rounded-xl text-center hover:bg-gold-300 flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        Konsultasi Mirip Proyek Ini
                      </Link>
                      <Link href="/kontak" className="border border-white/20 text-white font-semibold px-5 py-3 rounded-xl text-center hover:bg-white/10">
                        Form Penawaran
                      </Link>
                    </div>
                    <p className="text-[11px] text-white/50 mt-3 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Respon &lt;5 Menit • Senin-Sabtu 08:00-17:00
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-dashed">
                  <p className="text-xs text-muted-foreground">Bagikan proyek ini:</p>
                  <div className="flex items-center gap-2">
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${item.title} - ${COMPANY_INFO.website}/portofolio/${item.id}`)}`} target="_blank" className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600">
                      <Share2 className="w-4 h-4" />
                    </a>
                    <Link href="/portofolio" className="text-xs border px-3 py-1.5 rounded-full hover:bg-muted">
                      Semua Portofolio
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section - NEW: Before Proyek Lainnya as requested */}
        {testimonials.length > 0 && (
          <section className="py-12 bg-white border-y border-gold-100/50">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 px-4 py-1.5 rounded-full text-xs font-bold text-gold-800">
                    <Star className="w-4 h-4 fill-gold-500 text-gold-500" /> Testimoni Klien {item.category}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mt-4">
                    Apa Kata Panitia yang Pakai <span className="text-maroon-700">{item.category}</span> Sama?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">Testimoni nyata dari panitia masjid yang sudah pakai {item.category} BSA GRC</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-white border rounded-2xl p-6 shadow-soft hover:shadow-large transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                          <Image src={t.photo || "https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png"} alt={t.name} width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role}</p>
                          <p className="text-[11px] text-maroon-700 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {t.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                        ))}
                      </div>
                      <div className="relative">
                        <Quote className="w-6 h-6 text-gold-200 absolute -top-2 -left-1" />
                        <p className="text-sm leading-relaxed text-foreground relative pl-4 italic">"{t.text}"</p>
                      </div>
                      {t.result && (
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
                          <p className="text-xs font-bold text-green-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Hasil: {t.result}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Proyek Serupa - After Testimonial as requested */}
        {related.length > 0 && (
          <section className="py-12 lg:py-16 bg-muted/30 border-t">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <SectionHeader
                  badge="Proyek Lainnya"
                  badgeVariant="gold"
                  title={
                    <>
                      Proyek <span className="text-maroon-700">Serupa</span> di Kategori {item.category}
                    </>
                  }
                  description={`Proyek lain dengan kategori ${item.category} dari BSA GRC - data dari database`}
                  align="left"
                />
                <div className="mt-8">
                  <PortfolioGrid items={related as any} />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
