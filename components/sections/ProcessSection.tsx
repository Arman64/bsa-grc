import { Phone, Palette, Ruler, Building2, CheckCircle } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
 {
 number: "01",
 title: "Konsultasi Gratis via WhatsApp",
 desc: "Chat kebutuhan kubah/menara/lisplang/krawangan/mihrab ACP. Tim respons <5 menit, Senin-Sabtu 08:00-17:00 WIB.",
 icon: Phone,
 color: "bg-green-50 border-green-200 text-green-700",
 },
 {
 number: "02",
 title: "Desain 3D Custom Gratis",
 desc: "Tim desainer BSA GRC buatkan desain 3D sesuai kultur daerah, model bawang/setengah bola/nanas/Nabawi/kustom.",
 icon: Palette,
 color: "bg-gold-50 border-gold-200 text-gold-700",
 },
 {
 number: "03",
 title: "Survey & Ukur Lokasi Gratis",
 desc: "Tim survey dari pabrik Trenggalek ke lokasi proyek seluruh Indonesia. Ukur presisi, cek struktur bangunan masjid.",
 icon: Ruler,
 color: "bg-blue-50 border-blue-200 text-blue-700",
 },
 {
 number: "04",
 title: "Produksi di Pabrik Trenggalek",
 desc: "Produksi GRC di pabrik Dsn. Setri Klampis Wonorejo Gandusari. Campuran bahan tepat, cetakan presisi, quality control ketat.",
 icon: Building2,
 color: "bg-maroon-50 border-maroon-200 text-maroon-700",
 },
 {
 number: "05",
 title: "Pengiriman & Pemasangan Rapi",
 desc: "Pengerjaan cepat, kuat, ringan, awet, rapi & presisi. Rangka Kremona paling kokoh, anti bocor membran bakar, garansi 1 tahun.",
 icon: CheckCircle,
 color: "bg-green-50 border-green-200 text-green-700",
 },
];

export default function ProcessSection() {
 return (
 <section className="cv-auto py-16 lg:py-24 bg-white border-y border-gold-100/50">
  <div className="container mx-auto px-4 lg:px-8">
  <SectionHeader
   badge="Alur Pengerjaan"
   badgeVariant="maroon"
   title={
   <>
    5 Langkah Mudah <span className="text-maroon-700">Pemesanan</span>
   </>
   }
   description="Proses transparan dari konsultasi hingga serah terima. Gratis desain & survey nasional, harga pabrik langsung."
  />

  <div className="mt-12 lg:mt-16 relative">
   {/* Line Desktop */}
   <div className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-green-200 via-gold-200 to-maroon-200" />

   <div className="grid lg:grid-cols-5 gap-6 lg:gap-4">
   {steps.map((step) => (
    <div key={step.number} className="relative group">
    <div className="bg-white border rounded-2xl shadow-soft p-6 hover:shadow-large hover:-translate-y-1 transition-all duration-300 h-full">
     <div className="flex lg:flex-col items-start gap-4">
     <div className="relative">
      <div
      className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center shadow-soft ${step.color} group-hover:scale-110 transition-transform`}
      >
      <step.icon className="w-6 h-6" />
      </div>
      <div className="absolute -top-2 -right-2 w-7 h-7 bg-maroon-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-maroon">
      {step.number}
      </div>
     </div>

     <div className="flex-1">
      <h3 className="font-bold text-sm leading-tight text-foreground mb-2">{step.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
     </div>
     </div>
    </div>
    </div>
   ))}
   </div>
  </div>
  </div>
 </section>
 );
}
