// Session 4: the series data model. A series is a small, ordered group of
// articles (src/content.config.ts's `series` collection + an article's own
// `series`/`seriesOrder` fields) — grouping happens here, once, rather than
// in every page that needs it.
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { getPublishedArticles, type Lang } from './articles';

export type Series = CollectionEntry<'series'>;

export interface SeriesGroup {
  series: Series;
  articles: CollectionEntry<'articles'>[];
}

// Only series with at least one published article in the given language are
// returned — a series with nothing assigned to it yet (the "ready the
// moment there are enough articles" placeholder case) is simply absent, the
// same "hidden, not empty" pattern used everywhere else in this codebase.
export async function getSeriesGroups(lang: Lang): Promise<SeriesGroup[]> {
  const allSeries = await getCollection('series');
  const articles = await getPublishedArticles(lang);

  return allSeries
    .map((s) => ({
      series: s,
      articles: articles
        .filter((a) => a.data.series?.id === s.id)
        .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0)),
    }))
    .filter((group) => group.articles.length > 0);
}

export async function getSeriesGroupForArticle(
  article: CollectionEntry<'articles'>
): Promise<SeriesGroup | undefined> {
  if (!article.data.series) return undefined;
  const groups = await getSeriesGroups(article.data.lang);
  return groups.find((group) => group.series.id === article.data.series!.id);
}
