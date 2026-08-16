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
    const folder = (formData.get("folder") as string) || "portfolio";
    const alt = (formData.get("alt") as string) || "";

    if (!file) {
      return NextResponse.json({ success: false, message: "File wajib diupload" }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ success: false, message: "Format tidak didukung. Gunakan JPG, PNG, WebP, AVIF max 5MB" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "File max 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    const safeFolder = folder.replace(/[^a-z0-9-]/gi, "") || "portfolio";
    const uploadDir = path.join(process.cwd(), "public", "images", safeFolder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const baseName = path.basename(file.name, path.extname(file.name)).replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
    const fileName = `${Date.now()}-${baseName}.avif`;
    const filePath = path.join(uploadDir, fileName);

    let finalUrl = "";
    let finalSize = file.size;
    let metadata: any = {};

    try {
      const image = sharp(inputBuffer);
      metadata = await image.metadata();
      await image
        .avif({
          quality: 55,
          effort: 4,
        })
        .toFile(filePath);
      const avifStat = fs.statSync(filePath);
      finalSize = avifStat.size;
      finalUrl = `/images/${safeFolder}/${fileName}`;
    } catch (sharpError) {
      console.error("Sharp AVIF conversion failed, fallback to original:", sharpError);
      const fallbackName = `${Date.now()}-${baseName}${path.extname(file.name) || ".webp"}`;
      const fallbackPath = path.join(uploadDir, fallbackName);
      fs.writeFileSync(fallbackPath, inputBuffer);
      finalUrl = `/images/${safeFolder}/${fallbackName}`;
      finalSize = file.size;
    }

    // Save to media library DB (Neon) - like WordPress
    try {
      await createMedia({
        url: finalUrl,
        fileName: fileName,
        originalName: file.name,
        size: finalSize,
        type: "image/avif",
        folder: safeFolder,
        alt: alt || baseName,
        width: metadata.width,
        height: metadata.height,
      });
    } catch (dbError) {
      console.warn("Failed to save to media DB, but file uploaded:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: `Upload berhasil - AVIF format (${(finalSize / 1024).toFixed(1)}KB, saved ~${((1 - finalSize / file.size) * 100).toFixed(0)}% vs original) - Tersimpan di Media Library`,
      data: {
        url: finalUrl,
        fileName,
        size: finalSize,
        originalSize: file.size,
        type: "image/avif",
        format: "avif",
        folder: safeFolder,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Gagal upload gambar - " + String(error) }, { status: 500 });
  }
}
