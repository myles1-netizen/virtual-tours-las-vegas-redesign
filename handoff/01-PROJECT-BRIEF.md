# Project Brief — Virtual Tours Las Vegas Website Rebuild

## Who this is for

Mike Madsen runs Virtual Tours Las Vegas, a Las Vegas real estate photography business (HDR photos, Matterport 3D tours, drone, floor plans, virtual staging). His son (the person commissioning this work) has been building him a replacement for his current website, which runs on WordPress + Divi + Yoast SEO + Hostinger hosting.

## The real problem

1. **The current live site (virtualtourslasvegas.com) is genuinely broken and outdated**, not just old-looking. Verified directly (2026-07-27):
   - 2 broken images on the homepage (fail to load)
   - Deprecated jQuery actively logging console warnings (`.resize()`, `.click()` shorthand — deprecated for years)
   - Google Maps API loaded synchronously (a known, flagged performance mistake)
   - 49 separate `<script>` tags loading on one page (plugin bloat)
   - Page `<title>` tag is 140+ characters of keyword-stuffed text (outdated SEO practice)
   - Homepage's actual content is a blog post ("Portrait vs. Landscape...") instead of a clear value proposition, despite the page's own `<h1>` reading "Order Your Las Vegas Virtual Tour Now!" — the stated purpose and the displayed content don't match
   - Twitter link still points to `twitter.com`, never updated
   - Deep, cluttered nav (Services alone has 8 sub-items) reflecting an old SEO-silo strategy of near-duplicate per-neighborhood landing pages (Henderson, Summerlin, Boulder City, North Las Vegas, Clark County — ~57 total URLs)

2. **Mike wants to be able to update his own site** — text, prices, maybe move things around — without needing a developer every time. He currently believes only Divi (WordPress's page builder) can give him that. It can, but at real ongoing cost (WordPress hosting + Divi license + Yoast license, all recurring), and Divi's own builder is not simple for a non-technical user either.

3. **He's skeptical of the replacement** — not because it isn't better (he's looked at it and agreed with specific problems on his current site), but because he hasn't yet seen that the replacement also lets him edit things himself. Words haven't convinced him; a working, hands-on demo will.

## What "done" looks like

A complete, deployed website that:
- Is a clear, obvious upgrade over the current site (fast, no console errors, no broken images, real content, coherent design)
- Mike can log into and **actually edit himself** — text fields, prices, images — through a simple, non-technical interface (not raw code, not Divi)
- Costs nothing or close to nothing to run (no WordPress hosting, no Divi/Yoast licenses)
- Is secure: real authentication (not something hand-rolled and untested), no exposed secrets, no known vulnerabilities, dependencies kept current
- Preserves and builds on the redesign work already done (see `02-CURRENT-STATE.md`) rather than starting over

## What NOT to do

- Do not fabricate any business facts, pricing, credentials, testimonials, or client names. Every real fact is in `src/data/site.ts` in the existing repo — treat it as the source of truth, already verified against the real business.
- Do not go down the Divi/WordPress path. It was investigated and deliberately abandoned — see `04-DIVI-INVESTIGATION-SUMMARY.md` for why, so that reasoning doesn't need to be re-derived.
- Do not repeat the specific bugs already found and fixed this session — see `03-LESSONS-LEARNED.md`. These were real, sometimes subtle mistakes; re-reading them will save significant rework.
- Do not hand-roll authentication (custom password hashing, custom session management) without very good reason. Prefer a vetted provider (see `05-EDITING-SYSTEM-REQUIREMENTS.md`).
