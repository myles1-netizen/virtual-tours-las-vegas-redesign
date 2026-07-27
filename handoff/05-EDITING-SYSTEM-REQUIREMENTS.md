# Editing System Requirements

This is the main missing piece. The static site itself is done; this is what needs building.

## The actual requirement

Mike (non-technical, the business owner) needs to be able to log in and:
- Edit text fields (page copy, headlines, descriptions)
- Edit prices (the three Vegas packages + full à-la-carte pricing tables)
- Swap/update images
- Ideally: move things around a bit (reorder sections/items), and create/edit/delete pages — though it's fine if full freeform page-layout creation still needs a developer; that's normal even for tools like Divi once you're off pre-built modules. Be upfront about this limit rather than overpromising "anything, no dev needed."

He should NOT need to touch code, markdown syntax, or understand git.

## Constraints from the client (explicit, already discussed)

- **Not GitHub-account-tied login.** He doesn't want to require a GitHub account for the business owner to log in and edit content. (The underlying storage can still be a git repo — that's an implementation detail, not something he needs to see or understand.)
- **Cloudflare preferred for hosting/infrastructure** over the current GitHub Pages setup — Cloudflare Pages for hosting, and ideally **Cloudflare Access** (Zero Trust) for the login gate if it fits, since it's a mature, maintained auth product rather than something hand-rolled.
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
