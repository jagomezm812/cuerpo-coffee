# Cuerpo Coffee

English-language coffee publication. Teaches beginners to make good coffee at home.
Selling a paid digital guide from month 5.

## Owner
Not a developer. Can run given commands; will not debug code. Explain new concepts briefly.

## Environment
`git` and `gh` are installed and authenticated on this machine (gh: account jagomezm812,
github.com, SSH protocol). Commits and PRs can be made directly — no need to ask the
owner to authenticate anything first. Still confirm before pushing or opening PRs,
per the working agreement.

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

## CLAUDE.md needs to be kept up to date

Every time you execute some part of the project, you must register your advances in this document, so new sessions can restore that point. You also have to create the docs you need under `docs/` dir.

## Progress

**Phase 1 (skeleton): built, not yet deployed.** Astro scaffolded, tokens and global
styles in place, `Base`/`Article` layouts, `Header`/`Footer`, homepage, `/articles`
index + `/articles/category/[category]`, article template, `/about`, `/404`. Three
real seed articles in `src/content/articles/`. `npm run build` and `npm run check`
both pass clean. Zero client JS shipped anywhere (0 KB, well under the 20 KB budget).

Not done yet: connecting the GitHub repo to Cloudflare Pages and verifying the
custom domain serves over HTTPS — that's the rest of Phase 1's "done when," and it
needs the owner's Cloudflare account, so it happens outside this coding session.

**Deviations from `docs/TECHNICAL-PLAN.md`, made and worth knowing about:**
- `src/content/config.ts` → `src/content.config.ts`. The installed Astro version
  (7.3.3) requires content collection config at that path; the old location throws
  a build error (`LegacyContentConfigError`).
- `--muted` changed from `#8A7B70` to `#6E625A`. The spec's own value failed WCAG AA
  on `--crema` (3.51:1, needs 4.5:1) — the spec flagged this pair as the likely
  failure, and it was. New value: 5.08:1.
- Header nav shows only Articles / About for now, not three links — `/subscribe`
  doesn't exist until Phase 2, and linking to a page that 404s isn't better than
  linking to fewer pages.
- `EmailCapture` is a static, inert form (no `action`) styled to spec, placed once
  per article (after the body) and once on the homepage. The plan calls for it
  inline after the article's second `<h2>` too — that needs a markdown-injection
  step (remark/rehype) that's more sensibly built alongside the real Kit embed in
  Phase 2, not against a form that doesn't submit anywhere yet.
- `astro.config.mjs` sets `site: 'https://cuerpocoffee.com'` as a placeholder — it
  feeds canonical URLs and OG tags. **Confirm or correct this before going live.**
- No hero images on the seed articles or a real photo on `/about` — avoided
  fabricating stock imagery. `/about` has a placeholder-bio comment; real bio +
  photo, and any hero images, are content the owner adds (via Keystatic, from
  Phase 2).
- OG image generation from title (Phase 2 item per the plan) isn't built, so
  `og:image`/`twitter:image` are simply omitted for now rather than pointing at a
  missing file.

**Next up (Phase 2):** Keystatic at `/keystatic`, real Kit form wiring in
`EmailCapture`, `/subscribe` landing page (and restore the header's third link),
Cloudflare Web Analytics, RSS + sitemap (`@astrojs/sitemap` — first new dependency,
build-time only, no client cost), build-time OG image generation.