# Residential Real Estate Photography Services — Audit Summary

All pages were fetched via an AI-summarizing WebFetch tool (HTML converted to markdown then summarized), NOT a raw literal HTML diff. Every file below has been marked with FLAGS where wording, numbers, or claims should be re-verified against the live page character-by-character before going into the rebuild — this is especially critical for prices and any Zillow-relationship claims.

## Pages Fetched Successfully (21 total: 20 from the task list + 1 discovered link)

| # | Page | File | Status |
|---|---|---|---|
| 1 | Index — Residential Real Estate Photography Services | residential-index.md | OK |
| 2 | HDR Photos | residential-hdr-photos.md | OK |
| 3 | Pricing for Real Estate Photos / Matterport / 360 | residential-pricing.md | OK |
| 4 | VR Add-On (Virtual Reality Glasses) | residential-vr-addon.md | OK |
| 5 | Matterport Las Vegas | residential-matterport-las-vegas.md | OK |
| 6 | Matterport Services Near Me — Portfolio | residential-matterport-portfolio.md | OK |
| 7 | Matterport Apartment Virtual Tour | residential-matterport-apartment.md | OK |
| 8 | Floor Plan Creator Las Vegas | residential-floor-plan-creator.md | OK |
| 9 | Zillow 3D Home Tour Provider | residential-zillow-3d-home-tour-provider.md | OK |
| 10 | Zillow Walk Through Video Provider (sub-page) | residential-zillow-walkthrough-video.md | OK |
| 11 | Photo Packages for Las Vegas Real Estate — Index | residential-photo-packages-index.md | OK |
| 12 | Neon Skyline Drone Photo Package | residential-neon-skyline-package.md | OK |
| 13 | Real Estate Photo Package (Glitz & Glam) | residential-glitz-glam-package.md | OK |
| 14 | Matterport Photos Package (City Never Sleeps) | residential-matterport-package.md | OK |
| 15 | Drone Photography Las Vegas | residential-drone-photography.md | OK |
| 16 | Virtual Staging Las Vegas | residential-virtual-staging-las-vegas.md | OK |
| 17 | Virtual Staging Real Estate | residential-virtual-staging-real-estate.md | OK |
| 18 | Twilight Photography and Night Shots | residential-twilight-photography.md | OK |
| 19 | Seller Listing Agents in Las Vegas — Zillow 3D | residential-seller-listing-agents.md | OK |
| 20 | Real Estate Photography HDR Tour 360 (sub-page) | residential-hdr-tour-360.md | OK |
| 21 | 3D Virtual Tour Portfolio in Las Vegas (discovered link, not in original task list) | residential-3d-tour-portfolio.md | OK — possible duplicate of #6, see its FLAGS |

## Pages That Could Not Be Fetched / Errors
None. Every URL in the task's list, plus the one additional discovered portfolio link, returned content successfully — no 404s or fetch errors were encountered.

## Cross-Page Discrepancies Found (need resolution with Mike before rebuild)

1. **Zillow 3D Home Tours total count conflict**: "over 1,500...since its inception in August 2018" (Seller Listing Agents page) vs. "750+ published since August 2018" (HDR Tour 360 sub-page) vs. "I have shot over 1,500 Zillow 3D Home Tours" (Zillow 3D Home Tour Provider page, no date given). Three different figures for what should be one running total.

2. **Zillow Certified Photographer status — tense conflict**: The Seller Listing Agents page contains BOTH "former Zillow Certified Photographer" and, elsewhere on the same page, "I am a Zillow Certified Photographer" (present tense). This is the single highest-priority item to resolve — confirm with Mike whether this status is currently active.

3. **"Zillow Offers Program" role phrasing** varies across pages:
   - HDR Photos page: "Sole Photographer shooting HDR photos, Zillow 3D Tours, Floor Plans and Video Walk Throughs for the Zillow Offers Program"
   - Zillow 3D Home Tour Provider page: "Former Zillow Offers Photographer Henderson & Las Vegas"
   - Seller Listing Agents page: "former Zillow Certified Photographer being the Only Photographer in Southern Nevada to shoot for the Zillow Offers Program"
   All three describe the same underlying fact (a past contractor role on Zillow's now-discontinued Zillow Offers/iBuying program, which ended Nov 2021) but with different scope/exclusivity language. Needs one settled, verbatim-confirmed phrasing for the rebuild that (a) uses past tense consistently, and (b) never implies Zillow-the-company endorses or partners with VTLV.

4. **Zillow stat claims vary and may not be comparable**: "32% more saved by buyers," "22% more likely to sell within 30 days," "29% more views" (Zillow 3D Home Tour Provider page) vs. "300% more likely to view your listing" (Seller Listing Agents page) vs. "87% more views" (Index page, attributed to Realtor.com, not Zillow). These may be legitimately different metrics from different sources, but should each be individually sourced/verified rather than mixed together.

5. **Glitz & Glam package square-footage cutoff**: "$200, under 3,000 sq ft" (main Pricing page and its own package sub-page) vs. "$200, under 2,500 sq ft" ("Glitz & Glamour Arrangement" name on the Zillow 3D Home Tour Provider page).

6. **Matterport additional-hosting add-on price**: "+$72" (main Pricing page) vs. "$50" (Matterport Photos Package sub-page) for essentially the same "extra 6 months of hosting" add-on.

7. **A la carte photo-count pricing tier labeled "91-90 Photos" for $237** on the main Pricing page — almost certainly a transcription artifact from the extraction tool; the actual live-page range needs direct verification.

8. **Matterport camera resolution**: "134 Megapixel Resolution" (Matterport Las Vegas page) vs. "33.6 megapixel HDR 360 imagery" (main Pricing page) for what appears to be the same Matterport Premier 360 product.

9. **Drone flyable-airspace percentage**: "~20% of the valley available for flights" (Drone Photography page) vs. "~75% of valley homes affected by restriction" i.e. ~25% flyable (HDR Tour 360 sub-page) — close but not identical, verify exact wording/figures on both.

10. **Business founding claim — potential major discrepancy**: The Zillow Walk Through Video sub-page states "The business was founded by real estate agents Michael Madsen and Michelle Sproul." This conflicts with the sole-proprietor framing given for this project (Mike works solo, first-person "I"). This needs to be resolved directly with Mike — do not carry it into the rebuild silently in either direction (don't drop it if true, don't keep it if outdated/incorrect).

11. **Possible duplicate portfolio pages**: matterport-services-near-me-in-las-vegas-portfolio/ and 3d-virtual-tour-portfolio-in-las-vegas-matterport-360/ returned the same page title and near-identical content. Verify on the live site whether these are duplicate/aliased URLs, a redirect, or genuinely separate pages.

## General Notes / Caveats
- All content was extracted via an AI summarization pass over each page's rendered HTML, not a raw byte-for-byte capture. Every "verify exact wording" flag in the individual page files should be treated as a required step — especially for anything price-related, credential-related (Zillow/Matterport/Google certifications), or claim-related — before it is used verbatim in the rebuild.
- No content was invented. Every fact, price, and quote captured here traces back to what the fetch tool reported finding on the live page; discrepancies between pages are reported as discrepancies, not resolved by guessing which is correct.
- Embedded Matterport tour iframes/widgets were referenced by the extraction tool (by property address) but the actual embed code/iframe markup was not captured by this text-based method — a direct browser/DOM check of key pages (Matterport Las Vegas, both portfolio pages) is recommended before rebuild if the exact embed implementation is needed.
