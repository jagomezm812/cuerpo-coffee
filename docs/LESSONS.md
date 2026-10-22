# Lessons: bug classes this project has hit more than once

A short index. Each line says the lesson and where the full story is recorded. Read it before debugging CSS, Worker routing or Keystatic.

- **"Login works" is not "the write path works."** Check the real end-to-end result in a browser, not just a status code. Keystatic `_redirects` and the OAuth `public_repo` scope both passed shallow checks. See `docs/PROGRESS-INFRA.md` (Progress, Keystatic).
- **`wrangler deploy` deletes dashboard-set plain-text variables.** Non-sensitive vars go in `wrangler.jsonc`; real secrets stay dashboard-only Secrets. See `docs/PROGRESS-INFRA.md`.
- **A matching static file bypasses the Worker** unless the path is in `assets.run_worker_first`. The failure is silent (a normal 200). See `docs/PROGRESS-INFRA.md` (i18n, `run_worker_first`).
- **Scoped Astro styles never reach HTML built by client JS or injected by remark.** Put those rules in `src/styles/global.css`. See `docs/PROGRESS-REDESIGN.md` (search dropdown unstyled; mid-article subscribe box).
- **Stacked padding/margin.** A wrapper's padding plus a child's own padding doubles a gap; `.prose > * + *` already adds top margin. Check the boundary, not one element. See `docs/PROGRESS-REDESIGN.md` (Latest spacing, hero spacing, About pull-quote).
- **Forever-applied `transform` makes an accidental stacking context** that traps child `z-index`. See `docs/PROGRESS-REDESIGN.md` (search dropdown behind content).
- **Astro `<Image>` HTML width/height beat CSS `aspect-ratio` on the `<img>`.** Put the ratio on a wrapper div. See `docs/PROGRESS-REDESIGN.md` (About page layout redesign).
- **`a:hover` beats a single-class button color** on specificity. Re-assert the color at two-class specificity. See `docs/PROGRESS-REDESIGN.md` (button hover).
- **Contrast math must composite translucent colors**, and a color verified for some variants is not verified for all. See `docs/PROGRESS-REDESIGN.md` (pre-session-6 audit; session 4 Sourcing tile).
- **Keystatic `fields.image` needs `publicPath`** to match its `directory`, or the next build fails. See `docs/PROGRESS-REDESIGN.md` (post-photos Keystatic bug).
- **A comment that claims a verification must be written after the verification.** See `docs/PROGRESS-REDESIGN.md` (session 5 integrity issues).
