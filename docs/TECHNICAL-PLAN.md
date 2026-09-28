# Cuerpo Coffee — Technical Plan

**A build specification written to be handed to Claude Code.**
Save this in the repo as `docs/TECHNICAL-PLAN.md`. Section 13 contains the `CLAUDE.md` to place at the repo root.

> **Version 1.1, design amendment (September 2026).** The owner approved a redesign that overrides parts of sections 6, 7, 8, 10 and 13: a light and dark theme, rounded cards, a sans-serif type system with a serif for page titles only, a section accent color (olive), simple CSS transitions, search, and richer article pages. The redesign's source of truth is the **Cuerpo Coffee Design System** (saved as `docs/DESIGN-SYSTEM.md` in the repo). Where this file and the design system disagree on look, the design system wins.
>
> **Still to refresh (not yet amended):** section 3 (the site is deployed as a Cloudflare Worker with static assets, not classic Pages, and Kit's free plan no longer includes automations), sections 9 and 11 (phases and deployment), and the additions built since v1.0: Keystatic with a GitHub OAuth App and Worker routes under `/api/`, English and Spanish routing (`/es/`), and the React integration.
>
> **Open item:** the first-visit language prompt is a ~70 KB React island. Confirm it hydrates on idle and only for first-time visitors, or replace it with a lighter script, so the 20 KB JavaScript budget on article pages holds.

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

## 6. Design system (amended v1.1)

The source of truth is the Cuerpo Coffee Design System (`docs/DESIGN-SYSTEM.md`). Define everything below in `src/styles/tokens.css` as custom properties, **using these exact token names**. No hardcoded colors or sizes anywhere else in the codebase.

### Palette

```css
:root {
  --surface-1: #FFFFFF;   /* white band: page, header, article body */
  --surface-2: #F5EFE6;   /* cream band */
  --surface-3: #E9DFD1;   /* sand band */
  --surface-card: #FFFFFF;/* cards on cream or sand bands */
  --ink: #1B1410;         /* text */
  --muted: #6B5F56;       /* secondary text: 5.4:1 on cream, 4.7:1 on sand */
  --hairline: #E9E1D7;  --hairline-strong: #DDD1C2;  --border: #D4C7B8;
  --olive: #59633A;        /* SECTION accent only: Troubleshooting tile and category pills */
  --olive-text: #59633A;   /* section labels, category names, rings, quote rule, progress line, leaf */
  --accent: #8A4E35;       /* copper fill: a small warm spark (Sourcing tile) */
  --accent-text: #8A4E35;  --accent-tint: #F3E3D8;         /* copper text, New badge */
  --button-bg: #1B1410;  --button-fg: #FFFFFF;             /* EVERY button, active chip, avatar disc */
  --tile-sand: #E9DFD1;  --tile-sand-ink: #1B1410;
  --tile-dark: #2A1D16;  --tile-black: #120C09;
  --roast: #2A1D16;  --footer: #120C09;
  --ink-on-dark: #F3EADF;  --muted-on-dark: #BBAC9D;
  --accent-on-dark: #E3AD84;  --olive-on-dark: #A9B47F;
  --shadow-lift: 0 24px 48px rgba(27, 20, 16, 0.10);
}
[data-theme="dark"] {
  --surface-1: #1A120E;  --surface-2: #231A14;  --surface-3: #2C2119;  --surface-card: #33261D;
  --ink: #F3EADF;  --muted: #BBAC9D;
  --hairline: #33261E;  --hairline-strong: #3E2F26;  --border: #55443A;
  --accent-text: #E3AD84;
  --button-bg: #F3EADF;  --button-fg: #1B1410;
  --olive-text: #A9B47F;
  --accent-tint: rgba(227, 173, 132, 0.16);
  --tile-sand: #3A2C22;  --tile-sand-ink: #F3EADF;
  --tile-dark: #3A2B21;  --tile-black: #0F0A07;
  --roast: #2E2219;  --footer: #0B0705;
  --shadow-lift: 0 24px 48px rgba(0, 0, 0, 0.5);
}
```

Two accents, both small: **olive** marks sections and **copper** is a warm spark. Olive (about 4% of a page) is allowed only on section labels, category names, section markers (series rings, the leaf ornament and rule, the pull-quote rule, the reading-progress line), the Troubleshooting tile and the category pills; on always-dark blocks it is the light olive `--olive-on-dark` for labels. **Olive is never a button, never a page or band background, never a link, headline or body text, and never a gradient.** Every button is neutral (`--button-bg` on `--button-fg`) and page backgrounds are only `--surface-1/2/3` and the always-dark blocks. Copper is limited to the Sourcing tile, the italic word in the Home hero and the New badge. Color follows topic: Troubleshooting olive, Fundamentals sand, Gear roast, Methods white, Sourcing copper, Reflection near-black.

### Typography

- **Display:** Fraunces, **page H1 only**, weight 300 to 400, optical sizing on, `WONK` off, letter-spacing -0.025em.
- **Everything else:** Manrope. H2 600 and card titles 700 with letter-spacing -0.035em; body 400; labels 12px, 700, uppercase, tracking 0.14em; the wordmark 800.
- Self-host both as `woff2` in `public/fonts/` with `font-display: swap`. Do not load Google Fonts over the network in production.

Fluid type scale using `clamp()`:

| Token | Range |
|---|---|
| `--step--1` | 0.875 to 0.9375rem |
| `--step-0` | 1.0625 to 1.25rem (body, up to 20px) |
| `--step-1` | 1.33 to 1.5rem |
| `--step-2` | 1.66 to 2rem |
| `--step-3` | 2.1 to 3.5rem (H2) |
| `--step-4` | 2.9 to 5.5rem (page H1, 46px on phones to 88px) |

Article body line-height 1.6 to 1.7, measure capped at **68ch** (a 680 to 720px column).

### Spacing

A single scale, powers of a 4px base: `4 8 12 16 24 32 48 64 96 128`, exposed as `--space-1` through `--space-10`. Bands use 96 to 104px of vertical padding and 120px side margins at 1440px. Vertical rhythm should feel generous: err toward more space than looks right at first.

### Shape and depth

Radius scale: `--radius-sm` 8px, `--radius-md` 20px (callouts), `--radius-lg` 28px (tiles, cards, photo spaces), `--radius-xl` 36px (newsletter card), `--radius-pill` 999px (buttons, chips, the email field). No gradients. Shadow only on hover-lift and the search dropdown, never at rest. Hairlines are 1px.

### Rules of the look

- **Layout:** full-width color-blocked bands in a fixed rhythm (white, cream, white, sand), then the newsletter band and a dark footer that is always last. At most **two large photo spaces per page**; every other card is typographic. Page H1 is the only serif.
- **Header:** wordmark left, links (Articles, Start here, Series, About), search, a dark-mode toggle, and a Subscribe button. On phones, search, the toggle and a menu.
- **Motion:** CSS only. Theme change 350ms color fade; card hover lift 4px (280ms); button lift 1px (200ms); hero and title blocks rise 18px over 700ms once per load; photo spaces settle from scale 1.05 over 1.4s. Everything off under `prefers-reduced-motion`. Page-to-page transitions use `@view-transition { navigation: auto; }`, no JavaScript.
- **Dark mode:** the tokens above on `[data-theme="dark"]`. Default follows the system setting; an explicit choice wins and is remembered. The toggle shows a moon in day mode and a sun in dark mode. A tiny inline script in `<head>` sets the theme before first paint so nothing flashes. Reflection essays open dark unless the visitor chose light. Photo cards, the Reflection strip and the footer stay dark in both themes.
- **Images:** full-bleed, or inside a rounded photo card; never floated.
- **Type:** two typefaces total (Fraunces for page H1, Manrope for the rest).
- **Template rules:** adding or removing sections follows `guidelines/10-page-template.md` in the design system.

---

## 7. Page specifications

### `/` — Homepage
In order: the hero photo card (photo space 1: an original photograph, or a short muted loop) with the tagline and two buttons; **Start here**, three tiles for beginners (Troubleshooting, Fundamentals, Gear); **Latest**, one featured article plus the three newest, with topic chips; a **Series** band; the **Reflection strip** on the roast band (photo space 2); the newsletter band; the footer. No hero carousel, no "as seen in," no testimonials. Sections with nothing to show yet are hidden, never rendered empty.

### `/articles` — Explore
Search with a results dropdown, built at build time (Pagefind) and loaded only when the search is opened; six topic tiles that resolve to real static URLs (`/articles/category/gear`); the series; and a tag cloud linking to static tag pages (`/articles/tag/[tag]`). Category and tag navigation is never client-side filtering. No pagination until there are more than 30 articles.

### `/articles/[slug]` — Article
Title block (page H1, standfirst, author, date, reading time), a hero photo space, a reading-progress line (CSS scroll-driven animation, no JavaScript), a sticky table of contents built from the `<h2>`s at build time, the body, and a series rail when the article belongs to a series. Email capture inline after the second `<h2>` and again after the final paragraph. Then the author box and three related articles ("Keep reading") matched by category. Reflection essays use the same template and open in the dark theme. No share buttons.

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
- Contrast ≥ 4.5:1 for body text in both themes (verify `--muted` on `--surface-3`, the tightest pair at 4.7:1, and olive text on cream at 5.6:1)
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

Do not build, and do not suggest building: a CMS with a database, user accounts or login, a comments system, an admin dashboard, a mobile app, server-side rendering beyond the small Worker routes already in place, Docker, a CI pipeline beyond Cloudflare's own build, or any framework component (React/Vue/Svelte) unless a specific interaction demands it and no static solution exists. **Allowed since v1.1:** dark mode through CSS tokens, static search through Pagefind, and CSS transitions.

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
- Out of scope: comments, accounts, SSR, Docker. React/Vue/Svelte only as an island where no static solution exists (currently the first-visit language prompt).

## Design
Source of truth: docs/DESIGN-SYSTEM.md (tokens, section rules). Use its token names in src/styles/tokens.css. Light and dark themes.
Palette: neutrals (--surface-1/2/3), --ink, --muted, olive (--olive, section accents only, never buttons or backgrounds), copper (--accent, a small spark, 2% at most).
Type: Fraunces for page H1 only, Manrope for everything else. Self-hosted woff2.
Shape: 28px card radius, pill buttons, no gradients, shadow only on hover-lift. Motion is CSS only and respects prefers-reduced-motion.
Layout: color-blocked bands, at most two photo spaces per page, typographic cards otherwise, measure capped at 68ch.
The aesthetic is restraint. When in doubt, remove something.

## Before you start
Read docs/TECHNICAL-PLAN.md. It is the spec. Phase 3 is a code freeze — during it,
design ideas go to docs/BACKLOG.md rather than into the codebase.
```
