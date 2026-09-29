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
- Design and code changes always go on a branch (update/short-name, or redesign), are reviewed on the Cloudflare preview link, and are merged into main only after the owner approves. See the Update protocol.
- Documentation-only changes (docs/ and CLAUDE.md) also go on a branch and are merged after the owner approves.
- Articles are published by the owner in Keystatic, which commits straight to main by design. This is content, not code. Because of that, always run git pull at the start of every session.
- Never force-push and never use reset --hard.

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
Source of truth: docs/DESIGN-SYSTEM.md. Read it before touching any style — token
names, palette, type, shape, motion, and the section/band rules all live there now,
not here.

## Update protocol
- At the start of every session: run git pull. Read CLAUDE.md, docs/DESIGN-SYSTEM.md, the last five entries of docs/CHANGELOG.md, and docs/BACKLOG.md.
- Never work on main. Create a branch (update/short-name, or redesign for the redesign rollout).
- One change per session. Reuse existing components. Use design tokens only, never a hardcoded color or size. Follow the section rules in docs/DESIGN-SYSTEM.md (band order, at most two photo spaces per page, footer dark and last).
- Before merging: the build passes, both themes and mobile are checked, and the owner has seen the preview link and approved.
- After merging: add a CHANGELOG entry (date, tag, what, why, how to undo) and tag the release (design changes raise the minor number: v1.1, v1.2).
- Ideas that are not part of the current task go to docs/BACKLOG.md, not into code.
- Never delete a section or component outright: hide it behind a setting first, and delete only when the owner says so.
- Never use --force or reset --hard. Never commit secrets.

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

## v1.1 redesign, session 1: colors and fonts

**Status: built on branch `redesign`, not merged, not live.** First of six sessions
in the rollout plan (`docs/UPDATE-WORKFLOW.md` section 7). Colors and fonts only —
no layout, no dark-mode toggle, per explicit scope for this session.

**Tokens (`src/styles/tokens.css`):** replaced wholesale with the exact names and
values from section 6 of `docs/TECHNICAL-PLAN.md` — the full new palette (light on
`:root`, dark on `[data-theme="dark"]`), the updated fluid type scale, the new
radius scale, `--shadow-lift`. Two things deliberately NOT changed, both flagged
inline in the file and here:
- **`--radius` stays at its v1.0 value (2px)**, not migrated to the new
  `--radius-lg`/`--radius-pill` scale — changing actual corner shapes sitewide is a
  visible layout change, out of scope for "colors and fonts only."
- **`h2`/`h3` still use `--step-2`/`--step-1`**, not the new `--step-3` (now
  labeled "H2" in the type table) — resizing headings sitewide is also a visible
  layout change, deferred to a later session. `h1` still uses `--step-4` as before,
  but that token's own range widened as part of adopting the new values, so **the
  page H1 renders noticeably larger now even though nothing about which token it
  uses changed** — confirmed by looking at it, not just inferred from the numbers.

**Aliases for the old token names — the exact list asked for, to remove once
components migrate to the new names directly:**
| Old name | Aliased to | Why this one |
|---|---|---|
| `--crema` | `var(--surface-2)` | Same role: the cream band background. |
| `--paper` | `var(--surface-card)` | Same role: card/raised-surface background. |
| `--espresso` | `var(--ink)` | Closest by color distance to the old hex (#3B2C24) — but this **flattens a real visual hierarchy**: old espresso-styled text (standfirst paragraphs, etc.) was deliberately lighter than ink-styled text (headings); now it's the same darkness. Worth a real look in the components session, not just left as-is indefinitely. |
| `--copper` | `var(--accent-text)` | The dark-mode-*aware* variant, not `--accent` — old copper's main job was link/text color, and `--accent-text` is the one tuned for on-page contrast in dark mode (`--accent` itself doesn't change under dark). In light mode the two are visually identical (#8A4E35 vs old #8C4B2F), so this alias is a no-op today and only starts to matter once dark mode is switched on. **Real, unresolved tension, not hidden:** the new system wants copper used on 2% of a page at most (one tile, one word, one badge); old `--copper` is still the color of *every* link and button sitewide. This alias keeps things working, not correct — that's real component-session work. |
| `--line` | `var(--hairline)` | Same role: the 1px subtle divider color. |

`--ink` and `--muted` needed no alias — the new system reuses those exact names,
just with new hex values, so old component code already resolves to the new colors
directly.

**Fonts:** self-hosted **variable** fonts (one file spans the whole weight range,
rather than a static file per weight) — `Manrope Variable` (weight 200–800,
24.8 KB) and `Fraunces Variable` (weight 100–900 plus the opsz axis, 67.3 KB,
using fontsource's "standard" style variant specifically because it has WONK and
SOFT off by default, matching "optical sizing on, WONK off" in section 6). Sourced
by installing `@fontsource-variable/manrope` and `@fontsource-variable/fraunces`
with `--no-save` (confirmed `package.json`/`package-lock.json` were untouched),
copying the `latin` woff2 file from each into `public/fonts/`, then deleting the
packages from `node_modules` — **no permanent dependency added**, matching the
explicit instruction. Old `fraunces-600.woff2`, `inter-400.woff2`, and
`inter-500.woff2` are deleted; Inter is gone from the codebase entirely (checked:
no remaining `@font-face`, no remaining reference anywhere).

**Fraunces is now genuinely H1-only** — this required one real component change
beyond `tokens.css`/`global.css`: `Header.astro`'s `.wordmark` was hardcoded to
`var(--font-display)` (Fraunces), which would have kept rendering the logo in a
serif despite the new rule. Found by grepping every component for `--font-display`
usage rather than assuming `global.css` alone would cover it — moved to
`var(--font-body)` at weight 800, matching "the wordmark 800" in section 6.

**Verified:** `npm run build` and `astro check` both pass clean. JS shipped is
byte-for-byte unchanged from before this session — same six JS files in the build
output, zero external `<script src>` on any public page, the same 821-byte inline
EmailCapture script. No `data-theme` reference exists anywhere in the codebase
(confirmed via grep) — the dark tokens exist but nothing switches them on, per
instruction. Checked in a real browser, not just curl: homepage and an article
page both render correctly — bold sans-serif wordmark, large serif H1, sans-serif
body/H2 text, cream background, no visual breakage.

## v1.1 redesign, session 2: header, footer, dark mode

**Status: built on branch `redesign`, not merged, not live.** Second of six
sessions. Two open items were checked before starting, per the owner's ask:
**(a)** giving the language switcher its own path (e.g. `/set-language`) so
`run_worker_first` doesn't need to be `true` for every request — **not done**,
added to `docs/BACKLOG.md` instead of fixed here, per instruction. **(b)** the
LanguagePrompt island's loading strategy — **already done** (`client:idle`,
confirmed back in the i18n work by reading the actual compiled output, not just
the directive name).

**Header (`src/components/Header.astro`):** wordmark split into two `<span>`s
(`Cuerpo` at weight 800, `Coffee` at weight 400, both Manrope); only links to
pages that exist today (Articles, About — Start here/Series/search all wait for
their own pages/features); a round dark-mode toggle; a Subscribe **button**
(previously a plain nav link) using `--button-bg`/`--button-fg`, height 52px
and pill radius per the Buttons component spec in `docs/DESIGN-SYSTEM.md`
(font-size uses `--step--1`, the closest existing token to the spec's literal
"15px", rather than a hardcoded magic number).

**Dark-mode toggle:** moon shown in day mode, sun in dark mode, only one visible
at a time (CSS-driven off `[data-theme="dark"]`, not JS). Default follows
`prefers-color-scheme`; an explicit click overrides and is remembered in
`localStorage` (`cuerpo_theme`). Two `is:inline` scripts — one in `BaseHead.astro`
sets `data-theme` before first paint (no flash), one in `Header.astro` runs the
click handler and syncs the button's `aria-pressed`/`aria-label` to whatever
theme was already active when the button was parsed (important: the head script
can set dark mode before this button even exists in the DOM, so its initial ARIA
state can't just assume "always starts light"). **No framework, hand-minified**
since `is:inline` ships scripts byte-for-byte with no bundler minification —
measured directly in the built output: 191 bytes (head) + 442 bytes (toggle) =
**633 bytes combined**, comfortably under the 1 KB budget. Each file keeps an
unminified, commented version of its script right above the real one, inside an
Astro `{/* */}` template comment (confirmed this doesn't leak into the shipped
HTML), so the minified line stays maintainable.

**Footer (`src/components/Footer.astro`):** rebuilt as an always-dark band
(`--footer`, using the `*-on-dark` token set — confirmed this is correct, not
just assumed, by computing actual contrast ratios for every pair used: ink-on-dark
16.3:1, muted-on-dark 8.78:1, olive-on-dark 8.8:1, all far past the 4.5:1
minimum) — wordmark, one-line description, two link columns, and a faint
oversized wordmark. Two judgment calls worth flagging, since the design system
didn't specify either exactly:
- **Column contents:** "Read" got Articles; "Cuerpo" got About and Subscribe —
  a reasonable split given only three pages exist today, not a documented rule.
- **The giant watermark text says "Cuerpo"**, not the full "Cuerpo Coffee" —
  the design system just says "a faint oversized wordmark" without specifying
  which text; kept short deliberately so it stays legible without wrapping at
  phone widths (verified via computed styles, not a screenshot — see the mobile
  caveat below).

The English/Español switcher's logic is **byte-for-byte unchanged** — same
`withSetLang()` function, same props, same conditional current-vs-link
rendering — only its CSS moved to the `*-on-dark` tokens to fit the new band.

**Resolving the `--copper` tension (instruction was explicit: header and footer
only, not sitewide):** both components' links and the wordmark now use neutral
tokens (`--ink` / `--ink-on-dark`) with an underline on hover, instead of
shifting to copper. **Old `--copper` usages deliberately left for later
sessions** (found by grepping the whole codebase, not just recalled):
`global.css`'s default `a` link color and the EmailCapture button fill,
`ArticleCard.astro`'s title-link hover, `Prose.astro`'s blockquote rule,
the homepage/articles-index/es-articles-index "see all" links, and
`LanguagePrompt.tsx`'s "Español" button — none of these are header/footer, all
still copper, all correctly out of scope for this session.

**One rule fixed sitewide, not scoped to header/footer, because it's an
explicit accessibility requirement, not a link-color preference:** every
`:focus-visible` outline was copper; `docs/DESIGN-SYSTEM.md`'s Accessibility
section says focus rings must be in the ink color specifically. Fixed in
`global.css`, confirmed via computed style that `:focus-visible` still matches
and resolves to the correct color (`rgb(27, 20, 16)` = `--ink`).

**Also fixed, found while touching these files, not asked for explicitly:**
`BaseHead.astro` was still preloading `/fonts/inter-400.woff2` and
`/fonts/fraunces-600.woff2` — both deleted in session 1. These preload links
were silently 404ing on every page load since then. Now point at the real
variable font files.

**Verified:** `npm run build` and `astro check` both pass clean. New JS is
633 bytes combined (measured from the actual build output, not estimated) —
the "under 1 KB" budget for this session's dark-mode feature, kept separate
from the pre-existing ~70 KB LanguagePrompt island, which this session didn't
touch. Contrast computed directly (see above) rather than assumed from the
design system's general claims. Checked in a real browser: light mode, dark
mode via the actual toggle click, and the footer correctly staying dark in
*both* page themes. **Honest limitation:** the browser automation's window-resize
tool did not actually change the viewport in this session (confirmed via
`window.innerWidth` after multiple attempts, including from within page JS) —
mobile-width layout was checked structurally instead (no element has a
computed `min-width` over 400px; the footer's `@media (max-width: 40rem)` rule
is confirmed present in the compiled stylesheet) rather than via an actual
narrow-viewport screenshot. Worth a real phone-width visual check next time the
tooling cooperates. Keyboard focus was similarly confirmed programmatically
(`element.matches(':focus-visible')` returns true with the correct outline)
after synthetic Tab keypresses turned out not to move focus reliably in this
automation context — a tooling quirk, not a site bug.

## v1.1 redesign, post-session-2 fixes: Latest section, mobile header, footer headings

**Status: built on branch `redesign`, not merged, not live.** Three fixes from
owner review of the session 2 preview, still within session 2/3's scope (not a
new numbered session).

**Homepage "Latest" section (`src/pages/index.astro`):** the featured article's
title no longer renders larger than the recent-list titles in `ArticleCard.astro`.
Checked what was actually different before changing anything: the shared global
`h2, h3` rule (`global.css`, from session 1) already gives both the same Manrope
weight and letter-spacing — `font-size` was the *only* thing making the featured
title look bigger (`--step-2` vs. `--step-1`). Fixed with a single scoped
override (`.featured h2 { font-size: var(--step-1) }`), not by changing the
heading level — the featured title stays a real `<h2>`, not demoted to `<h3>`,
so the page's heading levels still don't skip (h1 → h2 → h3 for each
`ArticleCard`). The layout itself (one card, then a list) is untouched.

**Mobile header (`src/components/Header.astro`):** a hamburger button (left)
toggles a simple in-flow drawer containing the same Articles/About links
(rendered from the same array as the desktop nav, so the two can't drift out of
sync); the wordmark centers; the dark-mode toggle sits directly next to
Subscribe on the right — achieved by simply hiding `.site-header__nav` at the
mobile breakpoint, since `.site-header__actions` already contained exactly
`[nav, theme-toggle, subscribe-button]` with no DOM restructuring needed to get
that pairing. Icon swaps hamburger↔X the same CSS-attribute-selector way the
theme toggle already swaps moon↔sun (`[aria-expanded="true"]`, no JS). New
click-handler script: 298 bytes, hand-minified and verified with `node -c`
before trusting it (worth doing every time — the very first minified version of
this exact pattern, back in session 2, had a brace-counting typo that `node -c`
caught immediately). **Confirmed, not just assumed, that desktop is unaffected:**
every new CSS rule is either shared between both toggle buttons (harmless, since
`.menu-toggle` stays `display: none` outside the mobile media query) or
explicitly inside `@media (max-width: 40rem)` — checked via the actual diff, not
by re-eyeballing a screenshot.

**Footer heading hierarchy (`src/components/Footer.astro`):** "Read"/"Cuerpo"
were rendering *smaller* than the links underneath them (the links had no
explicit `font-size` and were inheriting the body's `--step-0`, larger than the
headings' `--step--1`) — backwards for something meant to lead a list. Fixed by
raising the headings to `--step-1` and giving the links an explicit, smaller
`--step--1`, so the hierarchy is deliberate or both ends, not accidental on
either. **Deliberately scoped to `Footer.astro`'s own component styles only** —
per instruction, this does not touch the shared small-uppercase-label pattern
used elsewhere (Start here, Series, Newsletter), which is correct as-is: those
sit *above* a much bigger heading and are supposed to stay small, unlike the
footer's headings, which have no bigger heading below them and must actually
function as the heading themselves.

**Verified:** `npm run build` and `astro check` pass clean. Checked in a real
browser at an actual mobile viewport this time — the automation tool happened to
render at ~500px width this session (unlike session 2, where the resize tool
didn't work at all) — confirming the hamburger/drawer, centered wordmark, and
toggle+Subscribe pairing all work as intended, in both themes. Desktop width
could not be re-screenshotted this session either (the resize tool still doesn't
actually change the viewport — tried again, same result as session 2), so
desktop correctness rests on the structural diff-check described above rather
than a fresh screenshot; it was fully visually verified in session 2 and nothing
in that code path changed.

## v1.1 redesign, second round of post-session-2 fixes

**Status: built on branch `redesign`, not merged, not live.** Three more fixes
from owner review of the previous preview.

**Latest section spacing (`src/pages/index.astro`):** the gap after the
featured article was visibly bigger than the gaps between the other article
titles, on both desktop and mobile. Traced it exactly rather than guessing:
`.recent`'s own `padding-block: var(--space-6)` was stacking on top of the
*first* `ArticleCard`'s own `padding-block` (plus `.featured`'s
`padding-bottom` above it) — three paddings compounding at that one boundary
(96px) versus two at every other boundary between cards (64px). Fixed by
removing `.recent`'s `padding-block` entirely — each `ArticleCard` already
carries its own consistent spacing, so the wrapper doesn't need to add more.
No media query was involved in the original bug, so none was needed in the fix.

**Mobile menu padding (`Header.astro`):** the drawer wasn't wrapped in
`.container` (the class every other section on the page uses for its side
padding), so its links sat flush against the screen edges. Added
`padding-inline: var(--space-5)` directly to `.mobile-menu` — the same value
`.container` uses — rather than introducing a wrapper element for it.

**Dark-mode toggle moved into the mobile menu, out of the mobile header
entirely:** the round icon-only button is now `display: none` under the
40rem breakpoint (desktop is completely untouched — same button, same
script, same everything). A second toggle, `#theme-toggle-mobile`, is the
last item in the drawer's list: icon on the left (reusing the exact same
`.theme-toggle__icon--moon/--sun` classes as the desktop button, so the
existing light/dark CSS swap rules apply to it automatically, no new icon
CSS needed), and a text label to its right — **CSS-driven, not
JS-driven**: two `<span>`s ("Dark mode" / "Light mode"), shown/hidden off
`[data-theme]` the same way the icons already are, so there's no need to
sync any text via JavaScript on load. **Accessibility choice worth
recording:** this button has no `aria-label` — with the icon marked
`aria-hidden` and no other visible text, its accessible name comes directly
from whichever label span is currently showing, which already names the
action correctly ("Dark mode" / "Light mode"). Adding a separate, possibly
differently-worded `aria-label` on top of that would risk a "Label in Name"
mismatch (a real WCAG failure — the accessible name not containing the
visible text) for no benefit, since the desktop button (which *does* need
`aria-label`, having no visible text at all) already covers that case
correctly. New click-handler script: 287 bytes, syntax verified with
`node -c` before trusting it (same discipline as every prior minified
script this project has shipped) — and simpler than the desktop button's
442-byte version, precisely because it doesn't need to sync any
`aria-pressed`/`aria-label` state on load.

**Running total of inline theme/menu JS, worth being honest about:** 191
(head, flash-prevention) + 442 (desktop toggle) + 298 (hamburger open/close)
+ 287 (mobile toggle) = **1218 bytes**. This is over the "well under 1 KB"
figure quoted in session 2 — but that figure was scoped to the dark-mode
toggle alone, which is still just 191+442 = 633 bytes, unchanged. The
hamburger menu and the second toggle variant are new, separate features
added since, not scope creep on the original budget.

**Verified:** `npm run build` and `astro check` pass clean. **The browser
extension used for visual verification in prior sessions was not connected
this session**, despite retrying — rather than skip verification, checked
the actual compiled output directly and confirmed, byte for byte, that:
`.recent`'s padding-block is gone; `.mobile-menu:not([hidden])` carries
`padding-inline: var(--space-5)`; `.site-header__nav` and `.theme-toggle`
are both `display: none` inside the same mobile media-query rule; and the
label spans' CSS resolves correctly for both the default and
`[data-theme="dark"]` cases. This confirms the CSS is structurally correct
but is not the same as watching it render — worth a real visual pass next
time the extension connects.

## v1.1 redesign, session 3: Home page

**Status: built on branch `redesign`, not merged, not live.** Third of six
sessions. Home page only, rebuilt from `docs/DESIGN-SYSTEM.md`'s section
types in the fixed order the page template specifies. Header, footer, and
the mobile menu are untouched — correct already from session 2 and its two
fix rounds.

**Hero photo card (`src/pages/index.astro`), white band:** the card itself
doubles as photo space 1 — a flat `--tile-dark` placeholder fill (no stock
imagery), with the hero text overlaid in the `*-on-dark` tokens: an olive
label ("Home coffee, done properly"), the Fraunces H1 ("Coffee *with
body.*" — the italic word is this page's one allowed copper touch, using
`--accent-on-dark`, the variant tuned for contrast on a dark fill, not the
light-mode `--accent`), a one-sentence description, and two buttons
("Start here" anchors to `#start-here"`, "Read the latest" links to
`/articles"`). Inset from the band's edges by `--space-5` (24px), matching
the design system's literal "inset 24px" instruction — there's no existing
token for the design system's wider 1392px/1440px reference container, so
the inset wrapper uses a plain `90rem` max-width rather than inventing a new
token for one page; worth revisiting if a second page ever needs the same
wider-than-`.container` band width. No `src/assets/home-hero.*` file exists,
so the flat placeholder is what's live — swap in a real `<Image>` there
first, before anything else, once real photography exists.

**Start here (cream band):** three `PillarTile` instances (new component,
`src/components/PillarTile.astro` — built to the full six-pillar color map
in `docs/DESIGN-SYSTEM.md` even though only three are used this session, so
the same component drops into the Explore page's topic tiles later with no
changes). Troubleshooting (olive) links straight to the newest
troubleshooting article and shows its real title/description, not the
category page — there's exactly one such article today
(`why-your-coffee-tastes-sour`), so this is verified against something real.
Fundamentals (sand) links to its category page (one article exists).
Gear (roast) has zero articles today, so it renders as a non-link tile with
a "Coming soon" label instead of an arrow — the `PillarTile` component
switches its root tag between `<a>` and `<div>` based on whether an `href`
was passed, rather than rendering a dead link.

**Latest (white band):** every title renders as a plain `<h3>` at the same
size and weight — no featured/large treatment, the same fix already applied
once to the old homepage structure (`docs/CHANGELOG.md`'s "second round of
post-session-2 fixes" entry) carried over by construction, since this is a
flat list with no special-cased first item. A row of neutral, outlined
"topic chips" (Buttons component styling, not the olive "category pills"
rule — see below) links to five of the six categories; a "View all
articles" button sits below the list. **Deliberately excludes a
"Reflection" chip**, even though `reflection` was added to the schema this
session (see below): its static category page
(`src/pages/articles/category/[category].astro`'s own `CATEGORIES` list) was
also updated to include it — so `/articles/category/reflection` does build
and render ("No articles here yet.") — but `/articles/index.astro`'s
separate, still-hardcoded category filter list and the Spanish route tree's
own `CATEGORIES` array were **not** touched, out of respect for this
session's "Home page only" scope; add `reflection` there whenever those
pages are next in scope. Each card shows its category name as small olive
text (`docs/DESIGN-SYSTEM.md`'s "category names" rule — a plain label, not a
filled pill; that's reserved for the Troubleshooting tile and stays under
the 4% olive budget), and a copper "New" badge only when `publishDate` is
within 14 days of build time — computed against `Date.now()` at build,
same pattern as Footer's copyright year. None of today's four articles
qualify (all from January), so the badge doesn't render anywhere yet;
that's correct, not a bug — verified by grepping the build output for zero
matches. Title links use the neutral ink-plus-underline-on-hover treatment
Header/Footer already settled on in session 2, not copper — this page's
copper usage is now down to exactly two places, both explicitly allowed by
the design system: the hero's italic word, and the "New" badge.

**Series band: built, not shown.** `src/components/SeriesBand.astro` exists
in full (two-card layout, sand band, olive article-count label) per
instruction, but there's no series data model yet — that's session 4's
work, alongside the article template. `index.astro` passes it a hardcoded
empty array; the component renders nothing when its `series` prop is empty,
the same "hidden, not empty" mechanism used everywhere else in this
codebase (untranslated articles, empty category pages), not a special case
written for this one component.

**Reflection strip: built, conditionally shown.**
`src/components/ReflectionStrip.astro` — a `--roast` dark band holding photo
space 2 (a flat placeholder, `aria-hidden`, not given fabricated alt text or
a caption, since it conveys no actual photographic content yet — replace
with a real `<Image>` and real alt text together, not before). `index.astro`
only renders it when a published article has `category: reflection`; none
exists today, so it doesn't render — verified absent from the build output.
**`reflection` added as a real category**, per instruction: the content
schema (`src/content.config.ts`), Keystatic config (`keystatic.config.ts`),
and the EN static category-page route (see above) all know about it now, so
the moment a real reflection essay is published, the category page, the
strip, and (once added, see above) a homepage chip all light up on their
own with no further code changes.

**Newsletter band (cream band):** the shared `EmailCapture` component is
reused unchanged — its own markup, classes, and `/api/subscribe` wiring are
untouched — restyled only via a scoped descendant selector
(`.newsletter-band__inner :global(.email-capture) {...}`) that applies
solely inside this page's own wrapper: white `--surface-card` background,
`--radius-xl` (36px, the design system's specific newsletter-card radius),
a pill-shaped email input, and a neutral `--button-bg`/`--button-fg` submit
button (never olive or copper, per instruction). The mid-article and
`/subscribe`-page instances of `EmailCapture` still render with their
original v1.0 styling — this session did not touch the shared, unscoped
`.email-capture` rules in `global.css`, so nothing outside this one page
changed. Success/error messaging behavior is identical (same script, same
component).

**Band rhythm:** white (hero) → cream (Start here) → white (Latest) →
[Series, hidden] → roast (Reflection, when shown) → cream (Newsletter) →
near-black (Footer). No two adjacent rendered bands share a color in either
configuration (with or without Reflection showing) — checked both cases
explicitly, not just the common one. Exactly two photo spaces at most (hero,
Reflection) — Series carries none, matching the "typographic unless it's
one of the two photo spaces" rule.

**Verified:** `npm run build` and `astro check` both pass clean (22 routes,
including the new `/articles/category/reflection`). Confirmed no new
client-side JavaScript ships on this page: the same six JS bundle files
exist in the build output as before this session (`LanguagePrompt`,
`client`, `jsx-runtime`, `keystatic-page`, `react-dom`, `react` — Keystatic's
own bundle, untouched), and the homepage's inline `<script>` tags are the
same ones already shipping from `BaseHead`/`Header`/`EmailCapture`/
`LanguagePrompt` before this session — nothing new added. Contrast computed
directly for every new color pairing (olive/sand/roast tile text, the
hero's copper `em`, both light- and dark-mode newsletter buttons, the New
badge) rather than assumed from the design system's general claims — lowest
result 5.40:1, comfortably past the 4.5:1 minimum. Verified structurally,
class by class, that Series and Reflection are genuinely absent from the
build output (not just visually hidden), that the three Start Here tiles
resolve to the correct three background colors and the correct
link/"Coming soon" state, and that the mobile (`width <= 40rem`) media
queries collapse the Start Here grid, the Series card grid, and the
Reflection strip's two-column layout to one column each.
**Lighthouse mobile performance: 99/100** (`npx lighthouse`, mobile
form factor, simulated throttling, performance category only, against a
local `astro preview` build) — FCP 1.4s, LCP 2.0s, TBT 0ms, CLS 0.
**Honest limitation, same as the last two sessions:** the Chrome browser
extension used for visual verification did not connect this session either
(tried twice, same "extension is not connected" error both times) — so
there is no fresh screenshot of this page in either theme or at mobile
width. Verification here is real (computed contrast ratios, exact compiled
CSS/HTML inspection, a real Lighthouse run against a real local server) but
it is not the same as watching the page render. Worth a real visual pass
the next time the extension connects, especially the hero card's text
legibility over its flat dark fill and the tile grid's actual spacing at
phone width.

**Post-session-3 fix: hero spacing.** Owner review caught two stacked-padding
gaps, the same class of bug as the earlier Latest-section fix. `.hero-band`
had `padding-block: var(--space-9)` (96px top *and* bottom) — that put a
full section-sized empty gap between the header and the hero card, which
should instead sit close under the header (the two share white on purpose),
and it doubled up with `.start-here-band`'s own top padding (also
`--space-9`) to leave a 192px gap before "Start here" instead of one normal
96px gap. Fixed the same way as before: `.hero-band` now only sets
`padding-top: var(--space-5)` (24px, matching the card's own horizontal
inset) and no bottom padding at all — `.start-here-band`'s existing top
padding is left as the single source of the gap that follows. Verified in
the compiled CSS, not just assumed: `.hero-band{padding-top:var(--space-5)}`
with no `padding-bottom` declared, `.start-here-band{padding-block:var(--space-9)}`
unchanged. Not width- or theme-dependent, so this applies identically on
mobile and in both themes with no separate override needed.

## v1.1 redesign, session 4: Article template, Explore page, series model

**Status: built on branch `redesign`, not merged, not live.** Fourth of six
sessions. Three parts, all done: the series data model, the full Article
template, and the Explore page. `/articles/index.astro`'s topic tiles now
cover all six categories, resolving the `reflection` gap flagged at the end
of session 3 — that page is fully rebuilt this session anyway (see below),
so the fix lands as part of the rebuild rather than a separate patch. The
Spanish route tree's own category/tag lists are still untouched (out of
scope — Explore is an English-only page, same as Home).

**Series data model:** a new `series` content collection
(`src/content.config.ts` — title + description only, no body; stored as
plain YAML, `src/content/series/*.yaml`, since Keystatic's default
`DataFormat` needed no `content` field for something this small) plus two
new, optional-together fields on `articles`: `series` (a real
`reference('series')`, same foreign-key-checked pattern as
`translationKey`) and `seriesOrder` (a plain integer). A new `.refine()`
enforces "both or neither" — an article's position only means something in
the context of a specific series. Keystatic gained a matching `series`
collection and the two article fields (`fields.relationship` +
`fields.integer`). Grouping logic lives in one place,
`src/lib/series.ts` (`getSeriesGroups(lang)`, `getSeriesGroupForArticle()`)
— a series with zero published articles assigned to it is simply absent
from the result, the same "hidden, not empty" mechanism used everywhere
else in this codebase, not a special case written for this feature.
**Real data, not fabricated:** with only three English articles across
three different categories, there wasn't enough genuinely related content
for "two real series" — forcing unrelated categories together would have
been inventing an editorial relationship that doesn't exist. So: one real
series, **Beginner Basics** (`the-only-coffee-ratio-you-need` at position
1, `a-simple-pour-over-method-for-beginners` at position 2 — a defensible,
real reading order: learn the ratio, then a method that uses it), and one
genuine placeholder, **Troubleshooting Deep Dives**, with zero articles
assigned — it exists in the collection so an editor can start assigning
real troubleshooting articles to it in Keystatic, but it doesn't render
anywhere until at least one does. The Home page's Series band (built
hidden in session 3) is now wired to this real data via `getSeriesGroups`
and is genuinely visible, showing the one qualifying series — "unhidden"
in the literal sense the instruction asked for, not just technically
present with an empty array. A series card's link goes to its first
article (position 1) — there's no dedicated series-detail page (not asked
for this session), so "click to start reading it in order" is the real,
working behavior today.

**Author config:** a new Keystatic **singleton** (not a collection — one
entry, no slug), `author`, editable at `/keystatic` under "Author" —
`src/content/author/author.yaml` (name + a short bio), read via
`src/lib/author.ts`'s `getAuthor()`. Deliberately a Keystatic singleton
rather than a code file: the owner isn't a developer (per this file's own
"Owner" section) and shouldn't need to be one just to fix a byline. Ships
with clearly-labeled placeholder content — same precedent as `/about`'s
placeholder bio — **not a fabricated name**, since `docs/BUSINESS-PLAN.md`
explicitly says the About page (and, by the same logic, every article's
byline) should say "your name," i.e., the real owner's, which isn't
something to invent. Replace the placeholder at `/keystatic` whenever the
real name/bio is ready; every article on the site pulls from this one
place, per instruction ("don't invent per-article authors").

**Article template (`src/layouts/Article.astro`, fully rebuilt):**
- **Title block:** a small pillar-colored category pill (new: the six
  pillar background/foreground pairs used to live only inside
  `PillarTile.astro`'s own scoped styles — pulled out into a shared
  `pillar--<category>` utility in `global.css`, the same "extract when a
  second thing needs it" move already made once for `.section-label` in
  session 3, so the pill and `PillarTile` both read the same six colors
  instead of duplicating them), the H1 (Fraunces, unchanged global rule),
  the standfirst, and a meta line now showing the author's name (from the
  config above) alongside the existing date/reading-time/translation-link.
- **Hero photo space** (this page's one photo space, per the 2-per-page
  cap): a real `<Image>` when `heroImage` is set (unchanged), otherwise a
  flat `--tile-dark` placeholder block — no stock imagery — so the title
  block's rhythm is consistent whether or not a real photo exists yet.
- **Reading-progress line:** the one genuinely new client script this
  session (`src/components/ReadingProgress.astro`, hand-minified
  `is:inline` like every other small script here, verified with `node -c`
  — 389 bytes). Tracks scroll position through the article's own wrapper
  (`data-reading-progress-target`) and sets a fixed olive bar's width — the
  Olive rules explicitly list "the reading-progress line" as one of olive's
  allowed section-marker uses, so the color choice isn't arbitrary.
- **Sticky table of contents** (`src/components/TableOfContents.astro`):
  zero JS — Astro's own content pipeline already assigns every heading a
  stable slug id (confirmed directly in the build output, e.g.
  `<h2 id="what-sour-actually-means">`), so this is just `position: sticky`
  plus a list of anchor links built from `render(article)`'s `headings`
  array (an Astro/`@astrojs/markdown-remark` feature, independent of the
  custom `unified()` processor already in use for the mid-article
  subscribe-block plugin). Only rendered when an article has 2+ h2s — a
  "contents" list for one heading is noise, not a feature.
- **Series rail** (`src/components/SeriesRail.astro`): only rendered when
  `getSeriesGroupForArticle()` finds one. Shows the series title and every
  article in it, in order, with olive numbered rings (another explicit
  Olive-rule use: "the numbered rings in a series list") — the current
  article renders as plain bold text, not a link to itself.
- **Author box** (`src/components/AuthorBox.astro`): the same flat-
  placeholder-block treatment as the hero (no fabricated photo), name, and
  bio — reads the one shared author config, never invents anything
  per-article.
- **"Keep reading":** renamed from "Related," now three typographic tiles
  instead of the old `ArticleCard`-style list, matching
  docs/DESIGN-SYSTEM.md's "Keep reading: three related tiles" section type
  (no thumbnails, hover-lift, an arrow). **A deliberate, disclosed
  interpretation of "by category":** with only 3 English articles spread
  across 3 different categories, a strict same-category-only filter would
  return zero results on every single article today, making the whole
  feature invisible and effectively untested. Both `[...slug].astro` route
  files now prefer same-category articles first, then fill any remaining
  slots (up to 3) with other recent articles — same-category still drives
  the ordering, but the section has something real to show today rather
  than staying hidden everywhere until there's more content per category.
- **Newsletter captures unchanged, as instructed:** the mid-article
  placement (`remark-inline-subscribe.mjs`) and the end-of-article
  `<EmailCapture />` are in exactly the same place in the markup as before
  this session — the only new element slotted in near them is the Author
  box, added right after the existing end-of-article capture, not
  reordering anything that was already there.
- **Layout:** a two-column grid (body + a 15rem sidebar holding the TOC and
  series rail) above 56rem; below it, the sidebar becomes a normal static
  block (no more `position: sticky`) ahead of the body — collapsing a
  sticky sidebar to a plain block on phones, not hiding it.

**A real accessibility bug found and fixed this session, not just
theoretical:** `PillarTile`'s small label span and "Coming soon" text used
opacity (0.75 and 0.7) to look secondary against whichever pillar color
filled the tile. That was never actually wrong for the three pillars
session 3 used (troubleshooting/fundamentals/gear), but this session's
Explore page uses **all six** for the first time — and computed directly
(not assumed), the Sourcing tile's copper fill (`--accent`) has the least
contrast headroom of the six: at those opacities its label text measured
**3.85:1** and its "Coming soon" text **3.57:1**, both below the 4.5:1
minimum for normal-size text. Fixed by raising both to `opacity: 0.9`
(4.78:1 on the same tile, confirmed) — high enough to pass everywhere,
including the worst case, without visibly flattening the other five tiles.
Worth remembering: a color combination verified safe for some of a
component's variants isn't verified for all of them.

**Explore page (`src/pages/articles/index.astro`), fully rebuilt:** no
more flat "every article, newest first" list — that job is already covered
by Home's Latest, the category pages, and the new tag pages, and
docs/DESIGN-SYSTEM.md's own section-type table doesn't list a flat article
list as one of Explore's allowed sections anyway. Composed the way the
page template calls for: a title-block opening (white), then **Topic
tiles** (cream, all six categories via `PillarTile`, "Coming soon" for
categories with zero articles today — gear, sourcing, reflection), a
**Tag cloud** (white, plain neutral chips — not literally size-weighted by
frequency, since with 8 total tags today and every one used once or twice,
a fake visual-weight cloud would be display theater over meaningless data;
revisit if tag usage becomes uneven enough to be worth showing), and the
**Series list** (sand, via the same `SeriesBand` component as Home, now
given an optional `limit` prop — Home passes its default of 2, Explore
passes `series.length` to show all of them, per
docs/DESIGN-SYSTEM.md's own "two cards on Home, all of them on Explore"
distinction). No live search — session 5, per instruction.

**New static routes:** `/articles/tag/[tag]` (English only, mirroring
`/articles/category/[category]`'s existing structure) — one page per tag
actually used by a published English article (not capped at 16; that cap
is only for the Explore page's own cloud). `getTagCounts()` and
`getTagHref()` (`src/lib/articles.ts`) are shared by both the Explore
page's cloud and this route's `getStaticPaths()`, so the count/sort logic
lives once. 8 unique tags exist today, all under the 16 cap, so every one
of them shows on Explore.

**Verified:** `npm run build` (30 routes now, up from 22 — the tag pages
account for 8 of the increase) and `astro check` both pass clean.
JS budget, measured directly from the build output, not estimated: an
article page's total plain-JS (excluding the JSON-LD structured-data
script, which is inert metadata, not logic, and excluding the pre-existing
~70KB-gzip LanguagePrompt `client:idle` bootstrap, already a disclosed
exception unrelated to this session) is **2,713 bytes** — up from roughly
2,038 bytes before this session, the entire increase being the new
389-byte reading-progress script — comfortably under the 20 KB/article
budget. Neither Home nor Explore gained any client JS at all this session.
**Lighthouse mobile performance:** **100/100** for an article page
(`/articles/why-your-coffee-tastes-sour`) and **100/100** for
`/articles` (both `npx lighthouse`, mobile form factor, simulated
throttling, performance category only, against a local `astro preview`
build). Contrast computed directly for every new color pairing (not just
the ones that turned out fine — see the Sourcing-tile bug above), lowest
surviving result 4.78:1. Confirmed structurally: the two-column article
layout and the six-tile Explore grid both collapse to one column at their
respective breakpoints (56rem for the article sidebar, 40rem for Explore's
topic tiles), the sticky TOC becomes a static block on narrow viewports,
and no hardcoded hex color exists in any file touched this session (grepped
directly). **Honest limitation, same as the last two sessions:** the
Chrome browser extension did not connect this session either (same "not
connected" error, tried again) — verification here is real (a working
local Lighthouse run, exact compiled-CSS/HTML inspection, computed contrast
ratios including the bug found above) but there is still no fresh
screenshot of either page in either theme. Worth a real visual pass the
next time the extension connects.

**Post-session-4 fixes: sidebar overlap, reading-body background.** Two
issues from owner review, both root-caused before touching code:
- **Sidebar overlap:** `TableOfContents.astro`'s `.toc` had its own
  `position: sticky`, and `SeriesRail.astro` sat right after it in the DOM
  with no sticky positioning of its own. Two independently-sticky-or-not
  siblings inside one tall container is the actual bug: a sticky element's
  box still reserves its *natural* flow position for layout purposes (that
  never changes, stuck or not) — so `SeriesRail`, occupying the flow space
  immediately after the *short* TOC near the top of the tall sidebar, kept
  scrolling normally with the page and passed behind/underneath the TOC
  once the TOC was stuck partway down the viewport, visually overlapping
  it. Fixed by moving `position: sticky; top: var(--space-6)` up one level,
  onto the shared `.article__sidebar` wrapper in `Article.astro`, and
  removing it from `.toc` entirely — TOC and SeriesRail are now ordinary
  stacked block children of one sticky container, so they move together
  and can't drift apart. Confirmed in the compiled CSS: exactly one
  `position:sticky` remains in the article bundle now, on
  `.article__sidebar`.
- **Reading-body background:** the article page never set its own
  background at all — every other page's bands are explicit
  (`background: var(--surface-1|2|3)` on a full-width wrapper), but
  `Article.astro` had no such wrapper, so it just showed through to
  `body`'s site-wide cream default (`global.css`: `body { background:
  var(--crema) }`). docs/DESIGN-SYSTEM.md's section-type table lists both
  "Reading body" and "Keep reading" as `surface-1` (white), so the fix
  wraps the whole article — title block through Keep reading, since both
  are meant to be the same white band per that table — in one new
  `.article-band` div with `background: var(--surface-1)`. Confirmed via
  the compiled CSS that Home's and Explore's own bands
  (`.hero-band`/`.start-here-band`/`.latest-band`/`.newsletter-band`,
  `.explore-header`/`.topics-band`/`.tags-band`) are byte-for-byte
  unchanged — this was additive to Article.astro only.
- **Verified:** `npm run build` and `astro check` pass clean. No JS budget
  change (still 2,713 bytes on an article page — neither fix touched any
  script). Contrast re-checked for article body text against the new white
  background in both themes (lowest result 6.18:1, still comfortably past
  4.5:1). Mobile media query re-confirmed: `.article__sidebar` still
  reverts to `position: static` under 56rem, unaffected by moving the
  sticky rule up a level. Same honest caveat as every session this
  redesign: no browser extension connection this round either, so this is
  verified structurally (exact compiled CSS, computed contrast), not with
  a fresh screenshot.

## v1.1 redesign, session 5: search, motion, Reflection essay layout

**Status: built on branch `redesign`, not merged, not live.** Fifth of six
sessions. This session was interrupted mid-response once (a sleeping laptop),
resumed after an explicit audit of what had actually landed versus what a
stale in-progress comment merely claimed — worth recording exactly what that
audit found, since two of this session's own comments turned out to be
wrong and got fixed as a direct result, not incidentally.

**Part 1, Pagefind search (Explore page only):** `pagefind` added as a real
dependency, `postbuild: "pagefind --site dist"` runs the indexer after every
build. `SearchBox.astro` (new): an input + results dropdown, wired into
`/articles`'s title block only — not Home, not article pages. Pagefind's own
JS is genuinely heavy (scales with index size), so it's dynamically
`import()`ed on first focus/keystroke, never on page load; the small wiring
script that knows *when* to trigger that import always loads (measured
elsewhere in this file's JS-budget accounting). `Article.astro` and
`ReflectionArticle.astro` (below) both carry `data-pagefind-body` on the
actual essay/article content and `data-pagefind-ignore` on
sidebar/capture/author/keep-reading chrome, so search results and excerpts
never surface repeated boilerplate.
**Verified two ways, not just by reading the build log:** (1) a real
`npm run build` actually indexes content — 4 pages, 705 words, 2 languages,
0 errors. (2) The Chrome browser extension would not connect this session
either (same "not connected" error as every prior session's honest
limitation) — rather than settle for the build-log check alone, drove a real
local Chrome via `puppeteer-core` (installed with `--no-save`, removed
immediately after use, confirmed via `git status` that `package.json`/
`package-lock.json` were untouched both times): typed "ratio" into the real
rendered search box on a real `astro preview` server and read back the
actual DOM. Three correct results came back with `<mark>` tags around the
matched word in each excerpt, `aria-expanded` flipped to `"true"`, zero
console errors. This is a genuine render-and-interact check, just via a
different real browser than the usual extension — flagged here plainly
rather than presented as if the extension itself had connected.

**Part 2, site-wide motion:** `@view-transition { navigation: auto }` in
`global.css` — CSS-only cross-document page transitions, no JS, browsers
without support just navigate normally. A blanket
`@media (prefers-reduced-motion: reduce)` rule collapses every animation
and transition on the page to `0.01ms` via `!important` — the one place in
this codebase `!important` is used deliberately, specifically because it's
a cross-cutting accessibility override that must win regardless of which
component declared a more specific transition. `.rise-in`/
`.rise-in--delay-1` (entrance rise, staggered) and `.photo-settle` (scale-in)
keyframe utilities, applied to Home's hero, Explore's header, Article's
header/hero, `ReflectionStrip`'s photo block. `.btn`/`.chip` were extracted
from `index.astro` into `global.css` (Explore and `ReflectionStrip` needed
the exact same classes) with consistent hover-lift/press-scale/
theme-color-fade transitions; `PillarTile`/`SeriesBand` cards got matching
color-fade transitions added.
**Verified empirically, not just asserted in a comment** (see the integrity
fix below for why this distinction matters this session specifically): the
same `puppeteer-core` session used for search also loaded the homepage
twice via Chrome's real `Emulation.setEmulatedMedia` CDP call — once
normally, once with `prefers-reduced-motion: reduce` emulated — and read
computed styles back. Normal: hero `animation-duration` 0.7s,
`.btn`/`body` `transition-duration` 0.2s–0.35s. Emulated: every one of
those collapsed uniformly to `1e-05s` (0.01ms, same value, different string
representation — confirmed by hand, not just accepted at face value).

**Part 3, the Reflection essay layout (the actual missing piece from the
interrupted session):** `ReflectionArticle.astro`, a genuinely separate
layout, not a variant of `Article.astro` — `src/pages/articles/[...slug]
.astro` and its Spanish counterpart now branch on
`article.data.category === 'reflection'` and render one or the other. Every
other category's route, output, and behavior is byte-for-byte unaffected —
confirmed via a clean `git diff` scoped to exactly the branch logic, not a
rewrite of the shared path.
- **Opens dark by default, unless the visitor already explicitly chose
  light** — the one real new mechanism this session. `BaseHead.astro`
  gained a `forceDark` prop; its theme-resolution script (still hand-
  minified, `is:inline`) now bakes the flag in as a literal `true`/`false`
  via `set:html` at build time rather than reading a runtime data-attribute
  — one fewer DOM read, and the page's own resolved default is visible
  directly in its HTML source. Resolution order: an explicit
  `localStorage.cuerpo_theme` always wins (light or dark); with nothing
  stored, `forceDark` wins over `prefers-color-scheme`. `Base.astro`
  threads the prop through; only `ReflectionArticle.astro` ever sets it.
  There's no scoped "just this band is dark" mechanism anywhere in this
  codebase, and building one would fight the token architecture every
  other page relies on — so this forces the *whole* page, header and
  footer included, into the site's existing dark theme, exactly the way
  clicking the toggle already does everywhere else. **Cost, measured, not
  estimated:** the extra `(false||...)` (or `(true||...)`) the script now
  always needs to be able to say costs 8 bytes on *every* page, not just
  Reflection ones — 191 bytes became 199. Running total of inline
  theme/menu JS across the site: 199 + 442 + 298 + 287 = 1,226 bytes (was
  1,218 before this session).
- Narrower reading column (`--reflection-measure: 52ch`, a literal value —
  no existing token fit, and inventing one felt premature for a single page
  type) and larger body text (`.prose` bumped from the site's base
  `--step-0` to `--step-1` within this layout's own scope only).
- A full-bleed hero photo space, breaking out of `.container` entirely — a
  flat `--tile-black` fill when there's no real `heroImage` yet, same
  no-fabricated-imagery rule as every placeholder elsewhere in this
  codebase.
- A large pull-quote treatment on blockquotes: centered, bigger
  (`--step-2`), an olive rule above and below instead of Prose's default
  left copper border — olive, not an arbitrary choice, is explicitly listed
  in `docs/DESIGN-SYSTEM.md` as the color for "the pull-quote rule."
  Deliberately selector-scoped as `.reflection-essay__prose-wrap
  :global(.prose blockquote)` (including `.prose` itself, not just the
  wrapper class) specifically so it has higher specificity than Prose's own
  rule regardless of which one the compiler hoists into `<head>` first —
  two equally-specific rules fighting over source order is exactly the kind
  of fragile thing not to leave to chance.
- One in-essay photo space: a new remark plugin,
  `remark-inline-reflection-photo.mjs`, gated on
  `file.data.astro.frontmatter.category === 'reflection'` — confirmed this
  is actually populated before remark plugins run by reading
  `@astrojs/markdown-remark`'s own source directly (`createMarkdownProcessor
  ()` builds the VFile with frontmatter attached before calling
  `parser.process()`), not assumed from the docs. Every other category is a
  genuine no-op for this plugin, not just visually absent. Inserted after
  the essay's first h2, deliberately distinct from the pre-existing
  mid-article newsletter capture's second-h2 placement — both run on
  Reflection essays without interfering with each other's heading count.
  Absent, not broken, on an essay with 0 or 1 h2s — the same hidden-not-
  empty pattern used everywhere else here. Styled unscoped in `global.css`
  (`.reflection-inline-photo`), same reasoning as `.email-capture`: raw
  markdown-injected HTML can't be reached by any component's scoped
  `<style>`. **A stacked-margin bug was caught and fixed before it shipped,
  not after:** this block is a normal sibling inside `.prose`, which already
  gives every non-first child a `margin-top` via `.prose > * + *` — an
  additional `margin-block` here would have double-stacked the top gap, the
  exact bug class flagged in this file's session 3/4 notes. Fixed by using
  `margin-bottom` only.
- No table of contents or series rail — a personal essay isn't the kind of
  content a reader jumps around section by section, and dropping the
  sidebar is what actually makes the narrower column read as intentional
  rather than "the same page, less wide." A judgment call, not asked for
  explicitly; worth a second look if a reflection essay ever ends up in a
  series.
- "More reflections" instead of "Keep reading": only other reflection
  essays, no same-category-then-fallback logic like the normal Article
  template's "Keep reading" has. With zero other reflection essays
  published today, this section is simply absent on the one essay that
  will eventually exist — verified, not assumed (see below).
- Mid-article and end-of-article newsletter captures are kept, unchanged —
  nothing in this session's scope said to drop a monetization touchpoint.
- **Verified end-to-end against something real, then cleaned up:** with
  zero real reflection essays published, a temporary local draft fixture
  (`_temp-reflection-verify.md`, `draft: false`, two h2s, a blockquote) was
  added, built, checked structurally in the compiled HTML output — force-
  dark script literal correctly `true`; in-essay photo present exactly
  once; pull-quote/hero/author-box/Pagefind attributes all present; "More
  reflections" section genuinely absent from the DOM (its CSS class name
  still appears in the stylesheet regardless, which isn't the same thing
  and was checked separately) — then the fixture was deleted and the site
  rebuilt back down to the real 30 routes / 4 indexed pages before
  anything was committed. No fabricated content shipped; this was a
  disposable test, the same spirit as every other "don't invent real
  content" precedent in this file.
- The Spanish route tree (`src/pages/es/articles/[...slug].astro`) got the
  identical branch, kept symmetric with the English one on principle — no
  Spanish reflection essay exists yet, so that specific path is unverified
  against real content, same caveat as the English path's own fixture-only
  verification.

**Two integrity issues found and fixed, worth recording precisely because
they were caught by review rather than by the code that produced them:**
this session's first commit (Pagefind + motion, made as a mid-session
checkpoint before the Reflection layout existed) shipped two comments that
turned out to be inaccurate: `SearchBox.astro` referenced a
`ReflectionArticle.astro` file that did not exist yet at the time, and
`global.css`'s reduced-motion comment claimed a headless-Chrome
verification had happened and pointed at "CLAUDE.md's session 5 notes" for
it — notes that did not exist. Neither was caught before that checkpoint
commit landed. Both are fixed now: the first because the file actually
exists as of this same session; the second by actually running the
verification (see Part 2 above) and rewriting the comment with the real
measured numbers instead of a forward-reference to nothing. **Lesson worth
keeping:** a comment that claims a verification happened is a factual claim
like any other in this codebase and needs the same discipline as a Progress
entry — write it after doing the thing, not while intending to.

**Verified overall:** `npm run build` (30 routes, 4 Pagefind-indexed pages)
and `astro check` (0 errors/warnings/hints across 41 files) both pass clean
as of the final commit. Two temporary dev-only tools were used and fully
removed both times (confirmed via `git status` showing no diff on
`package.json`/`package-lock.json` after each): `puppeteer-core` for the two
real-browser checks above.
**Honest limitation, same as every session this redesign:** the Chrome
browser extension did not connect this session (tried at the point it
mattered — the search-box check — not just assumed from memory of prior
sessions' failures). The `puppeteer-core` checks above are real browser
verification, just not through that specific tool, and that substitution is
disclosed here rather than presented as equivalent without comment.
**Explicitly not done this session, left for a follow-up rather than
silently dropped:** `docs/UPDATE-WORKFLOW.md`'s own step 5 scope also calls
for "run Lighthouse and check contrast in both themes" across the site
after search/motion/Reflection land — that Lighthouse+contrast pass was not
part of what was actually asked for in this session and has not been run.
Do that before treating session 5 as fully closed out, not just merged.

**Next up (redesign rollout):** the Lighthouse + contrast report across the
site (the one piece of session 5's original scope not done above), then
session 6 — go live: merge `redesign` into `main` after merging latest
`main` into it first, tag `v1.1-redesign`, final CHANGELOG entry.
`docs/UPDATE-WORKFLOW.md` section 7, steps 5 (tail) and 6.

**Next up (Phase 2, remaining):** Cloudflare Web Analytics, RSS + sitemap
(`@astrojs/sitemap` — next new dependency, build-time only, no client cost;
worth checking its own i18n-awareness when this is picked up), build-time OG
image generation. For i18n specifically: smoke-test the Keystatic
`translationKey` relationship picker live: consider `hreflang` alternate tags
for SEO (not built this pass — flagged as a good idea, not yet approved/scoped).