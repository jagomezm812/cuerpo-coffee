# Cuerpo Coffee — Site Sessions Index

**Version 1.0 · October 2026.** Save in the repo as `docs/SITE-PLAN.md`. This is the list of planned Claude Code sessions that bring the site in line with the $10k plan (business plan v2.0). The full ready-to-paste prompt for each session lives in the claude.ai **Site & Docs Update Plan** and is handed to the owner in chat when that session's turn comes. One session per sitting, always under the update protocol in `CLAUDE.md`.

| # | Session | When | Branch | Depends on | Status |
|---|---|---|---|---|---|
| — | Sync documents into `docs/` | Week 1 | `docs/10k-plan` | Updated Project documents | Next |
| 0 | Full code audit, read-only → `docs/AUDIT-2026-11.md` | Week 1 | `audit/2026-11` | Docs synced | Pending |
| 1 | Search foundations: thin pages out of sitemap + noindex, hreflang only where translated, Breadcrumb/FAQ/Organization/Person JSON-LD, "Updated" date, `check:content` warnings | Week 2 | `update/seo-foundations` | Session 0 | Pending |
| 2 | Article, capture and home fixes: capture placement, checklist offer, `source` field, About newsletter band, 3 "Keep reading", hide empty tiles, full header | Week 3 | `update/article-capture` | Session 1 | Pending |
| 3 | Trust pages: `/editorial-policy`, `/disclosure`, `/privacy`, footer column | Week 4 | `update/trust-pages` | `EDITORIAL-POLICY.md` | Pending |
| 4 | Editor access and AI draft lane: Keystatic `draft/` branches + PRs, PR template, `aiAssisted`/`editor` fields, `prompts/` folder | Week 4, before the writer starts | `update/editor-access` | `AI-PIPELINE.md` | Pending |
| 5 | Switch email to beehiiv (free plan), `/thanks`, `EMAIL_PROVIDER` flag | Month 2 | `update/beehiiv` | beehiiv account + secrets | Pending |
| 11 | **Shop page** for the first printable: `/shop`, product tiles, Lemon Squeezy checkout links in `src/data/links.json`, Product JSON-LD, footer link | Month 2, before the printable launch | `update/shop` | Lemon Squeezy product created | Pending |
| 6 | Lighter language prompt (<2 KB script), remove React if unused, Spanish links only where translated | Month 2 | `update/lang-prompt` | Session 0 numbers | Pending |
| 7 | Affiliate links (`/go/` redirects) and buying-guide blocks (Pick, Rejected, affiliate line) | Months 2–3, before the first gear guide | `update/affiliate` | Design system v-Oct 2026 | Pending |
| 8 | Click-to-play YouTube videos + VideoObject | Month 3 | `update/video-embed` | First video | Pending |
| 9 | Brew ratio calculator `/tools/ratio` | Months 3–4 | `update/ratio-tool` | — | Pending |
| 10 | Guide waitlist and two-tier sales pages behind `METHOD_LIVE` | Months 4–5 | `update/method-pages` | Waitlist copy, Lemon Squeezy products | Pending |

**After Session 10:** content mode. Code changes only from `docs/BACKLOG.md`, batched about once a month.

**Year-2 backlog (no prompts yet):** `/selection` (partner-roaster subscription, links to the roaster's store), merch page (print-on-demand partner), `/reserve` (beehiiv membership), "Gear I use", grinder finder tool, sponsor page, Spanish edition chrome and translated slugs.

When a session is merged, Claude Code updates its Status here and adds a CHANGELOG entry.
