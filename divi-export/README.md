# Divi Import Package — Homepage

This folder is a **starting point**, not a finished handoff. It gets the homepage into Divi with the real content and structure from the Astro prototype, but a few things need your attention in the Divi Builder after import — listed below.

**Important caveat:** I don't have a live WordPress+Divi install to test this import against, so `home-layout.json` is built from Divi's documented shortcode syntax (targeting Divi 4.27, the current stable line) rather than verified end-to-end. The structure, modules and content should all be correct, but if any single module errors on import (Divi will usually just skip a malformed one rather than fail the whole import), tell me which one and I'll fix that specific shortcode rather than guess at the whole file again.

## What's here

- `home-layout.json` — Divi Portability export for the homepage. Import via Divi Library, then load onto your homepage.
- `custom-theme.css` — global colors/fonts/button styles. Paste into Theme Options → Custom CSS.

## Import steps

1. **WordPress admin → Divi → Theme Builder** (or open the page in the Divi Builder if importing directly onto a page).
2. Click the **Portability icon** (the up/down arrow icon, usually top-left of the builder toolbar) → **Import**.
3. Upload `home-layout.json`, click **Import Divi Builder Layout**.
4. Divi will build out the sections. Save/publish the page.
5. Go to **Divi → Theme Options → General → Custom CSS**, paste in the contents of `custom-theme.css`, save.

## What still needs manual work (this is the honest part)

Divi's shortcode format can't reference files that live in this repo — it needs real WordPress Media Library URLs. I've marked every image slot with a placeholder like `REPLACE_WITH_MEDIA_URL_sierra-skye-living.jpg`:

1. Upload the real photos from `public/images/portfolio/` and `public/images/team/` (this repo) to your WordPress Media Library.
2. In the Divi Builder, click each image/gallery/testimonial module with a placeholder and swap in the uploaded image.
3. The **trust-bar client logo gallery** module (`gallery_ids="REPLACE_WITH_MEDIA_LIBRARY_IDS"`) needs actual WP attachment IDs — upload the logos from `public/images/clients/` first, then edit that module and select them from the gallery picker (easier to just rebuild that one module by hand than hunt for numeric IDs).

## Why only the homepage so far

This is a genuinely large, mechanical effort — 21 more pages, each needing the same shortcode-by-shortcode translation from the Astro components. I built the homepage first as a working template so you can confirm the approach (fonts, colors, button styling, layout structure) looks right in your actual Divi install before I spend the effort on the rest. If it looks right, tell me and I'll keep going page by page.

## A structural note on the header/nav/footer

Divi's global header and footer live in the **Theme Builder**, not in a page layout — they're not part of `home-layout.json`. You'll want to build those once in Theme Builder (nav: Work / Services / Pricing / About / Contact + phone CTA button, matching `custom-theme.css`'s header styling above) and they'll apply site-wide automatically as more pages get imported.

## Real content only

Every price, credential, testimonial and business fact in `home-layout.json` is pulled directly from `src/data/site.ts` in this repo (already verified against the real business) — nothing here was invented for the Divi version.
