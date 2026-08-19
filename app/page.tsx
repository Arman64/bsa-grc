import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { generateSEOMetadata, generateFAQSchema } from "@/lib/seo";
import { getFaqsData } from "@/lib/data";
import { getPageContentCached, getSettingsCached, waLink } from "@/lib/content";
import HeroSection from "@/components/sections/HeroSection";

const StatsSection = nextDynamic(() => import("@/components/sections/StatsSection"), { ssr: true, loading: () => <div className="h-24 bg-maroon-900/5 animate-pulse" /> });
const ServicesSection = nextDynamic(() => import("@/components/sections/ServicesSection"), { ssr: true, loading: () => <div className="h-96 bg-muted/30 animate-pulse" /> });
const AboutSection = nextDynamic(() => import("@/components/sections/AboutSection"), { ssr: true, loading: () => <div className="h-[500px] bg-white animate-pulse" /> });
const PortfolioSection = nextDynamic(() => import("@/components/sections/PortfolioSection"), { ssr: true, loading: () => <div className="h-96 bg-muted/20 animate-pulse" /> });
const ProcessSection = nextDynamic(() => import("@/components/sections/ProcessSection"), { ssr: true, loading: () => <div className="h-64 bg-white animate-pulse" /> });
const TestimonialSection = nextDynamic(() => import("@/components/sections/TestimonialSection"), { ssr: true, loading: () => <div className="h-64 bg-white animate-pulse" /> });
const FAQSection = nextDynamic(() => import("@/components/sections/FAQSection"), { ssr: true, loading: () => <div className="h-96 bg-muted/20 animate-pulse" /> });
const CTASection = nextDynamic(() => import("@/components/sections/CTASection"), { ssr: true, loading: () => <div className="h-64 bg-maroon-900 animate-pulse" /> });

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [content, settings] = await Promise.all([getPageContentCached("beranda"), getSettingsCached().catch(() => null)]);
  const seo = (settings as any)?.seo || {};
  return generateSEOMetadata({
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.description || settings?.company?.description || "",
    url: seo.siteUrl || "https://bsagrc.co.id",
    image: seo.ogImage || "https://bsagrc.co.id/wp-content/uploads/2023/11/kubah-grc-menara-grc-krawangan-grc.png",
  });
}

export default async function HomePage() {
  const [faqs, content, settings] = await Promise.all([
    getFaqsData().catch(() => []),
    getPageContentCached("beranda"),
    getSettingsCached().catch(() => null),
  ]);

  const faqForSchema = faqs.length > 0 ? faqs.map((f: any) => ({ question: f.question, answer: f.answer })) : [];
  const faqSchema = generateFAQSchema(faqForSchema);
  const whatsappLink = waLink(settings?.company?.whatsapp);

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
      <FAQSection faqs={faqs} header={content.sections.faqHeader} whatsappLink={whatsappLink} />
      <CTASection />
    </>
  );
}
