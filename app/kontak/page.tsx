import type { Metadata } from "next";
import { COMPANY_INFO } from "@/lib/constants";
import { generateSEOMetadata } from "@/lib/seo";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = generateSEOMetadata({
  title: "Kontak - Konsultasi Gratis Kubah GRC, Menara & Ornamen",
  description: `Hubungi BSA GRC - Gratis desain, konsultasi & survey. WhatsApp ${COMPANY_INFO.contact.whatsappDisplay}. Pabrik ${COMPANY_INFO.address.full}. Respon cepat <5 menit. Form webhook n8n ready.`,
  url: `${COMPANY_INFO.website}/kontak`,
});

export default function KontakPage() {
  return <ContactSection />;
}
