# WordPress Plugin → Static Site (Astro/Cloudflare Pages) Equivalents

Context: Rebuilding Virtual Tours Las Vegas (Mike Madsen's real estate photography site) as an Astro static site on Cloudflare Pages with a git-based CMS.

**SUPERSEDED NOTE:** this file's original pass marked several plugins "NOT NEEDED" on the reasoning that the static architecture removes the underlying problem. **The client explicitly rejected that framing** — the instruction was: every plugin needs a real, recreated feature built into the new site's own admin panel, not a dismissal, regardless of whether the underlying WordPress-specific problem technically still applies. Three follow-up docs in this same folder now give the actual concrete build specs and supersede any "NOT NEEDED" verdict below for the plugins they cover:

- **`admin-content-tools.md`** — Advanced Database Cleaner, Advanced Editor Tools, Disable Gutenberg, FileBird Lite, Media Cleaner, Phoenix Media Rename, Simple Page Ordering, Yoast Duplicate Post, Plugin Activation Status
- **`seo-analytics-performance.md`** — Yoast SEO + Premium, Site Kit by Google, Imagify, LiteSpeed Cache
- **`security-reliability-comms.md`** — Akismet, Simple Google reCAPTCHA, Easy WP SMTP, UpdraftPlus, Redirection

Treat the sections below as background/history on what each plugin originally did (still useful context) — but for the plugins listed above, the real build spec is in the follow-up doc, not the "NOT NEEDED" verdict here. Matterport Shortcode and Master Slider Pro were already given real recreated-feature specs in the original pass below and don't need a follow-up (LatePoint has its own dedicated doc, `latepoint-booking-system.md`).

---

## 1. Advanced Database Cleaner (v4.2.0)
**Verdict: NOT NEEDED**

Reasoning: This plugin exists to clean up WP's MySQL database — post revisions, transients, orphaned postmeta, spam comments, expired sessions — bloat that accumulates because WordPress stores everything (including drafts, revisions, and plugin cruft) in a live relational database. A static Astro site has no database at all; content lives as Markdown/MDX/JSON files in git. There is nothing to "clean" — git history is the revision log, and it costs nothing to keep.

---

## 2. Advanced Editor Tools (v5.9.2, Automattic)
**Verdict: NOT NEEDED**

Reasoning: This extends the Gutenberg/TinyMCE block editor (adds classic paragraph tools, formatting, table controls) inside wp-admin. There is no WP admin or Gutenberg editor in the new stack. Content editing happens through the git-based CMS's own editor (e.g., Decap CMS, Tina CMS, or Sveltia CMS depending on choice), which has its own Markdown/rich-text UI. Any formatting needs are handled by the CMS's built-in markdown editor or MDX components — not a WP plugin.

---

## 3. Akismet Anti-spam (v5.7)
**Verdict: DEPENDS — only needed if the new site keeps live comments/forms server-side; otherwise NOT NEEDED for the site itself, but a form-spam solution is still required**

Reasoning: Akismet filters spam on WP comments and Contact Form 7/Gravity Forms submissions, which are processed by PHP running server-side. A static site has no comment system and no server processing forms directly. However, this site clearly has a contact/quote-request form (real estate photography business) — that form still needs spam protection once it posts to whatever backend you choose (Cloudflare Pages Functions, a form service, or an email API).

Replacement approach: Use **Cloudflare Turnstile** (see #14 below — same tool covers both reCAPTCHA and this need) on the contact form, combined with server-side validation in a Cloudflare Pages Function (or Worker) that handles the submission. Turnstile blocks the bot traffic before it ever reaches your form handler, which covers the same threat Akismet covered, just earlier in the pipeline. No separate anti-spam plugin/service needed.

---

## 4. Disable Gutenberg (v3.3.2)
**Verdict: NOT NEEDED**

Reasoning: This plugin turns off the block editor in favor of the classic editor — a UI preference within wp-admin. Astro + a git-based CMS has no Gutenberg to disable; the CMS defines its own editing UI (form fields, Markdown body, MDX components) independent of WordPress entirely.

---

## 5. Easy WP SMTP (v2.15.0)
**Verdict: NEEDS A REPLACEMENT**

Reasoning: WordPress's default `wp_mail()` uses PHP's `mail()` function, which is unreliable and frequently flagged as spam — this plugin routes mail through a real SMTP provider/API instead. A static site has no PHP mail layer at all, so the underlying problem (unreliable default mail) doesn't exist — but the actual business need (contact-form notifications and autoresponders reaching Mike reliably) absolutely still exists and must be solved.

Modern equivalent: Send transactional email from a **Cloudflare Pages Function / Worker** using a dedicated email API — options in rough order of fit for a solo small-business site:
- **Resend** (developer-friendly, generous free tier, simple API, good deliverability) — most common modern choice for this exact use case.
- **Cloudflare Email Workers / MIMEText + Workers** if staying fully in the Cloudflare ecosystem is a priority (more setup, less polish than Resend).
- **Postmark** or **SendGrid** as enterprise-grade alternatives.

Implementation: contact form POSTs to a Pages Function → function validates + checks Turnstile token → function calls the email API to send Mike a notification (and optionally a confirmation to the visitor). Domain SPF/DKIM/DMARC records set up for deliverability, same as any SMTP setup would require.

---

## 6. FileBird Lite (v6.5.5)
**Verdict: NOT NEEDED**

Reasoning: FileBird organizes the WP Media Library (a flat, database-indexed blob store) into virtual folders because WP doesn't natively support folder hierarchies for uploads. In a static site, media assets are just files in the git repo / `src/assets` or `public/` directory (or an object store like Cloudflare R2 or an image CDN like Cloudinary/imgix if the library is large) — real filesystem folders, organized however you like, natively. No plugin needed to simulate folders that already exist.

---

## 7. Imagify (v2.3.0)
**Verdict: NOT NEEDED — replaced by build-time tooling, not a plugin**

Reasoning: Imagify compresses images and converts them to WebP/AVIF on upload because WordPress serves whatever raw file was uploaded, at whatever size, with no build pipeline. Astro has this built in.

Modern equivalent: **`astro:assets`** (Astro's native image pipeline) — import images and use the `<Image>` / `<Picture>` components, which automatically:
- Resize to appropriate responsive dimensions
- Convert to WebP/AVIF with configurable quality
- Generate `srcset`/`sizes` for responsive `<picture>` markup
- Optimize at build time (or on-demand via the Cloudflare/Squoosh image service)

For a photography-heavy site with a large existing image library (this business's core asset), pair this with **Cloudflare Images** or keep originals in R2 and let `astro:assets`' remote image support / a Cloudflare Image Resizing transform handle on-the-fly variants — avoids bloating the git repo with hundreds of MB of photos while still getting automatic format/size optimization.

---

## 8. LiteSpeed Cache (v7.8.1)
**Verdict: NOT NEEDED**

Reasoning: LiteSpeed Cache exists to work around WordPress generating pages dynamically on every request (PHP execution + DB queries) by caching rendered HTML, minifying assets, and optimizing critical CSS. Astro's static output pre-renders every page to plain HTML/CSS/JS at build time — there is no per-request PHP/DB round trip to cache. Cloudflare Pages then serves those static files from Cloudflare's global CDN edge network automatically, which is a faster and more reliable version of what a caching plugin approximates on top of a dynamic CMS. Nothing to configure beyond Cloudflare's default caching (and optionally Cache Rules for fine control), which come free with Pages.

---

## 9. Master Slider Pro (v3.7.15)
**Verdict: NEEDS A REPLACEMENT — but as a lightweight custom Astro component, not a plugin**

Reasoning: Master Slider is a heavy jQuery-based slider/carousel plugin (large JS/CSS payload, admin UI for building slides) needed because WP has no native carousel primitive. For a photography site, image galleries/hero sliders are a real, ongoing need — just don't need a plugin's worth of code to do it.

Modern equivalent: Build a small **Astro component** (or use a minimal headless library) for carousels:
- For a simple hero/gallery slider: native CSS scroll-snap (`overflow-x: auto; scroll-snap-type: x mandatory`) — zero JS, buttery smooth, works everywhere.
- For more interactive needs (autoplay, dots, swipe gestures): a lightweight library like **Swiper.js** (loaded only on pages that need it, tree-shaken, ~30-40KB) or **Embla Carousel** (headless, tiny, framework-agnostic) wrapped in an Astro island (hydrated only where used via `client:visible`).
- Content (image lists per slider) comes from the CMS as a simple array field/collection, not an admin slide-builder UI.

This eliminates Master Slider Pro's license cost and its jQuery dependency while giving equal or better performance.

---

## 10. Matterport Shortcode (v2.2.2, MPEmbed.com)
**Verdict: NEEDS A REPLACEMENT — full implementation plan below**

Reasoning: This plugin provided a `[matterport]` shortcode that (a) rendered a gallery of Matterport 3D tour thumbnails (cached locally to avoid hammering Matterport's API on every page load), and (b) opened the full tour in a Magnific Popup lightbox/modal when clicked, rather than navigating away from the page. This is a genuine, actively-used feature — real estate listings with Matterport tours are core to the business — and needs a clean, purpose-built equivalent.

### How Matterport embeds actually work
Matterport tours are embedded via an iframe pointing at their showcase player:
```
https://my.matterport.com/show/?m=<MODEL_SID>
```
Common query params worth supporting:
- `&play=1` — autostart the tour
- `&brand=0` — hide Matterport branding (plan-dependent)
- `&mls=1` — MLS-compliant mode (hides certain UI, useful for real estate)
- `&qs=1` — quickstart/simplified UI

Matterport also exposes a thumbnail/screenshot for a given model SID via their public model image endpoint (or you can just store a manually-uploaded hero photo per listing — simpler and more reliable than scraping Matterport's thumbnail API, and avoids re-implementing what "Matterport Shortcode" cached).

### Recommended architecture
**Data model (in the CMS):** each listing/tour entry gets a content field:
```yaml
matterportId: "abc123XYZ"       # the model SID
matterportThumbnail: "/images/listings/123-main-st.jpg"  # manually uploaded, optimized via astro:assets
matterportAutoplay: false
```
Storing the thumbnail as a real asset (not a live-fetched Matterport thumbnail) is more reliable, faster, and gets full `astro:assets` optimization — this is actually a robustness improvement over the plugin's "cached thumbnail" behavior, since it's not dependent on Matterport's API being up.

**Component: `MatterportEmbed.astro` (or a `.tsx` island if interactivity needs React/Svelte state)**

Two display modes, both worth building since the plugin supported both patterns (inline gallery + popup):

1. **Inline iframe** (for a dedicated tour page, e.g. `/listings/123-main-st/tour`):
```html
<div class="matterport-embed" style="aspect-ratio: 16/9;">
  <iframe
    src={`https://my.matterport.com/show/?m=${matterportId}&mls=1`}
    loading="lazy"
    allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
    allowfullscreen
    style="width:100%; height:100%; border:0;"
  ></iframe>
</div>
```
Use `loading="lazy"` and/or only mount the iframe after an intersection observer fires (or on click of a thumbnail overlay) — Matterport's player is heavy (loads its own WASM/3D engine), so don't eagerly load it if it's below the fold.

2. **Popup/lightbox mode** (replacing Magnific Popup, used on listing grid/gallery pages): a small client-side island using a native `<dialog>` element rather than a jQuery lightbox library — no dependency needed:
```astro
---
// MatterportPopup.astro
const { matterportId, thumbnail, alt } = Astro.props;
---
<button class="tour-thumb" data-matterport-id={matterportId} aria-label={`Open 3D tour: ${alt}`}>
  <img src={thumbnail} alt={alt} loading="lazy" />
  <span class="play-badge">▶ 3D Tour</span>
</button>

<dialog class="matterport-dialog">
  <button class="close-btn" aria-label="Close tour">✕</button>
  <iframe class="matterport-frame" allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen" allowfullscreen></iframe>
</dialog>

<script>
  // Runs client-side; delegate click, set iframe src only on open (avoids preloading every tour on the page)
  document.querySelectorAll('.tour-thumb').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-matterport-id');
      const dialog = document.querySelector('.matterport-dialog');
      const iframe = dialog.querySelector('.matterport-frame');
      iframe.src = `https://my.matterport.com/show/?m=${id}&play=1`;
      dialog.showModal();
    });
  });
  document.querySelectorAll('.close-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dialog = btn.closest('dialog');
      dialog.querySelector('iframe').src = ''; // stop the tour audio/rendering on close
      dialog.close();
    });
  });
</script>
```
Key details that matter for a good implementation:
- **Only set the iframe `src` when the popup opens**, and clear it on close — this is exactly what the plugin's "popup viewer" pattern did, and it matters because Matterport tours are expensive to load (avoid loading N tours simultaneously on a gallery page).
- Native `<dialog>` gives free focus-trapping, `Esc`-to-close, and backdrop styling (`::backdrop`) — no Magnific Popup dependency at all.
- If multiple tours appear on one page (e.g., a "featured tours" grid on the homepage), this pattern scales fine since each thumbnail is a real static image and the iframe is shared/reused or created on demand.
- For SEO/sharing, also generate a dedicated static page per tour (`/tours/[slug].astro`) with the inline iframe mode plus proper meta tags (OG image = the static thumbnail) — this gives each tour a crawlable, shareable URL, which a pure popup-only approach would not.

**Gallery page**: an Astro collection query pulls all listings with a `matterportId`, renders a responsive grid of `MatterportPopup` thumbnails — replacing the plugin's gallery shortcode.

No paid service or plugin is required — Matterport tours are free to embed via iframe for anyone with a Matterport account (same as today), and the entire "gallery + popup" UX is ~100 lines of Astro/vanilla JS with zero new dependencies.

---

## 11. Media Cleaner (v7.2.5)
**Verdict: NOT NEEDED**

Reasoning: This plugin scans the WP database/filesystem for orphaned media files (uploaded but no longer referenced anywhere) because WP's media library and content are decoupled and drift over time. In a git-based static site, unused image files are simply unused files in the repo — visible via `git status`/a directory listing, and if Astro's build ever references a missing asset it fails the build loudly (no silent orphaning). Optionally, an image usage lint script could be added in CI, but that's a nice-to-have, not a replacement for a required plugin — there's no live-site risk from orphaned media the way there is in WP.

---

## 12. Phoenix Media Rename (v3.13.3)
**Verdict: NOT NEEDED**

Reasoning: This exists because WordPress auto-generates unfriendly filenames (`IMG_4821.jpg`, `screenshot-2024...`) and changing them post-upload normally breaks all references throughout the DB — the plugin exists specifically to safely rename files *and* update every reference. In the new architecture, files are named directly on disk by whoever uploads them (Mike or the developer, via git or the CMS's media picker), and references are explicit imports/paths in Markdown/MDX/component code — renaming a file is a normal `git mv` plus updating the one or two places it's referenced (or the CMS handles this if using its media library UI). No database rewrite risk exists because there's no database.

---

## 13. Redirection (v5.9.0)
**Verdict: NEEDS A REPLACEMENT — but simpler, config-based, not a plugin**

Reasoning: Redirection manages 301 redirects and logs 404s from within wp-admin because WP has no native redirect management and URL structures often change during content edits. This is a real, ongoing need (especially during and after a site migration — old WP URLs must 301 to new Astro URLs to preserve SEO rankings) — it just doesn't need a database-backed admin UI to solve.

Modern equivalent: **Cloudflare Pages `_redirects` file** (plain text, one rule per line, deployed alongside the site):
```
/old-listing-url/  /listings/new-slug/  301
/blog/some-post   /articles/some-post  301
```
For pattern-based/wildcard redirects or more complex logic, use **Cloudflare Bulk Redirects** (dashboard-managed, no redeploy needed, good for post-launch fixes Mike might need without a dev) or `astro.config.mjs`'s built-in `redirects` config for build-time redirects.

For 404 monitoring (the other half of what Redirection did): Cloudflare's **Web Analytics** or **GA4** will surface 404 traffic in reports, or a lightweight Cloudflare Worker can log 404s to a dataset (Analytics Engine) if closer monitoring is wanted. Since this is a full site rebuild, the critical one-time task is exporting the full current WP URL list (via the existing Redirection plugin's log, or a crawl) and mapping every old URL to its new equivalent in `_redirects` before launch — this is the single most important SEO-preservation step in the whole migration.

---

## 14. Simple Google reCAPTCHA (v4.0)
**Verdict: NEEDS A REPLACEMENT**

Reasoning: reCAPTCHA protects WP forms from bots/spam submissions server-side. The underlying need (protecting the contact form) persists in the static site.

Modern equivalent: **Cloudflare Turnstile** — Cloudflare's own CAPTCHA alternative, free, privacy-friendly (no user tracking/puzzle-solving required in most cases), and integrates natively since the site is already on Cloudflare Pages.
- Add the Turnstile widget (`<div class="cf-turnstile" data-sitekey="...">` + Cloudflare's script) to the contact form.
- Verify the token server-side in the Cloudflare Pages Function that handles form submission, by POSTing to Cloudflare's `siteverify` endpoint before sending the email (see #5).
- This is strictly better than reCAPTCHA for this stack: no third-party Google dependency, faster, and usually invisible to real users (no "click the traffic lights" challenge in most configurations).

---

## 15. Simple Page Ordering (v2.8.0)
**Verdict: NOT NEEDED**

Reasoning: This adds drag-and-drop reordering to the wp-admin page/post list, since WP's default menu_order UI is clunky. Ordering in the new stack is just an explicit `order` frontmatter field per content item (or array order in a JSON/YAML list) that the CMS UI exposes as a number field or, if using Tina CMS or a similar CMS with list-reordering UI, actual drag-and-drop reordering of collection entries — several git-based CMS options support this natively for arrays/lists.

---

## 16. Site Kit by Google (v1.183.0)
**Verdict: NOT NEEDED as a plugin — the underlying services (GA4, Search Console, PageSpeed) still get used directly**

Reasoning: Site Kit's value is embedding Google Analytics/Search Console/PageSpeed dashboards inside wp-admin for convenience. There's no wp-admin to embed anything into anymore, but the actual services (Analytics, Search Console) are independent of WordPress entirely and continue to work exactly the same.

Modern equivalent:
- **Analytics**: add the **GA4 gtag.js snippet** directly in Astro's base layout `<head>` (a few lines), or use **Cloudflare Web Analytics** (privacy-friendly, no cookies, free, one script tag, zero performance cost via Cloudflare's beacon) — many small businesses now run Cloudflare Web Analytics as primary/only analytics since it's already free with Pages hosting. Can run both if Mike wants GA4's richer reporting alongside Cloudflare's simpler dashboard.
- **Search Console**: unaffected by the site rebuild — verify the new domain/property (or keep existing verification if it's a DNS/HTML-tag method) and submit the new `sitemap.xml` (Astro generates this via `@astrojs/sitemap` integration). No plugin needed; Search Console is accessed directly at search.google.com/search-console, same as always.
- **PageSpeed Insights**: also just a website (pagespeed.web.dev) — check scores there directly. Astro static output typically scores far higher out of the box than WordPress ever did, so this becomes less of an ongoing concern.

---

## 17. UpdraftPlus (v1.26.6)
**Verdict: NOT NEEDED**

Reasoning: UpdraftPlus backs up the WP database and files to protect against server failure, hacking, or bad updates — necessary because WP sites are a live, mutable server + database that can be corrupted or lost at any time. In the new architecture, all content lives in a **git repository** — every commit is a complete, timestamped, restorable snapshot of the entire site, hosted on GitHub/GitLab (redundant, versioned, free). Cloudflare Pages deploys are also individually rollback-able from the dashboard with one click. This is strictly superior to WP backups: instant diffing, full history, no scheduled backup jobs to maintain or storage costs to pay, and no restore process beyond `git checkout` or a Pages rollback click.

---

## 18. Yoast Duplicate Post (v4.7)
**Verdict: NOT NEEDED**

Reasoning: Lets editors clone a WP post/page as a starting point for a new one. In a git-based CMS workflow, the equivalent is trivially copying an existing Markdown/MDX file (or, in the CMS UI, most git-based CMS tools like Decap/Tina offer a "duplicate entry" action natively) and editing the frontmatter/slug — a basic file operation, not a feature that needs a dedicated plugin.

---

## 19. Yoast SEO + Yoast SEO Premium (v28.1 / v28.0)
**Verdict: NEEDS A REPLACEMENT — as code/config, not a plugin, split across a few pieces**

Reasoning: Yoast handles meta titles/descriptions, Open Graph/Twitter cards, canonical URLs, XML sitemaps, schema.org structured data (very relevant here — LocalBusiness/RealEstateAgent schema for a photography business), redirects for slug changes, and readability/SEO content analysis while editing. Each of these is a real, still-needed capability — Astro just handles them as code/config rather than a runtime plugin, and most run at build time (faster, and impossible to misconfigure into breaking the live site).

Modern equivalent, piece by piece:
- **Meta titles/descriptions/canonical/OG/Twitter tags**: a shared `<SEO.astro>` component (or use the community `astro-seo` package) that every page passes `title`/`description`/`image` props into — these become CMS frontmatter fields (`seoTitle`, `seoDescription`, `ogImage`) editable per page/post, same editorial workflow Yoast gave, just simpler.
- **XML sitemap**: `@astrojs/sitemap` official integration — auto-generates `sitemap.xml` at build time from your routes, zero maintenance.
- **robots.txt**: a static file in `public/robots.txt`, hand-written (trivial for a site this size).
- **Structured data / schema.org** (LocalBusiness, RealEstateAgent, ImageObject for tour photos, BreadcrumbList): JSON-LD `<script type="application/ld+json">` blocks generated from the same frontmatter/CMS data, injected via the SEO component or per-page-type templates. This is arguably an improvement over Yoast's generic schema — can hand-craft exactly the schema types relevant to a real estate photographer (RealEstateAgent + Service + individual tour pages as CreativeWork/ImageObject).
- **Redirects for changed slugs**: covered by #13 above (`_redirects` / Cloudflare Bulk Redirects).
- **Readability/SEO content analysis while writing**: the one piece with no exact equivalent, since it's an editorial UX feature inside Yoast's Gutenberg sidebar. Not strictly necessary for a static site (Mike can use any external SEO checker like Google's own tools, or a lightweight one like the free tier of Surfer/Frase if wanted) — but there's no drop-in "install this and get the same sidebar" replacement. Reasonable to explicitly flag this as an accepted workflow change: SEO writing becomes a manual best-practices checklist rather than live in-editor scoring.

---

## Summary Table

| # | Plugin | Verdict |
|---|---|---|
| 1 | Advanced Database Cleaner | Not needed |
| 2 | Advanced Editor Tools | Not needed |
| 3 | Akismet Anti-spam | Not needed (covered by Turnstile on the form) |
| 4 | Disable Gutenberg | Not needed |
| 5 | Easy WP SMTP | Replace: Resend/Cloudflare Email Workers via Pages Function |
| 6 | FileBird Lite | Not needed |
| 7 | Imagify | Replace: `astro:assets` (+ optionally Cloudflare Images/R2) |
| 8 | LiteSpeed Cache | Not needed (Cloudflare CDN + static output) |
| 9 | Master Slider Pro | Replace: custom Astro component (CSS scroll-snap or Swiper/Embla) |
| 10 | Matterport Shortcode | Replace: custom `MatterportEmbed`/`MatterportPopup` Astro components (iframe + native `<dialog>`) — detailed plan above |
| 11 | Media Cleaner | Not needed |
| 12 | Phoenix Media Rename | Not needed |
| 13 | Redirection | Replace: `_redirects` file / Cloudflare Bulk Redirects |
| 14 | Simple Google reCAPTCHA | Replace: Cloudflare Turnstile |
| 15 | Simple Page Ordering | Not needed (CMS list ordering / frontmatter field) |
| 16 | Site Kit by Google | Not needed as plugin (use GA4/Cloudflare Web Analytics/Search Console directly) |
| 17 | UpdraftPlus | Not needed (git history + Cloudflare Pages rollback) |
| 18 | Yoast Duplicate Post | Not needed (copy file / CMS duplicate action) |
| 19 | Yoast SEO (+ Premium) | Replace: SEO component + `@astrojs/sitemap` + JSON-LD schema + `_redirects` (content-analysis UX has no direct equivalent) |

**Net effect**: 19 plugins collapse to roughly 6 real engineering tasks (email sending, image pipeline config, a custom carousel component, the Matterport component, redirects file, Turnstile integration) plus a handful of Astro integrations (`@astrojs/sitemap`, `astro:assets`) — the rest are architecturally eliminated by moving off a database-backed CMS.
