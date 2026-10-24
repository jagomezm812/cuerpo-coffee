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
- At the start of every session: run git pull. Read CLAUDE.md, docs/DESIGN-SYSTEM.md, docs/SITE-PLAN.md, the last five entries of docs/CHANGELOG.md, and docs/BACKLOG.md.
- Never work on main. Create a branch (update/short-name, docs/short-name, audit/date; drafts use draft/).
- One change per session. Reuse existing components. Use design tokens only. Follow the section rules in docs/DESIGN-SYSTEM.md (band order, at most two photo spaces per page, footer dark and last).
- Before merging: the build passes, both themes and mobile are checked, and the owner has seen the preview link and approved.
- After merging: add a CHANGELOG entry (date, tag, what, why, how to undo) and tag the release (minor number for design and features: v1.2, v1.3).
- Ideas that are not part of the current task go to docs/BACKLOG.md, not into code.
- Never delete a section or component outright: hide it behind a setting first, and delete only when the owner says so.
- Never use --force or reset --hard. Never commit secrets. Never ask the owner to paste a secret into chat.
