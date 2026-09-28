# Backlog: ideas waiting

Ideas that are not part of today's task go here, not into the code. Design ideas are batched: pick the next batch about once a month.

| Idea | Type (content, design, feature) | Added | Batch on |
|---|---|---|---|
| Give the language switcher (`?setlang=en\|es`) its own dedicated path, e.g. `/set-language`, so `wrangler.jsonc`'s `assets.run_worker_first` no longer needs to be `true` for every single request — it could go back to a narrow path list. Currently every request pays for a Worker invocation instead of a direct static-asset hit, because the switcher link can point at any page on the site. | feature (performance/infra) | 2026-09-28 | |
| | | | |
