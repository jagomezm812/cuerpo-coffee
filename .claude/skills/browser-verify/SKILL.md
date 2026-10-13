---
name: browser-verify
description: Use this whenever a Cuerpo Coffee change touches CSS, layout, color tokens, hover/focus states, or any visual or interactive behavior, before telling the user it's "verified in both themes and mobile" or that a UI bug is fixed. The Chrome browser extension (mcp__claude-in-chrome) has never once connected across this project's entire history — do not wait on it, do not try it first "just in case," go straight to this skill's puppeteer-core harness instead. Also use this for WCAG contrast-ratio checks on any new or changed color pairing (text on a background, including translucent colors), since this project has shipped a real contrast bug once already from eyeballing instead of computing. Covers: real-browser screenshots in light mode, dark mode, and a mobile viewport; real computed-style checks (hover states, CSS specificity collisions, stacking-context bugs); contrast math with correct alpha compositing.
---

# Browser verification for Cuerpo Coffee

## Why this exists

This project's design system has three things that can never be checked by reading
the build output alone: how a color actually renders, what happens on `:hover`, and
whether something that looks right in isolation actually sits correctly against
everything around it (z-index, stacking contexts, stacked margins). The Chrome
extension would be the natural tool for this — it has never connected in this
project, in any session, ever. Don't spend a turn finding that out again. Go
straight to a real local Chrome via `puppeteer-core`.

This is a genuine, if less convenient, substitute for the extension — not a weaker
one to apologize for. Driving a real Chrome via CDP renders the actual page, runs
the actual CSS cascade, and reports actual computed styles. What it can't do is
show the result in *your* chat the way the extension's inline previews do, so:
**always `Read` the screenshot files this produces before describing what they
show.** Never describe a screenshot you haven't actually looked at.

## The discipline: install, use, remove — every time

`puppeteer-core` is a **temporary, dev-only tool**, never a project dependency.
Cuerpo Coffee's hard rule is "no new dependencies without stating the cost" —
installing it with `--save` would silently violate that the moment someone forgets
to clean up. The sequence, every single time:

```bash
# 0. Confirm you're not about to hide a real pending change
git status --short

# 1. Install, not saved to package.json
npm install --no-save puppeteer-core

# ... do the verification (see below) ...

# 2. Remove it again
npm uninstall puppeteer-core

# 3. Confirm package.json / package-lock.json show no diff
git status --short
```

If step 3 shows a diff on `package.json` or `package-lock.json`, something went
wrong — don't move on until it's clean again.

## Before you drive the browser, have something running

This harness points at a local server, not the internet. Pick the right one:

- **Plain visual/CSS checks** (the common case): `npm run preview` (serves the real
  `dist/` build — build first if you've changed anything) on `localhost:4321`.
- **Anything involving `worker/index.ts`** (Keystatic routes, `/api/*`, the
  language switcher, redirects): `astro preview` never executes the Worker. Use
  `npx wrangler dev` instead — see this project's CLAUDE.md for the `.dev.vars`
  pattern needed to exercise Keystatic's OAuth path locally without real secrets.

## Running the checks

Use `scripts/puppeteer-helpers.mjs` — it wraps the handful of things every check
in this project ends up needing, so you're not re-deriving `page.emulateMediaFeatures`
syntax each session. Import it from a throwaway script in your scratchpad directory:

```js
import { withPage, CHROME_PATH } from '/Users/jorgegomez/cuerpo-coffee/.claude/skills/browser-verify/scripts/puppeteer-helpers.mjs';

await withPage({ theme: 'dark', viewport: { width: 1100, height: 1300 } }, async (page) => {
  await page.goto('http://localhost:4321/articles/why-your-coffee-tastes-sour/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/path/in/your/scratchpad/dark-desktop.png' });
});
```

Standard viewports this project has settled on — reuse them rather than picking new
ones each time, so results are comparable session to session:
- **Desktop**: width 1100 (tall enough per-page: 900–1400 depending on content)
- **Mobile**: width 390

Standard checks to run for anything visual, unless the change is obviously scoped
narrower than this (e.g. a single component's own fix only needs that component
checked):
1. Light mode, desktop
2. Dark mode, desktop (`theme: 'dark'`)
3. Mobile, at least one theme (light is usually enough unless the bug is
   theme-specific)

For a **hover/focus state bug** (this project has shipped one real CSS-specificity
bug here before — `a:hover` silently beating a single-class button rule): don't
just screenshot the hovered state, also read back the real computed color:

```js
await page.mouse.move(x, y);
const color = await page.evaluate(() => getComputedStyle(document.querySelector('.the-element')).color);
```

A screenshot can be ambiguous at small sizes; the computed value isn't.

For a **stacking/z-index bug**: a cropped screenshot of a tall floating panel can
look exactly like a stacking bug even when the stacking is already correct (this
has happened in this project — a rounded corner at a crop boundary read as a leak).
Prefer `document.elementFromPoint()` hit-testing across a grid of points, or an
untruncated viewport, over a screenshot that might be cutting through the element
at an ambiguous spot.

## Contrast checks

Use `scripts/contrast.mjs` rather than eyeballing or guessing — this project's own
dark-mode tokens were once verified with a script that treated a translucent
`rgba()` color as already-opaque instead of compositing it against its real
background, which produced a false "near-total failure" reading that wasn't real.
Don't repeat that: always composite a translucent foreground or background against
what's actually behind it before computing the ratio.

```bash
node .claude/skills/browser-verify/scripts/contrast.mjs "#f3eadf" "#231810"
# optionally: node contrast.mjs "<fg>" "<bg>" --fg-alpha 0.16 --behind "<real-background>"
```

WCAG AA minimums: 4.5:1 for normal text, 3:1 for large (≥24px, or ≥19px bold) text.

## After the checks

- Report concretely what you verified (which pages/themes/viewports, which
  specific computed values), not just "looks good." If the extension still isn't
  connected (it won't be), say so plainly rather than implying it was used.
- Run the cleanup step (above) before finishing — don't leave `puppeteer-core`
  installed between turns.
