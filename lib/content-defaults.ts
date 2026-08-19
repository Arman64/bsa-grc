/**
 * BSA GRC - Content Defaults (Single Source of Truth for editable content)
 *
 * Every string/image shown on the public site has a default here.
 * The admin edits these values (stored in Neon `bsa_page_settings` / `bsa_settings`),
 * and the public components read `defaults deep-merged with DB`. So the site is
 * always fully rendered (defaults) AND fully editable (admin overrides).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export const LOGO_MAIN = "https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC.png";
export const LOGO_FOOTER = "https://bsagrc.co.id/wp-content/uploads/2023/10/logo-BSA-GRC-F.png";
export const FAVICON = "https://bsagrc.co.id/wp-content/uploads/2023/10/Favicon.png";

/* ============================ HOMEPAGE (beranda) ============================ */
export const HOME_DEFAULT = {
  hero: {
    badges: ["10+ Tahun Pengalaman", "Melayani Seluruh Indonesia", "Pabrik Trenggalek"],
    titleLine1: "Kontraktor",
    titleLine2: "Kubah GRC, Menara",
    titleLine3: "& Ornamen GRC",
    titleHighlight: "Terbaik",
    description:
      "BSA GRC spesialis kubah masjid, menara, & ornamen GRC berpengalaman lebih dari 10 tahun. Produksi detil sesuai keinginan customer dengan tenaga professional. Produksi pabrik profesional di Trenggalek dengan 500+ proyek selesai di seluruh Indonesia. Gratis desain, konsultasi & survey.",
    usp: [
      { title: "Tahan Lama", description: "Proses produksi & campuran bahan tepat, ketahanan lama" },
      { title: "Harga Terjangkau", description: "Hemat budget pengadaan kubah masjid kualitas terbaik" },
      { title: "Desain Kustom", description: "Motif & warna dapat dikustom sesuai keinginan" },
      { title: "Tahan Cuaca", description: "Pelapis anti bocor tepat, tahan cuaca ekstrim" },
    ],
    primaryCta: "Konsultasi Gratis Sekarang",
    secondaryCta: "Lihat Portofolio",
    image: "https://bsagrc.co.id/wp-content/uploads/2023/11/kubah-grc-menara-grc-krawangan-grc.png",
    trustText: "Gratis Desain & Survey",
    locationText: "Trenggalek, Jatim • Respon <5 Menit",
    statLabel: "Proyek Selesai",
    statSub: "Seluruh Indonesia • Sejak 2014",
    ratingText: "5.0 (127 ulasan)",
    floatBadge1: "Garansi 1 Tahun",
    floatBadge2: "Tahan Cuaca Ekstrim",
  },
  stats: {
    items: [
      { value: "500+", label: "Proyek Selesai", sublabel: "Sejak 2014" },
      { value: "10+", label: "Tahun Pengalaman", sublabel: "Tenaga Profesional" },
      { value: "100%", label: "Kepuasan Klien", sublabel: "Garansi 1 Tahun" },
      { value: "34", label: "Provinsi", sublabel: "Layanan Nasional" },
    ],
  },
  servicesHeader: {
    badge: "Layanan Utama",
    title: "Spesialis Kubah, Menara & Ornamen GRC",
    description: "Fokus produksi GRC dengan detil presisi, harga terjangkau, pelayanan nasional. Termasuk Mihrab ACP premium.",
  },
  servicesCta: {
    title: "Butuh Konsultasi Gratis?",
    description: "Gratis jasa Desain, Konsultasi & Survey lokasi Kubah Masjid, Menara, Ornamen GRC di seluruh Indonesia.",
    bullets: ["Gratis Desain 3D Custom", "Survey Lokasi Nasional", "Garansi Kebocoran 1 Tahun", "Harga Pabrik Langsung"],
    buttonLabel: "Konsultasi WhatsApp",
    note: "Respon < 5 Menit • Senin - Sabtu 08:00-17:00 WIB",
  },
  about: {
    badge: "Profil Perusahaan",
    titleHighlight: "BSA GRC",
    titleRest: "10+ Tahun Profesional",
    description:
      "BSA GRC bergerak khusus industri pembuatan & pemasangan produk GRC (Glassfibre Reinforced Cement) yang sudah berpengalaman lebih dari 10 tahun dan dapat diandalkan dibidangnya.",
    whyTitle: "Kenapa Pilih BSA GRC?",
    benefits: [
      "Proses produksi & campuran bahan tepat - ketahanan lama",
      "Motif & warna dapat dikustom sesuai kultur daerah",
      "Rangka Kremona paling kuat untuk menara & kubah",
      "Finishing cat eksterior mudah perawatan & cat ulang",
      "Pemasangan rapi, presisi & cepat",
      "Gratis jasa desain, konsultasi & survey lokasi",
    ],
    image: "https://bsagrc.co.id/wp-content/uploads/2023/10/Profil-BSA.png",
    factoryTitle: "Pabrik & Workshop BSA GRC",
    factoryTag: "Lokasi strategis, akses mudah, pengiriman nasional",
    achievements: [
      { value: "Trenggalek", label: "Pabrik Sendiri", desc: "Produksi langsung" },
      { value: "20+ Prof", label: "Tenaga Ahli", desc: "Berpengalaman" },
      { value: "1 Tahun", label: "Garansi", desc: "Kebocoran" },
      { value: "GRC Premium", label: "Bahan", desc: "SNI Quality" },
    ],
    ctaPrimary: "Baca Profil Lengkap",
    ctaSecondary: "Lihat Lokasi Pabrik",
  },
  portfolioHeader: {
    badge: "500+ Proyek Selesai",
    title: "Portofolio Proyek Nyata di Seluruh Indonesia",
    description: "Dokumentasi pengerjaan kubah, menara, krawangan & mihrab ACP presisi. Dari Trenggalek untuk 34 provinsi.",
    statLeft: "34 Provinsi",
    statRight: "500+ Klien Masjid",
    buttonLabel: "Lihat Semua Portofolio",
  },
  process: {
    badge: "Alur Pengerjaan",
    title: "5 Langkah Mudah Pemesanan",
    description: "Proses transparan dari konsultasi hingga serah terima. Gratis desain & survey nasional, harga pabrik langsung.",
    steps: [
      { number: "01", title: "Konsultasi Gratis via WhatsApp", desc: "Chat kebutuhan kubah/menara/lisplang/krawangan/mihrab ACP. Tim respons <5 menit, Senin-Sabtu 08:00-17:00 WIB." },
      { number: "02", title: "Desain 3D Custom Gratis", desc: "Tim desainer BSA GRC buatkan desain 3D sesuai kultur daerah, model bawang/setengah bola/nanas/Nabawi/kustom." },
      { number: "03", title: "Survey & Ukur Lokasi Gratis", desc: "Tim survey dari pabrik Trenggalek ke lokasi proyek seluruh Indonesia. Ukur presisi, cek struktur bangunan masjid." },
      { number: "04", title: "Produksi di Pabrik Trenggalek", desc: "Produksi GRC di pabrik Dsn. Setri Klampis Wonorejo Gandusari. Campuran bahan tepat, cetakan presisi, quality control ketat." },
      { number: "05", title: "Pengiriman & Pemasangan Rapi", desc: "Pengerjaan cepat, kuat, ringan, awet, rapi & presisi. Rangka Kremona paling kokoh, anti bocor membran bakar, garansi 1 tahun." },
    ],
  },
  testimonialsHeader: {
    badge: "Testimoni Klien",
    title: "Dipercaya Ratusan Panitia Masjid",
    description: "Testimoni nyata dari panitia pembangunan masjid di seluruh Indonesia yang telah menggunakan jasa BSA GRC.",
  },
  faqHeader: {
    badge: "FAQ",
    title: "Pertanyaan yang Sering Ditanyakan",
    description: "Berikut penjelasan pertanyaan yang sering ditanyakan calon mitra BSA GRC.",
    helpTitle: "Masih ada pertanyaan?",
    helpText: "Tim profesional kami siap bantu konsultasi gratis desain & estimasi harga kubah masjid.",
    helpButton: "Chat WhatsApp",
  },
  cta: {
    badge: "Gratis Jasa Desain, Konsultasi & Survey",
    title: "Siap Membangun Kubah Masjid Impian?",
    subtitle: "Konsultasi gratis sekarang. Tim BSA GRC dari pabrik Trenggalek siap survey lokasi di seluruh Indonesia & buatkan desain 3D custom budaya lokal.",
    bullets: ["Desain 3D Gratis", "Survey Nasional", "Harga Pabrik", "Garansi 1 Tahun"],
    primaryLabel: "Hubungi",
    secondaryLabel: "Form Penawaran",
    steps: [
      { step: "01", title: "Konsultasi WA", desc: "Chat kebutuhan kubah/menara" },
      { step: "02", title: "Desain 3D Gratis", desc: "Tim buatkan desain custom" },
      { step: "03", title: "Survey Lokasi", desc: "Gratis survey & ukur lokasi" },
      { step: "04", title: "Produksi & Pasang", desc: "Pengerjaan cepat, presisi, rapi" },
    ],
  },
};

/* ============================ PROFIL ============================ */
export const PROFIL_DEFAULT = {
  hero: {
    badge: "Tentang Kami",
    titleHighlight: "BSA GRC",
    titleRest: "Kontraktor Profesional",
    description: "Spesialis Kubah Masjid, Menara, & Ornamen GRC berpengalaman lebih dari 10 tahun. Pabrik di Trenggalek, melayani 500+ proyek di seluruh Indonesia.",
    image: "https://bsagrc.co.id/wp-content/uploads/2023/10/Profil-BSA.png",
  },
  visi: {
    title: "Visi",
    description: "Menjadi kontraktor kubah & ornamen masjid GRC terpercaya nomor 1 di Indonesia dengan kualitas terbaik, harga terjangkau, dan pelayanan nasional hingga pelosok.",
  },
  misi: {
    title: "Misi",
    points: [
      "Memberikan produk GRC kualitas tinggi, tahan lama, ringan, awet, rapi & presisi",
      "Gratis jasa desain, konsultasi & survey lokasi seluruh Indonesia",
      "Melayani dengan harga pabrik langsung - transparan",
      "Menjaga kepuasan panitia masjid & institusi dengan garansi",
    ],
  },
  nilai: {
    title: "Nilai Profesionalisme BSA GRC",
    points: [
      { title: "Cepat", desc: "Pengerjaan cepat tanpa mengorbankan presisi & kerapian." },
      { title: "Kuat & Ringan", desc: "Bahan GRC kualitas SNI, rangka Kremona kokoh." },
      { title: "Awet & Tahan Cuaca", desc: "Anti bocor dengan pelapis membran bakar berkualitas." },
      { title: "Rapi & Presisi", desc: "Detil motif sesuai keinginan customer dengan tenaga ahli." },
    ],
  },
};

/* ============================ LAYANAN ============================ */
export const LAYANAN_DEFAULT = {
  hero: {
    badge: "5 Spesialisasi Utama",
    title: "Layanan BSA GRC - Solusi Lengkap Masjid",
    description: "Dari pabrik Trenggalek untuk seluruh Indonesia: kubah, menara, lisplang, krawangan GRC & mihrab ACP premium finishing gold.",
  },
};

/* ============================ PORTOFOLIO ============================ */
export const PORTOFOLIO_DEFAULT = {
  hero: {
    badge: "Proyek Nyata",
    title: "Portofolio Proyek Nyata BSA GRC",
    description: "Galeri lengkap dokumentasi kubah, menara, krawangan & mihrab ACP. Setiap kartu ada detail lokasi, tahun, diameter, material - klik untuk detail proyek.",
  },
  filter: {
    categories: ["Semua", "Kubah GRC", "Menara GRC", "Krawangan", "Mihrab ACP"],
  },
};

/* ============================ KONTAK ============================ */
export const KONTAK_DEFAULT = {
  info: {
    badge: "Gratis Konsultasi & Survey",
    title: "Hubungi Tim BSA GRC Sekarang",
    description: "Tim BSA GRC siap membantu proyek masjid Anda di seluruh Indonesia. Konsultasi desain kustom, estimasi harga, dan survey lokasi gratis. Respon <5 menit.",
    workingHours: "Senin - Sabtu 08:00-17:00",
  },
  form: {
    title: "Form Penawaran Proyek",
    subtitle: "Isi form, tim kami akan hubungi via WhatsApp. Data aman & tidak spam.",
  },
};

/* ============================ BLOG ============================ */
export const BLOG_DEFAULT = {
  hero: {
    badge: "Artikel",
    title: "Blog & Panduan Kubah Masjid",
    description:
      "Artikel SEO friendly dari tim BSA GRC: tips memilih kubah, harga terbaru, perbandingan bahan, panduan perawatan. Update langsung dari pabrik Trenggalek untuk panitia masjid seluruh Indonesia.",
    categories: ["Semua", "Panduan Kubah", "Harga & Biaya", "Edukasi & Material", "Portofolio", "Tips Perawatan"],
  },
  cta: {
    title: "Butuh Konsultasi Gratis Setelah Baca Artikel?",
    subtitle: "Tim BSA GRC siap bantu pilih model kubah, hitung harga per meter, dan buatkan desain 3D custom gratis. Chat WA sekarang respon <5 menit.",
    primaryLabel: "Konsultasi WA Gratis",
    secondaryLabel: "Form Penawaran",
  },
};

export const PAGE_DEFAULTS: Record<string, { title: string; description: string; sections: any }> = {
  beranda: { title: "Beranda - BSA GRC Kubah & Menara Masjid", description: "Halaman utama: hero, layanan, portofolio, testimoni, FAQ, CTA", sections: HOME_DEFAULT },
  profil: { title: "Profil Perusahaan BSA GRC", description: "Sejarah, visi, misi, nilai profesionalisme", sections: PROFIL_DEFAULT },
  layanan: { title: "Layanan BSA GRC", description: "5 layanan: kubah, menara, lisplang, krawangan, mihrab ACP", sections: LAYANAN_DEFAULT },
  portofolio: { title: "Portofolio Proyek BSA GRC", description: "Galeri proyek nyata di seluruh Indonesia", sections: PORTOFOLIO_DEFAULT },
  kontak: { title: "Kontak BSA GRC", description: "Form penawaran, kontak, maps lokasi pabrik", sections: KONTAK_DEFAULT },
  blog: { title: "Blog & Artikel Kubah Masjid", description: "Artikel SEO kubah masjid", sections: BLOG_DEFAULT },
};

export const PAGE_ORDER = ["beranda", "profil", "layanan", "portofolio", "kontak", "blog"];

/* ============================ APPEARANCE (Tampilan) ============================ */
export const APPEARANCE_DEFAULT = {
  logo: LOGO_MAIN,
  logoFooter: LOGO_FOOTER,
  favicon: FAVICON,
  brandName: "BSA",
  brandAccent: "GRC",
  brandTagline: "Kubah & Menara Masjid",
  themeColor: "#7A0C10",
  topbarLeft: "Gandusari, Trenggalek",
  topbarRight: "Pengalaman 10+ Tahun • 500+ Proyek Selesai",
  showTopbar: true,
};

/* ============================ NAVIGATION (Menu) ============================ */
export const NAVIGATION_DEFAULT = {
  header: [
    { label: "Beranda", href: "/" },
    { label: "Profil", href: "/profil" },
    { label: "Layanan", href: "/layanan", isServices: true },
    { label: "Portofolio", href: "/portofolio" },
    { label: "Blog", href: "/blog" },
    { label: "Kontak", href: "/kontak" },
  ],
  footerLinks: [
    { label: "Beranda", href: "/" },
    { label: "Profil", href: "/profil" },
    { label: "Portofolio", href: "/portofolio" },
    { label: "Blog", href: "/blog" },
    { label: "Kontak", href: "/kontak" },
    { label: "Semua Layanan", href: "/layanan" },
  ],
  ctaLabel: "Konsultasi Gratis",
};

/* ============================ FOOTER ============================ */
export const FOOTER_DEFAULT = {
  description: "Spesialis Kubah Masjid, Menara, & Ornamen GRC berpengalaman lebih dari 10 tahun.",
  badge1: "10+ Tahun",
  badge2: "Garansi 1 Tahun",
  servicesTitle: "Layanan Kami",
  navTitle: "Navigasi",
  contactTitle: "Kontak",
  bottomNote: "Melayani Seluruh Indonesia",
};

/* ============================ INTEGRATIONS ============================ */
export const INTEGRATIONS_DEFAULT = {
  webhookUrl: "",
  gaId: "",
  metaPixelId: "",
  headScripts: "",
  bodyScripts: "",
};

/* ============================ LABELS (Indonesian, for the editor) ============================ */
export const SECTION_LABELS: Record<string, string> = {
  hero: "Hero (Bagian Atas)",
  stats: "Statistik Angka",
  servicesHeader: "Judul Bagian Layanan",
  servicesCta: "Kartu CTA Layanan",
  about: "Tentang / Profil Singkat",
  portfolioHeader: "Judul Bagian Portofolio",
  process: "Alur Pengerjaan",
  testimonialsHeader: "Judul Bagian Testimoni",
  faqHeader: "Judul Bagian FAQ",
  cta: "Ajakan (CTA Bawah)",
  visi: "Visi",
  misi: "Misi",
  nilai: "Nilai Profesionalisme",
  info: "Info Kontak (Judul)",
  form: "Form Penawaran",
  filter: "Filter Kategori",
};

export const FIELD_LABELS: Record<string, string> = {
  badge: "Badge / Label",
  badges: "Badge (daftar)",
  title: "Judul",
  titleLine1: "Judul Baris 1",
  titleLine2: "Judul Baris 2",
  titleLine3: "Judul Baris 3",
  titleHighlight: "Judul (kata di-highlight)",
  titleRest: "Judul (lanjutan)",
  description: "Deskripsi",
  subtitle: "Sub Judul",
  usp: "Keunggulan (USP)",
  primaryCta: "Tombol Utama",
  secondaryCta: "Tombol Kedua",
  primaryLabel: "Tombol Utama",
  secondaryLabel: "Tombol Kedua",
  buttonLabel: "Teks Tombol",
  image: "Gambar",
  trustText: "Teks Trust",
  locationText: "Teks Lokasi",
  statLabel: "Label Statistik",
  statSub: "Sub Statistik",
  ratingText: "Teks Rating",
  floatBadge1: "Badge Melayang 1",
  floatBadge2: "Badge Melayang 2",
  items: "Item",
  value: "Nilai",
  label: "Label",
  sublabel: "Sub Label",
  bullets: "Poin (daftar)",
  note: "Catatan",
  whyTitle: "Judul 'Kenapa Pilih'",
  benefits: "Keunggulan (daftar)",
  factoryTitle: "Judul Pabrik",
  factoryTag: "Tag Pabrik",
  achievements: "Pencapaian",
  ctaPrimary: "Tombol Utama",
  ctaSecondary: "Tombol Kedua",
  statLeft: "Statistik Kiri",
  statRight: "Statistik Kanan",
  steps: "Langkah",
  step: "No. Langkah",
  number: "Nomor",
  desc: "Deskripsi",
  helpTitle: "Judul Bantuan",
  helpText: "Teks Bantuan",
  helpButton: "Tombol Bantuan",
  points: "Poin",
  categories: "Kategori",
  workingHours: "Jam Kerja",
};

export function labelFor(key: string): string {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  if (SECTION_LABELS[key]) return SECTION_LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

/* Deep merge: base defaults overlaid by db values (db wins where present) */
export function deepMerge<T = any>(base: any, override: any): T {
  if (override === null || override === undefined) return base;
  if (Array.isArray(base) || Array.isArray(override)) {
    // Arrays: DB value wins entirely (so admin can add/remove items)
    return (override ?? base) as T;
  }
  if (typeof base === "object" && typeof override === "object") {
    const out: any = { ...base };
    for (const k of Object.keys(override)) {
      out[k] = k in base ? deepMerge(base[k], override[k]) : override[k];
    }
    return out as T;
  }
  return (override ?? base) as T;
}
