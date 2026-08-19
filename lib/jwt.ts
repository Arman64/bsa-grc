/**
 * BSA GRC - JWT helpers (jose). Edge + Node compatible.
 * Used by middleware (Edge) and route handlers / server components (Node).
 */
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "bsa_admin_session";
const MAX_AGE_SEC = 60 * 60 * 8; // 8 hours

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

function getSecretKey(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "bsa-grc-fallback-secret-change-in-env-2026";
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ email: payload.email, name: payload.name, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      sub: String(payload.sub || ""),
      email: String(payload.email || ""),
      name: String(payload.name || "Administrator"),
      role: String(payload.role || "admin"),
    };
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE_SEC;
