import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cloudflare Pages serves from root — base is always /.
// For GitHub Pages fallback, set BASE_PATH env var.
const SITE = process.env.SITE_URL || 'https://virtualtourslasvegas.com';

export default defineConfig({
  site: SITE,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  compressHTML: true,
});
