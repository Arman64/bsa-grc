import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const tables = ["portfolios", "services", "settings", "blogs", "testimonials", "faqs", "leads"];
for (const t of tables) {
  try {
    const rows = await sql`SELECT COUNT(*) as count FROM ${sql.unsafe(t)}`;
    console.log(`${t}: ${rows[0].count} rows`);
  } catch (e) {
    console.log(`${t}: error ${e.message}`);
  }
}
