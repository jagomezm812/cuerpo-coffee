# Progress log: v1.1 redesign (sessions 1-6 and every fix round)

Moved verbatim from `CLAUDE.md`. Read it when touching a page, component or style, or debugging a visual bug. Design rules themselves live in `docs/DESIGN-SYSTEM.md`; this file is the history and reasoning behind how they were built.

## v1.1 redesign, session 1: colors and fonts

**Status: built on branch `redesign`, not merged, not live.** First of six sessions
in the rollout plan (`docs/UPDATE-WORKFLOW.md` section 7). Colors and fonts only —
no layout, no dark-mode toggle, per explicit scope for this session.

**Tokens (`src/styles/tokens.css`):** replaced wholesale with the exact names and
values from section 6 of `docs/TECHNICAL-PLAN.md` — the full new palette (light on
`:root`, dark on `[data-theme="dark"]`), the updated fluid type scale, the new
radius scale, `--shadow-lift`. Two things deliberately NOT changed, both flagged
inline in the file and here:
- **`--radius` stays at its v1.0 value (2px)**, not migrated to the new
  `--radius-lg`/`--radius-pill` scale — changing actual corner shapes sitewide is a
  visible layout change, out of scope for "colors and fonts only."
- **`h2`/`h3` still use `--step-2`/`--step-1`**, not the new `--step-3` (now
  labeled "H2" in the type table) — resizing headings sitewide is also a visible
  layout change, deferred to a later session. `h1` still uses `--step-4` as before,
  but that token's own range widened as part of adopting the new values, so **the
  page H1 renders noticeably larger now even though nothing about which token it
  uses changed** — confirmed by looking at it, not just inferred from the numbers.

**Aliases for the old token names — the exact list asked for, to remove once
components migrate to the new names directly:**
| Old name | Aliased to | Why this one |
|---|---|---|
| `--crema` | `var(--surface-2)` | Same role: the cream band background. |
| `--paper` | `var(--surface-card)` | Same role: card/raised-surface background. |
| `--espresso` | `var(--ink)` | Closest by color distance to the old hex (#3B2C24) — but this **flattens a real visual hierarchy**: old espresso-styled text (standfirst paragraphs, etc.) was deliberately lighter than ink-styled text (headings); now it's the same darkness. Worth a real look in the components session, not just left as-is indefinitely. |
| `--copper` | `var(--accent-text)` | The dark-mode-*aware* variant, not `--accent` — old copper's main job was link/text color, and `--accent-text` is the one tuned for on-page contrast in dark mode (`--accent` itself doesn't change under dark). In light mode the two are visually identical (#8A4E35 vs old #8C4B2F), so this alias is a no-op today and only starts to matter once dark mode is switched on. **Real, unresolved tension, not hidden:** the new system wants copper used on 2% of a page at most (one tile, one word, one badge); old `--copper` is still the color of *every* link and button sitewide. This alias keeps things working, not correct — that's real component-session work. |
| `--line` | `var(--hairline)` | Same role: the 1px subtle divider color. |

`--ink` and `--muted` needed no alias — the new system reuses those exact names,
just with new hex values, so old component code already resolves to the new colors
directly.

**Fonts:** self-hosted **variable** fonts (one file spans the whole weight range,
rather than a static file per weight) — `Manrope Variable` (weight 200–800,
24.8 KB) and `Fraunces Variable` (weight 100–900 plus the opsz axis, 67.3 KB,
using fontsource's "standard" style variant specifically because it has WONK and
SOFT off by default, matching "optical sizing on, WONK off" in section 6). Sourced
by installing `@fontsource-variable/manrope` and `@fontsource-variable/fraunces`
with `--no-save` (confirmed `package.json`/`package-lock.json` were untouched),
copying the `latin` woff2 file from each into `public/fonts/`, then deleting the
packages from `node_modules` — **no permanent dependency added**, matching the
explicit instruction. Old `fraunces-600.woff2`, `inter-400.woff2`, and
`inter-500.woff2` are deleted; Inter is gone from the codebase entirely (checked:
no remaining `@font-face`, no remaining reference anywhere).

**Fraunces is now genuinely H1-only** — this required one real component change
beyond `tokens.css`/`global.css`: `Header.astro`'s `.wordmark` was hardcoded to
`var(--font-display)` (Fraunces), which would have kept rendering the logo in a
serif despite the new rule. Found by grepping every component for `--font-display`
usage rather than assuming `global.css` alone would cover it — moved to
`var(--font-body)` at weight 800, matching "the wordmark 800" in section 6.

**Verified:** `npm run build` and `astro check` both pass clean. JS shipped is
byte-for-byte unchanged from before this session — same six JS files in the build
output, zero external `<script src>` on any public page, the same 821-byte inline
EmailCapture script. No `data-theme` reference exists anywhere in the codebase
(confirmed via grep) — the dark tokens exist but nothing switches them on, per
instruction. Checked in a real browser, not just curl: homepage and an article
page both render correctly — bold sans-serif wordmark, large serif H1, sans-serif
body/H2 text, cream background, no visual breakage.

## v1.1 redesign, session 2: header, footer, dark mode

**Status: built on branch `redesign`, not merged, not live.** Second of six
sessions. Two open items were checked before starting, per the owner's ask:
**(a)** giving the language switcher its own path (e.g. `/set-language`) so
`run_worker_first` doesn't need to be `true` for every request — **not done**,
added to `docs/BACKLOG.md` instead of fixed here, per instruction. **(b)** the
LanguagePrompt island's loading strategy — **already done** (`client:idle`,
confirmed back in the i18n work by reading the actual compiled output, not just
the directive name).

**Header (`src/components/Header.astro`):** wordmark split into two `<span>`s
(`Cuerpo` at weight 800, `Coffee` at weight 400, both Manrope); only links to
pages that exist today (Articles, About — Start here/Series/search all wait for
their own pages/features); a round dark-mode toggle; a Subscribe **button**
(previously a plain nav link) using `--button-bg`/`--button-fg`, height 52px
and pill radius per the Buttons component spec in `docs/DESIGN-SYSTEM.md`
(font-size uses `--step--1`, the closest existing token to the spec's literal
"15px", rather than a hardcoded magic number).

**Dark-mode toggle:** moon shown in day mode, sun in dark mode, only one visible
at a time (CSS-driven off `[data-theme="dark"]`, not JS). Default follows
`prefers-color-scheme`; an explicit click overrides and is remembered in
`localStorage` (`cuerpo_theme`). Two `is:inline` scripts — one in `BaseHead.astro`
sets `data-theme` before first paint (no flash), one in `Header.astro` runs the
click handler and syncs the button's `aria-pressed`/`aria-label` to whatever
theme was already active when the button was parsed (important: the head script
can set dark mode before this button even exists in the DOM, so its initial ARIA
state can't just assume "always starts light"). **No framework, hand-minified**
since `is:inline` ships scripts byte-for-byte with no bundler minification —
measured directly in the built output: 191 bytes (head) + 442 bytes (toggle) =
**633 bytes combined**, comfortably under the 1 KB budget. Each file keeps an
unminified, commented version of its script right above the real one, inside an
Astro `{/* */}` template comment (confirmed this doesn't leak into the shipped
HTML), so the minified line stays maintainable.

**Footer (`src/components/Footer.astro`):** rebuilt as an always-dark band
(`--footer`, using the `*-on-dark` token set — confirmed this is correct, not
just assumed, by computing actual contrast ratios for every pair used: ink-on-dark
16.3:1, muted-on-dark 8.78:1, olive-on-dark 8.8:1, all far past the 4.5:1
minimum) — wordmark, one-line description, two link columns, and a faint
oversized wordmark. Two judgment calls worth flagging, since the design system
didn't specify either exactly:
- **Column contents:** "Read" got Articles; "Cuerpo" got About and Subscribe —
  a reasonable split given only three pages exist today, not a documented rule.
- **The giant watermark text says "Cuerpo"**, not the full "Cuerpo Coffee" —
  the design system just says "a faint oversized wordmark" without specifying
  which text; kept short deliberately so it stays legible without wrapping at
  phone widths (verified via computed styles, not a screenshot — see the mobile
  caveat below).

The English/Español switcher's logic is **byte-for-byte unchanged** — same
`withSetLang()` function, same props, same conditional current-vs-link
rendering — only its CSS moved to the `*-on-dark` tokens to fit the new band.

**Resolving the `--copper` tension (instruction was explicit: header and footer
only, not sitewide):** both components' links and the wordmark now use neutral
tokens (`--ink` / `--ink-on-dark`) with an underline on hover, instead of
shifting to copper. **Old `--copper` usages deliberately left for later
sessions** (found by grepping the whole codebase, not just recalled):
`global.css`'s default `a` link color and the EmailCapture button fill,
`ArticleCard.astro`'s title-link hover, `Prose.astro`'s blockquote rule,
the homepage/articles-index/es-articles-index "see all" links, and
`LanguagePrompt.tsx`'s "Español" button — none of these are header/footer, all
still copper, all correctly out of scope for this session.

**One rule fixed sitewide, not scoped to header/footer, because it's an
explicit accessibility requirement, not a link-color preference:** every
`:focus-visible` outline was copper; `docs/DESIGN-SYSTEM.md`'s Accessibility
section says focus rings must be in the ink color specifically. Fixed in
`global.css`, confirmed via computed style that `:focus-visible` still matches
and resolves to the correct color (`rgb(27, 20, 16)` = `--ink`).

**Also fixed, found while touching these files, not asked for explicitly:**
`BaseHead.astro` was still preloading `/fonts/inter-400.woff2` and
`/fonts/fraunces-600.woff2` — both deleted in session 1. These preload links
were silently 404ing on every page load since then. Now point at the real
variable font files.

**Verified:** `npm run build` and `astro check` both pass clean. New JS is
633 bytes combined (measured from the actual build output, not estimated) —
the "under 1 KB" budget for this session's dark-mode feature, kept separate
from the pre-existing ~70 KB LanguagePrompt island, which this session didn't
touch. Contrast computed directly (see above) rather than assumed from the
design system's general claims. Checked in a real browser: light mode, dark
mode via the actual toggle click, and the footer correctly staying dark in
*both* page themes. **Honest limitation:** the browser automation's window-resize
tool did not actually change the viewport in this session (confirmed via
`window.innerWidth` after multiple attempts, including from within page JS) —
mobile-width layout was checked structurally instead (no element has a
computed `min-width` over 400px; the footer's `@media (max-width: 40rem)` rule
is confirmed present in the compiled stylesheet) rather than via an actual
narrow-viewport screenshot. Worth a real phone-width visual check next time the
tooling cooperates. Keyboard focus was similarly confirmed programmatically
(`element.matches(':focus-visible')` returns true with the correct outline)
after synthetic Tab keypresses turned out not to move focus reliably in this
automation context — a tooling quirk, not a site bug.

## v1.1 redesign, post-session-2 fixes: Latest section, mobile header, footer headings

**Status: built on branch `redesign`, not merged, not live.** Three fixes from
owner review of the session 2 preview, still within session 2/3's scope (not a
new numbered session).

**Homepage "Latest" section (`src/pages/index.astro`):** the featured article's
title no longer renders larger than the recent-list titles in `ArticleCard.astro`.
Checked what was actually different before changing anything: the shared global
`h2, h3` rule (`global.css`, from session 1) already gives both the same Manrope
weight and letter-spacing — `font-size` was the *only* thing making the featured
title look bigger (`--step-2` vs. `--step-1`). Fixed with a single scoped
override (`.featured h2 { font-size: var(--step-1) }`), not by changing the
heading level — the featured title stays a real `<h2>`, not demoted to `<h3>`,
so the page's heading levels still don't skip (h1 → h2 → h3 for each
`ArticleCard`). The layout itself (one card, then a list) is untouched.

**Mobile header (`src/components/Header.astro`):** a hamburger button (left)
toggles a simple in-flow drawer containing the same Articles/About links
(rendered from the same array as the desktop nav, so the two can't drift out of
sync); the wordmark centers; the dark-mode toggle sits directly next to
Subscribe on the right — achieved by simply hiding `.site-header__nav` at the
mobile breakpoint, since `.site-header__actions` already contained exactly
`[nav, theme-toggle, subscribe-button]` with no DOM restructuring needed to get
that pairing. Icon swaps hamburger↔X the same CSS-attribute-selector way the
theme toggle already swaps moon↔sun (`[aria-expanded="true"]`, no JS). New
click-handler script: 298 bytes, hand-minified and verified with `node -c`
before trusting it (worth doing every time — the very first minified version of
this exact pattern, back in session 2, had a brace-counting typo that `node -c`
caught immediately). **Confirmed, not just assumed, that desktop is unaffected:**
every new CSS rule is either shared between both toggle buttons (harmless, since
`.menu-toggle` stays `display: none` outside the mobile media query) or
explicitly inside `@media (max-width: 40rem)` — checked via the actual diff, not
by re-eyeballing a screenshot.

**Footer heading hierarchy (`src/components/Footer.astro`):** "Read"/"Cuerpo"
were rendering *smaller* than the links underneath them (the links had no
explicit `font-size` and were inheriting the body's `--step-0`, larger than the
headings' `--step--1`) — backwards for something meant to lead a list. Fixed by
raising the headings to `--step-1` and giving the links an explicit, smaller
`--step--1`, so the hierarchy is deliberate or both ends, not accidental on
either. **Deliberately scoped to `Footer.astro`'s own component styles only** —
per instruction, this does not touch the shared small-uppercase-label pattern
used elsewhere (Start here, Series, Newsletter), which is correct as-is: those
sit *above* a much bigger heading and are supposed to stay small, unlike the
footer's headings, which have no bigger heading below them and must actually
function as the heading themselves.

**Verified:** `npm run build` and `astro check` pass clean. Checked in a real
browser at an actual mobile viewport this time — the automation tool happened to
render at ~500px width this session (unlike session 2, where the resize tool
didn't work at all) — confirming the hamburger/drawer, centered wordmark, and
toggle+Subscribe pairing all work as intended, in both themes. Desktop width
could not be re-screenshotted this session either (the resize tool still doesn't
actually change the viewport — tried again, same result as session 2), so
desktop correctness rests on the structural diff-check described above rather
than a fresh screenshot; it was fully visually verified in session 2 and nothing
in that code path changed.

## v1.1 redesign, second round of post-session-2 fixes

**Status: built on branch `redesign`, not merged, not live.** Three more fixes
from owner review of the previous preview.

**Latest section spacing (`src/pages/index.astro`):** the gap after the
featured article was visibly bigger than the gaps between the other article
titles, on both desktop and mobile. Traced it exactly rather than guessing:
`.recent`'s own `padding-block: var(--space-6)` was stacking on top of the
*first* `ArticleCard`'s own `padding-block` (plus `.featured`'s
`padding-bottom` above it) — three paddings compounding at that one boundary
(96px) versus two at every other boundary between cards (64px). Fixed by
removing `.recent`'s `padding-block` entirely — each `ArticleCard` already
carries its own consistent spacing, so the wrapper doesn't need to add more.
No media query was involved in the original bug, so none was needed in the fix.

**Mobile menu padding (`Header.astro`):** the drawer wasn't wrapped in
`.container` (the class every other section on the page uses for its side
padding), so its links sat flush against the screen edges. Added
`padding-inline: var(--space-5)` directly to `.mobile-menu` — the same value
`.container` uses — rather than introducing a wrapper element for it.

**Dark-mode toggle moved into the mobile menu, out of the mobile header
entirely:** the round icon-only button is now `display: none` under the
40rem breakpoint (desktop is completely untouched — same button, same
script, same everything). A second toggle, `#theme-toggle-mobile`, is the
last item in the drawer's list: icon on the left (reusing the exact same
`.theme-toggle__icon--moon/--sun` classes as the desktop button, so the
existing light/dark CSS swap rules apply to it automatically, no new icon
CSS needed), and a text label to its right — **CSS-driven, not
JS-driven**: two `<span>`s ("Dark mode" / "Light mode"), shown/hidden off
`[data-theme]` the same way the icons already are, so there's no need to
sync any text via JavaScript on load. **Accessibility choice worth
recording:** this button has no `aria-label` — with the icon marked
`aria-hidden` and no other visible text, its accessible name comes directly
from whichever label span is currently showing, which already names the
action correctly ("Dark mode" / "Light mode"). Adding a separate, possibly
differently-worded `aria-label` on top of that would risk a "Label in Name"
mismatch (a real WCAG failure — the accessible name not containing the
visible text) for no benefit, since the desktop button (which *does* need
`aria-label`, having no visible text at all) already covers that case
correctly. New click-handler script: 287 bytes, syntax verified with
`node -c` before trusting it (same discipline as every prior minified
script this project has shipped) — and simpler than the desktop button's
442-byte version, precisely because it doesn't need to sync any
`aria-pressed`/`aria-label` state on load.

**Running total of inline theme/menu JS, worth being honest about:** 191
(head, flash-prevention) + 442 (desktop toggle) + 298 (hamburger open/close)
+ 287 (mobile toggle) = **1218 bytes**. This is over the "well under 1 KB"
figure quoted in session 2 — but that figure was scoped to the dark-mode
toggle alone, which is still just 191+442 = 633 bytes, unchanged. The
hamburger menu and the second toggle variant are new, separate features
added since, not scope creep on the original budget.

**Verified:** `npm run build` and `astro check` pass clean. **The browser
extension used for visual verification in prior sessions was not connected
this session**, despite retrying — rather than skip verification, checked
the actual compiled output directly and confirmed, byte for byte, that:
`.recent`'s padding-block is gone; `.mobile-menu:not([hidden])` carries
`padding-inline: var(--space-5)`; `.site-header__nav` and `.theme-toggle`
are both `display: none` inside the same mobile media-query rule; and the
label spans' CSS resolves correctly for both the default and
`[data-theme="dark"]` cases. This confirms the CSS is structurally correct
but is not the same as watching it render — worth a real visual pass next
time the extension connects.

## v1.1 redesign, session 3: Home page

**Status: built on branch `redesign`, not merged, not live.** Third of six
sessions. Home page only, rebuilt from `docs/DESIGN-SYSTEM.md`'s section
types in the fixed order the page template specifies. Header, footer, and
the mobile menu are untouched — correct already from session 2 and its two
fix rounds.

**Hero photo card (`src/pages/index.astro`), white band:** the card itself
doubles as photo space 1 — a flat `--tile-dark` placeholder fill (no stock
imagery), with the hero text overlaid in the `*-on-dark` tokens: an olive
label ("Home coffee, done properly"), the Fraunces H1 ("Coffee *with
body.*" — the italic word is this page's one allowed copper touch, using
`--accent-on-dark`, the variant tuned for contrast on a dark fill, not the
light-mode `--accent`), a one-sentence description, and two buttons
("Start here" anchors to `#start-here"`, "Read the latest" links to
`/articles"`). Inset from the band's edges by `--space-5` (24px), matching
the design system's literal "inset 24px" instruction — there's no existing
token for the design system's wider 1392px/1440px reference container, so
the inset wrapper uses a plain `90rem` max-width rather than inventing a new
token for one page; worth revisiting if a second page ever needs the same
wider-than-`.container` band width. No `src/assets/home-hero.*` file exists,
so the flat placeholder is what's live — swap in a real `<Image>` there
first, before anything else, once real photography exists.

**Start here (cream band):** three `PillarTile` instances (new component,
`src/components/PillarTile.astro` — built to the full six-pillar color map
in `docs/DESIGN-SYSTEM.md` even though only three are used this session, so
the same component drops into the Explore page's topic tiles later with no
changes). Troubleshooting (olive) links straight to the newest
troubleshooting article and shows its real title/description, not the
category page — there's exactly one such article today
(`why-your-coffee-tastes-sour`), so this is verified against something real.
Fundamentals (sand) links to its category page (one article exists).
Gear (roast) has zero articles today, so it renders as a non-link tile with
a "Coming soon" label instead of an arrow — the `PillarTile` component
switches its root tag between `<a>` and `<div>` based on whether an `href`
was passed, rather than rendering a dead link.

**Latest (white band):** every title renders as a plain `<h3>` at the same
size and weight — no featured/large treatment, the same fix already applied
once to the old homepage structure (`docs/CHANGELOG.md`'s "second round of
post-session-2 fixes" entry) carried over by construction, since this is a
flat list with no special-cased first item. A row of neutral, outlined
"topic chips" (Buttons component styling, not the olive "category pills"
rule — see below) links to five of the six categories; a "View all
articles" button sits below the list. **Deliberately excludes a
"Reflection" chip**, even though `reflection` was added to the schema this
session (see below): its static category page
(`src/pages/articles/category/[category].astro`'s own `CATEGORIES` list) was
also updated to include it — so `/articles/category/reflection` does build
and render ("No articles here yet.") — but `/articles/index.astro`'s
separate, still-hardcoded category filter list and the Spanish route tree's
own `CATEGORIES` array were **not** touched, out of respect for this
session's "Home page only" scope; add `reflection` there whenever those
pages are next in scope. Each card shows its category name as small olive
text (`docs/DESIGN-SYSTEM.md`'s "category names" rule — a plain label, not a
filled pill; that's reserved for the Troubleshooting tile and stays under
the 4% olive budget), and a copper "New" badge only when `publishDate` is
within 14 days of build time — computed against `Date.now()` at build,
same pattern as Footer's copyright year. None of today's four articles
qualify (all from January), so the badge doesn't render anywhere yet;
that's correct, not a bug — verified by grepping the build output for zero
matches. Title links use the neutral ink-plus-underline-on-hover treatment
Header/Footer already settled on in session 2, not copper — this page's
copper usage is now down to exactly two places, both explicitly allowed by
the design system: the hero's italic word, and the "New" badge.

**Series band: built, not shown.** `src/components/SeriesBand.astro` exists
in full (two-card layout, sand band, olive article-count label) per
instruction, but there's no series data model yet — that's session 4's
work, alongside the article template. `index.astro` passes it a hardcoded
empty array; the component renders nothing when its `series` prop is empty,
the same "hidden, not empty" mechanism used everywhere else in this
codebase (untranslated articles, empty category pages), not a special case
written for this one component.

**Reflection strip: built, conditionally shown.**
`src/components/ReflectionStrip.astro` — a `--roast` dark band holding photo
space 2 (a flat placeholder, `aria-hidden`, not given fabricated alt text or
a caption, since it conveys no actual photographic content yet — replace
with a real `<Image>` and real alt text together, not before). `index.astro`
only renders it when a published article has `category: reflection`; none
exists today, so it doesn't render — verified absent from the build output.
**`reflection` added as a real category**, per instruction: the content
schema (`src/content.config.ts`), Keystatic config (`keystatic.config.ts`),
and the EN static category-page route (see above) all know about it now, so
the moment a real reflection essay is published, the category page, the
strip, and (once added, see above) a homepage chip all light up on their
own with no further code changes.

**Newsletter band (cream band):** the shared `EmailCapture` component is
reused unchanged — its own markup, classes, and `/api/subscribe` wiring are
untouched — restyled only via a scoped descendant selector
(`.newsletter-band__inner :global(.email-capture) {...}`) that applies
solely inside this page's own wrapper: white `--surface-card` background,
`--radius-xl` (36px, the design system's specific newsletter-card radius),
a pill-shaped email input, and a neutral `--button-bg`/`--button-fg` submit
button (never olive or copper, per instruction). The mid-article and
`/subscribe`-page instances of `EmailCapture` still render with their
original v1.0 styling — this session did not touch the shared, unscoped
`.email-capture` rules in `global.css`, so nothing outside this one page
changed. Success/error messaging behavior is identical (same script, same
component).

**Band rhythm:** white (hero) → cream (Start here) → white (Latest) →
[Series, hidden] → roast (Reflection, when shown) → cream (Newsletter) →
near-black (Footer). No two adjacent rendered bands share a color in either
configuration (with or without Reflection showing) — checked both cases
explicitly, not just the common one. Exactly two photo spaces at most (hero,
Reflection) — Series carries none, matching the "typographic unless it's
one of the two photo spaces" rule.

**Verified:** `npm run build` and `astro check` both pass clean (22 routes,
including the new `/articles/category/reflection`). Confirmed no new
client-side JavaScript ships on this page: the same six JS bundle files
exist in the build output as before this session (`LanguagePrompt`,
`client`, `jsx-runtime`, `keystatic-page`, `react-dom`, `react` — Keystatic's
own bundle, untouched), and the homepage's inline `<script>` tags are the
same ones already shipping from `BaseHead`/`Header`/`EmailCapture`/
`LanguagePrompt` before this session — nothing new added. Contrast computed
directly for every new color pairing (olive/sand/roast tile text, the
hero's copper `em`, both light- and dark-mode newsletter buttons, the New
badge) rather than assumed from the design system's general claims — lowest
result 5.40:1, comfortably past the 4.5:1 minimum. Verified structurally,
class by class, that Series and Reflection are genuinely absent from the
build output (not just visually hidden), that the three Start Here tiles
resolve to the correct three background colors and the correct
link/"Coming soon" state, and that the mobile (`width <= 40rem`) media
queries collapse the Start Here grid, the Series card grid, and the
Reflection strip's two-column layout to one column each.
**Lighthouse mobile performance: 99/100** (`npx lighthouse`, mobile
form factor, simulated throttling, performance category only, against a
local `astro preview` build) — FCP 1.4s, LCP 2.0s, TBT 0ms, CLS 0.
**Honest limitation, same as the last two sessions:** the Chrome browser
extension used for visual verification did not connect this session either
(tried twice, same "extension is not connected" error both times) — so
there is no fresh screenshot of this page in either theme or at mobile
width. Verification here is real (computed contrast ratios, exact compiled
CSS/HTML inspection, a real Lighthouse run against a real local server) but
it is not the same as watching the page render. Worth a real visual pass
the next time the extension connects, especially the hero card's text
legibility over its flat dark fill and the tile grid's actual spacing at
phone width.

**Post-session-3 fix: hero spacing.** Owner review caught two stacked-padding
gaps, the same class of bug as the earlier Latest-section fix. `.hero-band`
had `padding-block: var(--space-9)` (96px top *and* bottom) — that put a
full section-sized empty gap between the header and the hero card, which
should instead sit close under the header (the two share white on purpose),
and it doubled up with `.start-here-band`'s own top padding (also
`--space-9`) to leave a 192px gap before "Start here" instead of one normal
96px gap. Fixed the same way as before: `.hero-band` now only sets
`padding-top: var(--space-5)` (24px, matching the card's own horizontal
inset) and no bottom padding at all — `.start-here-band`'s existing top
padding is left as the single source of the gap that follows. Verified in
the compiled CSS, not just assumed: `.hero-band{padding-top:var(--space-5)}`
with no `padding-bottom` declared, `.start-here-band{padding-block:var(--space-9)}`
unchanged. Not width- or theme-dependent, so this applies identically on
mobile and in both themes with no separate override needed.

## v1.1 redesign, session 4: Article template, Explore page, series model

**Status: built on branch `redesign`, not merged, not live.** Fourth of six
sessions. Three parts, all done: the series data model, the full Article
template, and the Explore page. `/articles/index.astro`'s topic tiles now
cover all six categories, resolving the `reflection` gap flagged at the end
of session 3 — that page is fully rebuilt this session anyway (see below),
so the fix lands as part of the rebuild rather than a separate patch. The
Spanish route tree's own category/tag lists are still untouched (out of
scope — Explore is an English-only page, same as Home).

**Series data model:** a new `series` content collection
(`src/content.config.ts` — title + description only, no body; stored as
plain YAML, `src/content/series/*.yaml`, since Keystatic's default
`DataFormat` needed no `content` field for something this small) plus two
new, optional-together fields on `articles`: `series` (a real
`reference('series')`, same foreign-key-checked pattern as
`translationKey`) and `seriesOrder` (a plain integer). A new `.refine()`
enforces "both or neither" — an article's position only means something in
the context of a specific series. Keystatic gained a matching `series`
collection and the two article fields (`fields.relationship` +
`fields.integer`). Grouping logic lives in one place,
`src/lib/series.ts` (`getSeriesGroups(lang)`, `getSeriesGroupForArticle()`)
— a series with zero published articles assigned to it is simply absent
from the result, the same "hidden, not empty" mechanism used everywhere
else in this codebase, not a special case written for this feature.
**Real data, not fabricated:** with only three English articles across
three different categories, there wasn't enough genuinely related content
for "two real series" — forcing unrelated categories together would have
been inventing an editorial relationship that doesn't exist. So: one real
series, **Beginner Basics** (`the-only-coffee-ratio-you-need` at position
1, `a-simple-pour-over-method-for-beginners` at position 2 — a defensible,
real reading order: learn the ratio, then a method that uses it), and one
genuine placeholder, **Troubleshooting Deep Dives**, with zero articles
assigned — it exists in the collection so an editor can start assigning
real troubleshooting articles to it in Keystatic, but it doesn't render
anywhere until at least one does. The Home page's Series band (built
hidden in session 3) is now wired to this real data via `getSeriesGroups`
and is genuinely visible, showing the one qualifying series — "unhidden"
in the literal sense the instruction asked for, not just technically
present with an empty array. A series card's link goes to its first
article (position 1) — there's no dedicated series-detail page (not asked
for this session), so "click to start reading it in order" is the real,
working behavior today.

**Author config:** a new Keystatic **singleton** (not a collection — one
entry, no slug), `author`, editable at `/keystatic` under "Author" —
`src/content/author/author.yaml` (name + a short bio), read via
`src/lib/author.ts`'s `getAuthor()`. Deliberately a Keystatic singleton
rather than a code file: the owner isn't a developer (per this file's own
"Owner" section) and shouldn't need to be one just to fix a byline. Ships
with clearly-labeled placeholder content — same precedent as `/about`'s
placeholder bio — **not a fabricated name**, since `docs/BUSINESS-PLAN.md`
explicitly says the About page (and, by the same logic, every article's
byline) should say "your name," i.e., the real owner's, which isn't
something to invent. Replace the placeholder at `/keystatic` whenever the
real name/bio is ready; every article on the site pulls from this one
place, per instruction ("don't invent per-article authors").

**Article template (`src/layouts/Article.astro`, fully rebuilt):**
- **Title block:** a small pillar-colored category pill (new: the six
  pillar background/foreground pairs used to live only inside
  `PillarTile.astro`'s own scoped styles — pulled out into a shared
  `pillar--<category>` utility in `global.css`, the same "extract when a
  second thing needs it" move already made once for `.section-label` in
  session 3, so the pill and `PillarTile` both read the same six colors
  instead of duplicating them), the H1 (Fraunces, unchanged global rule),
  the standfirst, and a meta line now showing the author's name (from the
  config above) alongside the existing date/reading-time/translation-link.
- **Hero photo space** (this page's one photo space, per the 2-per-page
  cap): a real `<Image>` when `heroImage` is set (unchanged), otherwise a
  flat `--tile-dark` placeholder block — no stock imagery — so the title
  block's rhythm is consistent whether or not a real photo exists yet.
- **Reading-progress line:** the one genuinely new client script this
  session (`src/components/ReadingProgress.astro`, hand-minified
  `is:inline` like every other small script here, verified with `node -c`
  — 389 bytes). Tracks scroll position through the article's own wrapper
  (`data-reading-progress-target`) and sets a fixed olive bar's width — the
  Olive rules explicitly list "the reading-progress line" as one of olive's
  allowed section-marker uses, so the color choice isn't arbitrary.
- **Sticky table of contents** (`src/components/TableOfContents.astro`):
  zero JS — Astro's own content pipeline already assigns every heading a
  stable slug id (confirmed directly in the build output, e.g.
  `<h2 id="what-sour-actually-means">`), so this is just `position: sticky`
  plus a list of anchor links built from `render(article)`'s `headings`
  array (an Astro/`@astrojs/markdown-remark` feature, independent of the
  custom `unified()` processor already in use for the mid-article
  subscribe-block plugin). Only rendered when an article has 2+ h2s — a
  "contents" list for one heading is noise, not a feature.
- **Series rail** (`src/components/SeriesRail.astro`): only rendered when
  `getSeriesGroupForArticle()` finds one. Shows the series title and every
  article in it, in order, with olive numbered rings (another explicit
  Olive-rule use: "the numbered rings in a series list") — the current
  article renders as plain bold text, not a link to itself.
- **Author box** (`src/components/AuthorBox.astro`): the same flat-
  placeholder-block treatment as the hero (no fabricated photo), name, and
  bio — reads the one shared author config, never invents anything
  per-article.
- **"Keep reading":** renamed from "Related," now three typographic tiles
  instead of the old `ArticleCard`-style list, matching
  docs/DESIGN-SYSTEM.md's "Keep reading: three related tiles" section type
  (no thumbnails, hover-lift, an arrow). **A deliberate, disclosed
  interpretation of "by category":** with only 3 English articles spread
  across 3 different categories, a strict same-category-only filter would
  return zero results on every single article today, making the whole
  feature invisible and effectively untested. Both `[...slug].astro` route
  files now prefer same-category articles first, then fill any remaining
  slots (up to 3) with other recent articles — same-category still drives
  the ordering, but the section has something real to show today rather
  than staying hidden everywhere until there's more content per category.
- **Newsletter captures unchanged, as instructed:** the mid-article
  placement (`remark-inline-subscribe.mjs`) and the end-of-article
  `<EmailCapture />` are in exactly the same place in the markup as before
  this session — the only new element slotted in near them is the Author
  box, added right after the existing end-of-article capture, not
  reordering anything that was already there.
- **Layout:** a two-column grid (body + a 15rem sidebar holding the TOC and
  series rail) above 56rem; below it, the sidebar becomes a normal static
  block (no more `position: sticky`) ahead of the body — collapsing a
  sticky sidebar to a plain block on phones, not hiding it.

**A real accessibility bug found and fixed this session, not just
theoretical:** `PillarTile`'s small label span and "Coming soon" text used
opacity (0.75 and 0.7) to look secondary against whichever pillar color
filled the tile. That was never actually wrong for the three pillars
session 3 used (troubleshooting/fundamentals/gear), but this session's
Explore page uses **all six** for the first time — and computed directly
(not assumed), the Sourcing tile's copper fill (`--accent`) has the least
contrast headroom of the six: at those opacities its label text measured
**3.85:1** and its "Coming soon" text **3.57:1**, both below the 4.5:1
minimum for normal-size text. Fixed by raising both to `opacity: 0.9`
(4.78:1 on the same tile, confirmed) — high enough to pass everywhere,
including the worst case, without visibly flattening the other five tiles.
Worth remembering: a color combination verified safe for some of a
component's variants isn't verified for all of them.

**Explore page (`src/pages/articles/index.astro`), fully rebuilt:** no
more flat "every article, newest first" list — that job is already covered
by Home's Latest, the category pages, and the new tag pages, and
docs/DESIGN-SYSTEM.md's own section-type table doesn't list a flat article
list as one of Explore's allowed sections anyway. Composed the way the
page template calls for: a title-block opening (white), then **Topic
tiles** (cream, all six categories via `PillarTile`, "Coming soon" for
categories with zero articles today — gear, sourcing, reflection), a
**Tag cloud** (white, plain neutral chips — not literally size-weighted by
frequency, since with 8 total tags today and every one used once or twice,
a fake visual-weight cloud would be display theater over meaningless data;
revisit if tag usage becomes uneven enough to be worth showing), and the
**Series list** (sand, via the same `SeriesBand` component as Home, now
given an optional `limit` prop — Home passes its default of 2, Explore
passes `series.length` to show all of them, per
docs/DESIGN-SYSTEM.md's own "two cards on Home, all of them on Explore"
distinction). No live search — session 5, per instruction.

**New static routes:** `/articles/tag/[tag]` (English only, mirroring
`/articles/category/[category]`'s existing structure) — one page per tag
actually used by a published English article (not capped at 16; that cap
is only for the Explore page's own cloud). `getTagCounts()` and
`getTagHref()` (`src/lib/articles.ts`) are shared by both the Explore
page's cloud and this route's `getStaticPaths()`, so the count/sort logic
lives once. 8 unique tags exist today, all under the 16 cap, so every one
of them shows on Explore.

**Verified:** `npm run build` (30 routes now, up from 22 — the tag pages
account for 8 of the increase) and `astro check` both pass clean.
JS budget, measured directly from the build output, not estimated: an
article page's total plain-JS (excluding the JSON-LD structured-data
script, which is inert metadata, not logic, and excluding the pre-existing
~70KB-gzip LanguagePrompt `client:idle` bootstrap, already a disclosed
exception unrelated to this session) is **2,713 bytes** — up from roughly
2,038 bytes before this session, the entire increase being the new
389-byte reading-progress script — comfortably under the 20 KB/article
budget. Neither Home nor Explore gained any client JS at all this session.
**Lighthouse mobile performance:** **100/100** for an article page
(`/articles/why-your-coffee-tastes-sour`) and **100/100** for
`/articles` (both `npx lighthouse`, mobile form factor, simulated
throttling, performance category only, against a local `astro preview`
build). Contrast computed directly for every new color pairing (not just
the ones that turned out fine — see the Sourcing-tile bug above), lowest
surviving result 4.78:1. Confirmed structurally: the two-column article
layout and the six-tile Explore grid both collapse to one column at their
respective breakpoints (56rem for the article sidebar, 40rem for Explore's
topic tiles), the sticky TOC becomes a static block on narrow viewports,
and no hardcoded hex color exists in any file touched this session (grepped
directly). **Honest limitation, same as the last two sessions:** the
Chrome browser extension did not connect this session either (same "not
connected" error, tried again) — verification here is real (a working
local Lighthouse run, exact compiled-CSS/HTML inspection, computed contrast
ratios including the bug found above) but there is still no fresh
screenshot of either page in either theme. Worth a real visual pass the
next time the extension connects.

**Post-session-4 fixes: sidebar overlap, reading-body background.** Two
issues from owner review, both root-caused before touching code:
- **Sidebar overlap:** `TableOfContents.astro`'s `.toc` had its own
  `position: sticky`, and `SeriesRail.astro` sat right after it in the DOM
  with no sticky positioning of its own. Two independently-sticky-or-not
  siblings inside one tall container is the actual bug: a sticky element's
  box still reserves its *natural* flow position for layout purposes (that
  never changes, stuck or not) — so `SeriesRail`, occupying the flow space
  immediately after the *short* TOC near the top of the tall sidebar, kept
  scrolling normally with the page and passed behind/underneath the TOC
  once the TOC was stuck partway down the viewport, visually overlapping
  it. Fixed by moving `position: sticky; top: var(--space-6)` up one level,
  onto the shared `.article__sidebar` wrapper in `Article.astro`, and
  removing it from `.toc` entirely — TOC and SeriesRail are now ordinary
  stacked block children of one sticky container, so they move together
  and can't drift apart. Confirmed in the compiled CSS: exactly one
  `position:sticky` remains in the article bundle now, on
  `.article__sidebar`.
- **Reading-body background:** the article page never set its own
  background at all — every other page's bands are explicit
  (`background: var(--surface-1|2|3)` on a full-width wrapper), but
  `Article.astro` had no such wrapper, so it just showed through to
  `body`'s site-wide cream default (`global.css`: `body { background:
  var(--crema) }`). docs/DESIGN-SYSTEM.md's section-type table lists both
  "Reading body" and "Keep reading" as `surface-1` (white), so the fix
  wraps the whole article — title block through Keep reading, since both
  are meant to be the same white band per that table — in one new
  `.article-band` div with `background: var(--surface-1)`. Confirmed via
  the compiled CSS that Home's and Explore's own bands
  (`.hero-band`/`.start-here-band`/`.latest-band`/`.newsletter-band`,
  `.explore-header`/`.topics-band`/`.tags-band`) are byte-for-byte
  unchanged — this was additive to Article.astro only.
- **Verified:** `npm run build` and `astro check` pass clean. No JS budget
  change (still 2,713 bytes on an article page — neither fix touched any
  script). Contrast re-checked for article body text against the new white
  background in both themes (lowest result 6.18:1, still comfortably past
  4.5:1). Mobile media query re-confirmed: `.article__sidebar` still
  reverts to `position: static` under 56rem, unaffected by moving the
  sticky rule up a level. Same honest caveat as every session this
  redesign: no browser extension connection this round either, so this is
  verified structurally (exact compiled CSS, computed contrast), not with
  a fresh screenshot.

## v1.1 redesign, session 5: search, motion, Reflection essay layout

**Status: built on branch `redesign`, not merged, not live.** Fifth of six
sessions. This session was interrupted mid-response once (a sleeping laptop),
resumed after an explicit audit of what had actually landed versus what a
stale in-progress comment merely claimed — worth recording exactly what that
audit found, since two of this session's own comments turned out to be
wrong and got fixed as a direct result, not incidentally.

**Part 1, Pagefind search (Explore page only):** `pagefind` added as a real
dependency, `postbuild: "pagefind --site dist"` runs the indexer after every
build. `SearchBox.astro` (new): an input + results dropdown, wired into
`/articles`'s title block only — not Home, not article pages. Pagefind's own
JS is genuinely heavy (scales with index size), so it's dynamically
`import()`ed on first focus/keystroke, never on page load; the small wiring
script that knows *when* to trigger that import always loads (measured
elsewhere in this file's JS-budget accounting). `Article.astro` and
`ReflectionArticle.astro` (below) both carry `data-pagefind-body` on the
actual essay/article content and `data-pagefind-ignore` on
sidebar/capture/author/keep-reading chrome, so search results and excerpts
never surface repeated boilerplate.
**Verified two ways, not just by reading the build log:** (1) a real
`npm run build` actually indexes content — 4 pages, 705 words, 2 languages,
0 errors. (2) The Chrome browser extension would not connect this session
either (same "not connected" error as every prior session's honest
limitation) — rather than settle for the build-log check alone, drove a real
local Chrome via `puppeteer-core` (installed with `--no-save`, removed
immediately after use, confirmed via `git status` that `package.json`/
`package-lock.json` were untouched both times): typed "ratio" into the real
rendered search box on a real `astro preview` server and read back the
actual DOM. Three correct results came back with `<mark>` tags around the
matched word in each excerpt, `aria-expanded` flipped to `"true"`, zero
console errors. This is a genuine render-and-interact check, just via a
different real browser than the usual extension — flagged here plainly
rather than presented as if the extension itself had connected.

**Part 2, site-wide motion:** `@view-transition { navigation: auto }` in
`global.css` — CSS-only cross-document page transitions, no JS, browsers
without support just navigate normally. A blanket
`@media (prefers-reduced-motion: reduce)` rule collapses every animation
and transition on the page to `0.01ms` via `!important` — the one place in
this codebase `!important` is used deliberately, specifically because it's
a cross-cutting accessibility override that must win regardless of which
component declared a more specific transition. `.rise-in`/
`.rise-in--delay-1` (entrance rise, staggered) and `.photo-settle` (scale-in)
keyframe utilities, applied to Home's hero, Explore's header, Article's
header/hero, `ReflectionStrip`'s photo block. `.btn`/`.chip` were extracted
from `index.astro` into `global.css` (Explore and `ReflectionStrip` needed
the exact same classes) with consistent hover-lift/press-scale/
theme-color-fade transitions; `PillarTile`/`SeriesBand` cards got matching
color-fade transitions added.
**Verified empirically, not just asserted in a comment** (see the integrity
fix below for why this distinction matters this session specifically): the
same `puppeteer-core` session used for search also loaded the homepage
twice via Chrome's real `Emulation.setEmulatedMedia` CDP call — once
normally, once with `prefers-reduced-motion: reduce` emulated — and read
computed styles back. Normal: hero `animation-duration` 0.7s,
`.btn`/`body` `transition-duration` 0.2s–0.35s. Emulated: every one of
those collapsed uniformly to `1e-05s` (0.01ms, same value, different string
representation — confirmed by hand, not just accepted at face value).

**Part 3, the Reflection essay layout (the actual missing piece from the
interrupted session):** `ReflectionArticle.astro`, a genuinely separate
layout, not a variant of `Article.astro` — `src/pages/articles/[...slug]
.astro` and its Spanish counterpart now branch on
`article.data.category === 'reflection'` and render one or the other. Every
other category's route, output, and behavior is byte-for-byte unaffected —
confirmed via a clean `git diff` scoped to exactly the branch logic, not a
rewrite of the shared path.
- **Opens dark by default, unless the visitor already explicitly chose
  light** — the one real new mechanism this session. `BaseHead.astro`
  gained a `forceDark` prop; its theme-resolution script (still hand-
  minified, `is:inline`) now bakes the flag in as a literal `true`/`false`
  via `set:html` at build time rather than reading a runtime data-attribute
  — one fewer DOM read, and the page's own resolved default is visible
  directly in its HTML source. Resolution order: an explicit
  `localStorage.cuerpo_theme` always wins (light or dark); with nothing
  stored, `forceDark` wins over `prefers-color-scheme`. `Base.astro`
  threads the prop through; only `ReflectionArticle.astro` ever sets it.
  There's no scoped "just this band is dark" mechanism anywhere in this
  codebase, and building one would fight the token architecture every
  other page relies on — so this forces the *whole* page, header and
  footer included, into the site's existing dark theme, exactly the way
  clicking the toggle already does everywhere else. **Cost, measured, not
  estimated:** the extra `(false||...)` (or `(true||...)`) the script now
  always needs to be able to say costs 8 bytes on *every* page, not just
  Reflection ones — 191 bytes became 199. Running total of inline
  theme/menu JS across the site: 199 + 442 + 298 + 287 = 1,226 bytes (was
  1,218 before this session).
- Narrower reading column (`--reflection-measure: 52ch`, a literal value —
  no existing token fit, and inventing one felt premature for a single page
  type) and larger body text (`.prose` bumped from the site's base
  `--step-0` to `--step-1` within this layout's own scope only).
- A full-bleed hero photo space, breaking out of `.container` entirely — a
  flat `--tile-black` fill when there's no real `heroImage` yet, same
  no-fabricated-imagery rule as every placeholder elsewhere in this
  codebase.
- A large pull-quote treatment on blockquotes: centered, bigger
  (`--step-2`), an olive rule above and below instead of Prose's default
  left copper border — olive, not an arbitrary choice, is explicitly listed
  in `docs/DESIGN-SYSTEM.md` as the color for "the pull-quote rule."
  Deliberately selector-scoped as `.reflection-essay__prose-wrap
  :global(.prose blockquote)` (including `.prose` itself, not just the
  wrapper class) specifically so it has higher specificity than Prose's own
  rule regardless of which one the compiler hoists into `<head>` first —
  two equally-specific rules fighting over source order is exactly the kind
  of fragile thing not to leave to chance.
- One in-essay photo space: a new remark plugin,
  `remark-inline-reflection-photo.mjs`, gated on
  `file.data.astro.frontmatter.category === 'reflection'` — confirmed this
  is actually populated before remark plugins run by reading
  `@astrojs/markdown-remark`'s own source directly (`createMarkdownProcessor
  ()` builds the VFile with frontmatter attached before calling
  `parser.process()`), not assumed from the docs. Every other category is a
  genuine no-op for this plugin, not just visually absent. Inserted after
  the essay's first h2, deliberately distinct from the pre-existing
  mid-article newsletter capture's second-h2 placement — both run on
  Reflection essays without interfering with each other's heading count.
  Absent, not broken, on an essay with 0 or 1 h2s — the same hidden-not-
  empty pattern used everywhere else here. Styled unscoped in `global.css`
  (`.reflection-inline-photo`), same reasoning as `.email-capture`: raw
  markdown-injected HTML can't be reached by any component's scoped
  `<style>`. **A stacked-margin bug was caught and fixed before it shipped,
  not after:** this block is a normal sibling inside `.prose`, which already
  gives every non-first child a `margin-top` via `.prose > * + *` — an
  additional `margin-block` here would have double-stacked the top gap, the
  exact bug class flagged in this file's session 3/4 notes. Fixed by using
  `margin-bottom` only.
- No table of contents or series rail — a personal essay isn't the kind of
  content a reader jumps around section by section, and dropping the
  sidebar is what actually makes the narrower column read as intentional
  rather than "the same page, less wide." A judgment call, not asked for
  explicitly; worth a second look if a reflection essay ever ends up in a
  series.
- "More reflections" instead of "Keep reading": only other reflection
  essays, no same-category-then-fallback logic like the normal Article
  template's "Keep reading" has. With zero other reflection essays
  published today, this section is simply absent on the one essay that
  will eventually exist — verified, not assumed (see below).
- Mid-article and end-of-article newsletter captures are kept, unchanged —
  nothing in this session's scope said to drop a monetization touchpoint.
- **Verified end-to-end against something real, then cleaned up:** with
  zero real reflection essays published, a temporary local draft fixture
  (`_temp-reflection-verify.md`, `draft: false`, two h2s, a blockquote) was
  added, built, checked structurally in the compiled HTML output — force-
  dark script literal correctly `true`; in-essay photo present exactly
  once; pull-quote/hero/author-box/Pagefind attributes all present; "More
  reflections" section genuinely absent from the DOM (its CSS class name
  still appears in the stylesheet regardless, which isn't the same thing
  and was checked separately) — then the fixture was deleted and the site
  rebuilt back down to the real 30 routes / 4 indexed pages before
  anything was committed. No fabricated content shipped; this was a
  disposable test, the same spirit as every other "don't invent real
  content" precedent in this file.
- The Spanish route tree (`src/pages/es/articles/[...slug].astro`) got the
  identical branch, kept symmetric with the English one on principle — no
  Spanish reflection essay exists yet, so that specific path is unverified
  against real content, same caveat as the English path's own fixture-only
  verification.

**Two integrity issues found and fixed, worth recording precisely because
they were caught by review rather than by the code that produced them:**
this session's first commit (Pagefind + motion, made as a mid-session
checkpoint before the Reflection layout existed) shipped two comments that
turned out to be inaccurate: `SearchBox.astro` referenced a
`ReflectionArticle.astro` file that did not exist yet at the time, and
`global.css`'s reduced-motion comment claimed a headless-Chrome
verification had happened and pointed at "CLAUDE.md's session 5 notes" for
it — notes that did not exist. Neither was caught before that checkpoint
commit landed. Both are fixed now: the first because the file actually
exists as of this same session; the second by actually running the
verification (see Part 2 above) and rewriting the comment with the real
measured numbers instead of a forward-reference to nothing. **Lesson worth
keeping:** a comment that claims a verification happened is a factual claim
like any other in this codebase and needs the same discipline as a Progress
entry — write it after doing the thing, not while intending to.

**Verified overall:** `npm run build` (30 routes, 4 Pagefind-indexed pages)
and `astro check` (0 errors/warnings/hints across 41 files) both pass clean
as of the final commit. Two temporary dev-only tools were used and fully
removed both times (confirmed via `git status` showing no diff on
`package.json`/`package-lock.json` after each): `puppeteer-core` for the two
real-browser checks above.
**Honest limitation, same as every session this redesign:** the Chrome
browser extension did not connect this session (tried at the point it
mattered — the search-box check — not just assumed from memory of prior
sessions' failures). The `puppeteer-core` checks above are real browser
verification, just not through that specific tool, and that substitution is
disclosed here rather than presented as equivalent without comment.
**Explicitly not done this session, left for a follow-up rather than
silently dropped:** `docs/UPDATE-WORKFLOW.md`'s own step 5 scope also calls
for "run Lighthouse and check contrast in both themes" across the site
after search/motion/Reflection land — that Lighthouse+contrast pass was not
part of what was actually asked for in this session and has not been run.
Do that before treating session 5 as fully closed out, not just merged.

## v1.1 redesign, post-session-5 fixes: header search, more entrance motion, mid-article subscribe box

**Status: built on branch `redesign`, not merged, not live.** Three fixes
from owner review of the session 5 preview, still pre-session-6.

**Header search (`Header.astro`, `SearchBox.astro`):** a round icon button
(same 40px/pill/border treatment as the existing theme-toggle/menu-toggle
buttons — added to their shared selector, not a new one-off style), placed
after Subscribe: nav links, dark-mode toggle, Subscribe, search — no
"Start here"/"Series" links added, header otherwise untouched. Links to
`/articles?focus=search`, a query param rather than a URL fragment —
confirmed a fragment alone wouldn't actually focus the field (browsers
don't auto-focus a form element just because it matches an #id), so
`SearchBox.astro`'s own script now checks `URLSearchParams` on load and
calls `.focus()` itself when present, which fires the same input's
existing `focus` listener — a header-search click lazy-loads Pagefind the
identical way a direct click into the box already did, no separate code
path. Mobile: the round button is hidden (added to the same
`@media (max-width: 40rem)` rule that already hides the desktop theme
toggle there) and a "Search" row (icon + label, matching the mobile theme
toggle's own icon+label shape) was added to the hamburger drawer, grouped
with Articles/About rather than down by the theme toggle (which stays the
drawer's deliberately-last row from session 2) — not a bare icon there,
since the drawer is the one place on the site an icon-only control would
have no adjacent visible label at all.

**More entrance motion (`global.css`, `PillarTile.astro`,
`src/pages/index.astro`, `src/pages/articles/index.astro`):** the
`rise-in`/`--delay-1` pair from session 5 (hero, page titles only) gained
`--delay-2`/`--delay-3`, continuing the same 80ms step, now applied to
Home's three Start here tiles, Home's Latest rows, and Explore's topic
tiles. `PillarTile.astro` gained an optional `class` prop (appended onto
its own root element) so callers can stagger a grid of tiles without an
extra wrapping div per tile. **Deliberately capped at `--delay-3` (240ms)
regardless of list length** — Explore has 6 topic tiles, and staggering
every one a full 80ms apart would take close to a second to finish
settling on every single page load; capped, the first four tiles step
0/80/160/240ms and the rest settle together at 240ms, matching the "short
enough not to feel slow on a second visit" ask directly rather than
inventing new timing values. Verified via real headless-Chrome computed
styles (`puppeteer-core`, same `--no-save`/removed-after pattern as every
check this redesign): Home's tiles/rows measured `0s, 0.08s, 0.16s`;
Explore's six measured `0s, 0.08s, 0.16s, 0.24s, 0.24s, 0.24s` — the cap
working exactly as designed, not just as written.

**Mid-article subscribe box (`global.css`'s base `.email-capture`, plus
`src/pages/index.astro`):** restyled to match the Home newsletter band's
card look — `--radius-xl` (36px, was `--radius` at its unmigrated 2px from
session 1), `--surface-card` background with no border (was the old
`--paper`/`--line` v1.0 aliases), a pill input and a pill neutral
`--button-bg`/`--button-fg` button (was `--copper`, sharp corners) — while
keeping its existing 40rem max-width, appropriately narrower than the
newsletter band's full-width card rather than matching its size too.
**Scope call, disclosed rather than made silently:** this class is shared
by three places — mid-article, end-of-article, and the standalone
`/subscribe` page — all three already rendered identically before this
fix, just in the older style, so restyling only the mid-article instance
would have left the other two visually mismatched with it on the very same
article page. All three got the fix as one shared change instead. The Home
newsletter band's own override (`.newsletter-band__inner :global(...)`)
shrank to just its one genuinely different value (more generous padding
for the full-width band) now that the rest is identical to the shared
base — the input/button overrides it used to carry were removed as
duplicates, not left as dead code.
**Verified two ways:** structurally, the compiled CSS was grepped directly
(`--radius-xl`, `--surface-card`, `--button-bg` pill button all present,
zero remaining references to `--paper`/`--line`/`--copper`/bare `--radius`
in this rule set). Visually, via real Chrome screenshots (`puppeteer-core`)
of the actual mid-article box on a real article page in light mode, dark
mode (toggled with the real button, not just CSS emulation), and a 390px
mobile viewport — rounded card, centered content, pill input/button
confirmed in all three, not just asserted from the CSS.

**Verified overall:** `npm run build` (30 routes, Pagefind still indexing
4 pages) and `astro check` (0 errors/warnings/hints) both pass clean.
`puppeteer-core` was installed `--no-save` and removed immediately after
use, confirmed via `git status` showing no diff on `package.json`/
`package-lock.json` afterward — same discipline as every prior check this
redesign.

## v1.1 redesign, post-session-5 fix: search dropdown was rendering unstyled

**Status: built on branch `redesign`, not merged, not live.** Owner review
of the previous preview attached a real screenshot: the search dropdown on
`/articles` rendered as one giant underlined wall of run-together text —
correct data, completely absent styling.

**Root cause, confirmed by reading the actual failure, not guessed:**
`SearchBox.astro`'s result-row CSS (`.search__result`,
`.search__result-title`, etc.) lived in the file's own scoped `<style>`
block, which was never wrong on its own — but the result rows it targets
are built as plain HTML strings by the component's client script and
inserted via `results.innerHTML =` the moment someone types, not rendered
by Astro at build time. Astro's scoped-style mechanism works by stamping a
`data-astro-cid-*` attribute onto every element the compiler itself sees
and rewriting that component's selectors to require it — anything built by
client JS after the page has already rendered never receives that
attribute, so the scoped selectors silently never matched. Every prior
check in this redesign that inspected the resulting DOM/text content
(including this project's own prior sessions) would have shown the classes
and structure as correct, because they were — only actually rendering the
page and looking at it surfaced the bug, exactly the lesson this file's
own "login works ≠ the full write path works" precedent from the Keystatic
OAuth work already flagged in a different context. **Fixed the same way
`.email-capture` and `.reflection-inline-photo` already were**: all of the
result-row CSS moved unscoped into `global.css`. `.search`/`.search__input`/
`.search__results` (static markup Astro does compile) stayed alongside it
in the same file rather than being split across two places depending on
which specific element happens to be dynamic.

**Rebuilt the actual result markup**, still from Pagefind's own structured
per-result data (never its default result UI, which this project has never
used) — confirmed one row per matching article was already true before this
fix (Pagefind indexes one result per page; verified with real multi-result
output in a prior session), so the "raw dump" the owner saw was a purely
visual failure, not a data-model one:
- A pillar-colored category label, reusing the exact same `.category-pill`/
  `pillar--<category>` classes an article's own title block uses — this
  needed real wiring, not just a class name: `data-pagefind-meta="category:
  ${category}"` was added to `Article.astro`'s and `ReflectionArticle.astro`'s
  `data-pagefind-body` element so Pagefind actually captures and exposes it
  per result.
- **A second, unrelated bug caught and fixed in the same pass, not
  separately:** `.category-pill` itself was scoped only inside
  `Article.astro`'s own `<style>` — `ReflectionArticle.astro` had been
  applying the exact same class since session 5 without ever defining it,
  so a Reflection essay's category pill has been rendering completely
  unstyled (no pill shape, no color) this whole time. Moving
  `.category-pill` to `global.css` alongside the `pillar--*` definitions
  it's always used with (the same "extract when a second thing needs it"
  move already made for `.btn`/`.chip`) fixed both consumers at once.
- The title, bold and ink-colored, no default link-blue/underline (only a
  background change on hover or keyboard-highlight).
- Pagefind's own excerpt (already a short, relevant snippet around the
  match, not the whole passage) with a `-webkit-line-clamp: 2` CSS backstop
  and the existing `<mark>` styling (accent-tint background) now actually
  applying.
- A hairline between rows, none after the last — same pattern as
  `.latest-card`.
- Capped at 5 visible results (the brief's 4-6 range), down from the
  previous, arbitrary 8.

**Keyboard navigation, added — wasn't there before at all:** proper
combobox/listbox pattern (`aria-activedescendant` on the input, `role=
"option"`/stable `id`/`aria-selected` on each row) rather than moving real
DOM focus off the text field, since the field needs to stay focused and
typeable throughout. Arrow Down/Up moves the highlighted result (clamped,
no wraparound — not asked for), Enter opens the highlighted result or, if
none is highlighted yet, the top one (the common "just hit Enter" search
expectation), Escape closes exactly as it already did. Minified script
syntax-checked with `node -c` before trusting it, same discipline as every
other hand-minified script in this codebase.

**Verified two ways, since this exact bug is the reason a DOM check alone
isn't trustworthy here:** structurally (grepped the compiled CSS/HTML for
the new class names and the `data-pagefind-meta` attribute actually
landing in the build output), and visually — the Chrome extension still
would not connect (tried again, same result as every session this
redesign), so real screenshots via `puppeteer-core` (installed `--no-save`,
removed after) of the actual rendered dropdown for the query "why": three
clean, separated rows with a colored category pill, bold title, and a
single highlighted-word excerpt, confirmed in light mode, dark mode
(toggled with the real button), and a 390px mobile viewport. Keyboard nav
verified the same way: two `ArrowDown` presses landed
`aria-activedescendant`/the matching row's `aria-selected` on index 1 as
expected, and `Escape` hid the results panel.

**Verified overall:** `npm run build` (30 routes, Pagefind still indexing
4 pages) and `astro check` (0 errors/warnings/hints) both pass clean.

## v1.1 redesign, post-session-5 fix: search dropdown rendering behind page content

**Status: built on branch `redesign`, not merged, not live.** Owner review
of the previous preview attached a real screenshot: the search dropdown on
`/articles` was rendering *behind* the topic tiles below it, their
background bleeding into the card.

**Root cause, and a real mid-investigation dead end worth recording
honestly:** `.explore-header` (an ancestor of the search box) carries
`rise-in`. `animation-fill-mode: both` keeps that animation's effect on
`transform` applied indefinitely after it finishes — confirmed directly,
`getComputedStyle(.explore-header).transform` reports a non-`none` matrix
forever post-animation, not just while visibly running. Per the CSS
stacking-context rules, that silently promotes the header to its own,
unintentional stacking context, which traps the search dropdown's own
`z-index` inside it — no `z-index` value on the dropdown itself could
ever have won against `.topics-band` below, because it was never actually
competing against it at the same level.
**First attempt didn't work, and the check that revealed that mattered:**
changed the `rise-in`/`photo-settle` keyframes' `to` state from
`translateY(0)`/`scale(1)` to `transform: none` (visually identical, but
only a static `transform: none` normally avoids the stacking-context
trigger). Measured before and after: `getComputedStyle` reported the
*exact same* non-`none` matrix either way. Kept the change anyway (it's
still a real, harmless correctness improvement — the CSS now says what it
means), but it does not fix this bug on its own, and the comments in
`global.css` say so plainly rather than repeating the original, disproven
claim.
**The actual fix:** `.explore-header` (`src/pages/articles/index.astro`)
now gets an explicit `position: relative; z-index: 30` — the same value
`.search__results` uses (see the new sitewide z-index scale, documented
once in `global.css` above `.language-prompt`: 30 for this dropdown, 60
for `ReadingProgress`, 100 for the language prompt — cross-referenced from
`ReadingProgress.astro` too, so a future addition has one place to check
before picking a number). Making the header itself an intentional,
correctly-ranked stacking context lets its whole subtree — dropdown
included — win against `.topics-band` directly, regardless of exactly how
the animation's own accidental context forms.
**A second dead end, also worth recording:** the first "confirmation"
screenshot after this fix, at a 700px-tall viewport, still looked
ambiguous — a sliver of tile color was visible right at the dropdown's
rounded bottom corner and the viewport's own cutoff edge, reading a lot
like the original bug at a glance. Rather than trust that, checked two
different ways: `document.elementFromPoint()` sampled in a grid across the
dropdown's real interior, which returned the dropdown's own rows at every
point except its rounded corners (correct rounded-corner rendering, not a
stacking bug); and a taller, untruncated viewport, which showed the whole
dropdown cleanly on top of the tiles with zero ambiguity. **Lesson worth
keeping alongside this file's existing ones on this exact theme** (the
Keystatic `_redirects` incident, the sidebar-overlap bug): a cropped
screenshot of a tall floating panel can look like a stacking bug even when
the stacking is already correct — confirm with a full, untruncated view or
a real hit-test, not a screenshot that happens to cut through the panel
right where its rounded corner is.
**Verified for real, all three surfaces asked for:** grid `elementFromPoint`
hit-testing returned zero leaks (elements other than the dropdown's own
rows/corners) in light mode, dark mode (toggled with the real button), and
a 390px mobile viewport — and a full, untruncated screenshot of each
confirms it visually too.

**Verified overall:** `npm run build` (30 routes, Pagefind still indexing
4 pages) and `astro check` (0 errors/warnings/hints) both pass clean.
`puppeteer-core` installed `--no-save` and removed immediately after use
each time, confirmed via `git status` showing no diff on `package.json`/
`package-lock.json` afterward.

## v1.1 redesign, pre-session-6 audit: Lighthouse + contrast report

**Status: audit only, no code changes — nothing on `redesign` needed
fixing.** The one piece of session 5's original scope left undone,
finished before going live: Lighthouse (mobile) and a full contrast report
across the redesign, both themes, requested explicitly rather than
skipped again.

**Pages audited:** Home, the article template (`a-simple-pour-over-
method-for-beginners`, category `methods` — chosen specifically because it
exercises the sidebar: it's 2+ h2s so the table of contents renders, and
it's position 2 in the "Beginner Basics" series so the series rail renders
too, not just a bare article body), Explore (with this session's search
fix in place), and a Reflection essay. No real reflection essay is
published yet, so the same disposable local-fixture approach from the
session 5 audit was reused: a `draft: false` fixture with two h2s and a
blockquote, built, audited, then deleted before anything was committed —
confirmed via `git status` and a final clean rebuild (back to the real 30
routes / 4 indexed pages) that nothing from it leaked into the branch.

**Method:** `puppeteer-core` and `lighthouse`, both installed `--no-save`
and removed immediately after use (confirmed via `git status` showing no
diff on `package.json`/`package-lock.json` afterward, same discipline as
every check this redesign). Lighthouse's own documented Puppeteer
integration (`lighthouse(url, flags, config, page)`, passing an
already-open page) made it possible to drive the *same* browser tab for
both themes: `page.emulateMediaFeatures([{name: 'prefers-color-scheme',
value: theme}])` before each run, so the site's own `prefers-color-scheme`
logic in `BaseHead.astro` picks the theme exactly the way a real visitor
with no stored preference would, rather than needing to fake a
`cuerpo_theme` cookie. Mobile: `formFactor: 'mobile'`, a 412×823 screen
emulation, simulated throttling — the same profile prior sessions' one-off
Lighthouse checks used.

**Contrast, checked properly, not just via Lighthouse's own accessibility
score:** a dedicated sweep script resolved the real computed color for
`--olive-text`, `--olive-on-dark`, `--accent-text`, `--accent-on-dark`,
and `--copper` at the moment each page rendered (per theme — these
tokens' actual hex values differ between light and dark, see
`tokens.css`), then walked every element with direct text content whose
computed `color` matched one of those, found its real effective
background by walking up the DOM, and computed the true WCAG contrast
ratio (font-size/weight-aware: 3:1 for large/bold text, 4.5:1 otherwise) —
not spot-checking the handful of pairs prior sessions already verified,
every real occurrence actually found on each of the four pages.
**A false positive in this method itself, caught and fixed before it was
reported as a real bug** — worth recording since it's exactly the kind of
self-check this file's culture already expects: the sweep's DOM walk finds
the *first* non-transparent background above an element, but treats any
`rgba(...)` it meets as already-opaque instead of compositing it against
what's actually behind it. Dark mode's `--accent-tint` (`rgba(227, 173,
132, 0.16)` — a translucent version of the *same* hue as `--accent-text`,
unlike light mode's `--accent-tint`, which is a distinct opaque cream) hit
this exactly: the naive calculation reported a contrast ratio of ~1
(near-total failure) for the search dropdown's `<mark>` highlight in dark
mode. Recomputed by hand with proper alpha compositing against what the
tint actually sits on (the search card's `--surface-card`, `#33261d` in
dark): **5.26:1, a genuine pass.** Checked the tint's one other real
consumer the same way — the homepage's "New" badge (`--accent-tint` on
`--surface-1` dark, `#1a120e`): **6.84:1, also a genuine pass.** Confirmed
`--accent-tint` is the *only* non-shadow `rgba()` value anywhere in
`tokens.css`/`global.css` (grepped directly), so this was the one place
in the whole sweep the compositing gap could have mattered, and both real
consumers of it have now been checked correctly by hand. Nothing in the
site's own CSS was wrong here — the bug was entirely in the audit script.

**Also checked: every audit Lighthouse's accessibility/performance
categories flag individually, not just the rounded category score** (a
category can round to 100 while still listing non-passing audits) — the
only non-"insight"/non-informative item close to failing anywhere was
`unused-javascript` (~0.5) on every page, always pointing at the same
file: `client.js`, the shared React runtime. That's the pre-existing,
explicitly disclosed, owner-approved ~70KB `LanguagePrompt` island cost
from the i18n work (confirmed by inspecting the audit's own flagged
URL/byte count directly, not assumed) — not a regression from anything in
this redesign, and not something this audit's scope calls for removing.

**Result: no fixes were needed anywhere.** Performance 99–100, Accessibility
100, Best Practices 100 on every page in both themes; zero genuine
contrast failures across olive-text, olive-on-dark, accent-text,
accent-on-dark, and copper, in either theme, on any of the four pages —
including surfaces never spot-checked in earlier sessions (the search
result category pill and `<mark>` highlight, the Reflection essay's
author-box label, the article sidebar's TOC/series-rail labels in dark
mode). Because nothing needed changing, there's no `docs/CHANGELOG.md`
entry for this session — that file is for changes that reach the live
site, and this one made none.

| Page | Light (perf / a11y / best-practices) | Dark (perf / a11y / best-practices) | Contrast failures | Fixes |
|---|---|---|---|---|
| Home | 99 / 100 / 100 | 99 / 100 / 100 | 0 | none |
| Article (methods, with TOC + series rail) | 99 / 100 / 100 | 99 / 100 / 100 | 0 | none |
| Explore (search fix in place) | 99 / 100 / 100 | 99 / 100 / 100 | 0 | none |
| Reflection (temp fixture, deleted after) | 100 / 100 / 100 | 99 / 100 / 100 | 0 | none |

## v1.1 redesign, pre-session-6: real author info, photos, and a real About page

**Status: built on branch `redesign`, not merged, not live.** The last
real content gap before going live — placeholder author text and the
About page's filler copy — filled in with the owner's actual photos and
words.

**Two real photos landed in `src/assets/author/`.** Their on-disk names
didn't match what was asked for (`avatar_square.jpg`/`about_portrait.jpg`
vs. the requested `avatar.jpg`/`about-hero.jpg`) — renamed rather than
referenced under their original names, so the code matches what was
actually asked for rather than working around a naming mismatch. Confirmed
by dimensions before renaming, not just by guessing from filenames:
`avatar.jpg` is a genuine 512×512 square; `about-hero.jpg` is 1170×1278,
a portrait crop with real headroom, matching "a wider portrait with
shoulders" as described.

**Author config (`src/content.config.ts`, `keystatic.config.ts`,
`src/content/author/author.yaml`) gained real fields, not just real
values:** the schema never had a `title` or `avatar` field at all — only
`name` and a placeholder `bio` from session 4. `bio` was renamed to
`title` (a short role line) rather than kept alongside a new bio sentence:
no bio copy was ever provided for it, and inventing one would have broken
this same schema's own "don't fabricate real content" precedent — the one
that justified shipping it with placeholder text in the first place.
`avatar` is a real `image()` field (same pattern as an article's
`heroImage`), wired through Keystatic as `fields.image` pointed at
`src/assets/author`, so the owner can replace either photo at `/keystatic`
without a code change.

**`AuthorBox.astro` now renders a real photo, not a flat placeholder** —
an `<Image>` from `astro:assets` when an avatar is set, still falling back
to the old flat circle (now a named `--placeholder` modifier class, not
the default) if one's ever absent, same defensive pattern as every other
optional image in this codebase. `bio` prop renamed to `title` to match
the schema. `Article.astro` and `ReflectionArticle.astro` (the two
callers) both updated — their hand-written `author` prop type and their
`<AuthorBox>` call both needed the same rename, confirmed via `astro
check` that nothing was missed rather than assumed from a single grep.

**`/about` rebuilt from a two-paragraph placeholder (with a literal
"TODO (owner): replace before launch" comment) into the real page.**
Reading-page layout, not a section-banded one — one white `surface-1`
band, one reading column (`var(--measure)`) running from the title through
the photo to the body and the sign-off, `rise-in`/`photo-settle` on the
title block and hero matching every other page's opening block (an
already-established pattern, not something invented for this page).
**One real judgment call, disclosed rather than made silently:** the hero
photo is deliberately capped to the same reading-column width as the text
around it, not stretched to the wider landscape treatment Article.astro's
own hero uses — `about-hero.jpg` is portrait-oriented (taller than wide),
and forcing a portrait photo into a landscape-hero mold would have either
distorted it or cropped away the exact headroom/shoulders it was chosen
for. The sign-off line pulls `name`/`title` from the one shared author
config via `getAuthor()` rather than hardcoding the string a second
time — today that resolves to character-for-character the same text
that was given, and stays correct automatically if the author config
is ever updated later, consistent with this codebase's "one source of
truth, never invent per-page content" rule already applied to every
article's byline.
**A real stacked-margin near-miss, caught before it shipped, not after:**
the sign-off paragraph's first draft set its own `margin-top: 0` trying to
override Prose's default `.prose > * + *` spacing rule — which wouldn't
even have worked (Prose's scoped selector has higher specificity than a
bare class, so the override would have silently done nothing), and more
importantly wasn't actually what was wanted: the gap *before* the
sign-off's hairline rule is supposed to come from Prose's own normal
paragraph spacing, with only a `padding-top` + `border-top` added on top
of that for the divider itself. Fixed before the first build.
**Copy verified verbatim, not just visually:** every paragraph and the
standfirst were grepped directly out of the built HTML output character
for character against the text given, not just eyeballed in a screenshot
— six body paragraphs, correctly separated (confirmed via the compiled
HTML's actual `<p>` boundaries, not assumed from the source markup), the
sign-off line, and the hero's alt text all matched exactly.

**Verified in a real browser, all three surfaces asked for:** `puppeteer-
core` (installed `--no-save`, removed immediately after, confirmed via
`git status` showing no diff on `package.json`/`package-lock.json`
afterward) screenshotted `/about` in light mode, dark mode (via
`prefers-color-scheme` emulation), and a 390px mobile viewport — all
three clean. The author box's actual photo was verified two ways after an
initial full-page screenshot made it too small to tell anything from: a
direct `naturalWidth`/`naturalHeight`/`complete` check on the real `<img>`
element (128×128, fully loaded) and a cropped screenshot of the author-box
element alone, which shows the real photo rendering correctly, circular,
at full quality.

**Verified overall:** `npm run build` (30 routes, Pagefind still indexing
4 pages — now 724 words, up slightly since the author box's real name/
title text is inside the indexed article body) and `astro check`
(0 errors/warnings/hints) both pass clean.

## v1.1 redesign, post-photos: About page layout redesign

**Status: built on branch `redesign`, not merged, not live.** Layout-only,
per instruction — the real copy from the previous session is untouched;
verified by diff and by re-grepping the build output, not just assumed
from not having typed over it.

**Corner portrait, replacing the full-width treatment:** `about-hero.jpg`
is a face-and-shoulders portrait crop, the wrong shape for the landscape
hero treatment `Article.astro` uses — stretched full-width it read as an
oversized, oddly-cropped banner. Now a small (≈368×460 at desktop,
≈208×260 on mobile) photo beside the title/standfirst in a two-column
intro row, 4:5, `object-fit: cover`, `radius-lg`.
**A real bug, not just a style choice, caught before it shipped:** the
first version set `aspect-ratio: 4/5` directly on the `<Image>`, and it
didn't work — the rendered box came out at the source file's full native
1170×1278 regardless. Confirmed directly, not guessed: Astro's `<Image>`
sets the `<img>`'s HTML `width`/`height` attributes to the source file's
own dimensions whenever no explicit `width`/`height` prop is given (only
`widths` was provided, for the responsive srcset), and a browser resolves
that element's rendered box from those HTML attributes *ahead of* a CSS
`aspect-ratio` declared on that same element — confirmed via
`getBoundingClientRect()` before and after, not assumed from reading
about the behavior. **Fixed by moving the ratio/crop onto a plain
wrapping `<div>`** (`.about__photo-frame`) instead of the `<img>` itself:
a div has no competing intrinsic size of its own, so `aspect-ratio` +
`overflow: hidden` apply the same way regardless of that HTML-attribute
interaction; the `<img>` inside just fills it at `width:100%;
height:100%; object-fit:cover`. Worth remembering for any future
Astro `<Image>` usage that needs a forced crop ratio without also
specifying an explicit pixel `width`/`height`: put the ratio on a
wrapper, not the image element.
**Mobile:** stacked (photo above text), a fixed 13rem (not full-width),
centered — the same "modest size, not full-bleed" instruction applied to
both breakpoints, not just desktop.

**Pull-quote card**, inserted after the third paragraph per instruction —
docs/DESIGN-SYSTEM.md's pull-quote treatment (olive rule, italic, larger
Manrope — the same language `ReflectionArticle.astro`'s blockquote
already uses) adapted into a self-contained elevated card rather than an
in-column rule-bordered block. The olive rule became a short, centered
accent above the text rather than the full-width top/bottom rules
Reflection's version uses — a rule spanning the whole card's edge would
have read as a border, not the quote-marker accent it's supposed to be.
**No shadow — checked the design system's actual rule rather than
defaulting to "shadows usually mean elevated":**
docs/DESIGN-SYSTEM.md's Shape/space/depth section is explicit with no
stated exception — "shadow only on hover-lift and the search dropdown,
never at rest." This card is static (not a link/button), so there's no
hover state to legitimately hang a shadow on either, and inventing one
just to justify a shadow would be exactly the kind of one-off exception
that erodes a restraint rule the first time it's inconvenient. Elevation
comes the same way every other at-rest card on this site already achieves
it without a shadow (the author box, a pillar tile, the newsletter
card): a `--surface-2` fill, generous padding, and `radius-lg`, distinct
from the white `surface-1` reading band around it.
**A real stacked-margin bug, caught before the first build, not after:**
the pull-quote sits as a direct child of `<Prose>`, which already gives
every non-first child a `margin-top` via its own `.prose > * + *` rule —
the first draft also set `margin-block` (top and bottom) on the card
itself, which would have doubled the top gap, the same bug class flagged
repeatedly elsewhere in this file. Fixed to `margin-bottom` only before
ever building it, not found by testing after.

**Sign-off card**, deliberately not a reuse of `<AuthorBox />` as-is: that
component's whole job is introducing the author on somebody else's
reading (an article they didn't write) with a small circular avatar —
here the author *is* the page, and the portrait already ran once at the
top of it, so a second small photo at the bottom would read as a
duplicate, not a closing moment. Built as its own text-only card (name,
then title, centered) sharing the same `--surface-2`/`radius-lg`
language as the pull-quote above it, so the two read as the page's two
deliberate pauses without being the same component.

**Verified in a real browser, all three surfaces asked for:**
`puppeteer-core` (installed `--no-save`, removed immediately after,
confirmed via `git status` showing no diff on `package.json`/
`package-lock.json` afterward) screenshotted the page in light, dark
(`prefers-color-scheme` emulation), and a 390px mobile viewport — all
three confirmed clean, including a direct `getBoundingClientRect()` check
on the photo frame confirming the true 4:5 ratio, not just a screenshot
that happened to look about right.

**Verified overall:** `npm run build` (30 routes) and `astro check`
(0 errors/warnings/hints) both pass clean. Every body paragraph, the
standfirst, and the sign-off re-verified verbatim against the built HTML
output after this layout change, not assumed unchanged just because the
JSX text nodes weren't touched.

## v1.1 redesign, second About layout pass: five fixes from owner review

**Status: built on branch `redesign`, not merged, not live.** Still
layout-only — the copy is untouched, re-verified verbatim against the
build output after this pass too, same discipline as the previous one.

**The dead-gap bug (the real one, not a spacing tweak):** the previous
layout put title+standfirst and the photo in one CSS Grid row, then the
body copy as a separate block after that row entirely. Grid rows
auto-size to their tallest item by default — since the photo (~460px)
was far taller than the title+standfirst, the row's height was dictated
by the photo, and the body copy (a sibling block after the whole row)
couldn't start until that full height was spent, leaving the reported
dead gap under the standfirst.
**Fixed with a real CSS Grid row-span, not a hack:** the grid is now two
rows — row one holds title+standfirst, row two holds the body copy — and
the photo spans both rows (`grid-row: 1 / 3`) instead of sharing just the
first one. Each row's own height now comes only from its own
non-spanning content (title-block alone for row one, all the body copy
for row two); the spanning photo simply borrows whatever height those
two rows already add up to. Since real body copy is always far taller
than 460px, this never needs the rows to grow to fit the photo — which
is exactly what makes the copy start flowing immediately under the
standfirst instead of waiting for the photo. A real, well-established
Grid pattern for "sidebar image beside multiple content blocks," not
something invented for this page.

**Standfirst:** italic, `--step-0` (matching body text) instead of
`--step-1` upright — a quiet aside, not a lead paragraph.

**Left-aligned throughout:** the pull-quote and sign-off cards lost their
`text-align: center`/`margin-inline: auto` centering (card background/
padding/radius kept, just the text alignment changed) — nothing on the
page centers now, matching the rest of the site's own left-aligned body
text.

**Sign-off row:** now a real `flex` row — a 3.5rem circular avatar (the
same `author.data.avatar` the author box elsewhere already uses) beside
the name/title as one line with an em dash, inside the same card as
before. Deliberately still not `<AuthorBox />` itself — that component's
"Written by" framing doesn't fit the author's own closing signature on
their own bio page, and its stacked name/title layout doesn't match the
single combined line the original sign-off copy actually uses. `name`
and `title` are separate `<span>`s inside one line (bold ink / muted)
for the same visual hierarchy `AuthorBox` uses, without reusing the
component wholesale.

**Hero crop, measured rather than guessed twice:** the reported "cuts off
one shoulder" bug was real — confirmed by cropping the *previous* built
screenshot to just the photo and comparing it directly against the source
file: the subject sits left of center in the raw 1170×1278 photo (more
empty window/sky on the right than plant/pillar on the left), so a plain
`object-position: center` crop at the narrower 4:5 ratio cut in
asymmetrically. Set to `object-position: 38% center` and confirmed by
screenshotting the fix and comparing the cropped result side by side
against the original bug's own cropped screenshot — both shoulders
visible, roughly symmetric — not just picked once and assumed correct.

**Verified in a real browser, all three surfaces asked for:**
`puppeteer-core` (installed `--no-save`, removed immediately after,
confirmed via `git status` showing no diff on `package.json`/
`package-lock.json` afterward) screenshotted the page in light, dark, and
a 390px mobile viewport — all three confirmed clean, plus the direct
before/after crop comparison described above.

**Verified overall:** `npm run build` (30 routes) and `astro check`
(0 errors/warnings/hints) both pass clean. Every body paragraph, the
standfirst, and the sign-off re-verified verbatim against the built HTML
output, not assumed unchanged just because the JSX text nodes weren't
directly edited.

## v1.1 redesign, post-photos: real Home + article photos, a real Keystatic bug

**Status: built on branch `redesign`, not merged, not live.** Two real,
licensed stock photos (temporary — see the `docs/BACKLOG.md` flag below)
replaced flat placeholder blocks: the Home hero and the "Why Your Coffee
Tastes Sour" article hero.

**Home hero (`home-hero.jpg`, `src/assets/home/`):** wired through Astro's
`<Image>`, same pattern as the About page's own hero. The text that used to
sit directly on the flat `--tile-dark` fill moved into its own
`.hero-card__content` wrapper so the photo and a scrim can sit behind it at
`position: absolute` without restructuring the existing label/title/
description/buttons markup. **The scrim is a flat, uniform dark overlay,
not a gradient** — `docs/DESIGN-SYSTEM.md`'s "No gradients" is a blanket
rule (Shape, space, depth section), not scoped to olive specifically, so a
left-to-right fade (the more "editorial" option) would have been a real
rule violation, not just a style choice. Contrast verified against the
*actual rendered photo pixels* behind the text (sampled via canvas, then
composited with the scrim's own alpha) rather than just the scrim's flat
color alone, which would have ignored the photo showing through it — label
8.90:1, description 5.74:1, both comfortably past 4.5:1.

**Article hero, and a real pre-existing bug found while wiring it up —
worth recording in full, the same way the GitHub OAuth scope issue and the
Keystatic `_redirects` issue were:** the owner uploaded
`sour-coffee-hero.jpg` directly through Keystatic's own Hero image field,
exactly as the field was designed to be used. It saved and committed to
`main` successfully (Keystatic's GitHub storage mode has no `branchPrefix`
configured, so it commits straight to the repo's default branch — flagged
to the owner *before* they clicked upload, not discovered after) — but the
very next build failed outright: `[ImageNotFound] Could not find requested
image 'heroImage.jpg'`.
**Root cause, found by reading `@keystatic/core`'s own `fields.image()`
source directly, not guessed:** the field's `directory` option
(`src/content/articles/images`, set back in session 4) only controls where
Keystatic *physically saves* the uploaded file — confirmed the real file
landed at `src/content/articles/images/why-your-coffee-tastes-sour/
heroImage.jpg`, a genuine per-slug subfolder Keystatic creates on its own.
But the *frontmatter value* Keystatic writes is computed completely
separately, by a different option (`publicPath`) that was never set — and
reading `getSrcPrefix()`'s implementation confirmed that with no
`publicPath`, the prefix is simply empty, so Keystatic wrote just the bare
filename (`heroImage.jpg`) into frontmatter. Astro's content-collection
`image()` schema then resolved that bare filename relative to the `.md`
file's own directory (`src/content/articles/`) — one level up from where
the file actually is. **This field has existed since session 4 and had
never been exercised with a real upload until this one** — confirming
again this codebase's own repeated lesson that "the field exists and is
configured" is not the same claim as "the field actually works end to
end."
**Fixed at the root, not patched around:** added `publicPath: 'images/'`
to the field in `keystatic.config.ts`, so the string Keystatic writes now
agrees with where it actually saves the file — verified by reading
`getSrcPrefix()`'s own logic, not just hoped: with `publicPath` set, it
produces `images/<slug>/`, combined with the filename, exactly matching
the real per-slug subfolder path. The one already-broken frontmatter value
was hand-corrected to match (`images/why-your-coffee-tastes-sour/
heroImage.jpg`) so this build works today; the config fix means the next
upload through this same field won't need the same manual correction.
**Important, flagged plainly rather than silently handled:** this
`keystatic.config.ts` fix only exists on `redesign` so far. The *same*
field, with the *same* bug, still exists on `main` right now — the next
time anyone uploads a hero image for a *different* article through the
live Keystatic editor, it will hit the identical `ImageNotFound` build
failure. Fixing `main`'s copy of this config is a small, independent,
code-only change — deliberately not made as a side effect of this
redesign-branch session without being asked, since it's a change to `main`
outside the branch/preview/approve workflow everything else here has used.
**Needs its own explicit go-ahead before it happens.**
**The requested caption update was not made — genuinely not found, not
skipped.** Asked to update "the caption underneath that photo, currently
describing a V60 drip," to match the new espresso-pour photo. Searched
thoroughly before concluding anything: the full article body (no mention
of grounds, V60, or a caption of any kind), `heroAlt` (already correctly
"Espresso pouring into a glass cup." — Keystatic set it correctly), the
rendered build output around the hero image (no `<figcaption>` or any
visible text there at all, confirmed directly in the compiled HTML and by
screenshot), `main`'s own pre-redesign `Article.astro` (in case this was a
leftover from the old template), and every content file in the repo for
the described phrase ("medium-fine grounds," "water passing through,"
"V60") — zero matches anywhere, on either branch. Reported this back
rather than guessing at an edit to content that, as far as this repo is
concerned, doesn't exist.

**Verified in a real browser, both photos, all three surfaces asked for:**
`puppeteer-core` (`--no-save`, removed after) screenshotted both the Home
hero and the article hero in light mode, dark mode, and a 390px mobile
viewport — all six renders confirmed clean, plus a direct check on the
article hero's actual `<img>` (`complete: true`, correct `alt`, real
`naturalWidth`) rather than assuming a successful build meant a correctly
rendered image.

**Verified overall:** `npm run build` (30 routes) and `astro check`
(0 errors/warnings/hints) both pass clean — including the real build
failure found and fixed along the way, not just the final green run.

## v1.1 redesign, post-photo fixes: dark-mode contrast, button hover, newsletter card spacing

**Status: built on branch `redesign`, not merged, not live.** Three fixes
from owner review of the preview, still within the pre-session-6 cleanup
window, not a new numbered session.

**Dark-mode surface/tile contrast (`src/styles/tokens.css`):** the dark
palette's `[data-theme='dark']` block was rebuilt. The original values were
all packed into roughly the bottom 13% of the lightness range, with
adjacent-step contrast ratios of ~1.01–1.09:1 — confirmed numerically, not
just by eye, which is exactly why the Home page's Fundamentals/Gear tiles
read as nearly invisible against the Start Here band behind them, and
`tile-sand`/`tile-dark` had become functional duplicates (one unit apart in
two channels). Rebuilt around two different kinds of token rather than one
flat ladder: the generic surface ladder (`surface-1/2/3/card`, `tile-dark`)
now spans a real ~10–25% lightness range, each adjacent step individually
checked (1.18–1.30:1, at or above light mode's own internal step gaps);
`roast` and `tile-sand` are treated as **pillar identity colors** (same as
light mode, where roast is very dark and sand is very light — opposite
ends of the range, not middle rungs), pushed to the dark and light
extremes respectively. Fundamentals tile vs. the band it sits on went from
~1.01:1 to 2.49:1; Gear tile vs. the same band went from ~1.02:1 to 1.29:1.
Every real text-on-surface pairing already in use on the site was
recomputed against the new values before committing to them — all still
clear the 4.5:1 minimum (large text 3:1), lowest result 4.65:1
(`--muted` on `--surface-card`). Verified visually in a real browser,
dark mode: all six Explore page pillar tiles (not just the two originally
reported) are now clearly distinct from their band and from each other.

**Button hover text turning black (`src/styles/global.css`):** a real bug,
not a style tweak. The sitewide `a:hover { color: var(--espresso) }` rule
is a single element+pseudo-class selector, which beats a single class like
`.btn--primary` on CSS specificity (0,1,1 vs. 0,1,0) — so hovering any
`<a class="btn ...">` silently fell through to that link-hover color
instead of keeping the button's own. This was invisible on `.btn--outline`
and `.chip` purely by coincidence (their rest color already equals
`--espresso`/`--ink`), but real and visible on `.btn--primary` and
`.btn--outline-on-dark`, whose rest colors differ: in light mode this
turned "Start here" and "Read the latest" (Home hero, on an always-dark
photo card) and "Read the essay" (ReflectionStrip, also always-dark) black
on hover/active — unreadable. Fixed by re-asserting each variant's own
color at two-class specificity (0,2,0) in its own `:hover`/`:active` rule,
which reliably beats the single-class-plus-pseudo rule regardless of
source order — the general `a:hover` rule itself was left untouched, since
it's correct for normal links. Verified via real computed styles in a
browser, both themes: `.btn--primary` stays white-on-dark-fill on hover in
light mode and dark-on-cream-fill in dark mode; `.btn--outline-on-dark`
stays `--ink-on-dark` in both.

**Newsletter card spacing (`src/components/Prose.astro`):** the
mid-article subscribe card's own heading had an unwanted 64px
`margin-top`, making it look top-heavy. Root cause: the card is raw HTML
injected directly into the markdown AST (`remark-inline-subscribe.mjs`) as
a sibling of the article's real content, so its own internal `<h2>` sits
one level deeper in the DOM (inside `.email-capture`) than an authored
markdown heading does (a direct child of `.prose`) — confirmed directly via
the real DOM. `.prose :global(h2)`'s plain descendant selector matched
both, giving the card's own heading an unwanted margin on top of the
card's own padding. **This was never actually dark-mode-specific**, even
though it was reported and first investigated as a dark-mode issue — it's
a structural selector bug independent of color, present equally in both
themes; it likely only became visually obvious in dark mode because that's
also the preview the owner was reviewing right after the surface-contrast
fix above made dark-mode bands properly distinct for the first time. Fixed
by scoping to a direct-child combinator (`.prose > :global(h2)` and the
equivalent for `h3`) — the same architectural pattern, and the same
lesson, as the earlier Reflection pull-quote fix this redesign. Verified:
computed `marginTop` is `0px` in light mode, dark mode, and at phone width;
screenshotted all three and confirmed the card reads as evenly spaced top
to bottom in every case.

**Verified:** `npm run build` and `astro check` both pass clean. Checked in
a real browser (not just computed styles) across both themes and mobile:
Home page hero and Start Here tiles (dark mode desktop + mobile light
mode), Explore page's full six-tile grid (dark mode), the newsletter card
on the sour-coffee article (light desktop, light mobile, dark mobile), and
all three affected buttons' hover states in both themes.

## v1.1 redesign, session 6: merged to main, live

**Status: done. `redesign` is merged into `main` (PR #2, merge commit
`0153a0c`) and tagged `v1.1-redesign`.** The real live site at
cuerpo.coffee now serves the full redesign.

**The `main`-side Keystatic `heroImage` bug (flagged above as needing its
own go-ahead) resolved itself, not via a separate fix:** a standalone
branch, `fix/keystatic-hero-image-path`, had been created earlier off
`main` specifically to carry just that one-line `publicPath: 'images/'`
fix — but it was never actually merged anywhere. Diffing it directly
against `redesign`'s own `keystatic.config.ts` before merging confirmed
`redesign` already contains that exact fix as a strict superset (plus
every later session's schema additions on top) — so merging `redesign`
into `main` carried it over automatically, with no separate merge needed.
`fix/keystatic-hero-image-path` is now fully redundant and safe to delete.

**Merge sequence, as actually run:** `git pull` on `main` (fast-forwarded
one commit, `32da483`); merged `main` into `redesign` — already
up to date, since `redesign` had already merged `main` in a prior session;
`npm run build`/`astro check` reconfirmed clean; opened PR #2
(`redesign` → `main`) and merged it with a real merge commit (not squashed,
not rebased) so the branch's full session-by-session history stays
intact and reachable from `main`; tagged that merge commit `v1.1-redesign`
and pushed the tag.

**Verified against the real live site, not just a green build** — the
GitHub check-run for Cloudflare's Workers Build (`Workers Builds:
cuerpo-coffee`) stayed `in_progress` in the GitHub API for over 20 minutes
after the merge, past the point other evidence confirmed the deploy had
actually finished — a reporting lag in Cloudflare's GitHub integration
itself, not a stuck or failed build. Confirmed the real site directly
instead of waiting on that status to flip: `curl` against
`https://cuerpo.coffee` for the Home, Article, Explore, and About pages
(all real `200`s); both self-hosted variable fonts serving (`200`), the
old deleted v1.0 fonts correctly `404`ing; the Home hero photo and the
sour-coffee article's hero photo both resolving to real built `/_astro/`
asset paths (confirming the Keystatic `heroImage` fix holds in
production, not just in a local build); the author box's real avatar
photo; Pagefind's own JS reachable (`200`); and all six pillar tiles'
`pillar--<category>` classes present on the live Explore page. **The
Chrome browser extension was not connected this session either** (checked
via `list_connected_browsers`, same as every prior session this
redesign) — so this is real HTTP/content verification against the actual
production site, not a visual screenshot, and that substitution is
disclosed here rather than presented as equivalent without comment.

**`docs/CHANGELOG.md`** got the final "merged to main and live" entry,
dated 2026-10-01, pointing at the merge commit and the `v1.0-pre-redesign`
tag as the rollback path.

**`redesign` and `fix/keystatic-hero-image-path` both deleted, locally and on
GitHub, after the merge above.** Both confirmed safe first, not just assumed:
`redesign` was a real (non-squashed) merge, so every commit on it is permanently
part of `main`'s history and reachable via `git log` even with the branch ref
gone; `fix/keystatic-hero-image-path` was never itself merged anywhere, but its
one fix was confirmed (by diff) to already be a strict subset of what `redesign`
carried into `main`, so nothing was lost deleting it either.

