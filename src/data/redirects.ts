// ===== WordPress → Astro URL redirect map =====
// Single source of truth for every old WordPress permalink that had SEO value.
// Each entry becomes a real HTML redirect page under src/pages/ so that inbound
// links, bookmarks, and Google's index of the old WordPress URLs are forwarded
// to the new Astro URLs with a 0-second meta refresh (Google treats this as a
// 301 equivalent — see Google Search Central docs).
//
// `from` is the old WordPress path, written WITHOUT the base path and WITHOUT a
// leading slash so it maps cleanly to an Astro page route. Examples:
//   "residential-real-estate-photography-services/index"
//     → src/pages/residential-real-estate-photography-services/index.astro
//     → old URL /residential-real-estate-photography-services/
//
// `to` is the new path WITH a leading slash, root-relative; the Redirect layout
// runs it through asset() to add the deployment base path.
//
// To add a new redirect:
//   1. Add an entry here.
//   2. Run `npm run gen:redirects` (a script is provided; see package.json) —
//      or just create the matching .astro file by hand using Redirect.astro.

export interface RedirectEntry {
  from: string;
  to: string;
}

export const redirects: RedirectEntry[] = [
  // ----- Residential services hub + children -----
  { from: "residential-real-estate-photography-services/index", to: "/services/residential/" },
  { from: "residential-real-estate-photography-services/hdr-photos/index", to: "/services/hdr-photography/" },
  { from: "residential-real-estate-photography-services/pricing-for-real-estate-photos-matterport-360-virtual-tour-images/index", to: "/pricing/" },
  { from: "residential-real-estate-photography-services/matterport-las-vegas/index", to: "/services/3d-tours/" },
  { from: "residential-real-estate-photography-services/floor-plan-creator-las-vegas/index", to: "/services/floor-plans/" },
  { from: "residential-real-estate-photography-services/zillow-3d-home-tour-provider/index", to: "/services/3d-tours/" },
  { from: "residential-real-estate-photography-services/photo-packages-for-las-vegas-real-estate/index", to: "/services/photo-packages/" },
  { from: "residential-real-estate-photography-services/drone-photography-las-vegas/index", to: "/services/drone-photography/" },
  { from: "residential-real-estate-photography-services/virtual-stage-photos/virtual-staging-las-vegas/index", to: "/services/virtual-staging/" },
  { from: "residential-real-estate-photography-services/twilight-photography-and-night-shots-in-las-vegas/index", to: "/services/twilight-photography/" },

  // ----- Vacation rental services -----
  { from: "vacation-rental-photography-services/index", to: "/services/vacation-rentals/" },

  // ----- Commercial services hub + children -----
  { from: "commercial-real-estate-photography-services/index", to: "/services/commercial/" },
  { from: "commercial-real-estate-photography-services/commercial-photography-pricing-las-vegas/index", to: "/pricing/" },
  { from: "commercial-real-estate-photography-services/commercial-photos/index", to: "/services/commercial/" },
  { from: "commercial-real-estate-photography-services/commercial-building-floor-plans-las-vegas/index", to: "/services/floor-plans/" },
  { from: "commercial-real-estate-photography-services/las-vegas-matterport/index", to: "/services/3d-tours/" },
  { from: "commercial-real-estate-photography-services/commercial-drone-photography-las-vegas/index", to: "/services/drone-photography/" },
  { from: "commercial-real-estate-photography-services/as-built-survey-las-vegas/index", to: "/services/as-built/" },
  { from: "commercial-real-estate-photography-services/google-my-business-360-street-view/index", to: "/services/google-business-view/" },
  { from: "google-business-listing-marketing-2/index", to: "/services/google-business-view/" },

  // ----- About section -----
  // NOTE: `/about/` and `/about/navigation/` are intentionally NOT in this list.
  // Those two URLs are unchanged between the old WordPress site and the new Astro
  // site, so there is nothing to redirect — the real pages at src/pages/about.astro
  // and src/pages/about/navigation.astro already serve them directly.
  { from: "about/vtlv-faqs/index", to: "/faq/" },
  { from: "about/availability-calendar/index", to: "/about/availability/" },
  { from: "about/book-real-estate-photography-in-las-vegas/index", to: "/booking/" },
  { from: "about/privacy/index", to: "/privacy/" },
  { from: "about/terms-and-conditions/index", to: "/terms/" },

  // ----- Team -----
  { from: "michelle-sproul-virtual-tour-realtor/index", to: "/about/michelle-sproul/" },

  // ----- Locations / neighborhoods hub -----
  // The old WP site had per-city child pages (las-vegas-, henderson-, summerlin-,
  // boulder-city-, north-las-vegas-, clark-county- real-estate-photography).
  // They all collapse onto the single /neighborhoods/ page on the new site.
  { from: "real-estate-photography-southern-nevada/index", to: "/neighborhoods/" },
  { from: "real-estate-photography-southern-nevada/las-vegas-real-estate-photography/index", to: "/neighborhoods/" },
  { from: "real-estate-photography-southern-nevada/henderson-real-estate-photography/index", to: "/neighborhoods/" },
  { from: "real-estate-photography-southern-nevada/summerlin-real-estate-photography/index", to: "/neighborhoods/" },
  { from: "real-estate-photography-southern-nevada/boulder-city-real-estate-photography/index", to: "/neighborhoods/" },
  { from: "real-estate-photography-southern-nevada/north-las-vegas-real-estate-photography/index", to: "/neighborhoods/" },
  { from: "real-estate-photography-southern-nevada/clark-county-real-estate-photography/index", to: "/neighborhoods/" },

  // ----- Legacy landing pages -----
  { from: "professional-real-estate-photography/index", to: "/services/residential/" },
];
