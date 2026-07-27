# Content Audit — Summary

Extraction method for all pages: WebFetch (fetches HTML, converts to markdown, summarizes with an AI model). **None of these pages were accessible via a JS-rendering browser in this pass** — every page was reachable and returned content (no 404s encountered), but several pages that depend on JavaScript-rendered widgets (booking calendar, checkout flow, embedded 360/Matterport viewers) could NOT have their interactive/dynamic content captured by this tool. Those are flagged individually below and in their respective files.

## Pages Extracted (all returned HTTP success, no 404s found)

| File | Source URL | Status |
|---|---|---|
| homepage.md | https://virtualtourslasvegas.com/ | Extracted, but testimonials/full footer/exact blog titles NOT captured — needs manual browser re-check |
| about-main.md | https://virtualtourslasvegas.com/about/ | Extracted; contains HIGH-PRIORITY endorsement-language flags (Lennar, Zillow Offers, "sole provider" claims) needing verbatim confirmation |
| about-book-real-estate-photography.md | https://virtualtourslasvegas.com/about/book-real-estate-photography-in-las-vegas/ | Extracted; no dollar pricing found; references two pricing pages not in original task scope |
| about-faqs.md | https://virtualtourslasvegas.com/about/vtlv-faqs/ | Extracted fully, good verbatim quote coverage; includes pricing facts ($10/mo hosting, $35 trip charge) |
| about-availability-calendar.md | https://virtualtourslasvegas.com/about/availability-calendar/ | Page loaded but the actual calendar widget is JS-rendered and NOT captured — needs browser pass |
| about-navigation.md | https://virtualtourslasvegas.com/about/navigation/ | Extracted (this is a tour-controls help page, not a sitemap, despite the slug) |
| about-michelle-sproul.md | https://virtualtourslasvegas.com/michelle-sproul-virtual-tour-realtor/ | Extracted; page does NOT explicitly state she is Mike's wife (that fact comes from the task brief, not the live page as captured) |
| about-customer-cabinet.md | https://virtualtourslasvegas.com/customer-cabinet/ | Extracted; shows "Customer authentication is disabled" — may be a JS-hidden feature, needs confirmation |
| booking-checkout-360-virtual-tour.md | https://virtualtourslasvegas.com/las-vegas-360-virtual-tour-checkout/ | Page loaded but the LatePoint (or similar) booking/checkout widget is JS-rendered and NOT captured — HIGH PRIORITY gap, needs a real browser pass since replicating this flow was explicitly requested |
| vegas-strip-360-virtual-tour.md | https://virtualtourslasvegas.com/las-vegas-strip-360-virtual-tour/ | Extracted; embedded tour widget not captured (JS) |
| vacation-rental-services-hub.md | https://virtualtourslasvegas.com/vacation-rental-photography-services/ | Extracted fully; contains an Airbnb "40% more sales" stat flagged for exact-wording verification |
| vacation-rental-photography.md | https://virtualtourslasvegas.com/vacation-rental-photography-services/vacation-rental-photography/ | Extracted fully |
| vacation-rental-floor-plans.md | https://virtualtourslasvegas.com/vacation-rental-photography-services/vacation-rental-floor-plans/ | Extracted fully |

## Pages requested but NOT separately covered
None missing — all 13 requested URLs were fetched and have a corresponding file.

## Cross-cutting gaps requiring a follow-up pass (recommend a real browser, e.g. Playwright/manual)
1. **Booking/checkout flow** (las-vegas-360-virtual-tour-checkout) — the explicit ask to "document exactly what fields/options/steps it has" could not be fulfilled by static HTML fetching. This is the single biggest gap versus the task's requirements.
2. **Availability calendar widget** — same JS-rendering limitation.
3. **Homepage testimonials and exact blog post titles/excerpts** — not surfaced by the summarizing fetch; do not fabricate these for the rebuild.
4. **Two pricing pages referenced in nav** ("Pricing – Real Estate," "Pricing – Commercial Ads") exist on the live site per in-page references but were outside the originally requested URL list and were not captured — no dollar-amount pricing was found anywhere in this audit except the $10/month hosting fee and $35 trip charge from the FAQ page.

## Highest-priority LEGAL/ACCURACY flags (see about-main.md for full detail)
- "sole Matterport provider for new home builders like Lennar Homes"
- "sole Matterport provider" for "Luxury Estates & Development"
- "Sole Photographer shooting HDR photos, Zillow 3D Tours, Floor Plans" for the Zillow Offers Program
- "Zillow Authorized Photographer" badge (about-book-real-estate-photography.md)
- "earned awards with the WSJ and Realtor.com for Sales and Marketing" (vague, needs exact award name/year)

All of the above were captured via AI-paraphrased extraction (not raw verbatim HTML dumps), so before the rebuild reuses this specific wording, a manual verbatim re-check of the live About page is strongly recommended — this matters especially given the legal/accuracy constraint on contractor-vs-partnership framing.

## Nothing was fabricated
No invented facts, prices, or testimonials were added anywhere in this audit. Where information was missing or uncertain, it is explicitly marked as a gap requiring follow-up rather than filled in.
