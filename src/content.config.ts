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
        category: z.enum(['troubleshooting', 'fundamentals', 'gear', 'methods', 'sourcing']),
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
      })
      .refine((data) => !data.heroImage || !!data.heroAlt, {
        message: 'heroAlt is required when heroImage is set',
        path: ['heroAlt'],
      }),
});

export const collections = { articles };
