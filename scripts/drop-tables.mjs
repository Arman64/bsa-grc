import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const sql = neon(url);

console.log("Dropping old tables and data...");

try {
  // Drop all tables if exist - order matters due to dependencies, use CASCADE
  await sql`DROP TABLE IF EXISTS leads CASCADE`;
  await sql`DROP TABLE IF EXISTS blogs CASCADE`;
  await sql`DROP TABLE IF EXISTS testimonials CASCADE`;
  await sql`DROP TABLE IF EXISTS faqs CASCADE`;
  await sql`DROP TABLE IF EXISTS settings CASCADE`;
  await sql`DROP TABLE IF EXISTS services CASCADE`;
  await sql`DROP TABLE IF EXISTS portfolios CASCADE`;
  await sql`DROP TABLE IF EXISTS drizzle_migrations CASCADE`;
  console.log("All old tables dropped successfully");
} catch (e) {
  console.error("Drop error (may be first time, continuing):", e.message);
}
