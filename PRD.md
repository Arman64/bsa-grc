# Product Requirements Document (PRD)
## BSA GRC Website Revamp

### 1. Tujuan Proyek
Proyek ini bertujuan untuk membangun ulang (revamp) website perusahaan BSA GRC ([bsagrc.co.id](http://bsagrc.co.id)) menggunakan teknologi frontend modern (Next.js, TypeScript, Tailwind CSS) dengan fokus utama pada optimalisasi kecepatan, Technical SEO, dan pengalaman pengguna (UX) yang lebih baik. Tujuannya adalah meningkatkan konversi calon klien (B2B dan institusi seperti panitia masjid) melalui kecepatan loading yang instan dan visibilitas pencarian (SEO) yang maksimal.

### 2. Informasi Proyek
- **Nama Perusahaan:** BSA GRC
- **URL Saat Ini:** [bsagrc.co.id](http://bsagrc.co.id)
- **Spesialisasi Utama:** Kontraktor dan produksi kubah, menara, lisplang, dan krawangan GRC (Glassfibre Reinforced Concrete), serta Mihrab ACP (Aluminium Composite Panel).
- **Lokasi Pabrik:** Dsn. Setri, Klampis, Wonorejo, Kec. Gandusari, Kabupaten Trenggalek, Jawa Timur.
- **Kontak Utama:** 0812-3046-9914 (WhatsApp)
- **Teknologi Pembangunan:** Google Antigravity (sebagai AI IDE/Agent), Next.js (App Router), Tailwind CSS.

### 3. Lingkup Proyek & Fitur Utama

#### 3.1. Struktur Halaman Utama (Sitemap)
- **Beranda (Homepage):** Menampilkan nilai proposisi (Value Proposition), layanan unggulan, galeri portofolio terbaru, dan ajakan bertindak (CTA).
- **Profil Perusahaan (Tentang Kami):** Sejarah, visi, misi, lokasi pabrik di Trenggalek, dan nilai profesionalisme BSA GRC.
- **Layanan Kami (Services):**
  - Kubah Masjid GRC
  - Menara Masjid
  - Lisplang GRC
  - Krawangan & Ornamen GRC
  - Mihrab ACP
- **Galeri Portofolio (Proyek):** Halaman grid dinamis yang menampilkan foto resolusi tinggi dari proyek-proyek yang telah diselesaikan.
- **Kontak (Contact Us):** Formulir penawaran, informasi kontak, tombol WhatsApp, dan integrasi Google Maps lokasi pabrik.

#### 3.2. Spesifikasi Teknis & Framework
- **Frontend Framework:** Next.js (App Router) memastikan Server-Side Rendering (SSR) dan Static Site Generation (SSG).
- **Styling:** Tailwind CSS untuk UI yang responsif, ringan, dan utility-first.
- **Bahasa Pemrograman:** TypeScript untuk stabilitas codebase dan meminimalisir kesalahan (bugs).
- **Komponen UI:** Menggunakan komponen modern (radix-ui atau headlessui jika diperlukan) untuk memastikan aksesibilitas (a11y).

#### 3.3. Optimalisasi Kecepatan (Performance)
- **Optimasi Gambar (Next/Image):** Seluruh foto portofolio harus menggunakan komponen `<Image />` dari Next.js untuk format WebP otomatis, lazy loading, dan pengaturan dimensi untuk mencegah Cumulative Layout Shift (CLS).
- **Hero Section yang Cepat:** LCP (Largest Contentful Paint) harus termuat di bawah 2.5 detik. Aset visual utama pada Beranda harus di-preload.
- **Code Splitting & Minification:** Bundle JavaScript harus minimal, dimuat secara asinkron agar tidak memblokir rendering HTML.

#### 3.4. Technical SEO
- **Server-Side Metadata:** Judul (Title) dan Deskripsi Meta (Meta Description) yang dinamis pada setiap halaman untuk crawling yang optimal.
- **Sitemap & Robots.txt:** Auto-generated `sitemap.xml` dan file `robots.txt` yang tervalidasi.
- **Schema Markup (Structured Data):** Implementasi JSON-LD berjenis `LocalBusiness` dan `Contractor` yang memuat nama perusahaan, URL, logo, kontak, dan alamat spesifik (Trenggalek).
- **Clean URLs:** Struktur routing Next.js yang deskriptif (contoh: `/layanan/kubah-grc`).
- **Semantic HTML:** Penggunaan hierarki tag yang benar `<header>`, `<main>`, `<article>`, `<h1>` hingga `<h6>`).

#### 3.5. UX & Konversi (Lead Generation)
- **Floating CTA:** Tombol "Hubungi WhatsApp" yang persisten melayang (floating) pada viewport mobile dan desktop.
- **Integrasi Form:** Formulir kontak penawaran pada halaman Hubungi Kami. Aksi (submit) form ini harus diarahkan ke webhook (yang dapat dihubungkan nanti ke n8n untuk automasi CRM/notifikasi).

### 4. Panduan Desain (Styling)
- **Warna Brand:** Warna utama (Primary Color) adalah **Merah Maroon** dan **Putih**, dikombinasikan dengan teks berwarna **Gold Premium** untuk memberikan kesan elegan dan profesional.
- **Aset Visual:** Gunakan logo, foto proyek, dan aset gambar asli yang diambil/diunduh langsung (scraped/extracted) dari website sumber saat ini ([bsagrc.co.id](http://bsagrc.co.id)).
- Mengadopsi gaya visual yang konsisten dengan materi promosi BSA GRC: menggunakan latar belakang gradien lembut, pola geometris Islam minimalis, dan hierarki teks yang sangat jelas.
- Menggunakan elemen ikonografi (ikon khusus) untuk menampilkan detail atau info proyek pada setiap portofolio agar mudah dipindai oleh audiens.

### 5. Langkah Eksekusi via Google Antigravity
1. **Fase Inisiasi:** Memerintahkan agen Antigravity untuk membuat scaffolding proyek (Next.js, TypeScript, Tailwind).
2. **Fase Strukturasi:** Menyusun routing untuk setiap halaman utama beserta layout dasarnya.
3. **Fase Desain UI:** Mengimplementasikan desain setiap halaman (Beranda, Layanan, Portofolio) menggunakan utilitas Tailwind.
4. **Fase Optimasi:** Mengganti tag `<img>` standar dengan `next/image`, menerapkan metadata SEO, dan menyisipkan Schema Markup.
5. **Fase Integrasi:** Membangun fungsionalitas formulir kontak dan komponen floating CTA.
6. **Fase Testing:** Mengaudit performa lokal menggunakan Lighthouse/Core Web Vitals check untuk memastikan skor (Performance, Accessibility, Best Practices, SEO) berada di atas 90.

### 6. Rencana Deployment
- Setelah struktur proyek (codebase) selesai di-generate dan diaudit, proyek disiapkan untuk diunggah (push) ke repositori (contoh: GitHub).
- Target hosting edge-network yang direkomendasikan adalah **Vercel**, mengingat integrasi native dengan Next.js yang memberikan performa distribusi statis (CDN) secara global.
