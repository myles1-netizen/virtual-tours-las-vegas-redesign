# Admin Panel Spec — WordPress-Familiar Editing Experience

This extends `05-EDITING-SYSTEM-REQUIREMENTS.md` with more specific detail on what Mike is used to from WordPress/Divi, so the replacement doesn't feel like a downgrade in capability even though it's a completely different underlying system.

## Principle

Mike doesn't need to know or care that the new site has no WordPress underneath it. The admin experience should map to the *outcomes* he's used to (edit a page, change a price, add a photo, reorder something, see SEO status) without requiring him to learn git, markdown syntax, or developer concepts. Every item below should be evaluated against: "does the CMS chosen in `05-EDITING-SYSTEM-REQUIREMENTS.md` cover this, or does something need to be custom-built on top of it?"

## Feature parity checklist, mapped from his actual current plugin list

| What Mike is used to (WordPress plugin) | What he actually needs from it | Covered by a good git-CMS setup? |
|---|---|---|
| Editing page/post content (Gutenberg/classic editor) | Edit text, headings, images on any page | Yes — this is the core job of Decap/Sveltia CMS or equivalent |
| Simple Page Ordering (drag-and-drop page order) | Reorder items (service list, portfolio order, FAQ order) | Yes, if the CMS config exposes an ordered-list field type for these — needs explicit setup per content type, don't assume it's automatic |
| Yoast SEO (meta title/description editor, per-page) | See and edit the SEO title/description for each page without touching code | Needs explicit CMS fields for `title` and `description` per page — make sure every page's frontmatter/content schema exposes these as editable fields, not hardcoded in `.astro` files |
| Yoast Duplicate Post (clone a page as a starting point) | Create a new service/page based on an existing one instead of starting blank | Depends on the CMS — worth checking if the chosen tool supports "duplicate entry," and if not, whether it's worth a small custom addition |
| Site Kit by Google (Analytics/Search Console at a glance) | See how the site's doing (traffic, rankings) without leaving his admin | Realistically: just give him direct links to Google Analytics/Search Console (they're free, real Google products) rather than trying to rebuild a dashboard — simpler and more accurate than a custom mini-dashboard |
| Redirection (fix broken links/404s) | Occasionally needs to redirect an old URL to a new one | Cloudflare Pages supports a `_redirects` file — this could be exposed as a simple CMS-editable list ("old path → new path") if it comes up often enough to be worth building, otherwise it's a rare enough task that "ask the developer" is fine |
| Master Slider / image sliders | Add a slider/carousel of images somewhere | Should be a defined, reusable component (already have `Gallery.astro` and `BeforeAfterSlider.astro` patterns to extend) with CMS-editable image lists, not a general-purpose slider builder |
| Matterport Shortcode | Paste a Matterport tour link and have it embed nicely with a popup viewer | Build ONE reusable "Matterport embed" component that takes just a URL/ID as a CMS field — see `plugin-research/wordpress-plugin-equivalents.md` for the technical implementation |
| LatePoint (booking) | Take bookings, see his calendar, handle deposits | See `plugin-research/latepoint-booking-system.md` — this is its own subsystem, not just an admin-panel feature |
| Akismet / reCAPTCHA (spam protection) | Not get spammed through his contact/booking form | Cloudflare Turnstile (free, no user friction) on any public form — this is an infrastructure choice, not something Mike needs to manage day-to-day |
| UpdraftPlus (backups) | Not lose his site | Git history already is a complete backup/version history — worth explaining this to him in plain terms once so he's not worried about it, but there's no "backup button" to build |

## What to be honest about NOT replicating

- **A general-purpose visual page builder** (build any layout from scratch, freeform) — already flagged in `05-EDITING-SYSTEM-REQUIREMENTS.md` as a real limit. New pages should be able to reuse existing page *templates* (e.g. "new service page" using the same layout as existing service pages, just new content) rather than free-form layout building.
- **Arbitrary plugin installation** — the whole point of leaving WordPress is not maintaining a plugin ecosystem. If a genuinely new capability comes up later, it gets built deliberately by a developer, not self-installed by Mike from a marketplace. This is a feature, not a limitation, worth explaining to him that way (no more surprise plugin conflicts, no more "why is my site slow" from 49 scripts loading — see `01-PROJECT-BRIEF.md` for that exact finding on his current site).

## Success criteria for this piece specifically

Mike should be able to, without asking for help:
1. Change a price on the pricing page and see it live within a few minutes
2. Edit the text of any page
3. Add/replace a photo anywhere on the site
4. Add a new blog post or service page using an existing one as a template
5. See his current SEO title/description per page and change it
6. Understand (in plain terms, documented for him) that his site is backed up automatically via version history, with no separate backup step needed
