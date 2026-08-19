"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOME_DEFAULT } from "@/lib/content-defaults";

interface Faq {
  id?: number;
  question?: string;
  q?: string;
  answer?: string;
  a?: string;
}

const FALLBACK_FAQS: Faq[] = [
  { q: "Model Kubah yang Bagus?", a: "Model kubah masjid yang kami produksi adalah model setengah bola, kubah madinah, kubah pinang, kubah bawang, dan model kustom sesuai musyawarah panitia." },
  { q: "Harganya Berapa?", a: "Range harga kubah masjid per meter Rp 1.000.000 – 2.500.000 /m2 tergantung bahan, model, ukuran dan lokasi. Gratis konsultasi estimasi via WhatsApp." },
  { q: "Area Pelayanannya Mana Saja?", a: "Kami melayani pemasangan kubah masjid di seluruh Indonesia termasuk luar Pulau Jawa. Pabrik di Trenggalek, Jatim." },
];

interface FAQItemProps {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ faq, isOpen, onToggle, index }: FAQItemProps) {
  const question = (faq as any).question || (faq as any).q || "";
  const answer = (faq as any).answer || (faq as any).a || "";

  return (
    <div className="bg-white border border-border rounded-2xl shadow-soft hover:shadow-medium transition-all overflow-hidden group">
      <button onClick={onToggle} className="w-full flex items-start justify-between gap-4 p-5 lg:p-6 text-left" aria-expanded={isOpen}>
        <div className="flex gap-4">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors",
              isOpen ? "bg-maroon-700 text-white" : "bg-maroon-50 text-maroon-700 group-hover:bg-maroon-100"
            )}
          >
            {index + 1}
          </div>
          <h3 className="font-bold text-[15px] lg:text-[16px] text-foreground leading-snug pt-1">{question}</h3>
        </div>
        <div
          className={cn(
            "w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all",
            isOpen ? "bg-maroon-700 border-maroon-700 text-white rotate-180" : "bg-white border-border text-muted-foreground group-hover:border-gold-200"
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <div className={cn("grid transition-all duration-300 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <div className="px-5 lg:px-6 pb-6 pl-[52px] lg:pl-[60px]">
            <p className="text-sm leading-relaxed text-muted-foreground bg-muted/50 rounded-xl p-4 border border-dashed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FAQHeader {
  badge?: string;
  title?: string;
  description?: string;
  helpTitle?: string;
  helpText?: string;
  helpButton?: string;
}

export default function FAQSection({
  faqs: propFaqs,
  header,
  whatsappLink = "https://api.whatsapp.com/send?phone=6281230469914",
}: {
  faqs?: Faq[];
  header?: FAQHeader;
  whatsappLink?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const h = { ...HOME_DEFAULT.faqHeader, ...(header || {}) };

  const faqs = propFaqs && propFaqs.length > 0 ? propFaqs.map((f: any) => ({ q: f.question || f.q, a: f.answer || f.a } as any)) : FALLBACK_FAQS;

  return (
    <section className="cv-auto py-16 lg:py-24 bg-muted/30 border-t border-gold-100/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="inline-flex items-center gap-2 bg-maroon-50 border border-maroon-100 text-maroon-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
              <HelpCircle className="w-4 h-4" />
              {h.badge} {faqs.length} Soal
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-foreground">{h.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{h.description}</p>
            </div>

            <div className="hidden lg:block bg-gradient-to-br from-maroon-700 to-maroon-900 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 islamic-pattern opacity-10" />
              <div className="relative">
                <p className="font-bold mb-2">{h.helpTitle}</p>
                <p className="text-sm text-white/80 mb-4">{h.helpText}</p>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex bg-gold-400 text-maroon-900 font-bold px-4 py-2 rounded-full text-sm hover:bg-gold-300 transition-colors">
                  {h.helpButton} →
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq: any, idx: number) => (
              <FAQItem key={faq.q || faq.question || idx} faq={faq} isOpen={openIndex === idx} onToggle={() => setOpenIndex(openIndex === idx ? null : idx)} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
