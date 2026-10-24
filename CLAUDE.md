# Cuerpo Coffee

Home-coffee publication. Goal: $10k/month by month 30 from six income streams.
The email list is the core asset.

## Owner
Not a developer. Can run given commands; will not debug code. Explain new concepts briefly.

## Environment
`git` and `gh` are installed and authenticated on this machine (gh: account jagomezm812,
github.com, SSH protocol). Commits and PRs can be made directly — no need to ask the
owner to authenticate anything first.

## Commands
- `npm run dev`: local dev server. `npm run build`: production build (also runs the Pagefind indexer). `npm run check`: `astro check` type check. `npm run preview`: serve the built site.
- Before reporting any change done: `npm run build` and `npm run check` must both pass.

## Stack
Astro (static) · Markdown content collections · plain CSS with tokens · Keystatic at /keystatic ·
Cloudflare Worker with static assets · beehiiv (Kit until the switch session is merged) ·
Lemon Squeezy (payments)

## Hard rules
- Static output. Server code only in `worker/index.ts`, and only these routes: `/api/` routes (`/api/subscribe`, `/api/keystatic/*`), `/go/` affiliate redirects (not built yet; SITE-PLAN session 7), the Keystatic admin routes (`/keystatic`, `/keystatic/*`), the `/` redirect for returning visitors with a Spanish language cookie, and `/set-language`. `wrangler.jsonc` `assets.run_worker_first` must list every path the Worker handles. No database. Background: `docs/REFERENCE.md`.
- No client-side JS unless a feature truly requires it. JS budget: 20 KB per article page. Disclosed exceptions: the Keystatic admin UI, and the `LanguagePrompt` React island (~70 KB gzip, accepted by the owner).
- No Tailwind. All design values come from src/styles/tokens.css.
- No new dependencies without stating the cost and the alternative.
- Never commit secrets. Secrets live in Cloudflare secrets; non-secret flags in wrangler.jsonc.
- AI-drafted or writer articles arrive as pull requests from draft/ branches and are never merged without the owner's approval.
- Out of scope: comments, accounts, SSR, Docker, display ads, file hosting.
- React is allowed only for the Keystatic admin and the existing `LanguagePrompt`, until SITE-PLAN Session 6 decides whether to remove it. No other React, Vue or Svelte.

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
- At the start of every session: run git pull. Read CLAUDE.md, docs/DESIGN-SYSTEM.md, docs/SITE-PLAN.md, the last five entries of docs/CHANGELOG.md, and docs/BACKLOG.md.
- Never work on main. Create a branch (update/short-name, docs/short-name, audit/date; drafts use draft/).
- One change per session. Reuse existing components. Use design tokens only. Follow the section rules in docs/DESIGN-SYSTEM.md (band order, at most two photo spaces per page, footer dark and last).
- Before merging: the build passes, both themes and mobile are checked, and the owner has seen the preview link and approved.
- After merging: add a CHANGELOG entry (date, tag, what, why, how to undo) and tag the release (minor number for design and features: v1.2, v1.3).
- Ideas that are not part of the current task go to docs/BACKLOG.md, not into code.
- Never delete a section or component outright: hide it behind a setting first, and delete only when the owner says so.
- Never use --force or reset --hard. Never commit secrets. Never ask the owner to paste a secret into chat.

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
- **Next up:** the numbered sessions in `docs/SITE-PLAN.md`, starting with Session 0 (read-only code audit). Earlier ideas (Cloudflare Web Analytics, RSS, smoke-testing the Keystatic `translationKey` picker) are not scheduled there.
- **Known:** the Chrome extension has never connected; use the `browser-verify` skill. `npm audit` shows 4 pre-existing vulnerabilities from Astro core, deliberately left alone.

## Where to read more (docs/)
- `docs/TECHNICAL-PLAN.md`: the spec; architecture, schema, and the CLAUDE.md template.
- `docs/SITE-PLAN.md`: the numbered sessions and their status; read at the start of every session.
- `docs/DESIGN-SYSTEM.md`: read before touching any style, color, type or section.
- `docs/BUSINESS-PLAN.md`: audience, content pillars, income streams.
- `docs/EDITORIAL-POLICY.md` and `docs/AI-PIPELINE.md`: read when writing, reviewing or drafting articles.
- `docs/MARKETING-BRIEF.md`: read for promotion and email.
- `docs/UPDATE-WORKFLOW.md`: the update/branch workflow in full.
- `docs/LEARNING-GUIDE.md`: background for the owner (see the note at its top on what changed).
- `docs/CHANGELOG.md`: read the last five entries each session; add an entry after each merge.
- `docs/BACKLOG.md`: read each session; unrelated ideas go here.
- `docs/PROGRESS-INFRA.md`: read when touching `worker/`, `wrangler.jsonc`, Keystatic, subscribe, i18n or SEO.
- `docs/PROGRESS-REDESIGN.md`: read when touching a page, component or style, or debugging a visual bug.
- `docs/LESSONS.md`: read before debugging CSS, Worker routing or Keystatic; index of recurring bug classes.
- `docs/TOOLING.md`: read when working on `.claude/skills/`.
- `docs/REFERENCE.md`: the previous full CLAUDE.md (long Hard rules with the history of the Worker routing and JS-budget exceptions, Git workflow); read when a rule here needs its background.
