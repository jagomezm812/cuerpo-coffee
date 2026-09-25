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
- Static output only, with narrow exceptions in `worker/index.ts`: Keystatic's
  GitHub OAuth calls, proxying the subscribe form to Kit's API so the real API
  key never reaches the browser, a cookie-based redirect on `/` for returning
  visitors with a Spanish language preference, and the `?setlang=en|es` footer
  language switcher (see Progress on i18n). `wrangler.jsonc` has
  `assets.run_worker_first: true` — every request goes through the Worker
  first — because a path with a matching static file otherwise bypasses the
  Worker entirely by default, which silently broke both of the above at
  different points before this was widened from a narrower path list. No other
  server code, no database.
- No client-side JS unless a feature truly requires it. JS budget: 20 KB per
  article page. (The Keystatic admin UI at /keystatic is exempt — it's a CMS
  tool, not a public page, and is noindex'd and robots-disallowed. The
  EmailCapture inline-confirmation script counts against the budget and is
  verified well under it — ~820 bytes, inlined, no separate request. The
  LanguagePrompt React island is the one deliberate, informed exception to the
  budget itself — ~70 KB gzip, measured and shown to the owner before they
  chose to accept it specifically to exercise React end-to-end, not because
  the feature needed React — see Progress.)
- No Tailwind. All design values come from src/styles/tokens.css.
- No new dependencies without stating the cost and the alternative.
- Never commit secrets. Environment variables live in the Cloudflare dashboard, on the
  `cuerpo-coffee` Worker's Settings → Variables and secrets — except the ones that
  aren't actually sensitive (OAuth client ID, Kit form ID), which live in
  `wrangler.jsonc` instead so they survive every deploy (see Progress for why).
- Out of scope: comments, accounts, search, dark mode, SSR, Vue/Svelte. React is
  available project-wide, not just for Keystatic, and is now actually in use for
  a real public feature (the language preference prompt — see Progress on i18n).
  Each usage is still bound by the JS budget above and still needs a real
  reason, not "because it's available."

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
- ~~Header nav shows only Articles / About~~ — resolved: `/subscribe` exists now,
  header shows all three links.
- ~~`EmailCapture` is a static, inert form~~ — resolved: wired to Kit for real (see
  Progress). Scope was deliberately simplified from the plan's original lead-magnet
  design (a checklist PDF delivered via a dedicated flow) to a plain "you're
  subscribed" confirmation — the owner deferred the lead magnet to a later session,
  so there's no `/thank-you` page, no file delivery, nothing gated. Revisit delivery
  when a real lead magnet exists.
- ~~`astro.config.mjs` sets a placeholder domain~~ — resolved: real domain is
  `cuerpo.coffee`, confirmed live by the owner and set as `site` in
  `astro.config.mjs`.
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
- `/keystatic` and any `/keystatic/*` sub-path are handled **inside
  `worker/index.ts`**, not via `public/_redirects` (that file has been deleted).
  The Worker fetches the built shell (which physically lives at `/keystatic-app`,
  kept under a separate name so this rule can't match its own target) from
  `env.ASSETS` and returns its content directly for the original request — no HTTP
  redirect, so the browser's visible URL never changes.
  **Why this matters, and why `_redirects` was wrong:** Keystatic's admin UI is a
  client-side SPA with its own router, hardcoded to assume it's mounted at
  `/keystatic` — confirmed by reading `@keystatic/core`'s UI bundle directly, there
  is no `basePath` prop anywhere between the Astro glue and Keystatic's root
  component. A `_redirects` proxy rule looks like it should mask the URL, but it
  actually performs a real, visible 307/308 redirect (Cloudflare's "200 proxy"
  target still gets normalized and redirected to when it doesn't already end in a
  trailing slash) — so the browser ended up at `/keystatic-app/`, Keystatic's router
  couldn't parse that into any known route, and it rendered its own client-side
  "Not found" empty state. This looked exactly like a dead route/404 and cost a full
  round of "verified working" that wasn't — the earlier check only confirmed the
  HTTP status code and HTML shell loaded, not that the React app inside it rendered
  correctly post-redirect. Lesson: for anything with client-side routing, check what
  actually renders in a browser, not just the response code.
- The OAuth app in use is a **classic GitHub OAuth App**, not a GitHub App. This
  was checked twice, with two different, incomplete conclusions before the real
  issue surfaced — worth recording exactly what went wrong each time:
  - **First check:** confirmed the OAuth *exchange mechanics* were identical
    (`github.com/login/oauth/authorize` → `.../access_token`) and that
    Keystatic's repo-reading/writing code has zero GitHub-App-installation-specific
    logic. True, but incomplete — it verified the plumbing shape, not whether the
    resulting token would actually have working *write* permissions.
  - **What that missed:** `@keystatic/core`'s `githubLogin()` never sets an OAuth
    `scope` parameter on the authorize redirect at all — confirmed by reading its
    source directly. That's a non-issue for a GitHub App, since a GitHub App's
    write access comes from the app's own installation permissions, not from
    OAuth scope. A classic OAuth App has no such mechanism: with no `scope`
    requested, GitHub returns a token with **empty** scope. This surfaced as a
    real failure once the owner tried to actually save an edit in Keystatic:
    `createCommitOnBranch` requires `public_repo`, token had `['']`.
  - **Fixed** in `worker/index.ts`: rather than reimplementing Keystatic's
    login handler (which also manages `state`/cookie logic we don't want to
    duplicate), the outgoing `Location` header on `github/login`'s redirect is
    rewritten in place to add `scope=public_repo`. `public_repo`, not the
    broader `repo` scope — confirmed via `gh repo view` that `cuerpo-coffee` is
    public, and `repo` would also grant write access to every *private* repo on
    this GitHub account, which nothing here needs.
  - **Corrected takeaway:** a classic OAuth App works with Keystatic, but not
    out of the box — it needs this one-line scope patch. A GitHub App wouldn't
    need it (permissions come from its own installation config instead), which
    is the real, single actual tradeoff between the two — not the "broader
    access footprint" framing from the first check, which undersold it as a
    minor scope difference rather than "doesn't write at all without a fix."
- **Second gotcha, more expensive than the first:** after the routing fix above was
  pushed (and two more small commits after it), every single `/api/keystatic/*`
  route started throwing — including ones that had worked minutes earlier —
  producing Cloudflare's opaque "error code: 1101" with zero diagnostic
  information. Root cause, found only by temporarily wrapping
  `makeGenericAPIRouteHandler(...)` construction in a try/catch that returned the
  real error as the response body (since `wrangler tail` needs the owner's own
  Cloudflare auth, not available here): **`wrangler deploy` deletes dashboard-set
  plain-text environment variables on every single deploy**, unless they're
  declared in `wrangler.jsonc` or `--keep-vars` is passed (neither was true here).
  `KEYSTATIC_GITHUB_CLIENT_ID` was set as a plain var in the dashboard, so every
  deploy after it was set quietly wiped it back out. `KEYSTATIC_GITHUB_CLIENT_SECRET`
  and `KEYSTATIC_SECRET`, both Secrets, were unaffected — Secrets persist across
  deploys on their own; this behavior is specific to plain vars.
  **Fixed for good:** `KEYSTATIC_GITHUB_CLIENT_ID` now lives in `wrangler.jsonc`'s
  `vars` block, committed to the repo. It's not sensitive (already visible in the
  browser during the OAuth redirect), so this is safe. **The two real secrets must
  never move into `wrangler.jsonc`** — they stay dashboard-only Secrets.

**Status: fully wired and confirmed working, end to end, on the live site
(re-verified after the fix above, not just before it):**
- `GET /api/keystatic/github/login` → 307 to `github.com/login/oauth/authorize`
  with the correct `client_id` (`Ov23ctRATL0Snr3TuWuM`) and
  `redirect_uri=https://cuerpo.coffee/api/keystatic/github/oauth/callback`.
- `GET /api/keystatic/github/oauth/callback` with a bad code → clean 401
  "Authorization failed" (not a crash).
- Loading `https://cuerpo.coffee/keystatic` in a real Chrome tab (not just curl)
  renders Keystatic's genuine "Log in with GitHub" screen. One console
  `[EXCEPTION] Object` appears on every load — traced via network requests to a
  single `POST /api/keystatic/github/refresh-token` returning 401, which is
  Keystatic's own "am I already signed in" check logging its (expected) failure
  when there's no session yet. Benign, not a bug; expect it on every logged-out
  visit.

**Keystatic GitHub sign-in and save: both confirmed working end to end by the
owner**, in two stages. Sign-in alone worked first — that was real, but incomplete,
since the "Status: fully wired" checks above (login redirect, callback error
handling, browser sign-in screen) never actually exercised a write. Trying to
**save an edit** immediately failed: `createCommitOnBranch` requires `public_repo`,
token had empty scope (see the OAuth App entry above for the root cause and fix —
missing `scope` param on the login redirect, now patched in `worker/index.ts`).
After that fix deployed, the owner confirmed a real save succeeds too. Keystatic
(part 1 of Phase 2) is genuinely done now — but the lesson from this and the
`_redirects` incident earlier is the same: **"login works" and "the full write
path works" are different claims, and only the second one means the feature is
actually done.** For anything that both authenticates AND writes, verify the write,
not just the auth.

**React formally scoped project-wide, not just Keystatic-admin.** Nothing new to
install — `@astrojs/react`, `react`, `react-dom`, and their `@types/*` packages
were already added when the Keystatic admin UI was built, and TypeScript was
already fully configured (`tsconfig.json` extends `astro/tsconfigs/strict`,
`@astrojs/check` installed). This request was purely a scope decision: the owner
wants React available for future public-facing interactive features (a language
switcher, richer UI elements were the examples given) without needing to bolt on
the framework when that day comes, not a request tied to a specific feature yet.
Updated the Hard rules above accordingly — this replaces the earlier
Keystatic-only framing.
Re-verified after the scope change (not just assumed from the earlier Keystatic
work): `npm run build` and `astro check` both pass clean, and every public page —
homepage, about, subscribe, articles index, all three articles, 404 — has zero
external `<script src>` tags in the build output; only `/keystatic-app` references
the React bundle. The 0 KB-on-unused-pages guarantee comes from Astro's partial
hydration model (a React component only ships JS to pages that actually render
it), not from anything specific to this project — so it'll hold automatically for
whatever the first real public React island turns out to be, with no additional
wiring needed beyond using the component.

**Phase 2, part 2 (Kit subscribe): built and verified locally, not yet deployed.**
Scope was deliberately narrowed by the owner from the plan's original lead-magnet
design (a checklist PDF) to plain working subscribe functionality — no
`/thank-you` page, no file delivery. That gets revisited once a real lead magnet
exists.

How it's wired:
- `worker/index.ts` gained a second route, `POST /api/subscribe`. It validates the
  posted email minimally (non-empty, contains `@`, under 320 chars — defense against
  garbage/bots hitting the endpoint directly; the browser's own `type="email"` +
  `required` do the real UX-level validation), then makes two server-side calls to
  Kit's v4 API: `POST /v4/subscribers` (create-or-update the subscriber account-wide)
  and `POST /v4/forms/{KIT_FORM_ID}/subscribers` (attach them to the specific form).
  **Kit's v4 API has no single-call equivalent** — confirmed by reading its docs
  directly, the "add to form by email" endpoint requires the subscriber to already
  exist. The older v3 API does have a single-call `forms/{id}/subscribe` endpoint,
  but Kit's own docs say v3 "is no longer in active development," so this wasn't
  worth building against for a site meant to run for years.
- The real `KIT_API_KEY` stays server-side only, as a Cloudflare dashboard Secret —
  never sent to the browser. `KIT_FORM_ID` (`9959982`) is committed in
  `wrangler.jsonc`'s `vars`, same reasoning as the Keystatic OAuth client ID: it's
  not sensitive (visible in any public embed code) and this way it survives every
  deploy automatically instead of depending on a dashboard value.
- `EmailCapture.astro` posts JSON to `/api/subscribe` via `fetch()` from a small
  inline script (~820 bytes, gets inlined directly into the page HTML rather than
  a separate request — verified in the build output) and swaps in an inline
  confirmation or error message, no navigation. This is exactly the kind of feature
  the project's "no JS unless truly needed" rule is meant to allow for.
- **Single opt-in assumed**, per the owner's answer when asked directly (not
  verified against the actual Kit form settings) — success copy is "You're
  subscribed — thanks!", which would be inaccurate if double opt-in turns out to be
  on (it would mean "check your email to confirm" instead). If a real subscription
  attempt doesn't seem to register in Kit, check this first.
- Mid-article placement (after the second `<h2>`, per the business plan) is handled
  by `src/lib/remark-inline-subscribe.mjs` — a small, zero-dependency remark plugin
  that inserts a raw-HTML twin of `EmailCapture`'s markup into the Markdown AST
  after an article's second H2 heading. Raw HTML (not a hand-built hast tree)
  specifically to avoid needing to guess at hast's property-name mapping
  (`className`/`class`, `htmlFor`/`for`) correctly. Registered in `astro.config.mjs`
  via `markdown.processor: unified({ remarkPlugins: [...] })` — **not** the simpler
  `markdown.remarkPlugins` array, which is deprecated in the installed Astro
  version (7.3.3) and warns on every build.
  **New dependency, stated per the hard rule:** `@astrojs/markdown-remark` — restores
  the remark/rehype pipeline that Astro no longer bundles by default (a newer
  processor, Sätteri, is now the default and doesn't support custom plugins). Cost:
  build-time only, zero client bundle impact; it's first-party and was Astro's own
  default until this version, so a known quantity, not a novel risk. No lighter
  alternative achieves AST-correct heading detection (a naive string-split on raw
  Markdown text would mis-fire on `##` characters inside code fences or similar).
- Because both the `<EmailCapture />` component and the remark-injected raw HTML
  must render identically, `.email-capture` and its related classes moved from
  `EmailCapture.astro`'s scoped `<style>` into `src/styles/global.css` as unscoped
  rules. `EmailCapture`'s `heading`/`body` props are optional with no forced
  default when explicitly passed as `""` (used on `/subscribe` — see below — to
  avoid duplicating the page's own intro copy).
- `/subscribe` (`src/pages/subscribe.astro`): standalone landing page per the
  original plan spec ("no header navigation" — uses `Base`'s existing `bare` prop,
  unused until now), own intro paragraph, then the same `EmailCapture` form with
  its default heading/body suppressed. Header now links to it as the third nav
  item, resolving the Phase 1 deviation noted above.
- Verified: `npm run build`/`astro check` pass clean with no deprecation warnings;
  a local `wrangler dev` run (fake Kit credentials) confirms all five request paths
  on `/api/subscribe` behave correctly — success attempt (502, since the fake key
  is rejected by the real Kit API — confirmed via the logged error, "The API key is
  invalid," proving the request reaches Kit correctly), missing email (400),
  malformed JSON (400), wrong HTTP method (405), and malformed email (400); the
  build output shows exactly two `.email-capture` blocks on every article page
  (mid + end) and one each on the homepage and `/subscribe`, none on `/about`.
  **Confirmed live**: `KIT_API_KEY` was added as a dashboard Secret, and a real
  test subscribe against the live site returned `{"ok":true}` — both the
  create-subscriber and add-to-form calls succeeded against the real Kit API.

## Phase 2, part 3: English/Spanish i18n

**Status: built, verified locally end-to-end, not yet deployed.** Full plan was
proposed and approved by the owner before any code was written (routing strategy,
content model, Keystatic schema, and the language-prompt storage mechanism were
all explicit decision points). Scope: article translation lags behind English
publishing over time; site chrome (Header/Footer nav labels, About, Subscribe,
"Related"/"Articles" heading strings) stays English-only for now, by the owner's
explicit choice — revisit once articles are actually being translated in volume.

**Routing:** `astro.config.mjs`'s `i18n` config —
`locales: ['en','es']`, `defaultLocale: 'en'`, `routing.prefixDefaultLocale: false`.
English stays fully unprefixed (zero disruption to already-published URLs);
Spanish lives under `/es/`. This was the owner's explicit choice over the
alternative (symmetric `/en/`+`/es/`, one shared route file) specifically to avoid
disrupting existing URLs — the cost is a parallel, thin route tree under
`src/pages/es/articles/` (index, `category/[category]`, `[...slug]`), each just
calling the same shared query helpers in `src/lib/articles.ts` as their English
counterparts, so there's still one source of truth for the actual query/sort logic
even though the routing files themselves are duplicated.
**Verified directly, not just documented from the config:** Astro's own
`i18n.fallback`/`fallbackType` auto-translate-fallback feature does **not** apply
to `getStaticPaths()`-driven content collection routes (confirmed absent from
Astro's own docs on this) — it's a plain-file-in-locale-folder feature only. So
there is no automatic fallback machinery for articles here; the actual behavior
(see below) is hand-built in `src/lib/articles.ts` and the route files, and is
simpler than a fallback system would have been.

**Content model:** one `articles` collection (not two), two new fields in
`src/content.config.ts`:
- `lang: z.enum(['en','es']).default('en')` — the three pre-existing English
  articles needed **zero migration**, since the default covers them.
- `translationKey: reference('articles').optional()` — only set on a Spanish
  entry, pointing at the `id` (slug) of the English article it translates. Using
  Astro's `reference()` rather than a plain string gives a real foreign-key
  check: the build fails loudly if it points at a slug that doesn't exist,
  consistent with this schema's existing fail-loudly philosophy (same spirit as
  the `heroAlt`-requires-`heroImage` refinement). Confirmed this actually works
  end-to-end via a real build with a real linked pair, not just by reading the
  type — `reference()`'s types are dynamically generated (stubbed as `any` in
  Astro's own shipped `.d.ts`), so this needed empirical verification, not just
  reading docs.
- Spanish articles get their own natural Spanish slugs/filenames (not the English
  slug reused) — better for Spanish-language SEO, and it's `translationKey` that
  links the pair, not filename matching.
- Untranslated behavior, and it's important this needed no fallback machinery at
  all: `getPublishedArticles('es')` (in `src/lib/articles.ts`) only returns
  entries with `lang: 'es'`, so an untranslated article simply never generates a
  Spanish route and never appears in the Spanish index — no dead links, no
  partial-language reading experience to design around. A "Leer en español" /
  "Read in English" cross-link (in `src/layouts/Article.astro`, via
  `getTranslationHref()`) only renders when a real translation exists on either
  side.
- One real, non-filler translated seed article exists for verification:
  `src/content/articles/por-que-tu-cafe-sabe-acido.md` (`lang: es`,
  `translationKey: why-your-coffee-tastes-sour`) — a genuine translation of the
  existing English article, not placeholder text, so the whole pipeline
  (routing, cross-linking, category filtering, the language prompt's redirect
  target) could be verified against something real rather than a stub.

**Keystatic schema:** same two fields added to the one `articles` collection in
`keystatic.config.ts` — `lang` as `fields.select` (English/Español), and
`translationKey` as `fields.relationship({ collection: 'articles' })`, i.e. a
collection referencing itself. Confirmed structurally supported by reading
`@keystatic/core`'s own relationship-field types directly (`collection` is a
plain string key, not type-restricted against self-reference) — **not yet
smoke-tested live in the Keystatic UI** (e.g. whether the picker correctly
excludes the entry currently being edited from its own options list). Do that
before relying on it for a real translation workflow.
**Known small gap, not fixed:** Keystatic's `previewUrl` is a flat string
template (`/articles/{slug}`) with no way to branch on the `lang` field, so a
Spanish article's "Preview" button in Keystatic points at the wrong (English-style,
nonexistent) URL. Left as-is and commented in the config; not worth a broken
workaround for a minor convenience button.

**Language preference prompt:** `src/components/LanguagePrompt.tsx`, a React
island (`client:idle`, mounted once in `Base.astro` so it's present on every
page). This was a deliberate, informed scope choice, not an oversight: I measured
the actual cost first (React's shared runtime + this component: **~70 KB gzip**,
confirmed via the real build output — `client.js` ~65KB + `react.js` ~3.5KB +
`react-dom.js` ~1.4KB + the component itself ~0.6KB) and gave the owner that
number before they decided; they chose to accept the cost specifically to
exercise the React/TypeScript infrastructure end-to-end on a real public page,
not because the feature itself needed React (a vanilla-JS version would have cost
under 1 KB, same UX).
- **Storage: a `cuerpo_lang` cookie, not localStorage** — a deliberate
  architecture choice, not a coin flip: because the Worker already runs on every
  request, a cookie lets *it* (not client JS) handle the returning-visitor
  redirect. Per the owner's explicit instruction, the React island's job is
  strictly limited to the first-visit prompt UI and setting the cookie — the
  redirect-on-return logic lives entirely in `worker/index.ts`, not in any
  client JS, even though the prompt itself is now a React component.
- The island only ever renders on English pages (`currentLang !== 'en'` bails out
  immediately) — a first visit landing directly on a Spanish article is already
  reading Spanish, so there's nothing to offer it; this sidesteps needing
  bilingual prompt copy entirely.
- Dismissing any way — the × button, "Continue in English," or clicking away —
  all resolve to setting the cookie to `en`, satisfying "defaults to English if
  dismissed or ignored" without needing timeout/inactivity detection.
- "Español" sets the cookie to `es` and navigates to the *specific* Spanish
  translation of the current article if one exists (via `getTranslationHref()`),
  falling back to `/es/articles` (the Spanish index) otherwise — confirmed this
  distinction actually works in a real browser test, not just in the props.
- **Worker-side redirect gotcha, found the hard way, twice:** the `/` →
  `/es/articles` redirect for returning `cuerpo_lang=es` visitors silently never
  fired at first. Root cause, confirmed against Cloudflare's own docs: **a
  Cloudflare Worker with static assets serves a matching static file directly by
  default, without invoking the Worker's `fetch()` at all** — this only became
  visible now because every prior custom route (`/api/keystatic/*`,
  `/api/subscribe`, `/keystatic`) happened to have *no* matching static file, so
  they always fell through to the Worker by coincidence, not by any explicit
  configuration. `/` has a real matching file (`index.html`), so it was served
  directly, bypassing the redirect check entirely. First fix:
  `assets.run_worker_first: ["/"]`, scoped narrowly.
  **That scoping turned out to be wrong once the language switcher (below) was
  added** — a `?setlang=` link can point at *any* page (any article, any
  category, the homepage), and every one of those has a matching static asset
  too, so the same bypass silently ate the `setlang` query string on every path
  except `/`. Confirmed directly: `curl` on `/articles/some-slug?setlang=en`
  came back with no `Set-Cookie` at all and the query string just dropped —
  served straight from the asset, never reaching the Worker. Since there's no
  fixed list of paths to scope this to (the switcher is sitewide), fixed for
  real this time with `assets.run_worker_first: true` — every request now goes
  through the Worker first, falling through to `env.ASSETS.fetch()` unchanged
  for anything with no special routing. Re-verified after widening it that
  trailing-slash normalization (e.g. `/articles/some-slug` → `.../some-slug/`)
  still works correctly through that fallback path, not just before the change.
  **Lesson, worth remembering for any future Worker logic:** this failure mode
  is silent — a normal 200, not an error — so it's easy to ship broken and not
  notice without testing the exact cookie/query-param scenario end to end.
- CSS added unscoped to `src/styles/global.css` (a React component has no access
  to Astro's scoped `<style>` blocks) — first draft used a `box-shadow` for
  visual separation, caught and removed before committing since it violates this
  project's explicit "no shadows" design rule; a `border: 1px solid --espresso`
  does the same job within the palette.
- Verified in a real Chrome browser, not just via curl: the prompt renders
  correctly on first visit, "Español" navigates to the exact translated article
  (not just the generic index) and hides the prompt going forward, and a
  follow-up visit to a *different* English article correctly shows no prompt
  (cookie already set). One console `[EXCEPTION] Object` appeared during
  testing — traced and confirmed to be noise from an unrelated third-party
  browser extension in this testing session (it fires identically on
  `example.com`, a page with zero JS of its own), not a real bug.

**Persistent language switcher (Footer), added after a real gap the owner found
by testing:** once `cuerpo_lang=es` was set, there was no way back to English at
all short of manually clearing cookies — clicking the logo/home link just landed
back on `/es/articles` via the returning-visitor redirect, with nothing on the
page offering a way out. The one-time prompt alone wasn't sufficient; a
persistent escape hatch was missing.
- `Footer.astro` now renders "English · Español" (small text, right side of the
  footer row) on every non-bare page. The current language is plain text; the
  other one is a real link. This is a language-name label pair, not a
  translated UI string, so it doesn't conflict with the "chrome stays
  English-only for now" decision.
- **Deliberately zero client JS** — no new React island, no vanilla JS either.
  The link is a plain `<a href="...?setlang=en|es">`; `worker/index.ts` reads
  `?setlang` as an early check, strips it, and responds with a 302 + `Set-Cookie`
  to the clean URL. The redirect (rather than serving the target content
  directly in the same response) is deliberate: it forces the *next* request to
  carry the new cookie value before any other routing logic (like the `/`
  redirect above) runs — patching the response in place would leave the
  same-request's `/` check still seeing the OLD cookie, since a `Set-Cookie`
  header doesn't retroactively change the request currently being handled.
  Confirmed this ordering matters by testing the exact failure scenario
  directly (an `es` cookie, clicking through to `/?setlang=en`) before and
  after using the redirect approach.
- Uses the same `otherLangHref` value in both directions: `Article.astro`
  computes it once via `getTranslationHref()` (already bidirectional — returns
  the English original's URL when called on a Spanish entry, or the Spanish
  translation's URL when called on an English one) and passes it straight
  through; `Base.astro` supplies the `/`-or-`/es/articles` default when no
  specific translation applies. `LanguagePrompt` and `Footer` both consume this
  one resolved value, just in whichever direction is relevant to each.
- **The `/` → `/es/articles` redirect target was checked, not just assumed
  fine:** confirmed intentional, not an accident of the routing — there's
  currently no Spanish homepage since site chrome stays English-only, so the
  Spanish article index is the only page on the site that's actually meaningful
  in that direction. Worth revisiting only if/when chrome gets translated.
- Verified end-to-end via direct HTTP tests reproducing the exact reported bug:
  `cuerpo_lang=es` cookie + `GET /?setlang=en` → `302` with `Set-Cookie:
  cuerpo_lang=en` → following that to a clean `/` request with the new cookie
  now returns a real `200` (the actual English homepage), not a bounce back to
  `/es/articles`. Also re-ran the full existing regression set (Keystatic,
  OAuth scope, subscribe, the original `/` redirect) under the widened
  `run_worker_first: true` to confirm nothing else broke.

**Next up (Phase 2, remaining):** Cloudflare Web Analytics, RSS + sitemap
(`@astrojs/sitemap` — next new dependency, build-time only, no client cost;
worth checking its own i18n-awareness when this is picked up), build-time OG
image generation. For i18n specifically: smoke-test the Keystatic
`translationKey` relationship picker live: consider `hreflang` alternate tags
for SEO (not built this pass — flagged as a good idea, not yet approved/scoped).