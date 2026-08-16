import type { Metadata } from "next";
import { COMPANY_INFO } from "./constants";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

const BASE_URL = COMPANY_INFO.website;
const DEFAULT_IMAGE = "https://bsagrc.co.id/wp-content/uploads/2023/10/kubah-grc-menara-grc-krawangan-grc.png";

export function generateSEOMetadata({
  title,
  description = COMPANY_INFO.description,
  keywords = [
    "kontraktor kubah masjid",
    "kubah GRC",
    "menara masjid GRC",
    "krawangan GRC",
    "lisplang GRC",
    "mihrab ACP",
    "BSA GRC",
    "kubah masjid Trenggalek",
    "kontraktor kubah Indonesia",
  ],
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = "website",
  noIndex = false,
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | ${COMPANY_INFO.name}` : `${COMPANY_INFO.tagline} | ${COMPANY_INFO.name}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: COMPANY_INFO.name, url: BASE_URL }],
    creator: COMPANY_INFO.name,
    publisher: COMPANY_INFO.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: COMPANY_INFO.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || COMPANY_INFO.tagline,
        },
      ],
      locale: "id_ID",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@bsagrc",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "google-verification-code",
    },
    category: "Construction & Contractor",
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Contractor", "HomeAndConstructionBusiness"],
    "@id": `${COMPANY_INFO.website}/#organization`,
    name: COMPANY_INFO.name,
    alternateName: COMPANY_INFO.fullName,
    url: COMPANY_INFO.website,
    logo: "https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png",
    image: "https://bsagrc.co.id/wp-content/uploads/2023/10/kubah-grc-menara-grc-krawangan-grc.png",
    description: COMPANY_INFO.description,
    telephone: `+${COMPANY_INFO.contact.whatsapp}`,
    email: COMPANY_INFO.contact.email,
    priceRange: "Rp 1.000.000 - Rp 2.500.000 per m²",
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_INFO.address.street,
      addressLocality: COMPANY_INFO.address.village,
      addressRegion: COMPANY_INFO.address.province,
      addressCountry: "ID",
      postalCode: COMPANY_INFO.address.postalCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -8.1,
      longitude: 111.7,
    },
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    sameAs: [COMPANY_INFO.social.whatsapp, COMPANY_INFO.social.instagram, COMPANY_INFO.social.facebook],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Layanan BSA GRC",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Kubah Masjid GRC" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Menara Masjid GRC" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lisplang GRC" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Krawangan GRC" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mihrab ACP" } },
      ],
    },
  };
}

export function generateServiceSchema(service: { title: string; description: string; image: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: service.title,
    description: service.description,
    image: service.image,
    url: service.url,
    provider: {
      "@type": "LocalBusiness",
      name: COMPANY_INFO.name,
      telephone: `+${COMPANY_INFO.contact.whatsapp}`,
      address: {
        "@type": "PostalAddress",
        addressRegion: COMPANY_INFO.address.province,
        addressCountry: "ID",
      },
    },
    areaServed: "Indonesia",
    category: "Construction",
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
