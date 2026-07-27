# Divi/WordPress Path — Investigated and Abandoned

This is here so the reasoning doesn't need to be re-derived or re-argued. **Do not build a Divi/WordPress version unless the client explicitly reverses this decision.**

## What was tried

1. Built a Divi Portability JSON export (`divi-export/home-layout.json`) hand-authoring Divi shortcode syntax to recreate the homepage as native, visually-editable Divi modules (not a raw HTML/Code-module dump — the intent was to keep it genuinely editable in Divi's visual builder).
2. This could not be tested against a real Divi install (no access was available/appropriate — the live site is production and was explicitly off-limits to touch directly).
3. When the client's father actually imported it, real bugs surfaced: headline text rendered as small/gray instead of styled, because Divi's `header_*` style attributes only apply to actual `<h1>`-`<h6>` tags present in a text module's content — plain text content without heading tags falls back to default paragraph styling. Also, image placeholders (`REPLACE_WITH_MEDIA_URL_...`) were literal non-working strings rather than real image URLs, so nothing visual rendered.
4. Investigated whether an MCP server could give live, testable access to a real WordPress+Divi install (would have let the work be verified before handoff instead of guessed blind). Found two real, legitimate-seeming options (`diviops` — github.com/oaris-dev/diviops, and Respira's WordPress MCP server) but both require: a staging (not production) WordPress site, installing a plugin on it, and generating WordPress Application Password credentials — all of which need the site owner to set up, and which add more moving parts/cost to a plan whose whole point was to reduce cost and complexity.

## Why it was abandoned (the actual decision, made by the client)

- WordPress hosting + Divi license + Yoast SEO license are all **real recurring costs** for a site that (per the live-site audit in `01-PROJECT-BRIEF.md`) is currently under-serving the business anyway.
- Divi's own visual builder is not actually simple for a non-technical user — it's a professional page-builder tool with real complexity, not a "just click and it works" surface. Believing it's easier than a well-designed CMS-lite editing layer is a false assumption worth pushing back on if it resurfaces.
- No safe way to test a Divi build end-to-end without either touching production or asking the client to spin up and maintain a staging WordPress environment purely to support development — added friction disproportionate to the goal.
- The stated goal — "let a non-technical person edit text/prices/images easily" — does not require WordPress or Divi at all. A proper CMS layer on top of the existing static site achieves the same outcome for less money and less ongoing complexity (see `05-EDITING-SYSTEM-REQUIREMENTS.md`).

## What remains from this effort

`divi-export/` folder in the repo (partial homepage JSON + custom CSS + README). Not required for the new build. Safe to leave alone, or delete if it's just clutter — it's not a dependency of anything else in the project.
