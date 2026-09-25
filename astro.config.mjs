// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import remarkInlineSubscribe from './src/lib/remark-inline-subscribe.mjs';

// This feeds canonical URLs, Open Graph tags, and (from Phase 2) the sitemap and RSS feed.
export default defineConfig({
  site: 'https://cuerpo.coffee',
  // React is used for exactly one thing: the Keystatic admin UI at /keystatic,
  // mounted client:only. It ships zero JS to any public-facing page.
  integrations: [react()],
  markdown: {
    // Astro's default Markdown processor (Sätteri) doesn't support custom
    // remark plugins, so opting into the remark/rehype pipeline via
    // @astrojs/markdown-remark's unified() is required for
    // remark-inline-subscribe (the mid-article email capture placement) to
    // run. Build-time only — no client bundle cost.
    processor: unified({ remarkPlugins: [remarkInlineSubscribe] }),
  },
});
