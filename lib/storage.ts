/**
 * BSA GRC - Shared image storage cascade (Vercel Blob -> Supabase -> filesystem fallback).
 * Used by both the manual media upload endpoint and the WordPress bulk importer.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function storeImageBuffer(
  buffer: Buffer,
  safeFolder: string,
  fileName: string,
  contentType = "image/avif"
): Promise<{ url: string; storageType: string }> {
  const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
  if (hasVercelBlob) {
    try {
      const { put } = await import("@vercel/blob");
      const blobPath = `bsa-grc/${safeFolder}/${fileName}`;
      const blob = await put(blobPath, buffer, { access: "public", contentType, addRandomSuffix: false });
      return { url: blob.url, storageType: "vercel-blob" };
    } catch (e) {
      console.error("Vercel Blob upload failed, trying next fallback:", e);
    }
  }

  const hasSupabase = !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
  if (hasSupabase) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      const bucket = process.env.SUPABASE_BUCKET || "media";
      const supabasePath = `${safeFolder}/${fileName}`;
      const { error } = await supabase.storage.from(bucket).upload(supabasePath, buffer, { contentType, upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(supabasePath);
      return { url: urlData.publicUrl, storageType: "supabase" };
    } catch (e) {
      console.error("Supabase upload failed, trying filesystem fallback:", e);
    }
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "images", safeFolder);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), buffer);
    return { url: `/images/${safeFolder}/${fileName}`, storageType: "filesystem" };
  } catch (fsError) {
    console.warn("public/images write failed (Vercel read-only), trying /tmp:", (fsError as Error).message);
    const tmpDir = path.join("/tmp", "images", safeFolder);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(path.join(tmpDir, fileName), buffer);
    return { url: `/images/${safeFolder}/${fileName}`, storageType: "tmp-fallback" };
  }
}

function safeBaseName(sourceUrl: string): string {
  try {
    const pathname = new URL(sourceUrl).pathname;
    return path.basename(pathname, path.extname(pathname)).replace(/[^a-z0-9.-]/gi, "_").toLowerCase() || "image";
  } catch {
    return "image";
  }
}

/** Downloads an external image (e.g. old WordPress media) and re-stores it via the storage cascade.
 * Falls back to returning the original URL if download/conversion fails, so import never blocks on one bad image. */
export async function downloadAndStoreImage(sourceUrl: string, folder = "blog-import"): Promise<string> {
  if (!/^https?:\/\//i.test(sourceUrl)) return sourceUrl;
  try {
    const res = await fetch(sourceUrl, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const inputBuffer = Buffer.from(await res.arrayBuffer());
    const baseName = safeBaseName(sourceUrl);
    const safeFolder = folder.replace(/[^a-z0-9-]/gi, "") || "blog-import";

    let outBuffer: Buffer;
    let ext = "avif";
    let contentType = "image/avif";
    try {
      outBuffer = await sharp(inputBuffer).avif({ quality: 55, effort: 4 }).toBuffer();
    } catch {
      // SVG / unsupported format for sharp - keep original bytes & extension
      outBuffer = inputBuffer;
      const origExt = path.extname(new URL(sourceUrl).pathname).replace(".", "").toLowerCase();
      ext = origExt || "jpg";
      contentType = res.headers.get("content-type") || "image/jpeg";
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}.${ext}`;
    const stored = await storeImageBuffer(outBuffer, safeFolder, fileName, contentType);
    return stored.url;
  } catch (e) {
    console.warn(`Gagal download gambar ${sourceUrl}, pakai URL asli:`, (e as Error).message);
    return sourceUrl;
  }
}
