# WordPress Plugin Feature Audit — What to Recreate on the Astro Site

This is the feature-level audit of the **20 plugins** that ran on the old
WordPress site. For each plugin it answers four questions:

1. **What it did in WordPress** — the concrete features the plugin provided.
2. **Handled natively on Astro?** — whether the static site already covers it.
3. **If not handled, what to build** — the specific feature gap (if any).
4. **Priority** — `Critical` (affects user experience / revenue) or `Nice-to-have`.

The headline: **the static Astro architecture eliminates 15 of the 20 plugins
for free**, because there is no PHP server, no MySQL database, no login form,
and nothing served dynamically. Only the **booking** (LatePoint) and **gallery
slider** (Master Slider Pro) families needed real feature work, and both are
already built. Two genuinely need attention after launch (email deliverability
and Matterport embed polish) — see items #9 and #19.

For the per-plugin "what got built and where the code lives" companion, see
`handoff/14-PLUGIN-EQUIVALENTS.md`. This document is the **feature research**
that sits behind it.

> **Why so many are "eliminated by architecture."** WordPress is a dynamic
> application: a PHP server runs code and queries a MySQL database on every
> page request. That is *why* it needs caching plugins, security plugins,
> database-cleaner plugins, backup plugins, and anti-spam plugins. The new
> site is **static HTML** — `astro build` renders every page once, at build
> time, to plain `.html`/`.css`/`.js` files, and GitHub Pages serves them from
> a global CDN. There is no server process to cache, no database to bloat or
> clean, no login form to brute-force, no PHP form handler to spam, and nothing
> to back up beyond the git repo.

---

## Quick scoreboard

| # | Plugin | Handled? | Priority |
|---|---|---|---|
| 1 | LatePoint + all add-ons | **Built** (self-contained widget) | Critical |
| 2 | Master Slider Pro | **Built** (CSS scroll-snap + portfolio lightbox) | Critical |
| 3 | Imagify | **Built** (astro:assets / Sharp, build-time) | Critical |
| 4 | LiteSpeed Cache | Eliminated by architecture | — |
| 5 | Yoast SEO Premium | **Mostly built** (meta, JSON-LD, sitemap, redirects) | Critical |
| 6 | Redirection | **Built** (static redirect pages + 404 monitor) | Critical |
| 7 | UpdraftPlus | Eliminated by architecture (git is the backup) | — |
| 8 | Akismet | **Replaced** (honeypot; no comment surface) | Nice-to-have |
| 9 | Easy WP SMTP | **Gap — needs attention** | Critical |
| 10 | Site Kit by Google | **Built** (GA4 + Search Console, env-gated) | Nice-to-have |
| 11 | Advanced Database Cleaner | Eliminated by architecture | — |
| 12 | Media Cleaner | Eliminated by architecture (build tree-shakes) | — |
| 13 | FileBird Lite | **Built** (real filesystem folders) | Nice-to-have |
| 14 | Phoenix Media Rename | **Built** (admin shows paths; rename = git mv) | Nice-to-have |
| 15 | Simple Page Ordering | **Built** (order fields in JSON data) | Nice-to-have |
| 16 | Yoast Duplicate Post | **Built** (copy-file workflow + admin docs) | Nice-to-have |
| 17 | Disable Gutenberg | N/A (no Gutenberg in a static site) | — |
| 18 | Advanced Editor Tools (TinyMCE) | **Built** (Markdown blog editing) | Nice-to-have |
| 19 | Matterport Shortcode | **Built** (MatterportEmbed + popup); minor polish | Nice-to-have |
| 20 | Simple Google reCAPTCHA | **Replaced** (honeypot, privacy-friendly) | Nice-to-have |

---

## 1. LatePoint + add-ons (Coupons, Custom Fields, Google Calendar, PayPal, Pro Features, Reminders, Service Extras)

**What it did in WordPress.** LatePoint is an appointment-booking plugin with a
multi-step booking wizard. The free core offers unlimited appointments, a
step-by-step booking form, instant booking forms, and booking-form
customization. The paid add-ons layer on: **Service Extras** (up-sells attached
to a service), **Coupons/Promotions** (discount codes), **Custom Fields**
(extra intake questions), **Google Calendar** sync (two-way), **PayPal** plus
Stripe/Apple Pay/Card payments, **Pro Features** (workflows, webhooks, SMS/email
reminders), and **Reminders** (SMS/email notifications triggered by events).

**Handled natively on Astro?** **Partially — and intentionally so.** This is a
photography studio that books by phone/text/email, not a calendar-saaS product.
The Astro site replaces the *booking UX* (not the payment/calendar engine) with:
- `src/components/PriceCalculator.astro` — the live, self-serve quote builder
  (property type, sqft, services, running total) that pre-fills the contact form.
- `src/pages/booking.astro` + `src/components/ContactForm.astro` — the booking
  intake that posts the details to the owner via Formsubmit.co.

**What is NOT recreated (by design):** real-time calendar availability, online
payment at booking time, automated SMS/email reminders, and discount codes.

**Priority: Critical (the booking flow itself is built; the payment/calendar
automation is a deliberate scope cut, not a gap).** If the owner later wants
online deposit collection, the cleanest path is a hosted Stripe Payment Link on
the confirmation screen — no plugin needed.

---

## 2. Master Slider Pro

**What it did in WordPress.** A premium touch layer slider: HTML **layers**
(text/image/content overlays per slide), hardware-accelerated **touch swipe**
navigation, **video backgrounds** (HTML5 self-hosted, with positioning), built-in
**thumbnails** and **tabs** navigation, unlimited slides, smart preloading,
SEO-friendly markup, and full responsiveness.

**Handled natively on Astro?** **Yes.** The site needs two slider behaviours
and both are built without a slider library:
- **Carousel:** `src/components/Gallery.astro` implements a horizontal
  **CSS scroll-snap** carousel (`scroll-snap-type: x mandatory`) with prev/next
  buttons and keyboard support. Native swipe on touch, no JS swipe library, zero
  layout shift.
- **Layered hero / before-after:** `src/components/BeforeAfterSlider.astro`
  provides the draggable before/after comparison (the slider "layers" use case
  that matters for staging portfolios).

**What is NOT recreated:** video-background slides and the admin UI to compose
layered slides visually. Neither is used in the current design.

**Priority: Critical (the sliders that exist are built).** Video-background
slides are a nice-to-have if a future hero needs motion — would be a single
`<video autoplay muted loop>` in a section, not a plugin.

---

## 3. Imagify

**What it did in WordPress.** Image optimization directly from the WP dashboard:
convert images to **WebP and AVIF**, **bulk optimize** the whole media library
at once (Media > Bulk Optimization), automatic **resize** of oversized uploads,
smart multi-level compression, and support for files up to 20 MB. Optimization
happens on upload and on demand, server-side.

**Handled natively on Astro?** **Yes — and better, because it happens at build
time, once, for every image, with no runtime cost.** Astro's `astro:assets`
pipeline (powered by **Sharp**) generates optimized modern formats automatically:
the `<Image>` component emits correctly-sized, compressed images and the build
emits WebP/AVIF where configured. There is no media library to "bulk optimize"
because optimization is the default for every imported asset.

**What to build:** nothing. Confirm the `<Image>` component is used for all
content images (portfolio, services, blog) rather than raw `<img>` tags.

**Priority: Critical (handled natively).**

---

## 4. LiteSpeed Cache

**What it did in WordPress.** Full-page caching with smart purge, CSS/JS/HTML
minification and combination, critical-CSS generation, image lazy loading (via
QUIC.cloud), and QUIC.cloud CDN integration — all to make a dynamic PHP site
fast.

**Handled natively on Astro?** **Eliminated by architecture.** Every page is
pre-rendered to static HTML at build time. There is no server process to cache,
nothing to minify at runtime (Astro minifies CSS/JS at build), lazy loading is
native (`loading="lazy"` is the browser default for `astro:assets` images), and
GitHub Pages serves the files from a global CDN already.

**What to build:** nothing.

**Priority: — (eliminated).**

---

## 5. Yoast SEO Premium

**What it did in WordPress.** Per-page title/meta editing, **readability and SEO
content analysis** (the red/amber/green bullets while editing), **internal
linking suggestions** (suggests related/cornerstone posts to link to),
**redirect manager** (301s from the dashboard), **schema blocks** (FAQ, How-to
structured data), social/OG previews, XML sitemap generation, and breadcrumbs.

**Handled natively on Astro?** **Mostly — all the user-facing output is built;
only the editorial "analysis while typing" is not.**
- Per-page meta (title, description, canonical, OG, Twitter): `src/layouts/Base.astro`.
- JSON-LD structured data (LocalBusiness, Service, FAQ, Breadcrumbs): `Base.astro` + `src/components/ServiceSchema.astro`, sourced from `src/data/seo-catalog.ts`.
- XML sitemap: `@astrojs/sitemap` (built `sitemap-index.xml`).
- Breadcrumbs: rendered in the layout.

**What is NOT recreated:** the **readability/SEO analysis panel** that scores
content as you type, and **internal-linking suggestions**. These are authoring
aids, not site features — visitors never see them.

**Priority: Critical (the SEO output is built).** For the editorial analysis,
the maintainer can run content through any free tool (Yoast's own, RankMath,
Hemingway) before publishing. No build needed.

---

## 6. Redirection

**What it did in WordPress.** Manage **301/302/307 redirects**, **regex**
matching, exact/prefix/regex match types, **404 error monitoring** (logs every
broken URL), **redirect groups** for organization, import/export of redirect
rules, and per-redirect hit logging.

**Handled natively on Astro?** **Yes.**
- Redirects are static pages: `src/layouts/Redirect.astro` + `src/data/redirects.ts`
  generate one tiny HTML file per redirect that performs the `<meta http-equiv>`
  + canonical jump. ~34 redirects are configured.
- 404 monitoring: `src/pages/404.astro` is a branded 404 page.

**What is NOT recreated:** live 404 hit logging (because there is no server to
log to) and an admin UI to add redirects without editing code. 404 data is
instead available through **Google Search Console** (see #10).

**Priority: Critical (redirects are built).** To add a redirect, add a row to
`src/data/redirects.ts` and rebuild — documented in the admin panel spec.

---

## 7. UpdraftPlus

**What it did in WordPress.** Manual and **scheduled backups** (separate
schedules for files vs. database), **cloud storage** destinations (Amazon S3,
Google Drive, Dropbox, FTP/SFTP), one-click **restore**, site migration, and
(Premium) incremental backups.

**Handled natively on Astro?** **Eliminated by architecture.** The entire site
is source code in a git repository. Git **is** the backup: every change is
versioned, and the repo can be cloned anywhere. Deployed output lives on GitHub
Pages, which is itself redundant. There is no database to back up and no
`wp-content/uploads/` directory of irreplaceable runtime uploads — every image
is a committed asset.

**What to build:** nothing. Ensure the git repo is pushed to a remote (GitHub)
and optionally mirrored to a second remote for off-site redundancy.

**Priority: — (eliminated).**

---

## 8. Akismet

**What it did in WordPress.** Cloud-based anti-spam that automatically checked
every comment and form submission against a global spam database, filtering with
~99.99% accuracy, with a status history per item. Protected comments and contact
forms (integrates with Contact Form 7, WPForms).

**Handled natively on Astro?** **Replaced, more cheaply.** There is no comment
system on the static site, so the largest spam surface is gone. The contact form
(`src/components/ContactForm.astro`) uses a **honeypot field** (`_honey`,
recognized natively by Formsubmit.co) plus Formsubmit's own server-side filters.
Bots fill the hidden honeypot; humans don't, and the submission is dropped
silently.

**What to build:** nothing. If spam ever gets through, add a second honeypot or
a time-based check (reject submissions under 3 seconds).

**Priority: Nice-to-have (already handled).**

---

## 9. Easy WP SMTP

**What it did in WordPress.** Reconfigured `wp_mail()` to send through an
authenticated SMTP relay (Gmail, Outlook, SendLayer, Brevo, SMTP.com, Amazon
SES, or custom "Other SMTP") so transactional emails (form notifications,
password resets) actually reached inboxes instead of being marked spam.
Included host/port/encryption settings and an email log to view/resend.

**Handled natively on Astro?** **This is the one genuine gap to watch.** The
contact form does **not** use WordPress mail at all — it posts via AJAX to
**Formsubmit.co**, which handles delivery (and its own deliverability) and
forwards to the owner's inbox. That replaces the SMTP relay for the contact
form.

**What to build / verify:** confirm Formsubmit deliverability to the owner's
address after launch (check spam folder, whitelist the sender). If the owner
later needs *transactional* email the site itself triggers (e.g. an automated
confirmation reply to the visitor), that is **not** currently built and would
require wiring Formsubmit's `_template` auto-reply, or a small serverless
function. Not needed for launch.

**Priority: Critical to verify at launch; the auto-reply is a nice-to-have.**

---

## 10. Site Kit by Google

**What it did in WordPress.** One-stop dashboard integrating **Google
Analytics**, **Search Console**, **AdSense**, and **PageSpeed Insights**, with
simplified OAuth setup and easy site-ownership verification (no manual meta tag
pasting).

**Handled natively on Astro?** **Yes.**
- **Analytics (GA4):** `src/layouts/Base.astro` injects gtag.js when the
  `GA4_MEASUREMENT_ID` environment variable is set, with Google Consent Mode v2
  (consent denied by default — cookieless pings until the visitor opts in).
- **Search Console:** site verification is a one-time meta-tag or DNS step; once
  done, Search Console is the analytics surface and needs no in-site code.
- **PageSpeed Insights:** a Google web tool, nothing to build into the site.

**What is NOT recreated:** the in-dashboard unified stats view. The owner views
Analytics/Search Console directly in their Google accounts.

**Priority: Nice-to-have (core integrations built).** Set `GA4_MEASUREMENT_ID`
at deploy time to enable analytics.

---

## 11. Advanced Database Cleaner

**What it did in WordPress.** Cleaned the MySQL database: deleted post revisions,
spam comments, auto-drafts, expired transients, autoloaded options; optimized
tables; (Premium) detected and removed **orphaned options, tables, and post
meta**; scheduled WP-Cron cleanups; showed database analytics.

**Handled natively on Astro?** **Eliminated by architecture.** There is no
database. Content lives in JSON/Markdown files in `src/data/cms/` and
`src/content/`, version-controlled. There is nothing to bloat, nothing to
optimize, and no orphan rows to clean.

**What to build:** nothing.

**Priority: — (eliminated).**

---

## 12. Media Cleaner

**What it did in WordPress.** Scanned the media library to find images **not
referenced** in any post/page, flagged broken images, and let you delete unused
files to reclaim storage and keep the library tidy.

**Handled natively on Astro?** **Eliminated by architecture.** The Astro build
**tree-shakes unreferenced assets** — a file in `public/` or `src/` that nothing
imports is simply not emitted to `dist/`. Unused images never ship. The source
folder can be cleaned manually (it is just a directory), and the build output is
guaranteed lean.

**What to build:** nothing. Optionally run `git grep` for an image filename to
confirm it is referenced before deleting it from the repo.

**Priority: — (eliminated).**

---

## 13. FileBird Lite

**What it did in WordPress.** Added a **virtual folder tree** to the media
library (sidebar navigation, drag-and-drop, 10 sort modes) so images could be
organized visually even though WordPress stores every upload in one flat
`uploads/` directory.

**Handled natively on Astro?** **Yes — and with real folders, not virtual ones.**
Media lives in real filesystem directories under `public/images/`:
`portfolio/`, `clients/`, `team/`, `services/`, etc. Any file browser, IDE, or
`ls` shows the structure. No virtualization layer needed.

**What to build:** nothing. Keep the folder convention documented for the owner.

**Priority: Nice-to-have (handled natively).**

---

## 14. Phoenix Media Rename

**What it did in WordPress.** Renamed media files **after upload** to clean,
SEO-friendly filenames (instead of `IMG_1234.jpg`), and automatically updated
the references wherever the file was used in posts/pages. Improved image SEO.

**Handled natively on Astro?** **Yes, by workflow.** Files are committed with
descriptive names from the start (e.g. `sierra-skye-living.jpg`), and the admin
panel (`src/pages/admin.astro`) shows the image paths so the owner can see what
each asset is called. Renaming is a `git mv` plus a find/replace on the
reference — tracked, reviewable, no orphaned references.

**What to build:** nothing. The admin panel already surfaces paths.

**Priority: Nice-to-have (handled by workflow).**

---

## 15. Simple Page Ordering

**What it did in WordPress.** Let the admin **drag-and-drop reorder** pages (and
custom post types) in the admin to change their menu/sort order, persisting the
new order with a single drop.

**Handled natively on Astro?** **Yes — via explicit order fields.** Every
ordered collection (packages, services, testimonials, FAQ, portfolio) is a JSON
array in `src/data/cms/*.json`. Order is the array order; reordering is moving a
line in the JSON. The admin panel renders these lists in order so the owner can
see the result.

**What to build:** nothing. Drag-and-drop in the admin would be a nice-to-have
UX improvement but is not functional gap — the JSON array order is the source of
truth.

**Priority: Nice-to-have (ordering works; UI polish optional).**

---

## 16. Yoast Duplicate Post

**What it did in WordPress.** Added "Clone" / "New Draft" links to the post/page
list so an existing item could be copied (including meta) as a starting point
for a new one — a common workflow for similar pages or repeated post templates.

**Handled natively on Astro?** **Yes, by workflow.** Duplicating a page is
copying a file (`cp src/pages/old.astro src/pages/new.astro`) and editing the
content. The admin panel spec (`handoff/10-ADMIN-PANEL-SPEC.md`) documents the
copy-file workflow. Because content is separated from layout (JSON data +
Markdown), duplicating a *content item* is even simpler — duplicate an object in
the relevant JSON file.

**What to build:** nothing.

**Priority: Nice-to-have (handled by workflow).**

---

## 17. Disable Gutenberg

**What it did in WordPress.** Turned off the block editor (Gutenberg) and
restored the Classic Editor (TinyMCE) — either site-wide or per post type — for
owners who preferred the older editing experience.

**Handled natively on Astro?** **N/A.** There is no Gutenberg (and no WordPress)
in a static Astro site. The "editor" is whatever the maintainer uses on their
machine (VS Code, etc.) editing Markdown/JSON/Astro files. There is nothing to
disable.

**What to build:** nothing.

**Priority: — (not applicable).**

---

## 18. Advanced Editor Tools (TinyMCE Advanced)

**What it did in WordPress.** Enhanced the Classic Editor with 15 TinyMCE
plugins: advanced table editing, font family/size/colour controls, search/replace
in content, custom formatting buttons, and a configurable toolbar.

**Handled natively on Astro?** **Yes, by a different (better) model.** Blog
content is authored in **Markdown** in `src/content/blog/`. Markdown gives the
same structural controls (headings, lists, tables, bold/italic, links, images,
code blocks) in plain text, rendered to clean HTML by Astro. It is portable,
diffable, and editor-agnostic — no proprietary toolbar lock-in.

**What to build:** nothing. The maintainer edits Markdown in their preferred
editor; the build renders it.

**Priority: Nice-to-have (handled natively via Markdown).**

---

## 19. Matterport Shortcode

**What it did in WordPress.** Provided a `[matterport]` **shortcode** (and
plugins like MPEmbed) to embed a Matterport 3D tour in a page or post, often
with a gallery grid that opened tours in a **lightbox overlay**, including
address and scan metadata pulled from the Matterport account.

**Handled natively on Astro?** **Yes, and with deeper integration than the
shortcode offered.**
- `src/components/MatterportEmbed.astro` — the responsive iframe wrapper for an
  inline tour.
- `src/components/MatterportPopup.astro` — opens a tour in a dialog popup
  (lightbox) triggered from the portfolio, with a "View 3D Tour" button when a
  shot has a `matterportId`.
- Portfolio shots carry an optional `matterportId` (`src/data/cms/portfolio.json`)
  so the lightbox knows which model to open.

**What to build / polish:** the embed is built. Minor nice-to-have: confirm the
popup sizing/autostart behaviour matches the old shortcode output on the
portfolio page. No functional gap.

**Priority: Nice-to-have (built; polish optional).**

---

## 20. Simple Google reCAPTCHA

**What it did in WordPress.** Added a Google reCAPTCHA (v2 checkbox or v3
invisible) to comment, login, and contact forms to block bots, with admin
configuration of site/secret keys and per-form placement.

**Handled natively on Astro?** **Replaced, deliberately, with a privacy-friendly
honeypot** (see #8). There is no login form to protect, and the contact form's
honeypot handles bot submissions without forcing visitors to solve a challenge
or loading Google's tracking script. This is both simpler and better for privacy
(GDPR/CCPA) and page weight.

**What to build:** nothing. If the honeypot is ever insufficient, a reCAPTCHA
or Turnstile can be added to `ContactForm.astro`, but it is not needed now.

**Priority: Nice-to-have (replaced by honeypot).**

---

## Summary: what actually needs work

Only **one item needs active attention at launch**, and it is a configuration
check, not a build:

- **#9 Easy WP SMTP → verify Formsubmit.co deliverability** to the owner's inbox
  (whitelist the sender). The contact form already works; this is just making
  sure the emails land.

Two items are **nice-to-have polish**, not gaps:

- **#5 Yoast SEO Premium** — the editorial analysis panel is an authoring aid
  only; all visitor-facing SEO output is built.
- **#19 Matterport Shortcode** — the embed/popup is built; optionally confirm
  the popup styling matches the old shortcode.

Everything else is either **built** (booking, slider, image optimization, SEO
output, redirects, analytics, media folders, ordering, duplication, spam
protection, Matterport embed) or **eliminated by the static architecture**
(caching, backups, database cleaning, media cleaning, Gutenberg disabling).
