/**
 * BSA GRC - MCP / API token management (Neon table bsa_api_tokens).
 * SEC: tokens are stored as SHA-256 hashes only - the raw secret is returned once at creation
 * and never persisted or re-displayed afterward (only a non-reversible prefix is shown in the list).
 */
import { randomBytes, createHash, timingSafeEqual } from "crypto";
import { desc, eq } from "drizzle-orm";
import { db, isDbEnabled } from "./db";
import { apiTokens } from "./schema";

export const MCP_PERMISSIONS = [
  { id: "blog:read", label: "Baca Blog (GET /api/mcp/blog)" },
  { id: "blog:write", label: "Tulis / Buat Artikel Baru (POST /api/mcp/blog)" },
  { id: "blog:edit", label: "Edit & Publish/Unpublish Artikel (PATCH /api/mcp/blog)" },
];

function ensureDb() {
  if (!isDbEnabled || !db) throw new Error("DATABASE_URL tidak ditemukan.");
  return db;
}

export function generateTokenString(): string {
  return "bsagrc_mcp_" + randomBytes(24).toString("hex");
}

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export interface ApiTokenRow {
  id: number;
  name: string;
  tokenPrefix: string | null;
  permissions: string[];
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  revoked: boolean;
  createdAt: Date | null;
}

function status(t: any): "active" | "expired" | "revoked" {
  if (t.revoked) return "revoked";
  if (t.expiresAt && new Date(t.expiresAt).getTime() < Date.now()) return "expired";
  return "active";
}

/** List tokens WITHOUT the hash - only the safe-to-display prefix is returned. */
export async function listTokens() {
  const database = ensureDb();
  const rows = await database.select().from(apiTokens).orderBy(desc(apiTokens.createdAt)).execute();
  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    tokenPrefix: r.tokenPrefix,
    permissions: r.permissions,
    expiresAt: r.expiresAt,
    lastUsedAt: r.lastUsedAt,
    revoked: r.revoked,
    createdAt: r.createdAt,
    status: status(r),
  }));
}

export async function createToken(input: { name: string; permissions: string[]; expiresAt: string | null }) {
  const database = ensureDb();
  const rawToken = generateTokenString();
  const values = {
    name: input.name?.trim() || "Token MCP",
    token: hashToken(rawToken),
    tokenPrefix: rawToken.slice(0, 15) + "...",
    permissions: (input.permissions && input.permissions.length ? input.permissions : ["blog:read", "blog:write"]) as any,
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    revoked: false,
  };
  const inserted = await database.insert(apiTokens).values(values as any).returning().execute();
  // Raw token is only ever returned here, right after creation - caller must copy it now.
  return { ...inserted[0], token: rawToken };
}

export async function revokeToken(id: number, revoked = true) {
  const database = ensureDb();
  await database.update(apiTokens).set({ revoked }).where(eq(apiTokens.id, id)).execute();
  return true;
}

export async function deleteToken(id: number) {
  const database = ensureDb();
  await database.delete(apiTokens).where(eq(apiTokens.id, id)).execute();
  return true;
}

/** Validate an incoming API key against DB tokens for a required permission. */
export async function validateToken(key: string, requiredPermission: string): Promise<{ ok: boolean; reason?: string; name?: string }> {
  if (!key) return { ok: false, reason: "no-key" };
  try {
    const database = ensureDb();
    const incomingHash = hashToken(key);
    const rows = await database.select().from(apiTokens).where(eq(apiTokens.token, incomingHash)).execute();
    const t: any = rows[0];
    if (!t) return { ok: false, reason: "invalid" };
    // Constant-time compare as defense-in-depth on top of the indexed hash lookup above.
    const stored = Buffer.from(t.token, "utf8");
    const incoming = Buffer.from(incomingHash, "utf8");
    if (stored.length !== incoming.length || !timingSafeEqual(stored, incoming)) return { ok: false, reason: "invalid" };
    if (t.revoked) return { ok: false, reason: "revoked" };
    if (t.expiresAt && new Date(t.expiresAt).getTime() < Date.now()) return { ok: false, reason: "expired" };
    const perms: string[] = t.permissions || [];
    if (!perms.includes("*") && !perms.includes(requiredPermission)) return { ok: false, reason: "forbidden" };
    // fire-and-forget update lastUsedAt
    database.update(apiTokens).set({ lastUsedAt: new Date() }).where(eq(apiTokens.id, t.id)).execute().catch(() => {});
    return { ok: true, name: t.name };
  } catch {
    return { ok: false, reason: "error" };
  }
}
