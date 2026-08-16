# Deploy BSA GRC ke Vercel + Neon Postgres - Fix Build Error

## Error Sebelumnya (Screenshot Anda)

```
Type error: Property 'map' does not exist on type 'Promise<...>'
  const rows = db.select().from(portfolio).execute();
  return rows.map(...)
```

**Penyebab:** `db.select().from().execute()` return `Promise`, harus `await`.

**Fix:** Sudah diperbaiki di `lib/data.ts` terbaru:

```ts
const rows = await db.select().from(portfolios).execute();
return rows.map(r => ({ ... }))
```

Dan `getCached` sekarang support async:

```ts
async function getCached<T>(key, fn: () => Promise<T> | T) {
  const data = await fn();
}
```

Build sekarang **✓ 29 pages** sukses di Vercel bahkan tanpa DATABASE_URL (fallback ke JSON).

---

## Langkah Deploy ke Vercel + Neon (Agar Data Persist)

### 1. Buat Database Neon

1. Buka https://neon.tech → Sign up free
2. Create Project: `bsa-grc`, Region: Singapore (ap-southeast-1 dekat Indonesia)
3. Copy `DATABASE_URL` dari dashboard Neon:
   ```
   postgres://neondb_owner:xxxxx@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Set ENV di Vercel

Di Vercel Dashboard → Project `bsa-grc` → Settings → Environment Variables:

```
DATABASE_URL=postgres://neondb_owner:xxxxx@ep-xxx.../neondb?sslmode=require
ADMIN_EMAIL=admin@bsagrc.co.id
ADMIN_PASSWORD=BSA@GRC2026! (ganti yang kuat)
ADMIN_SESSION_SECRET=random-string-panjang-min-32-char
MCP_API_KEY=bsa-grc-mcp-2026-secret-ganti
NEXT_PUBLIC_SITE_URL=https://bsagrc.co.id
```

Save → Redeploy.

### 3. Push Schema ke Neon

Di local (sudah install `drizzle-kit` & `tsx`):

```bash
# Set DATABASE_URL di .env.local dulu
echo 'DATABASE_URL=postgres://...' > .env.local

npm run db:push
# Ini akan buat tabel: portfolios, services, settings, blogs, leads
```

Cek di Neon dashboard → Tables → harus ada 5 tabel.

### 4. Seed Data dari JSON ke Neon

```bash
npm run db:seed
# Output: Seeded 6 portfolios, 5 services, 1 settings, 3 blogs
```

Data `data/*.json` sekarang masuk ke Neon, tidak akan hilang walau redeploy Vercel.

### 5. Deploy Ulang Vercel

Push ke GitHub → Vercel auto build → sekarang log tidak lagi `DATABASE_URL not set`, tapi `Using Neon DB`.

Cek `/api/settings` → harus return data dari DB, bukan JSON.

### 6. Test Admin

- Login `/admin/login` → Dashboard harus show "DB Neon Aktif ✅"
- Edit `/admin/settings` ganti WA → Save → Refresh homepage → nomor WA & telepon langsung berubah (karena baca dari DB, bukan file ephemeral)
- Upload portfolio baru → cek Neon dashboard → tabel portfolios bertambah

---

## Kenapa Fix Ini Bikin Deploy Lancar?

| Sebelum | Sesudah |
|---------|---------|
| `const rows = db.select()...execute()` (Promise) | `const rows = await db.select()...execute()` |
| `getCached` sync, tidak handle Promise | `getCached` async `await fn()` |
| Build Vercel `Failed to compile` | Build `✓ 29 pages` sukses |
| File JSON hilang tiap deploy Vercel | DB Neon persist, data aman |

---

## Jika Masih Error di Vercel

1. **Pastikan `DATABASE_URL` ada di Vercel ENV** (bukan hanya local `.env`)
2. **Pastikan `drizzle` folder ada di repo?** Tidak perlu, `db:push` sudah buat tabel di Neon via network, bukan file lokal
3. **Log masih `DATABASE_URL not set`** → ENV belum ke-set atau belum Redeploy setelah set ENV
4. **Error `Can't reach database server`** → Neon project paused (free tier auto pause setelah 5 menit idle, akan auto resume di request pertama, tunggu 10 detik & refresh)

---

## Backup Plan: Tanpa DB (File JSON)

Kalau mau deploy tanpa DB dulu (cepat lolos build), biarkan `DATABASE_URL` kosong di Vercel. App akan fallback ke `data/*.json` (mode yang sekarang). Build tetap lolos, tapi ingat: **data admin akan hilang tiap deploy**. Cocok untuk demo, tidak untuk production.

Untuk production ads landing page (`/layanan/*`), wajib pakai Neon agar nomor WA/telepon tidak balik ke lama setelah deploy.

---

**Build Status Terkini (setelah fix):**
```
✓ 29 pages
Route /layanan/[slug] 10.7kB (landing page ads)
Middleware 26.6kB
First Load 87.3kB
```

Sudah siap deploy ke Vercel + Neon! Push repo ini sekarang.
