# Current State — What Already Exists

## Repo & deployment

- **Repo:** `github.com/MylesThePro1/virtual-tours-las-vegas-redesign` (public)
- **Live URL:** `https://mylesthepro1.github.io/virtual-tours-las-vegas-redesign/`
- **Deploy:** GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`. Node 22 required (Astro 7 needs Node ≥22.12).
- This whole site can be treated as a working, deployed baseline — build off it, don't restart from scratch. It is already a real, functioning improvement over the current live WordPress site.

## Stack

- **Astro 7** (static site generator, outputs plain HTML/CSS/JS, no backend)
- **Scoped component CSS**, no Tailwind, no UI framework
- A handful of small JS islands: lightbox (`Gallery.astro`), before/after image slider (`BeforeAfterSlider.astro`), mobile menu (CSS-only + small JS enhancement in `SiteHeader.astro`), FAQ accordion, contact form, scroll-reveal (IntersectionObserver, in `Base.astro`)
- `@astrojs/sitemap` for sitemap generation

## Content architecture

**All real business data lives in one file: `src/data/site.ts`.** This is the single source of truth — business info, phone/email, service area, trust/credential bullets, service-buyer cards, portfolio images (with verified-accurate alt text/category), pricing (all three Vegas packages + full à-la-carte tiers), staging before/after pairs, process steps, real testimonials (3, verbatim), FAQ (real Q&A). Every fact in it has been individually verified against the real business — do not treat it as a template to regenerate, treat it as ground truth to preserve.

If building a CMS/editing layer: this file (or a restructured equivalent — JSON/YAML/Astro content collections) is what needs to become editable. It's already fairly well-organized by content type.

## Pages (22 total)

Home, About, Contact, Pricing, FAQ, Privacy, Terms, 404, Work (portfolio hub + virtual-staging before/after gallery), Services hub + 11 individual service pages (residential, commercial, vacation-rentals, 3d-tours, as-built, drone-photography, floor-plans, google-business-view, hdr-photography, twilight-photography, virtual-staging).

**Deliberate scope decision:** the real site has ~57 URLs, mostly near-duplicate per-neighborhood SEO doorway pages (e.g. separate pages for Henderson/Summerlin/Boulder City/North Las Vegas real estate photography). This rebuild consolidated that into one site with a proper `serviceArea` list and doesn't replicate the doorway-page pattern — that was an approved, deliberate simplification, not an oversight. Feel free to keep that decision unless there's a good reason to revisit it (e.g. if those pages were genuinely driving meaningful organic traffic — worth checking Google Search Console data if accessible before deciding).

## Design system

- **Colors:** paper `#F7F4EF` (background), ink `#1A1814` (text), stone `#6B6358`/`#8A8275` (secondary text), brass `#B08D57`/`#C9A572` (accent, sparingly), a separate deeper `--brass-btn: #8A6A3C` / `--brass-btn-2: #7A5E34` specifically for solid gold buttons with white text (see lessons-learned — the lighter brass fails contrast with white text)
- **Type:** Fraunces (display serif, headings) + Inter (body/UI), loaded via Google Fonts
- **Header:** solid white/paper background always (not transparent-over-hero — that was tried and reverted after contrast bugs), fixed position, 64px logo
- Full token list in `src/styles/global.css`

## SEO/GEO already in place

- Per-page unique title/description, single H1 per page, canonical URLs, Open Graph + Twitter Card meta
- `LocalBusiness` + `ProfessionalService` + `Photographer` JSON-LD on every page (`src/layouts/Base.astro`)
- `FAQPage` JSON-LD on the FAQ page
- Sitemap + robots.txt
- CSP meta tag + referrer-policy meta (see security notes)
- `serviceArea` includes Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City, Clark County — verified real service area, expanded from the original 3-item list for better local SEO/GEO coverage

## What's explicitly NOT built yet

- **No CMS / no self-editing capability.** This is the main gap and the main reason this handoff exists.
- No live contact form backend (form falls back to `mailto:` unless a `FORM_ENDPOINT` env var is set — see `README.md` for the Formspree setup path already documented)
- `divi-export/` folder exists in the repo with a partial Divi/WordPress migration attempt — **this path was abandoned, see `04-DIVI-INVESTIGATION-SUMMARY.md`.** Safe to delete or ignore; not a required deliverable.
