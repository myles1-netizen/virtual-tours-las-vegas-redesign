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

## Contact form

The form in `src/components/ContactForm.astro` posts to a configurable endpoint. Without one set, it falls back to a `mailto:` link with a prefilled subject.

To wire up real form submissions (recommended before this goes live for real):

1. Sign up at [formspree.io](https://formspree.io) (free tier works) — takes about 5 minutes.
2. Create a form, grab the endpoint URL (`https://formspree.io/f/xxxxxxxx`).
3. Set it as a build-time env var: `FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx`.
   - Locally: add to a `.env` file (already gitignored).
   - In CI: add it as a repository secret and reference it in `.github/workflows/deploy.yml`.

No secrets are committed to this repo.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys to GitHub Pages via GitHub Actions. Enable Pages under **Settings → Pages → Source: GitHub Actions** on first setup.

To swap to Cloudflare Pages instead: connect the repo in the Cloudflare dashboard, set the build command to `npm run build`, output directory `dist`, and set `BASE_PATH=/` as a build env var (Cloudflare Pages serves from the domain root, not a subpath).

## What's left before this could go live

- Real Formspree (or equivalent) endpoint wired up
- Final content sign-off from Mike on all copy
- A real booking/availability system if one is wanted (the current form is a request form, not a live calendar)
