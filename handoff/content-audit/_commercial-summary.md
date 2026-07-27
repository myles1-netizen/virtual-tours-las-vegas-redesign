# Commercial Real Estate Photography Section — Content Audit Summary

Extraction date: 2026-07-26
Method: WebFetch (HTML→markdown conversion + AI extraction), not raw HTML capture. See caveat below.

## Pages Extracted (14/14 — all reachable, none 404'd)

| # | File | Source URL |
|---|---|---|
| 1 | commercial-hub.md | /commercial-real-estate-photography-services/ |
| 2 | commercial-pricing.md | /commercial-real-estate-photography-services/commercial-photography-pricing-las-vegas/ |
| 3 | commercial-photos.md | /commercial-real-estate-photography-services/commercial-photos/ |
| 4 | commercial-floor-plans.md | /commercial-real-estate-photography-services/commercial-building-floor-plans-las-vegas/ |
| 5 | commercial-matterport-overview.md | /commercial-real-estate-photography-services/las-vegas-matterport/ |
| 6 | commercial-drone.md | /commercial-real-estate-photography-services/commercial-drone-photography-las-vegas/ |
| 7 | commercial-as-built.md | /commercial-real-estate-photography-services/as-built-survey-las-vegas/ |
| 8 | commercial-google-360-street-view.md | /commercial-real-estate-photography-services/google-my-business-360-street-view/ |
| 9 | commercial-matterport-portfolio-hub.md | /commercial-real-estate-photography-services/commercial-matterport-virtual-tour-photographer/ |
| 10 | commercial-shop.md | /commercial-real-estate-photography-services/commercial-matterport-virtual-tour-photographer/commercial/ |
| 11 | commercial-3d-construction-scanning.md | .../commercial/3d-construction-scanner-and-3d-scanning-services/ |
| 12 | commercial-bar-restaurant.md | .../commercial/3d-bar-restaurant-virtual-tours/ |
| 13 | commercial-retail-vr.md | .../commercial/examples-of-retail-stores-for-virtual-reality-retail/ |
| 14 | commercial-office-space.md | .../commercial/virtual-office-space-office-virtual-tour/ |
| 15 | commercial-google-business-listing.md | /google-business-listing-marketing-2/ (outside the commercial section URL path but required by task) |

All requested URLs from the task were fetched successfully. No pages returned errors or 404s.

## IMPORTANT METHODOLOGY CAVEAT
These extractions were produced via the WebFetch tool, which converts each page to markdown and then runs an AI summarization pass over it before returning results — it does **not** return raw, byte-exact HTML/text. This means most "verbatim" quotes in the per-page files are **near-verbatim paraphrases produced by an intermediate model**, not a guaranteed exact match to the live site's source text. I flagged this explicitly wherever a claim is legally/reputationally sensitive (Zillow, Lennar, Starbucks, Google, Matterport credential language).

**Before publishing any of this copy on the rebuilt site**, especially the third-party brand/credential claims, the exact wording should be re-verified by directly viewing the live page (browser render or view-source), not just this audit. I do not have high confidence that quoted strings in these files are character-for-character accurate — only that the underlying facts/claims are represented.

## Cross-Cutting FLAGS (see also each page's own FLAGS section)

1. **Zillow relationship** — Referenced in two places:
   - commercial-matterport-portfolio-hub.md: portfolio page lists "Zillow Offers Home Buying Program" as a past client/project.
   - commercial-shop.md: lists "Zillow Certified Professional" as a credential badge.
   These are two distinct claims (client work vs. a certification) and need separate verification. Per the task brief, the accurate framing is that Mike was a **contracted, non-employee sole photographer for the Zillow Offers listing program in Las Vegas** — not a Zillow employee and not an official Zillow-endorsed partnership. Any rebuild copy should use contractor language ("contracted photographer for Zillow's Offers program") rather than "partner," "official," or an unverified "Certified Professional" label unless Mike confirms that certification is a real, named Zillow program.

2. **Lennar Homes / Starbucks** — Named as past clients on the portfolio hub page (commercial-matterport-portfolio-hub.md). Should be framed as vendor/client work ("photographed properties for Lennar Homes," "documented remodels for Starbucks locations"), not implied partnerships, pending confirmation of the original wording.

3. **Google credentials** — "Google Trusted Photographer" and "Google Street View Trusted Photographer" appear on commercial-pricing.md and commercial-shop.md. These are legitimate individual-photographer program designations from Google (not corporate partnerships), so they're safe to keep, but copy should present them as personal certifications Mike holds, not as Google co-endorsing the business.

4. **Matterport Service Partner** — appears on commercial-shop.md; same treatment as Google credentials — legitimate individual/business program status, phrase as a credential, not a joint-venture claim.

5. **"McCarran International Airport"** (commercial-drone.md) — outdated name; airport was renamed Harry Reid International Airport in 2021. Recommend updating in the rebuild regardless of what the live site currently says.

6. **Rightmove "52% increased click-through" stat** (commercial-floor-plans.md) — third-party UK statistic of uncertain relevance/currency to a Las Vegas audience; verify source and consider whether to keep, re-source, or drop.

## Pages That Could Not Be Fetched
None. All 14 requested URLs (plus the extra google-business-listing-marketing-2 page) returned content successfully via WebFetch.
