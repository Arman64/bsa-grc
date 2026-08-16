# BSA GRC - Admin Panel Guide | Kelola Gambar, Teks & Portofolio

## 🎯 Cara Login Backend

### URL Admin
- **Login**: `https://bsagrc.co.id/admin/login` (local: `http://localhost:3000/admin/login`)
- **Dashboard**: `/admin` (auto redirect jika belum login)

### Kredensial Default
```
Email: admin@bsagrc.co.id
Password: BSA@GRC2026!
```

> ⚠️ **Production**: Wajib ganti via Environment Variables di Vercel:
> - `ADMIN_EMAIL`
> - `ADMIN_PASSWORD`
> - `ADMIN_SESSION_SECRET` (random string panjang)

 ENV sudah diset di Vercel → Settings → Environment Variables

---

## 📸 Cara Kelola Konten

### 1. Kelola Portofolio (Gambar & Detail Pekerjaan)

**Menu**: Admin → Portofolio → Tombol "Tambah Portofolio"

Form yang bisa diatur:
- **Gambar Proyek**: Klik upload (JPG, PNG, WebP max 5MB). Otomatis tersimpan ke `/public/images/portfolio/` dan URL muncul. Atau manual URL `https://...`
- **Judul Proyek**: Contoh "Kubah Masjid GRC Model Bawang Gold"
- **Kategori**: Kubah GRC, Menara GRC, Krawangan, Mihrab ACP, Lisplang
- **Lokasi**: "Trenggalek, Jatim"
- **Tahun**: 2023
- **Klien**: Nama masjid
- **Diameter/Ukuran**: "Ø 8m" - tampil sebagai icon Ruler di kartu
- **Material**: "GRC Premium" - icon Building2
- **Deskripsi**: Detail pengerjaan

**Edit**: Hover gambar di dashboard portofolio → klik Edit → ubah → Simpan
**Hapus**: Hover → Trash icon → konfirmasi

**Langsung Live**: Setelah simpan, `data/portfolio.json` terupdate, homepage PortofolioSection, halaman /portofolio langsung menampilkan data baru. No deploy ulang needed di local, di Vercel butuh persist DB.

---

### 2. Kelola Layanan (Teks & Gambar)

**Menu**: Admin → Layanan

Daftar 5 layanan BSA GRC:
- Kubah Masjid GRC
- Menara Masjid GRC
- Lisplang GRC
- Krawangan & Ornamen GRC
- Mihrab ACP

Klik "Edit Teks & Gambar":
- **Gambar**: Upload baru (otomatis ke `/public/images/services/`)
- **Judul Lengkap & Short Title**: untuk SEO & badge
- **Harga Range**: "Rp 1.000.000 - 2.500.000 /m²"
- **Deskripsi Singkat**: untuk kartu grid
- **Deskripsi Panjang**: untuk halaman detail /layanan/[slug]
- **Fitur**: Pisah dengan koma, contoh "Tahan Lama, Desain Custom, Garansi 1 Tahun" → tampil sebagai badge CheckCircle2

---

### 3. Kelola Pengaturan (Teks Global & Gambar Hero)

**Menu**: Admin → Pengaturan

**3 Tab dalam 1 halaman:**

#### a. Informasi Perusahaan
- Nama, Tagline, Deskripsi
- WhatsApp: `6281230469914` (format internasional tanpa +)
- WhatsApp Display: `0812-3046-9914` (tampil di frontend)
- Alamat pabrik lengkap
- Email, Tahun Pengalaman, Proyek Selesai (angka untuk stats)

#### b. Hero Section - Beranda
- **Hero Image**: Gambar utama LCP (Largest Contentful Paint). Upload WebP max 500KB untuk kecepatan <2.5s. Priority load.
- **Judul Hero (H1)**: "Kontraktor Kubah GRC..."
- **Sub Judul**: Deskripsi panjang
- Preview langsung di form

#### c. USP - Keunggulan
- 4 poin keunggulan di hero (Tahan Lama, Harga Terjangkau, Desain Kustom, Tahan Cuaca)
- Edit title + description masing-masing

**Simpan**: Tombol "Simpan Semua Pengaturan" → `data/settings.json` terupdate.

---

## 🖼️ Upload Gambar - Teknis

**API**: `POST /api/admin/upload` (protected, butuh login)

- Field: `file` (multipart) + `folder` (portfolio / services)
- Validasi: JPG, JPEG, PNG, WebP, AVIF, max 5MB
- Disimpan: `/public/images/{folder}/{timestamp}-{filename}`
- Return: `{ success: true, data: { url: "/images/portfolio/...", fileName, size } }`
- Di frontend gunakan URL tersebut di field gambar

**Tips Optimasi:**
- Kompres gambar sebelum upload (TinyPNG)
- Gunakan WebP untuk ukuran kecil
- Hero max 500KB, portfolio max 1MB, admin akan warning jika >5MB

---

## 🔐 Keamanan

- **Middleware**: `/admin/*` & `/api/admin/*` (kecuali login) cek cookie `bsa_admin_session` httpOnly, secure production, 8 jam expiry
- **Session**: Base64 encoded + secret (gunakan JWT di production real)
- **Logout**: POST `/api/admin/logout` hapus cookie

**Untuk Production Vercel:**
- File `data/*.json` tidak persist di serverless (ephemeral). Solusi:
  - Opsional 1: Pakai Vercel Postgres + Prisma (recommended)
  - Opsional 2: Supabase / Firebase
  - Opsional 3: Sanity.io / Contentful headless CMS
  - Opsional 4: Tetap file JSON tapi commit ke GitHub via API (tidak rekomendasi)

Versi saat ini cocok untuk VPS / Docker / self-host dimana filesystem writable persist.

---

## 🔄 Alur Data (Dynamic)

```
Admin UI (/admin/portfolio)
   ↓ fetch POST/PUT/DELETE
API Route (/api/admin/portfolio)
   ↓ fs.writeFile data/portfolio.json
Lib Data (lib/data.ts) getPortfolioData()
   ↓ readFileSync
Frontend (PortfolioSection, /portofolio page)
   ↓ next/image render
```

**Keunggulan**: Edit tanpa coding, tanpa deploy ulang di local. Di Vercel perlu adaptasi DB.

---

## 📋 Checklist Setelah Login

1. Cek Dashboard → lihat stats Total Portofolio, Layanan Aktif
2. Portofolio → tambah 1 proyek baru dengan gambar upload → lihat di Beranda & /portofolio
3. Layanan → edit harga Kubah GRC → lihat di /layanan/kubah-grc
4. Pengaturan → ganti nomor WA & alamat → lihat di Footer & Contact
5. Hero → ganti Hero Image → lihat LCP di Beranda

---

## 🆘 Troubleshooting

- **Gagal login**: Cek ENV ADMIN_EMAIL/PASSWORD di Vercel, clear cookie
- **Upload gagal**: Cek ukuran file <5MB & format JPG/WebP, folder writable
- **Perubahan tidak muncul**: Hard refresh Ctrl+Shift+R, cek data/*.json terupdate, restart dev server
- **Di Vercel data hilang setelah deploy**: Wajar, filesystem ephemeral. Migrasi ke DB (Prisma + Postgres).

---

## 🚀 Next Step Production

Jika ingin 100% persist di Vercel:

1. Buat Supabase project
2. Install Prisma: `npm i prisma @prisma/client`
3. Model: Portfolio, Service, Settings
4. Ganti lib/data.ts dari fs read → Prisma client
5. Upload ke Supabase Storage bukan public folder

Saya bisa bantu migrasi ke Supabase/Prisma jika dibutuhkan.

---

**Default Login**: admin@bsagrc.co.id / BSA@GRC2026! | URL: /admin/login
