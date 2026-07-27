# Start Here

This `handoff/` folder is a briefing package for continuing this project. Read these in order:

1. **`01-PROJECT-BRIEF.md`** — who this is for, the real problem, what "done" looks like
2. **`02-CURRENT-STATE.md`** — what's already built (a working, deployed Astro site — build on it, don't restart)
3. **`03-LESSONS-LEARNED.md`** — real bugs already found and fixed; don't reintroduce them
4. **`04-DIVI-INVESTIGATION-SUMMARY.md`** — why WordPress/Divi was ruled out (don't re-litigate this)
5. **`05-EDITING-SYSTEM-REQUIREMENTS.md`** — the main remaining work: a self-serve editing layer for the business owner
6. **`06-SECURITY-CHECKLIST.md`** — hard requirements, not optional, for anything touching auth/input/secrets
7. **`07-LEGAL-ACCURACY-GUIDELINES.md`** — read this before writing/rewriting ANY page copy. Third-party brand claims (Zillow, Lennar, Google) must never imply an endorsement/partnership that doesn't exist.
8. **`08-PRICE-CALCULATOR-SPEC.md`** — interactive pricing calculator for the pricing page
9. **`09-THEME-SYSTEM-SPEC.md`** — real light/dark mode toggle, full consistency across every page
10. **`10-ADMIN-PANEL-SPEC.md`** — mapping Mike's current WordPress admin habits to the new editing system
11. **`11-VOICE-AND-TONE.md`** — how to actually write as Mike (first person, direct, no corporate filler)
12. **`content-audit/`** — real page-by-page content extracted from the live site (every service, pricing, location, and about page) — use this as source material for rewrites, not `content-audit/` files as final copy verbatim (except testimonials, which must stay verbatim)
13. **`plugin-research/`** — a real, buildable admin-panel feature for **every single WordPress plugin** the current site runs. Per the client's explicit instruction, nothing is dismissed as "not needed" — every plugin gets a concrete feature spec living in the new site's own admin panel:
    - `latepoint-booking-system.md` — booking/scheduling/payments/reminders (Cal.com recommended)
    - `admin-content-tools.md` — database cleanup, media folders/rename, page ordering, duplicate/rewrite-republish, version history UI (git history surfaced in plain English, no git jargon)
    - `seo-analytics-performance.md` — per-page SEO checklist, live GA4/Search Console/PageSpeed dashboard inside the admin, image optimization stats, cache/performance dashboard
    - `security-reliability-comms.md` — spam/bot protection (Cloudflare Turnstile), transactional email + delivery log, real scheduled backups with a restore button, a redirects manager with 404 log
    - `wordpress-plugin-equivalents.md` — original pass; superseded by the four docs above for the plugins they cover, still useful as background on what each plugin originally did
    - Total additional infrastructure cost across all of this: **$0/month** at Mike's expected traffic (Cloudflare's free tiers for Workers/D1/R2, Resend's free email tier, Turnstile is free)

## Read this before anything else

`07-LEGAL-ACCURACY-GUIDELINES.md` now contains a **CRITICAL** section documenting real contradictions found on the live site during the content audit — including one that conflicts with the "Mike is a sole proprietor" framing used everywhere else in this handoff (one page states the business was co-founded with his wife). These need Mike's direct answer before finalizing any About-page copy, voice/tone decisions, or pricing. Do not guess or silently pick a side.

## The one-paragraph version

There's a real, working, deployed Astro website at `github.com/MylesThePro1/virtual-tours-las-vegas-redesign` that already fixes every concrete problem found on the client's current live WordPress site (broken images, deprecated code, bloated plugins, bad SEO, mismatched homepage content — all documented with evidence in `01-PROJECT-BRIEF.md`). All business content is real and verified in `src/data/site.ts`. What's missing is a way for the non-technical business owner to edit his own content (text, prices, images) without touching code — that's the actual deliverable this handoff is asking for. Don't rebuild the site from scratch; extend it.

## Where you have real latitude to make your own calls

- **Exact CMS/editing implementation.** `05-EDITING-SYSTEM-REQUIREMENTS.md` describes one workable pattern (Decap CMS + Cloudflare Access + a small OAuth proxy worker) but explicitly isn't mandating that exact stack if something better fits the constraints (no GitHub-account requirement for the business owner, Cloudflare-first, genuinely secure, genuinely simple for a non-technical user).
- **Visual/design polish.** The design system in `02-CURRENT-STATE.md` is a real, deliberate system (colors, type, spacing) — extend and refine it, don't discard it, but there's room to make it better. If something looks like it could be more distinctive, more modern, or more "obviously worth switching to" than what exists now, make that case with the changes.
- **Page-parity scope.** The current site made a deliberate call not to replicate the real site's ~57 near-duplicate SEO doorway pages. That's a defensible SEO call (thin/duplicate content is generally a liability, not an asset, for modern search) but if there's a strong reason to reconsider (e.g. verifiable evidence those pages actually drive meaningful traffic), that's a legitimate thing to flag or revisit.
- **How far the "move things around" editing capability goes.** Full freeform drag-and-drop page building vs. structured field editing with some reordering is a real spectrum — pick a point on it that's actually achievable securely and simply, and be honest in the final report about where that line landed.

## What must NOT change without a very good reason

- The real business facts, pricing, and testimonials in `src/data/site.ts` — verified accurate, don't regenerate or "improve" them creatively.
- The security requirements in `06-SECURITY-CHECKLIST.md` — these are hard constraints given the client's explicit ask, not suggestions.
- Don't reintroduce any of the specific bugs in `03-LESSONS-LEARNED.md`.
