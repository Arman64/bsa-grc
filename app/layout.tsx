import type { Metadata } from "next";
import { Poppins, Inter, Amiri } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChromeGate from "@/components/layout/ChromeGate";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { generateSEOMetadata, generateLocalBusinessSchema } from "@/lib/seo";
import { COMPANY_INFO } from "@/lib/constants";
import { getSiteChromeCached, getSettingsCached } from "@/lib/content";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-poppins", display: "swap", preload: true, fallback: ["system-ui", "sans-serif"], adjustFontFallback: true });
const inter = Inter({ subsets: ["latin"], weight: ["400"], variable: "--font-inter", display: "swap", preload: false, fallback: ["system-ui", "sans-serif"] });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400"], variable: "--font-amiri", display: "swap", preload: false });

export async function generateMetadata(): Promise<Metadata> {
  let favicon = "https://bsagrc.co.id/wp-content/uploads/2023/10/Favicon.png";
  let logo = COMPANY_INFO.contact.whatsapp ? "https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png" : "";
  let desc: string = COMPANY_INFO.description;
  try {
    const [chrome, settings] = await Promise.all([getSiteChromeCached(), getSettingsCached().catch(() => null)]);
    favicon = chrome.appearance.favicon || favicon;
    logo = chrome.appearance.logo || logo;
    desc = settings?.company?.description || desc;
  } catch {}

  return {
    ...generateSEOMetadata({
      title: COMPANY_INFO.tagline,
      description: `${desc} Pabrik & Workshop di ${COMPANY_INFO.address.full}.`,
      image: "https://bsagrc.co.id/wp-content/uploads/2023/10/kubah-grc-menara-grc-krawangan-grc.png",
      url: COMPANY_INFO.website,
    }),
    icons: { icon: favicon, apple: logo },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const localBusinessSchema = generateLocalBusinessSchema();

  let chrome: any = null;
  try {
    chrome = await getSiteChromeCached();
  } catch {}
  const appearance = chrome?.appearance || {};
  const navigation = chrome?.navigation || {};
  const integrations = chrome?.integrations || {};

  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable} ${amiri.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://bsagrc.co.id" />
        <link rel="dns-prefetch" href="https://bsagrc.co.id" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <meta name="theme-color" content={appearance.themeColor || "#7A0C10"} />
        <meta name="msapplication-TileColor" content={appearance.themeColor || "#7A0C10"} />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-maroon-600 text-white px-4 py-2 rounded-lg z-[100]">
          Lompat ke konten utama
        </a>

        <SettingsProvider>
          <ChromeGate>
            <Header appearance={appearance} navigation={navigation} />
          </ChromeGate>
          <main id="main-content" className="flex-1 flex flex-col">
            {children}
          </main>
          <ChromeGate>
            <Footer />
            <FloatingWhatsApp />
          </ChromeGate>
        </SettingsProvider>

        {/* Google Analytics 4 */}
        {integrations.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${integrations.gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${integrations.gaId}');`}
            </Script>
          </>
        )}

        {/* Meta Pixel */}
        {integrations.metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${integrations.metaPixelId}');fbq('track','PageView');`}
          </Script>
        )}

        {integrations.headScripts ? <Script id="custom-scripts" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: integrations.headScripts }} /> : null}

        <noscript>
          <div className="fixed bottom-0 left-0 right-0 bg-maroon-700 text-white text-center py-2 text-sm z-50">
            Untuk pengalaman terbaik, aktifkan JavaScript.
          </div>
        </noscript>
      </body>
    </html>
  );
}
