import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { PAGE_DEFAULTS, PAGE_ORDER } from "../lib/content-defaults";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const sql = neon(url);

  for (const slug of PAGE_ORDER) {
    const def = PAGE_DEFAULTS[slug];
    await sql.query(
      `INSERT INTO bsa_page_settings (slug, title, description, sections, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, true, now(), now())
       ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, sections = EXCLUDED.sections, updated_at = now()`,
      [slug, def.title, def.description, JSON.stringify(def.sections)]
    );
    console.log(`Seeded page content: ${slug} (${Object.keys(def.sections).length} sections)`);
  }
  console.log("Content seed done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
