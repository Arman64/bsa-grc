/**
 * BSA GRC - Admin session helpers (Node / server components + route handlers).
 * Password hashing & user lookup live in lib/cms.ts. JWT in lib/jwt.ts.
 */
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, SESSION_MAX_AGE, signSession, verifySession, type SessionPayload } from "./jwt";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getSession(): Promise<AdminUser | null> {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySession(token);
  if (!payload) return null;
  return { id: payload.sub, email: payload.email, name: payload.name, role: payload.role };
}

export async function createSessionCookie(user: AdminUser): Promise<string> {
  const payload: SessionPayload = { sub: String(user.id), email: user.email, name: user.name, role: user.role };
  return await signSession(payload);
}

export async function deleteSession(): Promise<void> {
  cookies().delete(AUTH_COOKIE_NAME);
}

export { AUTH_COOKIE_NAME, SESSION_MAX_AGE };
