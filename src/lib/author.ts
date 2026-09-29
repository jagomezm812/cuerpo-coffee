// Site-wide author (docs/BUSINESS-PLAN.md: one founder voice, not
// per-article bylines) — src/content/author/author.yaml, edited as a
// Keystatic singleton. One entry, so `getCollection` + [0] is all this
// needs, no lookup key.
import { getCollection } from 'astro:content';

export async function getAuthor() {
  const [author] = await getCollection('author');
  return author;
}
