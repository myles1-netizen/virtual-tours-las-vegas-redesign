# Las Vegas 360 Virtual Tour Checkout (LatePoint booking page)

**Source URL:** https://virtualtourslasvegas.com/las-vegas-360-virtual-tour-checkout/
**Page Title:** "Las Vegas 360 Virtual Tour Checkout"

## Extraction Result — IMPORTANT LIMITATION
WebFetch (non-JS HTML→markdown conversion) was **unable to render the actual booking/checkout widget**. This is almost certainly a LatePoint (or similar) booking plugin that builds its UI via JavaScript/AJAX after page load, which a static-HTML fetch tool cannot execute. What WAS captured is boilerplate page chrome only:

- Contact: phone (702) 527-2732, email
- Service categories referenced (not interactive in this extraction): Residential real estate photography, Vacation rental services, Commercial photography, Google Business profiles
- Photographer identified as "Michael Madsen," sole proprietor
- Social/portfolio links: Zillow, Yelp, Instagram, YouTube, Flickr, LinkedIn

## What is NOT captured (and needs a real browser pass)
- Interactive service-selection dropdowns/steps
- Date/time picker
- Form fields (name, email, phone, address, etc.)
- Itemized per-service pricing
- Add-on options
- Payment method options
- Multi-step wizard stages
- Confirmation screen text

## FLAGS
No endorsement-language flags found in the captured boilerplate. "Michael Madsen, sole proprietor" language is actually GOOD/accurate per the task's legal constraint — worth preserving that framing in the rebuild.

## ACTION NEEDED (high priority)
The task explicitly calls out needing to replicate this booking flow's functionality. A static fetch cannot do this. **Recommend a follow-up pass using a real browser (Playwright/Puppeteer/manual) to:**
1. Load the page and screenshot each step of the booking wizard
2. Inspect network requests to see the booking plugin's API calls (confirms if it's LatePoint)
3. Document every field, dropdown option, price shown, and step transition

This was outside the capability of the tools used in this pass (WebFetch only) — flagging rather than fabricating the flow.
