# Cuerpo Coffee

English-language coffee publication. Teaches beginners to make good coffee at home.
Selling a paid digital guide from month 5.

## Owner
Not a developer. Can run given commands; will not debug code. Explain new concepts briefly.

## Environment
`git` and `gh` are installed and authenticated on this machine (gh: account jagomezm812,
github.com, SSH protocol). Commits and PRs can be made directly — no need to ask the
owner to authenticate anything first.

## Git workflow
Every time changes are made in a session, commit and push to `origin main` — don't
wait to be asked each time. This replaces the default "only commit when explicitly
asked" caution for this repo specifically. Still use judgment: don't push obviously
broken or half-finished work (run `npm run build` / `npm run check` first), and still
ask before anything destructive (force-push, history rewrite, etc.).

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

**Phase 2, part 1 (Keystatic): built, not yet usable — needs one owner step.**
`keystatic.config.ts` at the repo root defines the `articles` collection with every
frontmatter field from `src/content.config.ts` editable (title→slug, description,
publishDate, updatedDate, category, tags, heroImage+heroAlt, draft, featured) plus
the markdown body, in GitHub storage mode against `jagomezm812/cuerpo-coffee`.

How it's wired (worth understanding before touching any of this):
- The site stays **fully static**. Keystatic's GitHub mode needs a server-side OAuth
  token exchange — true of any GitHub-backed browser CMS, not a Keystatic quirk —
  so that one piece runs as a **Cloudflare Pages Function**
  (`functions/api/keystatic/[[params]].js`), using `@keystatic/core`'s
  platform-agnostic `makeGenericAPIRouteHandler`. This is the only server-side code
  anywhere in the project. It deploys automatically with the existing Cloudflare
  Pages git integration — no separate deploy step, no hosting migration.
- We deliberately did **not** use `@astrojs/cloudflare` (the official Astro Cloudflare
  adapter). As of the version installed during this session, that adapter targets
  Cloudflare **Workers** only — it dropped Pages support — which would have meant
  migrating the whole site off Pages. The hand-rolled Function above avoids that
  entirely and keeps Cloudflare Pages exactly as the plan specifies.
- The admin UI itself (`src/pages/keystatic-app.astro`, wrapped by
  `src/keystatic-page.ts`) is a plain static page — `client:only="react"` means it
  prerenders as an empty shell + JS bundle, no SSR needed. `@astrojs/react` was
  added as a dependency for this (needed to hydrate that one island; adds no JS to
  any public page — verified: `dist/index.html` and every article page still ship
  zero `<script>` tags).
- `/keystatic` and `/keystatic/*` are proxied to `/keystatic-app` via
  `public/_redirects`, so Keystatic's client-side router works on any sub-path.
  **Gotcha, if this ever needs touching again:** a `_redirects` rule that points at
  a literal `.../index.html` (or that resolves to a path Cloudflare would itself
  normalize back to the rule's own trigger) gets silently ignored by Cloudflare as
  an "infinite loop" — confirmed with `wrangler pages dev`'s redirect linter. The
  fix was routing through a *differently-named* path (`keystatic-app`, not
  `keystatic`) with no `/index.html` suffix in the destination.
- Verified so far: `npm run build` and `astro check` pass clean; a local
  `wrangler pages dev dist` smoke test confirms the Function's imports resolve, the
  Worker compiles, and `/keystatic` and deep links both resolve to a working shell
  that loads its JS bundle. **Not** verified: an actual GitHub OAuth round-trip —
  that needs a real GitHub App and a live deployed URL, neither of which exist yet.

**Before Keystatic works live, the owner needs to:**
1. Confirm the real production domain (`astro.config.mjs`'s `site` is still the
   `cuerpocoffee.com` placeholder — the OAuth callback URL depends on the final
   domain, so this should happen first).
2. Create a GitHub App for OAuth (Settings → Developer settings → GitHub Apps, on
   the `jagomezm812` account) — Keystatic's own `/keystatic` setup screen walks
   through this and hands back a client ID/secret once a repo and callback URL are
   given. This is an external, account-level action; a future session can attempt
   it via `gh api` if asked, but hasn't here since it needs the final domain first
   and creates a real artifact under the owner's GitHub account.
3. Set three environment variables in the Cloudflare Pages project settings:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`
   (the last one is any long random string — Keystatic uses it to sign sessions).

**Next up (Phase 2, remaining):** real Kit form wiring in `EmailCapture`,
`/subscribe` landing page (and restore the header's third link), Cloudflare Web
Analytics, RSS + sitemap (`@astrojs/sitemap` — next new dependency, build-time only,
no client cost), build-time OG image generation.