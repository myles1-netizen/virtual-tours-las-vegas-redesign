// ===== SEO keyword catalog — every search query the site targets =====
// Single source of truth for the phrases this site is built to rank for.
// Grouped by intent so the admin "SEO" panel, the blog, location pages, and
// service copy can each pull the cluster they're relevant to without drifting.
//
// These terms drive:
//   - the SEO panel's "target queries" column (what each page is meant to win)
//   - the location landing pages (src/pages/locations/[slug].astro)
//   - the llms.txt summary in /public (what AI assistants should cite us for)
//   - copy reviews (so new pages use the established phrasing, not synonyms)
//
// Every phrase below is a real, high-intent query a Las Vegas real estate
// photographer should be findable for. None are spammy or off-topic.

export interface KeywordGroup {
  /** Stable slug for cross-referencing from pages / admin. */
  slug: string;
  /** Human label, e.g. "Primary". */
  label: string;
  /** Short note on why this group matters / where it's used. */
  note: string;
  /** The actual search queries (lowercased as a searcher types them). */
  terms: string[];
}

export const seoKeywords: KeywordGroup[] = [
  {
    slug: "primary",
    label: "Primary",
    note: "Head terms the homepage and brand target.",
    terms: [
      "las vegas real estate photographer",
      "virtual tours las vegas",
      "real estate photography las vegas",
    ],
  },
  {
    slug: "service-specific",
    label: "Service-specific",
    note: "One phrase per service page; each maps to a page under /services/.",
    terms: [
      "matterport las vegas",
      "drone photography las vegas",
      "hdr photography las vegas",
      "3d virtual tour las vegas",
      "floor plan creator las vegas",
      "virtual staging las vegas",
      "twilight photography las vegas",
      "zillow 3d home las vegas",
      "google street view las vegas",
      "real estate photography pricing las vegas",
    ],
  },
  {
    slug: "commercial",
    label: "Commercial",
    note: "Targeted by /services/commercial/ and commercial sub-pages.",
    terms: [
      "commercial real estate photographer las vegas",
      "commercial photography las vegas",
      "apartment photography las vegas",
      "hotel virtual tour las vegas",
      "retail space photography las vegas",
      "office space virtual tour las vegas",
      "restaurant photography las vegas",
      "construction documentation las vegas",
    ],
  },
  {
    slug: "geographic",
    label: "Geographic (valley)",
    note: "Neighborhoods and cities inside the Las Vegas Valley. Each has a /neighborhoods/ anchor and (for the cities) a /locations/ landing page.",
    terms: [
      "henderson real estate photographer",
      "summerlin photographer",
      "north las vegas photography",
      "boulder city real estate photos",
      "clark county photographer",
      "spring valley real estate photography",
      "centennial hills photographer",
      "anthem real estate photographer",
      "inspirada photographer",
      "cadence photographer",
      "lake las vegas photographer",
      "macdonald highlands photographer",
      "seven hills photographer",
    ],
  },
  {
    slug: "extended-radius",
    label: "Extended radius",
    note: "Nearby cities beyond the valley where Mike travels for the right job.",
    terms: [
      "real estate photographer mesquite nv",
      "real estate photographer pahrump nv",
      "photographer st george utah",
      "photographer kingman arizona",
      "photographer bullhead city az",
      "photographer laughlin nv",
      "real estate photographer moapa valley",
      "real estate photographer searchlight nv",
      "photographer overton nv",
      "photographer logandale nv",
    ],
  },
  {
    slug: "niche",
    label: "Niche & credential",
    note: "Trust/credential and use-case phrases that pre-qualify the buyer.",
    terms: [
      "faa part 107 drone photographer las vegas",
      "google trusted photographer las vegas",
      "matterport service partner las vegas",
      "zillow certified photographer las vegas",
      "real estate twilight photographer",
      "luxury home photographer las vegas",
      "vacation rental photographer las vegas",
      "airbnb photographer las vegas",
      "vrbo photographer las vegas",
      "property management photography las vegas",
      "mls photography las vegas",
      "listing photography las vegas",
      "real estate marketing las vegas",
      "property tour las vegas",
      "360 virtual tour las vegas",
      "architectural photographer las vegas",
      "interior photographer las vegas",
      "commercial drone pilot las vegas",
    ],
  },
];

/** Flat list of every term across all groups (handy for the llms.txt summary
 *  and the admin SEO panel). Deduplicated, order preserved. */
export const allKeywords: string[] = Array.from(
  new Set(seoKeywords.flatMap((g) => g.terms))
);

/** All terms relevant to a given location slug, for the location landing pages. */
export function keywordsForLocation(slug: string): string[] {
  // Match any term that contains the location name (handles "henderson",
  // "summerlin", etc. appearing mid-phrase).
  return allKeywords.filter((t) => t.includes(slug));
}
