"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, MessageCircle, Phone, PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCompany } from "@/components/providers/SettingsProvider";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const { company: dynamicCompany } = useCompany();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use dynamic company from provider (single fetch, cached)
  const company = {
    whatsapp: dynamicCompany.whatsapp,
    whatsappDisplay: dynamicCompany.whatsappDisplay,
    whatsappLink: dynamicCompany.whatsappLink,
    phone: dynamicCompany.phone,
    phoneDisplay: dynamicCompany.phoneDisplay,
    phoneLink: dynamicCompany.phoneLink,
    regency: dynamicCompany.regency,
  };

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      setIsVisible(false);
      return;
    }
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  const defaultMessage = `Assalamualaikum BSA GRC, saya ingin konsultasi tentang proyek kubah masjid / menara. Mohon info lebih lanjut. Terima kasih.`;

  // Sembunyikan total di admin - sesuai request user screenshot
  if (pathname?.startsWith("/admin")) return null;
  if (!isVisible) return null;

  return (
    <>
      {/* Floating Dual Buttons - Center Bottom per Request - Hidden on Admin */}
      <div id="global-floating" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 w-[calc(100%-2rem)] max-w-[400px] pointer-events-none">
        {/* Chat Bubble - Centered above buttons */}
        {isOpen && (
          <div className="w-full sm:w-[380px] bg-white rounded-[1.5rem] shadow-large border border-gold-100 overflow-hidden animate-slide-up origin-bottom pointer-events-auto">
            {/* Header - Maroon Gradient */}
            <div className="bg-gradient-to-br from-maroon-700 to-maroon-900 p-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "16px 16px" }} />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-soft">
                    <Image
                      src="https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png"
                      alt="BSA GRC"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">BSA GRC</h4>
                    <p className="text-xs text-gold-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Online - Balas Cepat • {company.regency}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup"
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
              <div className="bg-muted rounded-2xl rounded-tl-sm p-3 text-sm">
                <p className="font-semibold text-maroon-700 text-[13px] mb-1">BSA GRC • Konsultasi Gratis</p>
                <p className="text-foreground leading-relaxed text-[13px]">
                  Assalamualaikum! 👋 Spesialis <strong>Kubah, Menara, Lisplang, Krawangan GRC & Mihrab ACP</strong>. Pilih hubungi via Telepon atau WhatsApp di bawah, tim kami siap bantu &lt;5 menit.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={company.phoneLink}
                  className="flex flex-col items-center gap-2 bg-maroon-50 border border-maroon-100 rounded-xl p-3 hover:bg-maroon-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-maroon-700 text-white flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-maroon-800">Telepon</span>
                  <span className="text-[11px] text-muted-foreground">{company.phoneDisplay}</span>
                </a>
                <a
                  href={`${company.whatsappLink}&text=${encodeURIComponent(defaultMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 hover:bg-green-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-green-800">WhatsApp</span>
                  <span className="text-[11px] text-muted-foreground">Chat Cepat</span>
                </a>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] text-muted-foreground font-medium">Pilihan cepat:</p>
                {["Minta katalog & price list", "Konsultasi desain gratis", "Jadwal survey lokasi"].map((quick) => (
                  <a
                    key={quick}
                    href={`${company.whatsappLink}&text=${encodeURIComponent(`Halo BSA GRC, ${quick.toLowerCase()}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-left text-xs border border-border rounded-xl px-3 py-2 hover:bg-maroon-50 hover:border-maroon-100 transition-colors"
                  >
                    {quick}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dual FAB - Centered, Side by Side per Request */}
        <div className="pointer-events-auto">
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-2xl rounded-full shadow-large border border-gold-200 p-2 pr-2">
            {/* Label for desktop */}
            {!isOpen && (
              <div className="hidden lg:flex items-center gap-2 pl-3 pr-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-foreground">Butuh Bantuan?</span>
                <span className="text-xs text-muted-foreground">Hubungi Kami:</span>
              </div>
            )}

            {/* Phone Button - Maroon Primary per Brand */}
            <a
              href={company.phoneLink}
              aria-label={`Telepon ${company.phoneDisplay}`}
              className="group relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-gradient-to-br from-maroon-600 to-maroon-800 text-white shadow-maroon hover:shadow-large hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
            >
              <PhoneCall className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform" />
              <span className="absolute inset-0 rounded-full bg-maroon-600 animate-ping opacity-20 -z-10" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-maroon-900 text-white text-xs font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Telepon {company.phoneDisplay}
              </span>
            </a>

            {/* WhatsApp Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Chat WhatsApp"
              className="group relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-large hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
            >
              {isOpen ? (
                <X className="w-6 h-6 sm:w-7 sm:h-7" />
              ) : (
                <>
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold animate-pulse-soft">
                    1
                  </span>
                  <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10" />
                </>
              )}
              {!isOpen && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-700 text-white text-xs font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  WhatsApp
                </span>
              )}
            </button>

            <div className="lg:hidden flex flex-col pl-1 pr-3">
              <span className="text-[11px] font-bold text-foreground leading-none">Hubungi</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">Telepon & WA</span>
            </div>
          </div>

          <p className="text-[10px] text-center text-muted-foreground mt-2 bg-white/80 backdrop-blur rounded-full px-3 py-1 border shadow-soft mx-auto w-fit hidden sm:block">
            📞 {company.phoneDisplay} • Gratis Konsultasi & Survey • Respon &lt;5 Menit
          </p>
        </div>
      </div>

      <div className="sr-only" aria-hidden="true">
        <a href={company.whatsappLink} tabIndex={-1}>WhatsApp BSA GRC {company.whatsappDisplay}</a>
        <a href={company.phoneLink} tabIndex={-1}>Telepon BSA GRC {company.phoneDisplay}</a>
      </div>
    </>
  );
}
