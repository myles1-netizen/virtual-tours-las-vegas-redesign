// ===== Location landing pages — real, unique content per city =====
// The old WordPress site had thin "doorway" pages per city that all redirected
// to /neighborhoods/. These replace that pattern with REAL landing pages:
// each has unique copy explaining why Mike serves the area, the drive time
// from his central base, specific neighborhoods, and the services in demand.
//
// Consumed by src/pages/locations/[slug].astro to generate /locations/<slug>/.
// Drive times are honest estimates from central Las Vegas (~3 miles east of
// the Strip) at typical midday traffic, sourced from common routing data.

export interface LocationPage {
  /** URL slug (also the directory name under /locations/). */
  slug: string;
  /** City / area name as a human would write it. */
  name: string;
  /** Short possessive form for headings, e.g. "Henderson's". */
  possessive: string;
  /** State abbreviation. */
  state: "NV" | "UT" | "AZ";
  /** SEO title (< 60 chars). */
  title: string;
  /** SEO meta description (< 160 chars). */
  description: string;
  /** Approx drive time from central Las Vegas. */
  driveTime: string;
  /** Approx driving distance. */
  distance: string;
  /** Hero eyebrow. */
  eyebrow: string;
  /** Hero headline (no trailing period for hero feel). */
  headline: string;
  /** Hero lead paragraph — unique per city, no boilerplate. */
  lead: string;
  /** The specific neighborhoods / communities in this city Mike shoots. */
  neighborhoods: string[];
  /** Services most in demand in this market (with a one-line why). */
  inDemand: { service: string; note: string }[];
  /** A unique paragraph: why Mike serves this area / his history there. */
  whyServe: string;
  /** A unique practical note about shooting here (airspace, access, etc.). */
  practicalNote: string;
}

export const locations: LocationPage[] = [
  {
    slug: "henderson",
    name: "Henderson",
    possessive: "Henderson's",
    state: "NV",
    title: "Henderson Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "Henderson, NV real estate photography — HDR photos, Matterport 3D tours, drone and floor plans for Anthem, Cadence, Inspirada, Lake Las Vegas, MacDonald Highlands and Seven Hills. 24–48 hr delivery.",
    driveTime: "20–30 minutes",
    distance: "~16 miles southeast",
    eyebrow: "Henderson, NV",
    headline: "Henderson real estate photography, from Green Valley to Lake Las Vegas.",
    lead:
      "Henderson is the fastest-growing edge of the Las Vegas Valley and one of Mike's busiest markets — a steady rotation of new-build inventory in Cadence and Inspirada, established luxury in Anthem and MacDonald Highlands, and resort-style listings around Lake Las Vegas. Same photographer, same 24–48 hour turnaround, no valley travel fee.",
    neighborhoods: [
      "Anthem",
      "Anthem Country Club",
      "Cadence",
      "Inspirada",
      "Lake Las Vegas",
      "MacDonald Highlands",
      "Seven Hills",
      "Green Valley",
      "Whitney Ranch",
    ],
    inDemand: [
      { service: "Matterport 3D tours", note: "Cadence and Inspirada model homes and new inventory pre-sell off-plan with immersive walkthroughs." },
      { service: "Drone photography", note: "MacDonald Highlands and Seven Hills hillside listings need aerial context for the lot and the Strip views." },
      { service: "Virtual staging", note: "Vacant inventory homes in Cadence stage in post faster than physical staging." },
    ],
    whyServe:
      "Mike has photographed Henderson continuously since 2010. As the sole Matterport provider for Lennar Homes in the Las Vegas market, he documents new construction across Henderson's master-planned communities on a weekly basis — model homes, inventory homes and progress documentation. That volume means short notice periods and a photographer who already knows the floor plans.",
    practicalNote:
      "Henderson's hillside communities (MacDonald Highlands, Anthem Country Club) sit close to Henderson Executive Airport's airspace; drone work here uses Mike's FAA Part 107 authorization and LAANC approvals so flights are legal and insured.",
  },
  {
    slug: "summerlin",
    name: "Summerlin",
    possessive: "Summerlin's",
    state: "NV",
    title: "Summerlin Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "Summerlin & Summerlin South real estate photography — HDR photos, Matterport 3D tours, drone, twilight and floor plans for The Ridges, Red Rock Country Club, Summerlin West and Skye Canyon. 24–48 hr delivery.",
    driveTime: "25–35 minutes",
    distance: "~13 miles west",
    eyebrow: "Summerlin, NV",
    headline: "Summerlin listings, shot to the standard the neighborhood expects.",
    lead:
      "Summerlin is Las Vegas's premier master-planned community and its listings set the bar for marketing quality. From the custom estates of The Ridges and Red Rock Country Club to the new builds pushing into Summerlin West and Skye Canyon, Summerlin listings are held to a higher visual standard — and Mike has been meeting it for over fifteen years.",
    neighborhoods: [
      "The Ridges",
      "Red Rock Country Club",
      "The Hills",
      "The Paseos",
      "Summerlin South",
      "Summerlin West",
      "Skye Canyon",
      "The Arbors",
      "The Willows",
    ],
    inDemand: [
      { service: "Twilight photography", note: "Summerlin luxury homes with mountain and Strip views sell on the blue-hour shot — twilight is the highest-ROI add-on here." },
      { service: "HDR photography", note: "Large-windowed great rooms framing the Spring Mountains need true HDR exposure blending, not phone shots." },
      { service: "Drone photography", note: "Golf-course and hillside lots read best from the air, especially around Red Rock and The Ridges." },
    ],
    whyServe:
      "Summerlin's price points demand photography that matches the architecture. Mike shoots these properties on a mirrorless DSLR with hand-processed HDR and optional twilight, delivering the editorial-grade imagery that luxury Summerlin listings need to compete on the MLS and in print.",
    practicalNote:
      "Skye Canyon and the far northwest corner of Summerlin border higher terrain and approach corridors; drone flights there are planned around Nellis and North Las Vegas airspace using FAA Part 107 LAANC authorizations.",
  },
  {
    slug: "north-las-vegas",
    name: "North Las Vegas",
    possessive: "North Las Vegas'",
    state: "NV",
    title: "North Las Vegas Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "North Las Vegas real estate photography — HDR photos, Matterport 3D tours, drone and floor plans for Aliante, Eldorado, Skye Canyon and Providence. New-construction specialist. 24–48 hr delivery.",
    driveTime: "20–30 minutes",
    distance: "~10 miles north",
    eyebrow: "North Las Vegas, NV",
    headline: "North Las Vegas new construction, documented right.",
    lead:
      "North Las Vegas is the engine of new-home construction in the valley, and it's where Mike shoots a large share of his builder work. Aliante, Providence, Skye Canyon and the Eldorado corridor are dense with model homes, inventory homes and spec builds that need fast, repeatable photography and 3D capture at volume.",
    neighborhoods: [
      "Aliante",
      "Eldorado",
      "Providence",
      "Skye Canyon (north edge)",
      "Valley View",
      "Centennial Hills (border)",
    ],
    inDemand: [
      { service: "Matterport 3D tours", note: "Builders pre-sell inventory homes from 3D walkthroughs before the home is physically complete enough to tour." },
      { service: "Progress documentation", note: "Monthly Matterport scans + drone progress photos are standard for North Las Vegas builder projects." },
      { service: "Floor plans", note: "Schematic and CAD floor plans accompany nearly every new-construction listing and as-built package here." },
    ],
    whyServe:
      "As the sole Matterport provider for Lennar Homes in Las Vegas, Mike is in North Las Vegas almost every week — photographing models, scanning inventory homes, and documenting construction progress. That means short-notice scheduling and a photographer who already understands builder workflow and MLS-ready turnaround.",
    practicalNote:
      "North Las Vegas sits under Nellis Air Force Base and North Las Vegas Airport airspace. All drone work here is flown under FAA Part 107 with LAANC authorization; some zones require altitude limits that Mike plans around when quoting aerial shots.",
  },
  {
    slug: "boulder-city",
    name: "Boulder City",
    possessive: "Boulder City's",
    state: "NV",
    title: "Boulder City Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "Boulder City, NV real estate photography — HDR photos, Matterport 3D tours, drone and floor plans for custom homes, Lake Mead-view properties and historic Boulder City. FAA Part 107 aerials. 24–48 hr delivery.",
    driveTime: "30–40 minutes",
    distance: "~26 miles southeast",
    eyebrow: "Boulder City, NV",
    headline: "Boulder City properties, captured with the desert in mind.",
    lead:
      "Boulder City is a different market — smaller, custom, and defined by its setting between the River Mountains and Lake Mead. Custom homes, view properties, and historic-charm listings here need photography that respects the desert light and the mountain backdrop, not generic strip-mall real estate imagery.",
    neighborhoods: [
      "Historic Boulder City",
      "Boulder City foothills",
      "Lake Mead-view properties",
      "River Mountains area",
      "Greenway Road corridor",
    ],
    inDemand: [
      { service: "Drone photography", note: "Lake Mead proximity and big-lot desert properties need aerial context that ground shots can't deliver." },
      { service: "Twilight photography", note: "Desert sunsets behind the mountain silhouettes make Boulder City exteriors especially striking at blue hour." },
      { service: "Matterport 3D tours", note: "Custom floor plans and larger homes benefit from the measurement tools and dollhouse view Matterport provides." },
    ],
    whyServe:
      "Boulder City is a quieter market but one Mike knows well — the drive out from his central Las Vegas base is straightforward, and the properties reward a photographer who slows down. Because Boulder City is outside the urban valley, Mike quotes these shoots individually rather than on a strict volume schedule.",
    practicalNote:
      "Boulder City is near Henderson Executive Airport and the Boulder City permitting area; drone flights around Lake Mead also fall under National Park Service and FAA rules. Mike handles the airspace and permit checks as part of the shoot.",
  },
  {
    slug: "pahrump",
    name: "Pahrump",
    possessive: "Pahrump's",
    state: "NV",
    title: "Pahrump Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "Pahrump, NV real estate photography — HDR photos, Matterport 3D tours, drone and floor plans for acreage properties, equestrian estates and new builds in Nye County. FAA Part 107 aerials. By arrangement.",
    driveTime: "60–70 minutes",
    distance: "~62 miles west",
    eyebrow: "Pahrump, NV",
    headline: "Pahrump acreage and equestrian properties, photographed properly.",
    lead:
      "Pahrump sits across the county line in Nye County and serves a different buyer — larger lots, acreage homes, equestrian properties, and a growing wave of new construction. These listings reward aerial photography that shows the land, and 3D tours that let remote buyers walk a property before driving an hour to see it.",
    neighborhoods: [
      "Pahrump Valley",
      "Calvada Valley",
      "Prosperity Lake area",
      "Lakewood",
      "Outlying acreage properties",
    ],
    inDemand: [
      { service: "Drone photography", note: "Acreage listings live or die on lot context — boundaries, outbuildings, and surrounding land read best from the air." },
      { service: "Matterport 3D tours", note: "Remote and out-of-state buyers pre-qualify from a 3D walkthrough before committing to the drive." },
      { service: "HDR photography", note: "Large ranch-style homes with mountain views need true HDR to balance bright desert exteriors with interiors." },
    ],
    whyServe:
      "Pahrump is outside the daily Las Vegas Valley loop, so Mike quotes these shoots individually and often bundles them with nearby work to keep the trip efficient. He's been shooting Pahrump properties for years and knows what out-of-area buyers need to see before they'll make an offer.",
    practicalNote:
      "Pahrump's open airspace is generally easier for drone work than the urban valley, but acreage shoots often need extra time for the larger footprints — plan for a slightly longer on-site window.",
  },
  {
    slug: "mesquite",
    name: "Mesquite",
    possessive: "Mesquite's",
    state: "NV",
    title: "Mesquite Real Estate Photographer | Virtual Tours Las Vegas",
    description:
      "Mesquite, NV real estate photography — HDR photos, Matterport 3D tours, drone and floor plans for golf-course homes, retirement communities and new builds near the Utah border. FAA Part 107 aerials. By arrangement.",
    driveTime: "80 minutes",
    distance: "~82 miles northeast",
    eyebrow: "Mesquite, NV",
    headline: "Mesquite golf-course and retirement-community listings, done right.",
    lead:
      "Mesquite is the northeast corner of Nevada's reach — a golf and retirement community market that draws buyers from Utah, Idaho and beyond. The listings here are about lifestyle: course views, active-adult floor plans, and move-in-ready interiors that need to sell the dream to remote buyers.",
    neighborhoods: [
      "CasaBlanca golf area",
      "The Oasis",
      "Sun Mesa",
      "Highland Estates",
      "Conestoga",
    ],
    inDemand: [
      { service: "Matterport 3D tours", note: "Out-of-state retirement buyers walk a home online before flying in — 3D tours are essential here." },
      { service: "Drone photography", note: "Golf-course frontage and mountain views are the whole pitch; aerials show what ground photos can't." },
      { service: "Virtual staging", note: "Vacant move-in-ready inventory reads as 'livable' the moment it's staged in post." },
    ],
    whyServe:
      "Mesquite is a long drive from the Las Vegas Valley, so Mike quotes these shoots individually and often groups them to make the trip worthwhile. The market rewards a photographer who understands retirement-community and second-home buyers — slower-paced, lifestyle-driven, and increasingly online-first.",
    practicalNote:
      "Mesquite sits near the Utah border and the Logan/Parowan airspace is generally accommodating for drone work; flights are planned with FAA Part 107 compliance as always.",
  },
];

export function getLocation(slug: string): LocationPage | undefined {
  return locations.find((l) => l.slug === slug);
}
