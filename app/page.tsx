import type { Metadata } from "next";
import { generateSEOMetadata, generateFAQSchema } from "@/lib/seo";
import { COMPANY_INFO } from "@/lib/constants";
import { getFaqsData, getSettingsData } from "@/lib/data";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import StatsSection from "@/components/sections/StatsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = generateSEOMetadata({
  title: "Kontraktor Kubah GRC, Menara GRC, Ornamen GRC Kualitas Terbaik",
  description: `BSA GRC - ${COMPANY_INFO.description}. Spesialis produksi kubah masjid GRC, menara, lisplang, krawangan & mihrab ACP. Pabrik di ${COMPANY_INFO.address.regency}. Gratis desain, konsultasi & survey lokasi. Hubungi ${COMPANY_INFO.contact.whatsappDisplay} - ${COMPANY_INFO.projectsCompleted}+ proyek selesai.`,
  url: COMPANY_INFO.website,
  image: "https://bsagrc.co.id/wp-content/uploads/2023/11/kubah-grc-menara-grc-krawangan-grc.png",
});

export default async function HomePage() {
  let faqs: any[] = [];
  let settings: any = null;

  try {
    const [faqsData, settingsData] = await Promise.all([getFaqsData().catch(() => []), getSettingsData().catch(() => null)]);
    faqs = faqsData;
    settings = settingsData;
  } catch {}

  const faqForSchema = faqs.length > 0
    ? faqs.map((f: any) => ({ question: f.question, answer: f.answer }))
    : [
        { question: "Model Kubah yang Bagus?", answer: "Model kubah masjid yang kami produksi adalah model setengah bola, kubah madinah, kubah pinang, kubah bawang, dan model kustom sesuai musyawarah panitia." },
        { question: "Harganya Berapa?", answer: "Range harga kubah masjid per meter Rp 1.000.000 – 2.500.000 /m2 tergantung bahan, model, ukuran dan lokasi." },
        { question: "Area Pelayanan Mana Saja?", answer: "Kami melayani pemasangan kubah masjid di seluruh Indonesia termasuk luar Pulau Jawa." },
        { question: "Bahan yang Dipakai Apa Saja?", answer: "3 pilihan bahan: Enamel, Galvalum, dan GRC kualitas terbaik tahan lama." },
        { question: "Model Pembayarannya?", answer: "3 tahap: 35% pertama, 45% kedua, 20% ketiga setelah serah terima." },
        { question: "Garansi?", answer: "Garansi kebocoran 1 tahun, perbaikan gratis jika masih garansi." },
      ];

  const faqSchema = generateFAQSchema(faqForSchema);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <AboutSection />
      <PortfolioSection />
      <ProcessSection />
      <TestimonialSection />
      <FAQSection faqs={faqs} />
      <CTASection />
    </>
  );
}
