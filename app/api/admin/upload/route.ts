import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
 try {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "portfolio";

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

  // Convert to AVIF for performance - quality 55, effort 4 = best size/speed balance
  // AVIF saves 50-90% vs JPG/PNG per our conversion test (1296KB -> 297KB total, saved 77%)
  try {
   await sharp(inputBuffer)
    .avif({
     quality: 55,
     effort: 4,
    })
    .toFile(filePath);
  } catch (sharpError) {
   console.error("Sharp AVIF conversion failed, fallback to original:", sharpError);
   // Fallback: save original if AVIF conversion fails
   const fallbackName = `${Date.now()}-${baseName}${path.extname(file.name) || ".webp"}`;
   const fallbackPath = path.join(uploadDir, fallbackName);
   fs.writeFileSync(fallbackPath, inputBuffer);
   const fallbackUrl = `/images/${safeFolder}/${fallbackName}`;
   return NextResponse.json({
    success: true,
    message: "Upload berhasil (fallback original, AVIF conversion failed)",
    data: {
     url: fallbackUrl,
     fileName: fallbackName,
     size: file.size,
     type: file.type,
     format: "original",
    },
   });
  }

  const avifStat = fs.statSync(filePath);
  const publicUrl = `/images/${safeFolder}/${fileName}`;

  return NextResponse.json({
   success: true,
   message: `Upload berhasil - AVIF format (${(avifStat.size / 1024).toFixed(1)}KB, saved ~${((1 - avifStat.size / file.size) * 100).toFixed(0)}% vs original)`,
   data: {
    url: publicUrl,
    fileName,
    size: avifStat.size,
    originalSize: file.size,
    type: "image/avif",
    format: "avif",
   },
  });
 } catch (error) {
  console.error("Upload error:", error);
  return NextResponse.json({ success: false, message: "Gagal upload gambar - " + String(error) }, { status: 500 });
 }
}
