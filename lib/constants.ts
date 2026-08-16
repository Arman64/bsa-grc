/**
 * BSA GRC - Constants
 * Single Source of Truth for Company Data
 * STRICT COMPLIANCE WITH PRD.md
 */

export const COMPANY_INFO = {
  name: "BSA GRC",
  fullName: "BSA Glassfibre Reinforced Concrete",
  tagline: "Kontraktor Kubah GRC, Menara GRC, Ornamen GRC Kualitas Terbaik",
  description: "Spesialis Kubah Masjid, Menara, & Ornamen GRC berpengalaman lebih dari 10 tahun. Produksi detil sesuai keinginan customer dengan tenaga professional.",
  website: "https://bsagrc.co.id",
  url: "https://bsagrc.co.id",

  contact: {
    whatsapp: "6281230469914",
    whatsappDisplay: "0812-3046-9914",
    whatsappLink: "https://api.whatsapp.com/send?phone=6281230469914",
    phone: "081230469914",
    email: "info@bsagrc.co.id",
  },

  address: {
    full: "Dsn. Setri, Klampis, Wonorejo, Kec. Gandusari, Kabupaten Trenggalek, Jawa Timur",
    street: "Dsn. Setri, Klampis",
    village: "Wonorejo",
    district: "Gandusari",
    regency: "Trenggalek",
    province: "Jawa Timur",
    country: "Indonesia",
    postalCode: "66391",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.1!2d111.7!3d-8.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMDYnMDAuMCJTIDExMcKwNDInMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890",
  },

  social: {
    whatsapp: "https://api.whatsapp.com/send?phone=6281230469914",
    instagram: "https://instagram.com/bsagrc",
    facebook: "https://facebook.com/bsagrc",
    youtube: "https://youtube.com/@bsagrc",
  },

  yearsExperience: 10,
  projectsCompleted: 500,
} as const;

export const BRAND_COLORS = {
  maroon: {
    primary: "#7A0C10",
    dark: "#5A080C",
    light: "#fce7e7",
    50: "#fdf2f2",
    500: "#7A0C10",
    700: "#5A080C",
  },
  gold: {
    primary: "#D4AF37",
    premium: "#C8A951",
    dark: "#B8932F",
    light: "#fdf9e8",
  },
  white: "#FFFFFF",
} as const;

export const SERVICES = [
  {
    id: "kubah-grc",
    slug: "kubah-grc",
    title: "Kubah Masjid GRC",
    shortTitle: "Kubah GRC",
    description: "Kubah masjid berbahan GRC kualitas terbaik, tahan lama, ringan, dengan desain custom sesuai budaya lokal.",
    longDescription: "Kami memproduksi kubah masjid GRC dengan ketebalan 3cm pada frame dan 8mm pada panel, finishing cat eksterior mudah perawatan. Tersedia model setengah bola, bawang, nanas, Nabawi, dan custom.",
    features: ["Tahan Lama & Cuaca Ekstrim", "Desain Custom Khas Daerah", "Ringan & Kuat", "Finishing Cat Ulang Mudah", "Garansi Kebocoran 1 Tahun"],
    image: "/images/services/kubah-grc.avif",
    originalImage: "https://bsagrc.co.id/wp-content/uploads/2023/10/kubah-grc.png",
    icon: "Dome",
    priceRange: "Rp 1.000.000 - 2.500.000 /m²",
  },
  {
    id: "menara",
    slug: "menara",
    title: "Menara Masjid GRC",
    shortTitle: "Menara GRC",
    description: "Pembangunan menara masjid GRC di seluruh Indonesia, kokoh, presisi, dan estetika tinggi.",
    longDescription: "Menara masjid GRC dikerjakan dengan rangka Kremona paling kuat, menggunakan pipa besi galvanis. Melayani seluruh wilayah Indonesia termasuk luar Pulau Jawa.",
    features: ["Rangka Kremona Kokoh", "Tahan Gempa & Angin", "Desain Menjulang Elegan", "Pengerjaan Cepat & Presisi", "Layanan Nasional"],
    image: "/images/services/menara-grc.avif",
    originalImage: "https://bsagrc.co.id/wp-content/uploads/2023/10/menara-grc-krawangan-grc.png",
    icon: "Tower",
    priceRange: "Custom Sesuai Desain",
  },
  {
    id: "lisplang",
    slug: "lisplang",
    title: "Lisplang GRC",
    shortTitle: "Lisplang GRC",
    description: "Lisplang GRC mempercantik tepi atap masjid dengan ornamen detil dan tahan cuaca.",
    longDescription: "Lisplang GRC produksi pabrik Trenggalek dengan cetakan presisi, pemasangan rapi dan cepat.",
    features: ["Detil Presisi", "Motif Custom", "Tahan Lama", "Pemasangan Rapi"],
    image: "/images/services/kubah-grc.avif",
    originalImage: "https://bsagrc.co.id/wp-content/uploads/2023/10/kubah-grc.png",
    icon: "Layout",
    priceRange: "Custom Sesuai Ukuran",
  },
  {
    id: "krawangan",
    slug: "krawangan",
    title: "Krawangan & Ornamen GRC",
    shortTitle: "Krawangan GRC",
    description: "Ornamen krawangan GRC wajib untuk memperindah masjid, solusi keindahan arsitektur Islami.",
    longDescription: "Krawangan GRC dengan pola geometris Islam minimalis, membuat masjid semakin indah dan elegan.",
    features: ["Pola Geometris Islam", "Memperindah Masjid", "Ventilasi & Estetika", "Bahan GRC Premium"],
    image: "/images/services/krawangan-grc.avif",
    originalImage: "https://bsagrc.co.id/wp-content/uploads/2023/10/krawangan-grc.png",
    icon: "Grid3x3",
    priceRange: "Custom Sesuai Motif",
  },
  {
    id: "mihrab-acp",
    slug: "mihrab-acp",
    title: "Mihrab ACP",
    shortTitle: "Mihrab ACP",
    description: "Dekorasi interior dinding imaman / Mihrab masjid dengan Aluminium Composite Panel elegan.",
    longDescription: "Mihrab ACP menjadi daya tarik tersendiri untuk musholla & masjid, tampil elegan dengan finishing premium.",
    features: ["Desain Elegan Premium", "Bahan ACP Berkualitas", "Custom Kaligrafi", "Tahan Lama & Mudah Perawatan", "Finishing Gold Premium"],
    image: "/images/services/mihrab-acp.avif",
    originalImage: "https://bsagrc.co.id/wp-content/uploads/2023/10/mihrob-grc.png",
    icon: "Frame",
    priceRange: "Custom Sesuai Desain",
  },
] as const;

export type ServiceId = typeof SERVICES[number]["id"];

export interface NavChild {
  label: string;
  href: string;
  id: string;
}

export interface NavItem {
  label: string;
  href: string;
  id: string;
  children?: NavChild[];
}

export const NAVIGATION: NavItem[] = [
  { label: "Beranda", href: "/", id: "home" },
  { label: "Profil", href: "/profil", id: "profil" },
  {
    label: "Layanan",
    href: "/layanan",
    id: "layanan",
    children: SERVICES.map((s) => ({ label: s.title, href: `/layanan/${s.slug}`, id: s.id })),
  },
  { label: "Portofolio", href: "/portofolio", id: "portofolio" },
  { label: "Blog", href: "/blog", id: "blog" },
  { label: "Kontak", href: "/kontak", id: "kontak" },
];

export const USP = [
  { title: "Tahan Lama", description: "Proses produksi & campuran bahan tepat, ketahanan lama", icon: "ShieldCheck" },
  { title: "Harga Terjangkau", description: "Hemat budget pengadaan kubah masjid kualitas terbaik", icon: "BadgeDollarSign" },
  { title: "Desain Kustom", description: "Motif & warna dapat dikustom sesuai keinginan", icon: "Palette" },
  { title: "Tahan Cuaca", description: "Pelapis anti bocor tepat, tahan cuaca ekstrim", icon: "CloudSun" },
] as const;

export const TESTIMONIALS = [
  { id: 1, image: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-1-scaled.jpg", alt: "Testimoni BSA GRC 1" },
  { id: 2, image: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-2.jpg", alt: "Testimoni BSA GRC 2" },
  { id: 3, image: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-3.jpg", alt: "Testimoni BSA GRC 3" },
  { id: 4, image: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-4.jpg", alt: "Testimoni BSA GRC 4" },
  { id: 5, image: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-5.jpg", alt: "Testimoni BSA GRC 5" },
  { id: 6, image: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-6.jpg", alt: "Testimoni BSA GRC 6" },
] as const;

export const PORTFOLIO_CATEGORIES = ["Semua", "Kubah GRC", "Menara GRC", "Krawangan", "Mihrab ACP"] as const;

export type PortfolioCategory = typeof PORTFOLIO_CATEGORIES[number];
