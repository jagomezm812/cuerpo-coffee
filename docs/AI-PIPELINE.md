# Cuerpo Coffee — AI Content Pipeline

**Version 1.0 · October 2026.** Save in the repo as `docs/AI-PIPELINE.md`. Claude Code copies the templates in section 4 into `prompts/` (Site Session 4). The rules in `EDITORIAL-POLICY.md` override anything here.

**Rule zero: agents never publish.** Every draft arrives as a pull request from a `draft/` branch; the editor edits it; Jorge approves and merges.

---

## 1. The eight steps

| # | Step | Who | Output | When |
|---|---|---|---|---|
| 1 | Topic scout | Agent | Weekly list of 6–10 topics with search intent, difficulty and the question people actually ask, from Search Console, Reddit and YouTube comments | Weekly |
| 2 | Research | Agent | A research brief: key facts each with a link, current gear specs and price ranges, common mistakes, 3–5 FAQ questions | Per article |
| 3 | Draft | Agent | Markdown article in Jorge's voice (voice profile), within the pillar length, with h2s, internal links and filled frontmatter, saved to `draft/<slug>` | Per article |
| 4 | Fact and SEO check | Second agent pass | A report: claims vs sources, title and meta length, headings, alt text, links, schema fields; fixes applied or flagged | Per article |
| 5 | Edit | Writer-editor | Facts verified, opinion and first-hand detail added, photo added or removed | Per article |
| 6 | Approve | Jorge (~15 min) | Merge of the pull request after reading the preview | Per article |
| 7 | Publish | Automatic | Cloudflare deploys `main` | Per article |
| 8 | Repurpose | Agent | Newsletter section, 5 Pinterest pin texts, a 45-second short script, a Reddit answer draft (posted by a person, only where genuinely helpful) | Per article |

Monthly: an **analytics** pass reports traffic, subscribers, revenue per stream, best and worst articles and cost per article. From month 18: a **translation** pass for articles final for 60 days, with human review.

## 2. How to run it, in stages

| Stage | When | How |
|---|---|---|
| Manual | Month 1 | Run steps 1–4 in a Claude chat with the templates below; paste the draft into Keystatic as a draft article |
| Assisted | Months 2–3 | Claude Code runs steps 2–4 from a topic you give it and opens the `draft/` pull request |
| Scheduled | Month 4+ | A weekly Claude scheduled task runs step 1 and writes the topic list to the Project; drafts for approved topics follow |

Costs in months 1–6 stay inside your current Claude plan; no paid API until it is needed (business plan, section 11).

## 3. File and branch naming

- Branch: `draft/<slug>` (e.g. `draft/why-your-coffee-tastes-bitter`)
- File: `src/content/articles/<slug>.md`, `lang: en`, `aiAssisted: true`, `editor: <name>`
- Research brief and check report: in the pull request description, not in the repo
- Topic lists: the Project document `claude/topics/YYYY-MM-DD.md` (not the repo)

## 4. Templates (copied into `prompts/`)

### voice-profile.md

```text
Write as Jorge Gomez of Cuerpo Coffee.
- Patient, opinionated, precise. A teacher who respects the reader.
- Short sentences for technique; warmer, longer sentences only for opinion.
- One clear fix before a list of options. Change one variable at a time.
- Plain words; explain any term the first time. No hype, no "game-changer",
  no "in today's world", no emoji.
- Use grams and °F with °C in brackets. Default ratio 1:16.
- Include at least one opinion a competitor wouldn't publish, marked [OPINION?]
  for the editor to confirm or replace.
- Never invent personal experiences; write [FIRST-HAND?] where Jorge should add one.
[Add here: phrases and habits from Jorge's 20-minute recording, once transcribed.]
```

### research-brief.md

```text
Topic: <topic>  Pillar: <pillar>  Reader's question: <question>
Produce: 8–15 key facts, each with a source URL you actually opened; current
price ranges and specs for any gear named (with date checked); the 3 most common
mistakes; 3–5 FAQ questions with short answers; 3 Cuerpo articles to link to
(from the sitemap). Mark anything uncertain as UNVERIFIED. Do not write the article.
```

### draft-troubleshooting.md

```text
Using voice-profile.md and the research brief, write a troubleshooting article
of 500–800 words. Structure: what the problem actually means → the one fix that
works first → why not fix everything at once → if that doesn't fix it (two more
causes, in order) → the takeaway. Fill frontmatter: title ≤60, description
120–155, category troubleshooting, tags, faq (from the brief), aiAssisted true.
At least 2 internal links. No claims without a source in the brief.
```

### draft-buying-guide.md

```text
Using voice-profile.md and the research brief, write a buying guide of 800–1,500
words: who this is for and the budget → what matters and what doesn't → 2–4 Pick
blocks (name, price range, one-line verdict, best for, skip if, /go/<slug> link)
→ a Rejected list with one honest line each → how we chose (say plainly what was
used first-hand vs judged from specs). Set affiliate: true. Never state we tested
something unless Jorge confirms it; write [TESTED?] instead.
```

### fact-check.md

```text
You did not write this draft. Check it against the research brief:
1. List every factual claim; mark SUPPORTED (with link), UNSUPPORTED or WRONG.
2. Check title (≤60), description (120–155), one h1, h2 order, ≥2 internal links,
   alt text, affiliate flag and /go/ links, faq present for troubleshooting.
3. Flag generic or filler sentences and any [OPINION?], [FIRST-HAND?] or [TESTED?]
   markers left for the editor.
Return the report and a corrected draft; never remove the markers yourself.
```

### repurpose.md

```text
From the published article: (1) a 120–180-word newsletter section ending in one
question to readers; (2) 5 Pinterest pin titles + descriptions (each ≤100 chars
title); (3) a 45-second short script: hook, the one fix, call to the checklist;
(4) a helpful Reddit answer draft that stands on its own and links only if the
subreddit allows it. Keep Jorge's voice.
```

### product-draft.md

```text
Draft <product> (<printable | short guide | The Cuerpo Method>) from: reader
replies <paste>, published articles <list>, and a new research brief. Output:
outline, full text, tables and checklists, and a 1-page "next step" ending that
invites readers to the newsletter (Etsy) or the next product (site). Mark every
place needing Jorge's tested numbers or photos.
```
