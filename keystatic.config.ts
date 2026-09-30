import { config, fields, collection, singleton } from '@keystatic/core';

const CATEGORY_OPTIONS = [
  { label: 'Troubleshooting', value: 'troubleshooting' },
  { label: 'Fundamentals', value: 'fundamentals' },
  { label: 'Gear', value: 'gear' },
  { label: 'Methods', value: 'methods' },
  { label: 'Sourcing', value: 'sourcing' },
  { label: 'Reflection', value: 'reflection' },
] as const;

const LANG_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
] as const;

export default config({
  storage: {
    kind: 'github',
    repo: 'jagomezm812/cuerpo-coffee',
  },
  collections: {
    articles: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'src/content/articles/*',
      format: { contentField: 'content' },
      // Always points at the English URL shape — Keystatic's previewUrl is a
      // flat string template with no way to branch on the lang field, so
      // this is wrong for Spanish entries (known gap, not fixable cleanly;
      // their real URL is /es/articles/{slug}).
      previewUrl: '/articles/{slug}',
      columns: ['title', 'lang', 'category', 'publishDate', 'draft', 'featured'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { length: { max: 60 } },
          },
        }),
        description: fields.text({
          label: 'Description',
          description: 'Meta description and card excerpt. 120–155 characters.',
          multiline: true,
          validation: { isRequired: true, length: { min: 120, max: 155 } },
        }),
        publishDate: fields.date({
          label: 'Publish date',
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({
          label: 'Updated date',
          validation: { isRequired: false },
        }),
        category: fields.select({
          label: 'Category',
          options: CATEGORY_OPTIONS,
          defaultValue: 'fundamentals',
        }),
        lang: fields.select({
          label: 'Language',
          options: LANG_OPTIONS,
          defaultValue: 'en',
        }),
        translationKey: fields.relationship({
          label: 'Translation of',
          description:
            'Only set this on a Spanish article — pick the English article it translates.',
          collection: 'articles',
          validation: { isRequired: false },
        }),
        series: fields.relationship({
          label: 'Series',
          description: 'Only set this if the article is part of a series. Also set the position below.',
          collection: 'series',
          validation: { isRequired: false },
        }),
        seriesOrder: fields.integer({
          label: 'Position in series',
          description: 'Only set this alongside Series above (1, 2, 3, ...).',
          validation: { isRequired: false },
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Tag',
        }),
        heroImage: fields.image({
          label: 'Hero image',
          description: 'Optional. Set alt text below if you add one.',
          directory: 'src/content/articles/images',
          validation: { isRequired: false },
        }),
        heroAlt: fields.text({
          label: 'Hero image alt text',
          description: 'Required whenever a hero image is set.',
          validation: { isRequired: false },
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Draft articles are excluded from the build.',
          defaultValue: false,
        }),
        featured: fields.checkbox({
          label: 'Featured',
          description: 'At most one article should be featured at a time.',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Content',
          extension: 'md',
        }),
      },
    }),
    series: collection({
      label: 'Series',
      slugField: 'title',
      path: 'src/content/series/*',
      format: 'yaml',
      columns: ['title'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
  },
  singletons: {
    // Site-wide author config (docs/BUSINESS-PLAN.md: one founder voice,
    // not per-article bylines) — edited here, once, rather than as a code
    // file, since the owner isn't a developer.
    author: singleton({
      label: 'Author',
      path: 'src/content/author/author',
      format: 'yaml',
      schema: {
        name: fields.text({ label: 'Name', validation: { isRequired: true } }),
        title: fields.text({
          label: 'Title',
          description: 'A short role line, e.g. "Founder, Cuerpo Coffee".',
          validation: { isRequired: true },
        }),
        avatar: fields.image({
          label: 'Avatar',
          description: 'A tight square headshot — used in the author box at the end of every article.',
          directory: 'src/assets/author',
          validation: { isRequired: false },
        }),
      },
    }),
  },
});
