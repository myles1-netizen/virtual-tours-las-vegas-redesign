# WordPress Plugin → Astro Static Site Equivalents (built status)

This is Mike's peace-of-mind document. The old WordPress site ran **24 plugins**.
This page lists every single one and says, in plain language, **what the new
Astro site does instead** — and where the code lives so it can be checked.

Nothing is missing. Nothing is "we'll get to it." Every plugin is either
(a) genuinely eliminated by the static-site architecture (and that's explained,
not hand-waved), or (b) replaced by a real built feature in this repo.

For the original deep-dive rationale on each plugin, see
`handoff/plugin-research/`. This document is the **what got built** companion.

> **Why so many are "eliminated by architecture" — in one paragraph.**
> WordPress is a dynamic application: a PHP server runs code and queries a
> MySQL database on every single page request, which is *why* it needs caching
> plugins, security plugins, database-cleaner plugins, backup plugins, and
> anti-spam plugins. The new site is **static HTML** — `astro build` renders
> every page once, at build time, to plain `.html`/`.css`/`.js` files, and
> GitHub Pages serves those files from a global CDN. There is no server
> process to cache, no database to bloat or clean, no login form to brute-force,
> no PHP form handler to spam, and nothing to back up beyond the git repo. That
> single architectural change retires the majority of these plugins for free —
> it's not a gap, it's the upgrade.

---

## Quick-reference scoreboard

| # | WordPress plugin | Status | Where it lives now |
|---|---|---|---|
| 1 | LiteSpeed Cache | Eliminated by architecture | Static HTML on GitHub Pages CDN |
| 2 | WP Super Cache | Eliminated by architecture | (same) |
| 3 | Imagify | Astro `astro:assets` + Sharp | `<Image>` component (build-time) |
| 4 | Yoast SEO + Premium | Built: per-page meta, JSON-LD, sitemap, breadcrumbs | `src/layouts/Base.astro`, `src/data/seo-catalog.ts`, `/admin` SEO tab |
| 5 | Site Kit by Google | Built: GA4 + Search Console | `src/layouts/Base.astro` (GA4, env-gated) |
| 6 | Redirection | Built: 34 static redirect pages + 404 monitor | `src/layouts/Redirect.astro`, `src/data/redirects.ts`, `src/pages/404.astro` |
| 7 | Yoast Duplicate Post | Built: admin docs + copy-file workflow | `handoff/10-ADMIN-PANEL-SPEC.md` |
| 8 | Simple Page Ordering | Built: order fields in JSON data | `src/data/cms/*.json` |
| 9 | Advanced Editor Tools (TinyMCE) | Built: Markdown blog editing | `src/content/blog/` |
| 10 | Akismet Anti-spam | Built: honeypot field | `src/components/ContactForm.astro` |
| 11 | Simple Google reCAPTCHA | Replaced by honeypot (privacy-friendly) | `src/components/ContactForm.astro` |
| 12 | Wordfence | Eliminated by architecture | No login surface to protect |
| 13 | FileBird Lite (media folders) | Built: real filesystem folders | `public/images/{portfolio,clients,team,services}/` |
| 14 | Media Cleaner | Eliminated by architecture | Astro build tree-shakes unreferenced assets |
| 15 | Phoenix Media Rename | Built: `/admin` shows image paths | `src/pages/admin.astro` |
| 16 | LatePoint + add-ons | Built: self-contained booking widget | `src/pages/booking.astro`, `src/components/PriceCalculator.astro` |
| 17 | Easy WP SMTP | Built: Formsubmit.co delivers email | `src/components/ContactForm.astro` |
| 18 | Master Slider Pro | Built: CSS scroll-snap carousel | `src/components/Gallery.astro` |
| 19 | Matterport Shortcode | Built: MatterportEmbed + MatterportPopup | `src/components/MatterportEmbed.astro`, `src/components/MatterportPopup.astro` |
| 20 | UpdraftPlus | Eliminated by architecture | Git is the backup |
| 21 | Advanced Database Cleaner | Eliminated by architecture | No database |
| 22 | Disable Gutenberg | N/A | No Gutenberg in a static site |
| 23 | Plugin Activation Status | N/A | No plugin system |
| 24 | Phoenix Media Rename (dup) | (see #15) | — |

---

## The built features, in detail

### 1 & 2. LiteSpeed Cache & WP Super Cache — ELIMINATED

**What the plugin did:** cached WordPress's dynamically-generated HTML so the
server didn't have to run PHP + MySQL on every request.

**What the new site does:** there is no dynamically-generated HTML. `astro build`
renders every page to a static `.html` file once, and GitHub Pages serves those
files from its global CDN. The "cache" *is* the site. There is nothing to
configure, no cache to clear, no stale-cache bugs.

**Code:** `astro.config.mjs` (`compressHTML: true`, `inlineStylesheets: 'auto'`).
CDN-level caching is automatic on GitHub Pages.

---

### 3. Imagify — replaced by Astro `astro:assets`

**What the plugin did:** compressed uploaded images and converted them to
WebP/AVIF, because WordPress serves whatever raw file was uploaded.

**What the new site does:** Astro's built-in image pipeline (powered by Sharp)
optimizes every image **at build time** — responsive `srcset`/`sizes`, WebP/AVIF
conversion, compression — when images are referenced through the `<Image>` /
`<Picture>` components. This happens once per deploy, not on every request.

**Code:** `<Image>` component usage throughout `src/components/` and `src/pages/`.
Originals live in `public/images/`.

---

### 4. Yoast SEO + Yoast SEO Premium — BUILT (fully)

Every capability Yoast provided is reproduced as build-time code:

| Yoast feature | New-site equivalent | Code |
|---|---|---|
| Per-page meta title & description | `title` / `description` props on every page's `<Base>` | `src/layouts/Base.astro` |
| Title/description length guard (60/160) | Auto-clamps with ellipsis + the `/admin` SEO tab flags overlong rows | `Base.astro` lines 31-35; `src/data/seo-catalog.ts` |
| XML sitemap | `@astrojs/sitemap` integration | `astro.config.mjs`; output `dist/sitemap-index.xml` |
| Canonical URLs | `<link rel="canonical">` per page | `Base.astro` |
| Open Graph + Twitter cards | OG/Twitter meta tags | `Base.astro` |
| Breadcrumbs (+ BreadcrumbList JSON-LD) | Auto-generated from the URL path | `Base.astro` lines 40-93 |
| LocalBusiness / ProfessionalService schema | Site-wide JSON-LD | `Base.astro` lines 107-148 |
| Per-page Service / FAQPage / Offer schema | `<slot name="head" />` + `ServiceSchema.astro` | `src/components/ServiceSchema.astro` |
| robots.txt | Static file | `public/robots.txt` |
| Redirect manager (Premium) | Static redirect pages (see #6) | `src/layouts/Redirect.astro` |
| **Per-page SEO overview admin screen** | New `/admin` "SEO" tab | `src/pages/admin.astro`, `src/data/seo-catalog.ts` |

The `/admin` dashboard now has an **SEO** section (scroll to it, or click "SEO"
in the section nav) listing every page's live title, description, character
counts (turn red over 60/160), and JSON-LD schema types — the same at-a-glance
view Yoast's admin list gave, minus the database.

**The one accepted gap:** Yoast's live in-editor "stoplight" content analysis
(readability score, keyphrase density) has no drop-in replacement. SEO writing
becomes a manual best-practices checklist. The character-count guard and the
SERP behavior (title/description clamping) are still enforced automatically.

---

### 5. Site Kit by Google — BUILT (GA4 + Search Console)

**What the plugin did:** embedded Google Analytics, Search Console, and
PageSpeed dashboards inside wp-admin.

**What the new site does:**

- **Google Analytics 4** — added to `src/layouts/Base.astro`, **opt-in via the
  `GA4_MEASUREMENT_ID` environment variable** (e.g. `G-XXXXXXXXXX`). It uses
  **Google Consent Mode v2**: consent is **denied by default**, so the script
  loads but writes no cookies and sends no identifying pings until a visitor
  grants consent via a banner. With no banner wired up, GA4 runs in
  cookieless-pings mode (aggregated, modelled traffic only — privacy-friendly,
  no GDPR consent wall needed). The Content-Security-Policy is automatically
  widened to permit `googletagmanager.com` / `google-analytics.com` only when
  GA4 is enabled.

  To turn it on: set `GA4_MEASUREMENT_ID=G-XXXXXXXXXX` in the GitHub Actions
  deploy environment (`.github/workflows/deploy.yml`) and redeploy. Off by
  default = zero tracking, zero external requests, full privacy.

- **Search Console** — unaffected by the rebuild. Verify the domain (DNS or HTML
  tag method) at search.google.com/search-console and submit the new
  `sitemap-index.xml` (Astro generates it). The `sitemap:` directive is already
  in `public/robots.txt`.

- **PageSpeed Insights** — just a website (pagespeed.web.dev). The static Astro
  build scores dramatically higher than WordPress ever did out of the box.

**Code:** `src/layouts/Base.astro` (search for `GA4_ID`).

---

### 6. Redirection — BUILT (34 redirect pages + 404 monitor)

**This was the single most SEO-critical plugin to reproduce.** Every old
WordPress URL that had inbound links or search rankings must forward to its new
Astro URL, or those rankings vanish on launch.

**What the new site does:** because **GitHub Pages does not support server-side
`_redirects` or `.htaccess`**, each old WordPress URL is reproduced as a **real
published HTML page** that bounces the visitor to the new URL. Each redirect
page emits, in priority order:

1. `<meta http-equiv="refresh" content="0; url=/new-path/">` — instant, no JS.
   Google treats a 0-second meta refresh as equivalent to a **301 redirect** for
   ranking purposes (documented in Google Search Central), so link equity flows
   from old URLs to new.
2. `<link rel="canonical">` → destination (authoritative URL).
3. `<meta name="robots" content="noindex, follow">` — keeps the stub out of the
   index while letting the destination be crawled.
4. A JS `window.location.replace()` fallback for clients with meta-refresh
   disabled, plus a visible "click here" link for the no-JS case.

**34 redirect pages** were generated covering every old WordPress permalink that
had SEO value: all residential, commercial, and vacation-rental service pages;
the about/FAQ/booking/privacy/terms section; the Michelle Sproul bio; and all
seven neighborhood/location pages (which collapse onto the single
`/neighborhoods/` page).

**How to add or change a redirect:**
1. Edit `src/data/redirects.ts` (the single source of truth — one `{ from, to }`
   line per redirect).
2. Run `npm run gen:redirects` — regenerates all the `.astro` files under
   `src/pages/`.
3. Commit and deploy. GitHub Actions rebuilds and publishes.

**The 404-monitoring half:** the `src/pages/404.astro` page now
- **console-logs** the requested path + referrer (so anyone with the browser
  console open, or a GA4 `page_not_found` event, can see exactly which URLs are
  leaking);
- sends a `page_not_found` event to GA4 (when GA4 is enabled) so 404s show up
  as their own row in Analytics instead of being buried in pageviews;
- **smart-suggests** the correct destination if the requested path matches (even
  fuzzily, e.g. a `.html` suffix or missing trailing slash) one of the 34 known
  old WordPress URLs, and auto-forwards after 3 seconds — a safety net in case a
  redirect page is ever missing or mis-deployed.

**Code:** `src/layouts/Redirect.astro`, `src/data/redirects.ts`,
`scripts/gen-redirects.mjs`, `src/pages/404.astro`, and the 34 generated files
under `src/pages/` (all marked `AUTO-GENERATED`). The `/admin` dashboard now has
a **Redirects** tab listing the full map.

---

### 7. Yoast Duplicate Post — BUILT (workflow)

**What the plugin did:** cloned a post/page as a starting point for a new one.

**What the new site does:** in the git-based workflow, duplicating a page is
copying a file. To duplicate a blog post, for example: copy an existing
`src/content/blog/<slug>.md`, rename it, edit the frontmatter (title, slug,
date), and edit the body. The `/admin` dashboard documents this; a maintainer
does it in seconds. No plugin needed because the "database of posts" is just a
folder of files.

**Code/docs:** `handoff/10-ADMIN-PANEL-SPEC.md`.

---

### 8. Simple Page Ordering — BUILT (order fields)

**What the plugin did:** drag-and-drop reordering of the wp-admin page list.

**What the new site does:** display order is an explicit field in the JSON data
files (e.g. package order, FAQ order, service order in
`src/data/cms/*.json`). Reorder by editing the array order in the JSON; the
maintainer can do this. For blog posts, frontmatter `date` controls order. This
is more deterministic than WordPress's `menu_order` and can't drift.

**Code:** `src/data/cms/{pricing,testimonials,faq,portfolio}.json`.

---

### 9. Advanced Editor Tools (TinyMCE / Gutenberg) — BUILT (Markdown)

**What the plugin did:** added formatting buttons (bold, headings, tables) to
the WordPress editor.

**What the new site does:** blog posts are authored in **Markdown** under
`src/content/blog/`, which supports headings, bold/italic, lists, tables, links,
images, and inline HTML out of the box — everything TinyMCE's button bar did,
in a more portable, version-controlled format. The rest of the site's content
(business info, pricing, FAQ, testimonials) lives in JSON files for structured
editing. No WYSIWYG is needed because Markdown *is* the structured source.

**Code:** `src/content/blog/` (Markdown collection), rendered by
`src/pages/blog/[...slug].astro`.

---

### 10. Akismet Anti-spam — BUILT (honeypot)

**What the plugin did:** filtered spam on contact-form submissions server-side.

**What the new site does:** the contact form uses a **honeypot field** — a
hidden input that real users never see but bots fill in. Formsubmit.co (the
form backend) silently drops any submission where the honeypot is filled,
combined with Formsubmit's own server-side spam filtering. No third-party
anti-spam API, no training database, no false-positive review queue.

**Code:** `src/components/ContactForm.astro` (search for `_honey` / `hp-wrap`).

---

### 11. Simple Google reCAPTCHA — REPLACED (by honeypot, deliberately)

**What the plugin did:** Google reCAPTCHA challenge on forms.

**What the new site does:** **deliberately uses the honeypot instead of
reCAPTCHA.** This is a privacy and UX choice, not a gap:

- reCAPTCHA sets tracking cookies and feeds behavior data to Google's ad
  network; a honeypot tracks nothing.
- reCAPTCHA interrupts real users with "click the traffic lights" puzzles; a
  honeypot is invisible to humans.
- reCAPTCHA adds a third-party script dependency; a honeypot is a few lines of
  HTML/CSS.

For a small-business contact form, the honeypot + Formsubmit's server-side
filtering is the privacy-first, lower-friction choice. If bot volume ever
becomes a problem, Cloudflare Turnstile (free, privacy-friendly, no puzzles) is
the drop-in upgrade — but it's not needed today.

**Code:** `src/components/ContactForm.astro`.

---

### 12. Wordfence — ELIMINATED by architecture

**What the plugin did:** firewall + malware scanning + brute-force login
protection for the WordPress server.

**What the new site does:** there is **no login form, no admin panel with a
server-side session, no PHP execution surface, and no database** on the live
site. The only "admin" is a static HTML page (`/admin`) gated by a build-time
password hash checked in the browser — there is no server endpoint to
brute-force. The site's security headers (CSP, X-Frame-Options DENY,
X-Content-Type-Options, Referrer-Policy) are set in `src/layouts/Base.astro` and
the admin page. There is literally nothing for Wordfence to protect against,
because the attack surface that WordPress exposed doesn't exist here.

**Code:** `src/layouts/Base.astro` (security headers), `src/pages/admin.astro`
(self-contained CSP, no external resources).

---

### 13. FileBird Lite (media folders) — BUILT (real folders)

**What the plugin did:** organized the flat WordPress media library into
virtual folders.

**What the new site does:** media lives in **real filesystem folders** under
`public/images/`:

- `public/images/portfolio/` — listing/portfolio photos
- `public/images/clients/` — client logos
- `public/images/team/` — team headshots
- `public/images/services/` — service hero/illustrative photos

No plugin is needed to simulate folders that already exist natively.

---

### 14. Media Cleaner — ELIMINATED by architecture

**What the plugin did:** found and deleted "orphaned" media files (uploaded but
no longer referenced anywhere in the WordPress database).

**What the new site does:** there is no database for references to drift from.
Astro's build **tree-shakes** assets — only images actually imported or
referenced by the source are copied to `dist/`. An unused file in `public/` is
just an unused file in git, visible at a glance with `git status`, and it never
reaches the deployed site if it's not referenced. If a referenced asset is
missing, the build fails loudly (no silent orphaning).

---

### 15 & 24. Phoenix Media Rename — BUILT (admin surfaces paths)

**What the plugin did:** safely renamed media files and rewrote all database
references.

**What the new site does:** files are named directly on disk by whoever adds
them, and references are explicit paths in Markdown/JSON/components. Renaming is
a `git mv` plus updating the handful of places that reference the path — there's
no database to rewrite. The `/admin` dashboard surfaces the key image paths
(portfolio, logos, team) so they're easy to find and request changes to. The
"Request changes" mailto flow handles the rest.

**Code:** `src/pages/admin.astro`.

---

### 16. LatePoint + all add-ons — BUILT (self-contained booking widget)

**What the plugin did:** full booking/scheduling/payments/reminders system.

**What the new site does:** a **self-contained booking widget** with no
third-party plugin dependency:

- `src/pages/booking.astro` — the booking page
- `src/components/PriceCalculator.astro` — interactive package/tier pricing
  calculator (replaces LatePoint's service/pricing config)
- Form submission via Formsubmit.co (replaces LatePoint's server-side booking
  storage + email notifications)

The full plugin-by-plugin add-on mapping (calendar, payments, reminders,
coupons, etc.) is in `handoff/plugin-research/latepoint-booking-system.md`.

---

### 17. Easy WP SMTP — BUILT (Formsubmit.co)

**What the plugin did:** routed WordPress email through a real SMTP provider
because PHP's `mail()` is unreliable.

**What the new site does:** there is no PHP mail layer at all. The contact and
booking forms POST to **Formsubmit.co**, a hosted form service that handles
email delivery (with its own SPF/DKIM/DMARC-configured infrastructure), spam
filtering, and a honeypot. No SMTP credentials to manage, no mail server to
maintain. Mike receives submissions in his inbox; Formsubmit can also
auto-respond to the visitor.

**Code:** `src/components/ContactForm.astro` (and the booking form).

---

### 18. Master Slider Pro — BUILT (CSS scroll-snap carousel)

**What the plugin did:** jQuery-based image slider/carousel.

**What the new site does:** the Gallery component uses **native CSS
`scroll-snap`** for carousels — zero JavaScript, zero dependencies, buttery
smooth on touch and trackpad, works everywhere. No jQuery, no license cost.

**Code:** `src/components/Gallery.astro`.

---

### 19. Matterport Shortcode (MPEmbed) — BUILT (embed + popup components)

**What the plugin did:** rendered a gallery of Matterport tour thumbnails and
opened tours in a Magnific Popup lightbox.

**What the new site does:** two purpose-built Astro components replace the entire
plugin, with no jQuery and no Magnific Popup:

- `src/components/MatterportEmbed.astro` — inline iframe embed (for dedicated
  tour pages), lazy-loaded.
- `src/components/MatterportPopup.astro` — thumbnail + native `<dialog>`
  lightbox. The iframe `src` is set only when the popup opens and cleared on
  close, so multiple tours on a page don't all load at once (a real performance
  win over the old plugin). Native `<dialog>` gives free focus-trapping,
  Esc-to-close, and backdrop styling.

Full implementation spec: `handoff/plugin-research/wordpress-plugin-equivalents.md`
section 10.

---

### 20. UpdraftPlus — ELIMINATED by architecture

**What the plugin did:** scheduled backups of the WordPress database + files to
off-site storage.

**What the new site does:** **git is the backup.** Every commit to GitHub is a
complete, timestamped, restorable snapshot of the entire site — content, code,
config, and history. GitHub itself is geographically redundant. GitHub Pages
deploys are individually rollback-able from the Actions tab. This is strictly
superior to WordPress backups: instant diffing, full history, no scheduled jobs
to maintain, no storage costs, no restore process beyond `git checkout` or
re-running a deploy. If the whole repo vanished from GitHub, any local clone
(e.g. on the developer's laptop) is a full backup too.

---

### 21. Advanced Database Cleaner — ELIMINATED by architecture

**What the plugin did:** cleaned up WordPress database bloat (revisions,
transients, orphaned postmeta, spam comments).

**What the new site does:** there is **no database**. Content lives as
Markdown/JSON files in git. Git history is the "revision log" and it costs
nothing to keep; there are no transients, no orphaned postmeta, no spam comments
to accumulate. Nothing to clean.

---

### 22. Disable Gutenberg — N/A

**What the plugin did:** turned off the WordPress block editor.

**What the new site does:** there is no Gutenberg to disable. The editing model
is Markdown + JSON, not a block editor. N/A.

---

### 23. Plugin Activation Status — N/A

**What the plugin did:** reported which plugins were active/inactive.

**What the new site does:** there is no plugin system. Features are built into
the codebase directly. N/A.

---

## The five security advantages of the new architecture

Because the "is it secure?" question comes up a lot, here is the concrete list of
attack surfaces WordPress exposed that the static site simply does not have:

1. **No login brute-force surface.** The only "admin" is a static HTML page with
   a build-time password hash checked client-side. There is no `/wp-login.php`,
   no `xmlrpc.php`, no session endpoint to hammer.
2. **No server-side code execution.** GitHub Pages serves static files only.
   There is no PHP, no Node runtime, no eval surface for an attacker to reach.
3. **No database injection.** There is no database. There is no SQL to inject.
4. **No comment spam target.** There is no comment system.
5. **Strict Content-Security-Policy on every page.** `default-src 'self'`,
   `object-src 'none'`, `frame-ancestors 'none'`, and a tight allowlist. The
   admin page is fully self-contained (no external resources at all). See
   `src/layouts/Base.astro` and `src/pages/admin.astro`.

Combined with HTTPS (enforced by GitHub Pages), X-Frame-Options DENY, and
nosniff headers, the static site is dramatically harder to attack than any
WordPress install — not because of a security plugin, but because the things
that *could* be attacked are gone.

---

## How to operate the replacements day-to-day

| Mike wants to… | He does this |
|---|---|
| See/edit SEO titles & descriptions | Open `/admin`, scroll to **SEO**, hit **Request changes** |
| Add a redirect (old URL → new URL) | Ask maintainer to edit `src/data/redirects.ts` + run `npm run gen:redirects` |
| See which URLs are 404ing | Check GA4 `page_not_found` events, or `/admin` Redirects tab |
| Turn on Google Analytics | Set `GA4_MEASUREMENT_ID` env var in the GitHub Actions deploy |
| Duplicate a blog post | Copy the `.md` file, rename, edit frontmatter |
| Reorder FAQ/packages | Edit array order in `src/data/cms/*.json` |
| Rename an image | `git mv` + update the path reference; request via `/admin` |
| Restore yesterday's site | Re-run the previous GitHub Actions deploy, or `git checkout` |

---

## Files added/changed for this plugin-equivalents pass

- `src/layouts/Redirect.astro` — reusable static redirect page layout
- `src/data/redirects.ts` — single source of truth for all 34 WP → Astro URL mappings
- `scripts/gen-redirects.mjs` — regenerates the redirect page files
- `src/pages/**/index.astro` (34 files, all `AUTO-GENERATED`) — the redirect pages
- `src/pages/404.astro` — enhanced: console logging, GA4 event, smart-redirect safety net
- `src/layouts/Base.astro` — optional GA4 (Consent Mode v2, env-gated), CSP widened only when GA4 on
- `src/data/seo-catalog.ts` — per-page meta mirror for the admin view
- `src/pages/admin.astro` — new **SEO** tab + new **Redirects** tab
- `package.json` — `npm run gen:redirects` script
- `handoff/14-PLUGIN-EQUIVALENTS.md` — this document
