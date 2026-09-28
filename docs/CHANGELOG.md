# Changelog

Newest first. One entry for every change that reaches the live site.

## [date] · [version tag]
- **What changed:** [one or two plain sentences]
- **Why:** [the reason]
- **How to undo:** revert the pull request [number], or roll back in Cloudflare to the deployment before [date].

## 2026-09-28 · redesign session 1: colors and fonts (on branch redesign, not live yet)
- **What changed:** Replaced src/styles/tokens.css with the v1.1 palette, type scale, and shape scale from section 6 of docs/TECHNICAL-PLAN.md (light tokens on :root, dark tokens on [data-theme="dark"], not yet switched on anywhere). Self-hosted Manrope and Fraunces as variable woff2 fonts; removed Inter completely. Fraunces is now the page H1 only; the header wordmark and all other headings moved to Manrope. The old token names (--crema, --paper, --espresso, --copper, --line) were kept as temporary aliases to the closest new token so every existing page still renders correctly — see the alias list in CLAUDE.md's Progress section for the exact mapping and what's deferred.
- **Why:** Session 1 of the six-session redesign rollout in docs/UPDATE-WORKFLOW.md section 7 — colors and fonts only, no layout changes, on its own branch, previewed before anything touches main.
- **How to undo:** this is on the redesign branch, not merged — discard the branch, or reset it to the setup/update-system merge commit (f264dbe), to remove these commits entirely. Nothing on the live site is affected either way.

## 2026-09-28 · docs setup (no release tag — no code changed)
- **What changed:** Added the docs/ folder with the v1.1 redesign plan (the TECHNICAL-PLAN.md amendment, BUSINESS-PLAN.md, DESIGN-SYSTEM.md, UPDATE-WORKFLOW.md), this CHANGELOG and BACKLOG, and the "Update protocol" section in CLAUDE.md.
- **Why:** To set up the branch-and-approve workflow for the redesign, and give every future session one place to read the plan, the design system, and what's already changed.
- **How to undo:** revert the commits on the setup/update-system branch, or check out the v1.0-pre-redesign tag to return to the exact state before any of this.

## 2026-09-28 · v1.0-pre-redesign
- **What changed:** Snapshot of the live site before the redesign (commit e482301). Not a change.
- **How to go back here:** ask Claude Code to check out the tag v1.0-pre-redesign.
