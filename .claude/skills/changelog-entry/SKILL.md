---
name: changelog-entry
description: Use this whenever a Cuerpo Coffee change is about to be reported as done — before telling the user "build passes, ready for review" or similar. Every code-shipping turn on this project needs two things written up, in this project's own established format, not a generic one: a docs/CHANGELOG.md entry, and an update to CLAUDE.md's own Progress section (CLAUDE.md literally instructs this: "every time you execute some part of the project, you must register your advances in this document"). Use this for both new feature work and bug-fix turns, on any branch, including redesign-rollout work that isn't live yet. Also use it when finalizing a merge to main (a slightly different entry shape — see below).
---

# Writing up a Cuerpo Coffee change

This project keeps two living records, and they serve different readers:
**`docs/CHANGELOG.md`** is a compact, scannable list for the owner (a
non-developer) to see what changed and how to undo it. **`CLAUDE.md`'s Progress
section** is a detailed account for the *next session* — written so a fresh
session with no memory of this one can pick up exactly where it left off,
including judgment calls made, bugs found, and things deliberately left undone.
Write both. Don't skip the second one because the first one exists — they're not
redundant.

## docs/CHANGELOG.md

Newest entry goes right after the template block at the top of the file (the file
is newest-first). Exact shape:

```markdown
## YYYY-MM-DD · <short tag>
- **What changed:** [plain-language summary, one or two sentences per distinct
  thing — the owner isn't a developer, so describe outcomes, not implementation]
- **Why:** [the actual reason — "owner asked," "owner review caught X," a real
  bug, a planned session]
- **How to undo:** [a concrete, actionable instruction — see below]
```

**If this work is on a branch that hasn't merged to `main` yet** (e.g. a
redesign-rollout branch under review), say so explicitly in the tag itself and
in "How to undo," the same way every pre-merge entry in this file already does:

```markdown
## 2026-10-01 · redesign fix: <short description> (on branch redesign, not live yet)
...
- **How to undo:** this is on the redesign branch, not merged — reset the branch
  to the prior commit (<short hash>) to remove just this fix. Nothing on the live
  site is affected either way.
```

**If this work just merged to `main`** (the rarer, "going live" case): point at
the real merge commit and, if there's a version tag before this rollout, offer
that as the rollback anchor too:

```markdown
- **How to undo:** revert the merge commit on `main` (`<hash>`), or check out the
  `<previous-version-tag>` tag to return to the exact state before this work began.
```

Get the real commit hash before writing the entry — `git log --oneline -5` — never
guess or leave it as a placeholder.

## CLAUDE.md's Progress section

Append a new `##` heading at the end of Progress (before the final "Next up"
paragraphs, which should stay last) or extend the current session's heading if
you're still mid-session. Match this project's established voice — see
`references/house-style.md` for the specific conventions (how to report a bug
found along the way, how to disclose a verification limitation honestly, how to
flag a judgment call versus an explicit instruction) and several real excerpts to
pattern-match against. The short version, if you only read one thing:

- **State what's actually true, not what you intended.** If something wasn't
  verified, say so — don't let "built" imply "checked." This project has a
  recorded history of catching its own overclaims (a login flow reported working
  before a real write was tested; a comment claiming a verification that hadn't
  happened yet) and treats each one as a real lesson, not a footnote.
- **Cite the actual check, not the conclusion.** "Verified: `npm run build` and
  `astro check` both pass clean" plus the real numbers (routes, bytes, contrast
  ratios) — not just "tested and working."
- **Record *why*, not just *what*,** especially for judgment calls the
  instructions didn't fully specify. A future session (or the owner) needs to
  know whether something was a deliberate choice or an oversight.
- **Update the trailing "Next up" pointer(s)** if this work changes what's
  actually next — don't leave a stale pointer to something this turn just did.

## Before you write either one

Make sure you actually have the real facts to report: the real commit hash(es),
the real `npm run build`/`astro check` output, and — if the change was visual —
that `browser-verify`'s checks actually ran, not just that they were planned. A
changelog entry is a factual claim like any other in this codebase; write it
after doing the thing, not while intending to.
