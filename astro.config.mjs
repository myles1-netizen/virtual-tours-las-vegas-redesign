import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site → served from /virtual-tours-las-vegas-redesign/ on build.
// `astro dev` sets NODE_ENV to 'development', so local dev defaults to / for convenience;
// `astro build` (production) defaults to the GH Pages subpath. Override either with BASE_PATH.
const SITE = process.env.SITE_URL || 'https://mylesthepro1.github.io';
const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  site: SITE,
  base: process.env.BASE_PATH || (isDev ? '/' : '/virtual-tours-las-vegas-redesign/'),
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
    defaultStrategy: 'viewport',
  },
  compressHTML: true,
});
