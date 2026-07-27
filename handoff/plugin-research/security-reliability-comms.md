# Security, Reliability & Communications — Plugin Replacement Spec

**Scope:** Real, buildable replacements for five WordPress plugins currently in use on virtualtourslasvegas.com, targeted at the new Astro + Cloudflare Pages + git-based CMS stack. Every item below includes a concrete admin-panel UI Mike can click through himself — not an "architecture handles it" hand-wave.

Site owner: Mike (virtualtourslasvegas@gmail.com). Stack: Astro static site, git-based CMS (e.g. Decap/Tina-style admin at `/admin`), Cloudflare Pages hosting, Cloudflare Workers for server-side logic, Cloudflare D1 (SQL) and/or KV for storing logs/state, Cloudflare R2 for object storage.

---

## 1. Spam/Bot Protection — replaces Akismet Anti-spam (v5.7) + Simple Google reCAPTCHA (v4.0)

WordPress used two separate plugins for this; on the new site it's one integrated system, because both plugins solved the same underlying problem (garbage form submissions) at different layers (challenge vs. content filtering).

### (a) Problem/risk

The site has a contact/booking form. Without protection, it collects:
- Automated bot spam (viagra links, SEO spam, phishing attempts) filling the form 24/7
- Credential-stuffing/scraper bots probing the form endpoint
- Mike currently gets these as emails and has to eyeball each one to tell real leads from junk

Losing this protection on relaunch means Mike's inbox floods with garbage and real leads get buried or missed.

### (b) Concrete admin-panel feature

**Recommendation: Cloudflare Turnstile** (free, no Google dependency, first-party Cloudflare integration) as the challenge layer, plus a lightweight heuristic spam scorer as the content-filtering layer (Akismet's job).

New admin page: **"Form Security"** (`/admin/form-security`)

- **Submissions log table** — every form submission (accepted or blocked) with columns: timestamp, name, email, message excerpt, Turnstile result (pass/fail), spam score (0–100), status (Delivered / Blocked / Flagged for review), source IP (country-level only, via Cloudflare's `CF-IPCountry` header, for privacy).
- **Filter/tabs**: All / Delivered / Blocked / Flagged.
- **"Blocked" count badge** in the admin nav (e.g. "Form Security (3)") showing how many were caught in the last 7 days — the direct equivalent of Akismet's spam-caught counter.
- **Manual review action**: for "Flagged" (borderline score) submissions, Mike gets Approve/Reject buttons — approving delivers the email and adds the sender's pattern to an allowlist; rejecting discards it and reinforces the score.
- **Blocklist/allowlist management**: simple table where Mike can add an email domain or keyword to always-block or always-allow (equivalent to Akismet's manual spam marking).
- **Settings panel**: toggle Turnstile on/off per form, set the spam-score threshold for auto-block vs. flag-for-review.

### (c) Technical implementation

- **Turnstile widget** embedded in the contact form (invisible/managed mode — no user-facing puzzle in most cases). Site key is public, embedded in the Astro form component.
- **Cloudflare Worker** (`/api/contact-submit`) receives the POST, calls Turnstile's `siteverify` API server-side with the secret key (stored as a Worker secret) to confirm the token is valid before doing anything else. Reject immediately if verification fails.
- **Spam heuristic scorer** (runs inside the same Worker, replaces Akismet's ML filtering): rule-based scoring — links-in-message count, known spam keyword list, submission velocity from same IP/session (rate-limited via Cloudflare's Workers Rate Limiting API or a KV counter), honeypot field (hidden input bots fill but humans don't), message length/gibberish check. Score above threshold → auto-block; mid-range → flag for review; low → deliver.
- **Storage**: every submission (blocked or not) is written to a **D1 table** `form_submissions` (id, timestamp, name, email, message, turnstile_pass, spam_score, status, country). The admin page queries this table via a Worker API route.
- **Delivery**: submissions that pass go into the email pipeline described in Section 2.

### (d) Pricing

- **Cloudflare Turnstile**: free, unlimited, no tiered pricing — this is Cloudflare's stated free-forever product for any traffic volume.
- **D1**: free tier includes 5 GB storage and 5 million rows read/day, 100k rows written/day — a contact-form log will use a trivial fraction of this indefinitely.
- **Workers**: free tier includes 100,000 requests/day, which comfortably covers form traffic for a small local business site. (If already on Workers Paid $5/mo for other features, this rides along at effectively no incremental cost.)

---

## 2. Reliable Email Delivery — replaces Easy WP SMTP (v2.15.0)

### (a) Problem/risk

WordPress's default `wp_mail()` uses PHP's `mail()` function, which is notoriously unreliable — no authentication, easily flagged as spam or silently dropped by receiving mail servers, no delivery confirmation. Easy WP SMTP fixed this by routing outgoing mail through an authenticated SMTP/API provider. If the new site's contact form emails just silently vanish, Mike loses real client leads without knowing it happened — the single highest-risk item in this whole spec, since it directly affects revenue.

### (b) Concrete admin-panel feature

New admin page: **"Email Log"** (`/admin/email-log`)

- **Log table**: every outbound email attempt — timestamp, recipient, subject, trigger ("Contact form submission" / "Booking confirmation" / "Test email"), delivery status (Sent / Delivered / Bounced / Failed), provider message ID, and a "View raw response" expandable row for debugging.
- **Status badges** colored: green (Delivered), yellow (Sent, awaiting delivery confirmation), red (Failed/Bounced) — Mike can scan the page and immediately see if anything's broken.
- **"Send Test Email" button** — the direct equivalent of Easy WP SMTP's test-send feature. Mike enters an address, clicks send, and the log immediately shows the attempt and its result, confirming the pipeline works end-to-end without needing a real form submission.
- **Retry button** on failed rows — re-attempts delivery on demand.
- **Settings panel**: shows current provider (Resend), sending domain, and verification status (DNS records green-check or red-X per record — SPF/DKIM/DMARC — so Mike can see at a glance if his domain's email authentication is properly configured, which is the #1 cause of deliverability problems).

### (c) Technical implementation

- **Recommendation: Resend.** It's built specifically for developer/API-first sending, has a clean REST API and official integration patterns for Cloudflare Workers (no SMTP port issues, which Workers can't do raw SMTP over anyway — Workers can only do HTTP-based email APIs, which rules out traditional SMTP entirely and makes Resend/Postmark/SendGrid-style HTTP APIs the only real option). Resend also provides webhooks for delivery/bounce/complaint events.
- **Sending flow**: contact Worker (from Section 1) that accepts a validated, non-spam submission calls `https://api.resend.com/emails` with the API key stored as a Worker secret, sends the notification to Mike and (optionally) an auto-reply confirmation to the client.
- **Logging flow**: every send attempt writes a row to a D1 table `email_log` (id, timestamp, recipient, subject, trigger, resend_message_id, status). A second Worker route (`/api/webhooks/resend`) receives Resend's delivery/bounce/complaint webhooks and updates the `status` column on the matching row by `resend_message_id` — this is what gives Mike real Delivered/Bounced status instead of just "we tried to send it."
- **Domain auth**: Resend requires adding SPF/DKIM (and recommends DMARC) DNS records for the sending domain — since DNS is already on Cloudflare, these are added directly in the Cloudflare DNS dashboard, and the admin settings panel can poll Resend's domain-verification API to show live status.
- **Test-send button**: hits the same Worker send function with a hardcoded "This is a test email from Virtual Tours Las Vegas admin panel" body and immediately shows the result in the log.

### (d) Pricing

- **Resend free tier**: 3,000 emails/month, 100 emails/day, 1 verified sending domain — comfortably covers a small real-estate photography business's contact-form and notification volume.
- **Resend Pro** (if ever needed): $20/month for 50,000 emails/month — extremely unlikely to be needed at this business's scale, but worth noting as the next tier.
- No cost for the Cloudflare side beyond the same Workers/D1 free tier already covered in Section 1.

---

## 3. Backups & Restore — replaces UpdraftPlus (v1.26.6)

### (a) Problem/risk

UpdraftPlus gave Mike scheduled automatic backups of the WordPress database and files to cloud storage, plus a one-click restore. The client explicitly rejected "git history is already a backup" as an answer — and rightly so: git history covers the site's *code and content* only if Mike is actually the one committing through the CMS, doesn't cover the D1 database (form submissions, email log, redirects, spam log — all the operational data this spec is creating), and gives Mike no actual button to click if something goes wrong. He needs a real, scheduled, provider-agnostic backup with a real restore action he can trigger himself, independent of his own git literacy.

### (b) Concrete admin-panel feature

New admin page: **"Backups"** (`/admin/backups`)

- **Backup history list**: table of snapshots — timestamp, type (Scheduled / Manual), contents (Site content + D1 database), size, status (Complete / Failed), and a "Download" link (raw archive from R2) plus a "Restore" button per row.
- **"Back Up Now" button** — triggers an on-demand snapshot immediately (manual equivalent of UpdraftPlus's manual backup), shows a progress spinner, then appears in the list when done.
- **Restore flow**: clicking "Restore" on a snapshot opens a confirmation modal ("This will restore the site content and database to the state from [date/time]. Current state will be saved as a pre-restore snapshot first. Continue?"), then executes the restore and shows a completion status. A pre-restore safety snapshot is taken automatically so a restore is itself never destructive.
- **Schedule settings**: dropdown for frequency (Daily / Weekly), retention count (e.g. keep last 30), and storage usage indicator.

### (c) Technical implementation

- **Scheduled Cloudflare Worker** using **Cron Triggers** (e.g. daily at 3am) that:
  1. Exports the current D1 database to SQL dump (via D1's export API) or queries all tables to JSON.
  2. Snapshots the CMS content: since content lives in git (via the git-based CMS), the Worker calls the git provider's API (GitHub/GitLab) to get the current commit SHA and archive/tarball URL for that commit — this is cheap and avoids duplicating file storage, since git already has the full history; the "backup" for content is really "record which commit this snapshot corresponds to" plus a redundant tarball copy for the case where the git remote itself is unavailable.
  3. Packages the D1 dump + git tarball + a manifest JSON (timestamp, commit SHA, D1 schema version) and uploads it as an object to a **Cloudflare R2 bucket** (`vtlv-backups`), named by timestamp.
  4. Writes a row to a `backups` D1 table (or a small manifest KV) recording the snapshot metadata, which is what powers the admin list view.
  5. Enforces retention by deleting R2 objects (and their manifest rows) beyond the configured keep-count.
- **Manual "Back Up Now"**: an admin-panel button calls the same Worker logic via an authenticated HTTP route instead of waiting for the cron trigger.
- **Restore**: a Worker route that (1) takes the R2 object for the chosen snapshot, (2) re-imports the D1 dump into D1 (via D1's `import`/batch SQL execution), and (3) for content, either resets the git branch used by the CMS to the recorded commit SHA (via the git provider's API — a real revert, since content is version-controlled) or, if the remote itself needs restoring, pushes the tarball's contents back as a new commit. Because Cloudflare Pages auto-deploys on push, restoring content triggers a normal redeploy with no extra step.
- **Pre-restore safety snapshot**: same backup routine run once, synchronously, before the restore proceeds.

### (d) Pricing

- **Cloudflare R2 free tier**: 10 GB storage/month, 1 million Class A (write) operations/month, 10 million Class B (read) operations/month — free, no egress fees at all (R2's headline feature vs. S3). A photography business's backups (D1 dumps in the KB–low MB range, git tarballs likely under a few hundred MB) will sit comfortably inside the free tier for years even with daily backups and 30-day retention.
- **R2 beyond free tier** (if ever exceeded): $0.015/GB-month storage, still zero egress cost.
- **Cron Triggers**: included free with Workers; no additional cost.

---

## 4. Redirects & 404 Monitoring — replaces Redirection (v5.9.0)

### (a) Problem/risk

Redirection let Mike create 301 redirects whenever he changed or retired a page URL (critical for not losing SEO rankings and not sending visitors/Google to broken pages), and logged 404s so he could see what broken links people were actually hitting. Without this, any URL change silently breaks inbound links and search rankings, and Mike has no visibility into it.

### (b) Concrete admin-panel feature

New admin page: **"Redirects"** (`/admin/redirects`)

- **Redirects table**: columns Source path, Destination path, Type (301/302), Hits (count), Created date, Active toggle, Edit/Delete buttons.
- **"Add Redirect" form**: two fields (From / To) + type dropdown + Save — appears at the top of the table, no code editing required.
- **Bulk import/export**: CSV import/export for redirects, useful if Mike is migrating a batch of URLs at once.
- **404 Log tab** (same page, second tab): table of recently hit paths that returned 404 — path, hit count, last seen, referrer (if available) — with a **"Create Redirect" quick-action button** directly on each 404 row, so Mike can go from "someone hit a broken link" to "fixed" in one click.

### (c) Technical implementation

- Redirects are stored as CMS-managed content — a JSON/YAML file (e.g. `content/redirects.json`) editable through the git-based CMS admin UI like any other content type, so every redirect change is a normal git commit (auditable, revertable, no separate database needed for the redirect rules themselves).
- **Build-time generation**: an Astro build step (or a small Node script run during the Cloudflare Pages build) reads `redirects.json` and generates the Cloudflare Pages **`_redirects`** file format (`/old-path /new-path 301`) into the `dist` output, so Cloudflare's edge serves the redirects natively with zero runtime overhead — this is the fastest possible implementation since Cloudflare Pages parses `_redirects` at the edge before even routing to the static asset or a Worker.
- **Hit counting**: since a matched `_redirects` rule doesn't naturally log anywhere, a lightweight Cloudflare Worker (or Cloudflare's own Web Analytics / Logpush, see below) increments a KV or D1 counter keyed by source path — simplest approach is to have the admin "Redirects" page cross-reference Cloudflare's Web Analytics data for that path rather than re-inventing hit tracking.
- **404 logging**: a catch-all Astro 404 page triggers a small client-side or edge beacon (fetch to `/api/log-404`) recording the requested path, referrer, and timestamp into a D1 table `not_found_log`. The admin page's 404 tab queries this table, grouped by path with counts.
- **Deploy trigger**: because `redirects.json` lives in git and Cloudflare Pages redeploys on every push, saving a redirect in the CMS admin panel triggers a real (fast, ~1 minute) rebuild that makes it live — this should be surfaced in the UI as a small "Deploying redirect changes…" status indicator so Mike isn't confused by the short delay compared to WordPress's instant-apply behavior.

### (d) Pricing

- No additional cost — `_redirects` is a built-in free Cloudflare Pages feature, D1/Workers usage stays within the free tiers already covered above.

---

## Summary Table

| WordPress Plugin | New System | Core Admin UI | Cloudflare Services Used | Monthly Cost |
|---|---|---|---|---|
| Akismet + Simple Google reCAPTCHA | Turnstile + spam scorer | Form Security page (log, blocklist, review queue) | Turnstile, Workers, D1 | $0 |
| Easy WP SMTP | Resend transactional email | Email Log page (status, test-send, DNS check) | Workers, D1, Resend | $0 (free tier: 3,000 emails/mo) |
| UpdraftPlus | Scheduled Worker → R2 backups | Backups page (history list, Back Up Now, Restore) | Cron Triggers, D1, R2, git provider API | $0 (R2 free tier: 10GB) |
| Redirection | CMS-managed `_redirects` + 404 log | Redirects page (add/edit table + 404 log tab) | Pages `_redirects`, Workers, D1 | $0 |

All five replacements run entirely within Cloudflare's free tiers at this business's expected traffic volume, with Resend as the one external dependency (also free at this scale). Every feature has a concrete page, table, and button in the admin panel — nothing here is "handled automatically by the architecture" with no interface for Mike.
