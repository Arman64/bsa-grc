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
- P2: Media Library picker inside FieldEditor image fields (currently upload + URL).
- P2: Multi-admin user management UI (table exists).
- P2: Defensive server-side confirm-password check.
