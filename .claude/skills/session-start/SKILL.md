---
name: session-start
description: Use this at the very beginning of any work session on the Cuerpo Coffee repo — before reading code, before planning a change, before anything else — whenever the user asks for a design/code/content change, says "let's continue," or otherwise starts a new piece of work here. This is CLAUDE.md's own mandated "Update protocol," made into a one-shot habit instead of a prose instruction to remember each time. Also use it as a sanity check before opening a new branch, to make sure you're branching from current `main` and not from something stale. Do not use this for the "go live" / merge-to-main workflow — that's a separate, much rarer event this skill doesn't cover.
---

# Cuerpo Coffee session start

CLAUDE.md's "Update protocol" requires this every session, for a concrete reason:
articles are published by the owner directly through Keystatic, which commits
straight to `main` — so `main` can have moved since you last looked, even if no
one touched any code. Skipping this is how a session ends up planning against a
stale mental model of the repo.

## 1. Pull first

```bash
cd /Users/jorgegomez/cuerpo-coffee
git status --short   # check for anything uncommitted before pulling
git checkout main && git pull origin main --ff-only
```

If `git status` shows uncommitted work, stop and figure out whose it is and
whether it should be committed, stashed, or is simply mid-session state you're
continuing — don't pull or switch branches over it blind.

## 2. Read, in this order

1. **`CLAUDE.md`** — Owner, Hard rules, Update protocol, and especially the
   **Progress** section's most recent entries (its own rule: "every time you
   execute some part of the project, register your advances in this document" —
   so the tail of Progress is the single most current account of what's actually
   built, more current than any plan doc).
2. **`docs/DESIGN-SYSTEM.md`** — token names, palette, type, shape, motion,
   section/band rules. Read this before touching any style, every time — this
   project does not use hardcoded colors or sizes, ever.
3. **The last five entries of `docs/CHANGELOG.md`** (it's newest-first, so just
   the top of the file).
4. **`docs/BACKLOG.md`** — ideas already deliberately deferred, so you don't
   reintroduce something as new scope that was already decided against or
   postponed.

## 3. Check where you actually are

```bash
git branch -vv
git log --oneline -5
```

Confirm: are you on `main`, or already on a feature branch from a prior turn in
this same session? This project's rule is firm — **never work directly on `main`**
for code or design changes, not even small ones, not even doc-only ones. The only
things that land on `main` directly are: Keystatic's own content commits (not
yours to make), and the small finalization commits (CHANGELOG + Progress entries)
that follow an already-approved, already-merged release — see this repo's own
`v1.1-redesign` go-live history in CLAUDE.md's Progress section for what that
looks like when it's actually warranted.

If you're starting new work and you're on `main`: branch now, before writing
anything —

```bash
git checkout -b update/short-name main    # ordinary change
git checkout -b redesign main             # only if this is a redesign-rollout session
```

## You're ready when

- `main` is pulled and current.
- You've actually read the four documents above for *this* session, not recalled
  them from an earlier one — Progress and BACKLOG both change between sessions.
- You know what branch you're on and it's not `main`.

From here, proceed with the actual task. If the work will touch anything visual,
the `browser-verify` skill covers checking it before calling it done; when it's
ready to report, the `changelog-entry` skill covers writing it up.
