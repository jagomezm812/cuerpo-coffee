// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// This feeds canonical URLs, Open Graph tags, and (from Phase 2) the sitemap and RSS feed.
export default defineConfig({
  site: 'https://cuerpo.coffee',
  // React is used for exactly one thing: the Keystatic admin UI at /keystatic,
  // mounted client:only. It ships zero JS to any public-facing page.
  integrations: [react()],
});
