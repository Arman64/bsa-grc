# BSA GRC - Blog Automation via MCP | SEO Friendly Auto Upload

## 🎯 Fitur Blog SEO Friendly + Automasi MCP

Website BSA GRC sekarang punya **blog SEO friendly** yang bisa di-automasi upload artikel via:
- **MCP (Model Context Protocol)** - untuk AI agents seperti Antigravity, Cursor, Windsurf
- **n8n / Zapier / Make** automation
- **REST API** langsung
- **Admin Panel Manual**

Semua artikel auto generate:
- Slug SEO friendly
- Meta Title + Description
- Open Graph + Twitter Cards
- Schema.org BlogPosting + Breadcrumb
- Reading time, sitemap.xml, robots.txt
- Kategori, tags, keywords untuk SEO

---

## 🚀 Endpoint Automasi MCP

### POST `/api/mcp/blog` - Publish Artikel Otomatis

**Auth**: Header `X-API-KEY` atau `X-MCP-KEY` atau `Authorization: Bearer`

Default key (ganti via ENV `MCP_API_KEY`):
```
bsa-grc-mcp-2026-secret
```

**Request Body JSON:**
```json
{
  "title": "Cara Memilih Kubah Masjid Terbaik 2026",
  "content": "## Pendahuluan\n\nKonten artikel dalam Markdown...\n\n### Sub Judul\n\nIsi artikel SEO friendly...",
  "excerpt": "Ringkasan 160 karakter untuk meta description",
  "coverImage": "https://bsagrc.co.id/wp-content/uploads/... atau /images/blog/...",
  "category": "Panduan Kubah",
  "tags": ["kubah masjid", "kubah GRC", "kontraktor kubah"],
  "keywords": ["model kubah masjid", "harga kubah GRC"],
  "seoTitle": "Cara Memilih Kubah Masjid Terbaik 2026 | BSA GRC",
  "seoDescription": "Panduan lengkap memilih model kubah masjid terbaik...",
  "author": "Tim BSA GRC",
  "isPublished": true
}
```

**Tags / Keywords**: Bisa string comma separated `"kubah, masjid, GRC"` atau array `["kubah", "masjid"]`

**Response Success 201:**
```json
{
  "success": true,
  "message": "Artikel berhasil dipublish otomatis via MCP",
  "data": {
    "id": 4,
    "slug": "cara-memilih-kubah-masjid-terbaik-2026",
    "title": "Cara Memilih Kubah Masjid Terbaik 2026",
    "url": "https://bsagrc.co.id/blog/cara-memilih-kubah-masjid-terbaik-2026",
    "readingTime": 6,
    "publishedAt": "2026-05-13T..."
  },
  "seo": {
    "title": "...",
    "description": "...",
    "keywords": [...],
    "ogImage": "...",
    "articleUrl": "...",
    "structuredData": { "@type": "BlogPosting", ... }
  }
}
```

---

### GET `/api/mcp/blog` - List Artikel (untuk cek duplikat)

Header sama `X-API-KEY`

Query: `?limit=10`

Response list slug & title untuk avoid duplikat.

---

## 🤖 Cara Automasi via MCP Server (Antigravity / Cursor)

### 1. Buat MCP Server Config

Buat file `mcp.json` di root project atau di Cursor/Windsurf MCP config:

```json
{
  "mcpServers": {
    "bsa-grc-blog": {
      "command": "node",
      "args": ["./mcp-server.js"],
      "env": {
        "BSA_GRC_URL": "https://bsagrc.co.id",
        "MCP_API_KEY": "bsa-grc-mcp-2026-secret"
      }
    }
  }
}
```

### 2. Contoh MCP Tool - `publish_blog`

MCP Server bisa expose tool `publish_blog_article`:

```javascript
// mcp-server.js (simplified)
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

server.setRequestHandler("tools/call", async (req) => {
  if (req.params.name === "publish_blog_article") {
    const { title, content, category } = req.params.arguments;
    
    const res = await fetch(`${process.env.BSA_GRC_URL}/api/mcp/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.MCP_API_KEY
      },
      body: JSON.stringify({
        title,
        content,
        category,
        tags: ["kubah masjid", "BSA GRC"],
        isPublished: true
      })
    });
    
    const data = await res.json();
    return { content: [{ type: "text", text: `Published: ${data.data.url}` }] };
  }
});
```

Di Antigravity, Anda bisa prompt:

> "Buatkan artikel SEO tentang harga kubah GRC 2026 dan publish via MCP BSA GRC"

AI akan auto generate konten Markdown + panggil tool `publish_blog_article` → artikel langsung live di `/blog/harga-kubah-grc-2026`

---

## 🔄 Automasi via n8n (No Code)

**Workflow n8n:**

1. **Trigger**: Schedule (setiap Senin jam 8 pagi) atau Webhook
2. **OpenAI / Gemini Node**: Generate artikel SEO
   - Prompt: "Buatkan artikel 800 kata tentang {topik kubah masjid} dengan format Markdown H2/H3, SEO friendly untuk kata kunci kontraktor kubah masjid"
3. **HTTP Request Node**:
   - Method: POST
   - URL: `https://bsagrc.co.id/api/mcp/blog`
   - Header: `X-API-KEY: bsa-grc-mcp-2026-secret`
   - Body JSON:
     ```json
     {
       "title": "={{ $json.title }}",
       "content": "={{ $json.content }}",
       "category": "={{ $json.category }}",
       "tags": "={{ $json.tags }}",
       "coverImage": "https://bsagrc.co.id/wp-content/uploads/2023/10/Kubah_Masjid-GRC1.webp",
       "isPublished": true
     }
     ```
4. **Telegram / Email Node**: Kirim notifikasi "Artikel baru publish: {{ url }}"

**Result**: Setiap minggu otomatis 1 artikel SEO baru tanpa manual!

---

## 📝 Format Konten Markdown SEO Friendly

Blog support Markdown full via `marked` library:

```markdown
## Pendahuluan (H2 untuk outline)

Memilih kubah masjid...

### 1. Model Setengah Bola (H3)

Model paling klasik...

**Kelebihan:**
- Tampilan megah
- Hemat biaya
- Mudah perawatan

| Diameter | Harga | Model |
|----------|-------|-------|
| Ø 6m | Rp 35jt | Setengah Bola |

> Tips BSA GRC: Musyawarahkan dengan panitia

**Kesimpulan** dengan CTA ke WhatsApp 0812-3046-9914
```

Auto convert ke HTML semantic dengan prose styling Tailwind.

---

## 🔍 SEO Features Setiap Artikel

Setiap artikel `/blog/[slug]` punya:

1. **Dynamic Metadata**:
   - Title: `seoTitle || title | BSA GRC`
   - Description: `seoDescription || excerpt`
   - Keywords meta
   - OG Image coverImage 1200x630
   - Twitter Card

2. **Schema.org**:
   - `BlogPosting` + `BreadcrumbList`
   - author Person, publisher Organization BSA GRC + logo
   - datePublished, dateModified, wordCount, timeRequired

3. **On-Page SEO**:
   - H1 judul artikel
   - H2/H3 hierarchy dari Markdown
   - Reading time
   - Table of contents sidebar
   - Related posts kategori sama
   - Author box BSA GRC
   - Share button
   - Internal linking ke /kontak, /layanan

4. **Sitemap**:
   - `/sitemap.xml` auto include semua blog published (daily changefreq, priority 0.7)
   - `robots.txt` allow

5. **Performance**:
   - Cover image next/image priority di detail page
   - Lazy related posts
   - Prose styling optimized

---

## 📊 Contoh Artikel Existing (SEO Optimized)

3 artikel sudah ada di `data/blog.json`:

1. `cara-memilih-model-kubah-masjid-terbaik-2026` - 6 menit baca, kategori Panduan Kubah, keywords model kubah
2. `harga-kubah-grc-per-meter-2026-terbaru-pabrik-trenggalek` - 8 menit, kategori Harga, tabel harga Ø 4-10m
3. `perbedaan-kubah-grc-enamel-galvalum-mana-terbaik` - 7 menit, kategori Edukasi, tabel perbandingan lengkap

Semua sudah SEO title + desc + keywords + schema.

---

## 🛠️ Admin Manual Tetap Bisa

**URL**: `/admin/blog` → Tulis Artikel Baru

Form:
- Upload cover image (ke `/images/blog/`)
- Judul, excerpt, konten Markdown (18 rows)
- Kategori, tags comma, status Published/Draft
- SEO Title, Desc, Keywords advanced (auto jika kosong)
- Save → langsung live

---

## 🔑 ENV Variables

Tambahkan di `.env.local` & Vercel:

```
MCP_API_KEY=bsa-grc-mcp-2026-secret-ganti-yang-kuat-di-production
BLOG_API_KEY=bsa-grc-mcp-2026-secret
NEXT_PUBLIC_SITE_URL=https://bsagrc.co.id

# Admin
ADMIN_EMAIL=admin@bsagrc.co.id
ADMIN_PASSWORD=BSA@GRC2026!
```

---

## 🚀 Deploy Checklist Blog

- [x] data/blog.json dengan 3 artikel SEO
- [x] lib/data.ts getBlogData, getPublishedBlogs, slugify, readingTime
- [x] /api/admin/blog CRUD protected
- [x] /api/mcp/blog POST automasi + GET list (API Key auth)
- [x] /blog page + /blog/[slug] page dengan schema BlogPosting
- [x] components/ui/BlogCard + BlogGrid + BlogContent (marked Markdown)
- [x] Admin /admin/blog UI upload image, Markdown editor
- [x] Sitemap include blog posts
- [x] Navigation include Blog
- [x] MCP docs + n8n workflow example
- [x] SEO friendly: meta, OG, schema, reading time, related

**Siap automasi upload via MCP / n8n AI!** Tinggal ganti MCP_API_KEY di production & gunakan.

Example cURL automasi:

```bash
curl -X POST https://bsagrc.co.id/api/mcp/blog \
  -H "X-API-KEY: bsa-grc-mcp-2026-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "5 Tips Merawat Kubah Masjid GRC Agar Awet 20 Tahun",
    "content": "## Pendahuluan\n\nMerawat kubah GRC...",
    "category": "Tips Perawatan",
    "tags": ["perawatan kubah", "kubah GRC", "tips masjid"],
    "isPublished": true
  }'
```
