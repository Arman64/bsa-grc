import { pgTable, serial, varchar, text, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

// Use bsa_ prefix to avoid collision with other apps sharing same Neon DB
// Previously tables like settings, media, leads collided with key/value schema from other apps

export const portfolios = pgTable("bsa_portfolios", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }),
  category: varchar("category", { length: 100 }).notNull(),
  location: varchar("location", { length: 200 }).notNull(),
  year: varchar("year", { length: 20 }).notNull(),
  image: text("image").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  diameter: varchar("diameter", { length: 100 }),
  height: varchar("height", { length: 100 }),
  material: varchar("material", { length: 200 }),
  client: varchar("client", { length: 200 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const services = pgTable("bsa_services", {
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

export const settings = pgTable("bsa_settings", {
  id: serial("id").primaryKey(),
  company: jsonb("company").$type<any>().notNull(),
  hero: jsonb("hero").$type<any>().notNull(),
  usp: jsonb("usp").$type<any[]>(),
  seo: jsonb("seo").$type<any>(),
  appearance: jsonb("appearance").$type<any>(),
  navigation: jsonb("navigation").$type<any>(),
  integrations: jsonb("integrations").$type<any>(),
  footer: jsonb("footer").$type<any>(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminUsers = pgTable("bsa_admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 200 }).default("Administrator"),
  role: varchar("role", { length: 50 }).default("admin").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const loginAttempts = pgTable("bsa_login_attempts", {
  id: serial("id").primaryKey(),
  identifier: varchar("identifier", { length: 300 }).notNull().unique(),
  attempts: integer("attempts").default(0).notNull(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const blogs = pgTable("bsa_blogs", {
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

export const leads = pgTable("bsa_leads", {
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

export const testimonials = pgTable("bsa_testimonials", {
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

export const faqs = pgTable("bsa_faqs", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 500 }).notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }).default("Umum").notNull(),
  serviceSlug: varchar("service_slug", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pageSettings = pgTable("bsa_page_settings", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  sections: jsonb("sections").$type<any>().notNull(),
  seoTitle: varchar("seo_title", { length: 500 }),
  seoDescription: text("seo_description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const media = pgTable("bsa_media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  fileName: varchar("file_name", { length: 300 }).notNull(),
  originalName: varchar("original_name", { length: 300 }),
  size: integer("size").notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  folder: varchar("folder", { length: 100 }).default("general"),
  alt: varchar("alt", { length: 500 }),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export const apiTokens = pgTable("bsa_api_tokens", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  token: varchar("token", { length: 120 }).notNull().unique(),
  tokenPrefix: varchar("token_prefix", { length: 40 }),
  permissions: jsonb("permissions").$type<string[]>().notNull().default([]),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  revoked: boolean("revoked").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
