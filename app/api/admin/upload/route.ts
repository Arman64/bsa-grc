import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";
import { createMedia } from "@/lib/data";
import { storeImageBuffer } from "@/lib/storage";

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

    let finalSize = file.size;
    let width: number | undefined;
    let height: number | undefined;

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

    let publicUrl = "";
    let storageType = "filesystem";
    try {
      const stored = await storeImageBuffer(avifBuffer, safeFolder, fileName, "image/avif");
      publicUrl = stored.url;
      storageType = stored.storageType;
    } catch (storeError) {
      console.error("All storage methods failed:", storeError);
      return NextResponse.json(
        { success: false, message: "Gagal simpan file - Vercel filesystem read-only. Aktifkan Vercel Blob Store dan set BLOB_READ_WRITE_TOKEN di ENV Vercel." },
        { status: 500 }
      );
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
