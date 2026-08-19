import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Award, ShieldCheck } from "lucide-react";
import { getServicesData } from "@/lib/data";
import { getSiteChromeCached, getSettingsCached, waLink } from "@/lib/content";

export default async function Footer() {
  let company: any = {};
  let chrome: any = null;
  let services: any[] = [];
  try {
    const [settings, ch, svc] = await Promise.all([
      getSettingsCached().catch(() => null),
      getSiteChromeCached(),
      getServicesData().catch(() => []),
    ]);
    company = settings?.company || {};
    chrome = ch;
    services = svc;
  } catch {}

  const ap = chrome?.appearance || {};
  const footer = chrome?.footer || {};
  const nav = chrome?.navigation || {};

  const whatsappDisplay = company.whatsappDisplay || "0812-3046-9914";
  const whatsappLink = waLink(company.whatsapp);
  const addressFull = company.address || "Trenggalek, Jawa Timur";
  const email = company.email || "info@bsagrc.co.id";
  const projectsCompleted = company.projectsCompleted || 500;
  const yearsExperience = company.yearsExperience || 10;
  const footerLinks = nav.footerLinks || [];

  return (
    <footer className="relative bg-maroon-950 text-white overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-maroon-700 via-gold-400 to-maroon-700" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shadow-medium">
                <Image src={ap.logoFooter || ap.logo} alt="Logo" fill className="object-contain p-1.5" sizes="56px" />
              </div>
              <div>
                <span className="font-display font-bold text-xl leading-none">
                  {ap.brandName || "BSA"} <span className="text-gold-400">{ap.brandAccent || "GRC"}</span>
                </span>
                <p className="text-[11px] text-white/60 tracking-widest uppercase mt-1">{ap.brandTagline || "Kubah & Menara Masjid"}</p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-white/70">{footer.description}</p>

            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-xs">
                <Award className="w-4 h-4 text-gold-400" />
                <span className="font-medium">{footer.badge1 || `${yearsExperience}+ Tahun`}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span className="font-medium">{footer.badge2 || "Garansi 1 Tahun"}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-gold-400 mb-4 lg:mb-6 flex items-center gap-2">
              <span className="w-6 h-[2px] bg-gold-400" />
              {footer.servicesTitle || "Layanan Kami"}
            </h4>
            <ul className="space-y-3">
              {services.map((service: any) => (
                <li key={service.id}>
                  <Link href={`/layanan/${service.slug}`} className="text-sm text-white/70 hover:text-gold-400 hover:translate-x-1 transition-all flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gold-400 group-hover:w-2 transition-all" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-gold-400 mb-4 lg:mb-6 flex items-center gap-2">
              <span className="w-6 h-[2px] bg-gold-400" />
              {footer.navTitle || "Navigasi"}
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((item: any, idx: number) => (
                <li key={idx}>
                  <Link href={item.href} className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-gold-400 group-hover:w-2 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-gold-400 mb-4 lg:mb-6 flex items-center gap-2">
              <span className="w-6 h-[2px] bg-gold-400" />
              {footer.contactTitle || "Kontak"}
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-gold-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-400 group-hover:text-maroon-900 transition-colors">
                    <Phone className="w-4 h-4 text-gold-400 group-hover:text-maroon-900" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">WhatsApp / Telepon</p>
                    <p className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors">{whatsappDisplay}</p>
                    <p className="text-xs text-white/60">Konsultasi Gratis</p>
                  </div>
                </a>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Pabrik & Workshop</p>
                  <p className="text-sm leading-relaxed text-white/80">{addressFull}</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-white/80">{email}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-white/50 text-center md:text-left">
            © {new Date().getFullYear()} {ap.brandName || "BSA"} {ap.brandAccent || "GRC"}. • {projectsCompleted}+ proyek
          </p>
          <div className="flex items-center gap-6 text-white/50">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {footer.bottomNote || "Melayani Seluruh Indonesia"}
            </span>
            <Link href="/sitemap.xml" className="hover:text-gold-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
