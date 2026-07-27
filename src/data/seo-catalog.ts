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
  /** Yoast-style "focus keyphrase" — the primary phrase this page should rank
      for. Surfaced in the admin SEO scorecard so every page shows a target. */
  focusKeyphrase?: string;
}

export const seoCatalog: SeoEntry[] = [
  {
    path: "/",
    title: "Las Vegas Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "Las Vegas real estate photographer Mike Madsen — HDR photos, Matterport 3D tours, drone, floor plans and virtual staging. Book online, 24–48 hr turnaround.",
    schema: ["LocalBusiness", "ProfessionalService", "Photographer"],
    focusKeyphrase: "las vegas real estate photographer",
  },
  {
    path: "/services/",
    title: "Real Estate Photography Services — Las Vegas | VTLV",
    description:
      "Residential, commercial and vacation-rental photography in Las Vegas: HDR photos, Matterport 3D tours, drone, floor plans, staging and Google Business View.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "real estate photography services las vegas",
  },
  {
    path: "/services/residential/",
    title: "Residential Real Estate Photography Las Vegas | VTLV",
    description:
      "Complete residential listing packages in Las Vegas: HDR photography, Matterport 3D tours, drone, floor plans, virtual staging and twilight. 24–48 hr turnaround.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "residential real estate photography las vegas",
  },
  {
    path: "/services/hdr-photography/",
    title: "HDR Real Estate Photography Las Vegas | VTLV",
    description:
      "HDR real estate photography in Las Vegas — multiple-exposure blending for bright, accurate interior and exterior listing photos. MLS-ready, 24–48 hr turnaround.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "hdr photography las vegas",
  },
  {
    path: "/services/3d-tours/",
    title: "Matterport & Zillow 3D Virtual Tours Las Vegas | VTLV",
    description:
      "Matterport 3D virtual tours and Zillow 3D Home walkthroughs for Las Vegas listings. Immersive dollhouse views that increase showings and time on page.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "matterport virtual tour las vegas",
  },
  {
    path: "/services/drone-photography/",
    title: "Drone Photography Las Vegas — FAA Part 107 Aerial | VTLV",
    description:
      "FAA Part 107 certified drone photography in Las Vegas — aerial photos and video for listings, land and commercial property. Legal, insured, MLS-ready.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "drone photography las vegas",
  },
  {
    path: "/services/floor-plans/",
    title: "Floor Plans Las Vegas — Schematic, 3D & CAD | VTLV",
    description:
      "Accurate 2D, 3D and CAD floor plans for Las Vegas real estate listings. Generated from Matterport scans for precise measurements. Delivered as PNG, PDF and SVG.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "floor plan creator las vegas",
  },
  {
    path: "/services/virtual-staging/",
    title: "Virtual Staging Las Vegas — Empty Rooms Furnished | VTLV",
    description:
      "Virtual staging for empty Las Vegas listings — photorealistic furniture and décor added to your HDR photos. Multiple styles, unlimited revisions per room.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "virtual staging las vegas",
  },
  {
    path: "/services/twilight-photography/",
    title: "Twilight Photography Las Vegas — Blue Hour Shots | VTLV",
    description:
      "Twilight and blue-hour real estate photography in Las Vegas — warm-lit exteriors and glowing windows that make listings stand out in the MLS and on Zillow.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "twilight photography las vegas",
  },
  {
    path: "/services/commercial/",
    title: "Commercial Real Estate Photography Las Vegas | VTLV",
    description:
      "Commercial real estate photography in Las Vegas — offices, retail, industrial and restaurants. HDR photos, Matterport, drone, as-built and floor plans.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "commercial real estate photography las vegas",
  },
  {
    path: "/services/vacation-rentals/",
    title: "Vacation Rental Photography Las Vegas — Airbnb & Vrbo | VTLV",
    description:
      "Vacation rental photography in Las Vegas for Airbnb and Vrbo hosts — bright HDR photos, 3D tours and floor plans that boost bookings and nightly rates.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "vacation rental photography las vegas",
  },
  {
    path: "/services/google-business-view/",
    title: "Google Business View & Street View 360 Las Vegas | VTLV",
    description:
      "Google Business View (Street View Trusted) 360° virtual tours for Las Vegas businesses — published to Google Maps and Search. Drive foot traffic and discovery.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "google business view las vegas",
  },
  {
    path: "/services/as-built/",
    title: "As-Built Surveys & Construction Docs Las Vegas | VTLV",
    description:
      "As-built surveys and construction documentation in Las Vegas — measured drawings, progress photos and Matterport reality capture for architects and builders.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "as built survey las vegas",
  },
  {
    path: "/services/photo-packages/",
    title: "Photo Packages for Las Vegas Real Estate | VTLV",
    description:
      "Compare Las Vegas real estate photo packages — from single HDR shoots to full Matterport + drone + floor plan bundles. Transparent pricing, no hidden fees.",
    schema: ["Service", "BreadcrumbList"],
    focusKeyphrase: "real estate photo packages las vegas",
  },
  {
    path: "/pricing/",
    title: "Pricing — Las Vegas Real Estate Photography Packages | VTLV",
    description:
      "Transparent Las Vegas real estate photography pricing. HDR photo packages, Matterport 3D tours, drone, floor plans, virtual staging and commercial rates.",
    schema: ["OfferCatalog", "BreadcrumbList"],
    focusKeyphrase: "real estate photography pricing las vegas",
  },
  {
    path: "/work/",
    title: "Portfolio — Las Vegas Real Estate Photography & 3D Tours",
    description:
      "Portfolio of Las Vegas real estate photography and Matterport 3D virtual tours by Mike Madsen — residential, commercial, vacation rental and drone work.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "real estate photography portfolio las vegas",
  },
  {
    path: "/about/",
    title: "About Mike Madsen — Las Vegas Photographer | VTLV",
    description:
      "Meet Mike Madsen, Las Vegas real estate photographer since 2006 — licensed agent, FAA Part 107 drone pilot and Google Trusted Photographer serving Las Vegas.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "mike madsen photographer las vegas",
  },
  {
    path: "/about/michelle-sproul/",
    title: "Michelle Sproul — Las Vegas Realtor & Co-Founder | VTLV",
    description:
      "Michelle Sproul, licensed Las Vegas real estate agent and co-founder of Virtual Tours Las Vegas. Agent perspective that makes our photography sell listings.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "michelle sproul realtor las vegas",
  },
  {
    path: "/about/availability/",
    title: "Availability, Hours & Turnaround — Las Vegas | VTLV",
    description:
      "Current availability, service hours and turnaround times for Las Vegas real estate photography with Mike Madsen. Same-day rush available for urgent listings.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "real estate photographer availability las vegas",
  },
  {
    path: "/about/navigation/",
    title: "How to Navigate a Virtual Tour — Controls Help | VTLV",
    description:
      "Guide to navigating Matterport and Zillow 3D virtual tours — walkthrough, dollhouse, floorplan and measurement controls explained.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "virtual tour navigation help",
  },
  {
    path: "/neighborhoods/",
    title: "Las Vegas Valley Real Estate Photography Areas | VTLV",
    description:
      "Real estate photography across the Las Vegas Valley — Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City and Clark County neighborhoods.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "las vegas real estate photographer neighborhoods",
  },
  {
    path: "/locations/",
    title: "Real Estate Photographer Locations — Southern Nevada | VTLV",
    description:
      "City-by-city real estate photography from Virtual Tours Las Vegas: Henderson, Summerlin, North Las Vegas, Boulder City, Pahrump and Mesquite.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "real estate photographer southern nevada",
  },
  {
    path: "/locations/henderson/",
    title: "Henderson Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "Henderson, NV real estate photography — HDR, Matterport 3D tours, drone and floor plans for Anthem, Cadence, Inspirada, Lake Las Vegas and MacDonald Highlands.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
    focusKeyphrase: "henderson real estate photographer",
  },
  {
    path: "/locations/summerlin/",
    title: "Summerlin Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "Summerlin & Summerlin South real estate photography — HDR, Matterport 3D tours, drone and twilight for The Ridges, Red Rock Country Club and Skye Canyon.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
    focusKeyphrase: "summerlin real estate photographer",
  },
  {
    path: "/locations/north-las-vegas/",
    title: "North Las Vegas Real Estate Photographer | VTLV",
    description:
      "North Las Vegas real estate photography — HDR, Matterport 3D tours, drone and floor plans for Aliante, Eldorado, Providence and Skye Canyon.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
    focusKeyphrase: "north las vegas photographer",
  },
  {
    path: "/locations/boulder-city/",
    title: "Boulder City Real Estate Photographer | VTLV",
    description:
      "Boulder City, NV real estate photography — HDR, Matterport 3D tours, drone and floor plans for custom homes and Lake Mead-view properties.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
    focusKeyphrase: "boulder city real estate photographer",
  },
  {
    path: "/locations/pahrump/",
    title: "Pahrump Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "Pahrump, NV real estate photography — HDR, Matterport 3D tours, drone and floor plans for acreage properties and equestrian estates in Nye County.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
    focusKeyphrase: "pahrump real estate photographer",
  },
  {
    path: "/locations/mesquite/",
    title: "Mesquite Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "Mesquite, NV real estate photography — HDR, Matterport 3D tours, drone and floor plans for golf-course homes and retirement communities.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
    focusKeyphrase: "mesquite nevada photographer",
  },
  {
    path: "/blog/",
    title: "Las Vegas Real Estate Photography Blog | VTLV",
    description:
      "Las Vegas real estate photography tips, market updates and agent resources from Mike Madsen at Virtual Tours Las Vegas. Learn what makes listings sell.",
    schema: ["Blog", "BreadcrumbList"],
    focusKeyphrase: "las vegas real estate photography blog",
  },
  {
    path: "/blog/cell-phone-photos-why-listing-not-selling/",
    title: "Cell Phone Photos Killing Your Listing? | VTLV",
    description:
      "Cell-phone listing photos cost you showings and price. Mike Madsen breaks down what phone shots are really doing to your Las Vegas listing — and why pros win.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "cell phone real estate photos",
  },
  {
    path: "/blog/community-photos-selling-more-than-the-home/",
    title: "Community Photos Sell More Than the Home | VTLV",
    description:
      "Buyers aren't just buying four walls — they're buying a neighborhood. Mike Madsen explains why community and lifestyle photos close more Las Vegas listings.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "community photos real estate",
  },
  {
    path: "/blog/drone-photography-las-vegas-faa-rules/",
    title: "Drone Photography in Las Vegas: FAA Rules | VTLV",
    description:
      "Drone shots sell Las Vegas listings by showing lot size and setting — but most of the valley sits in controlled airspace. FAA Part 107 pilot Mike Madsen.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "drone photography faa rules",
  },
  {
    path: "/blog/drone-photography-real-estate-more-than-roof/",
    title: "Drone Photography for Real Estate: More Than the Roof | VTLV",
    description:
      "A roof-only drone shot is a waste of a flight. FAA Part 107 certified Las Vegas drone pilot Mike Madsen explains the aerial shots that actually sell listings.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "drone real estate photography",
  },
  {
    path: "/blog/hdr-real-estate-photography-fixing-lighting/",
    title: "HDR Real Estate Photography: Fixing Lighting | VTLV",
    description:
      "Blurry windows, blown-out highlights and crooked walls kill listing photos. Mike Madsen explains how HDR fixes all three — and what to look for.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "hdr real estate photography",
  },
  {
    path: "/blog/matterport-vs-zillow-3d-which-virtual-tour/",
    title: "Matterport vs Zillow 3D: Which Tour Is Right? | VTLV",
    description:
      "Matterport and Zillow 3D Home are both real 3D tours, but serve different goals. Las Vegas photographer Mike Madsen compares models, hosting, SEO and price.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "matterport vs zillow 3d",
  },
  {
    path: "/blog/portrait-vs-landscape-listing-photos/",
    title: "Portrait vs. Landscape: Which Wins on Mobile? | VTLV",
    description:
      "Most Las Vegas agents shoot every listing photo in landscape — but portrait images earn more taps on mobile. Mike Madsen breaks down when each orientation wins.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "real estate photo orientation",
  },
  {
    path: "/blog/twilight-photography-sells-luxury-homes/",
    title: "Twilight Photography: Why It Sells Luxury Homes | VTLV",
    description:
      "Twilight shots stop the scroll on MLS and social. Las Vegas photographer Mike Madsen explains the blue-hour look, when twilight earns its keep and why it sells.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "twilight real estate photography",
  },
  {
    path: "/blog/welcome-to-the-vtlv-blog/",
    title: "Welcome to the VTLV Blog | Virtual Tours Las Vegas",
    description:
      "Real estate photography tips, Las Vegas market insight and behind-the-lens perspective from Mike Madsen, your local Las Vegas real estate photographer.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "las vegas real estate photographer",
  },
  {
    path: "/blog/why-hdr-photography-matters-las-vegas/",
    title: "Why HDR Photography Matters in Las Vegas | VTLV",
    description:
      "HDR photography is the highest-ROI line item on a real estate shoot. Mike Madsen explains what HDR does, why Las Vegas light demands it and how it earns.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "hdr photography las vegas",
  },
  {
    path: "/blog/zillow-3d-home-tours-sell-faster/",
    title: "Zillow 3D Home Tours: Do They Help Sell Faster? | VTLV",
    description:
      "Zillow 3D Home is a free-hosted 3D tour that lifts your listing higher in Zillow search. Mike Madsen, former sole Zillow Offers photographer in Las Vegas.",
    schema: ["BlogPosting", "BreadcrumbList"],
    focusKeyphrase: "zillow 3d home tour",
  },
  {
    path: "/booking/",
    title: "Book a Shoot — Las Vegas Real Estate Photography | VTLV",
    description:
      "Book a Las Vegas real estate photography shoot online — pick a package, choose a date, and request a booking. Fast confirmation from Mike Madsen.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "book real estate photography las vegas",
  },
  {
    path: "/contact/",
    title: "Contact — Las Vegas Real Estate Photographer | VTLV",
    description:
      "Contact Mike Madsen at Virtual Tours Las Vegas for real estate photography, Matterport 3D tours, drone and virtual staging across the Las Vegas Valley.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "contact las vegas real estate photographer",
  },
  {
    path: "/faq/",
    title: "FAQ — Las Vegas Real Estate Photography & 3D Tours | VTLV",
    description:
      "Answers to common questions about Las Vegas real estate photography — turnaround, pricing, MLS compliance, drone rules, Matterport and virtual staging.",
    schema: ["FAQPage", "BreadcrumbList"],
    focusKeyphrase: "real estate photography faq las vegas",
  },
  {
    path: "/privacy/",
    title: "Privacy Policy — Virtual Tours Las Vegas",
    description:
      "Privacy policy for Virtual Tours Las Vegas — what data the contact and booking forms collect, how it's used and your rights to access or delete it.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "virtual tours las vegas privacy policy",
  },
  {
    path: "/terms/",
    title: "Terms of Service — Virtual Tours Las Vegas",
    description:
      "Terms of service for Virtual Tours Las Vegas real estate photography — booking, payment, cancellation, usage rights, MLS licensing and delivery timelines.",
    schema: ["BreadcrumbList"],
    focusKeyphrase: "real estate photography terms las vegas",
  },
  {
    path: "/404",
    title: "Page not found — Virtual Tours Las Vegas",
    description: "That page moved or never existed. Head back to the portfolio or get in touch.",
    noindex: true,
  },
];
