# Cuerpo Coffee: Design System (plain-text copy)

> Save this in the repo as `docs/DESIGN-SYSTEM.md` and reference it from `CLAUDE.md`. It is the plain-text copy of the Cuerpo Coffee Design System artifact, which also holds the live component previews and the light and dark tokens. Where the two differ, the artifact is newer.


A quiet, editorial, high-ticket look for a home-coffee publication: warm neutrals, olive as a quiet section accent with a small copper spark, generous space, soft geometry, and photography that is obviously the author's own.

**This is a template, not a mood board.** Every page is assembled from a small set of section types in a fixed rhythm. New articles and new sections can be added or removed every day without losing the concept, as long as the invariants below hold. Read the "Page template and section rules" section below before adding or removing any section — that's this same document, not a separate file (an earlier version of this doc pointed at a `guidelines/10-page-template.md` that was never actually created; the content it would have held already lives inline here).

## The concept: five invariants

1. **Restraint.** Nothing on the page that does not need to be there. When in doubt, remove it.
2. **Warm and quiet.** Cream, sand and espresso carry the site. Olive marks sections and copper is a small warm spark; neither is ever a button or a page background.
3. **One serif.** Fraunces is used for page H1 only. Everything else is Manrope.
4. **Color-blocked bands.** Sections are full-width bands that alternate white, cream and sand. The footer is always the darkest band.
5. **Two photo spaces per page, at most.** Every other card is typographic. Photography is original, never stock.

## Color

Semantic tokens swap between Light and Dark; components never hardcode a hex.

| Role | Tokens | Share of a page |
|---|---|---|
| Surfaces | `surface-1`, `surface-2`, `surface-3`, `surface-card` | about 85% |
| Text | `ink`, `muted` | about 10% |
| Olive, the section accent | `olive`, `olive-text`, `olive-on-dark` | about 4% |
| Copper, the warm spark | `accent`, `accent-text`, `accent-tint` | 2% at most |
| Always-dark blocks | `tile-dark`, `tile-black`, `roast`, `footer`, `*-on-dark` | photo cards, footer, Reflection strip |

Every button is neutral: `button-bg` on `button-fg`, which inverts in dark mode. Page and band backgrounds are only white, cream and sand (and the always-dark blocks).

**Pillar colors** teach readers where they are without a legend: Troubleshooting is olive, Fundamentals is sand, Gear is roast, Methods is white with a hairline, Sourcing is copper, Reflection is near-black.

### Olive: sections only

Olive identifies a section. Use it for:

- Section labels: the small uppercase words above a heading ("Start here", "Series", "Newsletter", "Written by") and category names.
- Section markers: the numbered rings in a series list, the pull-quote rule, the table-of-contents and series progress markers, the reading-progress line. (A leaf ornament closing out an article was part of the original concept but was never actually built — no component or style for it exists anywhere in the codebase. Either build it properly in a future session or drop it from this list; don't leave it implied as already live.)
- The Troubleshooting topic tile and the category pills.
- On always-dark blocks, section labels in the light olive (`olive-on-dark`).

Never: buttons of any kind, page or band backgrounds, cards other than the Troubleshooting tile, links, focus rings, headlines or body text, gradients. At most one olive tile in a row of tiles. If a page starts to feel green, remove some.

### Copper: the warm spark

Copper is small and rare: the Sourcing tile, the italic word in the Home hero ("with body."), the "New" badge, and the matched-word highlight in the search dropdown's results. If it shows up more than once or twice on a screen, remove some.

(A handful of pre-redesign surfaces still use the old, wider copper footprint — the sitewide default link color, the language-preference prompt's "Español" button, `ArticleCard`'s hover state on the not-yet-rebuilt category/tag pages and the Spanish article tree, and `Prose`'s default blockquote border. These are known, tracked leftovers from before this color system was tightened, not new copper being added — see `CLAUDE.md`'s Progress notes for which ones are deliberately in scope for a future session versus deliberately left alone.)

## Typography

- **Fraunces** (weight 300 to 400) for the page H1 only, letter-spacing -0.025em.
- **Manrope** for everything else: H2 600, card titles 700, tracking -0.035em; body 400 at 17 to 20px with line-height 1.6 to 1.7; labels 12px, 700, uppercase, tracking 0.14em.
- Article column 680 to 720px (68ch at most). Self-host both faces as woff2 in production.

## Shape, space, depth

- Radius: 28px for tiles and cards, 36px for the newsletter card, 20px for compact embedded UI (the search dropdown is the one real user of this today — a standalone content callout like a pull-quote or a closing sign-off reads as a card in its own right and uses the 28px card radius instead, not the 20px value), pill for buttons, chips and the email field.
- No gradients. Shadow only on hover-lift and the search dropdown, never at rest. Hairlines are 1px.
- Container: 1152px of content (72rem — the actual built value; this doc previously said 1200px, which was never what shipped). Hero and photo cards inset 24px from the edges.
- Tiles sit on a 3-column grid with 24px gaps.

## Motion

Simple and quiet. There is no motion token family, so these are the rules:

- Theme change: colors fade over 350ms.
- Cards lift 4px on hover (280ms) and the arrow nudges 4px; buttons lift 1px (200ms) and press to scale .98.
- Page entrance: hero and title blocks rise 18px over 700ms, staggered by 80ms, once per load. The same rise also staggers grid/list content (Home's Start here tiles and Latest rows, Explore's topic tiles) at the same 80ms step, capped at a 240ms maximum delay regardless of list length — a long list shouldn't take the better part of a second to finish settling on every single page load.
- Photo spaces settle from scale 1.05 over 1.4s. Dropdowns fade in over 300ms.
- Everything switches off under `prefers-reduced-motion`.
- Page to page: CSS cross-document view transitions (`@view-transition { navigation: auto; }`), no JavaScript.

## Dark mode

- A round toggle sits in the header. In day mode it shows a **moon** (tap to go dark); in dark mode it shows a **sun** (tap to go light). Default is the visitor's system setting; an explicit choice wins and is remembered.
- Reflection essays open dark unless the visitor has explicitly chosen light.
- Photo cards, the Reflection strip and the footer stay dark in both themes.
- Implementation: these exact token names as CSS custom properties on `:root` and `[data-theme="dark"]`; a tiny inline script in `<head>` sets the theme before first paint so nothing flashes.

## Accessibility

Text is at least 4.5:1 in both themes (large text 3:1). Every control has a visible focus ring in the ink color. Icon-only buttons carry an `aria-label`. Photo spaces need alt text or a caption. No content is conveyed by color alone.

---

# Page template and section rules

## Anatomy: the order is fixed

1. **Header** on `surface-1`: wordmark, four links, search, dark-mode toggle, Subscribe. (Only two of the four links exist today — Articles and About; Start here and Series wait on their own pages. Search is a round icon button that links out to the real search field on Explore, not an inline bar in the header itself — see the Search component entry below.)
2. **Opening**: the hero photo card on Home; the title block on articles and Explore.
3. **Content bands**, alternating `surface-1`, `surface-2` and `surface-3`.
4. **Reflection strip** (optional, Home only), on `roast`.
5. **Newsletter band** on `surface-2` (Home) or `surface-3` (articles), with a white card.
6. **Footer** on `footer`: link columns, a faint oversized wordmark, the language switcher. Always last.

## The only allowed section types

| Section | Use for | Band |
|---|---|---|
| Hero photo card | Home opening, photo space 1 | `surface-1` with an inset dark card |
| Title block | Article, essay and Explore opening | `surface-1` |
| Start here | Three bento tiles for beginners | `surface-2` |
| Latest | One featured card plus three rows, with topic chips | `surface-1` |
| Series | Two series cards | `surface-3` |
| Topic tiles | Six tiles, 3 by 2 | `surface-2` |
| Tag cloud | Top 16 tags | `surface-1` |
| Reading body | Table of contents, 680px column, series rail | `surface-1` |
| Author box | Photo, name, title | `surface-2` card on band |
| Keep reading | Three related tiles | `surface-1` |
| Reflection strip | Featured essay, photo space 2 | `roast` |
| Newsletter band | Email capture | `surface-2` (Home) or `surface-3` (articles) |

## Adding a section

1. Use an existing section type. If none fits, compose one from the primitives (label, H2, tiles, rows, cards). Do not invent a new card style.
2. Choose a band color different from both neighbors, following the rhythm white, cream, white, sand. The newsletter band and footer stay last.
3. Padding is 96 to 104px top, 96px bottom, 120px sides. A label sits above a 48 to 56px H2.
4. Cards use 28px radius and are typographic, with no thumbnail, unless the card is one of the page's two photo spaces.
5. Photo spaces: two per page at most, never in adjacent bands, with alt text or a caption. A loop is muted, 6 seconds at most, poster image first, and stays still under reduced motion or data-saver.
6. Color by pillar. Olive only on section labels and markers and the Troubleshooting tile; never on buttons or backgrounds.
7. Check both themes. Use tokens only, never a hex.
8. On phones, tiles stack in one column and photo spaces keep their aspect ratio.

## Removing a section

- Any band can go except the header, the footer and the newsletter band.
- After removing one, re-alternate the neighbors so no two adjacent bands share a color.
- "Start here" is the entry to the beginner ladder in the business plan: keep it on Home.
- A section with nothing to show yet (no series, no featured article) is hidden entirely. Never render an empty band.

## Content limits, so the layout survives growth

- Latest: one featured article (a frontmatter flag) plus the three newest.
- Series: up to two cards on Home, all of them on Explore.
- Tags: the 16 most used.
- Titles up to 60 characters, descriptions 120 to 155.
- Article length follows the pillar table in the business plan; Reflection essays may run 5 to 10 minutes.

---

# Components

## Buttons

Pill-shaped actions: one primary per view, outlined secondaries, chips for filters.

- Every button is neutral: Subscribe and the active filter chip use `button-bg` and `button-fg` (they invert in dark mode). One primary per view.
- Never fill a button with olive or copper. Outlined secondaries use `border` and `ink`.
- Height 52px (chips 44px), fully rounded, Manrope 600 at 15px.
- Hover lifts 1px over 200ms; press scales to .98. Keep the focus ring visible.

## PillarTile

The typographic card: a pillar pill, a title, a link and an arrow circle. It carries no thumbnail.

- Color always follows the pillar: Troubleshooting olive, Fundamentals sand, Gear roast, Methods white with a hairline, Sourcing copper, Reflection near-black.
- At most one deep-olive tile in a row of tiles. Copper appears on the Sourcing tile only.
- 28px radius. On hover the card lifts 4px with `shadow-lift` and the arrow nudges 4px.
- Never add an image to a tile; photography belongs to the page's two photo spaces.

## SectionBands

The page rhythm as full-width color bands: header, opening, alternating content bands, optional Reflection strip, newsletter band, footer.

- Adjacent bands never share a color (the header and opening share white on purpose).
- The footer is the darkest band and always last; the newsletter band always sits directly above it.
- When you add or remove a band, re-alternate its neighbors. See "Removing a section" above.

## PhotoSpace

The large rounded photo card. A page holds two at most, never in adjacent bands; every other card is typographic.

- Original photography only, with alt text or a caption. A short loop must be muted, 6 seconds at most, with a poster image, and stay still under reduced motion or data-saver.
- It stays dark in both themes. On load the image settles from scale 1.05 over 1.4s.
- The badge is a design-time marker and is not shown on the site.

## Search

Free-text search over articles (Pagefind, built at deploy time), on the Explore page only — not a sitewide inline expandable bar in the header itself. A round icon button in the header links out to it (`/articles?focus=search`, which focuses the real field on load); on phones it's a labeled row in the hamburger drawer instead of a fourth header icon.

- Pagefind's own runtime loads lazily, on the first focus or keystroke — never on page load.
- Each result is one row per matching article, never per word occurrence: a pillar-colored category pill (the same `.category-pill`/`pillar--<category>` classes an article's own title block uses), the real title, and one line-clamped excerpt with just the match highlighted in copper.
- Capped at 5 visible results. Keyboard nav follows the standard combobox pattern: arrow keys move the highlight, Enter opens the highlighted (or top) result, Escape closes.
- The dropdown is the one other place besides card hover-lift that a shadow is allowed at rest — see Shape, space, depth above.

---

# Token names

The full light and dark values are in section 6 of `docs/TECHNICAL-PLAN.md` and in the design system's `tokens.json`. Use these exact names as CSS custom properties in `src/styles/tokens.css`.
