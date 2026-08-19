import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const statements = [
  `CREATE TABLE IF NOT EXISTS bsa_admin_users (
    id serial PRIMARY KEY,
    email varchar(200) UNIQUE NOT NULL,
    password_hash text NOT NULL,
    name varchar(200) DEFAULT 'Administrator',
    role varchar(50) DEFAULT 'admin' NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS bsa_login_attempts (
    id serial PRIMARY KEY,
    identifier varchar(300) UNIQUE NOT NULL,
    attempts int DEFAULT 0 NOT NULL,
    locked_until timestamptz,
    updated_at timestamptz DEFAULT now()
  )`,
  `ALTER TABLE bsa_settings ADD COLUMN IF NOT EXISTS appearance jsonb`,
  `ALTER TABLE bsa_settings ADD COLUMN IF NOT EXISTS navigation jsonb`,
  `ALTER TABLE bsa_settings ADD COLUMN IF NOT EXISTS integrations jsonb`,
  `ALTER TABLE bsa_settings ADD COLUMN IF NOT EXISTS footer jsonb`,
];

for (const stmt of statements) {
  await sql.query(stmt);
  console.log("OK:", stmt.split("\n")[0].trim());
}
console.log("Migration done.");
