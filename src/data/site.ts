// ===== Single source of truth: business, services, pricing, portfolio =====
// All facts verified against virtualtourslasvegas.com (audited 2026-07-26).
// Pricing is the real published pricing. Nothing fabricated.
//
// EDITING: The content the site owner needs to change (business info, pricing,
// testimonials, FAQ, portfolio) lives in JSON files under ./cms/ so Decap CMS
// (public/admin/config.yml → /admin) can edit them with a form UI. This file
// imports those JSON files and re-exports typed values, so CMS edits flow
// through to the public site on the next build. Code-only structure (nav,
// types, helper arrays) stays here because it isn't content.

import settings from "./cms/settings.json";
import pricing from "./cms/pricing.json";
import testimonialsData from "./cms/testimonials.json";
import faqData from "./cms/faq.json";
import portfolioData from "./cms/portfolio.json";

// Prefix all public/ asset paths and internal links with Astro's BASE_URL so they
// work under any deployment base path (e.g. GitHub Pages project site). Defaults to "/" in dev.
const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
export const asset = (p: string) => (p.startsWith("/") ? `${BASE}${p}` : `${BASE}/${p}`);
export const url = asset;

export const business = {
  name: settings.name,
  shortName: settings.shortName,
  owner: settings.owner,
  phone: settings.phone,
  phoneHref: settings.phoneHref,
  smsHref: settings.smsHref,
  email: settings.email,
  emailHref: settings.emailHref,
  since: settings.since,
  realEstateSince: settings.realEstateSince,
  serviceArea: settings.serviceArea,
  areaNote: settings.areaNote,
  url: settings.url,
  turnaround: settings.turnaround,
  social: settings.social,
};

export const nav = [
  { label: "Work", href: "/work/" },
  { label: "Services", href: "/services/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

export const trust = [
  "Sole photographer for the Zillow Offers listing program in Las Vegas",
  "Sole Matterport provider for Lennar Homes, a top-3 US homebuilder",
  "Licensed real estate agent, working in the industry since 2006",
  "FAA Part 107 Certified Drone Pilot & Google Trusted Photographer",
];

export type ServiceBuyer = {
  slug: string;
  label: string;
  audience: string;
  blurb: string;
  href: string;
  image: string;
  alt: string;
  services: string[];
};

export const serviceBuyers: ServiceBuyer[] = [
  {
    slug: "residential",
    label: "Residential Real Estate",
    audience: "Agents, brokers & home sellers",
    blurb:
      "HDR photography, 3D tours, drone, floor plans, virtual staging and twilight shots: the complete listing package, delivered to MLS-ready standards in 24–48 hours.",
    href: "/services/residential/",
    image: "/images/portfolio/sierra-skye-living.jpg",
    alt: "Sunlit Las Vegas living room captured with professional HDR real estate photography",
    services: ["HDR Photos", "Matterport 3D", "Zillow 3D Home", "Floor Plans", "Drone", "Virtual Staging", "Twilight", "Walk-Through Video"],
  },
  {
    slug: "commercial",
    label: "Commercial",
    audience: "Brokers, owners & businesses",
    blurb:
      "Advertising-grade imagery and immersive 3D for offices, retail, restaurants, industrial and event venues, with extended licensing built for long-term campaigns.",
    href: "/services/commercial/",
    image: "/images/portfolio/warehouse-drone-1.jpg",
    alt: "Commercial warehouse documented with aerial drone photography in Las Vegas",
    services: ["Commercial HDR", "Matterport", "360 Virtual Tours", "Google Business View", "Drone", "Floor Plans"],
  },
  {
    slug: "vacation-rentals",
    label: "Vacation Rentals",
    audience: "Airbnb & Vrbo hosts",
    blurb:
      "Listing photography that earns the booking. Airbnb's own data shows professionally photographed listings earn measurably more. Get the imagery that converts browsers into guests.",
    href: "/services/vacation-rentals/",
    image: "/images/portfolio/brooklyn-1.jpg",
    alt: "Well-lit residential interior photographed for a vacation rental listing",
    services: ["Listing Photos", "Matterport", "Floor Plans", "Drone", "Amenity Photos", "360 Tours"],
  },
  {
    slug: "as-built",
    label: "Builders, Developers & Docs",
    audience: "Builders, contractors, architects, insurance",
    blurb:
      "3D reality capture, as-built surveys, construction progress documentation and insurance-ready digital twins, accurate measurements without return site visits.",
    href: "/services/as-built/",
    image: "/images/portfolio/matterpak-cad.jpg",
    alt: "Matterport CAD file and as-built documentation deliverable for Las Vegas construction",
    services: ["As-Built Surveys", "3D Reality Capture", "Progress Documentation", "Digital Twins", "Aerial", "Matterpak / BIM"],
  },
];

// Featured 3D tours page (the brand's namesake)
export const tourServices = [
  { name: "Matterport 3D", note: "Dollhouse, floor plan view, measurement tools, Mattertags & VR." },
  { name: "Zillow 3D Home", note: "Free hosting on Zillow, ranks your listing higher in search." },
  { name: "Express & Premium 360", note: "DSLR-stitched panoramas from rapid to ultra-high resolution." },
];

// ===== Pricing — real published numbers (verified 2026-07-26) =====
// Sourced from ./cms/pricing.json so the CMS can edit every price/add-on.
export type Package = {
  name: string;
  tag: string;
  price: number;
  blurb: string;
  includes: string[];
  featured?: boolean;
  sizeNote?: string;
};

export const vegasPackages: Package[] = pricing.vegasPackages as Package[];

export const hdrTiers = pricing.hdrTiers;

export const hdrAddOns = pricing.hdrAddOns;

export const matterportTiers = pricing.matterportTiers;

// Matterport feature list (copy, not pricing) — kept inline because it's
// marketing copy tied to the Matterport section layout, not a price row.
export const matterportIncludes = [
  "6 months free hosting",
  "2 MLS landing-page tour links (branded + unbranded)",
  "Dollhouse, floor plan & measurement views",
];

export const floorPlanTiers = pricing.floorPlanTiers;

export const floorPlanAddOns = pricing.floorPlanAddOns;

export const virtualStagingTiers = pricing.virtualStagingTiers;

export const videoTiers = pricing.videoTiers;

export const zillowTiers = pricing.zillowTiers;

export const commercialHdr = pricing.commercialHdr;

export const commercialPanoramas = pricing.commercialPanoramas;

export const googlePackage = pricing.googlePackage;

// ===== Testimonials — real, verbatim from the site =====
// Sourced from ./cms/testimonials.json so the CMS can add/edit/remove them.
export type Testimonial = {
  quote: string;
  name: string;
  context: string;
  avatar: string;
};

export const testimonials: Testimonial[] = testimonialsData as Testimonial[];

// ===== Client logos =====
export const clients = [
  { name: "Zillow", src: "/images/clients/zillow-offers.png" },
  { name: "Lennar", src: "/images/clients/lennar.webp" },
  { name: "Berkshire Hathaway", src: "/images/clients/berkshire-hathaway.png" },
  { name: "CBRE", src: "/images/clients/cbre.png" },
  { name: "Cushman & Wakefield", src: "/images/clients/cushman-wakefield.png" },
  { name: "Sotheby's International Realty", src: "/images/clients/sothebys.png" },
  { name: "EXP Realty", src: "/images/clients/exp-realty.png" },
  { name: "Chick-fil-A", src: "/images/clients/chick-fil-a.png" },
  { name: "Starbucks", src: "/images/clients/starbucks.jpg" },
];

// ===== Portfolio (curated from real site assets) =====
// Sourced from ./cms/portfolio.json so the CMS can add/edit/remove images.
export type ShotCategory = "Interior" | "Exterior" | "Drone" | "Staging" | "3D Tour" | "Commercial" | "Floor Plan";
export type Shot = {
  src: string;
  alt: string;
  category: ShotCategory;
  span?: boolean; // wide tile
  /** Optional Matterport model SID. When present, the portfolio lightbox
      offers a "View 3D Tour" button that opens the tour in a dialog popup. */
  matterportId?: string;
};

export const portfolio: Shot[] = portfolioData as Shot[];

// Virtual staging before/after pairs (real matched images from the site)
export type StagingPair = {
  before: string;
  beforeAlt: string;
  after: string;
  afterAlt: string;
  label: string;
};

export const stagingPairs: StagingPair[] = [
  {
    before: "/images/portfolio/staging-living-empty.jpg",
    beforeAlt: "Empty living room before virtual staging",
    after: "/images/portfolio/staging-living-staged.jpg",
    afterAlt: "Same living room after virtual staging with furniture",
    label: "Living Room",
  },
  {
    before: "/images/portfolio/staging-bedroom-empty-2.jpg",
    beforeAlt: "Empty master bedroom before virtual staging",
    after: "/images/portfolio/staging-bedroom-staged-2.jpg",
    afterAlt: "Master bedroom after virtual staging",
    label: "Master Bedroom",
  },
  {
    before: "/images/portfolio/staging-loft-empty.jpg",
    beforeAlt: "Empty loft space before virtual staging",
    after: "/images/portfolio/staging-loft-staged.jpg",
    afterAlt: "Loft after virtual staging with a desk and seating",
    label: "Loft",
  },
  {
    before: "/images/portfolio/staging-room-empty.jpg",
    beforeAlt: "Empty room before virtual staging",
    after: "/images/portfolio/staging-room-staged.jpg",
    afterAlt: "Room furnished through virtual staging",
    label: "Sitting Room",
  },
  {
    before: "/images/portfolio/staging-living-empty-2.jpg",
    beforeAlt: "Empty living area before virtual staging",
    after: "/images/portfolio/staging-living-staged-2.jpg",
    afterAlt: "Living area after virtual staging",
    label: "Living Area",
  },
];

export const process = [
  {
    step: "01",
    title: "Book your shoot",
    body: "Call, text or use the form. Tell me the property type, address and the date you need. You'll get a confirmation with a simple prep checklist.",
  },
  {
    step: "02",
    title: "On-site capture",
    body: "I shoot every property myself: HDR stills, 3D scans, drone (FAA-permitted) and twilight where booked. Plan for 30–40 minutes per 1,000 sq ft.",
  },
  {
    step: "03",
    title: "Delivered in 24–48h",
    body: "MLS-ready photos, tour links and floor plans land in your inbox. Embed codes included. Rush next-morning delivery available.",
  },
];

// ===== FAQ — sourced from ./cms/faq.json so the CMS can manage entries =====
export const faqs = faqData as { q: string; a: string }[];
