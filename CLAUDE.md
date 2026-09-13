# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Balloons Decor ZP** — a bilingual (Ukrainian primary, Russian secondary) marketing site
for a premium balloon-decor / photo-zone service in Zaporizhzhia, Ukraine. Built as a
**Next.js 14 (App Router)** application with a Supabase backend, an admin panel, and
Telegram lead delivery. The design goal is a hand-crafted, premium, editorial look
(white + violet with metallic accents) — deliberately not a generic template.

> The previous static single-page version is archived in `legacy/` for reference only.

## Commands

```bash
npm install      # install deps
npm run dev      # dev server (http://localhost:3000)
npm run build    # production build (run this to validate before pushing)
npm start        # serve the production build
```

## Architecture

- **Rendering:** App Router. The root layout `src/app/layout.js` renders `<html>` and
  reads the `x-locale` request header (set by `src/middleware.js`) to set `lang`. Because
  of this, site pages are server-rendered on demand (dynamic), which keeps `lang` correct
  per locale and reflects admin edits immediately.
- **i18n:** URL-prefixed locales `/uk` and `/ru`. `middleware.js` redirects `/` → locale
  (cookie `NEXT_LOCALE` or `accept-language`) and sets `x-locale`. All copy lives in
  `src/i18n/dictionaries/{uk,ru}.js`; `getDictionary(locale)` returns the right one.
- **Data layer:** `src/lib/data.js` (`getWorks`, `getPrices`, `getContent`) always has a
  fallback — if Supabase env is missing OR a query fails/returns empty, it returns demo
  data from `src/lib/seed.js`. The site therefore renders fully even with no backend.
- **Supabase:** `src/lib/supabase.js` — `getPublicClient()` (anon, read) for the site;
  `getAdminClient()` (service_role, server-only) for admin writes + Storage uploads.
  Schema + RLS in `supabase/schema.sql`. Photos go in a **public** Storage bucket `works`.
- **Admin:** `/admin` (outside the `[locale]` tree). Password auth via HMAC-signed
  httpOnly cookie (`src/lib/auth.js`, `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET`). Pages
  check `isAuthenticated()` and `redirect('/admin/login')`. Mutations are **server actions**
  in `src/app/admin/actions.js` (guarded by `requireAuth()`), which call `revalidatePath`.
- **Leads:** `POST /api/lead` validates, saves to `leads` (if Supabase set) and sends a
  Telegram message (if `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` set). Never hard-fails.
- **SEO:** per-locale metadata + `alternates.languages`, `src/app/sitemap.js`,
  `src/app/robots.js`, JSON-LD `LocalBusiness` on the home page.

## Key files

- `src/app/globals.css` — the entire design system (tokens, typography, all component
  styles, animations, responsive). Plain CSS with semantic class names, no framework.
- `src/components/` — `Header`, `Footer`, `Hero`, `StackedDeck` (signature swipe deck),
  `LeadForm`, `WorksGrid`, `ScrollReveal`, `Parallax`, `icons.js`, `admin/AdminShell`.
- `src/app/admin/admin.css` — separate admin styling (dark, functional).

## Conventions

- **Design tokens** in `:root` in `globals.css`: `--violet #7c3aed`, `--violet-grad`,
  metallic `--gold`/`--silver`, `--bg`/`--bg-soft`/`--bg-deep`, `--ink` family.
- **Fonts** via `next/font/google` in the root layout: Playfair Display (`--font-display`,
  headings/serif) + Manrope (`--font-sans`, body). Both include the `cyrillic` subset —
  keep that subset on any font swap or Ukrainian text will break.
- **Scroll reveal:** add class `reveal` (+ `reveal-d1/2/3` for stagger); `ScrollReveal`
  adds `in-view`. **Parallax:** add `parallax` + `data-speed="0.08"`; `Parallax` sets `--shift`.
- **Localized fields** on DB rows use `_uk`/`_ru` suffixes; pick with `locale === 'ru' ? x_ru : x_uk`.
- After changing content pages, run `npm run build` to validate before committing.

## Media drop-ins (auto-detected)

- `public/media/hero.mp4` → becomes the hero background video (else image collage).
- `public/media/anya.jpg` → founder photo on the About page (else a work image).
- Work photos are managed in the admin panel (uploaded to Supabase Storage).

## Setup / deployment

Full step-by-step (Supabase, Telegram, Vercel, domain, ads) for a non-technical owner is
in `SETUP.md`. `.env.example` lists every environment variable. Deploy target: Vercel.

## Contact details (now editable in admin → Contacts; defaults in `src/lib/seed.js`)

- Phone: `+38 (099) 354 60 48` · Instagram: `balloons_decor_zp` · Owner: Аня Оксьом
