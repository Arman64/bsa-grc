import { neon } from "@neondatabase/serverless";
import { createHash } from "crypto";

const sql = neon(process.env.DATABASE_URL);

await sql.query(`CREATE TABLE IF NOT EXISTS bsa_api_tokens (
  id serial PRIMARY KEY,
  name varchar(200) NOT NULL,
  token varchar(120) NOT NULL UNIQUE,
  permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
  expires_at timestamptz,
  last_used_at timestamptz,
  revoked boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
)`);

await sql.query(`ALTER TABLE bsa_api_tokens ADD COLUMN IF NOT EXISTS token_prefix varchar(40)`);

// SEC fix: previously "token" stored the raw secret in plaintext. Backfill hashes the existing
// plaintext value in place (once) so external clients keep working with their original raw key,
// while the DB only ever stores a SHA-256 hash from now on.
const rows = await sql.query(`SELECT id, token FROM bsa_api_tokens WHERE token_prefix IS NULL`);
for (const row of rows) {
  const raw = row.token;
  const prefix = raw.slice(0, 15) + "...";
  const hash = createHash("sha256").update(raw).digest("hex");
  await sql.query(`UPDATE bsa_api_tokens SET token = $1, token_prefix = $2 WHERE id = $3`, [hash, prefix, row.id]);
}

console.log(`OK: bsa_api_tokens ready, ${rows.length} token(s) migrated to hashed storage`);
