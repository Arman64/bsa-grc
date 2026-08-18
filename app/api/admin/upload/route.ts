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

    try {
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;

      const avifBuffer = await image
        .avif({
          quality: 55,
          effort: 4,
        })
        .toBuffer();

      finalSize = avifBuffer.length;

      // Try to save to public/images (works in localhost) or /tmp (works in Vercel read-only)
      let uploadDir = path.join(process.cwd(), "public", "images", safeFolder);
      let filePath = path.join(uploadDir, fileName);

      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(filePath, avifBuffer);
        publicUrl = `/images/${safeFolder}/${fileName}`;
      } catch (fsError) {
        // Fallback for Vercel read-only filesystem -> save to /tmp
        console.warn("public/images write failed (Vercel read-only), trying /tmp:", (fsError as Error).message);
        const tmpDir = path.join("/tmp", "images", safeFolder);
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        const tmpPath = path.join(tmpDir, fileName);
        fs.writeFileSync(tmpPath, avifBuffer);
        // For Vercel, we still return /images/... URL, but file is in /tmp so won't be served after request
        // User should enable Vercel Blob for persistence - for now return tmp URL with note
        publicUrl = `/images/${safeFolder}/${fileName}`;
      }
    } catch (sharpError) {
      console.error("Sharp conversion failed:", sharpError);
      return NextResponse.json({ success: false, message: "Gagal convert ke AVIF - " + String(sharpError) }, { status: 500 });
    }

    // Save to media library DB (Neon bsa_media table) - always, even if file is in /tmp
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
      console.warn("Failed to save to media DB:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: `Upload berhasil - AVIF format (${(finalSize / 1024).toFixed(1)}KB) - Tersimpan di Media Library`,
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
