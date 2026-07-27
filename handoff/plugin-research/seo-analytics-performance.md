# SEO, Analytics & Performance Plugin Replacements

Scope: replaces Yoast SEO + Yoast SEO Premium, Site Kit by Google, Imagify, and LiteSpeed Cache with real, buildable features inside the new Astro site's own git-based CMS admin panel. Every dashboard below lives at `/admin/*` on Mike's own domain — no external links, no "go check Google" hand-offs. External data (GSC, GA4, PageSpeed) is fetched server-side by a Cloudflare Worker, cached, and rendered inside our own UI.

---

## Architecture used by all four sections

- **Admin panel**: assumed to be a custom Astro/React (or SvelteKit-in-Astro-islands) admin app deployed as a Cloudflare Pages Function / Worker, authenticated (e.g. Cloudflare Access or a simple session-cookie login for Mike).
- **Data fetch layer**: a single Cloudflare Worker (`analytics-worker`) runs on a **Cron Trigger** (e.g. every 6 hours) that:
  1. Calls Google Search Console API, Google Analytics Data API (GA4), and PageSpeed Insights API.
  2. Writes normalized JSON snapshots into **Cloudflare KV** (or a small **D1** database for historical trends).
  3. The admin panel reads from KV/D1 — never calls Google APIs directly from the browser (keeps API keys server-side, keeps admin UI fast).
- **Auth to Google APIs**: a Google Cloud service account with domain access delegated to the GSC property and GA4 property (read-only scopes: `webmasters.readonly`, `analytics.readonly`). Service account JSON key stored as a Cloudflare **Secret** (`wrangler secret put`), never in repo.
- **Historical trends**: D1 table `metrics_daily(date, source, metric, value)` populated by the cron worker, queried by the dashboard for 7/28/90-day charts (matches what Site Kit shows).

This one Worker + KV/D1 pattern is shared by the SEO, Analytics, and Performance dashboards described below — build it once, feed three UI panels.

---

## 1. Yoast SEO + Yoast SEO Premium

### (a) What Mike currently gets
- Per-page metabox in wp-admin while editing a page/post: a **traffic-light content analysis** (readability score: sentence length, passive voice, transition words, paragraph length) and **SEO analysis** (focus keyphrase usage in title/intro/body/URL, keyphrase density, image alt text check).
- Meta title & meta description editor with a **live-updating character-length bar** (green/red at ~60 chars title, ~155-160 chars description) and a **Google SERP snippet preview**.
- Automatic **XML sitemap** generation (`/sitemap_index.xml`).
- **Internal linking suggestions** while writing (Premium).
- **Redirect manager** (Premium) — create 301s from a UI, and it auto-suggests a redirect when a page slug changes or a page is deleted.
- **Social previews** — how the page will look shared on Facebook/Twitter/OG cards, editable per-page image/title/description overrides.
- Breadcrumbs, cornerstone content flags, orphaned content warnings.

### (b) Concrete admin feature to build: "SEO Panel" per content entry
Since Astro already generates sitemap.xml, canonical URLs, OG tags, and JSON-LD at build time from frontmatter, this is **not** a content-analysis engine reinvention — it's a **validation + editing layer** on top of the CMS's page/post frontmatter fields.

Build an **SEO tab** inside the CMS's per-page editor (alongside the git-based content fields), with these panels:

1. **Meta Editor**
   - Fields: `title`, `description`, `focusKeyword` (new frontmatter fields if not present).
   - Live character counters with the same red/orange/green thresholds Yoast uses (title 30-60 chars ideal, description 120-156 chars ideal).
   - **Google SERP Snippet Preview** — a static HTML/CSS mock of a Google result (blue title, green URL, gray description) rendered client-side from the current field values, truncated exactly the way Google truncates (pixel-width approximation, not just char count — use the same lookup-table approach Yoast uses: average character pixel widths for common fonts, ~600px title cutoff / ~920px description cutoff at two lines).
   - **Social Preview** — renders a Facebook card mock and a Twitter/X card mock using `ogTitle`/`ogDescription`/`ogImage` frontmatter fields (falls back to meta title/description if unset), so Mike can see exactly what's already being emitted in the page's OG tags by the Astro build.

2. **Content Analysis (readability + keyword) — see part (d) below for the concrete algorithm.**

3. **Sitemap Status Card**
   - Since Astro generates `sitemap.xml` at build, this card simply **fetches and parses the live `/sitemap.xml` and `/sitemap-index.xml`** from the deployed site and displays: total URLs indexed, last build/deploy timestamp (from Cloudflare Pages deployment API), and a warning if the page currently being edited is NOT present in the sitemap (e.g. marked `noindex` in frontmatter but shouldn't be, or excluded by a sitemap filter).

4. **Redirect Manager** (replaces Yoast Premium's redirect manager)
   - A dedicated `/admin/redirects` page, backed by a simple JSON/YAML file in the repo (e.g. `src/data/redirects.json`) that the CMS reads/writes via its git-commit-on-save mechanism.
   - CRUD UI: add `from → to (301|302)` pairs, search/filter existing redirects, test a redirect live.
   - **Auto-suggest on slug change**: when the CMS detects a page's `slug` frontmatter field changed on save (diff against the previous git blob), it prompts: "This page's URL changed from `/old-slug` to `/new-slug` — add a 301 redirect?" one-click accept writes to `redirects.json`.
   - **Auto-suggest on delete**: when a content file is deleted via the CMS, prompt to redirect its old URL somewhere (home, a category page, or a chosen URL).
   - Redirects are enforced via **Cloudflare Pages `_redirects` file** (generated at build time from `redirects.json`) or a lightweight **Cloudflare Worker** doing a KV lookup + 301, if redirect count grows large or needs to be edited without a rebuild. Recommendation: start with the build-time `_redirects` file (zero extra infra, redeploys in ~1 min via Cloudflare Pages), move to a Worker+KV only if Mike needs instant redirects without a rebuild.

5. **Internal Linking Suggestions**
   - Buildable as a **lightweight, own-content-only suggestion engine**, not Yoast's proprietary NLP model:
     - At build time (or on-demand via a small Node script run by the admin's "Analyze" button), extract all page titles/slugs/focus keywords from the content collection.
     - For the page currently being edited, do a simple keyword-overlap scan (shared significant words between this page's title/keyword and other pages' titles/keywords, using a basic stopword-filtered token-overlap or TF-IDF cosine similarity — this is a well-known, easily implementable technique, e.g. via a small `natural`/`compromise` JS library or hand-rolled TF-IDF).
     - Display "Pages you might want to link to from this page" with one-click "insert link" that drops a markdown link at the cursor in the content editor.
   - This is realistic to build in an afternoon and gives Mike real, actionable suggestions grounded in his own site's content — not a black box.

6. **Orphaned Content / Cornerstone Flags**
   - Build-time script scans all internal markdown links across the content collection into a link graph; any page with zero inbound internal links is flagged "orphaned" in a site-wide SEO overview table (`/admin/seo`).
   - Mike can mark a page "cornerstone" (a new frontmatter boolean) and the overview table highlights cornerstone pages that have below-average inbound links.

### (c) Technical implementation
- No external API needed for most of this — it's all local to the Astro content collection and the CMS's own file system, computed either:
  - **Client-side in the admin UI** (character counts, SERP preview, social preview) — instant, no network call.
  - **At CMS-save-time or via a "Re-analyze" button** calling a small **Cloudflare Pages Function** (`/api/seo-analyze`) that runs the readability/keyword checks and link-graph scan server-side (Node/Workers-compatible JS), returns JSON to the admin UI.
- Sitemap Status Card: `fetch('https://virtualtourslasvegas.com/sitemap-index.xml')` from the Pages Function (server-side, avoids CORS), parse with a simple XML parser (`fast-xml-parser`, Workers-compatible).
- Redirect data: stored in-repo (`src/data/redirects.json`), edited via the CMS's existing git-commit-on-save flow (same mechanism used for content pages) — this keeps redirects version-controlled and consistent with the "git-based CMS" architecture already chosen for the rest of the site.
- Deployment timestamp for the Sitemap card: **Cloudflare Pages API** (`GET /accounts/{account_id}/pages/projects/{project}/deployments`) called from the Worker/Function with a Cloudflare API token (scoped read-only to Pages).

### (d) Readability/keyword analysis: buildable recommendation
Yoast's actual scoring algorithm (its "assessments" like passive voice detection, transition word lists, sentence variation) is proprietary and not legally available to copy. Two realistic paths:

**Recommended: lightweight custom checks (buildable in days, not weeks).** Implement a checklist-style analyzer, not a single opaque "score" — this is actually more transparent and useful to Mike than Yoast's stoplight anyway:

- **Readability checks** (all computable with plain JS string/regex logic, no ML needed):
  - Flesch Reading Ease score — a well-documented, public-domain formula (`206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)`); syllable counting via a simple vowel-group heuristic (there are small MIT-licensed npm packages like `syllable` and `text-readability` that implement this cleanly and are safe to use).
  - Average sentence length, flag sentences over ~20 words.
  - Paragraph length, flag paragraphs over ~150 words / 6+ sentences.
  - Passive voice detection: regex/heuristic against common English passive constructions (`to be` verb + past participle, e.g. `/\b(is|are|was|were|been|being|be)\s+\w+ed\b/i`) — not perfect, but Yoast's own is a heuristic too, not true NLP.
  - Transition word usage: maintain a static list (~200 common English transition words/phrases, public domain lists exist) and compute % of sentences containing one.
  - Consecutive sentences starting with the same word — simple string comparison.
- **Keyword checks** (all string-matching, no proprietary logic needed):
  - Focus keyword present in: meta title, meta description, first 100 words, at least one heading, URL slug, image alt text (parse rendered markdown/MDX for `<img alt>` or `![alt](...)`).
  - Keyword density: keyword occurrences / total word count, flag if under ~0.5% or over ~3% (Yoast's rough bands).
  - Keyword length flag if focus keyword is only 1 word (too broad) — simple word-count check.
- Present all of this as a **checklist with pass/warn/fail icons per rule**, not a single composite score — avoids pretending to replicate Yoast's proprietary weighting while giving Mike equally actionable feedback, arguably clearer since he sees exactly which rule failed.
- Library choice: `text-readability` (npm, MIT license, pure JS, Workers-compatible) for the Flesch calculation; everything else is ~150 lines of hand-rolled regex/string logic in the Pages Function. No paid API, no proprietary NLP model, fully self-hosted.

**Not recommended:** calling an LLM (e.g. Claude/GPT) per keystroke for readability feedback — too slow/expensive for live-typing feedback and overkill for what is fundamentally rule-based analysis. An LLM-based "one-click deeper content review" button (separate from live typing feedback) could be a nice-to-have v2 addition, but the core Yoast-equivalent experience should be the fast, deterministic checklist above so it can run instantly on every keystroke like Yoast does.

---

## 2. Site Kit by Google

### (a) What Mike currently gets
A single wp-admin dashboard widget/page showing, without leaving WordPress:
- **Google Analytics**: sessions/users over time, top pages, traffic sources/channels, device breakdown.
- **Google Search Console**: total clicks/impressions/average CTR/average position over time, top queries, top pages by search traffic.
- **PageSpeed Insights**: Core Web Vitals scores (LCP, INP, CLS) and overall performance score for mobile/desktop.
- **AdSense** (if used — not applicable here since VTLV doesn't run ads, so this can be explicitly excluded, but noted for completeness).

### (b) Concrete admin feature to build: `/admin/insights` dashboard
A single dashboard page in the site's own admin with three panel groups, each a real data visualization (not a link out):

1. **Traffic Panel (GA4 data)**
   - Line chart: sessions/users over last 7/28/90 days (toggle).
   - Bar chart: top 10 pages by pageviews.
   - Donut chart: traffic by channel (organic search, direct, referral, social).
   - Table: device breakdown (mobile/desktop/tablet) with session counts.

2. **Search Performance Panel (GSC data)**
   - Scorecards: total clicks, total impressions, average CTR, average position (current period vs. prior period, with up/down delta indicators — same as Site Kit's comparison view).
   - Table: top 25 queries with clicks/impressions/CTR/position, sortable.
   - Table: top 25 pages by search clicks.
   - Line chart: clicks + impressions over time (dual-axis).

3. **Site Speed Panel (PageSpeed Insights data)**
   - Scorecards for the site's key pages (home, a sample listing/tour page, contact) showing Performance score, LCP, INP, CLS for mobile and desktop, color-coded (green/amber/red per Google's official thresholds).
   - "Re-check now" button that triggers an on-demand PageSpeed API call (not just waiting for the cron refresh) for a page Mike just edited/published.

All three panels load from the KV/D1 snapshots populated by the shared cron Worker described in the Architecture section — page loads are instant, no live API calls blocking the UI.

### (c) Technical implementation
- **Google Analytics Data API (GA4)**: `properties.runReport` endpoint, service-account auth, queried for standard dimensions/metrics (`sessionDefaultChannelGroup`, `deviceCategory`, `pagePath`, `screenPageViews`, `sessions`).
- **Google Search Console API**: `searchanalytics.query` endpoint on the `sc-domain:virtualtourslasvegas.com` (or URL-prefix) property, same service account (needs to be added as a user on the GSC property in Search Console settings — one-time manual step for Mike/the developer).
- **PageSpeed Insights API**: public REST API (`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=...&key=...`), requires only an API key (not OAuth), free tier is generous (25k queries/day). Run for a fixed list of key URLs (home, top 5 tour listing pages, contact) on the cron schedule; add "Re-check now" for on-demand.
- Cron Worker (`analytics-worker`) runs all three fetches every 6 hours, normalizes into a common JSON shape per panel, writes to KV keys like `insights:traffic:latest`, `insights:search:latest`, `insights:speed:latest`, plus D1 rows for historical trend charts.
- Admin dashboard is a static-ish Astro/React page that does a single fetch to an internal `/api/insights` Pages Function, which reads straight from KV/D1 (sub-50ms, no external API latency on page load for Mike).
- Charts: use a lightweight charting lib (e.g. `Chart.js` or `uPlot`) client-side in the admin panel — no need for a heavy dashboard framework.

### (d) N/A — no content-analysis component in this plugin (covered under Yoast above).

---

## 3. Imagify

### (a) What Mike currently gets
- Automatic compression of images on upload (lossy/lossless/ultra settings).
- Automatic **WebP/AVIF** conversion, served alongside originals.
- A dashboard showing **total space saved** (cumulative, across the whole media library), compression stats per image, bulk "optimize existing images" tool.

### (b) Concrete admin feature to build: build-time image pipeline + `/admin/media` stats dashboard
This is actually a case where Astro's static architecture makes the plugin **unnecessary as a runtime WordPress-style service** and replaces it with something better: compression happens automatically at **build time**, not per-upload, via Astro's built-in image pipeline.

1. **Build-time optimization (replaces the compression itself)**
   - Use `astro:assets` (Astro's built-in `<Image />` / `<Picture />` components, backed by Sharp) for every image referenced in content — this already does resizing, format conversion (WebP/AVIF), and quality-based compression at build time, with zero ongoing plugin dependency.
   - Configure default quality settings in `astro.config.mjs` (`image: { ... }`) matching Imagify's "aggressive" preset (e.g. quality 75-82 for WebP, similar to Imagify's "Smart Compression").
   - `<Picture formats={['avif', 'webp']} fallbackFormat="jpeg" />` used site-wide in templates gives Mike the same AVIF/WebP-with-fallback behavior Imagify provided, generated automatically on every build — no manual "optimize" step needed, ever.

2. **`/admin/media` Stats Dashboard (replaces the "space saved" visibility)**
   - Since compression now happens at build time rather than per-upload, "space saved" is computed by **comparing original asset file sizes (in the repo's `src/assets/` or CMS-uploaded originals) against the optimized build output sizes** (in `dist/` or Cloudflare Pages' build artifacts).
   - Build step (a small Node script run as part of the Astro build, e.g. in `astro.config.mjs` integration hook `astro:build:done`) walks both the source assets directory and the generated `_astro/` image output, sums bytes for each, and writes a `media-stats.json` artifact (committed to a `handoff/build-stats/` path or pushed to KV via a small `fetch` call to a Worker endpoint at the end of the build).
   - Admin dashboard card: "Total images: N · Original size: X MB · Optimized size: Y MB · Space saved: Z MB (P%)" — same headline number Imagify's dashboard shows, just computed from Astro's own build output instead of a third-party service.
   - Per-image breakdown table (filename, original size, optimized size, formats generated) for anyone who wants the granular Imagify-style detail view.
   - **Upload-time preview in the CMS**: when Mike uploads a new image through the CMS media picker, show an immediate client-side estimate (file size of the upload) with a note "will be auto-compressed to WebP/AVIF on next site build" so he gets the same "your image is being optimized" reassurance Imagify gives at upload time, even though actual compression is deferred to build.

### (c) Technical implementation
- No external API calls needed at all — this is 100% build-time tooling using Astro's built-in `astro:assets` (Sharp-based) image pipeline, which is already available in the existing codebase's Astro version (verify `astro:assets` is enabled — it's built-in since Astro 3.0).
- Stats collection: a small script hooked into `astro:build:done` (Astro integration API) that diffs `src/assets` vs `dist/_astro` byte sizes and POSTs the summary JSON to a Cloudflare Worker endpoint (`/api/media-stats/ingest`) which stores it in KV (`media:stats:latest`) — this keeps the stats fresh on every deploy without needing a cron job (deploy-triggered, not time-triggered, unlike the GSC/GA4/PSI data).
- Admin `/admin/media` page reads that KV key via a Pages Function, same pattern as the Insights dashboard.
- If truly identical Imagify-style **per-upload** compression is wanted (rather than build-time), an alternative is a Cloudflare Pages Function on the CMS's image-upload endpoint that pipes the uploaded file through the **Cloudflare Images** service (paid, ~$5/mo + usage) or a Worker calling `wasm-vips`/`@cf-wasm/photon` for on-upload compression before committing to the repo — but given Astro already re-optimizes everything at build time regardless of what's committed, this is redundant effort; the build-time approach is the right architectural fit and the recommended path.

### (d) N/A — no content-analysis component.

---

## 4. LiteSpeed Cache

### (a) What Mike currently gets
- Page caching (full-page HTML cache) to speed up WordPress (which is slow because it's PHP+MySQL rendering on every request).
- Additional performance features: CSS/JS minification and combination, lazy-loading images, database optimization, CDN integration, and a dashboard showing **cache hit rate** and general performance metrics.

### (b) Concrete admin feature to build: this is where the architecture change itself is the replacement, plus a `/admin/performance` visibility dashboard
Because the new site is a **static Astro site deployed on Cloudflare Pages**, the entire problem LiteSpeed Cache solves (slow PHP/MySQL rendering needing a cache layer bolted on) doesn't exist anymore — every page is pre-rendered HTML served directly from Cloudflare's global CDN edge cache. This is strictly better than LiteSpeed's cache, not a downgrade, but Mike still needs **visibility** into performance, which is the actual thing to replace.

1. **Performance is structurally solved, not configured**: static HTML + Cloudflare's edge network = every page is already "fully cached" at every PoP worldwide. No cache-hit-rate tuning, no cache purge headaches, no "exclude this page from cache" edge cases WordPress caching plugins are notorious for.

2. **`/admin/performance` Dashboard (replaces LiteSpeed's visibility, not its caching)**
   - **Cache Hit Rate Panel**: pull real edge cache analytics from the **Cloudflare GraphQL Analytics API** (`viewer.zones.httpRequestsAdaptiveGroups`), which reports `cachedRequests` vs `requests` for the zone — display as a percentage gauge, same visual language as LiteSpeed's cache-hit dashboard, but backed by Cloudflare's actual real-world edge cache data (typically 95-99%+ for a static Pages site, genuinely better than a WordPress LiteSpeed setup).
   - **Core Web Vitals Panel**: reuse the PageSpeed Insights data already being pulled for the Site Kit replacement (see Section 2) — LCP/INP/CLS trend lines for key pages.
   - **Bandwidth/Requests Panel**: total requests served, bandwidth served, threats blocked — from the same Cloudflare GraphQL Analytics API, giving Mike a genuine "site health" view LiteSpeed never actually provided (LiteSpeed only showed WordPress-origin cache stats, not real CDN edge stats — this is an upgrade).
   - **Build/Deploy Status Card**: last deploy time, build duration, deploy success/failure — from the Cloudflare Pages Deployments API (same one used for the Sitemap Status card in Section 1), reassuring Mike his latest content changes are actually live.
   - **Minification note**: Cloudflare Pages/Astro's build already minifies CSS/JS/HTML by default (Astro's Vite build pipeline does this automatically in production builds) — the dashboard can show a simple "Minification: Active (build-time)" status badge rather than needing a toggle, since it's not something that needs ongoing management the way LiteSpeed's plugin settings did.
   - **Image lazy-loading note**: `astro:assets`' `<Image />`/`<Picture />` components support `loading="lazy"` natively; ensure this is set as the default in shared templates — status badge "Lazy-loading: Active" in the dashboard, verified by a simple build-time lint check (grep generated HTML for `<img>` tags missing `loading="lazy"` outside the hero/LCP image, which should intentionally be `eager`).

### (c) Technical implementation
- **Cloudflare GraphQL Analytics API**: `POST https://api.cloudflare.com/client/v4/graphql` with a zone-scoped API token, query `httpRequestsAdaptiveGroups` (cache status, requests, bandwidth) filtered to the zone and a date range. This is free, no extra product needed (part of every Cloudflare zone, including free plan, though the free plan has a shorter data retention window — Pro/Business extends it; confirm which plan the domain is on).
- Fetched by the same shared cron Worker (Section: Architecture) on its 6-hour schedule, written to KV (`perf:cache:latest`) and D1 for trend charts.
- PageSpeed data reused from Section 2's fetch (no duplicate API calls needed — same cached KV data powers both the Insights dashboard's Speed Panel and the Performance dashboard's Core Web Vitals panel).
- Cloudflare Pages Deployments API: `GET /accounts/{account_id}/pages/projects/{project_name}/deployments` with a Cloudflare API token — same call used in Section 1's Sitemap card, reused here.
- No caching configuration UI is needed (unlike LiteSpeed's dozens of settings toggles) because Cloudflare Pages' static-asset caching is automatic and optimal by default — this is explicitly a case where the "plugin's settings panel" doesn't need recreating because the underlying problem it configured around no longer exists on this architecture. The dashboard's job is purely to prove to Mike that performance is good, not to give him knobs to turn that could make a static site worse.

### (d) N/A — no content-analysis component.

---

## Summary of new admin surface area to build

| New Admin Route | Purpose | Data Source |
|---|---|---|
| `/admin/content/[page]` → SEO tab | Meta editor, SERP/social preview, readability+keyword checklist, internal link suggestions | Local (Astro content collection) + Pages Function |
| `/admin/seo` | Site-wide SEO overview: orphaned pages, cornerstone tracking, sitemap status | Local build-time scan + live sitemap.xml fetch |
| `/admin/redirects` | Redirect manager (create/edit/delete 301s), auto-suggested on slug change/delete | `src/data/redirects.json` in-repo, git-committed via CMS |
| `/admin/insights` | Traffic (GA4), Search performance (GSC), Site speed (PSI) — Site Kit replacement | GA4 Data API + GSC API + PSI API via cron Worker → KV/D1 |
| `/admin/media` | Image optimization stats: total saved, per-image breakdown — Imagify replacement | Build-time asset size diff → KV |
| `/admin/performance` | Cache hit rate, bandwidth, Core Web Vitals, deploy status — LiteSpeed replacement | Cloudflare GraphQL Analytics API + PSI (shared) + Pages Deployments API |

### Shared infrastructure to provision
1. Google Cloud service account with GSC (`webmasters.readonly`) + GA4 (`analytics.readonly`) scopes; added as a read-only user on both Google properties.
2. PageSpeed Insights API key (Google Cloud Console, no OAuth needed).
3. Cloudflare API token scoped to: Zone Analytics (read), Pages (read) for the account/zone.
4. Cloudflare Worker `analytics-worker` on a Cron Trigger (every 6h) — single Worker feeding KV + D1 for Insights and Performance dashboards.
5. Cloudflare KV namespace (`SITE_METRICS`) and D1 database (`site_metrics_history`) for snapshot + trend storage.
6. All secrets (service account JSON, PSI API key, Cloudflare API token) stored via `wrangler secret put`, never committed to the repo.
