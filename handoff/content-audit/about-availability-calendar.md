# Availability Calendar

**Source URL:** https://virtualtourslasvegas.com/about/availability-calendar/
**Page Title:** "Availability Calendar - Virtual Tours Las Vegas Real Estate Photography & 360 Tours"

## Extraction Result
WebFetch (non-JS-rendering) could not retrieve an actual calendar/booking widget. The returned content was mostly boilerplate navigation, contact info, and footer:
- Phone: 702-527-2732
- Business location: Las Vegas, NV
- External profile links: Zillow, Yelp, Cubi.casa
- Social links: LinkedIn, X, Facebook, Instagram
- Portfolio links: Flickr, YouTube
- Footer nav: FAQ, booking, contact, about, privacy, terms

## FLAGS / GAPS
**No calendar interface, date-selection fields, time slots, or booking functionality was captured.** This page's title strongly implies a live availability calendar widget (likely LatePoint or similar booking plugin) that requires JavaScript execution to render — WebFetch converts HTML to markdown and cannot execute scripts or iframes.

**ACTION NEEDED:** A real browser pass (headless or manual) is required to document this page's actual calendar functionality — this is explicitly called out in the task brief as important for replicating the booking flow. Recommend using a browser automation tool to load this URL, take a screenshot, and inspect network requests for the underlying booking API before the rebuild attempts to replicate this feature.
