import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(60),
        description: z.string().min(120).max(155),
        publishDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        category: z.enum(['troubleshooting', 'fundamentals', 'gear', 'methods', 'sourcing', 'reflection']),
        tags: z.array(z.string()).default([]),
        heroImage: image().optional(),
        heroAlt: z.string().optional(),
        draft: z.boolean().default(false),
        featured: z.boolean().default(false),
        lang: z.enum(['en', 'es']).default('en'),
        // Only set on a non-English entry: the id (slug) of the English
        // article it translates. reference('articles') makes this a real
        // foreign-key check — the build fails loudly if it points at a
        // slug that doesn't exist, consistent with this schema's existing
        // "fail loudly, don't skip silently" rule for heroAlt.
        translationKey: reference('articles').optional(),
        // Session 4: the series data model. Both set together or neither —
        // an article's position only means something in the context of a
        // specific series, so one without the other is a content error,
        // not a valid "half-configured" state.
        series: reference('series').optional(),
        seriesOrder: z.number().int().positive().optional(),
      })
      .refine((data) => !data.heroImage || !!data.heroAlt, {
        message: 'heroAlt is required when heroImage is set',
        path: ['heroAlt'],
      })
      .refine((data) => !!data.series === !!data.seriesOrder, {
        message: 'series and seriesOrder must be set together',
        path: ['seriesOrder'],
      }),
});

// A series is a small, ordered group of articles — title and description
// only, no body content of its own (the reading happens in the articles).
// A separate collection (not a field on articles alone) so a series' own
// title/description can be edited once, in one place, and so more than one
// article can reference the same series entry via reference('series').
const series = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

// Site-wide author config (docs/BUSINESS-PLAN.md: a single founder voice,
// not per-article bylines). One entry, edited as a Keystatic singleton
// (see keystatic.config.ts) rather than a code file, since the owner isn't
// a developer. Now real content (name, title, avatar) — replace at
// /keystatic under "Author" if any of it changes.
// `bio` was renamed to `title` (a short role line, e.g. "Founder, Cuerpo
// Coffee") rather than kept alongside a new bio sentence — no bio copy was
// ever provided, and inventing one would break this schema's own
// "don't fabricate real content" precedent (the same one that justified
// shipping this collection with placeholder text in the first place).
const author = defineCollection({
  loader: glob({ pattern: 'author.yaml', base: './src/content/author' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      title: z.string(),
      avatar: image().optional(),
    }),
});

export const collections = { articles, series, author };
