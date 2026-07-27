// ===== Per-page SEO catalog (read-only source of truth for the /admin SEO view) =====
// Mirrors the `title` / `description` each Astro page actually renders with, so
// the admin "SEO" panel can show Mike exactly what Google sees for every page
// without him needing to open dev tools. This is the static-site equivalent of
// the Yoast SEO "meta overview" admin screen.
//
// KEEP IN SYNC with the page frontmatter when a page's title/description changes
// — the values below should match the literals in src/pages/*.astro verbatim.
// (A future improvement: generate this automatically by crawling the built site
// or reading the page modules, but a hand-maintained table is simplest today.)

export interface SeoEntry {
  /** Logical path (no base path, root-relative). */
  path: string;
  title: string;
  description: string;
  /** Which JSON-LD types the page emits (beyond the site-wide LocalBusiness). */
  schema?: string[];
  /** true if the page sets noindex (admin, 404, etc.) */
  noindex?: boolean;
}

export const seoCatalog: SeoEntry[] = [
  {
    path: "/",
    title: "Virtual Tours Las Vegas — Real Estate Photographer Mike Madsen",
    description:
      "Las Vegas real estate photographer Mike Madsen — HDR photos, Matterport 3D tours, drone, floor plans & virtual staging. Serving Las Vegas, Henderson & Summerlin. Book online.",
    schema: ["LocalBusiness", "ProfessionalService", "Photographer"],
  },
  {
    path: "/services/",
    title: "Real Estate Photography Services — Las Vegas | Virtual Tours Las Vegas",
    description:
      "Residential, commercial & vacation-rental photography in Las Vegas: HDR photos, Matterport 3D tours, drone, floor plans, virtual staging, twilight shots and Google Business View.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/residential/",
    title: "Residential Real Estate Photography Las Vegas — HDR, 3D & Drone | VTLV",
    description:
      "Complete residential listing packages in Las Vegas: HDR photography, Matterport 3D tours, Zillow 3D Home, drone, floor plans, virtual staging and twilight shots. 24–48 hr turnaround.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/hdr-photography/",
    title: "HDR Real Estate Photography Las Vegas | VTLV",
    description:
      "HDR real estate photography in Las Vegas — multiple-exposure blending for bright, accurate interior and exterior listing photos. MLS-ready, delivered in 24–48 hours.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/3d-tours/",
    title: "Matterport & Zillow 3D Virtual Tours Las Vegas | VTLV",
    description:
      "Matterport 3D virtual tours and Zillow 3D Home walkthroughs for Las Vegas real estate listings. Immersive, dollhouse views that increase showings and time-on-page.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/drone-photography/",
    title: "Drone Photography Las Vegas — FAA Part 107 Aerial | VTLV",
    description:
      "FAA Part 107 certified drone photography in Las Vegas — aerial photos and video for real estate listings, land, and commercial property. Legal, insured, MLS-ready.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/floor-plans/",
    title: "Floor Plans Las Vegas — Schematic, 3D & CAD | VTLV",
    description:
      "Accurate 2D, 3D and CAD floor plans for Las Vegas real estate listings. Generated from Matterport scans for precise measurements. Delivered as PNG, PDF and SVG.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/virtual-staging/",
    title: "Virtual Staging Las Vegas — Empty Rooms Furnished | VTLV",
    description:
      "Virtual staging for empty Las Vegas listings — photorealistic furniture, décor and art added to your HDR photos. Multiple style options, unlimited revisions per room.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/twilight-photography/",
    title: "Twilight Photography Las Vegas — Blue Hour Listing Shots | VTLV",
    description:
      "Twilight and blue-hour real estate photography in Las Vegas — warm-lit exteriors and glowing windows that make listings stand out in the MLS and on Zillow.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/commercial/",
    title: "Commercial Real Estate Photography Las Vegas — Office, Retail, Industrial | VTLV",
    description:
      "Commercial real estate photography in Las Vegas — offices, retail, industrial, hospitality and restaurants. HDR photos, Matterport, drone, as-built and floor plans.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/vacation-rentals/",
    title: "Vacation Rental Photography Las Vegas — Airbnb & Vrbo | VTLV",
    description:
      "Vacation rental photography in Las Vegas for Airbnb and Vrbo hosts — bright HDR photos, 3D tours and floor plans that boost booking conversion and nightly rates.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/google-business-view/",
    title: "Google Business View & Street View 360 Las Vegas | VTLV",
    description:
      "Google Business View (Street View Trusted) 360° virtual tours for Las Vegas businesses — published to Google Maps and Search. Drive foot traffic and discovery.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/as-built/",
    title: "As-Built Surveys & Construction Documentation Las Vegas | VTLV",
    description:
      "As-built surveys and construction documentation in Las Vegas — measured drawings, progress photography, and Matterport reality capture for architects and builders.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/services/photo-packages/",
    title: "Photo Packages for Las Vegas Real Estate | VTLV",
    description:
      "Compare Las Vegas real estate photo packages — from single HDR shoots to full Matterport + drone + floor plan bundles. Transparent pricing, no hidden fees.",
    schema: ["Service", "BreadcrumbList"],
  },
  {
    path: "/pricing/",
    title: "Pricing — Las Vegas Real Estate Photography Packages | VTLV",
    description:
      "Transparent Las Vegas real estate photography pricing. HDR photo packages, Matterport 3D tours, drone, floor plans, virtual staging and commercial rates.",
    schema: ["OfferCatalog", "BreadcrumbList"],
  },
  {
    path: "/work/",
    title: "Portfolio — Las Vegas Real Estate Photography & 3D Tours",
    description:
      "Portfolio of Las Vegas real estate photography and Matterport 3D virtual tours by Mike Madsen — residential, commercial, vacation rental and drone work.",
    schema: ["BreadcrumbList"],
  },
  {
    path: "/about/",
    title: "About Mike Madsen — Las Vegas Real Estate Photographer | VTLV",
    description:
      "Meet Mike Madsen, Las Vegas real estate photographer since 2006 — licensed agent, FAA Part 107 drone pilot, Google Trusted Photographer, sole Matterport provider for Lennar Homes.",
    schema: ["BreadcrumbList"],
  },
  {
    path: "/about/michelle-sproul/",
    title: "Michelle Sproul — Licensed Las Vegas Realtor & Co-Founder | VTLV",
    description:
      "Michelle Sproul, licensed Las Vegas real estate agent and co-founder of Virtual Tours Las Vegas. Agent perspective that makes our photography sell listings.",
    schema: ["BreadcrumbList"],
  },
  {
    path: "/about/availability/",
    title: "Availability, Hours & Turnaround — Las Vegas Photography | VTLV",
    description:
      "Current availability, service hours and turnaround times for Las Vegas real estate photography with Mike Madsen. Same-day rush available.",
    schema: ["BreadcrumbList"],
  },
  {
    path: "/about/navigation/",
    title: "How to Navigate a Virtual Tour — Controls Help | VTLV",
    description:
      "Guide to navigating Matterport and Zillow 3D virtual tours — walkthrough, dollhouse, floorplan and measurement controls explained.",
    schema: ["BreadcrumbList"],
  },
  {
    path: "/neighborhoods/",
    title: "Areas We Serve — Las Vegas Valley Real Estate Photography | VTLV",
    description:
      "Real estate photography across the Las Vegas Valley — Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City and Clark County.",
    schema: ["BreadcrumbList"],
  },
  {
    path: "/blog/",
    title: "Blog — Las Vegas Real Estate Photography Tips & Market | VTLV",
    description:
      "Las Vegas real estate photography tips, market updates and agent resources from Mike Madsen at Virtual Tours Las Vegas.",
    schema: ["Blog", "BreadcrumbList"],
  },
  {
    path: "/booking/",
    title: "Book a Shoot — Las Vegas Real Estate Photography | VTLV",
    description:
      "Book a Las Vegas real estate photography shoot online — pick a package, choose a date, and request a booking. Fast confirmation.",
    schema: ["BreadcrumbList"],
  },
  {
    path: "/contact/",
    title: "Book a Shoot — Las Vegas Real Estate Photography | VTLV",
    description:
      "Contact Mike Madsen at Virtual Tours Las Vegas for real estate photography, Matterport 3D tours, drone and virtual staging across the Las Vegas Valley.",
    schema: ["BreadcrumbList"],
  },
  {
    path: "/faq/",
    title: "FAQ — Las Vegas Real Estate Photography & 3D Tours | VTLV",
    description:
      "Answers to common questions about Las Vegas real estate photography — turnaround, pricing, MLS compliance, drone rules, Matterport and virtual staging.",
    schema: ["FAQPage", "BreadcrumbList"],
  },
  {
    path: "/privacy/",
    title: "Privacy — Virtual Tours Las Vegas",
    description:
      "Privacy policy for Virtual Tours Las Vegas — what data the contact and booking forms collect, how it's used, and your rights.",
    schema: ["BreadcrumbList"],
  },
  {
    path: "/terms/",
    title: "Terms — Virtual Tours Las Vegas",
    description:
      "Terms of service for Virtual Tours Las Vegas real estate photography — booking, payment, cancellation, usage rights and MLS licensing.",
    schema: ["BreadcrumbList"],
  },
  {
    path: "/404",
    title: "Page not found — Virtual Tours Las Vegas",
    description: "That page moved or never existed. Head back to the portfolio or get in touch.",
    noindex: true,
  },
];
