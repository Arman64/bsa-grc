import { pgTable, serial, varchar, text, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

// Portfolio - Kubah, Menara, Krawangan projects
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }),
  category: varchar("category", { length: 100 }).notNull(),
  location: varchar("location", { length: 200 }).notNull(),
  year: varchar("year", { length: 20 }).notNull(),
  image: text("image").notNull(),
  diameter: varchar("diameter", { length: 100 }),
  height: varchar("height", { length: 100 }),
  material: varchar("material", { length: 200 }),
  client: varchar("client", { length: 200 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services - 5 layanan BSA GRC including landing page JSON
export const services = pgTable("services", {
  id: varchar("id", { length: 100 }).primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 300 }).notNull(),
  shortTitle: varchar("short_title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  features: jsonb("features").$type<string[]>().default([]),
  image: text("image").notNull(),
  originalImage: text("original_image").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  priceRange: varchar("price_range", { length: 200 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  landingPage: jsonb("landing_page").$type<any>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Settings - single row id=1, company, hero, usp, seo as JSON
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  company: jsonb("company").$type<any>().notNull(),
  hero: jsonb("hero").$type<any>().notNull(),
  usp: jsonb("usp").$type<any[]>(),
  seo: jsonb("seo").$type<any>(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blogs - SEO friendly articles
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  author: varchar("author", { length: 200 }).default("Tim BSA GRC").notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  seoTitle: varchar("seo_title", { length: 500 }),
  seoDescription: text("seo_description"),
  keywords: jsonb("keywords").$type<string[]>().default([]),
  isPublished: boolean("is_published").default(true).notNull(),
  views: integer("views").default(0).notNull(),
  readingTime: integer("reading_time").default(5),
});

// Leads - from contact form & landing page ads
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  service: varchar("service", { length: 200 }).notNull(),
  location: varchar("location", { length: 300 }).notNull(),
  size: varchar("size", { length: 100 }),
  message: text("message").notNull(),
  source: varchar("source", { length: 300 }),
  whatsappLink: text("whatsapp_link"),
  status: varchar("status", { length: 50 }).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Testimonials - migrated from constants TESTIMONIALS
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  location: varchar("location", { length: 300 }).notNull(),
  role: varchar("role", { length: 200 }).default("Panitia Masjid").notNull(),
  text: text("text").notNull(),
  result: varchar("result", { length: 300 }),
  photo: text("photo"),
  rating: integer("rating").default(5).notNull(),
  category: varchar("category", { length: 100 }).default("Kubah GRC"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// FAQs - global + per service
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 500 }).notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }).default("Umum").notNull(), // Umum, Kubah GRC, Menara, etc
  serviceSlug: varchar("service_slug", { length: 100 }), // null for global, or kubah-grc, menara, etc
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
