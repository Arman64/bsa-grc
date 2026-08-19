import { neon } from "@neondatabase/serverless";

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
console.log("OK: bsa_api_tokens ready");
