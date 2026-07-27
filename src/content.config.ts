// ===== Content Layer config (Astro 7) =====
// Defines the `blog` collection: Markdown posts under src/content/blog/.
// Each post frontmatter carries its own SEO title/description, author,
// publish date, category, and hero image. Drafts are excluded from builds.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    author: z.string().default("Mike Madsen"),
    category: z.string(),
    draft: z.boolean().default(false),
    heroImage: z.string(),
    heroAlt: z.string(),
  }),
});

export const collections = { blog };
