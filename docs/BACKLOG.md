# Backlog: ideas waiting

Ideas that are not part of today's task go here, not into the code. Design ideas are batched: pick the next batch about once a month.

| Idea | Type (content, design, feature) | Added | Batch on |
|---|---|---|---|
| Give the language switcher (`?setlang=en\|es`) its own dedicated path, e.g. `/set-language`, so `wrangler.jsonc`'s `assets.run_worker_first` no longer needs to be `true` for every single request — it could go back to a narrow path list. Currently every request pays for a Worker invocation instead of a direct static-asset hit, because the switcher link can point at any page on the site. | feature (performance/infra) | 2026-09-28 | |
| **Replace two temporary stock photos with the owner's own photography.** `src/assets/home/home-hero.jpg` (the Home hero) and `src/content/articles/images/why-your-coffee-tastes-sour/heroImage.jpg` (that article's hero) are both licensed Adobe Stock images, used only because real photography wasn't ready yet. This directly trips the business plan's own named risk (`docs/BUSINESS-PLAN.md`: "The most common failure mode is stock photography" / "Stock photography — High — Shoot your own or use nothing. A clean typographic header beats a stock latte.") and `docs/DESIGN-SYSTEM.md`'s own invariant ("Photography is original, never stock."). Not a violation that was missed — a conscious, temporary exception, flagged here specifically so it doesn't quietly become permanent. Replace both with real photos (or, per the business plan's own fallback, drop back to the typographic placeholder) before this is treated as finished. | content (photography) | 2026-09-30 | |
| | | | |
