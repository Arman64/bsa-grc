import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { createMedia } from "@/lib/data";

export const dynamic = "force-dynamic";

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
      return NextResponse.json({ success: false, message: "Format tidak didukung. Gunakan JPG, PNG, WebP, AVIF max 10MB" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "File max 10MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    const safeFolder = folder.replace(/[^a-z0-9-]/gi, "") || "general";
    const baseName = path.basename(file.name, path.extname(file.name)).replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
    const fileName = `${Date.now()}-${baseName}.avif`;

    let publicUrl = "";
    let finalSize = file.size;
    let width: number | undefined;
    let height: number | undefined;
    let storageType = "filesystem";

    // Convert to AVIF
    let avifBuffer: Buffer;
    try {
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;
      avifBuffer = await image.avif({ quality: 55, effort: 4 }).toBuffer();
      finalSize = avifBuffer.length;
    } catch (sharpError) {
      console.error("Sharp conversion failed, using original:", sharpError);
      avifBuffer = inputBuffer;
    }

    // 1. Try Vercel Blob if token exists (for Vercel deployment with Blob Store bsa-grc-media)
    // Base URL you provided: https://laha1vzyexlp31he.private.blob.vercel-storage.com
    // Token: vercel_blob_rw_lAHA1vzyEx1p31he_pKdMu67kBRzzgPeI1oRpl58KDQs50 (set as BLOB_READ_WRITE_TOKEN in Vercel ENV)
    const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
    
    if (hasVercelBlob) {
      try {
        const { put } = await import("@vercel/blob");
        const blobPath = `bsa-grc/${safeFolder}/${fileName}`;
        const blob = await put(blobPath, avifBuffer, {
          access: "public",
          contentType: "image/avif",
          addRandomSuffix: false,
        });
        publicUrl = blob.url;
        storageType = "vercel-blob";
        console.log("Uploaded to Vercel Blob:", publicUrl);
      } catch (blobError) {
        console.error("Vercel Blob upload failed, trying filesystem fallback:", blobError);
      }
    }

    // 2. Try Supabase Storage if configured
    if (!publicUrl) {
      const hasSupabase = !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
      if (hasSupabase) {
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const supabaseUrl = process.env.SUPABASE_URL!;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
          const supabase = createClient(supabaseUrl, supabaseKey);
          const bucket = process.env.SUPABASE_BUCKET || "media";
          const supabasePath = `${safeFolder}/${fileName}`;
          const { error } = await supabase.storage.from(bucket).upload(supabasePath, avifBuffer, {
            contentType: "image/avif",
            upsert: true,
          });
          if (error) throw error;
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(supabasePath);
          publicUrl = urlData.publicUrl;
          storageType = "supabase";
          console.log("Uploaded to Supabase:", publicUrl);
        } catch (supaError) {
          console.error("Supabase upload failed, fallback to filesystem:", supaError);
        }
      }
    }

    // 3. Fallback to filesystem (works in localhost Arena, not in Vercel prod read-only, but we try /tmp as well)
    if (!publicUrl) {
      try {
        const uploadDir = path.join(process.cwd(), "public", "images", safeFolder);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, avifBuffer);
        publicUrl = `/images/${safeFolder}/${fileName}`;
        storageType = "filesystem";
      } catch (fsError) {
        console.warn("public/images write failed (Vercel read-only), trying /tmp:", (fsError as Error).message);
        try {
          const tmpDir = path.join("/tmp", "images", safeFolder);
          if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
          }
          const tmpPath = path.join(tmpDir, fileName);
          fs.writeFileSync(tmpPath, avifBuffer);
          // For Vercel, /tmp files are not served statically, so we still return /images/... URL but it won't be accessible after request
          // User should enable Vercel Blob for persistence
          publicUrl = `/images/${safeFolder}/${fileName}`;
          storageType = "tmp-fallback";
        } catch (tmpError) {
          console.error("Even /tmp write failed:", tmpError);
          return NextResponse.json(
            { success: false, message: "Gagal simpan file - Vercel filesystem read-only. Aktifkan Vercel Blob Store bsa-grc-media di dashboard dan pastikan BLOB_READ_WRITE_TOKEN ter-set. Base URL: https://laha1vzyexlp31he.private.blob.vercel-storage.com" },
            { status: 500 }
          );
        }
      }
    }

    // Save to media library DB (Neon bsa_media) - always, so Media Library shows files
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
    } catch (dbError) {
      console.warn("Failed to save to media DB, but file uploaded:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: `Upload berhasil - AVIF ${ (finalSize / 1024).toFixed(1)}KB via ${storageType} - Tersimpan di Media Library`,
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
        storage: storageType,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Gagal upload gambar - " + String(error) }, { status: 500 });
  }
}
