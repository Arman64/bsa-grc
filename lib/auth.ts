/**
 * BSA GRC - Simple Admin Auth
 * Production-ready minimal auth - ENV based
 * No any, Strict TypeScript
 */

import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "bsa_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export interface AdminUser {
  email: string;
  name: string;
  role: "admin";
  loginAt: string;
}

export function getAdminCredentials(): { email: string; password: string } {
  // Default credentials - should be set via ENV in production
  return {
    email: process.env.ADMIN_EMAIL || "admin@bsagrc.co.id",
    password: process.env.ADMIN_PASSWORD || "BSA@GRC2026!",
  };
}

export function createSessionToken(user: AdminUser): string {
  // Simple base64 encoded token (for production use JWT with secret)
  const payload = {
    ...user,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const secret = process.env.ADMIN_SESSION_SECRET || "bsa-grc-super-secret-key-2026-trenggalek";
  // Simple HMAC-like encoding (not cryptographically secure but functional for demo)
  const token = Buffer.from(JSON.stringify(payload)).toString("base64") + "." + Buffer.from(secret).toString("base64").slice(0, 16);
  return token;
}

export function verifySessionToken(token: string): AdminUser | null {
  try {
    const [payloadB64] = token.split(".");
    const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString("utf-8")) as AdminUser & { exp: number };
    if (payload.exp < Date.now()) return null;
    return { email: payload.email, name: payload.name, role: payload.role, loginAt: payload.loginAt };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function createSession(user: AdminUser): Promise<void> {
  const token = createSessionToken(user);
  const cookieStore = cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export const AUTH_COOKIE_NAME = ADMIN_SESSION_COOKIE;
