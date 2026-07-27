# LatePoint Booking System — Replacement Plan for Static Astro Site

## Summary / Recommendation

**Recommended: Cal.com, embedded on the Astro site, on the free "Individual" tier (upgrade to Teams at $12/mo only if a specific gated feature turns out to be required).**

Mike is a solo photographer taking bookings for shoots (with add-ons like drone/twilight), collecting a deposit, and syncing to his own Google Calendar. Cal.com's free tier already covers nearly the entire LatePoint feature list — unlimited event types (service types), Google Calendar two-way sync, Stripe **and** PayPal payment collection at booking time, custom booking-form fields, and automated email/SMS reminders — for $0/month with no PHP backend required. It embeds into an Astro page as a simple HTML/JS snippet (`<Cal>` embed or `cal.com/embed.js`), no server code needed, so it fits a static Cloudflare Pages site with zero added infrastructure.

Calendly is a viable second choice but gates payment collection and custom questions behind its $10-16/mo Standard/Teams plans, and coupon codes are not natively supported at all. A custom Cloudflare Workers + D1 build is realistic from an engineering standpoint but is a real ongoing-maintenance product (calendar sync, payment webhooks, reminder scheduling, timezone handling) that isn't justified for a single-operator photography business — it trades a predictable $0-144/year SaaS cost for open-ended developer time.

For payments: **use Stripe, not PayPal**, as the primary processor. Cal.com's Stripe integration is first-class (native OAuth connect, deposit/full-payment support, refunds), while LatePoint's PayPal addon capability (PayPal Checkout / Smart Buttons) is replicated fine by Cal.com's PayPal integration too if Mike wants to keep offering PayPal — Cal.com supports both simultaneously on the free tier, so there's no need to drop PayPal as a customer-facing option, just don't build custom PayPal integration work — let Cal.com handle it.

**Net cost change vs. current LatePoint stack:** LatePoint + all addons is currently a one-time/annual WordPress license (~$79-149/yr). Cal.com free tier replaces it at $0/yr with equal or better functionality, assuming Mike doesn't need multi-agent team scheduling (he's solo, so he doesn't).

---

## LatePoint Feature Inventory (what's actually in use)

Based on the plugin list, LatePoint is being used for:

| Capability | LatePoint mechanism |
|---|---|
| Appointment/service types | Core: define bookable services (e.g., "Standard Photo Package," "Twilight Shoot"), each with duration/price |
| Availability & calendar management | Core: agent (Mike's) working hours, blocked dates, buffer times |
| Google Calendar sync | Addon: two-way sync so bookings appear on Mike's personal Google Calendar and existing events block availability |
| Deposits/payments | Addon: PayPal integration collects deposit or full payment at time of booking |
| Add-on services | Addon "Service Extras": customer can add drone photos, twilight shoot, extra editing, etc. on top of the base service, each with its own price/duration impact |
| Coupon codes | Addon: discount codes applied at checkout |
| Custom intake fields | Addon: extra form fields during booking (e.g., property address, MLS number, square footage, gate code) |
| Automated reminders | Addon: email/SMS reminders sent before the appointment to reduce no-shows |
| General pro-tier features | Addon "Pro Features": bundles capabilities like recurring bookings, multi-agent support, taxes, locations — largely not relevant to a solo photographer |

Since v5, LatePoint bundles all addons into every paid tier (no per-addon purchase) — pricing is purely per-site-count: Starter $79/yr (1 site), Scale $149/yr (5 sites), Agency $299/yr (100 sites), or equivalent lifetime licenses ($199/$399/$599). Source: [latepoint.com/pricing](https://latepoint.com/pricing/).

---

## Option 1: Cal.com

**What it is:** Open-source scheduling platform (self-hostable or hosted SaaS at cal.com), embeddable via a JS snippet or React "Atoms" components.

**Pricing (current, hosted cal.com):**
- **Free (Individual):** $0/mo forever, 1 user, unlimited event types & calendars, email + SMS notifications, 100+ app integrations, Stripe **and** PayPal payments, Google/Outlook/iCloud calendar sync, browser extension, mobile app.
- **Teams:** $12/user/mo (25% off annual) — adds round-robin/collective scheduling, recurring events, branding removal, routing forms, booking analytics, custom API access. Not needed for a solo operator unless Mike wants a second photographer/assistant bookable later.
- **Organizations:** $28/user/mo — SSO, sub-teams, compliance — irrelevant here.
- Source: [cal.com/pricing](https://cal.com/pricing)

**Feature parity vs. LatePoint list:**
- Appointment types → yes, unlimited event types on free tier, each with its own duration/price/description.
- Availability/calendar management → yes, native scheduling rules plus real two-way Google Calendar sync (busy times block new bookings; new bookings write to Google Calendar) — free tier.
- Deposits/payments → yes, Stripe integration lets you require full or partial payment at booking; PayPal also supported — free tier.
- Add-on services → partially native. Cal.com doesn't have a dedicated "service extras / add-ons with own pricing" UI comparable to LatePoint's addon system out of the box; the practical approach is to create each add-on combination as its own event type (e.g., "Standard Shoot," "Standard Shoot + Drone," "Standard Shoot + Twilight") or use Cal.com's booking-question "select with price" pattern via a routing form / custom field workaround. This is the one area with a real gap — see Implementation Notes.
- Coupon codes → not a native built-in feature on Cal.com. Workarounds: Stripe Checkout (which Cal.com can route payments through) supports promotion codes natively, so coupons can be handled at the Stripe payment step rather than in Cal.com itself.
- Custom intake fields → yes, fully supported ("Booking Questions" — text, number, phone, address, checkbox, dropdown), free tier.
- Automated reminders → yes, workflow automation (email/SMS reminders before/after appointment) included even on the free tier.

**Integration effort into Astro + Cloudflare Pages:** Low. Cal.com provides an official embed (`@calcom/embed-react` or a plain `<script>` snippet) that renders an inline calendar or a popup button — purely client-side JS, no backend needed, works fine as a static island in an Astro page. Typical effort: half a day including styling to match the site.

---

## Option 2: Calendly

**Pricing (current):**
- **Free:** $0, 1 event type, basic scheduling, no payment collection, no custom questions beyond basic ones.
- **Standard:** $10/user/mo (annual) — unlimited event types, calendar connections.
- **Teams:** $16/user/mo (annual) — round robin, admin features.
- **Payment collection (Stripe/PayPal) requires Professional tier and up** (~$12+/mo depending on current tier naming — Calendly has renamed tiers before, verify at checkout).
- Source: [cal.com/blog/calendly-pricing](https://cal.com/blog/calendly-pricing), [talkspresso.com Calendly pricing 2026](https://talkspresso.com/blog/how-much-does-calendly-cost-2026)

**Feature parity vs. LatePoint list:**
- Appointment types → yes, on paid tiers (free tier limited to 1 event type, insufficient here).
- Availability/calendar management → yes, native Google Calendar sync on all tiers.
- Deposits/payments → yes via Stripe, but gated behind a paid tier (~$10-16/mo).
- Add-on services → no native concept of add-on services with their own pricing; same event-type-per-combination workaround as Cal.com, but Calendly's custom-question pricing logic is weaker.
- Coupon codes → not supported natively at all. No workaround short of a separate Stripe Checkout link with promo codes, which breaks the seamless one-flow booking experience.
- Custom intake fields → yes, "custom questions" available on paid tiers.
- Automated reminders → yes, included in paid tiers.

**Integration effort:** Same as Cal.com — official embeddable widget, script-tag or React component, no backend needed.

**Why not recommended over Cal.com:** Strictly worse feature-for-cost here — Cal.com replicates more of the LatePoint list for $0 than Calendly does for $120-192/yr, and Calendly still lacks coupon support outright.

---

## Option 3: Custom build on Cloudflare Workers + D1

**What it would involve:**
- A Worker (or Astro API routes deployed to Cloudflare Pages Functions) handling: availability computation, booking creation, coupon validation, custom field storage.
- D1 (SQLite) for services, bookings, coupons, availability blocks.
- Google Calendar API integration (OAuth token refresh, event creation) for two-way sync — nontrivial to get right (conflict detection, timezone edge cases, token expiry handling).
- Stripe Payment Intents / Checkout Sessions for deposits, with a webhook handler (Worker) to confirm payment and finalize the booking.
- Email/SMS reminders via a scheduled Worker (Cron Trigger) checking upcoming bookings and calling an email API (e.g., Cloudflare Email Routing doesn't send outbound email for transactional use — would need Resend, Postmark, or similar; SMS would need Twilio).
- Frontend booking calendar UI built by hand in Astro/React, replicating the LatePoint step-by-step flow.

**Cost:** $0 in platform fees (Workers/D1 free tier is generous for this traffic volume) + Stripe's standard transaction fee + a third-party email/SMS API (Resend free tier covers low volume; Twilio SMS is pay-per-message).

**Feasibility assessment:** Technically very doable on Cloudflare's stack (Workers + D1 + Cron Triggers cover every technical requirement), but it is a genuine multi-week build-and-maintain product: calendar sync correctness, payment webhook reliability, timezone bugs, and no-show reminder timing are exactly the kind of long-tail edge cases that make booking systems hard, and it all becomes Mike's (or a future developer's) ongoing responsibility with zero community support to lean on. For a one-photographer business, this only makes sense if there's a hard requirement Cal.com/Calendly can't meet (there isn't one here) or a strong aversion to any third-party dependency. Not recommended as the primary path, but flagged as viable if requirements change.

---

## Payments: Stripe vs. PayPal

- **Stripe** is the better foundation for a Cloudflare-based/modern stack generally — better developer APIs, native support in both Cal.com and Calendly, supports Apple Pay/Google Pay at checkout automatically, and has first-class Checkout Session promo-code support if coupons end up being handled at the payment layer.
- **PayPal** does have a modern embeddable "PayPal Checkout" JS SDK (smart buttons) that works fine in a static site, and Cal.com supports it natively alongside Stripe on the free tier — so there's no need to force customers off PayPal if some prefer it. Recommendation: **enable both Stripe and PayPal in Cal.com** (both are free-tier features), defaulting the UI to Stripe, since it's the more full-featured integration for deposits/refunds and coupon codes.

---

## Implementation Notes (Cal.com path)

1. **Account setup:** Create a Cal.com account for Mike (virtualtourslasvegas@gmail.com), connect Google Calendar for two-way sync, connect Stripe account and (optionally) PayPal.
2. **Event types = services:** Model each current LatePoint "service" as a Cal.com event type (e.g., "Standard Real Estate Shoot," "Luxury Listing Package"). For each meaningful add-on combination Mike actually offers (e.g., "+ Drone," "+ Twilight"), either:
   - Create separate event types per common combination (simplest, most reliable pricing display), or
   - Use one event type with a "select"-style custom booking question, and adjust the final price manually/via a follow-up invoice for uncommon combinations — a real limitation versus LatePoint's dynamic add-on pricing.
   Given the size of the business, separate event types per common package (a handful, not hundreds) is the pragmatic choice and will read even the current WordPress site's service list to be sure counts are manageable.
3. **Coupons:** Configure discount/promotion codes inside the connected Stripe account's Checkout settings rather than in Cal.com itself; Stripe applies them at the payment step of the booking flow.
4. **Custom fields:** Recreate LatePoint's intake fields (property address, access instructions, etc.) as Cal.com "Booking Questions" on each event type.
5. **Reminders:** Enable Cal.com's built-in workflow automation for email reminders (and SMS if desired — check current SMS credit/pricing on the free tier, as SMS sending may consume a small usage allowance or require a connected Twilio account on some plans).
6. **Embedding in Astro:** Use the official `@calcom/embed-react` package or the vanilla embed snippet from Cal.com's embed generator, placed as a client-side island (`client:load` in Astro) on the booking page. No Cloudflare Pages Functions or server code required — this stays a pure static deployment.
7. **Fallback/verification:** Before cutover, book a real test appointment end-to-end (including a live Stripe test payment) to confirm the Google Calendar event appears correctly and the reminder fires.
