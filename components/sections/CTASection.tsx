import Link from "next/link";
import { Phone, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export default function CTASection() {
 return (
 <section className="cv-auto py-16 lg:py-20 bg-maroon-900 relative overflow-hidden">
  <div className="absolute inset-0 islamic-pattern opacity-[0.05]" />
  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-maroon-700 via-gold-400 to-maroon-700" />
  
  {/* Glow */}
  <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-maroon-600/20 rounded-full blur-3xl pointer-events-none" />

  <div className="relative container mx-auto px-4 lg:px-8">
  <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-large border border-gold-100 overflow-hidden">
   <div className="grid lg:grid-cols-2">
   {/* Left - Content */}
   <div className="p-8 lg:p-10 space-y-6">
    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    Gratis Jasa Desain, Konsultasi & Survey
    </div>

    <div className="space-y-3">
    <h2 className="text-2xl lg:text-[32px] font-bold leading-[1.15] tracking-tight">
     Siap Membangun <span className="text-maroon-700">Kubah Masjid Impian?</span>
    </h2>
    <p className="text-sm lg:text-[15px] text-muted-foreground leading-relaxed">
     Konsultasi gratis sekarang. Tim BSA GRC dari pabrik {COMPANY_INFO.address.regency} siap survey lokasi di seluruh Indonesia & buatkan desain 3D custom budaya lokal.
    </p>
    </div>

    <div className="grid grid-cols-2 gap-2.5">
    {["Desain 3D Gratis", "Survey Nasional", "Harga Pabrik", "Garansi 1 Tahun"].map((item) => (
     <div key={item} className="flex items-center gap-2 text-sm font-medium">
     <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
     <span className="text-foreground">{item}</span>
     </div>
    ))}
    </div>

    <div className="flex flex-col sm:flex-row gap-3 pt-2">
    <Link
     href={COMPANY_INFO.contact.whatsappLink}
     target="_blank"
     className="inline-flex items-center justify-center gap-2 bg-maroon-700 hover:bg-maroon-800 text-white font-bold px-6 py-3.5 rounded-xl shadow-maroon hover:shadow-large hover:-translate-y-0.5 transition-all text-sm"
    >
     <Phone className="w-4 h-4" />
     Hubungi {COMPANY_INFO.contact.whatsappDisplay}
     <ArrowRight className="w-4 h-4" />
    </Link>
    <Link
     href="/kontak"
     className="inline-flex items-center justify-center gap-2 border-2 border-maroon-200 text-maroon-700 hover:bg-maroon-50 font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
    >
     Form Penawaran
    </Link>
    </div>

    <p className="text-[11px] text-muted-foreground flex items-center gap-2">
    <MapPin className="w-3 h-3" />
    {COMPANY_INFO.address.full} • Respon &lt;5 Menit • Senin-Sabtu 08:00-17:00
    </p>
   </div>

   {/* Right - Visual / Process */}
   <div className="bg-gradient-to-br from-gold-50 to-maroon-50/50 p-8 lg:p-10 border-l border-gold-100 flex flex-col justify-center relative overflow-hidden">
    <div className="absolute top-4 right-4 w-20 h-20 border-2 border-gold-200 rounded-full opacity-20" />
    <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-maroon-200 rounded-lg rotate-12 opacity-20" />

    <div className="relative space-y-5">
    <h3 className="font-bold text-foreground">Alur Pemesanan Mudah</h3>
    
    {[
     { step: "01", title: "Konsultasi WA", desc: "Chat kebutuhan kubah/menara" },
     { step: "02", title: "Desain 3D Gratis", desc: "Tim buatkan desain custom" },
     { step: "03", title: "Survey Lokasi", desc: "Gratis survey & ukur lokasi" },
     { step: "04", title: "Produksi & Pasang", desc: "Pengerjaan cepat, presisi, rapi" },
    ].map((process, idx, arr) => (
     <div key={process.step} className="flex gap-4">
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
