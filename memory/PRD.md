# BSA GRC — Product Requirements & Build Log

## Original Problem Statement
User has a Next.js 14 (App Router) + Drizzle ORM + Neon Postgres company-profile website "BSA GRC" (kubah/menara/ornamen GRC masjid), deployed on Vercel. The public frontend looks good, but the admin panel was buggy and most content shown on the frontend could NOT be edited. User wants the admin REBUILT into a WordPress-like admin (familiar to WP + theme-builder users), with super-complete settings to control everything on the frontend. Brand colors: maroon + gold.

## Stack / Environment
- Next.js 14 App Router + TypeScript, Drizzle ORM, Neon Postgres (shared DB — this app owns only `bsa_*` tables).
- Deploy target: Vercel + Neon. Local preview here: Next.js on :3000, a raw TCP proxy (`scripts/api-proxy.cjs`, supervisor `apiproxy`) bridges pod :8001 → :3000 so `/api` works through the ingress. Supervisor programs: `nextjs`, `apiproxy` (added in /etc/supervisor/conf.d/).

## Architecture Decisions
- **Single source of truth for content**: `lib/content-defaults.ts` defines full default content for every page + appearance/navigation/footer/integrations. Public components render `defaults ⊕ DB` (deep-merge) so the site is always complete AND fully editable.
- **Per-page content** stored in `bsa_page_settings.sections` (jsonb). **Site chrome** (logo/nav/footer/integrations) stored in new jsonb columns on `bsa_settings`.
- **Instant reflect fix**: `lib/db.ts` neon client uses `fetchOptions:{cache:"no-store"}` and all public pages are `force-dynamic` → admin edits show on the live site immediately (root cause of the old "can't edit" problem: dead `/admin/pages` editor wrote to a table nothing read + Next fetch-cache).
- **Auth hardened** (integration_expert playbook adapted to Next/Drizzle/Neon): bcrypt hashing, JWT (jose) in httpOnly cookie, middleware route protection (Edge), IP+email brute-force lockout (5 attempts / 15 min), lazy admin seed from env, in-admin change-password. New tables: `bsa_admin_users`, `bsa_login_attempts`.

## What's Implemented (2026-06)
- **WordPress-style admin shell** (`components/admin/AdminLayout.tsx`): maroon admin bar + dark grouped sidebar (Utama/Konten/Tampilan/Sistem), "Lihat Situs", account + logout. Public Header/Footer hidden on /admin via `ChromeGate`.
- **Structured per-section page editor** (`/admin/pages` + `/admin/pages/[slug]`) using recursive `FieldEditor` (labeled inputs, image upload, repeatable lists/cards) — maps exactly to each frontend block. Includes per-page SEO.
- **Modules**: Tampilan/Appearance (logo, favicon, brand, theme color, top bar, footer), Menu builder (header + footer, reorder), Pengaturan Umum (company/contact/maps/SEO global), SEO & Integrasi (GA4, Meta Pixel, contact webhook, custom JS), Akun & Password (change password). Existing CRUD (services/portfolio/blog/testimonials/faqs/media) re-skinned under new shell.
- **Frontend fully wired** to DB content (Hero/Stats/About/Process/Services/Portfolio/Testimonials/FAQ/CTA/Contact + Header/Footer/layout favicon+scripts). **All leaked placeholder text fixed** ("dari database", "data dari, kelola di /admin/...", "Kenapa Pilih BSA GRC? ()", broken sentences).
- New API routes: `/api/admin/{login,logout,me,change-password,page-content,chrome}`. Contact form reads webhook from DB integrations.

## Testing
- iteration_1: 18/18 backend pass, all frontend flows pass. Save→reflect verified end-to-end (page hero + appearance topbar). Public pages clean of forbidden strings. Login/brute-force/protection verified. Tests: `/app/backend/tests/test_bsa_admin.py`.

## Deploy notes (Vercel)
- DB migration + content seed already applied to the shared Neon DB (`scripts/migrate.mjs`, `scripts/seed-content.ts`).
- Add Vercel env vars: `JWT_SECRET` (recommended), keep `ADMIN_EMAIL`/`ADMIN_PASSWORD` for initial seed. `DATABASE_URL` already set.
- Lockfile normalized to `package-lock.json` (npm) incl. `bcryptjs`, `jose`.

## Blog Migration Structure (2026-06) — WordPress-parity URLs
- Articles now served at ROOT `bsagrc.co.id/<slug>` (matches old WordPress `/%postname%/`) via `app/[slug]/page.tsx` (ISR `revalidate=60` + `generateStaticParams`, `dynamicParams` on → newly imported slugs render on-demand WITHOUT redeploy). `/blog` remains the listing page.
- 301/308 redirects in `next.config.js`: `/blog/:slug` → `/:slug`, `/blog/page/:num` → `/blog`.
- All internal links + `sitemap.xml` + MCP response URLs use root `/<slug>`. Non-existent root URLs render a 404 UI and are `noindex` (mitigates soft-404 during migration).
- Import path: `POST /api/mcp/blog` accepts custom `slug`, `publishedAt`, `seoTitle/Description`, `category`, `tags` (default coverImage supplied) → user imports old articles via MCP token, live at old URL. Content stored as Markdown.

## Backlog / Next
- P1: Full live color theming (brand palette editor) — deferred (palette is Tailwind-compiled; needs CSS-variable refactor).
- P1: Redirection Manager UI (manual 301 redirects for lost WP URLs).
- P1: Category listing pages matching old WP category URLs.
- P2: Media Library picker inside FieldEditor image fields (currently upload + URL).
- P2: Multi-admin user management UI (table exists).
- P2: Defensive server-side confirm-password check.

## WP Bulk Import + Auto Sitemap Ping + MCP Edit/Publish permission (2026-08)
- **Bulk WP XML importer**: `/admin/blog/import` UI + `POST /api/admin/blog-import` (multipart: `file` .xml, `overwriteExisting`, `downloadImages`, `defaultStatus`=publish|draft|keep). Parses WordPress WXR export (`lib/wp-import.ts`, uses `fast-xml-parser` + `turndown`), extracts posts, categories/tags, Yoast SEO meta, featured image via `_thumbnail_id` → attachment map. Content HTML converted to Markdown; `<img>` URLs optionally re-downloaded & re-hosted through the same storage cascade as manual uploads (`lib/storage.ts`: Vercel Blob → Supabase → filesystem/tmp fallback). Duplicate slugs skipped unless overwrite is on. User confirmed: run this BEFORE bsagrc.co.id DNS is cut over to the new site, since old wp-content/uploads images become unreachable after cutover — importer downloads them into new storage while old domain is still live. Tested end-to-end via curl with a sample WXR file (parse, image download+AVIF convert, create).
- **Auto sitemap ping** (`lib/sitemap-ping.ts`): fires on every new/updated *published* article (admin CRUD `app/api/admin/blog/route.ts`, MCP create/PATCH `app/api/mcp/blog/route.ts`) and once after bulk import. Combination chosen by user: (1) legacy Bing sitemap ping endpoint, (2) IndexNow protocol (notifies Bing+Yandex). IndexNow key auto-generated & persisted in `bsa_settings.integrations.indexNowKey`; verification file served at `GET /api/indexnow-key` (passed as explicit `keyLocation`, no root-path rewrite needed — doesn't conflict with the blog `[slug]` catch-all).
- **MCP permission merged edit+publish**: added single `blog:edit` permission (label "Edit & Publish/Unpublish Artikel") — user chose NOT to split into two permissions. New `PATCH /api/mcp/blog` (body: `slug` or `id` + any of title/content/excerpt/coverImage/category/tags/seoTitle/seoDescription/keywords/isPublished) requires `blog:edit`; existing `blog:write` (create) and `blog:read` unchanged. Verified via curl: create → PATCH publish+edit content with `blog:edit` token succeeds; PATCH with a `blog:write`-only token correctly returns 401.
- **Vercel Blob now configured & LIVE** (2026-08): user created store `bsa-grc-media` (Private access-mode, OIDC-connected to project `bsa-grc` for Production+Preview — token auto-injected on real Vercel deploys, no manual env step needed there). Added `BLOB_STORE_ID`/`BLOB_READ_WRITE_TOKEN` to `/app/.env` for this preview. IMPORTANT: store is **Private**, so `put()` must use `access:"private"` (public access throws on this store) and blob URLs are NOT directly fetchable — added a streaming proxy `app/api/media/[...path]/route.ts` (`get(pathname,{access:"private"})` → streams bytes, `Cache-Control: public, max-age=31536000, immutable`). `lib/storage.ts` now returns `/api/media/<path>` for Vercel-Blob-stored files instead of a raw blob.url. Verified end-to-end via curl: admin upload → `storage:"vercel-blob"` → proxy route returns correct AVIF bytes; WP-import path also confirmed using Blob. Filesystem fallback still used automatically when `BLOB_READ_WRITE_TOKEN` is absent (e.g. if store ever disconnected).
- Nav: added "Import WP XML" under Konten group in `AdminLayout.tsx`.

## Media Gallery Picker (2026-08)
- New reusable `components/admin/MediaPickerModal.tsx`: fetches `/api/admin/media`, grid of thumbnails, search + folder filter, single-select (click → instantly select + close) or `multiple` mode (checkmarks + confirm button, calls `onSelectMultiple(urls[])`, appends not replaces). `initialFolder` prop auto-scopes the folder filter per context.
- Wired "Pilih dari Galeri" button (alongside existing "Upload Gambar") into: `components/admin/ImageField.tsx` (used by `/admin/pages` FieldEditor + `/admin/appearance` logo/favicon), `/admin/blog` (cover image, folder=blog), `/admin/portfolio` (main image single-select + carousel gallery multi-select, folder=portfolio), `/admin/services` (originalImage + landing-page heroImage via shared `applyImageToField`, folder=services), `/admin/testimonials` (photo, all-folders).
- Tested via `testing_agent` (iteration_4): all 5 editors + ImageField pass, no bugs. 100% frontend success rate.
