import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANY_INFO } from "@/lib/constants";
import { getServicesData, getServiceBySlug } from "@/lib/data";
import { generateSEOMetadata, generateServiceSchema, generateBreadcrumbSchema } from "@/lib/seo";
import LandingPageService from "@/components/sections/LandingPageService";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const services = await getServicesData();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return {};

  const lp = service.landingPage;

  return generateSEOMetadata({
    title: lp ? `${lp.headline} | BSA GRC` : `${service.title} - Kualitas Terbaik Garansi`,
    description: lp?.subHeadline || `${service.longDescription} Produksi BSA GRC Pabrik ${COMPANY_INFO.address.regency}. ${service.features.join(", ")}. ${service.priceRange}.`,
    url: `${COMPANY_INFO.website}/layanan/${service.slug}`,
    image: lp?.heroImage || service.originalImage,
    keywords: [service.title, `${service.shortTitle} harga`, `kontraktor ${service.shortTitle}`, "BSA GRC"],
  });
}

export default async function ServiceLandingPage({ params }: Props) {
  const service = await getServiceBySlug(params.slug);
  if (!service) notFound();

  const lp = service.landingPage;

  const serviceSchema = generateServiceSchema({
    title: service.title,
    description: lp?.subHeadline || service.longDescription,
    image: lp?.heroImage || service.originalImage,
    url: `${COMPANY_INFO.website}/layanan/${service.slug}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Beranda", url: COMPANY_INFO.website },
    { name: "Layanan", url: `${COMPANY_INFO.website}/layanan` },
    { name: service.title, url: `${COMPANY_INFO.website}/layanan/${service.slug}` },
  ]);

  const faqSchema = lp?.faqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: lp.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <LandingPageService service={service} />
    </>
  );
}
