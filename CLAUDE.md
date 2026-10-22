# Cuerpo Coffee

English-language coffee publication. Teaches beginners to make good coffee at home.
Selling a paid digital guide from month 5.

## Owner
Not a developer. Can run given commands; will not debug code. Explain new concepts briefly.

## Environment
`git` and `gh` are installed and authenticated on this machine (gh: account jagomezm812,
github.com, SSH protocol). Commits and PRs can be made directly — no need to ask the
owner to authenticate anything first.

## Commands
- `npm run dev`: local dev server. `npm run build`: production build (also runs the Pagefind indexer). `npm run check`: `astro check` type check. `npm run preview`: serve the built site.
- Before reporting any change done: `npm run build` and `npm run check` must both pass.

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

## Keeping this file up to date

CLAUDE.md is loaded into every session, so it must stay small (target under 20,000 characters; the hard limit is 150,000).
- **Never paste long session notes into CLAUDE.md.** Long session notes go in `docs/PROGRESS-INFRA.md` (infrastructure, Worker, Keystatic, i18n, SEO) or `docs/PROGRESS-REDESIGN.md` (pages, components, styles), and a short summary goes in `docs/CHANGELOG.md`.
- After each piece of work, update only the "Current state" block below. That block must stay under 2,000 characters; if it grows past that, trim it, don't expand it.
- Create any other docs you need under `docs/` and add one line for each to the list below.
- References in older text to "Progress" or "Progress notes" mean those two `docs/PROGRESS-*.md` files.

## Current state
(Keep this block under 2,000 characters.)
- **Live:** the v1.1 redesign (tag `v1.1-redesign`) plus the technical SEO fixes (sitemap, robots.txt, hreflang, og:image), merged 2026-10-18. `main` deploys automatically to cuerpo.coffee.
- **Temporary:** two stock photos (Home hero, sour-coffee article hero) await the owner's own photography; tracked in `docs/BACKLOG.md`.
- **Next up:** Cloudflare Web Analytics; RSS feed; smoke-test the Keystatic `translationKey` relationship picker live. Phase 4 (Lemon Squeezy) not started.
- **Known:** the Chrome extension has never connected; use the `browser-verify` skill. `npm audit` shows 4 pre-existing vulnerabilities from Astro core, deliberately left alone.

## Where to read more (docs/)
- `docs/DESIGN-SYSTEM.md`: read before touching any style, color, type or section.
- `docs/TECHNICAL-PLAN.md`: the original spec; read for architecture and schema background.
- `docs/BUSINESS-PLAN.md`: read for audience, content pillars and monetization.
- `docs/UPDATE-WORKFLOW.md`: read for the update/branch workflow in full.
- `docs/CHANGELOG.md`: read the last five entries each session; add an entry after each merge.
- `docs/BACKLOG.md`: read each session; unrelated ideas go here.
- `docs/PROGRESS-INFRA.md`: read when touching `worker/`, `wrangler.jsonc`, Keystatic, subscribe, i18n or SEO.
- `docs/PROGRESS-REDESIGN.md`: read when touching a page, component or style, or debugging a visual bug.
- `docs/LESSONS.md`: read before debugging CSS, Worker routing or Keystatic; index of recurring bug classes.
- `docs/TOOLING.md`: read when working on `.claude/skills/`.
- `docs/REFERENCE.md`: superseded CLAUDE.md wording, kept for completeness.
