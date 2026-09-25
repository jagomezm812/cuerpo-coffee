// Shared data-fetching logic for both the English (unprefixed) and Spanish
// (/es/) article routes, so the two route trees don't duplicate query logic
// — only the thin route files under src/pages/articles/ and
// src/pages/es/articles/ differ, calling into these same functions.
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Lang = 'en' | 'es';
export type Article = CollectionEntry<'articles'>;

export async function getPublishedArticles(lang: Lang): Promise<Article[]> {
  const articles = await getCollection(
    'articles',
    ({ data }) => !data.draft && data.lang === lang
  );
  return articles.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export function getArticleHref(article: Article): string {
  return article.data.lang === 'es' ? `/es/articles/${article.id}` : `/articles/${article.id}`;
}

export function getCategoryHref(lang: Lang, category: string): string {
  return lang === 'es' ? `/es/articles/category/${category}` : `/articles/category/${category}`;
}

export function getArticlesIndexHref(lang: Lang): string {
  return lang === 'es' ? '/es/articles' : '/articles';
}

// The English article an entry translates (only set on Spanish entries) or,
// for an English entry, its own Spanish translation if one exists — used
// for the "Read in English" / "Leer en español" cross-links on article
// pages, and for the language-preference prompt's redirect target.
export async function getTranslationHref(article: Article): Promise<string | undefined> {
  if (article.data.lang === 'es') {
    if (!article.data.translationKey) return undefined;
    return `/articles/${article.data.translationKey.id}`;
  }

  const spanishArticles = await getPublishedArticles('es');
  const translation = spanishArticles.find(
    (es) => es.data.translationKey?.id === article.id
  );
  return translation ? getArticleHref(translation) : undefined;
}
