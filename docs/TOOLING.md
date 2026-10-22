# Project tooling

Moved verbatim from `CLAUDE.md`. Read it when working on `.claude/skills/`.

## Project tooling: Claude Code skills for this repo's recurring workflows

**Status: built on branch `update/project-skills`, merge pending owner
approval.** Three project-scoped skills added under `.claude/skills/`, encoding
patterns this project has repeated by hand across essentially every session so
far rather than leaving them to be re-derived (or forgotten) each time:

- **`browser-verify`** — the real-browser verification harness. This project's
  Chrome extension has never once connected, in any session, ever recorded in
  this file — so every visual/CSS check has used a temporary local
  `puppeteer-core` install instead. The skill encodes the install → verify →
  uninstall → confirm-no-package-diff discipline as a fixed sequence (not
  something to remember fresh each time), the standard light/dark/mobile
  viewports this project has settled on, patterns for hover-state and
  stacking-context checks (both real bug classes this project has hit more than
  once), and a WCAG contrast-ratio script with correct alpha compositing —
  the exact category of mistake this project's own pre-session-6 audit caught
  in itself once already (treating a translucent color as opaque). The
  compositing math was verified against a known case before trusting it: 50%-
  opacity white over black correctly drops contrast from 21:1 to ~4:1, not
  left at 21:1 as it would be if the script wrongly treated the translucent
  color as already-opaque.
- **`session-start`** — CLAUDE.md's own "Update protocol" (git pull; read
  CLAUDE.md, `docs/DESIGN-SYSTEM.md`, the last five CHANGELOG entries,
  `docs/BACKLOG.md`; confirm the branch) as a checklist to run, not a paragraph
  to recall.
- **`changelog-entry`** — the exact `docs/CHANGELOG.md` entry format this
  project uses (including the "(on branch X, not live yet)" convention for
  pre-merge work), plus `references/house-style.md`, which distills this very
  Progress section's own established voice — separating "built" from
  "verified," disclosing limitations plainly instead of rounding up, recording
  root causes and dead ends rather than just the fix, flagging judgment calls
  as judgment calls, never fabricating content — into named patterns with real
  excerpts from this file's own history, for a future session to match
  consistently rather than reinvent.

**Deliberately did not run skill-creator's full parallel-subagent
benchmark/eval loop for these** — that machinery is built for skills with
somewhat subjective or varied output (writing style, generated documents,
creative work) where comparing several real runs side by side earns its cost.
These three are deterministic, procedural, internal-only checklists; the
right verification was testing the one skill with actual executable code
(`contrast.mjs`) against known values directly, which was done above, not
spinning up a comparison harness disproportionate to what's being checked.

