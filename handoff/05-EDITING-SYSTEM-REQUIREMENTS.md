# Editing System Requirements

This is the main missing piece. The static site itself is done; this is what needs building.

## The actual requirement — updated, this is now a hard requirement, not a "nice to have"

The client was explicit and firm on this: **Mike needs to be able to do pretty much whatever he wants on the site himself** — this is a REQUIRED capability set, not aspirational. Build all of it:

- **Edit any text field** on any page — copy, headlines, descriptions, FAQ answers, everything.
- **Edit any price** — the three Vegas packages, full à-la-carte tables, every add-on.
- **Swap/add/remove any image** anywhere on the site.
- **Create new pages.** This must be real: Mike picks from a library of existing page *templates* (service page, blog post, generic content page, pricing-style page) and fills in his own content/images/prices to produce a genuinely new, live page — not just editing existing ones. See `10-ADMIN-PANEL-SPEC.md` section on Yoast Duplicate Post's replacement for exactly how this works (duplicate an existing page as a starting point, edit freely, publish as new).
- **Delete pages.** A real, working delete action from the admin (with a confirmation step and — since everything's backed by version history — an easy undo/restore if he deletes the wrong thing; see the "Version History" panel in `10-ADMIN-PANEL-SPEC.md`).
- **Move/reorder things.** Drag-and-drop reordering of: navigation menu items, portfolio/gallery images, FAQ entries, service list order, pricing table row order — anywhere a list of things appears, he should be able to reorder it himself. Already speced concretely in `10-ADMIN-PANEL-SPEC.md` (Simple Page Ordering replacement).
- **Move content sections within a page**, not just reorder items in a list — e.g. drag the testimonials section above the pricing section on a given page. This is a real, distinct capability from field-editing and needs to be designed for explicitly (see the "what this actually requires" note below).

**The one honest, genuine limit** (this is the only thing NOT being promised as "anything, no dev needed," and it's the same limit every real page-builder tool has once you're off its pre-built components, including Divi): inventing a **brand-new page layout structure from a truly blank canvas** — arbitrary custom column/grid arrangements never seen before on the site — still benefits from a developer building that as a new template once, which Mike can then duplicate/reuse freely forever after. This is not a cop-out; it's genuinely how every page-builder tool works in practice (Divi included — a truly novel layout still takes real page-builder skill even for someone with a Divi license). Everything else above is a real, required, buildable feature.

## What "move content sections within a page" actually requires (be honest about this in the build)

This is more than the git-based CMS's default form-field editing gives you out of the box — most git-CMS setups (Decap included) are good at "edit this field" and "reorder this list," but a page built from Astro components in `.astro` files has its section order fixed in code, not as reorderable data. To make this genuinely work:
- Page content needs to be modeled as an **ordered list of typed content blocks** (e.g. `[{type: "hero", ...}, {type: "testimonials", ...}, {type: "pricing-table", ...}]`) stored in the CMS-editable content file, with the Astro page template looping over that list and rendering each block by type — rather than each section being hardcoded inline in the `.astro` file.
- This is a real architectural decision to make early, not a small tweak — but it's what actually delivers on "move stuff around," and it's the same underlying pattern every real page-builder (Divi included) uses under the hood. Plan for it from the start of the CMS integration work rather than retrofitting it later.

He should NOT need to touch code, markdown syntax, or understand git anywhere in any of this.

## Constraints from the client (explicit, already discussed)

- **Not GitHub-account-tied login.** He doesn't want to require a GitHub account for the business owner to log in and edit content. (The underlying storage can still be a git repo — that's an implementation detail, not something he needs to see or understand.)
- **Cloudflare preferred for hosting/infrastructure long-term — but DO NOT MIGRATE YET.** Stay deployed on GitHub Pages for now (that's the live, working deployment). What's needed right now is getting the codebase **ready** for a clean Cloudflare Pages switch later, not actually switching. Concretely: avoid decisions that lock the project into GitHub-Pages-specific quirks. The main one already in the codebase: `astro.config.mjs` currently sets a GitHub-Pages-style subpath `base` (`/virtual-tours-las-vegas-redesign/`) for production builds — Cloudflare Pages serves from the domain root, so `base` should become `/` there. Structure the config so this is a one-line/one-env-var change when the actual migration happens, not a rework. Same principle for anything else Cloudflare-specific in this spec (Cloudflare Access, Workers, D1, R2, Turnstile) — write the code/config for it now, but it doesn't need to be live/activated until the client decides to actually cut over.
- Ideally use **Cloudflare Access** (Zero Trust) for the login gate when the Cloudflare migration does happen, since it's a mature, maintained auth product rather than something hand-rolled.
- **Security is non-negotiable.** Explicit ask: "make sure absolutely all data is secure, there's no vulnerabilities, everything is up to date." See the security checklist below — treat it as a hard requirement, not a nice-to-have.

## Recommended approach (this is a recommendation, not a mandate — GLM should feel free to choose a better path if one exists, but should explain the reasoning if diverging significantly)

A git-based CMS (e.g. **Decap CMS**, or a modern compatible fork like **Sveltia CMS**) layered onto the existing Astro site:
- Gives a real visual/form-based editor (fields, not code) for exactly the content that should be editable
- Commits changes back to the git repo, which triggers the existing auto-deploy pipeline (currently GitHub Actions → GitHub Pages; would move to Cloudflare Pages)
- No database to secure, no custom backend to build from scratch
- **The auth gap:** Decap's simplest built-in backends assume either Netlify Identity or a GitHub OAuth login for the *editor UI itself* — which conflicts with "not GitHub-tied" from the business owner's perspective. The known, workable pattern: put **Cloudflare Access in front of the `/admin` route** so the login screen Mike actually sees is a clean Cloudflare Access page (email-based, no GitHub account needed), and handle the CMS's own git-write authentication behind that with a small OAuth proxy (a Cloudflare Worker implementing the github-oauth-provider pattern Decap expects — this is a well-documented community pattern, not novel/risky code). The business owner never sees or needs a GitHub account; the OAuth proxy uses a single app-level GitHub OAuth app that the *developer* (not Mike) owns.

If a genuinely better/simpler pattern exists that satisfies the same constraints (no bespoke auth, no GitHub account required of the business owner, Cloudflare-first), prefer it — this is describing a known-working shape, not insisting on one exact implementation.

## What was explicitly ruled out and why

- **Divi/WordPress** — see `04-DIVI-INVESTIGATION-SUMMARY.md`.
- **Fully custom-built drag-and-drop editor + custom auth from scratch** — considered and rejected as the *first* option specifically because of the security stakes here (a hand-rolled auth system, a database storing arbitrary editable content that then gets rendered back on a public site, custom session management) is a large attack surface for a single build pass to get right. If a custom system is built anyway, it must meet every item in the security checklist below, and ideally get a second independent review pass before going live with real credentials.
- **Full visual page-builder SaaS (Builder.io / Storyblok)** — legitimate options, previously proposed, but the client leaned toward something closer to "our own" / lower ongoing cost. Worth reconsidering only if the Decap+Cloudflare-Access pattern turns out to be more fragile in practice than expected.
