import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Award, ShieldCheck, Users, MapPin, Factory } from "lucide-react";
import { getSettingsData } from "@/lib/data";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

export default async function AboutSection() {
 let company: any = null;
 try {
 const settings = await getSettingsData();
 company = settings.company;
 } catch {
 company = {
  name: "BSA GRC",
  address: { regency: "Trenggalek", full: "Dsn. Setri, Klampis, Wonorejo, Kec. Gandusari, Kabupaten Trenggalek, Jawa Timur" },
  yearsExperience: 10,
  description: "BSA GRC bergerak khusus industri pembuatan & pemasangan produk GRC",
 };
 }

 const achievements = [
 { icon: Factory, label: "Pabrik Sendiri", value: company?.address?.regency || "Trenggalek", desc: "Produksi langsung" },
 { icon: Users, label: "Tenaga Ahli", value: "20+ Prof", desc: "Berpengalaman" },
 { icon: Award, label: "Garansi", value: "1 Tahun", desc: "Kebocoran" },
 { icon: ShieldCheck, label: "Bahan", value: "GRC Premium", desc: "SNI Quality" },
 ];

 const benefits = [
 "Proses produksi & campuran bahan tepat - ketahanan lama",
 "Motif & warna dapat dikustom sesuai kultur daerah",
 "Rangka Kremona paling kuat untuk menara & kubah",
 "Finishing cat eksterior mudah perawatan & cat ulang",
 "Pemasangan rapi, presisi & cepat",
 "Gratis jasa desain, konsultasi & survey lokasi",
 ];

 return (
 <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
  <div className="container mx-auto px-4 lg:px-8">
  <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
   <div className="relative order-2 lg:order-1">
   <div className="relative h-[420px] lg:h-[520px] rounded-[2rem] overflow-hidden bg-muted border shadow-large">
    <Image
    src="https://bsagrc.co.id/wp-content/uploads/2023/10/Profil-BSA.png"
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
     <p className="font-bold text-sm text-foreground">Pabrik & Workshop BSA GRC</p>
     <p className="text-xs text-muted-foreground leading-relaxed mt-1">{company?.address?.full || company?.address || "Trenggalek, Jatim"}</p>
     <p className="text-[11px] text-maroon-700 font-semibold mt-2 bg-maroon-50 px-2 py-1 rounded-full border border-maroon-100 inline-flex">
      ✓ Lokasi strategis, akses mudah, pengiriman nasional -
     </p>
     </div>
    </div>
    </div>
   </div>

   <div className="absolute -top-4 -right-4 lg:-right-6 grid grid-cols-2 gap-3">
    {achievements.map((ach) => (
    <div
     key={ach.label}
     className="bg-white rounded-2xl shadow-large border border-gold-100 p-3 w-[130px] text-center hover:-translate-y-1 transition-transform"
    >
     <div className="w-8 h-8 mx-auto rounded-full bg-maroon-50 flex items-center justify-center mb-2">
     <ach.icon className="w-4 h-4 text-maroon-700" />
     </div>
     <p className="font-bold text-sm text-foreground">{ach.value}</p>
     <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{ach.label}</p>
    </div>
    ))}
   </div>
   </div>

   <div className="order-1 lg:order-2 space-y-6">
   <SectionHeader
    badge="Profil Perusahaan"
    badgeVariant="maroon"
    title={
    <>
     <span className="text-maroon-700">BSA GRC</span> - {company?.yearsExperience || 10}+ Tahun Profesional
    </>
    }
    description={`${company?.name || "BSA GRC"} bergerak khusus industri pembuatan & pemasangan produk GRC (Glassfibre Reinforced Cement) yang sudah berpengalaman lebih dari ${company?.yearsExperience || 10} tahun dan dapat diandalkan dibidangnya.`}
    align="left"
    className="max-w-none"
    withDivider={false}
   />

   <div className="space-y-4 pt-2">
    <h3 className="font-bold text-foreground">Kenapa Pilih BSA GRC? ()</h3>
    <div className="grid sm:grid-cols-1 gap-2.5">
    {benefits.map((benefit) => (
     <div key={benefit} className="flex items-start gap-3 bg-muted/60 border rounded-xl px-4 py-3">
     <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
     <span className="text-sm text-foreground leading-snug">{benefit}</span>
     </div>
    ))}
    </div>
   </div>

   <div className="flex flex-col sm:flex-row gap-3 pt-4">
    <Button variant="primary" href="/profil">
    Baca Profil Lengkap
    </Button>
    <Button variant="gold" href={`https://www.google.com/maps/search/${encodeURIComponent(company?.address?.full || "Trenggalek")}`} external>
    <MapPin className="w-4 h-4" />
    Lihat Lokasi Pabrik
    </Button>
   </div>
   </div>
  </div>
  </div>
 </section>
 );
}
