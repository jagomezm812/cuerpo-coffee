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
- Static output only, with two narrow exceptions in `worker/index.ts`: Keystatic's
  GitHub OAuth calls, and proxying the subscribe form to Kit's API so the real API
  key never reaches the browser (see Progress). No other server code, no database.
- No client-side JS unless a feature truly requires it. JS budget: 20 KB per article page.
  (The Keystatic admin UI at /keystatic is exempt — it's a CMS tool, not a public page,
  and is noindex'd and robots-disallowed. The EmailCapture inline-confirmation script
  counts against the budget and is verified well under it — ~820 bytes, inlined, no
  separate request.)
- No Tailwind. All design values come from src/styles/tokens.css.
- No new dependencies without stating the cost and the alternative.
- Never commit secrets. Environment variables live in the Cloudflare dashboard, on the
  `cuerpo-coffee` Worker's Settings → Variables and secrets — except the ones that
  aren't actually sensitive (OAuth client ID, Kit form ID), which live in
  `wrangler.jsonc` instead so they survive every deploy (see Progress for why).
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
  **Not yet verified:** an actual live subscribe with a real Kit API key — that
  needs the owner to add `KIT_API_KEY` as a Cloudflare dashboard Secret first (not
  yet done as of this session), then this needs deploying and testing for real.

**Next up (Phase 2, remaining):** Cloudflare Web Analytics, RSS + sitemap
(`@astrojs/sitemap` — next new dependency, build-time only, no client cost),
build-time OG image generation.