import Link from "next/link";
import { Search, Home, Phone, ArrowLeft } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function NotFound() {
 return (
 <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-gradient-to-br from-white to-gold-50/30">
  <div className="max-w-2xl w-full text-center space-y-8">
  <div className="relative mx-auto w-32 h-32">
   <div className="absolute inset-0 bg-maroon-100 rounded-full animate-pulse-soft" />
   <div className="absolute inset-2 bg-white rounded-full shadow-medium flex items-center justify-center">
   <Search className="w-12 h-12 text-maroon-700" />
   </div>
   <div className="absolute -top-1 -right-1 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center font-bold text-maroon-900 text-sm shadow-gold">
   404
   </div>
  </div>

  <div className="space-y-4">
   <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
   Halaman <span className="text-maroon-700">Tidak Ditemukan</span>
   </h1>
   <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
   Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan. Mungkin Anda mencari layanan kubah masjid, menara GRC, atau portofolio kami?
   </p>
  </div>

  <div className="bg-white rounded-2xl border shadow-soft p-6 text-left max-w-lg mx-auto">
   <p className="font-bold text-sm mb-3">Mungkin Anda mencari:</p>
   <div className="grid grid-cols-2 gap-2">
   {[
    { label: "Beranda", href: "/" },
    { label: "Layanan Kubah GRC", href: "/layanan/kubah-grc" },
    { label: "Portofolio", href: "/portofolio" },
    { label: "Kontak & Konsultasi", href: "/kontak" },
   ].map((link) => (
    <Link
    key={link.href}
    href={link.href}
    className="text-sm bg-muted hover:bg-maroon-50 hover:text-maroon-700 border rounded-xl px-4 py-2.5 transition-colors flex items-center gap-2"
    >
    <ArrowLeft className="w-3 h-3 rotate-180" />
    {link.label}
    </Link>
   ))}
   </div>
  </div>

  <div className="flex flex-col sm:flex-row gap-3 justify-center">
   <Button variant="primary" href="/" size="lg">
   <Home className="w-4 h-4" />
   Kembali ke Beranda
   </Button>
   <Button variant="gold" href={COMPANY_INFO.contact.whatsappLink} external size="lg">
   <Phone className="w-4 h-4" />
   Hubungi {COMPANY_INFO.contact.whatsappDisplay}
   </Button>
  </div>

  <p className="text-xs text-muted-foreground">
   Error 404 • {COMPANY_INFO.name} • Pabrik {COMPANY_INFO.address.regency}
  </p>
  </div>
 </div>
 );
}
