# Admin & Content-Management Tools — WordPress Plugin Replacement Spec

**Project:** Virtual Tours Las Vegas rebuild
**Target stack:** Astro (static site) + Git-based CMS (Decap CMS, self-hosted admin UI) + Cloudflare Pages (hosting) + Cloudflare Workers (server-side logic) + Cloudflare D1 (state/queries where needed) + Cloudflare R2 or Images (media storage)
**Audience:** Developer implementing the new admin panel
**Author's mandate:** Every plugin below gets a real, buildable, in-house replacement inside Mike's own admin panel. No "not needed," no "use another site instead." If the underlying WordPress mechanic doesn't map 1:1 onto a static/git architecture, the feature is redesigned to solve the same problem using Astro + Decap CMS + Workers + D1.

---

## 0. Architecture primer (read this first)

Before the individual specs, a shared mental model, because several plugins below reuse the same three building blocks:

1. **The content repo.** Decap CMS (or a very close fork) reads/writes Markdown/JSON files in the site's Git repository through the GitHub API (or Cloudflare's Git integration). Every save Mike makes in the admin UI becomes a Git commit. This is the foundation for revisions, duplication, and rewrite/republish — see Section 10.
2. **The media store.** Uploaded images/video should NOT live as raw files committed straight into the Git repo at full resolution forever (repo bloat, slow clones, no folder metadata, no dimension/EXIF querying). Instead: uploads go to **Cloudflare R2** (or Cloudflare Images if transformation-on-the-fly is wanted), and a **D1 table** (`media_assets`) stores the metadata WordPress used to keep in `wp_posts`/`wp_postmeta` for attachments: filename, folder, alt text, upload date, size, dimensions, which content files reference it, etc. The Git repo only stores a stable URL/ID pointing at R2, not the binary.
3. **The admin Worker.** A small custom Cloudflare Worker (`admin-api`) sits behind the Decap CMS UI and behind a few custom admin pages built as Astro routes gated by Cloudflare Access or a simple password. This Worker is where all the "not really a CMS field, it's an operation" features live — rename, dedupe, reorder, clone, rewrite/republish, system status. It talks to: the GitHub REST API (for repo file operations), R2 (for media), and D1 (for metadata/state).

This primer is referenced as "the admin Worker," "the media table," and "the repo" throughout below rather than re-explained each time.

---

## 1. Advanced Database Cleaner → "Site Housekeeping" panel

**(a) Problem it solves for Mike today:** WordPress accumulates cruft in its MySQL database — orphaned postmeta rows, old auto-drafts, stale revisions, expired transients, spam comments — that slows the admin down and bloats backups. Mike runs this plugin periodically to "clean up" and keep the site snappy.

**(b) New feature — "Site Housekeeping" tab in the admin panel:**
A dashboard tile group showing:
- **Orphaned media** — files sitting in R2 that are not referenced by any content file in the repo (computed by cross-referencing the `media_assets` table against a scan of all Markdown/JSON content for image URLs). Shown as a reviewable list with thumbnails, "Delete" and "Keep anyway" per item, and a "delete all unused" bulk button (with confirmation).
- **Old draft cleanup** — drafts (unpublished branches, see Section 10) untouched for 90+ days, listed for review/deletion.
- **Stale preview deploys** — old Cloudflare Pages preview deployments tied to closed/merged draft branches, auto-listed for cleanup.
- **Repo size / build health** — shows repo size, number of content files, last build duration/status, so Mike has the "is my site bloated" signal WordPress DB size used to give him.
- One-click "Run Housekeeping" that executes all the above as a batch.

**(c) Technical implementation:**
- A scheduled Cloudflare Worker (Cron Trigger, e.g. weekly) that: (1) lists all objects in R2, (2) greps the latest commit of the content repo for referenced media URLs via GitHub's tree API, (3) diffs the two sets, (4) writes results into a D1 table `housekeeping_findings` (type, item id, detected date, status: pending/dismissed/deleted).
- Admin UI page (Astro + small client-side JS, or a lightweight React island) reads `housekeeping_findings` from the Worker's API and renders the review list.
- Delete actions call Worker endpoints that remove the R2 object + `media_assets` row (media) or delete/close a stale branch + associated Cloudflare Pages preview via the Cloudflare API (drafts/previews).
- Since there's no MySQL, there's no literal "revisions/transients" table to vacuum — that need is replaced by the git-history size and stale-branch cleanup instead (a static site's version of "database bloat" is "stale branches + orphaned R2 objects").

**(d) Effort:** Medium. Core logic (diffing referenced vs. stored media, listing stale branches) is a genuine custom Worker + D1 schema + one admin UI page — roughly 2–3 days for a competent Cloudflare dev, mostly because of the GitHub tree-walk and R2 listing pagination.

---

## 2. Advanced Editor Tools (Automattic) → "Rich Content Blocks" in Decap CMS

**(a) Problem it solves:** Adds formatting capability to the WordPress block/classic editor — extra paragraph/text styles, table tools, TinyMCE button extensions — so Mike can format body copy (headings, tables, callouts, buttons) without touching HTML.

**(b) New feature:** Decap CMS's built-in Markdown editor is deliberately plain. Replace it with a **configured rich-text/MDX editor widget** in Decap CMS with a custom toolbar exposing exactly the formatting Mike actually uses:
- Bold/italic/underline, headings H2–H4, bullet/numbered lists
- A **Table** button (inserts a Markdown table skeleton, editable inline)
- A **Callout/Highlight box** custom block (renders as a styled `<aside>` on the live site — useful for "Now booking December dates" style call-outs)
- A **Button/CTA** custom block (link + label + style, so he can drop a "Book Now" button inline in a page body without writing HTML)
- Image insert with drag-drop that pulls from the Media Library (Section 4) rather than a raw upload dialog every time

**(c) Technical implementation:**
- Decap CMS supports a `markdown` widget with a configurable toolbar (`buttons` array) plus custom "editor components" — this is the exact extension point. Build 2–3 custom editor components (callout, CTA button, table) as JS registered via `CMS.registerEditorComponent()`.
- These compile down to either raw Markdown extensions or MDX shortcodes that the Astro content pipeline (via `astro:content` + `remark`/`rehype` plugins, or MDX component mapping) renders into styled HTML at build time.
- No backend/Worker needed — this is pure CMS config + a handful of remark/rehype plugins in the Astro build.

**(d) Effort:** Low–medium. Toolbar config is quick; each custom editor component (callout, CTA, table helper) is a half-day to a day of focused front-end work. Total: 2–3 days.

---

## 3. Disable Gutenberg → Decap CMS's default field-based editing (no build needed)

**(a) Problem it solves:** Mike finds the WordPress block editor confusing/slow and prefers the simpler classic editor — one big text box, not a page built from stacked blocks.

**(b) New feature:** This is actually already solved by choosing Decap CMS's **field-based collection editing** as the default authoring mode instead of a block-builder UI. Each content type (Page, Blog Post, Listing) is defined with explicit fields — Title, Hero Image, Body (the rich-text widget from Section 2), SEO fields, etc. — presented as a simple top-to-bottom form, exactly like the WordPress classic editor's single content box plus meta boxes. No drag-and-drop block canvas, no nested block trees.
For any page that truly needs flexible layout (e.g. the homepage with multiple sections), offer an **optional "Sections" list field** (an ordered array of a few pre-built section types: Hero, Text+Image, Gallery, Testimonials, CTA) — but keep it opt-in per collection so most content stays in the simple single-body-field mode Mike prefers.

**(c) Technical implementation:** Pure `config.yml` authoring in Decap CMS — define collections with `widget: markdown` for body content instead of a `widget: list` of block objects. Zero custom code for the simple pages; the optional Sections list (for homepage only) is a `list` widget with a small set of `types`, a standard Decap CMS pattern.

**(d) Effort:** Low. This is CMS configuration, not development — roughly a day to define all collections/fields correctly and test with Mike.

---

## 4. FileBird Lite → "Media Library" with folders (D1-backed)

**(a) Problem it solves:** WordPress's default media grid is a single flat list of every image ever uploaded. FileBird lets Mike organize uploads into folders (e.g. "Summit Club Condos," "2026 Listings," "Team Photos") so he can find things.

**(b) New feature — a real folder-based Media Library page in the admin panel:**
- A dedicated `/admin/media` page (custom Astro/React admin route, not the default Decap CMS media picker) showing a folder tree on the left (create/rename/delete/nest folders) and a thumbnail grid on the right.
- Drag-and-drop upload into a folder; drag-and-drop to move files between folders; multi-select for bulk move/delete.
- Search/filter by filename, folder, or alt text.
- This same folder-aware picker is what opens when Mike clicks "Insert Image" from within the page editor (Section 2's editor components), so folder organization is usable everywhere, not just a separate silo.

**(c) Technical implementation:**
- D1 table `media_folders` (id, name, parent_id, created_at) and `media_assets` gets a `folder_id` foreign key (this is the same table introduced in Section 0/1).
- Admin Worker exposes CRUD endpoints: `/api/media/folders`, `/api/media/assets?folder=`, `/api/media/move`, `/api/media/upload` (streams to R2, writes the D1 row).
- Front-end: a React/Preact island embedded either as a custom Decap CMS media library integration (Decap supports registering a [custom media library](https://decapcms.org/docs/customization/) via `CMS.registerMediaLibrary()`) or as a fully separate admin page — recommend the former so it's the *same* picker used inline in content editing, matching how FileBird integrated directly into the WP uploader.
- Upload endpoint also runs basic image processing (strip EXIF GPS data for privacy on real-estate photos, generate a thumbnail) at upload time via the Worker.

**(d) Effort:** Medium–high. This is the most substantial custom build in this doc: real folder CRUD, drag-drop UI, an uploader, and a custom Decap media library integration. Estimate 4–6 days.

---

## 5. Media Cleaner → covered by "Orphaned Media" in Site Housekeeping (Section 1), extended with broken-link detection

**(a) Problem it solves:** Finds media files nobody links to anymore, and finds broken image references (pages pointing at files that no longer exist), so the media library doesn't silently rot.

**(b) New feature:** Extend the Site Housekeeping panel (Section 1) with a second detection pass:
- **Unused media** (already specced in Section 1 — same mechanism, don't rebuild it).
- **Broken references** — the inverse check: scan all content files for image/video URLs and flag any that point to an R2 object that no longer exists in `media_assets`. Shown as "Broken images" with the offending page listed, a preview of where it's used, and a one-click "open that page in the editor" link so Mike can fix or replace it immediately.

**(c) Technical implementation:** Same scheduled Worker job as Section 1, adds a second comparison pass (content-referenced URLs → do they resolve in `media_assets`/R2). Findings feed into the same `housekeeping_findings` table with `type = 'broken_reference'`. No new infrastructure, just an additional check in the existing job and one more row-type in the UI list.

**(d) Effort:** Low, since it rides on Section 1's infrastructure. Roughly a half-day once Housekeeping exists.

---

## 6. Phoenix Media Rename → Rename-on-upload + bulk rename in Media Library

**(a) Problem it solves:** WordPress keeps the original filename from the uploader's camera/phone (`IMG_4821.jpg`, `DJI_0043.MOV`) which is bad for SEO, bad for organization, and bad for finding the right file later. This plugin lets Mike rename files (and updates all references) after upload, including bulk renaming.

**(b) New feature:**
- **On-upload rename prompt**: when Mike uploads a file through the Media Library (Section 4), the upload dialog defaults the filename field to a slugified, SEO-friendly suggestion (e.g. auto-derived from the folder name + a sequence number: `summit-club-condos-living-room-01.jpg`), which he can edit before confirming.
- **Bulk rename tool**: select multiple files in the Media Library grid → "Rename" → pattern-based bulk rename (e.g. `{folder-slug}-{n}`) with a live preview of resulting filenames before committing.
- **Reference-safe renames**: renaming updates the `media_assets.filename`/URL, and the admin Worker automatically finds and rewrites every content file that references the old URL (via the same content-scan used in Housekeeping) so nothing breaks — this is actually a real improvement over WordPress, where renaming an attachment does NOT auto-update `<img>` tags already placed in post content, a common source of broken images in WP. It's a genuine win to point out to Mike.

**(c) Technical implementation:**
- Rename endpoint in the admin Worker: (1) copies the R2 object to the new key, (2) deletes the old key, (3) updates `media_assets`, (4) runs a scripted find-and-replace across the content repo via the GitHub API (open a commit — or a draft branch reviewed like any other edit, see Section 10 — replacing old URL occurrences with the new one).
- Bulk rename is the same endpoint called in a loop with a pattern-generated name list, transactionally logged so a failure partway through doesn't leave things half-renamed (log each step to a `rename_jobs` D1 table with status per file, resumable).

**(d) Effort:** Medium. The rename-and-rewrite-references logic is the non-trivial part (needs the content-scan capability already built for Housekeeping) — roughly 2 days, mostly reused infrastructure.

---

## 7. Simple Page Ordering → Drag-and-drop page order in admin nav/collection list

**(a) Problem it solves:** Lets Mike reorder pages in the WP admin list (which controls menu order / hierarchical display order) by dragging rows instead of manually editing a numeric "menu order" field.

**(b) New feature:** In the admin panel's Pages collection list view (Decap CMS supports customizing collection list views), add a **drag-and-drop reorder mode**: a toggle that switches the list from Decap's default (alphabetical/date-sorted) view into a draggable list, where dropping a row updates that page's `order` frontmatter field. This same `order` field drives both (1) the site's main navigation and (2) any listing pages that display children in a defined sequence (e.g. the tour-packages page).

**(c) Technical implementation:**
- Every relevant content type gets an `order: number` frontmatter field (already supportable natively in Decap's `number` widget, but the *drag-and-drop reordering UI* itself is not a stock Decap feature — Decap's default list view doesn't support drag-and-drop).
- Build a small custom admin page (a React island, same pattern as Media Library) that: fetches the collection's entries via the Decap/GitHub API or the admin Worker, renders them as a sortable list (using a lightweight lib like `dnd-kit`), and on drop, batch-writes updated `order` values back as frontmatter — either as one commit per entries file, or as a single grouped commit via the admin Worker calling the GitHub API's tree/commit endpoints directly (cleaner than N separate Decap saves).
- Astro build sorts by `order` when rendering nav/listings.

**(d) Effort:** Low–medium. Drag list UI + batch-commit endpoint: about 2 days.

---

## 8. Yoast Duplicate Post → "Clone Page" + "Rewrite & Republish" using git branches

**(a) Problem it solves:** Two related but distinct workflows:
1. **Clone-as-starting-point** — Mike duplicates an existing listing/page as a template for a new one instead of building from scratch.
2. **Rewrite & Republish** — Mike wants to edit a page that's already live (e.g. update pricing/photos on an active listing) but doesn't want half-finished edits visible to the public while he works; he edits a private copy and then "publishes over" the original when ready.

**(b) New feature — two buttons on every entry in the admin panel: "Duplicate" and "Edit as Draft."**

- **Duplicate**: creates a brand-new content file that's a copy of the selected entry (new slug generated: `-copy`, or Mike renames it in the resulting new editor screen), including copying its Section-4 folder assignment for images. Implemented as a straightforward Worker call to the GitHub API: read the source file's content, write it to a new path, open it directly in the editor for Mike to adjust and save as normal (its own new commit history from that point).

- **Edit as Draft ("Rewrite & Republish")**: this is where git branching does real work. Clicking it: (1) creates a new git branch off the current published commit for that file (e.g. `draft/summit-club-listing-2026-07-26`), (2) opens the SAME file for editing but scoped to that branch, so Decap CMS commits Mike's changes to the draft branch instead of `main` — the live site is untouched. (3) Cloudflare Pages automatically builds a **preview deployment** for that branch, giving Mike a real preview URL to check the page exactly as it'll look live. (4) When happy, Mike clicks **"Publish"** in the admin UI, which merges the draft branch into `main` (fast-forward or squash merge via the GitHub API), instantly making the changes live, and the draft branch/preview is cleaned up automatically (feeding into Section 1's housekeeping too).

**(c) Technical implementation:**
- Admin Worker: `/api/duplicate` (file copy via GitHub Contents API), `/api/draft/start` (create branch via GitHub Git Refs API), `/api/draft/publish` (merge branch via GitHub Merges API, then delete branch), `/api/draft/discard` (delete branch without merging).
- Decap CMS needs to be pointed at the correct branch per editing session — Decap supports a `branch` backend config, but switching branches per-entry-session for a *single* Decap instance requires either (i) running Decap with the `branch` param swappable via a URL query/config override (achievable with Decap's `backend.branch` being read from a runtime-configurable value), or (ii) a thin custom wrapper UI that opens the underlying Git-based editor scoped to that branch. This is the one place where genuine custom frontend work is needed beyond stock Decap config — budget for it.
- Preview URLs: Cloudflare Pages already auto-generates a preview deployment per branch pushed — this is free functionality, just needs the admin UI to surface the resulting preview link (fetch via Cloudflare API's deployments list, filter by branch name) rather than making Mike hunt for it in a separate Cloudflare dashboard.
- "Publish" merge endpoint should run the same build-check gate a PR would (wait for the preview deploy to succeed) before allowing merge, so Mike can't accidentally publish a broken build.

**(d) Effort:** High. This is the most architecturally significant feature in the whole spec — it's genuine custom development bridging Decap's per-branch editing limitation, GitHub's branch/merge API, and Cloudflare Pages' preview system into one clean two-button UX. Estimate 5–8 days, and it directly reuses/justifies the git-history UI work in Section 10 below (build them together).

---

## 9. Plugin Activation Status → "System Status" dashboard

**(a) Problem it solves:** A quick "what's turned on, what's broken" view — Mike glances at it to sanity-check the site's operational state (are the plugins/features that should be running actually running).

**(b) New feature — a "System Status" dashboard page** (admin home screen or a dedicated tab) showing, at a glance:
- **Last deploy**: status (success/fail), timestamp, commit message/summary, who triggered it (pulled from Cloudflare Pages' deployment API).
- **Build health**: pass/fail of the last N builds, with a link to build logs if something failed (translated into plain language: "Your last update failed to publish — click here to see why" rather than raw CI log dump).
- **Feature status list**: a simple checklist-style view of the site's "features" (the equivalent of "which plugins are active") — e.g. Contact Form: Active, Booking Calendar Sync: Active, Sitemap: Generated, Analytics: Connected, SSL: Valid, DNS: Healthy — each backed by a real automated check, not a static label.
- **Domain/SSL/DNS health**: pulled from the Cloudflare API (zone status, SSL certificate expiry, DNS record validation) — this is the closest analog to "is everything configured correctly" that WordPress admins get from a server-status plugin.
- **Storage/usage**: R2 storage used, D1 row counts, Pages build minutes used this month (useful so Mike doesn't get surprised by usage-based costs).

**(c) Technical implementation:**
- A Worker endpoint `/api/system-status` aggregates: Cloudflare Pages Deployments API (build status/history), Cloudflare Zone API (SSL/DNS health), R2 bucket stats, D1 `PRAGMA`/count queries, and a small set of custom health checks (e.g. does `/sitemap.xml` return 200, does the contact-form Worker respond, does the booking integration's last sync timestamp look recent — each is a simple scheduled Worker cron job writing a heartbeat row to a `system_health` D1 table that the dashboard reads).
- Dashboard page is a straightforward read-only admin page — no write operations, so it's low-risk to build.

**(d) Effort:** Medium. Mostly integration work wiring up several Cloudflare API calls plus a couple of custom heartbeat checks; no complex state. Estimate 2–3 days.

---

## 10. Git history as Mike's "Revisions" and "Rewrite & Republish" — the non-technical UI

This section is the connective tissue behind Sections 1 and 8, specced in full because it's the single biggest conceptual shift from WordPress and needs to be invisible to Mike.

### What WordPress gives him vs. what git actually gives him

| WordPress concept | Git equivalent | What Mike should see |
|---|---|---|
| Post revisions (auto-saved older versions) | Commit history on a file | **"Version History"** |
| Restore an old revision | `git revert` / checkout an old file version and save it as new commit | **"Restore this version"** button |
| Compare two revisions | `git diff` between two commits | **"See what changed"** side-by-side view |
| Duplicate Post | Copy file content into a new file/path | **"Duplicate"** button (Section 8) |
| Rewrite & Republish | New branch → edit → merge to main | **"Edit as Draft" → "Publish"** (Section 8) |
| Draft autosave | Uncommitted/staged edit in the CMS session | **"Unsaved changes"** indicator |

The word "git," "commit," "branch," "merge," and "repo" must never appear in the admin UI copy. Everything is renamed to plumbing Mike already intuitively understands from WordPress.

### UI design

**On every content entry's edit screen, add a "Version History" panel (sidebar or a tab):**
- A vertical timeline list: each entry shows a human-readable timestamp ("Edited Jul 24, 2026 at 3:12pm"), and — since Decap CMS commits are authored by whoever logs into the CMS — the editor's name if there's ever more than one user.
- Each row has two actions: **"View"** (opens a read-only rendered preview of the page as it looked at that point in time) and **"Restore"** (reverts the live content to that version — implemented as creating a new commit whose content matches the old snapshot, i.e. a forward-only "restore," never a destructive history rewrite, so nothing is ever actually lost).
- A **"Compare versions"** option lets Mike pick any two entries from the timeline and see a plain-English diff: added text highlighted green, removed text struck through in red, rendered as readable paragraphs rather than a code-style diff (build this with a word-level diff library like `diff-match-patch`, rendered as prose, not `+`/`-` line diffs).

**Technical implementation of Version History:**
- Backed by the GitHub Commits API: `GET /repos/{repo}/commits?path={file}` gives the full commit history for a single content file — this is literally "WordPress revisions" for free, no extra database needed.
- "View" fetches that commit's version of the file (`GET /repos/{repo}/contents/{file}?ref={sha}`) and runs it through the same Astro/Markdown render pipeline used for previews, in an iframe.
- "Restore" reads the old version's content and performs a normal Decap/GitHub Contents API write to `main` with that content — semantically a new "undo" commit, matching how WordPress revision-restore also just creates a newer revision rather than deleting history.
- "Compare" fetches both versions' raw Markdown/content and runs a diff library client-side; no backend needed beyond the two content fetches.

**Rewrite & Republish surfaces here too:** when Mike uses "Edit as Draft" (Section 8), the Version History panel gains a clearly-marked **"Draft in progress"** banner at the top with a **"Preview draft"** button (links to the Cloudflare Pages preview deployment) and the **"Publish"** / **"Discard draft"** buttons live right there — so the whole revision/draft/publish lifecycle is one coherent panel per page, not scattered across separate tools.

### Effort for Section 10 specifically
Medium-high, but it is substantially shared code with Section 8 (both need branch/commit history access via the GitHub API) — treat Sections 8 and 10 as one combined build effort of roughly 6–9 days total covering: branch create/merge/discard endpoints, the Version History timeline UI, the diff viewer, and the Decap-branch-switching wrapper.

---

## Summary table

| # | Plugin | New feature name | Core tech | Effort |
|---|---|---|---|---|
| 1 | Advanced Database Cleaner | Site Housekeeping | Cron Worker + D1 + R2/repo diff | Medium (2-3d) |
| 2 | Advanced Editor Tools | Rich Content Blocks | Decap CMS custom editor components | Low-medium (2-3d) |
| 3 | Disable Gutenberg | Field-based editing (default) | Decap CMS config only | Low (1d) |
| 4 | FileBird Lite | Media Library w/ folders | D1 + R2 + custom Decap media library | Medium-high (4-6d) |
| 5 | Media Cleaner | Broken-reference detection | Extends #1's Worker job | Low (0.5d) |
| 6 | Phoenix Media Rename | Rename-on-upload + bulk rename | Worker rename+rewrite-refs endpoint | Medium (2d) |
| 7 | Simple Page Ordering | Drag-to-reorder list view | Custom admin page + batch commit | Low-medium (2d) |
| 8 | Yoast Duplicate Post | Duplicate + Edit as Draft/Publish | GitHub branch/merge API + Pages previews | High (5-8d, shared w/ #10) |
| 9 | Plugin Activation Status | System Status dashboard | Cloudflare API aggregation + heartbeats | Medium (2-3d) |
| 10 | (n/a — git mapping) | Version History panel | GitHub Commits API + diff viewer | Medium-high (shared w/ #8) |

**Total realistic build estimate:** roughly 4–5 developer-weeks for the full admin panel described above, on top of the base Astro site + Decap CMS setup. Sections 1, 5, and 6 share infrastructure and should be built together; Sections 8 and 10 share infrastructure and should be built together; Section 4 (Media Library) is a prerequisite that Sections 1, 5, and 6 all depend on for the `media_assets`/`media_folders` D1 schema.
