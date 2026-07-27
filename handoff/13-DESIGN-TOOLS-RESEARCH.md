# 13 — Design/Animation Tools Research (Astro Site Rebuild)

Researched July 2026 for Virtual Tours Las Vegas rebuild. Site stack: Astro (HTML/CSS/vanilla-JS by default, React/Vue/Svelte islands optional). Brand: paper/ink/brass-gold palette, Fraunces serif + Inter sans, "ultra-professional," zero tolerance for fake/AI-fabricated content standing in for real photography.

These 8 tools came from a YouTube "design tools" roundup — names/descriptions were not fully accurate going in, so each was independently verified against its real site/docs.

---

## 1. KokonutUI

**Verdict: Skip it (wrong aesthetic + wrong stack fit), or cherry-pick one SVG-filter technique at most.**

- **What it is:** A free, open-source (MIT) library of 100+ React + Tailwind + shadcn/ui components, including a "Liquid Glass" card/button built with SVG `feTurbulence`/`feDisplacementMap`/`feGaussianBlur` filters to mimic Apple's iOS 18/26 "liquid glass" refraction effect.
- **Free/paid:** Core library is fully free/MIT. A separate paid "KokonutUI Pro" exists ($99 one-time, discounted from $169) for premium templates; custom components start at $799 and custom pages at $2,999 — irrelevant here.
- **Astro integration:** Built for React + Tailwind + shadcn/ui specifically. Using it in Astro means pulling in a React island (hydration cost) just to get a glass-panel effect. The underlying SVG-filter technique itself is framework-agnostic and could be hand-copied into a `.astro` component without the React dependency.
- **Bundle/perf cost:** Not heavy (SVG filters, no WebGL), but importing via React island adds React runtime + hydration overhead for what is essentially a CSS/SVG effect.
- **Fit for this site:** "Liquid glass" is an Apple-consumer-tech visual language — frosted, glossy, animated distortion. It reads as trendy/techy, not as "upscale real estate photography brand with paper/ink/brass." It would clash with the established aesthetic rather than elevate it. If any glass/frosted look is ever wanted (e.g., a subtle frosted-glass nav bar on scroll), it's a 10-line CSS `backdrop-filter: blur()` — no library needed at all.

## 2. React Bits

**Verdict: Skip it for this site — wrong genre of tool.**

- **What it is:** A large open-source library (110+ components) of animated/interactive React components: shader-based backgrounds (metallic swirls, iridescence, gradient blinds, aurora/mesh effects), particle fields, text animations, etc. Built on WebGL/canvas/Motion.
- **Free/paid:** Free tier is MIT-licensed, copy-paste components. "React Bits Pro" is a one-time purchase (~$74 launch price) adding 158+ pre-built blocks, 11+ landing templates, and a commercial license for unlimited projects.
- **Astro integration:** React-only components; each one is a full React component requiring a React island in Astro (`client:load`/`client:visible`). Not framework-agnostic — no vanilla JS export path.
- **Bundle/perf cost:** WebGL shader backgrounds are the heaviest category here — real GPU cost, larger JS payloads, and they actively compete with page content for attention.
- **Fit for this site:** These shader-gradient/particle backgrounds are the signature look of crypto/AI-SaaS/dev-tool landing pages — exactly the "flashy tech-startup" aesthetic the client wants to avoid. A swirling animated shader behind a real estate hero photo would undercut trust and look like a template, not a bespoke professional brand. Not recommended, even selectively.

## 3. Bklit (Bklit UI)

**Verdict: Skip — solves a problem this site doesn't have.**

- **What it is:** A chart/data-visualization component library built on D3 + react-motion (Motion), extending shadcn/ui with line/area/bar/pie/radar/ring/sankey/funnel/gauge/candlestick/choropleth charts. Includes "Bklit Studio," a separate tool for customizing charts and exporting them as SVG or as recorded video clips.
- **Free/paid:** The chart components themselves are MIT-licensed and free. "Bklit Studio" (the video-export tool) is a proprietary/commercial product, not part of the free library.
- **Astro integration:** React components on top of shadcn/ui — same React-island requirement as the others above.
- **Fit for this site:** This is a data-viz/analytics tool aimed at dashboards, SaaS metrics pages, and finance/analytics products. Virtual Tours Las Vegas is a photography business with a portfolio, service cards, and a pricing page — there is no legitimate use case for candlestick charts, sankey diagrams, or animated-chart video exports anywhere on this site. This tool doesn't fit the project at all; it was likely mis-described in the source video. No recommendation, no partial use.

## 4. Limora

**Verdict: Do not use for anything client-facing. Hard no on real-estate imagery; at most a narrow, clearly-disclosed use for pure abstract textures — and even that should be avoided given the project's photography-integrity policy.**

- **What it is:** Limora (limora.ai) is an AI asset generator marketed at designers: you upload a brand kit (logo, colors, fonts) and it generates "on-brand" hero images, icons, backgrounds, and other graphics matching that style — 14+ asset types including images, backgrounds, and short motion/video assets. (Note: there is also an unrelated app called "Limora" for AI beauty/selfie photo editing at limora.beauty — different product, not relevant here; verify you're looking at limora.ai if evaluating further.)
- **Free/paid:** Short free trial (around 3 days per third-party reviews), then subscription pricing (roughly $7.99/week or ~$29.99/month tier reported for the consumer variant; the designer-focused limora.ai likely has separate SaaS pricing not fully published). Not a meaningfully free tool for production use.
- **Astro integration:** N/A — it's a SaaS design tool / image generator, not a code library. Output would be static image/video files dropped into the site, no runtime integration at all.
- **Fit for this site — flag explicitly:** This project has a hard rule that real property photos must stay real; nothing AI-generated may stand in for or be mixed in with actual listing photography. Limora's entire value proposition is generating images that *look like* photographed brand content — hero images, property-adjacent visuals, lifestyle imagery — which is precisely the failure mode to avoid on a real estate photography business's own site (the irony of a photography company using fake photos would also be a credibility risk with clients). 
  - **Narrow legitimate exception:** an abstract, non-representational background texture (e.g., a subtle paper-grain or ink-wash pattern for a section background) that makes no claim to depict any real property, person, or space could theoretically be generated with a tool like this without violating the "no fabricated photography" rule, since it's decoration, not documentary content.
  - **Recommendation:** Even for that narrow case, skip it. The brand already has paper/ink texture as an established design language, and CSS/SVG noise textures or actual scanned paper/ink assets can achieve the same effect without introducing an AI-generation dependency or the appearance-of-fakery risk at all. Not worth the ambiguity for a business this reputation-sensitive.

## 5. Anime.js (v4)

**Verdict: Use it — good fit, and it is vanilla JS so it's a natural match for Astro's default (non-island) approach.**

- **What it is:** A long-standing, mature, framework-agnostic JavaScript animation engine (animejs.com / juliangarnier/anime on GitHub). V4 (current as of 2026) rebuilt the core as a modular, tree-shakeable engine with a dedicated Scroll Observer API for scroll-triggered animation and a simplified SVG module for path drawing, motion-along-path, and shape morphing.
- **Free/paid:** Fully free and open source (MIT), no paid tier.
- **Astro integration:** This is its biggest advantage over the React-based options above — Anime.js is pure vanilla JS with zero framework dependency. It drops directly into an Astro `<script>` tag or a small client-side module, no island/hydration overhead at all. This is the most Astro-native option on the list.
- **Bundle/perf cost:** Small and modular — v4 explicitly optimized for tree-shaking, so a page using only, say, scroll-reveal and SVG line-draw only pays for those modules. Lightweight relative to WebGL/shader libraries.
- **Fit for this site:** Strong fit. Concrete uses: gentle scroll-triggered fade/slide-in for portfolio gallery items and service cards as they enter the viewport; SVG line-draw animation for a logo mark or section divider; subtle number/counter animation on stats (years in business, properties shot, etc.) on the about/services page. All of these read as polish, not gimmick, if kept subtle (short duration, small easing, no bounce/elastic overkill) — consistent with "ultra-professional."

## 6. Motion (motion.dev, formerly Framer Motion)

**Verdict: Use selectively — best fit if any interactive component genuinely needs a React/Vue island; skip for anything achievable in vanilla JS.**

- **What it is:** Framer Motion was spun out and rebranded to "Motion" in 2025, now living at motion.dev. It's a production-grade animation library originally for React, now expanded to also ship a vanilla JS API and Vue support. It's built around a hardware-accelerated, physics-based (spring) animation model — 4.5M+ weekly npm downloads, one of the most widely used animation libraries in the industry.
- **Free/paid:** Free and open source (MIT).
- **Astro integration:** Two paths — (1) `motion` (the vanilla JS build) can be used directly in an Astro `<script>` with no island needed, similar to Anime.js; (2) `motion/react` requires a React (or Vue) island if you want its declarative component API (`<motion.div>`, layout animations, `AnimatePresence`). For this site, path (1) is the relevant one unless a specific component (e.g., an interactive pricing calculator, if one exists per `08-PRICE-CALCULATOR-SPEC.md`) is already a React/Vue island, in which case Motion's React bindings are a very reasonable choice for enter/exit transitions on that component specifically.
- **Bundle/perf cost:** Reasonably lean for the vanilla build; the React build adds React itself if not already present. Physics-based spring easing looks natural rather than mechanical, which suits a "trustworthy, upscale-but-approachable" tone better than linear/bouncy default easings.
- **Fit for this site:** Good for interactive, stateful UI moments — pricing calculator step transitions, contact form success/error states, mobile nav open/close, filter transitions on the portfolio gallery. Overlaps with Anime.js in capability; recommend picking one as the primary animation engine (Anime.js if staying vanilla-JS-first per Astro's philosophy; Motion if any component ends up needing a JS framework island anyway) rather than shipping both.

## 7. Rive

**Verdict: Skip "interactive cursor animation" specifically — not a good fit and adds real production complexity; a state-machine micro-interaction (e.g., an animated logo mark or icon) is a legitimate but optional nice-to-have.**

- **What it is:** Rive is a real-time interactive design/animation tool with its own editor (like an animation-focused Figma) plus lightweight open-source runtimes (web, iOS, Android, Flutter, Unity, etc.) for embedding the resulting `.riv` files. Its strength is state-machine-driven animations that respond to user input (hover, click, drag, cursor position, data) rather than pre-baked video-like animation.
- **Free/paid:** Editor is free for unlimited personal files; free tier caps at 3 files within a collaborative Project, 10MB per uploaded asset, and limited export volume. Paid tiers: Cadet $9/mo (100MB asset limit), Voyager $32/mo, Enterprise $120/mo. Runtime/export playback itself has no license fee regardless of plan — files created and exported keep working free forever.
- **Astro integration:** Framework-agnostic by design — ships a vanilla JS/WebGL/Canvas web runtime (`@rive-app/canvas` or `@rive-app/webgl`) that works in a plain `<script>` tag in Astro, no React/Vue island required.
- **Bundle/perf cost:** Runtime itself is compact (~few hundred KB depending on renderer), but each `.riv` animation file is a separate asset to design, export, and maintain — real production overhead beyond just adding a library.
- **Fit for this site:** "Interactive cursor animation" (a character/mascot/blob that tracks the mouse) is a playful, personality-driven pattern suited to creative-agency or product-demo sites — it would read as gimmicky rather than professional here, and directly conflicts with "ultra-professional, not gimmicky." The legitimate, narrow use case would be something like an animated brass-gold logo mark that subtly reacts on hover/load (a state-machine micro-interaction, not a cursor-chasing character) — but this is optional polish, not a must-have, and introduces a new asset-authoring workflow (the Rive editor) for a solo/small team. Recommend skipping unless there's separate appetite for investing in a custom animated brand mark.

## 8. Magic UI

**Verdict: Skip the Globe and Animated Beam specifically — both are wrong-genre (dev-tool/SaaS "integrations" visuals); the broader library has some usable primitives if approached selectively.**

- **What it is:** A component library (150+ free components) built with React + TypeScript + Tailwind + Motion, explicitly positioned for marketing/landing pages. It does have documented Astro installation instructions (configuring Tailwind base styles for Astro), so it's Astro-aware, but components are still React and need an island.
- **Free/paid:** Free tier is MIT-licensed (150+ components). "Magic UI Pro" is a one-time payment ($199 individual lifetime license) adding 50+ prebuilt sections/5+ templates and a commercial-use license; a separate $499/mo tier exists for agencies needing unlimited projects.
- **Astro integration:** React components requiring a React island (`client:visible`, etc.) even with the documented Astro setup steps — Tailwind config guidance doesn't remove the React dependency for the interactive pieces.
- **Bundle/perf cost:** The Globe is WebGL (rotating 3D globe with connection arcs) — real GPU/JS cost, and it's a canonical "we have global infrastructure/integrations" SaaS visual. Animated Beam (a glowing line animating between two nodes to show a data/API "connection") is likewise a developer-tool visual metaphor.
- **Fit for this site:** Globe and Animated Beam specifically make no sense for a Las Vegas-focused local photography business — there's no "global network" or "integrations" story to tell, and both would look transplanted from a SaaS template. However, Magic UI's broader catalog does include more neutral primitives (marquee/logo-scroller for client logos, subtle border/shine effects, testimonial/review cards) that could be evaluated individually if a React island is already in play elsewhere on the site — but none of that is what was asked about (Globe/Beam), and it's not worth adding React just for those two components.

---

## If you only pick 2–3

1. **Anime.js** — the strongest overall fit. Free, vanilla JS, genuinely lightweight, and its scroll-triggered reveals + SVG line-draw are exactly the kind of "quiet polish" that elevates a professional site (gallery items, service cards, subtle dividers) without ever feeling gimmicky.
2. **Motion (vanilla build)** — use only where Anime.js's simpler model isn't enough, e.g. spring-physics micro-interactions on interactive elements (pricing calculator, form states, nav). Don't pull in the React build unless a React island already exists for other reasons — avoid running two animation engines redundantly; pick one as primary.
3. *(Optional, lower priority)* **Rive**, narrowly, only if there's appetite to commission a custom animated brand mark (logo micro-interaction) — skip the "cursor-following" pattern entirely as it doesn't suit the brand.

**Explicitly do not use:** KokonutUI, React Bits, Bklit, Magic UI's Globe/Animated Beam — all are visually and thematically built for tech-startup/SaaS/crypto-adjacent aesthetics that would undercut the "ultra-professional, upscale-but-approachable real estate photography" positioning. **Limora is a hard no** for anything client-facing given the project's zero-tolerance rule on fabricated imagery standing in for real photography; even its narrow "abstract texture" use case is better served by the site's existing paper/ink design language than by introducing an AI-image-generation dependency.
