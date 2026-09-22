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
Cloudflare Workers (static assets + a git-connected Worker named `cuerpo-coffee`, not classic
Cloudflare Pages — see Progress) · Kit (email) · Lemon Squeezy (payments, phase 4)

## Hard rules
- Static output only, with one narrow exception: `worker/index.ts` handles Keystatic's
  own GitHub OAuth calls (see Progress). No other server code, no database.
- No client-side JS unless a feature truly requires it. JS budget: 20 KB per article page.
  (The Keystatic admin UI at /keystatic is exempt — it's a CMS tool, not a public page,
  and is noindex'd and robots-disallowed.)
- No Tailwind. All design values come from src/styles/tokens.css.
- No new dependencies without stating the cost and the alternative.
- Never commit secrets. Environment variables live in the Cloudflare dashboard, on the
  `cuerpo-coffee` Worker's Settings → Variables and secrets.
- Out of scope: comments, accounts, search, dark mode, SSR, React/Vue/Svelte (React is
  used for exactly one exception: the Keystatic admin UI, client:only, zero JS on public
  pages — see Progress).

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

The GitHub repo is already connected to Cloudflare (as a Worker with static assets,
named `cuerpo-coffee` — see Progress below on Keystatic for how that was discovered
mid-Phase-2). Not confirmed yet: the custom domain serving over HTTPS — that's the
rest of Phase 1's "done when," and needs the owner to check the Cloudflare dashboard.

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

**Corrected mid-Phase-2: the Cloudflare project is a Worker with static assets,
not classic Cloudflare Pages**, despite the plan naming Pages throughout. Confirmed
directly from the dashboard: deploy command `npx wrangler deploy`, Worker-specific
metrics (CPU time, Workers build minutes), no Pages-style Functions tab — Cloudflare
now defaults git-connected static sites into this model. The first version of this
work assumed classic Pages and used a `functions/` directory (Pages Functions
convention); that was wrong and has been replaced. If any future session finds a
`functions/` directory again, something has regressed — delete it.

How it's actually wired:
- The site stays **fully static**. Keystatic's GitHub mode needs a server-side OAuth
  token exchange — true of any GitHub-backed browser CMS, not a Keystatic quirk —
  so that one piece runs as the project's Worker script, `worker/index.ts`, using
  `@keystatic/core`'s platform-agnostic `makeGenericAPIRouteHandler`. This is the
  only server-side code anywhere in the project.
- `wrangler.jsonc` at the repo root wires this together: `main: "worker/index.ts"`,
  `assets: { directory: "./dist", binding: "ASSETS" }`. The Worker's `fetch` handler
  checks the path — `/api/keystatic/*` runs the Keystatic handler (env vars come from
  the Workers `env` argument); everything else falls through to `env.ASSETS.fetch()`,
  i.e. the plain static build. **The `name` field (`cuerpo-coffee`) must match the
  Worker's name in the Cloudflare dashboard exactly, or Workers Builds refuses to
  deploy** — confirmed against the dashboard before writing this file.
- We deliberately did **not** use `@astrojs/cloudflare` (the official Astro Cloudflare
  adapter) to generate this. It's Workers-only in the version available during this
  session — true regardless of which Cloudflare product this project uses — and its
  own build output model doesn't fit a hand-wired `assets` + custom `main` setup as
  cleanly as writing the ~30-line Worker directly.
- The admin UI itself (`src/pages/keystatic-app.astro`, wrapped by
  `src/keystatic-page.ts`) is a plain static page — `client:only="react"` means it
  prerenders as an empty shell + JS bundle, no SSR needed. `@astrojs/react` was
  added as a dependency for this (needed to hydrate that one island; adds no JS to
  any public page — verified: `dist/index.html` and every article page still ship
  zero `<script>` tags).
- `/keystatic` and `/keystatic/*` are proxied to `/keystatic-app` via
  `public/_redirects` — confirmed this still works under the Workers-with-assets
  model (redirects apply only to paths resolved as static assets, so there's no
  conflict with the Worker's own `/api/keystatic/*` routing).
  **Gotcha, if this ever needs touching again:** a `_redirects` rule that points at
  a literal `.../index.html` (or that resolves to a path Cloudflare would itself
  normalize back to the rule's own trigger) gets silently ignored by Cloudflare as
  an "infinite loop." The fix was routing through a *differently-named* path
  (`keystatic-app`, not `keystatic`) with no `/index.html` suffix in the destination.
- Verified so far: `npm run build` and `astro check` pass clean; `wrangler deploy
  --dry-run` bundles the Worker successfully against the real `dist/` output; a local
  `wrangler dev` smoke test (with fake env vars) confirms `/`, articles, `/keystatic`,
  a deep link under it, and `robots.txt` all resolve correctly, and — confirmed via
  the local request-trace log, not just an assumption — that `/api/keystatic/*`
  requests are actually reaching the Worker's own handler code, not silently falling
  through to static-asset serving. **Not** verified: an actual GitHub OAuth
  round-trip — that needs a real GitHub App and a live deployed URL, neither of
  which exist yet. Also unconfirmed: whether adding a real `main` script actually
  unlocks the Variables/Bindings tab (currently disabled with "Variables cannot be
  added to a Worker that only has static assets") — that should resolve once this
  code deploys and the Worker has real code, since the restriction is presumably
  tied to what's deployed rather than a separate one-time account setting, but this
  hasn't been watched happen.

**Before Keystatic works live, the owner needs to:**
1. Push this to `main` and confirm the Workers Build succeeds, then check whether
   Settings → Variables and secrets has unlocked on the `cuerpo-coffee` Worker.
2. Confirm the real production domain (`astro.config.mjs`'s `site` is still the
   `cuerpocoffee.com` placeholder — the OAuth callback URL depends on the final
   domain, so this should happen before step 3).
3. Create a GitHub App for OAuth (Settings → Developer settings → GitHub Apps, on
   the `jagomezm812` account) — Keystatic's own `/keystatic` setup screen walks
   through this and hands back a client ID/secret once a repo and callback URL are
   given. This is an external, account-level action; a future session can attempt
   it via `gh api` if asked, but hasn't here since it needs the final domain first
   and creates a real artifact under the owner's GitHub account.
4. Set three environment variables on the `cuerpo-coffee` Worker (once unlocked):
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`
   (the last one is any long random string — Keystatic uses it to sign sessions).

**Next up (Phase 2, remaining):** real Kit form wiring in `EmailCapture`,
`/subscribe` landing page (and restore the header's third link), Cloudflare Web
Analytics, RSS + sitemap (`@astrojs/sitemap` — next new dependency, build-time only,
no client cost), build-time OG image generation.