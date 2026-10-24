# Cuerpo Coffee — Technical Plan

**A build specification written to be handed to Claude Code.**
Save this in the repo as `docs/TECHNICAL-PLAN.md`. Section 13 contains the `CLAUDE.md` to place at the repo root.

> **Version 1.2 (October 2026), aligned with the $10k plan.** Refreshes the sections that were stale in 1.1: hosting (Cloudflare Worker with static assets), email (Kit → beehiiv), the content schema, pages, SEO rules, phases and deployment, and the out-of-scope list. Adds product pages, affiliate redirects, click-to-play video, a small calculator tool and an AI draft lane. The work itself is done in the numbered site sessions of the **Site & Docs Update Plan** (`SITE-PLAN.md`), one session per sitting, under the update protocol.
>
> **Design:** the source of truth is the **Cuerpo Coffee Design System** (`docs/DESIGN-SYSTEM.md`). Where this file and the design system disagree on look, the design system wins.
>
> **Open item (Session 6):** the first-visit language prompt is a ~70 KB React island. Replace it with a plain script under 2 KB and remove React if nothing else uses it, so the 20 KB JavaScript budget on article pages holds.

---

## 1. Project brief

Cuerpo Coffee is an English-language coffee publication with a business goal of $10,000/month by month 30 from six income streams. The site is a fast, editorial, image-forward publication with email capture on every article, a small shop of digital products, buying guides with affiliate links, and click-to-play videos.

The owner is not a developer. They can run commands that are given to them, but they will not debug code. Every decision optimizes for: **low running cost, nothing to maintain, nothing that can break while unattended, and publishing without touching a terminal.** AI agents may draft content, but nothing reaches the live site without the owner's approval.

---

## 2. Non-negotiable constraints

| Constraint | Reason |
|---|---|
| Static output. No database. Server code only as the small Worker routes under `/api/` and redirects. | Nothing to patch, nothing to exploit, no monthly bill. |
| Articles are Markdown files committed to the repo. | Portable, versioned, owned forever. |
| Hosted on **Cloudflare** (a Worker with static assets), not Vercel. | Commercial use allowed on the free plan, global CDN, preview per branch. |
| No client-side JavaScript unless a feature genuinely requires it. Budget: 20 KB per article page. | Performance is part of the brand. |
| No comments, no popups, no cookie banner. | Nothing that needs consent. |
| No third-party analytics or ad scripts. Cloudflare Web Analytics only. YouTube loads only after a click. | Privacy, speed, no banner. |
| Publishing must be possible from a browser. | The owner will not use a terminal weekly. |
| AI-drafted and writer articles arrive as pull requests from `draft/` branches and are never merged without the owner's approval. | Quality and trust. |

---

## 3. Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Astro** (latest stable), static output | Content-first, ~zero JS by default, content collections with schema validation. |
| Content | Markdown/MDX in `src/content/`, typed collections | Schema errors fail the build. |
| Styling | Plain CSS with custom properties in one token file | No Tailwind. |
| Editing UI | **Keystatic** at `/keystatic`, GitHub mode, GitHub OAuth App | Browser editor committing Markdown. Editors other than the owner save to `draft/` branches and open pull requests (Session 4). |
| Host | **Cloudflare Worker with static assets**, Git integration, auto-deploy on push to `main`, preview per branch | Free, commercial use. |
| Server routes | Small Worker routes under `/api/` (subscribe, Keystatic auth) and `/go/<slug>` redirects | The only server code. |
| DNS | Cloudflare (registrar Porkbun) | Same dashboard as hosting. |
| Analytics | Cloudflare Web Analytics; Google Search Console (no script) | Cookieless. |
| Email | **beehiiv** (free Launch plan; Scale from the guide waitlist). Kit kept behind `EMAIL_PROVIDER=kit|beehiiv` until the switch is proven | Automations, referrals, paid subscriptions, ad network. |
| Payments | **Lemon Squeezy** hosted checkout (5% + $0.50, merchant of record) | Global sales tax handled for a Mexico-based seller. No file hosting or license keys built by us. |
| Marketplace | Etsy for printables and short guides (outside the site) | Extra buyers while the audience is small. |
| Membership | beehiiv paid subscriptions (Cuerpo Reserve) | No accounts built on the site. |
| Search | Pagefind, built at deploy, loaded only when opened | Static. |

---

## 4. Repository structure (key parts)

```
cuerpo-coffee/
├── CLAUDE.md
├── docs/
│   ├── TECHNICAL-PLAN.md · DESIGN-SYSTEM.md · BUSINESS-PLAN.md
│   ├── SITE-PLAN.md · MARKETING-BRIEF.md · EDITORIAL-POLICY.md · AI-PIPELINE.md
│   ├── UPDATE-WORKFLOW.md · LEARNING-GUIDE.md · CHANGELOG.md · BACKLOG.md
│   └── AUDIT-2026-11.md          # written by Session 0
├── prompts/                      # AI pipeline templates; not part of the built site
├── keystatic.config.ts
├── astro.config.mjs
├── wrangler.jsonc                # non-secret settings and flags
├── public/  (fonts/, favicon.svg, robots.txt)
└── src/
    ├── content/articles/         # one Markdown file per article
    ├── data/links.json           # affiliate and product links for /go/ and checkout buttons
    ├── components/               # BaseHead, Header, Footer, EmailCapture, PillarTile, Pick, Rejected, Video, …
    ├── layouts/                  # Base, Article
    ├── pages/                    # index, articles/, about, subscribe, thanks, editorial-policy,
    │                             # disclosure, privacy, tools/ratio, shop, method/, es/, 404, rss.xml
    └── styles/                   # tokens.css, global.css
```

---

## 5. Content model

One collection, `articles`:

```ts
{
  title: string,              // ≤ 60 chars
  description: string,        // 120–155 chars
  publishDate: date,
  updatedDate: date | undefined,  // shown as "Updated <date>", used as dateModified
  category: 'troubleshooting' | 'fundamentals' | 'gear' | 'methods' | 'sourcing' | 'reflection',
  tags: string[],
  heroImage: image | undefined,
  heroAlt: string | undefined,    // required when heroImage is present
  lang: 'en' | 'es',              // default 'en'
  translationKey: string | undefined, // links an article to its translation
  draft: boolean,
  featured: boolean,
  faq: { question: string, answer: string }[] | undefined,  // FAQPage JSON-LD when filled (Session 1)
  affiliate: boolean,             // default false; shows the disclosure line (Session 7)
  video: { youtubeId, title, uploadDate, poster } | undefined, // Session 8
  aiAssisted: boolean,            // records only, not shown (Session 4)
  editor: string | undefined      // records only, not shown (Session 4)
}
```

Rules:
- Filename is the slug: lowercase, hyphenated, no dates.
- `draft: true` is excluded from the build, index, RSS and sitemap.
- The build fails loudly on a schema violation.
- `npm run check:content` warns (does not fail) on: title > 60, description outside 120–155, missing alt text, fewer than 2 internal links, no h2.

---

## 6. Design system (amended v1.1, unchanged in 1.2)

The source of truth is the Cuerpo Coffee Design System (`docs/DESIGN-SYSTEM.md`). Define everything below in `src/styles/tokens.css` as custom properties, **using these exact token names**. No hardcoded colors or sizes anywhere else.

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

Two accents, both small: **olive** marks sections and **copper** is a warm spark. Olive (about 4% of a page) only on section labels, category names, section markers, the Troubleshooting tile and category pills; `--olive-on-dark` for labels on dark blocks. **Olive is never a button, page or band background, link, headline, body text or gradient.** Every button is neutral (`--button-bg` on `--button-fg`). Copper only on the Sourcing tile, the italic word in the Home hero and the New badge. Color follows topic: Troubleshooting olive, Fundamentals sand, Gear roast, Methods white, Sourcing copper, Reflection near-black.

### Typography

- **Display:** Fraunces, page H1 only, weight 300–400, optical sizing on, `WONK` off, letter-spacing -0.025em.
- **Everything else:** Manrope. H2 600, card titles 700 (-0.035em), body 400, labels 12px 700 uppercase 0.14em, wordmark 800.
- Self-host both as `woff2` in `public/fonts/` with `font-display: swap`.

| Token | Range |
|---|---|
| `--step--1` | 0.875 to 0.9375rem |
| `--step-0` | 1.0625 to 1.25rem (body) |
| `--step-1` | 1.33 to 1.5rem |
| `--step-2` | 1.66 to 2rem |
| `--step-3` | 2.1 to 3.5rem (H2) |
| `--step-4` | 2.9 to 5.5rem (page H1) |

Article body line-height 1.6–1.7, measure capped at 68ch.

### Spacing, shape, motion, dark mode

- Spacing scale `4 8 12 16 24 32 48 64 96 128` as `--space-1`…`--space-10`; bands 96–104px vertical, 120px sides at 1440px.
- Radius: `--radius-sm` 8px, `--radius-md` 20px, `--radius-lg` 28px, `--radius-xl` 36px, `--radius-pill` 999px. No gradients. Shadow only on hover-lift and the search dropdown.
- Motion CSS only: theme fade 350ms; card lift 4px (280ms); button lift 1px (200ms); title rise 18px over 700ms once; photo settle from 1.05 over 1.4s; all off under `prefers-reduced-motion`; `@view-transition { navigation: auto; }`.
- Dark mode via `[data-theme="dark"]`; system default; explicit choice remembered; moon in day mode, sun in dark mode; inline `<head>` script prevents flashing; Reflection essays open dark unless the visitor chose light; photo cards, Reflection strip and footer stay dark.
- Layout: color-blocked bands, at most two photo spaces per page (a video counts as one), typographic cards otherwise, newsletter band then dark footer last.

---

## 7. Page specifications

### `/` — Home
Hero photo card (photo space 1) with tagline and two buttons; **Start here** (Troubleshooting, Fundamentals, Gear tiles; a tile with no article is hidden); **Latest** (one featured + three newest, topic chips); **Series** (hidden with fewer than 2 series); **Reflection strip** (photo space 2); newsletter band; footer. Sections with nothing to show are hidden automatically.

### Header and footer
Header: wordmark, Articles, Start here, Series (when present), About, search, theme toggle, Subscribe. Phones: search, toggle, menu. Footer columns: Read (Articles, Tools, Shop when live) and Cuerpo (About, Editorial policy, Disclosure, Privacy, Subscribe); faint wordmark; language switcher shown only where a Spanish version exists.

### `/articles` — Explore
Search (Pagefind, loaded on open), six topic tiles to static category pages, series, tag cloud (top 16). No client-side filtering. No pagination until 30+ articles.

### `/articles/[slug]` — Article
Title block (H1, standfirst, author, date, "Updated" date, reading time; affiliate disclosure line when `affiliate: true`), hero photo or video space, reading-progress line (CSS), sticky table of contents, body, series rail when relevant. **Email capture after the last paragraph of the second section (never between a heading and its text)** and again after the final paragraph, offering the Home Coffee Checklist, with a hidden `source` field. Author box, then **three** "Keep reading" articles (same category first, then newest). No share buttons.

### `/about`
Founder story, real photo, link to the editorial policy, newsletter band at the end.

### `/subscribe` and `/thanks`
Standalone, no header navigation. `/subscribe` offers the checklist. `/thanks` confirms and links to 3 starter articles.

### `/editorial-policy`, `/disclosure`, `/privacy`
Title block + reading body; text from `docs/EDITORIAL-POLICY.md` (Session 3).

### `/tools/ratio`
Static table without JavaScript; a vanilla script under 5 KB adds a live calculator; newsletter band below (Session 9).

### `/shop` (month 2)
Lists digital products as typographic cards with neutral buttons to Lemon Squeezy checkout links stored in `src/data/links.json`; member discount note; links to Etsy optional. Product JSON-LD with price.

### `/method`, `/method/waitlist`, `/method/thanks` (months 4–5)
Waitlist page with no header navigation (signups tagged `method-waitlist`); sales page behind `METHOD_LIVE` in `wrangler.jsonc` with two tiers ($34 Guide, $59 Complete), FAQ, Lemon Squeezy hosted checkout and Product JSON-LD; thank-you page. Lemon Squeezy delivers the files.

### `/go/<slug>`
302 redirect to the URL in `src/data/links.json`. Affiliate links use `rel="sponsored nofollow noopener"`. Disallowed in robots.txt and absent from the sitemap.

### Year 2 (backlog)
`/selection` (partner-roaster subscription, links to the roaster's store), merch page (print-on-demand partner), `/reserve` (beehiiv membership), "Gear I use", Spanish edition chrome.

### `/404`, `/rss.xml`
Brand voice 404 linking to `/articles`. Full-content RSS of non-draft articles.

---

## 8. Technical requirements

**Performance (verified on a real deploy):** Lighthouse mobile ≥ 95; LCP < 1.5s on 4G; JS < 20 KB on article pages (before any video click); AVIF/WebP images with explicit width/height.

**SEO:**
- One h1 per page; headings never skip.
- Title and meta description from frontmatter; canonical on every page; Open Graph and Twitter cards; OG image generated from the title when no hero.
- JSON-LD: Article (with dateModified), BreadcrumbList, FAQPage when `faq` is filled, VideoObject when `video` is filled, Product on product pages, Organization and WebSite on Home, Person on About.
- Sitemap via `@astrojs/sitemap`, excluding drafts, `/go/`, category and tag pages with fewer than 3 articles, and `/es/` pages without a real translation; those pages also get `noindex,follow` until they qualify, automatically.
- hreflang (en, es, x-default) only on pages with a translation (`translationKey`).
- robots.txt: allow all except `/keystatic`, `/api/keystatic` and `/go/`; point to the sitemap.
- Google Search Console verified by DNS record in Cloudflare.

**Accessibility:** contrast ≥ 4.5:1 in both themes; visible focus states; alt text required by schema; icon buttons with aria-labels; usable without JavaScript.

**Legal:** affiliate disclosure line on affiliate pages and a `/disclosure` page; `/privacy` describing email collection and cookieless analytics.

---

## 9. Build phases

| Phase | Status |
|---|---|
| Phase 1 — Skeleton | Done |
| Phase 2 — Publishing and plumbing (Keystatic, email, analytics, RSS, sitemap, images) | Done, except the lead magnet and welcome email |
| Redesign v1.1 | Done (tag `v1.1-redesign`) |
| Phase 3 — Alignment (months 1–3) | Site Sessions 0–5: audit, search foundations, capture and home fixes, trust pages, editor access, beehiiv |
| Phase 4 — Earning features (months 2–5) | Site Sessions 6–10: lighter language prompt, affiliate links and buying-guide blocks, click-to-play video, ratio calculator, shop and method pages |
| Phase 5 — Content mode | After Session 10, code changes only through the backlog, batched about once a month; all effort goes to content, video and products |

The exact prompts are in `docs/SITE-PLAN.md`. One session per sitting; each ends with a reviewed preview and the owner's approval.

---

## 10. Explicitly out of scope

Do not build, and do not suggest building: a database, user accounts or login, a comments system, an admin dashboard, a mobile app, server-side rendering beyond the small Worker routes and `/go/` redirects, Docker, a CI pipeline beyond Cloudflare's build and a pull-request template, file hosting or license keys for products, display ads, or framework components (React/Vue/Svelte) unless a specific interaction demands it and no static or vanilla solution exists.

**Allowed:** dark mode through tokens, Pagefind search, CSS transitions, `/go/` redirects, click-to-play video, small vanilla scripts under 5 KB for tools.

---

## 11. Deployment

- `main` is production; every push triggers a Cloudflare build and deploy of the Worker with static assets.
- Any other branch gets a preview URL (Workers & Pages → project → Deployments). Use a branch for anything visual.
- Build command `npm run build` (runs `check:content` first); output `dist`.
- Secrets (Keystatic GitHub OAuth credentials, `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, Kit key while kept) live in Cloudflare **secrets**. Non-secret flags (`EMAIL_PROVIDER`, `METHOD_LIVE`) live in `wrangler.jsonc`. **Never commit a secret.** Keys ever pasted into a chat are treated as exposed and rotated.
- Recovery: roll back to the previous deployment in Cloudflare, then fix forward. No Git surgery.

---

## 12. Working agreement for Claude Code sessions

- Read `CLAUDE.md`, this file and `docs/DESIGN-SYSTEM.md` at the start of every session; follow the update protocol.
- One change per session. Deploy, review, then continue.
- Ask for a screenshot when something visual is wrong.
- Explain new concepts in a few sentences.
- Never add a dependency without stating its cost and the alternative.
- If a requirement here is wrong, say so and propose an amendment.

---

## 13. `CLAUDE.md` for the repo root

```markdown
# Cuerpo Coffee

Home-coffee publication. Goal: $10k/month by month 30 from six income streams.
The email list is the core asset.

## Owner
Not a developer. Can run given commands; will not debug code. Explain new concepts briefly.

## Stack
Astro (static) · Markdown content collections · plain CSS with tokens · Keystatic at /keystatic ·
Cloudflare Worker with static assets · beehiiv (Kit until the switch session is merged) ·
Lemon Squeezy (payments)

## Hard rules
- Static output. Server code only as small Worker routes under /api/ and /go/ redirects. No database.
- No client-side JS unless a feature truly requires it. JS budget: 20 KB per article page.
- No Tailwind. All design values come from src/styles/tokens.css.
- No new dependencies without stating the cost and the alternative.
- Never commit secrets. Secrets live in Cloudflare secrets; non-secret flags in wrangler.jsonc.
- AI-drafted or writer articles arrive as pull requests from draft/ branches and are never merged without the owner's approval.
- Out of scope: comments, accounts, SSR, Docker, display ads, file hosting. React/Vue/Svelte only where no static or vanilla solution exists.

## Design
Source of truth: docs/DESIGN-SYSTEM.md. Light and dark themes.
Palette: neutrals (--surface-1/2/3), --ink, --muted, olive (section accents only, never buttons or backgrounds), copper (a small spark).
Type: Fraunces for page H1 only, Manrope for everything else. Self-hosted woff2.
Shape: 28px card radius, pill buttons, no gradients, shadow only on hover-lift. Motion CSS only, respects prefers-reduced-motion.
Layout: color-blocked bands, at most two photo spaces per page (a video counts as one), typographic cards otherwise, measure 68ch.
The aesthetic is restraint. When in doubt, remove something.

## Before you start
Read docs/TECHNICAL-PLAN.md (the spec), docs/SITE-PLAN.md (the numbered sessions),
docs/BUSINESS-PLAN.md, docs/EDITORIAL-POLICY.md and docs/AI-PIPELINE.md.
Ideas outside the current session go to docs/BACKLOG.md, not into code.

## Update protocol
(keep the existing block from docs/UPDATE-WORKFLOW.md section 9)
```
