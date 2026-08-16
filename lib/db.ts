import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Neon serverless driver works in both Node and Edge (with http)
// For Vercel deployment, must use DATABASE_URL from Neon dashboard
// Example: postgres://neondb_owner:xxx@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

if (!databaseUrl && process.env.NODE_ENV === "production") {
  console.warn("DATABASE_URL not set - falling back to JSON file storage (data/*.json). Set DATABASE_URL in Vercel ENV for persistence.");
}

// Create neon client - only if URL exists, otherwise null (fallback to JSON)
let db: ReturnType<typeof drizzle> | null = null;

if (databaseUrl) {
  try {
    const sql = neon(databaseUrl);
    db = drizzle(sql);
  } catch (error) {
    console.error("Failed to create Neon client, fallback to JSON:", error);
    db = null;
  }
}

export { db };
export const isDbEnabled = !!db && !!databaseUrl;
