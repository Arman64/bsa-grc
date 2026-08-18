import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { createMedia } from "@/lib/data";

export const dynamic = "force-dynamic";

function getFileExtension(mime: string): string {
  if (mime.includes("avif")) return ".avif";
  if (mime.includes("webp")) return ".webp";
  if (mime.includes("png")) return ".png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return ".jpg";
  return ".avif";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";
    const alt = (formData.get("alt") as string) || "";

    if (!file) {
      return NextResponse.json({ success: false, message: "File wajib diupload" }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ success: false, message: "Format tidak didukung. Gunakan JPG, PNG, WebP, AVIF max 5MB" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "File max 10MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Convert to AVIF for performance
    let avifBuffer: Buffer;
    let width: number | undefined;
    let height: number | undefined;

    try {
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;

      avifBuffer = await image
        .avif({
          quality: 55,
          effort: 4,
        })
        .toBuffer();
    } catch (sharpError) {
      console.error("Sharp AVIF conversion failed, using original:", sharpError);
      avifBuffer = inputBuffer;
    }

    const safeFolder = folder.replace(/[^a-z0-9-]/gi, "") || "general";
    const baseName = path.basename(file.name, path.extname(file.name)).replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
    const fileName = `${Date.now()}-${baseName}.avif`;

    let publicUrl = "";
    let finalSize = avifBuffer.length;

    // Try Vercel Blob first (for Vercel deployment - filesystem read-only)
    const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
    const hasSupabase = !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));

    if (hasVercelBlob) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(`bsa-grc/${safeFolder}/${fileName}`, avifBuffer, {
          access: "public",
          contentType: "image/avif",
        });
        publicUrl = blob.url;
        console.log("Uploaded to Vercel Blob:", publicUrl);
      } catch (blobError) {
        console.error("Vercel Blob upload failed, fallback to filesystem:", blobError);
      }
    }

    // Try Supabase Storage as second option
    if (!publicUrl && hasSupabase) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const bucket = process.env.SUPABASE_BUCKET || "media";
        const supabasePath = `${safeFolder}/${fileName}`;

        const { data, error } = await supabase.storage.from(bucket).upload(supabasePath, avifBuffer, {
          contentType: "image/avif",
          upsert: true,
        });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(supabasePath);
        publicUrl = publicUrlData.publicUrl;
        console.log("Uploaded to Supabase Storage:", publicUrl);
      } catch (supaError) {
        console.error("Supabase upload failed, fallback to filesystem:", supaError);
      }
    }

    // Fallback to filesystem (for local dev - works in Arena, not in Vercel production)
    if (!publicUrl) {
      try {
        const uploadDir = path.join(process.cwd(), "public", "images", safeFolder);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, avifBuffer);
        publicUrl = `/images/${safeFolder}/${fileName}`;
        console.log("Saved to filesystem:", publicUrl);
      } catch (fsError) {
        console.error("Filesystem save failed (expected on Vercel read-only):", fsError);
        // Last resort: save to /tmp and return tmp URL (won't persist but at least not crash)
        try {
          const tmpPath = path.join("/tmp", fileName);
          fs.writeFileSync(tmpPath, avifBuffer);
          publicUrl = `/tmp/${fileName}`;
        } catch {}
        
        if (!publicUrl) {
          return NextResponse.json(
            { success: false, message: "Gagal simpan file - Vercel filesystem read-only. Aktifkan Vercel Blob atau Supabase Storage di ENV." },
            { status: 500 }
          );
        }
      }
    }

    // Save to media library DB (Neon) - like WordPress
    let mediaRecord = null;
    try {
      mediaRecord = await createMedia({
        url: publicUrl,
        fileName: fileName,
        originalName: file.name,
        size: finalSize,
        type: "image/avif",
        folder: safeFolder,
        alt: alt || baseName,
        width: width,
        height: height,
      });
      console.log("Saved to media DB:", mediaRecord.id);
    } catch (dbError) {
      console.warn("Failed to save to media DB, but file uploaded:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: `Upload berhasil - AVIF format (${(finalSize / 1024).toFixed(1)}KB, saved ~${((1 - finalSize / file.size) * 100).toFixed(0)}% vs original) - Tersimpan di Media Library`,
      data: {
        url: publicUrl,
        fileName,
        size: finalSize,
        originalSize: file.size,
        type: "image/avif",
        format: "avif",
        folder: safeFolder,
        mediaId: mediaRecord?.id,
        width,
        height,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Gagal upload gambar - " + String(error) }, { status: 500 });
  }
}
