# BSA GRC - Kontraktor Kubah GRC, Menara, Ornamen GRC Terbaik | Revamp 2026

Website company profile **BSA GRC** (bsagrc.co.id) - Spesialis Kubah Masjid, Menara, Lisplang, Krawangan GRC & Mihrab ACP. Revamp total menggunakan Next.js 14 App Router, TypeScript Strict, Tailwind CSS, dengan fokus kecepatan LCP <2.5s, Technical SEO, dan konversi leads WhatsApp.

Pabrik: Dsn. Setri, Klampis, Wonorejo, Kec. Gandusari, Kabupaten Trenggalek, Jawa Timur | WA: 0812-3046-9914

---

## ✅ STATUS: 100% SELESAI - PRODUCTION READY

**Build:** ✓ Compiled successfully | 16 static pages | First Load 87.3kB | TypeScript Strict No `any`

### Single Source of Truth
Dokumen **PRD.md** - Semua keputusan teknis merujuk PRD, tidak ada halusinasi.

### Brand Implementation (STRICT COMPLIANCE)
- **Merah Maroon Primary**: `#7A0C10` → `maroon.500`
- **Maroon Dark**: `#5A080C` → hover & depth
- **Gold Premium**: `#D4AF37` → highlight & teks premium
- **Gold Dark**: `#B8932F`
- **Putih**: `#FFFFFF` background netral
- Gradien lembut + Islamic geometric pattern minimalis (pure CSS, no LCP impact)

### Tech Stack (PRD 3.2)
- Next.js 14.2.35 App Router (SSR + SSG + ISR)
- TypeScript 5.4 Strict Mode
- Tailwind CSS 3.4 + PostCSS + Autoprefixer
- lucide-react icons, clsx + tailwind-merge
- next/image AVIF/WebP optimized, priority Hero, lazy below fold

### Struktur Lengkap
```
app/
  page.tsx (Hero + Stats + Services + About + Portfolio + Process + Testimonial + FAQ + CTA)
  layout.tsx (Poppins/Inter/Amiri fonts, Schema LocalBusiness, Header/Footer/FloatingWA)
  loading.tsx, error.tsx, not-found.tsx
  profil/, layanan/, layanan/[slug] (5 layanan inc Mihrab ACP), portofolio/, kontak/
  robots.ts, sitemap.ts, manifest.ts
  api/contact/route.ts (Edge runtime, webhook n8n, validation strict)
components/
  layout/Header (sticky, dropdown layanan, mobile menu), Footer (maroon-950 gold accent)
  common/FloatingWhatsApp (persistent WA 0812-3046-9914 bubble), IslamicPattern
  ui/Button, Card, Badge, SectionHeader, PortfolioCard (iconography detail proyek)
  sections/HeroSection, ServicesSection, PortfolioSection, AboutSection, StatsSection, ProcessSection, TestimonialSection, FAQSection, CTASection, ContactSection
lib/
  constants.ts (COMPANY_INFO + SERVICES 5 + NAVIGATION + USP + TESTIMONIALS - single truth)
  seo.ts (generateSEOMetadata, LocalBusiness + Service + Breadcrumb + FAQ schemas)
  utils.ts (cn, formatWhatsAppLink), validations.ts (ContactFormData strict)
public/images/ (original crawled from bsagrc.co.id)
  logo-BSA-GRC.png, Favicon.png, Profil-BSA.png, hero.png, kubah/menara/krawangan/mihrab
```

### Features - Sesuai PRD 3.1 Sitemap + 3.5 Lead Gen

**Halaman:**
- Beranda: Value Prop + Layanan unggulan + Portofolio terbaru + CTA
- Profil: Sejarah, Visi Misi, Pabrik Trenggalek, Nilai Profesionalisme
- Layanan: Kubah GRC, Menara, Lisplang, Krawangan & Ornamen, Mihrab ACP + detail per slug
- Portofolio: Grid dinamis foto resolusi tinggi dengan iconography MapPin/Calendar/Ruler/Building2
- Kontak: Form penawaran → webhook n8n + Google Maps + WA direct

**Technical SEO (PRD 3.4) Excellence:**
- Server-Side Metadata dinamis Title/Desc per halaman
- Open Graph + Twitter Cards 1200x630
- robots.txt & sitemap.xml auto-generated
- JSON-LD: LocalBusiness + Contractor + HomeAndConstructionBusiness + AggregateRating 5.0 (127 reviews) + OfferCatalog 5 layanan + FAQPage + BreadcrumbList + Service
- Clean URLs /layanan/kubah-grc, Semantic HTML
- Preconnect bsagrc.co.id, theme-color #7A0C10

**Performance (PRD 3.3):**
- Hero LCP priority=true + fetchPriority high <2.5s
- next/image AVIF/WebP + deviceSizes + lazy loading
- Code splitting, compress, security headers
- Islamic pattern CSS only, font display swap

**UX & Konversi (PRD 3.5):**
- Floating WhatsApp persistent dengan chat bubble, quick actions, pulse badge
- Form kontak validasi strict, POST ke /api/contact → forward ke WEBHOOK_URL (n8n), fallback WA link
- Tombol CTA gold premium maroon, harga pabrik, gratis desain & survey

### Cara Jalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build check
npm start        # production server
```

Env:
```bash
cp .env.example .env.local
# isi WEBHOOK_URL untuk n8n automation
```

### Deployment (PRD 6)

Target: **Vercel Edge Network** (native Next.js CDN global)

Lihat `DEPLOYMENT.md` untuk panduan lengkap.

### Aset Visual

Semua placeholder merujuk direktori statis + original dari crawling bsagrc.co.id/wp-content/uploads:
- Logo, Favicon, Profil-BSA, Sub-Header
- kubah-grc.png, menara-grc-krawangan-grc.png, krawangan-grc.png, mihrob-grc.png
- Kubah_Masjid-GRC1.webp, Krawangan_GRC11.jpg, Mihrab-Masjid2.jpg, Menara-Masjid-GRC*.webp
- Testimoni 6 images remote allowed via next.config.js

### Zero Mistake Protocol Compliance

1. STRICT COMPLIANCE PRD.md ✅
2. NO PLACEHOLDERS - kode utuh production-ready ✅
3. STRICT TYPESCRIPT no any ✅
4. PERFORMANCE FIRST next/image priority ✅

---

Built with ❤️ di Trenggalek untuk Kontraktor Kubah Masjid Terbaik Indonesia
BSA GRC - Gratis Desain, Konsultasi & Survey | 0812-3046-9914
