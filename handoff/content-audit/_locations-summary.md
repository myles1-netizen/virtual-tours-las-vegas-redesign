# Content Audit Summary — Location/Service-Area Pages + Misc

Date of audit: 2026-07-26
Source: https://virtualtourslasvegas.com (live site, fetched via WebFetch)

## Files Written
| File | Page | Status |
|---|---|---|
| location-southern-nevada.md | /real-estate-photography-southern-nevada/ | Fetched OK |
| location-clark-county.md | /real-estate-photography-southern-nevada/clark-county-real-estate-photography/ | Fetched OK |
| location-las-vegas.md | .../las-vegas-real-estate-photography/ | Fetched OK |
| location-north-las-vegas.md | .../north-las-vegas-real-estate-photography/ | Fetched OK |
| location-summerlin.md | .../summerlin-real-estate-photography/ | Fetched OK |
| location-boulder-city.md | .../boulder-city-real-estate-photography/ | Fetched OK |
| location-henderson.md | .../henderson-real-estate-photography/ | Fetched OK |
| professional-real-estate-photography.md | /professional-real-estate-photography/ | Fetched OK |
| blog-inventory.md | post-sitemap.xml → 37 blog posts | Fetched OK (sitemap only, not full post content) |

## Overall Consolidation Verdict (Location Pages)
All 6 location pages (Southern Nevada, Clark County, Las Vegas, North Las Vegas, Summerlin, Boulder City, Henderson) share heavily duplicated boilerplate. Two template "generations" exist:
- **Older template** (Southern Nevada, Clark County, Las Vegas, North Las Vegas, Henderson): heading pattern "[City] Real Estate Photography Services," same 3 brand mentions (Matterport/Zillow/Google Business), "Book Appointment" CTA repeated, identical contact block, and a long neighborhood list.
- **Newer template** (Summerlin, Boulder City): heading pattern "Capture [City]'s Essence," different CTA set ("Order Photos"/"Book Now"/"Discover My Services"), mentions DJI in addition to Matterport/Zillow/Google.

**No page contained genuinely unique per-location market data or statistics** (no price-per-sqft, no days-on-market, no HOA counts, etc.). The only location-specific facts of real value are the **named neighborhood/community lists** (e.g., Henderson: Anthem, Cadence, Lake Las Vegas, MacDonald Highlands, Seven Hills, Inspirada — real, verifiable community names), and the raw claim of "180+ Henderson neighborhoods" / "200+ Clark County" / "300+ Southern Nevada" communities served.

**Recommendation for rebuild:** Consolidate into one service-area page with a structured location/neighborhood list (using the real community names extracted), rather than maintaining near-duplicate pages per city. If SEO requires individual location pages, each should get genuinely differentiated copy (real facts about that city/neighborhood) rather than templated boilerplate.

## Testimonials/Reviews Page
- No dedicated `/testimonials/` or `/reviews/` page exists (404 confirmed).
- No testimonials appeared embedded in any of the 8 fetched pages either, including the About page.
- **Not found — do not fabricate testimonial content for rebuild.**

## Blog/News Page
- No distinct blog index/landing page confirmed; posts live at `/blog/{slug}/`.
- 37 posts found via post-sitemap.xml, spanning 2016–2026. Full inventory in blog-inventory.md.
- 5 posts have opaque numeric slugs (3731, 3736, 3741, 3734, 3737) whose actual titles were not determined — would require individual fetches.
- Categories not available from sitemap data.

## Privacy Policy / Terms of Service
- `/privacy-policy/` → HTTP 404 Not Found
- `/terms-of-service/` → HTTP 404 Not Found
- **Neither page exists on the real, current live site.** If the redesign repo (in `handoff/` or elsewhere) already has Privacy/Terms content, that content is NOT sourced from the live site and should be flagged as either newly authored or carried over from an older version — verify separately, do not assume it's "real, verified" VTLV content.

## Additional Findings Worth Noting
- About page (/about/) confirms: business established 2010 by Mike Madsen (with wife Michelle Sproul, a licensed realtor, per that page); Nevada real estate license since 2006 (consistent across About and Professional Photography pages); FAA Part 107 drone license; former sole Matterport provider for Lennar Homes and "Luxury Estates & Development"; sole photographer for Zillow Offers Program.
- Business address appearing on older-template pages: "3375 Southridge Ave, Las Vegas, NV 89121" — recommend cross-verifying this is current/correct before use.
- Full page-sitemap.xml also revealed other real service pages not part of this task's scope but relevant to future audits: /residential-real-estate-photography-services/ (+ children: matterport-las-vegas, zillow-3d-home-tour-provider, drone-photography-las-vegas, hdr-photos, virtual-staging-las-vegas, twilight-photography-and-night-shots-in-las-vegas, floor-plan-creator-las-vegas), /commercial-real-estate-photography-services/ (+ children), /vacation-rental-photography-services/, /about/vtlv-faqs/, /about/availability-calendar/, /about/book-real-estate-photography-in-las-vegas/, /customer-cabinet/, /las-vegas-360-virtual-tour-checkout/.

## No Fabrication
All facts above were extracted directly from live page fetches. No prices, stats, or testimonials were invented — where pricing was referenced but not shown, this is noted explicitly rather than guessed.
