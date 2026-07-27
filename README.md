# Virtual Tours Las Vegas — Redesign (Prototype)

A redesign concept for [virtualtourslasvegas.com](https://virtualtourslasvegas.com), the site for Las Vegas real estate photographer Mike Madsen. Built with [Astro](https://astro.build) as a static site, deployed to GitHub Pages.

**This is a prototype, not the production site.** No content was fabricated — all business facts, pricing, testimonials and client names are sourced from the real business.

## Stack

- Astro (static output)
- Scoped component CSS, no framework/Tailwind
- A handful of JS islands: lightbox, before/after slider, mobile menu, FAQ accordion, contact form, scroll reveal

## Local development

```bash
npm install
npm run dev
```

Dev serves at `http://localhost:4321/` (root path). Production builds use the GitHub Pages subpath automatically — no manual switching needed.

```bash
npm run build    # outputs to dist/, using the GH Pages base path
npm run preview  # preview the production build locally
```

## Contact & booking forms

The forms in `src/components/ContactForm.astro` and `src/pages/booking.astro` are fully self-contained — no signup, no API keys, no third-party dashboard.

- They POST via `fetch` to **Formsubmit** (`https://formsubmit.co/ajax/virtualtourslasvegas@gmail.com`), a free email-forwarding service. The very first submission triggers a one-time confirmation email to Mike; after he confirms, every submission lands in his inbox permanently.
- A honeypot field (`_honey`) plus Formsubmit's own filters handle spam — no captcha to solve.
- If the network POST fails (offline, ad blocker, etc.), the form falls back to opening the visitor's email client with a prefilled body addressed to Mike.

No secrets are committed, and no build-time env vars are required for the forms to work.

## Booking

`/booking` is a booking **request** form (not a live calendar): the visitor picks a package, add-ons, date, time and address, and the request is emailed to Mike via Formsubmit. Mike confirms every booking himself — which is how he already works. His phone number is shown as the primary CTA at the top of the page.

## Admin dashboard

`/admin` is a lightweight, dependency-free content dashboard (no Sveltia/Decap CMS, no GitHub OAuth):

- Password-gated. Set the password at build time via `ADMIN_PASSWORD`; it's SHA-256 hashed and only the hash ships to the browser. The browser re-hashes the entered password (Web Crypto) and compares. Unlocked state is remembered in `localStorage`.
- Shows a read-only view of every editable category (business info, packages, all pricing tiers, testimonials, FAQ, services, clients).
- "Request changes" opens a prefilled email to the maintainer (set via `CHANGES_EMAIL`, defaults to Mike's inbox) with whatever Mike typed. The maintainer applies the edit to the JSON in `src/data/cms/` and rebuilds.

Optional build env vars:

- `ADMIN_PASSWORD` — the admin password (plaintext at build, hashed in output). If unset, the dashboard is open (handy for local preview).
- `CHANGES_EMAIL` — where "Request changes" emails go. Defaults to Mike's inbox.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys to GitHub Pages via GitHub Actions. Enable Pages under **Settings → Pages → Source: GitHub Actions** on first setup.

To swap to Cloudflare Pages instead: connect the repo in the Cloudflare dashboard, set the build command to `npm run build`, output directory `dist`, and set `BASE_PATH=/` as a build env var (Cloudflare Pages serves from the domain root, not a subpath).

## What's left before this could go live

- Final content sign-off from Mike on all copy
- Confirm the first Formsubmit submission (the confirmation email) so live form submissions start flowing
