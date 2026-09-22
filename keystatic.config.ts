import { config, fields, collection } from '@keystatic/core';

const CATEGORY_OPTIONS = [
  { label: 'Troubleshooting', value: 'troubleshooting' },
  { label: 'Fundamentals', value: 'fundamentals' },
  { label: 'Gear', value: 'gear' },
  { label: 'Methods', value: 'methods' },
  { label: 'Sourcing', value: 'sourcing' },
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
      previewUrl: '/articles/{slug}',
      columns: ['title', 'category', 'publishDate', 'draft', 'featured'],
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
  },
});
