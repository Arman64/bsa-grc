/**
 * BSA GRC - Seed Neon DB dari data/*.json + hardcoded testimonials/faqs
 * Jalankan: npx tsx scripts/seed.ts
 * ENV: DATABASE_URL=postgres://...
 */

import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { portfolios, services, settings, blogs, testimonials, faqs } from "../lib/schema";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL tidak ada di ENV");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log("Seeding Neon DB...");

  const dataDir = path.join(process.cwd(), "data");
  const portfolioData = JSON.parse(fs.readFileSync(path.join(dataDir, "portfolio.json"), "utf-8"));
  const servicesData = JSON.parse(fs.readFileSync(path.join(dataDir, "services.json"), "utf-8"));
  const settingsData = JSON.parse(fs.readFileSync(path.join(dataDir, "settings.json"), "utf-8"));
  const blogData = JSON.parse(fs.readFileSync(path.join(dataDir, "blog.json"), "utf-8"));

  try {
    await db.delete(portfolios);
    await db.delete(services);
    // Jangan hapus settings agar koordinat maps custom tidak hilang setiap seed
    // await db.delete(settings);
    await db.delete(blogs);
    await db.delete(testimonials);
    await db.delete(faqs);
    console.log("Cleared existing data (except settings to preserve maps coordinates)");
  } catch (e) {
    console.log("Clear skipped, will create via drizzle-kit push", (e as Error).message);
  }

  for (const p of portfolioData) {
    await db.insert(portfolios).values({
      title: p.title,
      slug: p.slug || null,
      category: p.category,
      location: p.location,
      year: p.year,
      image: p.image,
      diameter: p.diameter || null,
      height: p.height || null,
      material: p.material || null,
      client: p.client || null,
      description: p.description || null,
    });
  }
  console.log(`Seeded ${portfolioData.length} portfolios`);

  for (const s of servicesData) {
    await db.insert(services).values({
      id: s.id,
      slug: s.slug,
      title: s.title,
      shortTitle: s.shortTitle,
      description: s.description,
      longDescription: s.longDescription,
      features: s.features,
      image: s.image,
      originalImage: s.originalImage,
      icon: s.icon,
      priceRange: s.priceRange,
      isActive: s.isActive,
      landingPage: s.landingPage || null,
    });
  }
  console.log(`Seeded ${servicesData.length} services`);

  // Seed settings only if table empty - preserve custom maps coordinates
  const existingSettings = await db.select().from(settings).limit(1).execute();
  if (existingSettings.length === 0) {
    await db.insert(settings).values({
      company: settingsData.company,
      hero: settingsData.hero,
      usp: settingsData.usp,
      seo: settingsData.seo,
    });
    console.log("Seeded settings (was empty)");
  } else {
    console.log("Settings already exists, skip to preserve custom maps coordinates. Use /admin/settings to edit.");
    // Optionally update only non-map fields? For now skip entirely to preserve custom map
  }

  for (const b of blogData) {
    await db.insert(blogs).values({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      content: b.content,
      coverImage: b.coverImage,
      category: b.category,
      tags: b.tags,
      author: b.author,
      publishedAt: new Date(b.publishedAt),
      updatedAt: new Date(b.updatedAt),
      seoTitle: b.seoTitle || null,
      seoDescription: b.seoDescription || null,
      keywords: b.keywords || [],
      isPublished: b.isPublished,
      views: b.views || 0,
      readingTime: b.readingTime || 5,
    });
  }
  console.log(`Seeded ${blogData.length} blogs`);

  const testimonialsData = [
    { name: "H. Slamet Rahayu", location: "Masjid Jami' Trenggalek", role: "Ketua Panitia", text: "Kubah BSA GRC sudah 3 tahun tidak bocor sama sekali. Padahal dulu kubah lama bocor tiap hujan. Motifnya persis request kami, warga muji masjid jadi paling megah se-kecamatan.", result: "Anti bocor 3 tahun, jamaah +40%", photo: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-1-scaled.jpg", rating: 5, category: "Kubah GRC" },
    { name: "Ustadz Ahmad Fauzi", location: "Masjid At-Taqwa Kalimantan", role: "Takmir", text: "Order dari Kalimantan, khawatir pengiriman rusak. Ternyata packing kayu super aman, pasang 7 hari beres. Desain pinang khas Kutai persis. Harga masih masuk akal.", result: "Pasang luar Jawa 7 hari, packing aman", photo: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-2.jpg", rating: 5, category: "Kubah GRC" },
    { name: "Ibu Hj. Siti Aminah", location: "Musholla Al-Falah Surabaya", role: "Bendahara", text: "Awalnya budget mepet, BSA kasih solusi GRC bukan enamel jadi hemat 20jt. Bisa cat ulang sendiri nanti. Pelayanan ramah, survey gratis, tidak maksa.", result: "Hemat 20jt vs enamel, gratis survey", photo: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-3.jpg", rating: 5, category: "Kubah GRC" },
    { name: "H. Mulyadi", location: "Masjid Al-Huda Kediri", role: "Ketua Takmir", text: "Menara 25m BSA kokoh, gempa 5.2 SR tahun lalu tidak retak sama sekali. Adzan sekarang terdengar sampai sawah 1.5km. Warga yang dulu sholat di rumah sekarang ke masjid.", result: "Tahan gempa 5.2 SR, jangkauan adzan 1.5km", photo: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-4.jpg", rating: 5, category: "Menara GRC" },
    { name: "Pak Wahyu", location: "Masjid Baitul Muttaqin Ponorogo", role: "Takmir", text: "Lisplang kayu kami lapuk dimakan rayap, tiap tahun cat. Ganti GRC BSA motif ukiran, 2 hari pasang, tetangga muji masjid jadi kayak masjid di Turki. 2 tahun tidak pudar.", result: "Pasang 2 hari, 2 tahun tidak pudar", photo: "https://bsagrc.co.id/wp-content/uploads/2023/10/testimoni-6.jpg", rating: 5, category: "Lisplang GRC" },
    { name: "Hj. Fatimah", location: "Masjid Agung Jakarta", role: "Pengurus", text: "Masjid kami dulu panas, jamaah kipas-kipas terus. Pasang krawangan GRC BSA, adem, cahaya masuk cantik pola Islam di lantai. Jamaah betah, anak TPA senang foto. AC sekarang jarang nyala.", result: "Adem, hemat AC 40%, cahaya cantik", photo: "https://bsagrc.co.id/wp-content/uploads/2023/10/Mihrab-Masjid2.jpg", rating: 5, category: "Krawangan" },
  ];

  for (const t of testimonialsData) {
    await db.insert(testimonials).values({
      name: t.name,
      location: t.location,
      role: t.role,
      text: t.text,
      result: t.result,
      photo: t.photo,
      rating: t.rating,
      category: t.category,
      isActive: true,
    });
  }
  console.log(`Seeded ${testimonialsData.length} testimonials`);

  const faqsData = [
    { question: "Model Kubah yang Bagus?", answer: "Model kubah masjid yang kami produksi adalah model setengah bola, kubah madinah, kubah pinang, kubah bawang, dan model kustom. Jadi, untuk menyesuaikan pilihan kubah mana yang akan dipesan baiknya dimusyawarahkan bersama panitia pembangunan masjid untuk memilih model kubah masjid yang cocok dengan budaya lokal.", category: "Umum" },
    { question: "Harganya Berapa?", answer: "Harga kubah masjid sangat dipengaruhi oleh bahan, model, ukuran, dan lokasi pemasangannya. Namun sebagai gambaran, range harga untuk kubah masjid permeternya yaitu Rp 1.000.000 – 2.500.000 /m2. Gratis konsultasi estimasi & price list lengkap via WhatsApp.", category: "Harga & Biaya" },
    { question: "Area Pelayanannya Mana Saja?", answer: "Kami melayani pemasangan kubah masjid di seluruh Indonesia. Untuk Anda yang lokasi masjidnya di luar Pulau Jawa tidak perlu khawatir, karena sudah banyak pekerjaan di luar Pulau Jawa yang berhasil kami selesaikan. Pabrik di Trenggalek, Jatim tapi siap kirim & pasang nasional.", category: "Umum" },
    { question: "Bahan yang Dipakai Apa Saja?", answer: "Untuk produk kubah masjid ada 3 pilihan bahan: Enamel (paling eksklusif tahan 15-20 tahun, plat esser 0.7-0.9mm finishing Teflon), Galvalum (kuat, awet, ringan, plat 0.4-0.5mm Powder Coating tahan 7-10 tahun), dan GRC (motif variatif, mudah perawatan cat ulang, tebal frame 3cm panel 8mm). Semua bahan kualitas terbaik.", category: "Edukasi & Material" },
    { question: "Model Pembayarannya Bagaimana?", answer: "Pada umumnya untuk model pembayaran kubah masjid dapat dilakukan selama 3 tahap. Tahap pertama 35%, pembayaran kedua 45%, dan pembayaran ketiga 20% setelah serah terima. Transparan dan aman dengan kontrak kerja jelas.", category: "Harga & Biaya" },
    { question: "Bagaimana Masa Garansinya?", answer: "Kubah masjid yang kami produksi terdapat garansi kebocoran selama 1 tahun sejak serah terima pekerjaan selesai. Apabila masih dalam waktu garansi terdapat kendala kebocoran pada kubah, maka proses perbaikannya tidak dipungut biaya sama sekali.", category: "Umum" },
  ];

  for (const f of faqsData) {
    await db.insert(faqs).values({
      question: f.question,
      answer: f.answer,
      category: f.category,
      isActive: true,
    });
  }
  console.log(`Seeded ${faqsData.length} faqs`);

  console.log("Seed selesai! Deploy Vercel sekarang akan pakai DB Neon dengan semua data.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
