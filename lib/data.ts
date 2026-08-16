import { db, isDbEnabled } from "./db";
import { portfolios, services, settings, blogs } from "./schema";
import { eq, desc } from "drizzle-orm";

// Types - Keep same as before for compatibility
export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  images?: string[];
  diameter?: string;
  height?: string;
  material?: string;
  client?: string;
  description?: string;
  slug?: string;
}

export interface LandingPageData {
  headline: string;
  subHeadline: string;
  badge?: string;
  heroImage: string;
  heroVideoUrl?: string;
  heroImages?: string[];
  valueProps: { title: string; description: string }[];
  benefits?: { icon?: string; title: string; desc: string }[];
  socialProof: {
    rating: string;
    reviews: string;
    projects: string;
    provinces: string;
    testimonials: {
      name: string;
      location: string;
      role: string;
      text: string;
      result: string;
      photo?: string;
    }[];
    clientLogos?: string[];
  };
  ctaPrimary: string;
  ctaSecondary?: string;
  ctaSubtext?: string;
  guarantees: string[];
  painPoints?: { pain: string; solution: string }[];
  faqs?: { q: string; a: string }[];
  priceNote?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  features: string[];
  image: string;
  originalImage: string;
  icon: string;
  priceRange: string;
  isActive: boolean;
  landingPage?: LandingPageData;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  isPublished: boolean;
  views: number;
  readingTime?: number;
}

export interface TestimonialItem {
  id: number;
  name: string;
  location: string;
  role: string;
  text: string;
  result?: string;
  photo?: string;
  rating: number;
  category?: string;
  isActive: boolean;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  serviceSlug?: string;
  isActive: boolean;
}

export interface CompanySettings {
  company: {
    name: string;
    fullName: string;
    tagline: string;
    description: string;
    whatsapp: string;
    whatsappDisplay: string;
    phone: string;
    phoneDisplay: string;
    email: string;
    address: string;
    yearsExperience: number;
    projectsCompleted: number;
    mapLat?: number;
    mapLng?: number;
    mapZoom?: number;
    mapEmbedUrl?: string;
    mapLink?: string;
  };
  hero: {
    title: string;
    subtitle: string;
    image: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  usp: { title: string; description: string }[];
  seo: { siteUrl: string; googleVerification: string };
}

// Helper to ensure DB is available, otherwise throw with clear message for Vercel logs
function ensureDb() {
  if (!isDbEnabled || !db) {
    throw new Error(
      "DATABASE_URL tidak ditemukan. Set DATABASE_URL di ENV Vercel (Neon Postgres) untuk mode Neon. Tanpa DB, data akan kosong. Lihat DEPLOY_NEON.md"
    );
  }
  return db;
}

// ========== PORTFOLIO - Neon Only with Carousel Images ==========
export async function getPortfolioData(): Promise<PortfolioItem[]> {
  try {
    const database = ensureDb();
    const rows = await database.select().from(portfolios).orderBy(desc(portfolios.id)).execute();
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug || undefined,
      category: r.category || "Kubah GRC",
      location: r.location || "Trenggalek, Jatim",
      year: r.year || new Date().getFullYear().toString(),
      image: r.image || "",
      images: (r.images as string[]) || [],
      diameter: r.diameter || undefined,
      height: r.height || undefined,
      material: r.material || undefined,
      client: r.client || undefined,
      description: r.description || undefined,
    }));
  } catch (e) {
    console.warn("getPortfolioData DB error, fallback empty (set DATABASE_URL untuk Neon):", (e as Error).message);
    return [];
  }
}

export async function getPortfolioById(id: number): Promise<PortfolioItem | undefined> {
  const database = ensureDb();
  const rows = await database.select().from(portfolios).where(eq(portfolios.id, id)).execute();
  if (rows.length === 0) return undefined;
  const r = rows[0];
  return {
    id: r.id,
    title: r.title,
    category: r.category || "Kubah GRC",
    location: r.location || "",
    year: r.year || "",
    image: r.image || "",
    images: (r.images as string[]) || [],
    diameter: r.diameter || undefined,
    client: r.client || undefined,
    description: r.description || undefined,
  };
}

export async function createPortfolio(data: Omit<PortfolioItem, "id">): Promise<PortfolioItem> {
  const database = ensureDb();
  const [inserted] = await database
    .insert(portfolios)
    .values({
      title: data.title,
      slug: data.slug || null,
      category: data.category,
      location: data.location,
      year: data.year,
      image: data.image,
      images: (data.images as any) || [],
      diameter: data.diameter || null,
      height: data.height || null,
      material: data.material || null,
      client: data.client || null,
      description: data.description || null,
    })
    .returning()
    .execute();

  return {
    id: inserted.id,
    title: inserted.title,
    category: inserted.category || "Kubah GRC",
    location: inserted.location || "",
    year: inserted.year || "",
    image: inserted.image || "",
    images: (inserted.images as string[]) || [],
    diameter: inserted.diameter || undefined,
    client: inserted.client || undefined,
  };
}

export async function updatePortfolio(id: number, data: Partial<PortfolioItem>): Promise<PortfolioItem> {
  const database = ensureDb();
  const [updated] = await database
    .update(portfolios)
    .set({
      title: data.title,
      category: data.category,
      location: data.location,
      year: data.year,
      image: data.image,
      images: data.images as any,
      diameter: data.diameter,
      height: data.height,
      material: data.material,
      client: data.client,
      description: data.description,
    })
    .where(eq(portfolios.id, id))
    .returning()
    .execute();

  if (!updated) throw new Error("Portfolio tidak ditemukan");
  return {
    id: updated.id,
    title: updated.title,
    category: updated.category || "",
    location: updated.location || "",
    year: updated.year || "",
    image: updated.image || "",
    images: (updated.images as string[]) || [],
  };
}

export async function deletePortfolio(id: number): Promise<void> {
  const database = ensureDb();
  await database.delete(portfolios).where(eq(portfolios.id, id)).execute();
}

// ========== SERVICES - Neon Only ==========
export async function getServicesData(): Promise<ServiceItem[]> {
  try {
    const database = ensureDb();
    const rows = await database.select().from(services).execute();
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      shortTitle: r.shortTitle,
      description: r.description,
      longDescription: r.longDescription,
      features: (r.features as string[]) || [],
      image: r.image,
      originalImage: r.originalImage,
      icon: r.icon,
      priceRange: r.priceRange,
      isActive: r.isActive ?? true,
      landingPage: r.landingPage as LandingPageData | undefined,
    }));
  } catch (e) {
    console.warn("getServicesData DB error:", (e as Error).message);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | undefined> {
  try {
    const database = ensureDb();
    const rows = await database.select().from(services).where(eq(services.slug, slug)).execute();
    if (rows.length === 0) return undefined;
    const r = rows[0];
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      shortTitle: r.shortTitle,
      description: r.description,
      longDescription: r.longDescription,
      features: (r.features as string[]) || [],
      image: r.image,
      originalImage: r.originalImage,
      icon: r.icon,
      priceRange: r.priceRange,
      isActive: r.isActive ?? true,
      landingPage: r.landingPage as any,
    };
  } catch {
    return undefined;
  }
}

export async function updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
  const database = ensureDb();
  const [updated] = await database
    .update(services)
    .set({
      title: data.title,
      shortTitle: data.shortTitle,
      description: data.description,
      longDescription: data.longDescription,
      features: data.features as any,
      image: data.image,
      originalImage: data.originalImage,
      priceRange: data.priceRange,
      isActive: data.isActive,
      landingPage: data.landingPage as any,
    })
    .where(eq(services.id, id))
    .returning()
    .execute();

  if (!updated) throw new Error("Service tidak ditemukan");
  return {
    id: updated.id,
    slug: updated.slug,
    title: updated.title,
    shortTitle: updated.shortTitle,
    description: updated.description,
    longDescription: updated.longDescription,
    features: (updated.features as string[]) || [],
    image: updated.image,
    originalImage: updated.originalImage,
    icon: updated.icon,
    priceRange: updated.priceRange,
    isActive: updated.isActive ?? true,
    landingPage: updated.landingPage as any,
  };
}

// ========== SETTINGS - Neon Only (single row) ==========
export async function getSettingsData(): Promise<CompanySettings> {
  try {
    const database = ensureDb();
    const rows = await database.select().from(settings).limit(1).execute();
    if (rows.length === 0) throw new Error("Settings not found");
    const row = rows[0] as any;
    const data = {
      company: row.company,
      hero: row.hero,
      usp: row.usp || [],
      seo: row.seo || { siteUrl: "https://bsagrc.co.id", googleVerification: "" },
    } as CompanySettings;
    if (!data.company.phoneDisplay) data.company.phoneDisplay = data.company.phone || data.company.whatsappDisplay;
    if (!data.company.phone) data.company.phone = data.company.whatsapp?.replace(/^62/, "0") || "081230469914";
    return data;
  } catch (e) {
    console.warn("getSettingsData DB error, fallback default:", (e as Error).message);
    // Fallback default agar build tidak crash di Vercel tanpa DB (tapi data kosong)
    return {
      company: {
        name: "BSA GRC",
        fullName: "BSA GRC",
        tagline: "Kontraktor Kubah GRC Terbaik",
        description: "Spesialis Kubah Masjid",
        whatsapp: "6281230469914",
        whatsappDisplay: "0812-3046-9914",
        phone: "081230469914",
        phoneDisplay: "0812-3046-9914",
        email: "info@bsagrc.co.id",
        address: "Trenggalek, Jatim",
        yearsExperience: 10,
        projectsCompleted: 500,
      },
      hero: {
        title: "Kontraktor Kubah GRC Terbaik",
        subtitle: "Spesialis kubah masjid",
        image: "/images/services/hero.avif",
        ctaPrimary: "Konsultasi Gratis",
        ctaSecondary: "Portofolio",
      },
      usp: [],
      seo: { siteUrl: "https://bsagrc.co.id", googleVerification: "" },
    };
  }
}

export async function saveSettingsData(data: CompanySettings): Promise<boolean> {
  try {
    const database = ensureDb();
    const existing = await database.select().from(settings).limit(1).execute();
    if (existing.length > 0) {
      await database.update(settings).set({ company: data.company, hero: data.hero, usp: data.usp, seo: data.seo }).where(eq(settings.id, existing[0].id)).execute();
    } else {
      await database.insert(settings).values({ company: data.company, hero: data.hero, usp: data.usp, seo: data.seo }).execute();
    }
    return true;
  } catch (e) {
    console.error("saveSettingsData DB error:", e);
    return false;
  }
}

// ========== BLOG - Neon Only ==========
export async function getBlogData(): Promise<BlogPost[]> {
  try {
    const database = ensureDb();
    const rows = await database.select().from(blogs).orderBy(desc(blogs.publishedAt)).execute();
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      content: r.content,
      coverImage: r.coverImage,
      category: r.category,
      tags: (r.tags as string[]) || [],
      author: r.author,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : new Date().toISOString(),
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : new Date().toISOString(),
      seoTitle: r.seoTitle || undefined,
      seoDescription: r.seoDescription || undefined,
      keywords: (r.keywords as string[]) || [],
      isPublished: r.isPublished ?? true,
      views: r.views ?? 0,
      readingTime: r.readingTime || 5,
    }));
  } catch (e) {
    console.warn("getBlogData DB error:", (e as Error).message);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const database = ensureDb();
    const rows = await database.select().from(blogs).where(eq(blogs.slug, slug)).execute();
    if (rows.length === 0) return undefined;
    const r = rows[0];
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      content: r.content,
      coverImage: r.coverImage,
      category: r.category,
      tags: (r.tags as string[]) || [],
      author: r.author,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : new Date().toISOString(),
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : new Date().toISOString(),
      seoTitle: r.seoTitle || undefined,
      seoDescription: r.seoDescription || undefined,
      keywords: (r.keywords as string[]) || [],
      isPublished: r.isPublished ?? true,
      views: r.views ?? 0,
      readingTime: r.readingTime || 5,
    };
  } catch {
    return undefined;
  }
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const all = await getBlogData();
  return all.filter((b) => b.isPublished).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function createBlog(data: Omit<BlogPost, "id">): Promise<BlogPost> {
  const database = ensureDb();
  const [inserted] = await database
    .insert(blogs)
    .values({
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      category: data.category,
      tags: data.tags as any,
      author: data.author,
      publishedAt: new Date(data.publishedAt),
      updatedAt: new Date(data.updatedAt),
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      keywords: data.keywords as any,
      isPublished: data.isPublished,
      views: data.views,
      readingTime: data.readingTime,
    })
    .returning()
    .execute();

  return {
    id: inserted.id,
    slug: inserted.slug,
    title: inserted.title,
    excerpt: inserted.excerpt,
    content: inserted.content,
    coverImage: inserted.coverImage,
    category: inserted.category,
    tags: (inserted.tags as string[]) || [],
    author: inserted.author,
    publishedAt: inserted.publishedAt ? inserted.publishedAt.toISOString() : new Date().toISOString(),
    updatedAt: inserted.updatedAt ? inserted.updatedAt.toISOString() : new Date().toISOString(),
    seoTitle: inserted.seoTitle || undefined,
    seoDescription: inserted.seoDescription || undefined,
    keywords: (inserted.keywords as string[]) || [],
    isPublished: inserted.isPublished ?? true,
    views: inserted.views ?? 0,
    readingTime: inserted.readingTime || 5,
  };
}

export async function updateBlog(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
  const database = ensureDb();
  const [updated] = await database
    .update(blogs)
    .set({
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      category: data.category,
      tags: data.tags as any,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      keywords: data.keywords as any,
      isPublished: data.isPublished,
      updatedAt: new Date(),
    })
    .where(eq(blogs.id, id))
    .returning()
    .execute();

  if (!updated) throw new Error("Blog tidak ditemukan");
  return {
    id: updated.id,
    slug: updated.slug,
    title: updated.title,
    excerpt: updated.excerpt,
    content: updated.content,
    coverImage: updated.coverImage,
    category: updated.category,
    tags: (updated.tags as string[]) || [],
    author: updated.author,
    publishedAt: updated.publishedAt ? updated.publishedAt.toISOString() : new Date().toISOString(),
    updatedAt: updated.updatedAt ? updated.updatedAt.toISOString() : new Date().toISOString(),
    seoTitle: updated.seoTitle || undefined,
    seoDescription: updated.seoDescription || undefined,
    keywords: (updated.keywords as string[]) || [],
    isPublished: updated.isPublished ?? true,
    views: updated.views ?? 0,
    readingTime: updated.readingTime || 5,
  };
}

export async function deleteBlog(id: number): Promise<void> {
  const database = ensureDb();
  await database.delete(blogs).where(eq(blogs.id, id)).execute();
}

// ========== UTILS ==========
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// ========== TESTIMONIALS - Neon Only ==========
export async function getTestimonialsData(): Promise<TestimonialItem[]> {
  try {
    const { testimonials } = await import("./schema");
    const database = ensureDb();
    const rows = await database.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(desc(testimonials.id)).execute();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      location: r.location,
      role: r.role || "Panitia Masjid",
      text: r.text,
      result: r.result || undefined,
      photo: r.photo || undefined,
      rating: r.rating ?? 5,
      category: r.category || "Kubah GRC",
      isActive: r.isActive ?? true,
    }));
  } catch (e) {
    console.warn("getTestimonialsData DB error:", (e as Error).message);
    return [];
  }
}

export async function getAllTestimonials(): Promise<TestimonialItem[]> {
  try {
    const { testimonials } = await import("./schema");
    const database = ensureDb();
    const rows = await database.select().from(testimonials).orderBy(desc(testimonials.id)).execute();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      location: r.location,
      role: r.role || "Panitia Masjid",
      text: r.text,
      result: r.result || undefined,
      photo: r.photo || undefined,
      rating: r.rating ?? 5,
      category: r.category || "Kubah GRC",
      isActive: r.isActive ?? true,
    }));
  } catch (e) {
    console.warn("getAllTestimonials DB error:", (e as Error).message);
    return [];
  }
}

export async function createTestimonial(data: Omit<TestimonialItem, "id">): Promise<TestimonialItem> {
  const { testimonials } = await import("./schema");
  const database = ensureDb();
  const [inserted] = await database.insert(testimonials).values({
    name: data.name,
    location: data.location,
    role: data.role,
    text: data.text,
    result: data.result || null,
    photo: data.photo || null,
    rating: data.rating,
    category: data.category || "Kubah GRC",
    isActive: data.isActive,
  }).returning().execute();

  return {
    id: inserted.id,
    name: inserted.name,
    location: inserted.location,
    role: inserted.role || "Panitia Masjid",
    text: inserted.text,
    result: inserted.result || undefined,
    photo: inserted.photo || undefined,
    rating: inserted.rating ?? 5,
    category: inserted.category || "Kubah GRC",
    isActive: inserted.isActive ?? true,
  };
}

export async function updateTestimonial(id: number, data: Partial<TestimonialItem>): Promise<TestimonialItem> {
  const { testimonials } = await import("./schema");
  const database = ensureDb();
  const [updated] = await database.update(testimonials).set({
    name: data.name,
    location: data.location,
    role: data.role,
    text: data.text,
    result: data.result,
    photo: data.photo,
    rating: data.rating,
    category: data.category,
    isActive: data.isActive,
  }).where(eq(testimonials.id, id)).returning().execute();

  if (!updated) throw new Error("Testimoni tidak ditemukan");
  return {
    id: updated.id,
    name: updated.name,
    location: updated.location,
    role: updated.role || "Panitia Masjid",
    text: updated.text,
    result: updated.result || undefined,
    photo: updated.photo || undefined,
    rating: updated.rating ?? 5,
    category: updated.category || "Kubah GRC",
    isActive: updated.isActive ?? true,
  };
}

export async function deleteTestimonial(id: number): Promise<void> {
  const { testimonials } = await import("./schema");
  const database = ensureDb();
  await database.delete(testimonials).where(eq(testimonials.id, id)).execute();
}

// ========== FAQS - Neon Only ==========
export async function getFaqsData(): Promise<FaqItem[]> {
  try {
    const { faqs } = await import("./schema");
    const database = ensureDb();
    const rows = await database.select().from(faqs).where(eq(faqs.isActive, true)).orderBy(faqs.id).execute();
    return rows.map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      category: r.category || "Umum",
      serviceSlug: r.serviceSlug || undefined,
      isActive: r.isActive ?? true,
    }));
  } catch (e) {
    console.warn("getFaqsData DB error:", (e as Error).message);
    return [];
  }
}

export async function getAllFaqs(): Promise<FaqItem[]> {
  try {
    const { faqs } = await import("./schema");
    const database = ensureDb();
    const rows = await database.select().from(faqs).orderBy(faqs.id).execute();
    return rows.map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      category: r.category || "Umum",
      serviceSlug: r.serviceSlug || undefined,
      isActive: r.isActive ?? true,
    }));
  } catch {
    return [];
  }
}

export async function getFaqsByCategory(category: string): Promise<FaqItem[]> {
  const all = await getFaqsData();
  return all.filter((f) => f.category === category || f.serviceSlug === category);
}

export async function createFaq(data: Omit<FaqItem, "id">): Promise<FaqItem> {
  const { faqs } = await import("./schema");
  const database = ensureDb();
  const [inserted] = await database.insert(faqs).values({
    question: data.question,
    answer: data.answer,
    category: data.category,
    serviceSlug: data.serviceSlug || null,
    isActive: data.isActive,
  }).returning().execute();

  return {
    id: inserted.id,
    question: inserted.question,
    answer: inserted.answer,
    category: inserted.category || "Umum",
    serviceSlug: inserted.serviceSlug || undefined,
    isActive: inserted.isActive ?? true,
  };
}

export async function updateFaq(id: number, data: Partial<FaqItem>): Promise<FaqItem> {
  const { faqs } = await import("./schema");
  const database = ensureDb();
  const [updated] = await database.update(faqs).set({
    question: data.question,
    answer: data.answer,
    category: data.category,
    serviceSlug: data.serviceSlug,
    isActive: data.isActive,
  }).where(eq(faqs.id, id)).returning().execute();

  if (!updated) throw new Error("FAQ tidak ditemukan");
  return {
    id: updated.id,
    question: updated.question,
    answer: updated.answer,
    category: updated.category || "Umum",
    serviceSlug: updated.serviceSlug || undefined,
    isActive: updated.isActive ?? true,
  };
}

export async function deleteFaq(id: number): Promise<void> {
  const { faqs } = await import("./schema");
  const database = ensureDb();
  await database.delete(faqs).where(eq(faqs.id, id)).execute();
}

// ========== PAGE SETTINGS - Neon Only ==========
export interface PageSettingsItem {
  id: number;
  slug: string;
  title: string;
  description?: string;
  sections: any;
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
}

export async function getPageSettingsData(): Promise<PageSettingsItem[]> {
  try {
    const { pageSettings } = await import("./schema");
    const database = ensureDb();
    const rows = await database.select().from(pageSettings).orderBy(pageSettings.slug).execute();
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description || undefined,
      sections: r.sections as any,
      seoTitle: r.seoTitle || undefined,
      seoDescription: r.seoDescription || undefined,
      isActive: r.isActive ?? true,
    }));
  } catch {
    return [];
  }
}

export async function getPageSettingsBySlug(slug: string): Promise<PageSettingsItem | undefined> {
  try {
    const { pageSettings } = await import("./schema");
    const database = ensureDb();
    const rows = await database.select().from(pageSettings).where(eq(pageSettings.slug, slug)).execute();
    if (rows.length === 0) return undefined;
    const r = rows[0];
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description || undefined,
      sections: r.sections as any,
      seoTitle: r.seoTitle || undefined,
      seoDescription: r.seoDescription || undefined,
      isActive: r.isActive ?? true,
    };
  } catch {
    return undefined;
  }
}

export async function createPageSettings(data: Omit<PageSettingsItem, "id">): Promise<PageSettingsItem> {
  const { pageSettings } = await import("./schema");
  const database = ensureDb();
  const [inserted] = await database.insert(pageSettings).values({
    slug: data.slug,
    title: data.title,
    description: data.description || null,
    sections: data.sections as any,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    isActive: data.isActive,
  }).returning().execute();
  return {
    id: inserted.id,
    slug: inserted.slug,
    title: inserted.title,
    description: inserted.description || undefined,
    sections: inserted.sections as any,
    seoTitle: inserted.seoTitle || undefined,
    seoDescription: inserted.seoDescription || undefined,
    isActive: inserted.isActive ?? true,
  };
}

export async function updatePageSettings(id: number, data: Partial<PageSettingsItem>): Promise<PageSettingsItem> {
  const { pageSettings } = await import("./schema");
  const database = ensureDb();
  const [updated] = await database.update(pageSettings).set({
    slug: data.slug,
    title: data.title,
    description: data.description,
    sections: data.sections as any,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    isActive: data.isActive,
  }).where(eq(pageSettings.id, id)).returning().execute();
  if (!updated) throw new Error("Page settings tidak ditemukan");
  return {
    id: updated.id,
    slug: updated.slug,
    title: updated.title,
    description: updated.description || undefined,
    sections: updated.sections as any,
    seoTitle: updated.seoTitle || undefined,
    seoDescription: updated.seoDescription || undefined,
    isActive: updated.isActive ?? true,
  };
}

export async function deletePageSettings(id: number): Promise<void> {
  const { pageSettings } = await import("./schema");
  const database = ensureDb();
  await database.delete(pageSettings).where(eq(pageSettings.id, id)).execute();
}

// ========== MEDIA LIBRARY - Neon Only ==========
export interface MediaItem {
  id: number;
  url: string;
  fileName: string;
  originalName?: string;
  size: number;
  type: string;
  folder: string;
  alt?: string;
  width?: number;
  height?: number;
}

export async function getMediaData(): Promise<MediaItem[]> {
  try {
    const { media } = await import("./schema");
    const database = ensureDb();
    const rows = await database.select().from(media).orderBy(desc(media.createdAt)).execute();
    return rows.map((r) => ({
      id: r.id,
      url: r.url,
      fileName: r.fileName,
      originalName: r.originalName || undefined,
      size: r.size,
      type: r.type,
      folder: r.folder || "general",
      alt: r.alt || undefined,
      width: r.width || undefined,
      height: r.height || undefined,
    }));
  } catch {
    return [];
  }
}

export async function createMedia(data: Omit<MediaItem, "id">): Promise<MediaItem> {
  const { media } = await import("./schema");
  const database = ensureDb();
  const [inserted] = await database.insert(media).values({
    url: data.url,
    fileName: data.fileName,
    originalName: data.originalName || null,
    size: data.size,
    type: data.type,
    folder: data.folder,
    alt: data.alt || null,
    width: data.width || null,
    height: data.height || null,
  }).returning().execute();
  return {
    id: inserted.id,
    url: inserted.url,
    fileName: inserted.fileName,
    originalName: inserted.originalName || undefined,
    size: inserted.size,
    type: inserted.type,
    folder: inserted.folder || "general",
    alt: inserted.alt || undefined,
    width: inserted.width || undefined,
    height: inserted.height || undefined,
  };
}

export async function deleteMedia(id: number): Promise<void> {
  const { media } = await import("./schema");
  const database = ensureDb();
  await database.delete(media).where(eq(media.id, id)).execute();
}

// Sync versions deprecated - kept for backward compat but now call async and throw if used in server without await
// For build compatibility, we keep sync versions returning empty to avoid crash, but log warning
export function getPortfolioDataSync(): PortfolioItem[] {
  console.warn("getPortfolioDataSync deprecated - use async getPortfolioData() with Neon DB");
  return [];
}
export function getServicesDataSync(): ServiceItem[] {
  console.warn("getServicesDataSync deprecated");
  return [];
}
export function getServiceBySlugSync(_slug: string): ServiceItem | undefined {
  console.warn("getServiceBySlugSync deprecated");
  return undefined;
}
export function getSettingsDataSync(): CompanySettings {
  console.warn("getSettingsDataSync deprecated");
  return {
    company: {
      name: "BSA GRC",
      fullName: "BSA GRC",
      tagline: "Kontraktor Kubah GRC Terbaik",
      description: "Spesialis Kubah Masjid",
      whatsapp: "6281230469914",
      whatsappDisplay: "0812-3046-9914",
      phone: "081230469914",
      phoneDisplay: "0812-3046-9914",
      email: "info@bsagrc.co.id",
      address: "Trenggalek, Jatim",
      yearsExperience: 10,
      projectsCompleted: 500,
      mapLat: -8.129491,
      mapLng: 111.721688,
      mapZoom: 14,
      mapEmbedUrl: "",
      mapLink: "",
    },
    hero: { title: "Kontraktor Kubah GRC Terbaik", subtitle: "Spesialis kubah masjid", image: "/images/services/hero.avif", ctaPrimary: "Konsultasi Gratis", ctaSecondary: "Portofolio" },
    usp: [],
    seo: { siteUrl: "https://bsagrc.co.id", googleVerification: "" },
  };
}
export function getBlogDataSync(): BlogPost[] {
  return [];
}
export function getBlogBySlugSync(_slug: string): BlogPost | undefined {
  return undefined;
}
export function getPublishedBlogsSync(): BlogPost[] {
  return [];
}
export async function savePortfolioData(_data: PortfolioItem[]): Promise<boolean> {
  return true;
}
export async function saveServicesData(_data: ServiceItem[]): Promise<boolean> {
  return true;
}
export async function saveBlogData(_data: BlogPost[]): Promise<boolean> {
  return true;
}
