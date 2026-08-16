/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Star, ShieldCheck, Award, MapPin, Phone, ArrowRight, Clock, Building2, Sparkles, Images, Quote, X, Play, Lock } from "lucide-react";
import type { ServiceItem } from "@/lib/data";
import { COMPANY_INFO } from "@/lib/constants";
import { useCompany } from "@/components/providers/SettingsProvider";

interface LandingPageProps {
  service: ServiceItem;
}

export default function LandingPageService({ service }: LandingPageProps) {
  const lp = service.landingPage;
  const [formData, setFormData] = useState({ name: "", phone: "", location: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { company: dynamicCompany } = useCompany();
  const company = {
    whatsapp: dynamicCompany.whatsapp,
    whatsappDisplay: dynamicCompany.whatsappDisplay,
    phone: dynamicCompany.phone,
    phoneDisplay: dynamicCompany.phoneDisplay,
  };

  useEffect(() => {
    // Hide global header/footer/topbar for landing page (no navigation per ads requirement)
    const header = document.querySelector("header") as HTMLElement | null;
    const footer = document.querySelector("footer") as HTMLElement | null;
    const topbar = document.getElementById("global-topbar") as HTMLElement | null;

    const origHeader = header?.style.display || "";
    const origFooter = footer?.style.display || "";
    const origTopbar = topbar?.style.display || "";

    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
    if (topbar) topbar.style.display = "none";

    return () => {
      if (header) header.style.display = origHeader;
      if (footer) footer.style.display = origFooter;
      if (topbar) topbar.style.display = origTopbar;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent, formId: string) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        service: service.title,
        location: formData.location,
        message: `Landing Page Ads: ${service.title} - ${lp?.headline}. Lokasi: ${formData.location}. Mohon penawaran.`,
        source: `Landing Page Ads - ${service.slug} - ${formId}`,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success && json.data?.whatsappLink) {
        setIsSuccess(true);
        setTimeout(() => {
          window.open(json.data.whatsappLink, "_blank");
        }, 600);
      } else {
        // Fallback WA
        const waMsg = encodeURIComponent(`Halo BSA GRC, saya ${formData.name} dari ${formData.location}, mau ${service.title}. ${lp?.headline}. Mohon penawaran.`);
        window.open(`https://api.whatsapp.com/send?phone=${company.whatsapp}&text=${waMsg}`, "_blank");
        setIsSuccess(true);
      }
    } catch {
      const waMsg = encodeURIComponent(`Halo BSA GRC, saya ${formData.name} - ${service.title} di ${formData.location}`);
      window.open(`https://api.whatsapp.com/send?phone=${company.whatsapp}&text=${waMsg}`, "_blank");
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lp) {
    return (
      <div className="py-20 text-center">
        <p>Landing page belum dikonfigurasi untuk layanan ini. Edit di /admin/services.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* 1. MINIMAL TOP BAR - No Navigation per Ads Requirement */}
      <div className="sticky top-0 z-40 bg-white border-b border-gold-100 shadow-soft">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border rounded-xl flex items-center justify-center overflow-hidden">
              <Image src="https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png" alt="BSA GRC" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">
                BSA <span className="text-gold-600">GRC</span> <span className="text-[10px] bg-maroon-700 text-white px-1.5 py-0.5 rounded ml-1">OFFICIAL</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Pabrik Trenggalek • {company.whatsappDisplay}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold text-green-700">Online</span>
            </div>
            <a href={`tel:${company.phone}`} className="hidden sm:inline-flex bg-maroon-700 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-maroon-800">
              📞 {(company as any).phoneDisplay || company.phone}
            </a>
            <a href={`https://api.whatsapp.com/send?phone=${company.whatsapp}`} target="_blank" className="bg-[#25D366] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#128C7E] flex items-center gap-1">
              <span className="hidden sm:inline">WA {company.whatsappDisplay}</span>
              <span className="sm:hidden">WA</span>
            </a>
          </div>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-maroon-700 via-gold-400 to-maroon-700" />
      </div>

      {/* 2. HERO SECTION - Headline + Sub-headline + Visual + Form */}
      <section className="py-8 lg:py-12 bg-gradient-to-br from-white via-[#FFFBF5] to-gold-50/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
            {/* Left - Headline & Value Prop */}
            <div className="space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 text-gold-800 px-3 py-1.5 rounded-full text-xs font-bold">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {lp.badge}
              </div>

              {/* Headline - Memikat, Manfaat, Jelas Spesifik */}
              <div className="space-y-3">
                <h1 className="text-[28px] sm:text-[34px] lg:text-[42px] font-extrabold leading-[1.1] tracking-tight">
                  <span className="bg-gradient-to-r from-maroon-700 to-maroon-900 bg-clip-text text-transparent">{lp.headline.split(" - ")[0]}</span>
                  {lp.headline.includes(" - ") && (
                    <>
                      <br />
                      <span className="text-foreground text-[22px] sm:text-[26px] lg:text-[28px] font-bold">{lp.headline.split(" - ")[1]}</span>
                    </>
                  )}
                </h1>

                {/* Sub-headline - Persuasif, elaborasi janji */}
                <p className="text-[15px] lg:text-[16px] leading-relaxed text-muted-foreground">{lp.subHeadline}</p>
              </div>

              {/* Social Proof Strip - Angka & Data */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-white border shadow-soft px-3 py-1.5 rounded-full text-xs">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <span className="font-bold ml-1">{lp.socialProof.rating}</span>
                  <span className="text-muted-foreground">({lp.socialProof.reviews} ulasan)</span>
                </div>
                <div className="bg-maroon-50 border border-maroon-100 px-3 py-1.5 rounded-full text-xs font-semibold text-maroon-700">
                  {lp.socialProof.projects} Proyek • {lp.socialProof.provinces}
                </div>
                <div className="bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-xs font-semibold text-green-700 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Pabrik Langsung Trenggalek
                </div>
              </div>

              {/* Value Prop Bullets - Manfaat Bukan Fitur, Bahasa Sehari-hari */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-bold text-foreground">Kenapa 500+ Panitia Pilih BSA GRC untuk {service.shortTitle}:</p>
                <div className="grid gap-2.5">
                  {lp.valueProps.map((vp, idx) => (
                    <div key={idx} className="flex gap-3 bg-white border rounded-xl p-3 shadow-soft hover:shadow-medium transition-shadow">
                      <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{vp.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{vp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Visual - Real Project, High Quality (not stock) */}
              <div className="space-y-3">
                <div className="relative h-[280px] sm:h-[360px] rounded-[1.5rem] overflow-hidden border shadow-large bg-muted group">
                  <Image src={lp.heroImage} alt={`${service.title} BSA GRC real project`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-maroon-700 text-white flex items-center justify-center font-bold text-xs">BSA</div>
                      <div>
                        <p className="text-xs font-bold">Proyek Nyata BSA GRC</p>
                        <p className="text-[11px] text-muted-foreground">Bukan foto stock - Pabrik Trenggalek</p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-green-500 text-white px-2 py-1 rounded-full font-bold">REAL PROJECT</span>
                  </div>
                  {/* Video placeholder */}
                  {lp.heroVideoUrl && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-large border">
                      <Play className="w-6 h-6 text-maroon-700 fill-maroon-700 ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Gallery strip */}
                {lp.heroImages && lp.heroImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {lp.heroImages.map((img, i) => (
                      <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gold-200 flex-shrink-0">
                        <Image src={img} alt={`${service.title} ${i}`} width={80} height={80} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right - Lead Capture Form Optimal */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-[1.5rem] shadow-large border-2 border-gold-100 p-6 lg:p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon-700 via-gold-400 to-maroon-700" />

                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                    <Clock className="w-3 h-3" /> Promo Bulan Ini - Gratis Desain 3D Senilai Rp 1,5 Jt
                  </div>
                  <h3 className="font-bold text-xl leading-tight">
                    Dapatkan Penawaran <span className="text-maroon-700">{service.shortTitle}</span> Gratis
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2">Isi form 30 detik, tim BSA hubungi &lt;5 menit via WA</p>
                </div>

                {isSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-bold text-lg">Terima Kasih! Penawaran Terkirim</h4>
                    <p className="text-sm text-muted-foreground">Tim BSA GRC akan hubungi WA Anda &lt;5 menit untuk kirim desain 3D & RAB. Jangan tutup, membuka WhatsApp...</p>
                    <div className="flex flex-col gap-2">
                      <a href={`https://api.whatsapp.com/send?phone=${company.whatsapp}`} target="_blank" className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl text-center">
                        Buka WhatsApp Sekarang
                      </a>
                      <button onClick={() => setIsSuccess(false)} className="text-xs text-muted-foreground">
                        Kirim lagi
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSubmit(e, "hero_form")} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold mb-1.5 block">
                        Nama Panitia / Masjid <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: H. Slamet - Masjid Jami' Trenggalek"
                        className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-maroon-500 focus:ring-2 focus:ring-maroon-200 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold mb-1.5 block flex items-center gap-1">
                        No. WhatsApp Aktif <span className="text-red-500">*</span>
                        <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full font-normal">Untuk kirim desain 3D</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contoh: 0812-3456-7890"
                        className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-maroon-500 focus:ring-2 focus:ring-maroon-200 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold mb-1.5 block">
                        Lokasi Masjid (Desa/Kota) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Contoh: Wonorejo, Gandusari, Trenggalek"
                        className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-maroon-500 focus:ring-2 focus:ring-maroon-200 outline-none text-sm"
                      />
                    </div>

                    {/* CTA Menonjol - Kontras Tinggi, Teks Aksi */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-maroon-900 font-extrabold py-4 rounded-xl shadow-gold hover:shadow-large hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-[15px] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-maroon-900 border-t-transparent rounded-full animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          {lp.ctaPrimary}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Risk Reversal - Penurun Risiko */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Data 100% Aman
                        </span>
                        <span className="w-px h-3 bg-border" />
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-green-600" /> Tidak Spam
                        </span>
                        <span className="w-px h-3 bg-border" />
                        <span>Gratis</span>
                      </div>

                      <div className="bg-muted/50 rounded-xl p-3 border border-dashed">
                        <p className="text-[11px] font-bold text-foreground mb-1.5 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-green-600" /> Jaminan BSA GRC:
                        </p>
                        <div className="grid grid-cols-1 gap-1">
                          {lp.guarantees.slice(0, 3).map((g) => (
                            <span key={g} className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" /> {g}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-center text-muted-foreground">{lp.ctaSubtext}</p>
                    </div>
                  </form>
                )}

                {/* Social Proof Mini di bawah form */}
                <div className="mt-6 pt-4 border-t border-dashed flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {lp.socialProof.testimonials.slice(0, 3).map((t, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-gold-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                        {t.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    <span className="font-bold text-foreground">{lp.socialProof.projects} masjid</span> sudah pakai
                  </p>
                </div>
              </div>

              {/* Trust badge below form */}
              <div className="bg-maroon-900 text-white rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-400 text-maroon-900 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">Butuh Cepat? Telepon Langsung</p>
                  <p className="text-sm font-bold text-gold-300">{company.whatsappDisplay}</p>
                  <p className="text-[11px] text-white/60">Senin-Sabtu 08:00-17:00, respon &lt;5 menit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pain Points vs Solution */}
      {lp.painPoints && lp.painPoints.length > 0 && (
        <section className="py-12 bg-white border-y">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl lg:text-2xl font-bold text-center mb-8">
                Apakah Anda Mengalami <span className="text-red-600">Masalah Ini</span>?
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {lp.painPoints.map((pp, idx) => (
                  <div key={idx} className="border rounded-2xl overflow-hidden">
                    <div className="bg-red-50 border-b border-red-100 p-4">
                      <p className="text-xs font-bold text-red-700 flex items-center gap-2">
                        <X className="w-4 h-4" /> Masalah:
                      </p>
                      <p className="text-sm font-semibold mt-2 text-red-900">{pp.pain}</p>
                    </div>
                    <div className="bg-green-50 p-4">
                      <p className="text-xs font-bold text-green-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Solusi BSA GRC:
                      </p>
                      <p className="text-sm font-semibold mt-2 text-green-900">{pp.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Value Prop Benefits Grid */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-center">
              6 Keunggulan <span className="text-maroon-700">{service.shortTitle}</span> BSA GRC
            </h2>
            <p className="text-center text-muted-foreground mt-3 text-sm">Bukan fitur teknis, tapi manfaat nyata untuk panitia & jamaah</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {lp.benefits?.map((b, idx) => (
                <div key={idx} className="bg-white border rounded-2xl p-5 shadow-soft hover:shadow-medium transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-maroon-50 border border-maroon-100 flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5 text-maroon-700" />
                  </div>
                  <h3 className="font-bold text-sm">{b.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Social Proof - Testimoni Spesifik */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 px-4 py-1.5 rounded-full text-xs font-bold text-gold-800">
                <Star className="w-4 h-4 fill-gold-500 text-gold-500" /> Testimoni Nyata Panitia Masjid
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mt-4">
                Apa Kata <span className="text-maroon-700">{lp.socialProof.projects} Panitia</span> yang Sudah Pakai?
              </h2>
              <p className="text-muted-foreground text-sm mt-2">Bukan testimoni palsu, foto & nama asli, hasil spesifik</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {lp.socialProof.testimonials.map((t, idx) => (
                <div key={idx} className="bg-white border rounded-2xl p-6 shadow-soft hover:shadow-large transition-all">
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
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>

                  <div className="relative">
                    <Quote className="w-6 h-6 text-gold-200 absolute -top-2 -left-1" />
                    <p className="text-sm leading-relaxed text-foreground relative pl-4 italic">"{t.text}"</p>
                  </div>

                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Hasil: {t.result}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Angka & Data */}
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Proyek Selesai", value: lp.socialProof.projects, icon: Building2 },
                { label: "Rating Google", value: `${lp.socialProof.rating}/5.0`, icon: Star },
                { label: "Ulasan", value: `${lp.socialProof.reviews}`, icon: Images },
                { label: "Provinsi", value: lp.socialProof.provinces, icon: MapPin },
              ].map((stat) => (
                <div key={stat.label} className="bg-maroon-900 text-white rounded-2xl p-5 text-center">
                  <stat.icon className="w-6 h-6 mx-auto text-gold-400 mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-white/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Guarantee / Risk Reversal */}
      <section className="py-12 bg-gold-50 border-y border-gold-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-[1.5rem] border-2 border-gold-200 shadow-large p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-green-100 border-2 border-green-200 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-8 h-8 text-green-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Jaminan BSA GRC - Anda Tidak Rugi</h3>
                <p className="text-sm text-muted-foreground mt-2">Kami hilangkan semua risiko Anda, fokus pada hasil</p>

                <div className="grid sm:grid-cols-2 gap-2 mt-4">
                  {lp.guarantees.map((g) => (
                    <div key={g} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="font-medium">{g}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-muted rounded-xl p-3 border border-dashed flex items-start gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Data Anda Aman 100%</strong> - No WA & lokasi masjid hanya untuk kirim penawaran, tidak akan disebar, tidak spam. Kami benci spam sama seperti Anda. Anda bisa minta hapus data kapan saja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ - Objection Handling */}
      {lp.faqs && lp.faqs.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl lg:text-2xl font-bold text-center mb-8">Pertanyaan Sering Ditanyakan tentang {service.shortTitle}</h3>
              <div className="space-y-3">
                {lp.faqs.map((faq, idx) => (
                  <div key={idx} className="border rounded-2xl p-5 bg-white shadow-soft">
                    <h4 className="font-bold text-sm flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-maroon-700 text-white flex items-center justify-center text-xs flex-shrink-0">{idx + 1}</span>
                      {faq.q}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed pl-9">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. Final CTA + Form Duplikat (Bottom) */}
      <section className="py-12 lg:py-16 bg-maroon-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon-700 via-gold-400 to-maroon-700" />

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Slot Bulan Ini Tersisa 3 Proyek Lagi
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
                Siap Pasang <span className="text-gold-400">{service.shortTitle}</span> Anti Bocor & Megah?
              </h2>
              <p className="text-white/70 mt-3 leading-relaxed text-sm">Isi form 30 detik, dapatkan desain 3D gratis + RAB transparan. Tim hubungi &lt;5 menit. Gratis survey se-Indonesia.</p>

              <div className="mt-6 space-y-2">
                {lp.benefits?.slice(0, 4).map((b) => (
                  <div key={b.title} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>{b.title} - {b.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white text-foreground rounded-[1.5rem] p-6 shadow-large">
              <h3 className="font-bold text-lg text-center">Form Terakhir - Klaim Bonus Desain 3D</h3>
              <p className="text-xs text-center text-muted-foreground mt-1">Bonus senilai Rp 1,5 Jt hanya bulan ini</p>

              {isSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-bold">Berhasil! Membuka WhatsApp...</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmit(e, "bottom_form")} className="mt-6 space-y-3">
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Nama Panitia" className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:border-maroon-500 outline-none" />
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required placeholder="No WA Aktif" className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:border-maroon-500 outline-none" />
                  <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required placeholder="Lokasi Masjid" className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:border-maroon-500 outline-none" />
                  <button type="submit" disabled={isSubmitting} className="w-full bg-gold-400 hover:bg-gold-500 text-maroon-900 font-extrabold py-4 rounded-xl shadow-gold flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSubmitting ? "Mengirim..." : lp.ctaPrimary} <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Data aman • Garansi 1 tahun • Gratis • No spam
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer - No Navigation per Ads */}
      <div className="py-8 bg-maroon-950 text-white/60 text-center border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
            <span className="flex items-center gap-2">
              <Image src="https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC-F.png" alt="BSA" width={24} height={24} className="bg-white rounded-full p-0.5" />
              BSA GRC © {new Date().getFullYear()} • Pabrik Trenggalek
            </span>
            <span className="hidden sm:block w-px h-3 bg-white/20" />
            <span>{COMPANY_INFO.address.full}</span>
            <span className="hidden sm:block w-px h-3 bg-white/20" />
            <span>{company.whatsappDisplay}</span>
          </div>
          <p className="text-[11px] mt-3 text-white/40">Landing page resmi iklan Google Ads & FB Ads • Tanpa biaya tersembunyi • Data aman</p>
        </div>
      </div>
    </div>
  );
}
