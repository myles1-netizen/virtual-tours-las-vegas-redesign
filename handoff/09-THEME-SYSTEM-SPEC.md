# Theme System Spec — Light/Dark Consistency

## The problem being fixed

The current build (see `03-LESSONS-LEARNED.md`, items 1-3 and 9) mixed light and dark sections inconsistently — some sections dark, some light, header white, hero dark, cards sometimes dark/sometimes light — which repeatedly caused contrast bugs (white text on light backgrounds, gold text on gold-ish backgrounds, etc.) because every section's color combination had to be reasoned about individually instead of following one system. The client's explicit ask: **pick one real theme approach — a full light theme or a full dark theme — and support BOTH as togglable modes**, rather than the current mix of both within a single fixed design.

## Requirement

Build an actual **light/dark mode toggle** (not just "the site happens to look okay in dark mode because everything's already dark") — a real, working theme switcher, likely persisted (localStorage) so a visitor's choice sticks across pages/visits, defaulting to system preference (`prefers-color-scheme`) on first visit.

## What "full light theme" and "full dark theme" mean here

Not just inverting a background color — every component needs a deliberate, tested color mapping for both modes:

- **Light mode:** paper/white backgrounds, dark ink text, brass gold as accent only (already mostly what exists — `--paper: #F7F4EF`, `--ink: #1A1814` etc. in the current `global.css` tokens are a reasonable light-mode base)
- **Dark mode:** needs a genuinely separate, deliberately-designed dark background (not just `#000` — something like a warm near-black consistent with the existing `--dark: #0F0E0C` / `--dark-2: #1C1A16` tokens already in the system), light text, and **the gold/brass accent needs a separate contrast check in dark mode** — the existing `--brass-btn` (#8A6A3C) was tuned specifically for white text on a light-adjacent background; dark mode may need a different button treatment (e.g. lighter brass background with dark text, or the reverse of what light mode uses) — don't assume the same hex values pass contrast in both modes without actually checking.

## Hard requirement: photos, logos, and client logos must stay visible in both modes

This is the specific thing called out — some images have transparent backgrounds or were designed assuming a white page background (e.g. many of the client logo PNGs in `public/images/clients/` — Zillow, Lennar, CBRE, etc. — are likely dark-text-on-transparent, which would go invisible or low-contrast directly on a dark background). Concretely:
- Client logo images need either a light "chip"/card background behind them even in dark mode (a small white/light rounded rectangle each logo sits on, like a badge) so dark-colored logo marks stay legible, OR verify each logo actually has enough built-in contrast/an alpha channel that works on dark backgrounds and only use the chip approach where needed.
- The VTLV brand logo already has two variants (`logo-navy.png`, `logo-white.png`) for exactly this reason — carry that pattern through consistently everywhere the logo appears, keyed to the active theme, not hardcoded to one variant.
- Real estate photography images themselves (the portfolio photos) generally work fine on either background, but check any images with light/white backgrounds baked in (see `03-LESSONS-LEARNED.md` item 8 — several existing images already had this exact problem in a different context) don't create a "logo floating on a mismatched color block" look in dark mode.

## Consistency requirement across every page

Every one of the ~20+ pages, plus every shared component (header, footer, cards, buttons, forms, the price calculator, any admin UI) must respect the active theme — no page or component should be "stuck" in one mode regardless of the toggle. This means: no hardcoded `background: white` or `color: black` anywhere in component CSS — everything should reference theme-aware tokens/CSS custom properties that flip value based on the active mode (e.g. `:root { --bg: ...; } [data-theme="dark"] { --bg: ...; }` pattern, or Tailwind-style `dark:` variants if the rebuild uses a different CSS approach).

## Header/button sizing note (also flagged by the client)

The current header bar and its buttons are oversized relative to the rest of the UI — reduce header height, logo size, nav link size, and button padding to something more proportionate (the client's specific words: "that top bar and those buttons are a little bit big"). This should be re-balanced regardless of which theme is active, and re-checked in both light and dark mode since perceived size can shift slightly with contrast/weight changes between themes.

## Verification requirement

Before considering the theme system done: go through **every page, every component, in both light and dark mode**, and check text-over-image contrast (hover and non-hover states both — the client specifically asked that things be readable "both without hovering over something and hovering over something," meaning default/resting state contrast matters as much as hover-state contrast, not just interactive elements). Don't ship a theme toggle that technically works but that nobody actually walked through page-by-page — that's exactly how the contrast bugs in `03-LESSONS-LEARNED.md` happened the first time.
