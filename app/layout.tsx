import type { Metadata } from "next";
import { Poppins, Inter, Amiri } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { generateSEOMetadata, generateLocalBusinessSchema } from "@/lib/seo";
import { COMPANY_INFO } from "@/lib/constants";

// Fonts - Performance: display swap & subset Indonesian
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = generateSEOMetadata({
  title: COMPANY_INFO.tagline,
  description: `${COMPANY_INFO.description} Pabrik & Workshop di ${COMPANY_INFO.address.full}. Melayani ${COMPANY_INFO.projectsCompleted}+ proyek di seluruh Indonesia. Gratis desain, konsultasi & survey.`,
  image: "https://bsagrc.co.id/wp-content/uploads/2023/10/kubah-grc-menara-grc-krawangan-grc.png",
  url: COMPANY_INFO.website,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable} ${amiri.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to original asset domain for performance */}
        <link rel="preconnect" href="https://bsagrc.co.id" />
        <link rel="dns-prefetch" href="https://bsagrc.co.id" />
        
        {/* Schema Markup - LocalBusiness & Contractor */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        
        {/* Theme Color - Maroon */}
        <meta name="theme-color" content="#7A0C10" />
        <meta name="msapplication-TileColor" content="#7A0C10" />

        {/* Favicon from original site */}
        <link rel="icon" href="https://bsagrc.co.id/wp-content/uploads/2023/10/Favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        {/* Skip to content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-maroon-600 text-white px-4 py-2 rounded-lg z-[100]"
        >
          Lompat ke konten utama
        </a>

        <SettingsProvider>
          <Header />

          <main id="main-content" className="flex-1 flex flex-col">
            {children}
          </main>

          <Footer />
          <FloatingWhatsApp />
        </SettingsProvider>

        {/* No-JS fallback */}
        <noscript>
          <div className="fixed bottom-0 left-0 right-0 bg-maroon-700 text-white text-center py-2 text-sm z-50">
            Untuk pengalaman terbaik, aktifkan JavaScript. Hubungi WhatsApp: {COMPANY_INFO.contact.whatsappDisplay}
          </div>
        </noscript>
      </body>
    </html>
  );
}
