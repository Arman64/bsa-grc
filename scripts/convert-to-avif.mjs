import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicImagesDir = path.join(process.cwd(), "public", "images");

async function convertImageToAvif(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".avif") return null; // already AVIF

  // Only convert image files
  if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) return null;

  const avifPath = filePath.replace(new RegExp(`${ext}$`, "i"), ".avif");

  // Skip if AVIF already exists and newer
  if (fs.existsSync(avifPath)) {
    const origStat = fs.statSync(filePath);
    const avifStat = fs.statSync(avifPath);
    if (avifStat.mtimeMs > origStat.mtimeMs) {
      console.log(`Skip (up-to-date): ${path.relative(process.cwd(), avifPath)}`);
      return null;
    }
  }

  try {
    const inputBuffer = fs.readFileSync(filePath);
    
    // Convert to AVIF with high quality but smaller size
    // Quality 50-60 gives excellent visual + ~50-70% size reduction vs PNG/JPG
    await sharp(inputBuffer)
      .avif({
        quality: 55,
        effort: 4, // 0-9, 4 is good balance speed vs compression
      })
      .toFile(avifPath);

    const origSize = fs.statSync(filePath).size;
    const avifSize = fs.statSync(avifPath).size;
    const saving = ((1 - avifSize / origSize) * 100).toFixed(1);

    console.log(`Converted: ${path.relative(process.cwd(), filePath)} (${(origSize/1024).toFixed(1)}KB) -> ${path.relative(process.cwd(), avifPath)} (${(avifSize/1024).toFixed(1)}KB) | Saved ${saving}%`);

    return { orig: filePath, avif: avifPath, origSize, avifSize, saving };
  } catch (error) {
    console.error(`Failed to convert ${filePath}:`, error.message);
    return null;
  }
}

async function walkDir(dir, results = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await walkDir(fullPath, results);
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  console.log("Converting all images in public/images to AVIF (quality 55, effort 4) for best performance...\n");

  if (!fs.existsSync(publicImagesDir)) {
    console.log("public/images not found");
    return;
  }

  const allFiles = await walkDir(publicImagesDir);
  let converted = 0;
  let totalOrig = 0;
  let totalAvif = 0;

  for (const filePath of allFiles) {
    const result = await convertImageToAvif(filePath);
    if (result) {
      converted++;
      totalOrig += result.origSize;
      totalAvif += result.avifSize;
    }
  }

  console.log(`\nDone! Converted ${converted} images.`);
  if (converted > 0) {
    console.log(`Total: ${(totalOrig/1024).toFixed(1)}KB -> ${(totalAvif/1024).toFixed(1)}KB | Saved ${((1 - totalAvif/totalOrig)*100).toFixed(1)}%`);
    console.log(`\nFor best performance, update code to use .avif files. Next.js Image with formats: ["image/avif", "image/webp"] will auto-serve AVIF to supporting browsers.`);
  }
}

main();
