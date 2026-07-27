# Price Calculator Spec — Pricing Page Feature

## What it is

An interactive tool on the pricing page where a visitor selects the services/add-ons they want (HDR photo tier, Matterport tier, floor plan type, drone photos, virtual staging count, rush delivery, twilight, etc.) and sees a running total update live, without submitting a form or waiting for a quote.

## Why it matters (from the real site's own positioning)

The current site's own pricing page copy emphasizes "no quote-and-wait" — real, published, transparent pricing is already the brand's stance. A live calculator is a direct extension of that positioning: instead of just reading a price table and doing mental math, the visitor builds their exact order and sees the number instantly. This is a real differentiator worth building well.

## Data source — do not duplicate/reinvent

Every input to the calculator (package prices, per-photo tiers, add-on costs) must come from the same single source of truth already established (`src/data/site.ts` — `vegasPackages`, `hdrTiers`, `hdrAddOns`, `matterportTiers`, `floorPlanTiers`, `floorPlanAddOns`, `virtualStagingTiers`, `videoTiers`, `commercialHdr`, `commercialPanoramas`, `googlePackage`). If this data moves into a CMS as part of the editing-system work, the calculator must read from whatever the CMS-managed source becomes — never hardcode a second, separately-maintained copy of prices that could drift out of sync with the pricing page's own display and become wrong/misleading.

## Functional requirements

1. **Start from a package OR build fully à la carte.** Let the visitor either pick one of the three Vegas packages as a starting point (with its included items pre-checked and priced) and add extras on top, or skip straight to building a custom combination from individual line items.
2. **Live-updating total** as selections change — no submit button needed to see the price, though a clear "Get this quote" / "Book this" CTA at the end should carry the selected total into the contact form or booking flow (pre-filled, so the visitor doesn't have to re-explain what they picked).
3. **Respect real pricing rules, not just flat addition.** Check `content-audit/` and `src/data/site.ts` for rules like: size-based surcharges (e.g. "+$50 over 3,000 sq ft"), tiered per-photo pricing (price per photo count bracket, not a flat per-photo rate), and any bundled-discount logic (e.g. does booking a package make an add-on cheaper than buying it standalone?). Getting this arithmetic wrong is a direct accuracy/legal issue per `07-LEGAL-ACCURACY-GUIDELINES.md` — the calculator's number is a real quote a customer will expect to be honored.
4. **Square footage input where relevant**, since several real prices scale with property size (HDR photo count brackets, Matterport tiers, floor plan tiers all vary by sq ft in the real pricing data) — a text/number input for square footage should drive which tier/price applies automatically rather than making the visitor figure out their own bracket.
5. **Clear breakdown, not just a total.** Show an itemized list of what's selected and its price, so the number is legible and trustworted, not a mystery total.

## Tax handling

**Do not hardcode a tax percentage without verifying the actual rule first** (see `07-LEGAL-ACCURACY-GUIDELINES.md` — Nevada generally does not tax services, but this needs to be confirmed for this specific service category before shipping any tax math). If, after verifying, tax genuinely applies to some or all of these services in Nevada:
- Use the correct current Nevada/Clark County combined rate (verify current rate — it does change) for the applicable portion only.
- Clearly label it as an estimate ("estimated tax, final invoice may vary") rather than presenting it as a guaranteed final number, since exact tax treatment can depend on invoicing specifics a calculator can't fully know.
If tax doesn't apply to these services, don't add a fake tax line just because it was requested — show the real total and note (in a tooltip or small print) that these are service fees and Nevada doesn't tax photography services, if that's confirmed accurate.

## UX/accessibility

- Must work well on mobile (this is a real usage pattern — agents/hosts checking pricing from their phone).
- Every input needs a visible label, not just a placeholder (placeholder-only inputs are inaccessible and easy to misread).
- The running total needs a clear visual hierarchy (large, obviously the "answer") distinct from the itemized breakdown.
- Should work without JavaScript as a graceful fallback at minimum showing the static price tables that already exist (progressive enhancement, not a hard requirement to block on, but don't let the calculator's existence be used as an excuse to remove the plain price tables entirely — keep both).

## Where it lives

On `/pricing/`, likely replacing or sitting alongside the existing static `PriceTable` component sections — a design decision GLM has latitude on (could be one unified interactive tool, or the existing static tables plus a separate "build your quote" calculator section — whichever reads as more professional and less cluttered).
