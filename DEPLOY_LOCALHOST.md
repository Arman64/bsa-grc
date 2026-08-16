# Deploy BSA GRC di Localhost Lokal - Panduan Lengkap (Anti Ribet)

> Next.js 14 + Tailwind + Neon DB (opsional) + Admin + Blog SEO + Landing Page Ads

Repo ini sudah fix `rows.map` Promise error Vercel & phone/WA sync. Bisa jalan **tanpa database** (pakai file JSON) untuk localhost biar tidak susah.

---

## 1. Syarat Wajib

- **Node.js >=18.17** (cek: `node -v`). Kalau masih v16, install dari https://nodejs.org (LTS 20)
- **npm >=9** (bawaan Node 18+)
- **Git**
- **OS:** Windows 10/11, Mac, Linux semua bisa

```bash
node -v  # harus v18.17.0 atau lebih, contoh v20.11.0
npm -v   # harus 9+
```

Jika salah, uninstall Node lama, install Node 20 LTS.

---

## 2. Clone Project

### Opsi A: Dari GitHub (jika sudah push)
```bash
git clone https://github.com/username/bsa-grc.git
cd bsa-grc
```

### Opsi B: Dari ZIP Arena (yang Anda download tadi)
- Extract `bsa-grc-deploy.zip` → folder `bsa-grc`
- `cd bsa-grc` di terminal / VS Code

---

## 3. Buat `.env.local` Paling Simpel (Tanpa DB - Paling Gampang)

Buat file `.env.local` di root (sejajar `package.json`), isi ini saja biar langsung jalan tanpa setup Neon:

```env
# Kosongkan DATABASE_URL = pakai data/*.json (portfolio, services, blog, settings) - Persist di laptop, tidak hilang seperti di Vercel
# DATABASE_URL=

ADMIN_EMAIL=admin@bsagrc.co.id
ADMIN_PASSWORD=BSA@GRC2026!
ADMIN_SESSION_SECRET=ganti-min-32-char-random-contoh-bsagrc-trenggalek-2026-super-secret

NEXT_PUBLIC_SITE_URL=http://localhost:3000
MCP_API_KEY=bsa-grc-mcp-2026-secret
```

> **Kenapa tanpa DATABASE_URL?** Kode `lib/data.ts` sudah auto fallback: kalau `DATABASE_URL` tidak ada → baca `data/*.json`. Jadi **tidak perlu install Postgres/MySQL di localhost**. Data WA/telepon yang Anda edit di `/admin/settings` akan disimpan ke `data/settings.json` dan langsung tampil di frontend.

**Jika mau pakai Neon Postgres di localhost juga (opsional, untuk test biar sama seperti Vercel):**

```env
DATABASE_URL=postgres://neondb_owner:xxx@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
ADMIN_EMAIL=admin@bsagrc.co.id
ADMIN_PASSWORD=BSA@GRC2026!
ADMIN_SESSION_SECRET=random-32-char
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Dapatkan `DATABASE_URL` dari https://neon.tech → Create Project Singapore → Copy connection string.

---

## 4. Install Dependencies

```bash
npm install
# tunggu 1-3 menit, jangan tutup
```

Jika error `EACCES` di Mac/Linux: `sudo npm install` atau fix npm permission.

---

## 5. Jalankan di Localhost

### Mode DEV (untuk ngoding, memang agak lambat first load 3-8 detik - NORMAL)
```bash
npm run dev
# Buka http://localhost:3000
# Admin: http://localhost:3000/admin/login
# Login: admin@bsagrc.co.id / BSA@GRC2026!
```

### Mode PRODUCTION (untuk demo ke klien, cepat, LCP <2.5s - REKOMENDASI)
```bash
npm run build
npm start
# Buka http://localhost:3000
```

**Bedanya:**
- `dev`: compile on-demand tiap halaman, ada HMR, source map, tidak minified → lemot di awal, normal.
- `start` (setelah build): sudah pre-render 34 halaman, minified, image optimized → cepat 1-2 detik seperti di hosting.

**Jika port 3000 dipakai XAMPP/Laragon:**
```bash
npm run dev -- -p 3001
# atau
npx kill-port 3000
```

---

## 6. Test Fitur Penting

1. **Beranda:** `/` → cek hero, layanan, portofolio, stats
2. **Landing Page Ads (tanpa navigasi):** `/layanan/kubah-grc` → harusnya **tidak ada header menu**, hanya top bar putih + logo + phone/WA, form 3 field, CTA gold `Dapatkan Penawaran Gratis Sekarang`, testimoni, garansi
3. **Admin:**
   - `/admin/login` → login → Dashboard harus muncul stats 4 kotak (Portfolio, Layanan, Blog, Proyek)
   - `/admin/settings` → Ganti WA/Telepon → centang "Samakan No. Telp & WA" → Save → buka `/` + hard refresh Ctrl+Shift+R → nomor di header top bar, footer, floating dual FAB tengah bawah harus ikut berubah
   - `/admin/portfolio` → Upload gambar (JPG/WebP max 5MB) → Save → lihat di `/portofolio`
   - `/admin/blog` → Tulis artikel → Publish → lihat di `/blog`
4. **Floating Button:** Di semua halaman public (bukan `/admin`) harus ada 2 tombol bulat di **tengah bawah**: maroon Telepon + hijau WhatsApp berdampingan. Di `/admin/*` harus hilang (sudah fix).

---

## 7. Database (Opsi Lanjut)

### Tanpa DB (File JSON) - Untuk localhost paling gampang:
- Tidak perlu set `DATABASE_URL`
- Data di `data/portfolio.json`, `services.json`, `settings.json`, `blog.json`
- Backup: copy folder `data/` + `public/images/`
- Kekurangan: Kalau deploy ke Vercel, data hilang tiap deploy (karena filesystem ephemeral)

### Pakai Neon Postgres (Untuk Vercel + localhost sama):
```bash
# 1. Set DATABASE_URL di .env.local
# 2. Push schema ke Neon:
npm run db:push

# 3. Seed data JSON lama ke Neon:
npm run db:seed
# Output: Seeded 6 portfolios, 5 services, 1 settings, 3 blogs
```

Sekarang data ada di Neon, tidak hilang walau redeploy Vercel.

---

## 8. Troubleshooting Localhost Lemot / Error

| Error / Gejala | Penyebab | Solusi |
|---|---|---|
| `Cannot find module 'next'` | Belum `npm install` | `npm install` |
| `Type error: Property 'map' does not exist on Promise` | File `lib/data.ts` versi lama tanpa `await` | Pull repo terbaru (sudah fix pakai `await db.select()`) |
| `DATABASE_URL not set - fallback to JSON` | Normal kalau tanpa DB | Abaikan, atau isi `DATABASE_URL` Neon |
| `Port 3000 in use` | XAMPP / Laragon / dev lain pakai 3000 | `npx kill-port 3000` atau `npm run dev -- -p 3001` |
| `Module not found: Can't resolve 'fs'` | `app/api/contact` pakai `runtime = edge` + `fs` | Sudah fix jadi `runtime = nodejs` di repo terbaru |
| Gambar tidak muncul / upload hilang | `public/images` tidak writable | Di Windows, klik kanan folder → Properties → Uncheck Read-only |
| Lemot 10 detik di dev | Memang dev Next.js lambat | Pakai `npm run build && npm start` untuk test cepat, dev hanya untuk coding |
| `EACCES` npm install Mac | Permission npm | `sudo chown -R $(whoami) ~/.npm` |
| Admin login failed | ENV salah | Cek `ADMIN_EMAIL` & `ADMIN_PASSWORD` di `.env.local` |

---

## 9. Build Production & Deploy

### Localhost Production Test:
```bash
npm run build
# harus: ✓ 34 pages, First Load 87.3kB
npm start
```

### Deploy ke Vercel:
1. Push repo ke GitHub (sudah ada `bsa-grc-deploy.zip` siap)
2. Vercel → Add New Project → Import `bsa-grc`
3. Set ENV di Vercel Dashboard:
   ```
   DATABASE_URL=postgres://...
   ADMIN_EMAIL=...
   ADMIN_PASSWORD=...
   ADMIN_SESSION_SECRET=...
   MCP_API_KEY=...
   NEXT_PUBLIC_SITE_URL=https://bsagrc.co.id
   ```
4. Deploy → `✓ 34 pages` → Set `npm run db:push && npm run db:seed` sekali via local dengan DATABASE_URL yang sama

Lihat `DEPLOY_NEON.md` untuk detail fix error `rows.map`.

---

## 10. File Penting

- `PRD.md` - Single Source of Truth
- `ADMIN_GUIDE.md` - Cara pakai admin
- `MCP_BLOG_AUTOMATION.md` - Automasi blog via MCP/n8n
- `DEPLOY_NEON.md` - Fix deploy Vercel + Neon
- `DEPLOY_LOCALHOST.md` - File ini

---

## Kesimpulan

**Untuk localhost lokal paling gampang tanpa ribet DB:**
1. Node 18+ → `npm install`
2. `.env.local` kosongkan `DATABASE_URL` (pakai JSON)
3. `npm run build && npm start` → buka `http://localhost:3000`

Sudah langsung bisa edit WA/telepon di `/admin/settings` dan lihat di frontend tanpa setup Postgres.

Jika mau deploy hosting beneran (Vercel), baru pakai Neon + `npm run db:push && npm run db:seed`.

Selamat mencoba! Jika masih susah, screenshot errornya + `node -v` + OS, saya bantu debug.
