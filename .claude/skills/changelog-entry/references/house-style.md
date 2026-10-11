# CLAUDE.md Progress section — house style

This project's Progress entries have a distinctive voice, built up over many
sessions. It's not decorative — each convention below exists because skipping it
once already cost something (a bug shipped, a false "done" claim, a confused
future session). Match it.

## 1. Lead with status, then substance

Every entry opens with a one-line status claim in bold, stating exactly how done
the thing is — not just "built," but *built and verified how*:

> **Status: built on branch `redesign`, not merged, not live.**
> **Status: fully wired and confirmed working, end to end, on the live site.**
> **Status: audit only, no code changes — nothing needed fixing.**

A reader should know the real state of the work from this one line alone, before
reading anything else.

## 2. Separate "built" from "verified," always

Never let "I wrote the code" imply "I confirmed it works." This project has a
named lesson for this, repeated more than once:

> **"login works" and "the full write path works" are different claims, and only
> the second one means the feature is actually done.**

Write a distinct "Verified:" block (or paragraph) stating exactly what was
checked and how — real commands, real output, real numbers:

> **Verified:** `npm run build` (30 routes) and `astro check`
> (0 errors/warnings/hints) both pass clean. Contrast computed directly for every
> new color pairing — lowest result 4.78:1.

Not: "tested and working."

## 3. Disclose limitations plainly, don't paper over them

When something couldn't be fully verified, say exactly what's missing instead of
rounding up:

> **Honest limitation, same as the last two sessions:** the Chrome browser
> extension did not connect this session either — so there is no fresh screenshot
> of this page in either theme. Verification here is real (computed contrast
> ratios, exact compiled CSS/HTML inspection) but it is not the same as watching
> the page render.

This is not an apology — it's information the next session needs to decide
whether more verification is worth doing before trusting the work further.

## 4. Record root causes, not just fixes

When something was a real bug, explain the mechanism, not just the patch — the
next person to hit a similar bug needs the reasoning, not just the diff:

> **Root cause, confirmed by reading the actual failure, not guessed:**
> `SearchBox.astro`'s result-row CSS lived in the file's own scoped `<style>`
> block... but the result rows it targets are built as plain HTML strings by the
> component's client script... Astro's scoped-style mechanism stamps a
> `data-astro-cid-*` attribute onto every element the *compiler* sees — anything
> built by client JS after the page has already rendered never receives it.

## 5. Flag judgment calls as judgment calls

When the instructions didn't fully specify something and you made a reasonable
call, say so explicitly rather than presenting it as the only possible reading:

> **A deliberate, disclosed interpretation of "by category":** with only 3
> English articles spread across 3 different categories, a strict
> same-category-only filter would return zero results on every single article
> today... Both route files now prefer same-category articles first, then fill
> remaining slots with other recent articles.

## 6. Record dead ends, not just the eventual fix

If a first attempt looked right but didn't actually work, say so — it's useful
signal, and hiding it risks someone repeating the same dead end later:

> **First attempt didn't work, and the check that revealed that mattered:**
> changed the keyframes' `to` state... Measured before and after:
> `getComputedStyle` reported the *exact same* non-`none` matrix either way. Kept
> the change anyway (still a real, harmless correctness improvement) but it does
> not fix this bug on its own.

## 7. Never fabricate content or invent data

If something the user described (a caption, a bio, a photo) genuinely can't be
found, say that plainly instead of guessing or inventing a plausible-sounding
edit:

> **The requested caption update was not made — genuinely not found, not
> skipped.** Searched thoroughly before concluding anything... zero matches
> anywhere, on either branch. Reported this back rather than guessing at an edit
> to content that, as far as this repo is concerned, doesn't exist.

## 8. End with what's next

The Progress section's trailing "Next up" line(s) are the handoff to the next
session. Keep them current — if this turn's work resolves or changes a "next up"
item, update it in the same edit rather than leaving a stale pointer.
