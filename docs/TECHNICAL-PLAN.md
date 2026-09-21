# Cuerpo Coffee — Technical Plan

**A build specification written to be handed to Claude Code.**
Save this in the repo as `docs/TECHNICAL-PLAN.md`. Section 13 contains the `CLAUDE.md` to place at the repo root.

---

## 1. Project brief

Cuerpo Coffee is an English-language coffee publication. The site is a fast, editorial, image-forward blog with email capture on every article, and — in a later phase — a single product page selling a digital guide.

The owner is not a developer. They can run commands that are given to them, but they will not debug code. Every decision below optimizes for: **low running cost, nothing to maintain, nothing that can break while unattended, and publishing without touching a terminal.**

---

## 2. Non-negotiable constraints

These are settled. Do not propose alternatives unless a constraint below becomes technically impossible.

| Constraint | Reason |
|---|---|
| Static output only. No server, no database. | Nothing to patch, nothing to be exploited, no monthly bill. |
| Articles are Markdown files committed to the repo. | Portable, versioned, owned forever, zero cost. |
| Hosted on **Cloudflare Pages**, not Vercel. | Vercel's free Hobby plan is restricted to non-commercial use; this site will sell a product. Cloudflare Pages free allows commercial use, gives unlimited bandwidth, 500 builds/month, 25 MiB max per file. |
| No client-side JavaScript unless a feature genuinely requires it. | Performance is part of the brand. |
| No comments system, no popups, no cookie banner. | Nothing that needs consent means no banner. Keep it that way. |
| No third-party analytics scripts beyond Cloudflare Web Analytics. | Privacy, speed, and no cookie banner. |
| Publishing must be possible from a browser. | The owner will not use a terminal weekly. |

---

## 3. Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Astro** (latest stable), static output | Content-first, ships ~zero JS by default, first-class Markdown/MDX, content collections with schema validation. Next.js is a heavier tool for a problem this shape. |
| Content | Markdown/MDX in `src/content/`, typed with Astro content collections | Schema validation catches malformed frontmatter at build time rather than in production. |
| Styling | Plain CSS with custom properties, in one design-token file | No Tailwind. The owner will read this CSS occasionally; tokens are more legible than utility soup, and the design system here is small. |
| Editing UI | **Keystatic** mounted at `/keystatic`, GitHub mode | Browser-based editor that commits Markdown to the repo. Fallback if it proves awkward: Sveltia CMS or Decap CMS — same model, same content files, so the choice is reversible. |
| Host | Cloudflare Pages, Git integration, auto-deploy on push to `main` | Free, commercial use permitted, global CDN, preview deploy per branch. |
| DNS + registrar | Cloudflare | At-cost domains, zero-config SSL, same dashboard as hosting. |
| Analytics | Cloudflare Web Analytics | Free, cookieless, no consent banner required. |
| Email | Kit (formerly ConvertKit), free plan | Free to 10,000 subscribers with unlimited broadcasts, forms and landing pages. Embed via its hosted form endpoint — no JS widget. |
| Payments (Phase 4) | Lemon Squeezy | 5% + $0.50, no monthly fee, and acts as merchant of record so global VAT is handled rather than falling on a Mexico-based seller. Polar is a cheaper alternative (4% + $0.40) if preferred. |

---

## 4. Repository structure

```
cuerpo-coffee/
├── CLAUDE.md                  # context for every Claude Code session
├── docs/
│   ├── TECHNICAL-PLAN.md      # this file
│   └── LEARNING-GUIDE.md
├── keystatic.config.ts
├── astro.config.mjs
├── package.json
├── public/
│   ├── fonts/                 # self-hosted woff2 only
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── content/
    │   ├── config.ts          # collection schemas
    │   └── articles/
    │       └── why-your-coffee-tastes-sour.md
    ├── components/
    │   ├── BaseHead.astro
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── ArticleCard.astro
    │   ├── EmailCapture.astro
    │   └── Prose.astro
    ├── layouts/
    │   ├── Base.astro
    │   └── Article.astro
    ├── pages/
    │   ├── index.astro
    │   ├── articles/
    │   │   ├── index.astro
    │   │   └── [...slug].astro
    │   ├── about.astro
    │   ├── subscribe.astro
    │   ├── rss.xml.ts
    │   └── 404.astro
    └── styles/
        ├── tokens.css
        └── global.css
```

---

## 5. Content model

`src/content/config.ts` defines one collection, `articles`, with this schema:

```ts
{
  title: string,              // ≤ 60 chars, used as <h1> and <title>
  description: string,        // 120–155 chars, meta description + card excerpt
  publishDate: date,
  updatedDate: date | undefined,
  category: 'troubleshooting' | 'fundamentals' | 'gear' | 'methods' | 'sourcing',
  tags: string[],             // default []
  heroImage: image | undefined,
  heroAlt: string | undefined,   // required when heroImage is present
  draft: boolean,             // default false; drafts excluded from build
  featured: boolean           // default false; max one featured on homepage
}
```

Rules:
- Filename is the slug. Lowercase, hyphenated, no dates in the filename.
- `draft: true` articles must be excluded from the production build, the article index, RSS, and the sitemap.
- The build must **fail loudly** on a schema violation rather than silently skipping an article.

---

## 6. Design system

Define everything below in `src/styles/tokens.css` as custom properties. No hardcoded colors or sizes anywhere else in the codebase.

### Palette

```css
--ink:      #1A1614;   /* body text, near-black warm */
--espresso: #3B2C24;   /* secondary text, borders */
--muted:    #8A7B70;   /* metadata, captions */
--crema:    #F4EDE4;   /* page background */
--paper:    #FBF9F6;   /* card/raised surfaces */
--copper:   #8C4B2F;   /* the single accent: links, rules, small marks */
--line:     rgba(26, 22, 20, 0.12);
```

Six colors plus a line color. Do not add a seventh. The accent appears rarely — that's what makes it read as expensive.

### Typography

- **Display / headings:** Fraunces — optical sizing enabled, `WONK` axis off, weight 500–600. Characterful without being decorative.
- **Body / UI:** Inter — weights 400 and 500 only.
- Self-host both as `woff2` in `public/fonts/` with `font-display: swap`. Do not load Google Fonts over the network; it adds a third-party connection and a render delay.

Fluid type scale using `clamp()`:

| Token | Range |
|---|---|
| `--step--1` | 0.875–0.9375rem |
| `--step-0` | 1.0625–1.125rem (body) |
| `--step-1` | 1.33–1.5rem |
| `--step-2` | 1.66–2rem |
| `--step-3` | 2.1–2.8rem |
| `--step-4` | 2.6–4rem (article h1) |

Article body line-height 1.65, measure capped at **68ch**. Measure is the single highest-leverage readability decision on the site.

### Spacing

A single scale, powers of a 4px base: `4 8 12 16 24 32 48 64 96 128`. Expose as `--space-1` through `--space-9`. Vertical rhythm between article sections should feel generous — err toward more space than looks right at first.

### Rules of the look

- No box shadows. No border radius above 2px. No gradients. No animations beyond a 150ms color transition on links.
- Images are full-bleed or full-measure, never floated.
- The header is text only: wordmark left, three links right. No hamburger on desktop; on mobile, a plain expanded list is preferable to a menu drawer.
- Maximum two typefaces and three weights across the entire site.

---

## 7. Page specifications

### `/` — Homepage
Wordmark and tagline above the fold with a large amount of whitespace. One featured article with hero image, then the six most recent articles as text-forward cards (title, description, category, date). Email capture block before the footer. No hero carousel, no "as seen in," no testimonial section.

### `/articles` — Index
All non-draft articles, reverse chronological, with category filter links that resolve to real static URLs (`/articles/category/gear`) rather than client-side filtering. No pagination until there are more than 30 articles.

### `/articles/[slug]` — Article
Title, description as a standfirst, date, reading time, then the body. Email capture inline after the second `<h2>` and again after the final paragraph. Two related articles at the end, matched by category. No sidebar, no share buttons, no author box.

### `/about` — About
One page. Who you are, why coffee, what this publication is for. A real photograph. This page converts more subscribers per visit than any other; write it properly.

### `/subscribe` — Landing page
Standalone, no header navigation. Single purpose: the lead magnet (*The Home Coffee Checklist*) in exchange for an email.

### `/404`
Keep the brand voice. Link back to `/articles`.

### `/rss.xml`
Full-content feed of non-draft articles.

---

## 8. Technical requirements

**Performance targets, verified on a real deploy:**
- Lighthouse Performance ≥ 95 on mobile
- Largest Contentful Paint < 1.5s on 4G
- Total JS payload < 20 KB on an article page
- Every image served as AVIF/WebP via Astro's image pipeline, with explicit `width`/`height` to prevent layout shift

**SEO:**
- One `<h1>` per page; heading levels never skip
- `<title>` and meta description from frontmatter
- Canonical URL on every page
- Open Graph and Twitter card tags; OG images generated at build time from the article title if no hero image exists
- `Article` JSON-LD structured data on article pages
- `sitemap.xml` via `@astrojs/sitemap`, excluding drafts
- `robots.txt` allowing everything except `/keystatic`

**Accessibility:**
- Contrast ≥ 4.5:1 for body text (verify `--muted` on `--crema` specifically — it is the likely failure)
- Visible focus states, not `outline: none`
- Alt text required by schema when a hero image is present
- Site must be fully usable with JavaScript disabled

---

## 9. Build phases

Each phase ends with a working deploy. Do not start the next phase until the previous one is live and reviewed.

### Phase 1 — Skeleton (target: 2 sessions)
Scaffold Astro, define tokens and global styles, build `Base` and `Article` layouts, `Header`/`Footer`, homepage, article index, article template, about page, 404. Seed with three real articles. Connect the GitHub repo to Cloudflare Pages and verify auto-deploy on push.

**Done when:** the custom domain serves the site over HTTPS and pushing a Markdown file publishes an article.

### Phase 2 — Publishing and plumbing (target: 1 session)
Keystatic at `/keystatic` in GitHub mode, configured against the `articles` collection with every frontmatter field editable. Kit form embedded in `EmailCapture`. `/subscribe` landing page. Cloudflare Web Analytics. RSS, sitemap, OG image generation. Image optimization pipeline.

**Done when:** the owner can write and publish an article end-to-end in a browser, and a new subscriber lands in Kit.

### Phase 3 — Freeze
No further code changes. All effort moves to writing. Any design idea gets written into `docs/BACKLOG.md` and batched for a single session in month four. **This phase is the plan's actual risk control** — the common failure for a non-developer running their own site is perpetual redesign.

### Phase 4 — Product (target: 1–2 sessions, month 5)
`/method` sales page: problem, what's inside, who it's for, price, FAQ, Lemon Squeezy hosted checkout button. `/method/waitlist` capturing to a dedicated Kit tag. Post-purchase thank-you page. Delivery is handled entirely by Lemon Squeezy — do not build file hosting, license keys, or gated content.

**Done when:** a test purchase completes and delivers the file.

---

## 10. Explicitly out of scope

Do not build, and do not suggest building: a CMS with a database, user accounts or login, a comments system, a search index (Cloudflare and Google cover it at this scale), dark mode, an admin dashboard, a mobile app, server-side rendering, Docker, a CI pipeline beyond Cloudflare's own build, or any framework component (React/Vue/Svelte) unless a specific interaction demands it and no static solution exists.

Every item on that list is a maintenance burden that will outlive the enthusiasm that motivated it.

---

## 11. Deployment

- `main` is production. Every push triggers a Cloudflare Pages build and deploy.
- Any other branch produces a preview URL. Use a branch for anything visual so it can be reviewed before it goes live.
- Build command `npm run build`, output directory `dist`.
- Environment variables (Keystatic GitHub app credentials, Kit form ID) live in Cloudflare Pages project settings. **Never commit a secret to the repo.**
- Recovery from a bad deploy: roll back to the previous deployment in the Cloudflare dashboard, then fix forward. Do not attempt a Git surgery to recover a broken site.

---

## 12. Working agreement for Claude Code sessions

- Read `CLAUDE.md` and this file at the start of every session.
- One change per session unless changes are trivially independent. Deploy and review before continuing.
- When something visual is wrong, ask for a screenshot rather than guessing from a description.
- Explain *why* when introducing a new concept — the owner is learning the stack as the project is built. Keep explanations to a few sentences and don't repeat them once learned.
- Never introduce a dependency without stating what it costs (bundle size, maintenance, lock-in) and what the alternative is.
- If a requirement in this document turns out to be wrong, say so and propose an amendment rather than silently working around it.

---

## 13. `CLAUDE.md` for the repo root

```markdown
# Cuerpo Coffee

English-language coffee publication. Teaches beginners to make good coffee at home.
Selling a paid digital guide from month 5.

## Owner
Not a developer. Can run given commands; will not debug code. Explain new concepts briefly.

## Stack
Astro (static) · Markdown content collections · plain CSS with tokens · Keystatic at /keystatic ·
Cloudflare Pages · Kit (email) · Lemon Squeezy (payments, phase 4)

## Hard rules
- Static output only. No server, no database.
- No client-side JS unless a feature truly requires it. JS budget: 20 KB per article page.
- No Tailwind. All design values come from src/styles/tokens.css.
- No new dependencies without stating the cost and the alternative.
- Never commit secrets. Environment variables live in Cloudflare Pages settings.
- Out of scope: comments, accounts, search, dark mode, SSR, React/Vue/Svelte.

## Design
Palette: --ink --espresso --muted --crema --paper --copper. Six colors, no more.
Type: Fraunces (display), Inter (body). Self-hosted woff2. Two faces, three weights, total.
No shadows, no gradients, radius ≤ 2px, measure capped at 68ch.
The aesthetic is restraint. When in doubt, remove something.

## Before you start
Read docs/TECHNICAL-PLAN.md. It is the spec. Phase 3 is a code freeze — during it,
design ideas go to docs/BACKLOG.md rather than into the codebase.
```
