"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import { COMPANY_INFO } from "@/lib/constants";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("BSA GRC Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20 px-4 bg-gradient-to-br from-white to-red-50/30">
      <div className="max-w-lg w-full bg-white rounded-[2rem] border border-red-100 shadow-large p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-red-50 border border-red-200 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Terjadi Kesalahan</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Maaf, ada kendala teknis memuat halaman. Tim BSA GRC telah mencatat error ini. Silakan coba lagi atau hubungi kami via WhatsApp.
          </p>
          {error.digest && <p className="text-[11px] font-mono bg-muted px-3 py-1 rounded-full border inline-block">Error ID: {error.digest}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-maroon-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-maroon-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Button variant="outline" href="/">
            <Home className="w-4 h-4" />
            Beranda
          </Button>
        </div>

        <div className="pt-4 border-t border-dashed">
          <p className="text-xs text-muted-foreground mb-3">Butuh bantuan cepat?</p>
          <a
            href={COMPANY_INFO.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            WA {COMPANY_INFO.contact.whatsappDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
