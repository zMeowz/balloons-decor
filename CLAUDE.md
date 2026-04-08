# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static single-page website (business card site) for **Balloons Decor ZP** — a balloon decoration and photo zone service in Zaporizhzhia, Ukraine. The site is in Ukrainian.

## Deployment

No build step. Deploy by uploading all files and the `assets/` folder to the hosting root (`public_html` or `www`). Open the domain in a browser to verify.

## Architecture

Four files make up the entire site:

- `index.html` — single page with all sections: hero, services, gallery, process, Instagram CTA, footer/contacts
- `styles.css` — all styles including CSS custom properties, responsive breakpoints (980px, 720px), and animations
- `script.js` — three behaviors: mobile nav toggle, scroll reveal via IntersectionObserver, and parallax on `.parallax[data-speed]` elements
- `assets/` — gallery photos (`gallery-1.jpg` through `gallery-5.jpg`) referenced directly in `index.html`

## Key Design Tokens (CSS variables)

Defined in `:root` in `styles.css`:
- `--accent`: `#a855f7` (purple), `--accent-2`: `#ff4fb4` (pink) — used for gradients throughout
- `--bg-soft`: `#faf7ff`, `--muted`: `#6f6a7d`, `--shadow`: purple-tinted box shadow

## Scroll Reveal Pattern

Elements with class `.reveal` start hidden (`opacity:0; transform:translateY(32px)`) and animate in when they enter the viewport. Add `.reveal-delay` or `.reveal-delay-2` for staggered timing. The `IntersectionObserver` in `script.js` adds `.in-view` once and stops observing.

## Parallax Pattern

Add class `parallax` and `data-speed="0.08"` (or any float) to an element. `script.js` sets `--shift` CSS variable on scroll; the element must use `transform: translateY(var(--shift, 0px))` in CSS.

## Contact Details (editable in `index.html`)

- Phone: `+38 (099) 354 60 48`
- Instagram: `https://www.instagram.com/balloons_decor_zp/`
- Telegram link: currently placeholder (`https://t.me/`) — needs a real username
