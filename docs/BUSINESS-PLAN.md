# Cuerpo Coffee — Business Plan

**Version 2.0 · October 2026 · 36-month horizon · Goal: $10,000/month by month 30 (April 2029)**
*(v2.0 replaces the 6-month plan with the $10k plan approved on 2026-10-23: a content engine feeding six income streams, digital products first, AI-drafted articles edited by people, YouTube as the second channel, and physical products deferred to year 2. Charts and the original analysis live in the claude.ai "$10k/Month Plan" document; this file is its plain-text copy for Claude Code. Brand, Reflection, the 70/30 split and the parking lot are unchanged.)*

Month 1 = November 2026. Month 30 = April 2029.

---

## 1. Thesis

Cuerpo Coffee is an English-language publication that teaches ordinary people to make genuinely good coffee at home. It earns money through **six income streams fed by one AI-assisted content engine**: digital products, a paid membership, affiliate gear, sponsorships, YouTube ads and, from year 2, physical products sold through partners.

The operating principle is unchanged: **the blog is not the business, the email list is.** Articles and videos convert strangers into subscribers. The newsletter converts subscribers into people who trust you. Trust converts into sales. Traffic without email capture is a vanity metric.

**Digital first, physical later.** A digital product keeps about 90% of each sale (a $34 guide keeps ~$31.80 after Lemon Squeezy's 5% + $0.50), costs nothing to stock, and Lemon Squeezy handles worldwide sales tax as merchant of record. Physical products keep about a third of the price and add shipping, freshness and quality risk, so they wait until digital sales are proven.

**The founder's voice stays.** Precision and technique are the backbone; personal opinion, plain talk and reflective writing about coffee as a daily ritual are a deliberate part of the mix. AI drafts and researches; people edit; Jorge approves everything that publishes.

**Honest range.** The base case reaches $10k/month at month 30. At half the growth pace, month 30 is nearer $5,000/month and $10k slips to month 36 or later. Every step is designed to pay for the next one either way.

---

## 2. Brand

### The name

*Cuerpo* is "body" in Spanish, and **body** is a coffee tasting term — the weight and texture of the cup on the palate. A Spanish name on an English-language craft brand reads as deliberate rather than generic. Tagline in use: **"Coffee with body."** Never change it.

### Positioning

| | |
|---|---|
| **We are** | Patient, opinionated, precise. A teacher who respects you. Unmistakably one person's voice — not an anonymous editorial desk, even when AI helps with research and drafts. |
| **We are not** | A gear review farm. A hype account. A café. A "top 10 best beans 2026" listicle site. A mass-produced AI content site. |
| **Register** | Editorial, not blog-casual. Short sentences for technique. Longer, warmer sentences for reflection and opinion. Strong claims defended either way. |
| **Visual identity** | Restraint. Whitespace, one serif for page titles only and one sans for everything else, warm neutrals and espresso as the base, olive as a quiet section accent with a small copper spark, large original photography. Luxury on the web is subtraction. |

### What "luxury" actually means here

Not gold accents. It means: nothing on the page that doesn't need to be there, photography that is obviously yours, a page that loads instantly, and prose that assumes the reader is intelligent. Any one of those failing breaks the whole effect. The most common failure mode is stock photography. Products (PDFs, printables, merch) follow the same look.

### Color, motion, template

The palette, motion, dark mode and page template are defined in the **Cuerpo Coffee Design System** (`docs/DESIGN-SYSTEM.md` in the repo). In short: warm neutrals and espresso carry the site; olive marks sections only (about 4% of a page, never a button or background); copper is a small spark; every button is neutral; at most two photo spaces per page; motion is CSS only and respects reduced motion; a header toggle switches to a full dark theme, and Reflection essays open dark.

**Visual richness without weight.** Get richness from things that cost nothing at load time: confident typography, a considered color story, generous photography, small well-placed detail. No autoplaying background video, no heavy scripts for atmosphere — "loads instantly" is one of the four pillars of the luxury positioning. New components (buying-guide blocks, click-to-play video, the ratio calculator) follow the same rule.

**Technical capability, not a redesign.** The site is static Astro HTML with small interactive islands only where needed. The first-visit language prompt is being replaced with a tiny script to protect the 20 KB JavaScript budget.

**Language.** English is the default for every visitor. A one-time first-visit prompt asks for a language preference and remembers it. Spanish links appear only on pages that have a Spanish version.

### The founder, on the About page

The About page says plainly who's behind this — Jorge Gomez, coffee since 14, coffee trees on his father's land, first kilo roasted at 15, a home espresso bar as a morning ritual — and links to the editorial policy that explains how AI is used. It also carries the newsletter offer, because it converts more subscribers per visit than any other page.

---

## 3. Audience

Beginner-first, with a ladder — because beginners graduate, and if there's nothing above them they unsubscribe.

| Rung | Who they are | What they need | Content type | Product that fits |
|---|---|---|---|---|
| 1 | Bought "good" beans, coffee tastes bad, doesn't know why | Diagnosis | Troubleshooting | Free checklist |
| 2 | Willing to spend $100–200 to fix it | Buying decisions | Gear guides (affiliate) | $7–12 printables |
| 3 | Has the gear, results inconsistent | Fundamentals: grind, ratio, water, freshness | Systems | The Cuerpo Method ($34/$59) |
| 4 | Consistent, now curious | Origin, process, tasting vocabulary | Depth pieces | Short guides ($12–19) |

The Cuerpo Method sits at the transition from rung 2 to rung 3 — the moment someone owns the gear, still gets mediocre results, and realizes there's a method they don't have.

**A fifth, parallel rung isn't about skill:** readers who stay because they like how you think about coffee. They are served by the Reflection pillar and by **Cuerpo Reserve**, the paid membership, and they are often the most likely to buy anything you make.

---

## 4. Content strategy

### The 70/30 split (unchanged)

**70% — acquisition content.** Search-driven, beginner, unglamorous: troubleshooting, fundamentals, methods, and now buying guides. This is how strangers find you.

**30% — brand content.** Opinion, depth, tasting notes, gear you rejected and why, and Reflection pieces. Nobody searches for it. It's what makes someone subscribe, forward it, and buy. It is always written by a person.

### Content pillars

1. **Troubleshooting** — highest intent, best conversion.
2. **Gear decisions** — "what to buy at $50 / $150 / $400," with real rejections. Now includes buying guides with affiliate links and honest rejections.
3. **Fundamentals** — grind, ratio, water, temperature, freshness. The Cuerpo Method's territory; free versions are complete but single-topic.
4. **Method walkthroughs** — V60, AeroPress, French press, moka, cold brew.
5. **Sourcing & depth** — bag labels, process, origin pieces.
6. **Reflection** — coffee as daily ritual, meditation, a lens on ordinary life. First-person, human-written, never AI-drafted.

### How articles are made

AI agents research and draft acquisition articles; the writer edits them (facts, opinion, photo); Jorge approves each one in a Keystatic pull request. Agents never publish. The 8-step pipeline is in `AI-PIPELINE.md`, and the public promise to readers is in `EDITORIAL-POLICY.md`. Every article keeps at least one real opinion and one original photo or none.

### Article length by pillar (unchanged)

| Pillar | Target length | Reading time |
|---|---|---|
| Troubleshooting | ~500–800 words | 2–3 min |
| Fundamentals | ~700–1,000 words | 3–4 min |
| Gear and buying guides | ~800–1,500 words | 4–6 min |
| Methods | ~900–1,300 words | 4–6 min |
| Sourcing & depth | ~1,200–1,800 words | 6–8 min |
| Reflection | ~1,200–2,500 words | 5–10 min |

### Cadence (ramped)

| Period | Articles per week | Newsletter |
|---|---|---|
| Months 1–2 (site setup and audit) | 1 | Weekly |
| Month 3 | 2 | Weekly |
| Months 4–12 | 3 (2 AI-drafted acquisition, 1 human brand piece) | Weekly |
| Month 13+ | 2 new plus refreshes of older articles | Weekly |

Targets: ~60 articles by month 6, ~150 by month 12, ~250 by month 24, ~300 by month 30. Keep a queue of 6 drafts at all times. If a week slips, publish from the queue; never skip. Cadence remains the top risk in this plan.

**Reflection pieces stay additive.** They don't count against the weekly commitment and are written when there is something to say.

### Topic backlog

The original 25-article order (troubleshooting → fundamentals → gear → methods → depth) still goes first. After that, a topic agent refills a 150-topic map weekly from Search Console queries, Reddit and YouTube questions. Next up: bitter coffee, grind size, water.

### Video

Every acquisition article can yield a YouTube outline and a short. One long video every 2 weeks (8–12 minutes: a 30-second talking intro from Jorge, then hands-and-voice brewing shot overhead) plus 3 shorts a week cut from it. Recording is batched into one 2-hour session every 2 weeks.

### Bilingual content

English first. The Spanish site edition and Spanish products start no earlier than month 18, translated in batches by an agent with human review, only for articles final for 60 days. A translation backlog is acceptable; a missed English week is not.

---

## 5. The funnel

```
Google / YouTube / Pinterest / Etsy  →  Article or video  →  Email subscriber  →  Newsletter trust  →  Products and membership
```

**Email capture appears on every article**, inline after the second section's text and again at the end, plus on About. Never a popup.

**The offer:** *The Home Coffee Checklist* — a one-page PDF: the five things to fix, in order. It also seeds the product ladder.

**Welcome sequence (5 emails):** the checklist, Jorge's story, the best 3 articles, the method, and a question. Requires an email platform with automations (beehiiv; see section 10).

**Referrals:** "share Cuerpo, get the espresso cheat sheet."

**Target conversion:** 2–5% of visitors to subscribers. Under 1% means the placement or offer is wrong, not the traffic.

---

## 6. Products — digital first

### Digital vs physical

| | Digital | Physical |
|---|---|---|
| Kept per sale | ~$31.80 of a $34 guide | ~1/3 of retail (print-on-demand); ~$10 a bag (roaster) |
| Upfront cost | $0 | $0 with partners; ~$50–100 in samples |
| Tax | Lemon Squeezy is merchant of record | Partner's store handles it |
| Time after launch | Near zero | Customer service, quality checks |
| Risk | Low | Medium |

### The digital catalog

| Product | Price | Sold on | Launch |
|---|---|---|---|
| Dial-in Log and Recipe Cards (printable) | $7–9 | Site + Etsy | Month 2 (Dec 2026) |
| Coffee Tasting Journal (printable + Sheets/Notion template) | $9–12 | Site + Etsy | Month 3 |
| The Cuerpo Method — Guide | $34 | Site | Months 5–6 (Mar–Apr 2027) |
| The Cuerpo Method — Complete (guide + all printables + yearly updates) | $59 | Site | Months 5–6 |
| Short guides (Espresso at Home, Water for Coffee, Buying Beans…) | $12–19 each | Site + Etsy | One every ~2 months from month 7 |
| Bundles and holiday gift edition | $39–49 | Site | Month 10, each Q4 |
| Cuerpo Reserve membership | $6/month or $60/year | beehiiv | Month 9 |

No video course.

### The Cuerpo Method

A structured system for consistently good coffee at home — a diagnosis flow, a dialing-in procedure, reference tables, and a decision tree for gear. PDF plus a web version. Built the original way, now faster with AI:

1. **Month 3:** ask the list one question: *"What's the one thing about home coffee you still can't get right?"* Read every reply.
2. **Month 4:** an agent drafts the guide from their words and your published articles; you add opinions, tested numbers and photos.
3. **Month 4–5:** open the waitlist. Gate: about 200 subscribers / 150 on the waitlist; under that, delay and keep writing.
4. **Months 5–6:** launch over four emails.

### The product ladder

Free checklist → $7–12 printable → $34/$59 Cuerpo Method → $12–19 short guides → $6/month Cuerpo Reserve → (year 2) coffee subscription and merch. Each step is offered in the welcome emails and at the end of matching articles.

### Where to sell

- **Own site:** Lemon Squeezy hosted checkout (5% + $0.50, no monthly fee), a /shop page, a member discount.
- **Etsy:** printables and short guides only (about 6.5% per sale plus a small listing fee), for marketplace buyers while the audience is small. Every PDF ends with an invitation to the newsletter.
- **Not Gumroad:** 10% fee.

### First product launch (month 2)

Week 1 make the pack; week 2 open the Lemon Squeezy store and an Etsy shop with 3 listings; week 3 link it from the ratio and pour-over articles and the welcome email; week 4 adjust title, price and mockups. Goal: **first $100 by month 3** (about 13 sales).

### Physical products (year 2)

- **Partner-roaster subscription** ("Cuerpo Selection") from month 13: a pilot with ~20 subscribers; the roaster roasts, ships and charges tax. Target ~90 subscribers by month 30.
- **Print-on-demand merch** from month 15: 3–5 restrained items (mug, tote, brew-ratio poster) through a print-on-demand partner.
- **Gate:** digital sales above $1,500/month for two months in a row. You never hold stock.

---

## 7. Revenue model — the $10k mix (month 30)

| Stream | Volume needed | Monthly |
|---|---|---|
| Digital products (printables, guides, bundles) | ~190 sales at ~$18 average | $3,500 |
| Membership (Cuerpo Reserve) | ~250 members | $1,500 |
| Affiliate gear and beans | ~300 orders at ~$5 commission | $1,500 |
| Sponsorships (newsletter + YouTube) | ~4 slots + 1 video a month | $1,500 |
| Physical products (year 2) | ~90 roaster subscribers + ~20 merch orders | $1,100 |
| YouTube ads | ~350,000 views a month | $900 |
| **Total** | | **$10,000** |

**Audience needed:**

| Month (date) | Articles live | Email subscribers | Monthly visits | YouTube subscribers |
|---|---|---|---|---|
| 6 (Apr 2027) | ~60 | 600 | 8,000 | 1,000 |
| 12 (Oct 2027) | ~150 | 2,500 | 25,000 | 5,000 |
| 18 (Apr 2028) | ~200 | 5,500 | 45,000 | 10,000 |
| 24 (Oct 2028) | ~250 | 9,000 | 70,000 | 17,000 |
| 30 (Apr 2029) | ~300 | 15,000 | 100,000 | 25,000 |

Projected monthly revenue (base case): month 6 ~$300, month 12 ~$1,500, month 18 ~$3,500, month 24 ~$6,000, month 30 ~$10,000.

---

## 8. Distribution

Ranked by effort-to-return:

1. **SEO** — troubleshooting and buying-guide queries; results from months 4–12.
2. **YouTube** — the second engine; grows while Google is slow.
3. **Email referrals and cross-promotion** — referral program from launch; newsletter swaps after ~500 subscribers.
4. **Pinterest** — pins made by the repurposing agent, scheduled with Pinterest's own tool.
5. **Reddit** — r/coffee, r/pourover: participate as a person for months before linking.
6. **Instagram** — automatic home for YouTube shorts and photography; not the home base.
7. **Etsy** — a product channel that also feeds the list.

Search engines increasingly answer simple how-to questions themselves, so the plan owns the email list, builds YouTube, writes first-hand opinion and testing, and leans on buying guides.

---

## 9. Community

The newsletter is the community. **No Discord or WhatsApp group until roughly 500 engaged subscribers.** End newsletters with a real question and reply personally; those replies are also product research. No blog comments.

---

## 10. Metrics

| Metric | Month 3 | Month 6 | Month 12 | Month 30 |
|---|---|---|---|---|
| Published articles | 15 | 60 | 150 | 300 |
| Email subscribers | 150 | 600 | 2,500 | 15,000 |
| Visitor → subscriber rate | 2% | 3%+ | 3%+ | 3%+ |
| Newsletter open rate | 40%+ | 40%+ | 40%+ | 40%+ |
| Revenue per month | First $100 | ~$300 | ~$1,500 | ~$10,000 |
| Revenue per subscriber per month | — | — | ~$0.60 | ~$0.65 |
| YouTube views per month | — | ~10,000 | ~60,000 | ~350,000 |

Also tracked monthly by the analytics agent: revenue per stream, best and worst articles, cost per article. Pageviews alone are not a goal.

---

## 11. Costs

| Item | Months 1–3 | Months 4–6 | Month 12+ |
|---|---|---|---|
| Email: beehiiv | $0 (Launch plan) | $49 (Scale) once the guide waitlist opens | $49 |
| AI agents | $0 (current Claude plan, scheduled tasks) | $0–20 | $40–60 |
| Writer-editor | $0–60 (2 trial pieces max) | ~$60 | ~$360 |
| Video editing | $0 | $0 | ~$120 |
| Pins, shorts tools | $0 | $0 | ~$30 |
| Domain, hosting, analytics | ~$1 | ~$1 | ~$1 |
| Payments | Lemon Squeezy 5% + $0.50 per sale; Etsy ~6.5% + listing fee | | |
| **Total per month** | **~$1–60** | **~$60–130** | **~$600** |

First six months: about $200–550 in total. From month 12, spend at most 30% of the previous month's revenue, so anything above $500 is paid by the business. Do not spend on paid ads, stock photos, a logo designer or a premium theme.

---

## 12. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Cadence collapse** | Fatal | 6-draft queue; the AI pipeline keeps it full. |
| **Rebuilding instead of writing** | High | Site work happens only through the planned sessions in the Site & Docs Update Plan; new ideas go to the backlog. |
| **AI drafts read generic or get facts wrong** | High | Separate fact-check agent, paid editor, one-opinion rule, Jorge's approval; monthly spot-check of 3 old pieces. |
| **Search sends fewer clicks** | High | YouTube, email referrals, buying guides, Etsy. |
| **Stock photography** | High | Shoot your own or use nothing. |
| **Length creep** | High | Length varies by pillar, not by mood. |
| **Reflection drifting the brand** | Medium | Reflection is separate from technique content and always human-written. |
| **Spending ahead of revenue** | Medium | Phase gates and the 30% rule. |
| **Physical products too early** | Medium | Gate: digital above $1,500/month for two months. No own stock, ever. |
| **Partner quality or shipping problems** | Medium | Small pilot, quality terms in writing, taste every batch, sell through the partner's store. |
| **Burnout on camera** | Medium | Batch recording, AI-cut shorts, freelance editor from month 6. |
| **Compliance** | Medium | Affiliate disclosure, privacy page, Lemon Squeezy as merchant of record; an accountant once revenue passes ~$1k/month. |
| **Translation debt** | Low | Spanish lags by design; never at English's expense. |

---

## 13. Roadmap — five phases with gates

| Phase | Dates | Main work | Gate to move on |
|---|---|---|---|
| 1 Foundation | Nov 2026 – Jan 2027 | Docs updated, site audit and fixes, Search Console, beehiiv, AI pipeline v1, first printable, cadence ramp, YouTube starts | 30 articles, 150 subscribers |
| 2 First sales | Feb – Jul 2027 | Cuerpo Method launch (Mar–Apr), buying guides, Pinterest and shorts, ratio calculator | $1k/month, 1,500 subscribers |
| 3 Products | Aug 2027 – Jan 2028 | Cuerpo Reserve, short guides, roaster pilot, holiday gift edition, video editor | $3k/month, 5,000 subscribers |
| 4 Scale | Feb 2028 – Jan 2029 | Roaster scaled, merch on demand, sponsor packages, Spanish edition, YouTube ads | $7k/month, 10,000 subscribers |
| 5 Goal | Feb – Oct 2029 | Price rises, licensing test, mix tuned to $10k, plan year 4 | $10k/month by April 2029 |

If a gate is missed, stay in the phase another quarter, fix the weakest stream, and keep the budget where it is.

---

## 14. Team and time

- **Jorge (4–8 h/week):** approve articles (1 h), write the brand piece or Reflection (1.5 h), record video (1 h), newsletter and replies (1 h), topic list and metrics (0.5 h), community and partner emails (0.5 h).
- **Writer-editor:** edits AI drafts, adds photos and opinion; paid per piece (~$25–40), starting with a 2-piece trial.
- **Freelance video editor:** from month 6.
- **Virtual assistant:** from month 12 (Pinterest, inbox, sponsor admin).
- **Partners:** roaster from month 13; print-on-demand from month 15.

---

## 15. Parking lot — ideas not in scope

Not planned, budgeted or timelined. Revisit only after the core business is validated.

- **AI content service for roasters** — selling the agent pipeline as a service; a second job, skip for now.
- **Display ads** — break speed and the luxury look.
- **Video course** — declined for now.
- **Blockchain / DeFi** (unchanged): a founding-member NFT badge, on-chain provenance if a roaster partnership happens, a token-gated community. Speculative, not a recommendation, not financial advice, and none of it is built or promised before the core business has proven itself.
