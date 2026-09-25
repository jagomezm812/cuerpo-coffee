// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import remarkInlineSubscribe from './src/lib/remark-inline-subscribe.mjs';

// This feeds canonical URLs, Open Graph tags, and (from Phase 2) the sitemap and RSS feed.
export default defineConfig({
  site: 'https://cuerpo.coffee',
  // React islands are available project-wide (not just Keystatic) — each
  // usage still needs to ship 0 KB to pages that don't use it.
  integrations: [react()],
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    // English stays unprefixed (no URL changes to the already-published
    // site); Spanish gets /es/. The tradeoff: Spanish routes need their own
    // files under src/pages/es/ rather than one shared [locale] route tree,
    // since the default locale being unprefixed is structurally asymmetric
    // with a prefixed one. Those route files call the same shared helpers
    // in src/lib/articles.ts as the English routes, so there's still one
    // source of truth for the actual rendering logic.
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    // Astro's default Markdown processor (Sätteri) doesn't support custom
    // remark plugins, so opting into the remark/rehype pipeline via
    // @astrojs/markdown-remark's unified() is required for
    // remark-inline-subscribe (the mid-article email capture placement) to
    // run. Build-time only — no client bundle cost.
    processor: unified({ remarkPlugins: [remarkInlineSubscribe] }),
  },
});
