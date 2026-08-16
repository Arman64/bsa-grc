import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Building2, Ruler, Award, CheckCircle2, ArrowLeft, Phone, Clock, Eye, Share2 } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { getPortfolioData, getPortfolioById } from "@/lib/data";
import { generateSEOMetadata } from "@/lib/seo";
import SectionHeader from "@/components/ui/SectionHeader";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { PortfolioGrid } from "@/components/ui/PortfolioCard";

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
 try {
 const all = await getPortfolioData();
 related = all.filter((p) => p.id !== item!.id && p.category === item!.category).slice(0, 3);
 if (related.length < 3) {
  const others = all.filter((p) => p.id !== item!.id && !related.some((r) => r.id === p.id)).slice(0, 3 - related.length);
  related = [...related, ...others];
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
  {/* Minimal Header for Detail */}
  <div className="border-b bg-white sticky top-0 z-30">
   <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
   <Breadcrumb items={[{ label: "Portofolio", href: "/portofolio" }, { label: item.title }]} />
   <Link href="/portofolio" className="hidden sm:inline-flex items-center gap-2 text-sm border px-4 py-2 rounded-xl hover:bg-muted">
    <ArrowLeft className="w-4 h-4" />
    Kembali
   </Link>
   </div>
  </div>

  {/* Hero */}
  <section className="py-8 lg:py-12 bg-gradient-to-br from-white to-gold-50/30">
   <div className="container mx-auto px-4 lg:px-8">
   <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
    {/* Image */}
    <div className="space-y-4">
    <div className="relative h-[380px] lg:h-[500px] rounded-[2rem] overflow-hidden border shadow-large bg-muted">
     <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
     <div className="absolute top-4 left-4 flex gap-2">
     <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold border border-gold-200">{item.category}</span>
     <span className="bg-maroon-700 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
      <Award className="w-3 h-3 text-gold-400" /> BSA GRC
     </span>
     </div>
     <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-xl p-3 border flex items-center justify-between">
     <span className="flex items-center gap-2 text-xs font-semibold">
      <CheckCircle2 className="w-4 h-4 text-green-600" /> Proyek Selesai
     </span>
     <span className="text-xs text-muted-foreground">{item.year} • {item.location}</span>
     </div>
    </div>

    {/* Thumbnails placeholder - could be gallery */}
    <div className="flex gap-2">
     {[1, 2, 3].map((i) => (
     <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gold-200/50 flex-shrink-0">
      <Image src={item.image} alt={`${item.title} ${i}`} width={80} height={80} className="w-full h-full object-cover" />
     </div>
     ))}
    </div>
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

    {/* Detail with Iconography - PRD Requirement */}
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

    {/* CTA */}
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

    {/* Share */}
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

  {/* Related */}
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
     description={`Proyek lain dengan kategori ${item.category} dari BSA GRC - data dari`}
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
