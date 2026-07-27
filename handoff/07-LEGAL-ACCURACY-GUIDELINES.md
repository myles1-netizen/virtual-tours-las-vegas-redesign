# Legal & Accuracy Guidelines — Hard Requirements

The client was explicit: **no misleading claims, no legal exposure, especially around third-party brand relationships.** This is not a style note — treat it as a hard content-review gate before anything ships.

## The core issue: contractor vs. endorsement

Mike does real, legitimate work for/with well-known programs and brands, but the relationship is almost always **"I was the photographer/vendor used by X program,"** not **"X company employs me / endorses me / partners with me."** These are legally and factually different claims, and blurring them is exactly the kind of thing that creates real risk (implying a sponsorship or partnership that doesn't exist, potential trademark/endorsement issues).

### Specific cases to get right

- **Zillow Offers:** Mike was **the sole photographer used for the Zillow Offers listing program in Las Vegas** (a now-discontinued Zillow iBuying program). This means he was a hired/contracted vendor for that program in that market — it does **not** mean Zillow (the company) endorses him, employs him, or has an ongoing relationship with him now that the program is discontinued. Check the real site's exact wording (see `content-audit/`) and match that framing — don't upgrade it to anything stronger like "Zillow's photographer" or "trusted by Zillow" without the "for the Offers program" qualifier, and consider noting the program is no longer active if that's factually the case (verify current status).
- **Lennar Homes:** Mike is described as the **sole Matterport provider for Lennar Homes** — again, a vendor relationship (he's who Lennar hired to do this specific work), not corporate endorsement of VTLV as a business. Keep the framing as "provider for," not "partnered with" or "endorsed by."
- **Google Trusted Photographer:** This is an actual, real, formal Google program/certification with defined criteria — this one CAN be stated more directly since it's a legitimate credential (if he's actually certified — verify), but still shouldn't be inflated beyond what the certification actually confers.
- **FAA Part 107:** This is a real, verifiable federal certification (Remote Pilot Certificate) — state it plainly and accurately, this one's straightforward.
- **Any client logos shown (Berkshire Hathaway, CBRE, Cushman & Wakefield, Sotheby's, EXP Realty, Chick-fil-A, Starbucks, etc.):** These should only be shown if Mike has actually done real, verifiable work for them (check the content audit for how the real site describes these relationships). Displaying a well-known company's logo implies "I worked for/with this company" — make sure that's true and not just "I'd like to work with them" aspirational branding. If the current site shows a logo without a specific verifiable claim of work done, flag it for confirmation with Mike directly rather than assuming.

## General rule for the content rewrite

When rewriting any page for tone/clarity (per the "sound like Mike" requirement), **rephrasing must never strengthen a factual claim.** It's fine to make copy punchier, more direct, more first-person — it is not fine to let a rewrite accidentally upgrade "provided services for" into "partnered with," or "worked on X program" into "endorsed by X."

**Process:** for every page being rewritten, do a specific pass afterward checking: did the rewrite change what relationship is being claimed with any third party? If yes, revert to language that matches the real site's actual framing (see `content-audit/` for exact original wording) even if it's less punchy.

## Reviews/testimonials

- Testimonials must be reproduced **verbatim** — same wording, same name, same context. Do not paraphrase, "improve," shorten, or combine testimonials. If a testimonial needs to be shortened for space, use `...` truncation of the actual text, not a rewritten summary, and ideally link to the full quote.
- Only use testimonials that are genuinely from the real site/real clients (already verified once — see `src/data/site.ts` for the three currently in use, cross-check against `content-audit/` for any additional ones found on the real site that should be added).

## Pricing accuracy

- Every price, package inclusion, and add-on cost must match the real, currently-published pricing (see `content-audit/` for what's actually on the live pricing pages — prices may have changed since the last audit, so re-verify against the live site now, not just against the existing `src/data/site.ts`).
- If a price calculator feature is built (see `08-PRICE-CALCULATOR-SPEC.md`), it must use these exact, current numbers — a calculator that quotes a wrong price is a direct, concrete way to create a real business/legal problem (a customer expecting a price that isn't honored).

## Important caveat on the content-audit extraction itself

The pages in `content-audit/` were extracted using an AI-summarization fetch tool, which means quoted text in those files is **near-verbatim, not guaranteed byte-exact.** This is fine for understanding what a page says and for pricing/structure, but for anything legally sensitive — the exact wording of a third-party brand claim (Zillow, Lennar, Google, Starbucks, etc.), or exact testimonial text — **re-verify the precise original wording directly against the live page** (view page source or render it in a real browser) before finalizing copy, rather than trusting the extraction as byte-perfect. The content-audit files already flag which claims need this extra verification pass — treat those flags as required, not optional, checks.

## Real accuracy catches already found during the audit (verify and fix regardless of source wording)

- The current site's drone page references **"McCarran International Airport"** — this airport was renamed **Harry Reid International Airport** in 2021. Use the current name.
- The commercial floor-plans page includes a real legal disclaimer: **"I am not a Surveyor and I do not make Blueprints."** Preserve this verbatim wherever floor-plan services are described — removing it could create real liability exposure (floor plans are schematics/estimates, not certified surveys).
- Two Zillow-related claims exist on the current site: (1) "Zillow Offers Home Buying Program" listed as past client/program work, and (2) "Zillow Certified Professional" listed as a credential badge. Both need their exact current wording confirmed and should be framed as an individual contractor credential/past program work, never as "official Zillow partner" or similar.
- Lennar Homes and Starbucks are named as past clients on the real site's portfolio page — confirmed real work relationships, frame as vendor/client work (photographer hired by), not corporate partnerships.

## More findings from the content audit (all need direct verification before use)

- **The real site does NOT have a Privacy Policy or Terms of Service page** (both 404 on the live site). This means the `privacy.astro` and `terms.astro` pages already in this repo were drafted/templated, not sourced from real site content — that's fine to keep (every business should have these), but don't treat them as "verified real content" the way the rest of `src/data/site.ts` is. Have a human (ideally with legal input, even lightweight) review them before this ships for real, since they were originated rather than sourced.
- **A stale business address may exist on the current site**: `3375 Southridge Ave, Las Vegas, NV 89121` appears on older-template pages. Confirm this is still accurate (or still relevant — it may be a mailing address rather than a public storefront, which is normal for a mobile photography business) before using it anywhere new.
- **A "REALTOR®" mention was found** on one of the location pages, in a context that wasn't fully captured — "REALTOR®" is a registered trademark specifically meaning active membership in the National Association of Realtors, which is a different (and more specific) claim than "licensed real estate agent." Confirm whether Mike currently holds active NAR/REALTOR® membership before using that exact term anywhere; if he's licensed but not an active NAR member, use "licensed real estate agent" instead, not "REALTOR®."
- **Stronger-than-contractor phrasing found on the real About page**: "sole Matterport provider for new home builders like Lennar Homes," a second "sole Matterport provider" claim for an unnamed "Luxury Estates & Development" entity, "Sole Photographer" for the Zillow Offers Program, and a "Zillow Authorized Photographer" badge. These were captured via AI-paraphrased extraction (see caveat above), so **get the exact original wording confirmed** before reuse — "authorized photographer" in particular reads closer to an implied formal authorization from Zillow than a "photographer used by the program" framing, and needs care.
- **Michelle Sproul** (Mike's wife) is described on the real site as "a partner of Virtual Tours Las Vegas" — a business-partner framing, not explicitly stated as "wife" in that page's copy (that fact is already independently known/verified from other research this session, not from this particular page). If both are true, decide deliberately how to frame it (business partner vs. spouse vs. both) rather than defaulting to whichever the source page happened to say.
- **The booking/checkout flow (LatePoint) is JavaScript-rendered** and couldn't be captured by the static-fetch extraction — a real browser-based pass (not just WebFetch) is needed to actually document what fields/steps/options the current booking wizard has, before building its replacement (see `plugin-research/latepoint-booking-system.md` for the replacement recommendation, and `content-audit/booking-checkout-360-virtual-tour.md` for what was and wasn't captured).
- **No testimonials page exists** on the live site, and none were found embedded elsewhere during this pass — the three testimonials already verified in `src/data/site.ts` remain the known-real set; don't assume more exist without finding them.

## RESOLVED — confirmed directly by the client, use these as ground truth

The contradictions below were found in the content audit and have since been confirmed directly. Use these resolutions, don't re-litigate them:

1. **Sole proprietor vs. co-founder — resolved: both are true, frame accordingly.** Michelle Sproul is confirmed to be **Mike's wife**, and she is a real, licensed Realtor who co-founded the business with him. The correct framing is: **co-founded with his wife Michelle Sproul, and Mike is the one who shoots/runs every job himself day-to-day.** This is NOT a contradiction to hide — it's a real, warm fact (family business, run solo in practice) that can be stated plainly, e.g. "co-founded with my wife Michelle, a licensed Realtor — I'm the one behind the camera on every shoot." Update `11-VOICE-AND-TONE.md`'s "never say we" guidance to allow "we started this together" specifically when referring to the founding/history of the business, while keeping "I" for anything about day-to-day work, service delivery, and shooting (since that part genuinely is Mike alone).
2. **Zillow Offers relationship — resolved: this is entirely a past relationship, always use past tense.** Confirmed: Mike **used to work with** the Zillow Offers program — it's historical, not ongoing (consistent with the program itself having ended in November 2021). Use consistent past-tense phrasing everywhere: "was the sole photographer for the Zillow Offers program in Las Vegas" / "I used to work with Zillow Offers" — never present tense ("I am," "I work with"), and never anything implying an ongoing relationship or current endorsement.
3. **Zillow 3D Home Tours count and other pricing discrepancies — resolved: verify directly against the live site, don't guess or average.** Direct re-verification against the live site (2026) confirmed:
   - Zillow 3D Home Tours: **"over 1,500"** is the current, correct figure (verified verbatim on the live Zillow 3D Home Tour page). The "750+" figure found elsewhere is stale/outdated — don't use it.
   - Glitz & Glam package: **$200, for homes under 3,000 sq ft, +$50 for homes 3,000–5,000 sq ft** (also gets 20 panoramas instead of 15 above the cutoff) — this matches what's already in `src/data/site.ts`, no change needed there.
   - Matterport additional hosting: **$72 for an additional 6 months (1–99 scan points)** — confirmed verbatim on the live site. Note: `src/data/site.ts` and `src/pages/services/3d-tours.astro` in the existing rebuild previously said "$10/month" for this, which was wrong — **already corrected** to $72/6 months as of this pass.
   - Matterport camera resolution: **33.6 megapixel** confirmed verbatim on the live site — the "134MP" figure found elsewhere was wrong, don't use it.
   - The "91-90 Photos" pricing-tier label found during the audit is confirmed to be a typo/OCR artifact from extraction, not real content — ignore it.

**Process note for whoever continues this:** this is the model to follow for the rest of the flagged items in `content-audit/` — when a discrepancy or ambiguous claim is found, the fix is to go **directly to the live site** (or ask Mike, for anything not published) and get the one real answer, not to guess, average, or pick whichever version sounds better.

## Nevada sales tax note

Nevada does **not** generally apply sales tax to services (photography services are typically not taxable in Nevada, though tangible goods like printed materials could be — verify current Nevada Department of Taxation guidance before adding any tax calculation to the price calculator; do not guess a tax rate or assume tax applies without confirming the actual rule for this specific service category).
