# Cuerpo Coffee — Business Plan

**Version 1.1 · September 2026 · 6-month horizon**
*(Revised: added founder voice, a Reflection content pillar, variable article length by pillar, and a parking lot for future ideas not in scope for months 1–6.)*

---

## 1. Thesis

Cuerpo Coffee is an English-language publication that teaches ordinary people to make genuinely good coffee at home. It monetizes through a paid digital guide within six months, and — if the audience proves real — becomes a product brand after that.

The operating principle: **the blog is not the business, the email list is.** Articles convert strangers into subscribers. The newsletter converts subscribers into people who trust you. Trust converts into sales. Traffic without email capture is a vanity metric.

The sequence matters. Digital product first, physical product later, because a digital launch costs nothing but time and tells you whether people will pay you for coffee knowledge. That answer de-risks every inventory decision that follows.

**What's different in this revision:** Cuerpo isn't only a craft-educator brand anymore — it also carries a founder's voice. Precision and technique stay the backbone (they're what gets someone from a bad cup to a good one), but personal opinion, beginner-friendly plain talk, and reflective writing about coffee as a daily ritual are now a deliberate part of the mix, not an afterthought.

---

## 2. Brand

### The name

*Cuerpo* is "body" in Spanish, and **body** is a coffee tasting term — the weight and texture of the cup on the palate. A Spanish name on an English-language craft brand reads as deliberate rather than generic. Use it.

**Tagline direction:** something that makes the double meaning land immediately.
- "Coffee with body."
- "Learn what body tastes like."
- "Coffee, with weight to it."

Pick one and never change it.

### Positioning

| | |
|---|---|
| **We are** | Patient, opinionated, precise. A teacher who respects you. Also, unmistakably, one person's voice — not an anonymous editorial desk. |
| **We are not** | A gear review farm. A hype account. A café. A "top 10 best beans 2026" listicle site. |
| **Register** | Editorial, not blog-casual. Short sentences for technique. Longer, warmer sentences allowed for reflection and opinion. Strong claims defended either way. |
| **Visual identity** | Restraint. Whitespace, one serif used for page titles only and one sans for everything else, warm neutrals and espresso as the base, olive as a quiet section accent with a small copper spark, large original photography. Luxury on the web is subtraction. |

### What "luxury" actually means here

Not gold accents. It means: nothing on the page that doesn't need to be there, photography that is obviously yours, a page that loads instantly, and prose that assumes the reader is intelligent. Any one of those failing breaks the whole effect. The most common failure mode is stock photography.

### Color palette

Warm neutrals and espresso carry the site. **Olive is the brand's distinctive touch, reserved for sections**: a calm green that marks where you are on a page. Copper stays as a small, warm spark. Every button is neutral and every page background is white, cream or sand.

| Role | Name | Light | Dark |
|---|---|---|---|
| Surface, white band | White | `#FFFFFF` | `#1A120E` |
| Surface, cream band | Cream | `#F5EFE6` | `#231A14` |
| Surface, sand band | Sand | `#E9DFD1` | `#2C2119` |
| Text and buttons | Espresso | `#1B1410` | `#F3EADF` |
| Secondary text | Muted | `#6B5F56` | `#BBAC9D` |
| Section accent | **Olive** | `#59633A` | `#59633A` (text `#A9B47F`) |
| Warm spark | Copper | `#8A4E35` | `#8A4E35` (text `#E3AD84`) |
| Dark blocks | Roast / Near-black | `#2A1D16` / `#120C09` | `#3A2B21` / `#0B0705` |

**How olive is used: sections only.** It appears on the small uppercase section labels ("Start here", "Series", "Newsletter", "Written by") and category names, on section markers (the numbered rings in a series, the leaf ornament and rule that close an article, the pull-quote rule, the reading-progress line), and on the Troubleshooting topic tile and category pills. It is never a button, never a page or band background, never a link, headline or body text, and never a gradient. Olive stays around 4% of a page. If a page starts to feel green, remove some.

**How copper is used.** Small and rare: the Sourcing tile, the italic word in the Home hero, and the "New" badge.

**Color by topic.** Troubleshooting is olive, Fundamentals is sand, Gear is roast, Methods is white with a hairline, Sourcing is copper, and Reflection is near-black.

### Motion and dark mode

Motion is simple and quiet: soft color fades, a small lift on hover, and a gentle rise when a page opens, all switched off for visitors who ask for reduced motion. A round button in the header switches to a full dark theme (it shows a moon in day mode and a sun in dark mode); the site follows the visitor's system setting by default, and Reflection essays open dark unless the visitor chose light.

### The template

The site is built from a fixed set of section types in a fixed rhythm (white, cream and sand bands, then newsletter and a dark footer), with at most two large photo spaces per page. This lets articles and sections be added or removed daily without losing the concept. The rules live in the **Cuerpo Coffee Design System**, and `docs/DESIGN-SYSTEM.md` in the repo is its plain-text copy.

**A note on visual richness.** It's fine to want the site to feel more alive — more personality, more texture, more "interesting" as a reading experience. That's compatible with restraint; it isn't compatible with weight. Get richness from things that cost nothing at load time: confident typography, a considered color story, generous photography, small well-placed detail. Be wary of anything that adds meaningful file size or script for the sake of atmosphere (autoplaying background video is the classic version of this mistake) — it's the exact thing competitors do, and it directly undercuts "loads instantly," which is one of the four load-bearing pillars of the luxury positioning above. If a specific visual idea comes up later, test it against that four-part definition before building it.

**Technical capability, not a redesign.** React and TypeScript are being added to the project as infrastructure, so that future interactive features (the language switcher below, richer UI elements, whatever comes next) can be built without a framework migration later. This does not mean the site becomes a React app — Astro's "islands" architecture means individual components can be interactive while article pages stay static, fast HTML by default. Treat this as capability sitting in reserve, not a signal to start rebuilding pages that already work.

**Language switcher.** English is the default for every visitor. On a visitor's first visit, a quiet, one-time prompt asks for a language preference — not a persistent header toggle, closer to how international sites ask for a region on first arrival. The choice is remembered after that and never asked again. This is a small React island, not a site-wide change.

### The founder, on the About page

The About page should say plainly who's behind this: your name, and why you're qualified to teach this — not credentials for their own sake, but enough of your story that a reader trusts the voice. This is also where the Reflection pillar (below) finds its natural home: readers who like the personal essays will look here first to understand who's writing them.

---

## 3. Audience

Beginner-first, but with a ladder — because beginners graduate, and if there's nothing above them they unsubscribe.

| Rung | Who they are | What they need | Content type |
|---|---|---|---|
| 1 | Bought a bag of "good" beans, coffee tastes bad, doesn't know why | Diagnosis | Troubleshooting |
| 2 | Willing to spend $100–200 to fix it | Buying decisions | Gear guides |
| 3 | Has the gear, results inconsistent | Fundamentals: grind, ratio, water, freshness | Systems |
| 4 | Consistent, now curious | Origin, process, tasting vocabulary | Depth pieces |

The paid guide sits at the transition from rung 2 to rung 3 — the moment someone owns the gear, still gets mediocre results, and realizes there's a method they don't have. That is the point of maximum willingness to pay.

**A fifth, parallel rung isn't about skill at all:** some readers stay subscribed not because they need more technique, but because they like how you think about coffee. That reader is served by the Reflection pillar, not by climbing the ladder further — and they're often the ones most likely to buy the guide anyway, because they trust the voice.

---

## 4. Content strategy

### The 70/30 split

**70% — acquisition content.** Search-driven, beginner, unglamorous. The things people type into Google at 8am holding a bad cup. This is how strangers find you.

**30% — brand content.** Opinion, depth, tasting notes, gear you rejected and why, and now reflection pieces on coffee as ritual. Nobody searches for it. It's what makes someone subscribe, forward it to a friend, and eventually buy from you.

Do not skip the 30% because it doesn't "perform." It's the reason the site reads as a publication rather than an SEO farm, and it's the entire basis of the premium positioning.

### Content pillars

1. **Troubleshooting** — highest intent, most useful, best conversion. Underrated by everyone.
2. **Gear decisions** — "what to buy at $50 / $150 / $400," with real rejections.
3. **Fundamentals** — grind, ratio, water, temperature, freshness. This is the paid guide's territory; the free versions should be genuinely complete but single-topic.
4. **Method walkthroughs** — V60, AeroPress, French press, moka, cold brew.
5. **Sourcing & depth** — how to read a bag label, what "washed" means, origin pieces.
6. **Reflection** *(new)* — coffee as a daily ritual, as meditation, as a lens on ordinary life. Personal, opinionated, first-person. This is where your voice as a person, not just as an instructor, comes through. A Reflection piece can be purely about coffee, purely about life, or both at once — there's no requirement to blend the two in every entry.

### Article length — now varies deliberately by pillar

This is the one place where "more depth" and "keep the cadence" are both true at once: length is a decision per pillar, not a blanket increase.

| Pillar | Target length | Reading time |
|---|---|---|
| Troubleshooting | ~500–800 words | 2–3 min |
| Fundamentals | ~700–1,000 words | 3–4 min |
| Gear | ~800–1,200 words | 4–5 min |
| Methods | ~900–1,300 words | 4–6 min |
| Sourcing & depth | ~1,200–1,800 words | 6–8 min |
| Reflection | ~1,200–2,500 words | 5–10 min |

Troubleshooting stays fast on purpose — someone searching "why is my coffee sour" wants the fix, not an essay. Depth and Reflection pieces are where the longer, more considered reads live. This keeps the one-article-a-week cadence intact without forcing every piece into the same shape.

### Starter backlog (25 articles, plus a Reflection track)

The original 25-article backlog (troubleshooting → fundamentals → gear → methods → depth, in that order) is unchanged — it's still what gets written first, in order, because it's the fastest path to rankings and conversions. See the original numbered list for the full 25.

**Reflection pieces are additive, not a replacement for cadence.** They don't count against the weekly commitment, and they're not scheduled on a fixed cadence — write one when you actually have something to say, not to fill a slot. A first set to draw from when the mood strikes:

- What coffee taught me about paying attention
- The ten minutes before anyone else is awake
- Why I stopped rushing the pour
- Coffee alone vs. coffee with someone — what changes
- On repeating the same small ritual until it means something

If a Reflection piece is ready the same week as a scheduled backlog article, publish both — but never let a Reflection piece replace or delay the week's scheduled troubleshooting/fundamentals/gear/methods/depth article. The 70/30 split holds at the pillar level, not by swapping one for the other.

### Bilingual content (English + Spanish)

The site will eventually carry every article in both English and Spanish, with English as the default and primary language. This is a real scope addition — effectively 50 articles' worth of content over six months instead of 25 — and it's handled deliberately so it doesn't threaten the cadence commitment below, which remains the single highest-severity risk in this plan:

- **English publishes on the unchanged weekly cadence.** Nothing about the translation plan slows down or competes with original writing.
- **Spanish translation runs on a lag**, in batches, after an English article has been live long enough to be considered final (no more edits expected). It is not written the same week as the English original.
- If translation falls behind, **that is acceptable** — a growing backlog of untranslated older articles is a far smaller problem than a missed English publish week. English cadence is never sacrificed to catch up on Spanish.
- The language switcher (see Design, below) defaults every visitor to English; Spanish is an opt-in, not the default experience.

### Cadence

**One article per week from the core 25, plus one newsletter per week.** 25 articles in six months. This is the hardest commitment in this plan and the one most likely to fail. A luxury publication with six articles looks abandoned. If you can't hold the cadence, cut everything else — design, social, product timeline — before you cut publishing.

Write in batches. Draft four articles in one sitting, publish weekly. Never let the queue hit zero.

---

## 5. The funnel

```
Google / social  →  Article  →  Email subscriber  →  Newsletter trust  →  Guide purchase
```

**Email capture is the one design element that must appear on every article.** Inline after the second section, and again at the end. Not a popup — popups break the premium feel and annoy the exact reader you want.

**The offer.** "Subscribe" is weak. Offer something specific in exchange:
> *The Home Coffee Checklist* — a one-page PDF: the five things to fix, in order.

One page, genuinely useful, made in an afternoon. It also seeds the paid guide: people who use the checklist are pre-qualified buyers of the full method.

**Target conversion:** 2–5% of visitors to subscribers. Under 1% means the capture placement or the offer is wrong, not the traffic.

---

## 6. The product

### What it is

**Working title: *The Cuerpo Method*.** A structured system for consistently good coffee at home — not a PDF of your blog posts. The difference between a $9 ebook and a $35 guide is structure: a diagnosis flow, a dialing-in procedure, reference tables, and a decision tree for gear.

**Format:** PDF plus a web version. Optionally a 7-email course as the delivery mechanism — it increases completion and completion drives word of mouth.

**Price: $29–39.** Below $20 you signal "ebook." Above $50 you need video. $34 is a good landing point.

### How to build it without wasting four months

1. **Months 1–3:** publish free content. Do not write the guide.
2. **Month 3:** send one email to your list — a single open question: *"What's the one thing about home coffee you still can't get right?"* Read every reply.
3. **Month 4:** write the guide from their actual words. Their phrasing becomes your headings and your sales page copy.
4. **Month 5:** open a waitlist page. Waitlist size is your go/no-go signal.
5. **Month 6:** launch to the list over four emails.

### Honest revenue expectation

From a cold start, six months realistically gets you 300–800 subscribers. At 2–5% conversion that's **10–40 sales, roughly $300–1,200.**

That is not income. It is validation — and validation is the actual deliverable of year one. Anyone promising you more than this in six months from zero is selling something.

---

## 7. Distribution

Ranked by effort-to-return for this specific project:

1. **SEO** — slow but compounding, and troubleshooting queries are winnable by a small site with genuinely better answers. Months 4+ is when it starts working.
2. **Reddit** — r/coffee, r/pourover and similar. Participate as a person for months before you ever link. One good comment reply outperforms ten posts.
3. **Instagram** — your photography is the asset; treat IG as a portfolio that drives to the site, not as the home. You don't own it.
4. **Newsletter cross-promotion** — once you're past ~500 subscribers, swap recommendations with other small coffee newsletters.
5. **Pinterest** — genuinely effective for home/food content and almost nobody in coffee uses it well.

---

## 8. Community

The newsletter is the community for now. **Do not open a Discord or WhatsApp group until roughly 500 engaged subscribers.** An empty chat room actively damages a premium brand — it advertises that nobody is there.

What to do instead: end newsletters with a real question and reply personally to everyone who answers. At this scale, personal replies *are* the community, and they're also your product research.

Skip blog comments entirely at launch. Spam, moderation burden, and an empty comment section under every post.

---

## 9. Metrics

Track four numbers. Ignore everything else.

| Metric | Month 3 | Month 6 |
|---|---|---|
| Published articles | 10 | 25 |
| Email subscribers | 100 | 400 |
| Visitor → subscriber rate | 2% | 3%+ |
| Newsletter open rate | 40%+ | 40%+ |

Pageviews are not on this list on purpose. They fluctuate, they flatter, and they don't predict revenue.

---

## 10. Costs

| Item | Cost |
|---|---|
| Domain (Porkbun, DNS via Cloudflare) | ~$11/year |
| Hosting (Cloudflare Workers/Pages) | $0 |
| Email (Kit, free plan — no automations, redirect-based lead magnet delivery) | $0 |
| Analytics (Cloudflare Web Analytics) | $0 |
| Payments (Lemon Squeezy, month 5+) | 5% + $0.50 per sale, no monthly fee |
| **Running total** | **≈ $1/month** |

Your stated budget is $10–30/month, so you have real headroom. Best places to spend it, in order: a font license if you want something beyond Google Fonts, props and lighting for photography, and — only if you outgrow free — Plausible analytics at around $9/month.

Do not spend it on: a logo designer (yet), paid ads (yet), stock photos (ever), or a premium theme (you're building custom).

---

## 11. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Cadence collapse** — you publish 6 articles and stop | Fatal | Batch-write. Maintain a 4-article queue at all times. This is the only risk that reliably kills projects like this. |
| **Rebuilding instead of writing** | High | The site is frozen after Phase 2/3. Design changes are batched into one session per quarter. Infrastructure work (already done: hosting, Keystatic, email, analytics) should not resume once content mode starts. |
| **Generic content** | High | Every article must contain at least one opinion a competitor wouldn't publish. |
| **Stock photography** | High | Shoot your own or use nothing. A clean typographic header beats a stock latte. |
| **Length creep diluting cadence** | High *(new)* | Length varies by pillar, not by mood. Troubleshooting/fundamentals stay short even when a Reflection piece that week is long. |
| **Reflection pillar drifting the brand off-course** | Medium *(new)* | Reflection pieces are additive and clearly distinct from technique content — never blended into a troubleshooting or fundamentals article. A searcher fixing sour coffee should never accidentally land in a meditation on ritual. |
| **Bilingual translation debt piling up** | Medium *(new)* | Spanish translation runs on a deliberate lag behind English and is allowed to fall behind without consequence. English cadence is never sacrificed to catch up on Spanish — a translation backlog is an acceptable, recoverable state; a missed English week is not. |
| **Launching the guide to 80 subscribers** | Medium | The waitlist is the gate. Under 200 subscribers, delay the launch and keep writing. |
| **Chasing ecommerce too early** | Medium | No inventory until the digital product has sold consistently for two quarters. |

---

## 12. Six-month timeline

| Month | Build | Content | Business |
|---|---|---|---|
| **1** | Site live, 3 articles published | Write 6 | Kit set up, lead magnet live |
| **2** | Admin panel, analytics, frozen | Publish 4 | First newsletters, find your voice |
| **3** | — | Publish 4 (10 total) | Ask the list what they're stuck on |
| **4** | — | Publish 4 | Write the guide |
| **5** | Product + waitlist page | Publish 4 | Waitlist opens, finish the guide |
| **6** | Checkout live | Publish 4 (25 total) | Launch sequence, first sales |

---

## 13. After month six

Three viable paths, in order of risk:

1. **Deepen the digital line.** A second guide, or a paid tier of the newsletter. Zero marginal cost, and it compounds the same list.
2. **Curated gear.** Affiliate first to test demand at no risk, then private-label the one or two items that actually sell.
3. **Coffee.** Partner with a local roaster before you ever roast yourself. Inventory, freshness windows, and shipping are a fundamentally different business with real downside — and the only honest reason to enter it is that your audience is already asking you to.

The gate for all three is the same: the list bought once, and would buy again.

---

## 14. Parking lot — ideas not in scope for months 1–6

Ideas worth remembering, explicitly **not** planned, budgeted, or timelined. Nothing here should influence what gets built in the current phase; revisit only after month 6, and only if the core business (list + guide) has already validated itself.

**Blockchain / DeFi.** No connection to the current thesis or audience, and genuinely risky to brand focus if pursued early — the whole plan's discipline is "no scope creep before 25 articles." Speculative directions, unvetted, not a recommendation:
- A founding-member NFT as a symbolic badge for early guide buyers — closer to a digital collectible than a financial instrument.
- On-chain provenance data, if a roaster partnership (path 3, above) ever happens — a public record of origin/harvest, years out.
- A token-gated version of the reader community, as a later alternative to the Discord/WhatsApp group already being deliberately delayed.

None of this is financial advice, and none of it should be built, priced, or promised before the core business has proven itself.
