// ===== Single source of truth: business, services, pricing, portfolio =====
// All facts verified against virtualtourslasvegas.com (audited 2026-07-26).
// Pricing is the real published pricing. Nothing fabricated.

// Prefix all public/ asset paths and internal links with Astro's BASE_URL so they
// work under any deployment base path (e.g. GitHub Pages project site). Defaults to "/" in dev.
const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
export const asset = (p: string) => (p.startsWith("/") ? `${BASE}${p}` : `${BASE}/${p}`);
export const url = asset;

export const business = {
  name: "Virtual Tours Las Vegas",
  shortName: "VTLV",
  owner: "Mike Madsen",
  phone: "(702) 527-2732",
  phoneHref: "tel:+17025272732",
  smsHref: "sms:+17025272732",
  email: "VirtualToursLasVegas@gmail.com",
  emailHref: "mailto:VirtualToursLasVegas@gmail.com",
  since: 2010,
  realEstateSince: 2006,
  serviceArea: ["Las Vegas", "Henderson", "Summerlin", "North Las Vegas", "Boulder City", "Clark County"],
  areaNote: "Centrally located ~3 miles east of the Strip",
  url: "https://virtualtourslasvegas.com",
  turnaround: "24–48 hours",
  social: {
    facebook: "https://www.facebook.com/Virtualtourslasvegas/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
  },
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
export type Package = {
  name: string;
  tag: string;
  price: number;
  blurb: string;
  includes: string[];
  featured?: boolean;
  sizeNote?: string;
};

export const vegasPackages: Package[] = [
  {
    name: "Glitz & Glam",
    tag: "Best value starter",
    price: 200,
    blurb: "The essentials for a listing under 3,000 sq ft: photos, a Zillow 3D tour and a floor plan.",
    includes: ["30 HDR photos", "Zillow 3D Home Tour (up to 15 panoramas)", "Zillow floor plan integration", "Basic floor plan", "Free slideshow for MLS"],
    sizeNote: "Homes under 3,000 sq ft · +$50 over 3,000 sq ft · Residential resale only",
  },
  {
    name: "City Never Sleeps",
    tag: "Most popular",
    price: 400,
    blurb: "The full immersive package: Matterport 3D walkthrough with 6 months of free hosting.",
    includes: ["30 HDR photos", "Matterport Virtual Tour", "6 months free hosting", "Schematic floor plan", "Up to 5 exterior 360 panoramas"],
    featured: true,
    sizeNote: "Homes under 3,000 sq ft · +$100 over 3,000 sq ft · Residential resale only",
  },
  {
    name: "Neon Skyline",
    tag: "Aerial included",
    price: 250,
    blurb: "HDR photography paired with five drone shots for the listing that needs to show scale and setting.",
    includes: ["30 HDR photos", "5 drone photos", "FAA Part 107 pilot", "MLS slideshow"],
    sizeNote: "3,000 sq ft or less (incl. garage) · Weather-dependent · Residential resale only",
  },
];

export const hdrTiers = [
  { count: "10 HDR photos", price: 110 },
  { count: "11–30 photos", price: 135 },
  { count: "31–50 photos", price: 150 },
  { count: "51–70 photos", price: 185 },
  { count: "71–90 photos", price: 220 },
];

export const hdrAddOns = [
  "Extra HDR photo — +$5 / photo",
  "5 more HDR photos — +$20",
  "Rush delivery (next morning) — +$40",
  "Twilight shooting — +$100",
  "Sky replacement (3 images) — +$25",
  "Virtual staging (1 photo) — +$25",
  "Slideshow exported to video — +$10",
];

export const matterportTiers = [
  { size: "Up to 1,500 sq ft", price: 225 },
  { size: "Up to 2,000 sq ft", price: 245 },
  { size: "Up to 3,000 sq ft", price: 275 },
  { size: "Up to 4,000 sq ft", price: 350 },
  { size: "Each additional 1,000 sq ft", price: 55 },
];

export const matterportIncludes = [
  "6 months free hosting",
  "2 MLS landing-page tour links (branded + unbranded)",
  "Dollhouse, floor plan & measurement views",
];

export const floorPlanTiers = [
  { size: "Single story, up to 2,500 sq ft", price: 120 },
  { size: "Two story, up to 2,500 sq ft", price: 130 },
  { size: "Single story, 3,000–5,000 sq ft", price: 160 },
  { size: "Two story, 3,000–5,000 sq ft", price: 175 },
  { size: "Over 5,000 sq ft", price: null, note: "Custom quote" },
];

export const floorPlanAddOns = [
  "Colored living spaces — +$25",
  "CAD file — +$40",
  "3D floor plan — +$80",
  "Video rendering — +$125",
];

export const virtualStagingTiers = [
  { item: "Per photo (landscape or portrait)", price: 25 },
  { item: "Panoramic 360", price: 30 },
  { item: "3D floor plan", price: 25 },
];

export const videoTiers = [
  { item: "Walk-through video (stand-alone)", price: 129 },
  { item: "Zillow walk-through video (add-on)", price: 75 },
  { item: "30-second social media reel (9:16)", price: 350 },
  { item: "Walk-through video, commercial (stand-alone)", price: 750 },
];

export const zillowTiers = [
  { item: "Zillow 3D Home (add-on, 10–12 360s)", price: 50 },
  { item: "Zillow floor plan (add-on)", price: 25 },
];

export const commercialHdr = [
  { count: "5 HDR photos", price: 210 },
  { count: "10 photos", price: 420 },
  { count: "15 photos", price: 630 },
  { count: "20 photos", price: 840 },
];

export const commercialPanoramas = {
  premium: [
    { count: "5 DSLR/HDR 360s", price: 100 },
    { count: "10 DSLR/HDR 360s", price: 180 },
    { count: "20 DSLR/HDR 360s", price: 325 },
  ],
  express: [
    { count: "1–15 HDR 360s", price: 100 },
    { count: "15–30 HDR 360s", price: 130 },
  ],
};

export const googlePackage = {
  name: "“Get Me On Google” Arrangement",
  price: 500,
  includes: ["10 HDR photos", "Express 360 virtual tour (up to 15 panoramas)", "Posted to your Google Business profile"],
  note: "Businesses under 5,000 sq ft · +$50 over 5,000 sq ft",
};

// ===== Testimonials — real, verbatim from the site =====
export type Testimonial = {
  quote: string;
  name: string;
  context: string;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I was thoroughly impressed by the exceptional quality of the 360 virtual tours, affordable pricing, and timely delivery from Virtual Tours Las Vegas Real Estate Photography. Their creative approach and user-friendly experience made it easy to navigate and showcase our property's unique features, making us stand out in the Las Vegas real estate market.",
    name: "Ramon Wu",
    context: "Virtual tour client",
    avatar: "/images/team/ramon-wu.png",
  },
  {
    quote:
      "Mike is FANTASTIC and went above and beyond to ensure we received a GREAT virtual tour at an affordable price. Even when the property was not the most photoshoot-ready, he spent extra time to enhance & maximize the most of the spaces. The VT is super interactive & turned out beautifully for both of our shoots.",
    name: "Hannah Christianson",
    context: "Virtual tour client",
    avatar: "/images/team/hannah-christianson.png",
  },
  {
    quote:
      "I was looking for a Matterport Partner in Las Vegas area. Mike was extremely helpful: excellent customer service (from pre shooting to post shooting) and provide an excellent rendering, this company exceed our expectation. Highly recommend.",
    name: "Guillaume Paul-Simoncelli",
    context: "Matterport client",
    avatar: "/images/team/guillaume-paul-simoncelli.png",
  },
];

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
export type Shot = {
  src: string;
  alt: string;
  category: "Interior" | "Exterior" | "Drone" | "Staging" | "3D Tour" | "Commercial" | "Floor Plan";
  span?: boolean; // wide tile
};

// Every entry below is verified against its actual image content (audited 2026-07-26) —
// alt text and category describe what the photo really shows, not just the filename.
export const portfolio: Shot[] = [
  { src: "/images/portfolio/sierra-skye-living.jpg", alt: "Twilight exterior HDR photo of a modern Las Vegas two-story home", category: "Exterior", span: true },
  { src: "/images/portfolio/sierra-skye-kitchen.jpg", alt: "Twilight backyard photo with illuminated pool and patio, HDR real estate photography", category: "Exterior" },
  { src: "/images/portfolio/spitze-interior.jpg", alt: "Las Vegas Strip skyline view captured from a property's upper level at dusk", category: "Exterior" },
  { src: "/images/portfolio/listing-01.jpg", alt: "Aerial drone photo of a two-story Las Vegas commercial office building", category: "Drone" },
  { src: "/images/portfolio/badura.jpg", alt: "Community pool and clubhouse amenity photo for a Las Vegas property", category: "Exterior" },
  { src: "/images/portfolio/bonanza.jpg", alt: "Black-and-white schematic floor plan with room dimensions for a Las Vegas property", category: "Floor Plan" },
  { src: "/images/portfolio/brooklyn-1.jpg", alt: "Well-lit residential interior photographed for a property listing", category: "Interior" },
  { src: "/images/portfolio/brooklyn-2.jpg", alt: "Bright room with natural light, captured by a Las Vegas real estate photographer", category: "Interior" },
  { src: "/images/portfolio/drone-aerial.jpg", alt: "Aerial drone photo of a Las Vegas backyard with pool and spa", category: "Drone", span: true },
  { src: "/images/portfolio/warehouse-drone-1.jpg", alt: "Commercial warehouse documented with aerial drone photography", category: "Drone" },
  { src: "/images/portfolio/warehouse-drone-2.jpg", alt: "Industrial property aerial view captured by an FAA-certified drone pilot", category: "Drone" },
  { src: "/images/portfolio/matterport-360.jpg", alt: "360-degree virtual tour panorama of a Las Vegas listing", category: "3D Tour" },
  { src: "/images/portfolio/360-tiny-planet.jpg", alt: "Tiny-planet 360 panorama from a Las Vegas Matterport virtual tour", category: "3D Tour" },
  { src: "/images/portfolio/matterport-measurements.jpg", alt: "Matterport measurement tool showing precise room dimensions", category: "3D Tour" },
  { src: "/images/portfolio/mattertag.jpg", alt: "Mattertag info hotspot embedded in a Matterport 3D tour", category: "3D Tour" },
  { src: "/images/portfolio/matterpak-cad.jpg", alt: "CAD file generated from a Matterport 3D scan for architects and engineers", category: "Commercial" },
  { src: "/images/portfolio/floorplan-bw.jpg", alt: "Black and white schematic floor plan for a Las Vegas listing", category: "Floor Plan" },
  { src: "/images/portfolio/floorplan-combined.jpg", alt: "Combined floor plan with measurements for a multi-story property", category: "Floor Plan" },
  { src: "/images/portfolio/floorplan-3d.jpg", alt: "Stylized 3D floor plan rendering showing furnished living spaces", category: "Floor Plan" },
];

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

export const faqs = [
  {
    q: "How is a 360 virtual tour different from a traditional slideshow?",
    a: "A traditional \"virtual tour\" is really just a 2D photo gallery or slideshow made to look panoramic. You can't actually move through the space. A true 360 tour (Matterport) lets a viewer walk through up to ~200 stitched photo spheres, see a dollhouse view and a floor plan view, and even take measurements. It's an entirely different experience and it's viewable in VR headsets too.",
  },
  {
    q: "How long does a shoot take on-site?",
    a: "Roughly 30–40 minutes per 1,000 sq ft. A typical single scan takes about a minute; larger homes can need up to 200 individual scans. Plan for the photographer to be on-site for 1–3 hours depending on scope.",
  },
  {
    q: "What do I need to do before the appointment?",
    a: "Have the property completely clean, staged and photo-ready. Treat it like a 24/7 open house. The photographer doesn't move furniture or clean. Provide access details (lockbox code, occupant contact) at booking. A property that isn't ready when the photographer arrives incurs a $35 trip fee and needs rescheduling.",
  },
  {
    q: "Do I need to be there during the shoot?",
    a: "No. Because scanning takes 1–3 hours, it's best for all people and pets to vacate the property during the appointment.",
  },
  {
    q: "What happens if the weather is bad?",
    a: "Indoor shooting and 3D scans are unaffected: HDR handles lighting variations and cloudy days shoot fine. Outdoor scans and drone flights are weather-dependent. Drone work is also subject to FAA airspace rules near Las Vegas airports.",
  },
  {
    q: "What's the difference between a schematic floor plan and a blueprint?",
    a: "Schematic floor plans show the basic flow, doorways and room layout of an existing building. They're not to architectural scale. Blueprints are precisely scaled drawings with framing, plumbing and electrical details, intended for construction. VTLV floor plans are for existing construction only.",
  },
  {
    q: "How long is a Matterport 3D tour hosted?",
    a: "The first 6 months of hosting are included free. After that it's $10/month per model, billed in 6-month intervals, and you can cancel any time. One model covers up to 99 scans, so very large properties may need two.",
  },
  {
    q: "What's your turnaround time?",
    a: "Still photography: 24–48 hours, delivered via cloud storage in MLS format. 3D virtual tours: 24–48 hours with email links and an embed iframe. Floor plans: 48 hours, delivered as PDF. Zillow walk-through videos: 12–24 hours.",
  },
  {
    q: "What's the cancellation policy?",
    a: "To avoid a $35 trip fee, cancel at least 24 hours before your scheduled time. The same fee applies if the property isn't ready for shooting when the photographer arrives.",
  },
];
