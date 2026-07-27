# Requirements Checklist — Every Ask, Cross-Referenced

This is a full audit of every request made across the entire project so far, mapped to where it's covered. Anything marked **GAP** is a genuine open item that needs attention, not something already handled — call these out explicitly rather than assuming they're covered.

## Already built and live (not just planned — in the deployed Astro site today)

- [x] White (not black/transparent) header background, always solid — `SiteHeader.astro`
- [x] Bright white, readable text on gold/brass buttons (deepened `--brass-btn` token so contrast actually passes) — `global.css`
- [x] Bigger, more visible brand logo in header (64px)
- [x] "Photography that sells the listing" section fits cleanly, no layout overflow
- [x] Boxed/panel text treatment over photos everywhere (hero, PageHero, CTABand) so text is readable regardless of the image behind it, both hovering and not hovering
- [x] TrustBar client logos sized consistently (no single logo dominating), uniform card treatment
- [x] Gallery "wide" tiles fixed so rows stay flush, no layout gaps
- [x] Before/after slider bug fixed (was rendering the "before" image at 100vw, looked zoomed/wrong) — now renders both images at identical scale via `clip-path`
- [x] Before/after slider default position changed to favor showing the "after" result
- [x] Portfolio image data-accuracy audit — found and fixed 13 of 26 images with wrong alt text/category, including several that were literal logo graphics being shown as if they were real property photos
- [x] Real, verified business content throughout (`src/data/site.ts`) — pricing, credentials, testimonials, service area
- [x] De-AI'd copy pass — removed ~50 em-dash-as-clause-connector instances across 16+ files, sounds more like a person than generated text
- [x] SEO: per-page title/description, canonical URLs, OG/Twitter meta, `LocalBusiness`/`ProfessionalService`/`Photographer` + `FAQPage` JSON-LD schema, sitemap, robots.txt
- [x] Security: CSP meta tag, referrer-policy meta, `rel="noopener noreferrer"` on external links, `npm audit` clean
- [x] Email typo fixed (`VirtualToursLasVega@` → `VirtualToursLasVegas@`)
- [x] Matterport hosting price fixed ($10/month was wrong → $72/6 months, verified against live site)
- [x] GitHub repo created, GitHub Actions deploy pipeline working, live at `mylesthepro1.github.io/virtual-tours-las-vegas-redesign`
- [x] Zillow Offers relationship — confirmed and framed as strictly past-tense ("used to work with"), not ongoing
- [x] Michelle Sproul confirmed as Mike's wife and business co-founder — voice guidance updated accordingly

## Investigated and deliberately decided against (not gaps — documented decisions)

- [x] Divi/WordPress conversion — attempted, tested, found real bugs on import, and the client explicitly decided against continuing this path. See `04-DIVI-INVESTIGATION-SUMMARY.md`. The partial `divi-export/` folder remains in the repo but is not a required deliverable.
- [x] Custom-built-from-scratch CMS/auth — considered, explicitly deprioritized in favor of a git-based CMS + Cloudflare Access pattern, specifically because of the security stakes of hand-rolled auth. See `05-EDITING-SYSTEM-REQUIREMENTS.md`.

## Specified in detail, ready to build (in the handoff docs, not yet built)

- [x] Full self-serve editing system: edit any text/price/image, create pages, delete pages, reorder lists, move sections within a page — `05-EDITING-SYSTEM-REQUIREMENTS.md` (recently strengthened to make all of this a hard requirement, not aspirational)
- [x] Not GitHub-account-tied login for Mike; Cloudflare Access + OAuth proxy pattern — `05-EDITING-SYSTEM-REQUIREMENTS.md`
- [x] Full security checklist (auth, secrets, input sanitization, dependencies, production safety) — `06-SECURITY-CHECKLIST.md`
- [x] Legal/accuracy guidelines — no misleading third-party endorsement claims, verbatim testimonials, resolved contradictions — `07-LEGAL-ACCURACY-GUIDELINES.md`
- [x] Interactive price calculator with itemized selection, live total, and a researched, not-guessed answer on whether Nevada sales tax applies to these services — `08-PRICE-CALCULATOR-SPEC.md`
- [x] Real light mode AND dark mode as an actual toggle (not just "the site happens to look ok"), full consistency across every page/component, photos/logos guaranteed visible in both modes — `09-THEME-SYSTEM-SPEC.md`
- [x] Header/button sizing reduced from current oversized state — noted in `09-THEME-SYSTEM-SPEC.md`
- [x] Admin panel mapped to every specific WordPress/Divi habit Mike currently has — `10-ADMIN-PANEL-SPEC.md`
- [x] First-person voice ("I," never "we," except the one confirmed exception for the founding story) — `11-VOICE-AND-TONE.md`
- [x] Every single page from the real site captured into content-source files — `content-audit/` (76 files: every residential/commercial/vacation-rental service page, every location page, about/FAQ/booking pages, homepage, blog inventory)
- [x] Every embed (Matterport tours, sliders) — recreated as a real modern component, not dropped — Matterport embed component (inline + popup modes) and slider replacement detailed in `plugin-research/wordpress-plugin-equivalents.md`
- [x] **Every single plugin** gets a real recreated feature, none dismissed as "not needed" — five docs in `plugin-research/` covering all 19+ plugins: booking/scheduling (`latepoint-booking-system.md`), admin/content tools (`admin-content-tools.md`), SEO/analytics/performance (`seo-analytics-performance.md`), security/reliability/comms (`security-reliability-comms.md`)

## Explicit GAPs — genuinely not yet done, call these out rather than assume coverage

- **GAP: Ultra-professional visual redesign has not actually happened yet.** The current live site has the bug-fix-level polish from this session (contrast, spacing, real content) but has NOT been given the full theme-system rebuild (`09-THEME-SYSTEM-SPEC.md`), the content-block-reorderable architecture, or a genuine "does this look ultra-professional" design pass. That's real design/build work still ahead, not something a spec doc alone accomplishes.
- **GAP: The price calculator does not exist yet** — spec only (`08-PRICE-CALCULATOR-SPEC.md`), not built.
- **GAP: The editing system/admin panel does not exist yet** — the current live site has no CMS, no login, no way for Mike to edit anything himself. This is fully specced (`05`, `10`, and all of `plugin-research/`) but zero of it is implemented.
- **GAP: Light/dark mode toggle does not exist yet** — the current site is light-mode-only with the mixed-section pattern the theme spec is meant to fix.
- **GAP: Cloudflare migration has not happened** — the live site is still on GitHub Pages, not Cloudflare Pages.
- **GAP: A handful of content-audit items are explicitly flagged as needing Mike's direct confirmation** before they can be finalized (not just re-verified against the live site, but actually asked of him) — see the remaining open items inside `content-audit/` files that reference the "REALTOR®" trademark question, the stale-address question, and the exact current wording for the Zillow-Offers-related credential badges. These are the only remaining accuracy questions after this round; everything else that was ambiguous has now been resolved.
- **GAP: No blog content strategy exists.** 37 real blog posts were found via sitemap inventory (`content-audit/blog-inventory.md`) but none of their content was migrated, and there's no blog section in the new site at all yet. Worth a decision: migrate the real posts, start fresh, or explicitly decide blogging isn't a priority — but this hasn't been decided or acted on.

## What "done" looks like from here

Everything above marked as a spec-only GAP is real, scoped, buildable work — not vague. The docs in this `handoff/` folder are comprehensive enough that a developer (or GLM) picking this up shouldn't need to re-derive any of these decisions; the job from here is executing what's already specified, not further planning.
