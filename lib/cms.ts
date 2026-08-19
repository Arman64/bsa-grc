/**
 * BSA GRC - CMS data layer (page content + site chrome + admin users)
 * Neon Postgres only, all tables prefixed `bsa_`.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, isDbEnabled } from "./db";
import { settings, pageSettings, adminUsers, loginAttempts } from "./schema";
import {
  PAGE_DEFAULTS,
  APPEARANCE_DEFAULT,
  NAVIGATION_DEFAULT,
  FOOTER_DEFAULT,
  INTEGRATIONS_DEFAULT,
  deepMerge,
} from "./content-defaults";

function ensureDb() {
  if (!isDbEnabled || !db) throw new Error("DATABASE_URL tidak ditemukan.");
  return db;
}

/* ===================== PAGE CONTENT ===================== */

export interface PageContent {
  slug: string;
  title: string;
  description: string;
  sections: any;
  seoTitle?: string;
  seoDescription?: string;
}

/** Merged (defaults ⊕ DB) content for a page. Always returns full structure. */
export async function getPageContent(slug: string): Promise<PageContent> {
  const def = PAGE_DEFAULTS[slug] || { title: slug, description: "", sections: {} };
  try {
    const database = ensureDb();
    const rows = await database.select().from(pageSettings).where(eq(pageSettings.slug, slug)).execute();
    if (rows.length === 0) {
      return { slug, title: def.title, description: def.description, sections: def.sections };
    }
    const r = rows[0] as any;
    return {
      slug,
      title: r.title || def.title,
      description: r.description || def.description,
      sections: deepMerge(def.sections, r.sections || {}),
      seoTitle: r.seoTitle || undefined,
      seoDescription: r.seoDescription || undefined,
    };
  } catch (e) {
    console.warn("getPageContent fallback:", (e as Error).message);
    return { slug, title: def.title, description: def.description, sections: def.sections };
  }
}

export async function savePageContent(data: PageContent): Promise<boolean> {
  const database = ensureDb();
  const existing = await database.select().from(pageSettings).where(eq(pageSettings.slug, data.slug)).execute();
  const values = {
    slug: data.slug,
    title: data.title,
    description: data.description || null,
    sections: data.sections as any,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    isActive: true,
    updatedAt: new Date(),
  };
  if (existing.length > 0) {
    await database.update(pageSettings).set(values).where(eq(pageSettings.id, existing[0].id)).execute();
  } else {
    await database.insert(pageSettings).values(values as any).execute();
  }
  return true;
}

/* ===================== SITE CHROME (appearance / nav / footer / integrations) ===================== */

export interface SiteChrome {
  appearance: typeof APPEARANCE_DEFAULT;
  navigation: typeof NAVIGATION_DEFAULT;
  footer: typeof FOOTER_DEFAULT;
  integrations: typeof INTEGRATIONS_DEFAULT;
}

async function getSettingsRow() {
  const database = ensureDb();
  const rows = await database.select().from(settings).limit(1).execute();
  return rows[0] as any | undefined;
}

export async function getSiteChrome(): Promise<SiteChrome> {
  try {
    const row = await getSettingsRow();
    return {
      appearance: deepMerge(APPEARANCE_DEFAULT, row?.appearance || {}),
      navigation: deepMerge(NAVIGATION_DEFAULT, row?.navigation || {}),
      footer: deepMerge(FOOTER_DEFAULT, row?.footer || {}),
      integrations: deepMerge(INTEGRATIONS_DEFAULT, row?.integrations || {}),
    };
  } catch (e) {
    console.warn("getSiteChrome fallback:", (e as Error).message);
    return {
      appearance: APPEARANCE_DEFAULT,
      navigation: NAVIGATION_DEFAULT,
      footer: FOOTER_DEFAULT,
      integrations: INTEGRATIONS_DEFAULT,
    };
  }
}

export async function saveChrome(patch: Partial<SiteChrome>): Promise<boolean> {
  const database = ensureDb();
  const row = await getSettingsRow();
  if (!row) throw new Error("Settings row belum ada. Simpan Pengaturan Umum dahulu.");
  const set: any = { updatedAt: new Date() };
  if (patch.appearance) set.appearance = patch.appearance;
  if (patch.navigation) set.navigation = patch.navigation;
  if (patch.footer) set.footer = patch.footer;
  if (patch.integrations) set.integrations = patch.integrations;
  await database.update(settings).set(set).where(eq(settings.id, row.id)).execute();
  return true;
}

/* ===================== ADMIN USERS ===================== */

export interface AdminUserRow {
  id: number;
  email: string;
  name: string;
  role: string;
}

function normEmail(email: string) {
  return (email || "").trim().toLowerCase();
}

export async function ensureAdminSeed(): Promise<void> {
  const database = ensureDb();
  const email = normEmail(process.env.ADMIN_EMAIL || "admin@bsagrc.co.id");
  const password = process.env.ADMIN_PASSWORD || "BSA@GRC2026!";
  const existing = await database.select().from(adminUsers).limit(1).execute();
  if (existing.length === 0) {
    const hash = await bcrypt.hash(password, 10);
    await database
      .insert(adminUsers)
      .values({ email, passwordHash: hash, name: "Administrator BSA GRC", role: "admin" })
      .execute();
  }
}

export async function getAdminByEmail(email: string): Promise<any | undefined> {
  const database = ensureDb();
  const rows = await database.select().from(adminUsers).where(eq(adminUsers.email, normEmail(email))).execute();
  return rows[0];
}

export async function verifyAdminLogin(email: string, password: string): Promise<AdminUserRow | null> {
  await ensureAdminSeed();
  const user = await getAdminByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { id: user.id, email: user.email, name: user.name || "Administrator", role: user.role };
}

export async function changeAdminPassword(email: string, currentPassword: string, newPassword: string): Promise<{ ok: boolean; message: string }> {
  const database = ensureDb();
  const user = await getAdminByEmail(email);
  if (!user) return { ok: false, message: "Akun tidak ditemukan" };
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return { ok: false, message: "Password saat ini salah" };
  if (!newPassword || newPassword.length < 8) return { ok: false, message: "Password baru minimal 8 karakter" };
  const hash = await bcrypt.hash(newPassword, 10);
  await database.update(adminUsers).set({ passwordHash: hash, updatedAt: new Date() }).where(eq(adminUsers.id, user.id)).execute();
  return { ok: true, message: "Password berhasil diganti" };
}

/* ===================== BRUTE FORCE PROTECTION ===================== */

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function checkLockout(identifier: string): Promise<{ locked: boolean; remainingSec: number }> {
  try {
    const database = ensureDb();
    const rows = await database.select().from(loginAttempts).where(eq(loginAttempts.identifier, identifier)).execute();
    const row = rows[0] as any;
    if (!row || !row.lockedUntil) return { locked: false, remainingSec: 0 };
    const until = new Date(row.lockedUntil).getTime();
    const now = Date.now();
    if (until > now) return { locked: true, remainingSec: Math.ceil((until - now) / 1000) };
    return { locked: false, remainingSec: 0 };
  } catch {
    return { locked: false, remainingSec: 0 };
  }
}

export async function recordFailedAttempt(identifier: string): Promise<void> {
  try {
    const database = ensureDb();
    const rows = await database.select().from(loginAttempts).where(eq(loginAttempts.identifier, identifier)).execute();
    const row = rows[0] as any;
    const attempts = (row?.attempts || 0) + 1;
    const lockedUntil = attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000) : null;
    if (row) {
      await database.update(loginAttempts).set({ attempts, lockedUntil, updatedAt: new Date() }).where(eq(loginAttempts.id, row.id)).execute();
    } else {
      await database.insert(loginAttempts).values({ identifier, attempts, lockedUntil, updatedAt: new Date() }).execute();
    }
  } catch (e) {
    console.warn("recordFailedAttempt:", (e as Error).message);
  }
}

export async function clearAttempts(identifier: string): Promise<void> {
  try {
    const database = ensureDb();
    await database.delete(loginAttempts).where(eq(loginAttempts.identifier, identifier)).execute();
  } catch {
    /* ignore */
  }
}
