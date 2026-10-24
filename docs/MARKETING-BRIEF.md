# Cuerpo Coffee — SEO & Marketing Brief

**Purpose:** hand-off for the SEO and marketing chat. Read `00-START-HERE.md` first, then `CUERPO-BUSINESS-PLAN.md` (v2.0, the strategy source of truth). Updated November 2026 for the $10k goal.

## 1. Where things stand (checked 2026-10-23)

- **Site is live** at cuerpo.coffee: Astro static site on a Cloudflare Worker with static assets, redesigned (tag `v1.1-redesign`), light/dark mode, Pagefind search, English default with `/es/` routes (only the sour-coffee article is translated).
- **Articles live: 3** — Why Your Coffee Tastes Sour (troubleshooting), The Only Coffee Ratio You Need (fundamentals), A Simple Pour-Over Method for Beginners (methods). Newest is dated January 26, 2026, so "Latest" looks stale. A bitter-coffee article is drafted (meta description needs trimming to ≤155 characters).
- **Publishing:** Keystatic at `/keystatic` commits to GitHub `main`; Cloudflare redeploys. Writer access through draft branches and pull requests is planned (Site Session 4).
- **Email:** Kit free plan, 0–10 subscribers, no lead magnet, no welcome email. Moving to **beehiiv** (free Launch plan now, Scale at $49/month when the guide waitlist opens) in Site Session 5.
- **Analytics:** Cloudflare Web Analytics. **Google Search Console not set up.** Sitemap loads at `/sitemap-index.xml` but lists empty category, thin tag and empty `/es/` pages (fixed in Site Session 1). robots.txt blocks `/keystatic` and points to the sitemap.
- **Photos:** home and sour-coffee heroes are temporary stock; the About portrait is original.
- **Author:** Jorge Gomez — coffee since 14, coffee trees on his father's land, first kilo roasted at 15, home espresso bar as a morning ritual.
- **Products:** none yet. First printable planned for month 2 (December 2026).

## 2. The business model in one line

Google / YouTube / Pinterest / Etsy → article or video → email subscriber → newsletter trust → printables, The Cuerpo Method ($34/$59), short guides, Cuerpo Reserve membership ($6/month), affiliate gear and sponsorships; physical products through partners in year 2. **Goal: $10,000/month by month 30 (April 2029).** First milestone: **first $100 by month 3**.

## 3. Hard constraints (do not recommend against these)

- Spending: ~$1–60/month in months 1–3, ~$60–130 in months 4–6, up to $500 from month 12, and never more than 30% of the previous month's revenue. No paid ads yet. No stock photos long-term.
- Cadence: 1 article/week in months 1–2, 2/week in month 3, 3/week in months 4–12, plus 1 newsletter a week. Cadence is the top risk.
- AI drafts acquisition articles; the writer edits; Jorge approves every piece. Reflection is always human-written. Follow `EDITORIAL-POLICY.md`.
- 70% acquisition, 30% brand content.
- No blog comments, no popups (inline capture only), no Discord/WhatsApp until ~500 engaged subscribers, no own inventory ever; physical products only through partners from year 2.
- Site changes follow the update protocol (branch, preview, owner approval, merge, changelog) and the planned sessions in the Site & Docs Update Plan.
- Blockchain/DeFi parked.
- The owner is not a professional coder: plain language, step by step, ready-to-paste Claude Code prompts.

## 4. Targets

| Metric | Month 3 | Month 6 | Month 12 | Month 30 |
|---|---|---|---|---|
| Published articles | 15 | 60 | 150 | 300 |
| Email subscribers | 150 | 600 | 2,500 | 15,000 |
| Monthly site visits | — | 8,000 | 25,000 | 100,000 |
| YouTube subscribers | — | 1,000 | 5,000 | 25,000 |
| Visitor → subscriber | 2% | 3%+ | 3%+ | 3%+ |
| Newsletter open rate | 40%+ | 40%+ | 40%+ | 40%+ |
| Revenue per month | first $100 | ~$300 | ~$1,500 | ~$10,000 |

Guide launch: March–April 2027. Gate: ~200 subscribers / ~150 on the waitlist.

## 5. Distribution priority

1. **SEO** — troubleshooting and buying-guide queries are the winnable ones.
2. **YouTube** — one long video every 2 weeks plus 3 shorts a week; every description links to the checklist.
3. **Email referrals and cross-promotion** — beehiiv referral program; newsletter swaps after ~500 subscribers.
4. **Pinterest** — pins produced by the repurposing agent; Pinterest's own scheduler.
5. **Reddit** — r/coffee, r/pourover: participate as a person for months before linking.
6. **Instagram** — automatic home for shorts.
7. **Etsy** — printables and short guides; each PDF invites buyers to the newsletter.

## 6. Open items the SEO/marketing chat should drive

1. Google Search Console: verify via Cloudflare DNS, submit the sitemap, check indexing (week 1–2).
2. Keyword and topic map: the original 25 first (sour → bitter → grind → ratio → water), then a 150-topic map refilled weekly by the topic agent; add buying-guide topics ("best grinder under $100").
3. On-page template per article: title ≤60, meta 120–155, H2 structure, ≥2 internal links, FAQ schema on troubleshooting, Product/Review schema on buying guides, alt text. Site Session 1 adds the automatic checks.
4. Email: Home Coffee Checklist, inline placement (fixed in Session 2), 5-email welcome sequence and referral reward in beehiiv.
5. A 90-day plan: Search Console → 15 articles → first printable on site and Etsy → first $100 → 150 subscribers.
6. YouTube, Pinterest, Reddit and Etsy playbooks for a one-person brand with AI help.
7. Affiliate setup: Amazon Associates plus two roaster programs; disclosure on every affiliate page.
8. Sponsorships: house ads in the newsletter sponsor slot until real sponsors arrive (~10,000 YouTube subscribers or ~2,500 email subscribers).
9. Bilingual SEO: hreflang only on translated pages now; Spanish edition from month 18.
10. A weekly marketing routine inside the 6-hour week (see the business plan, section 14).

## 7. How to work with the owner

- Ask for current numbers (articles, subscribers, Search Console data, sales) before giving targets.
- Give Claude Code prompts as copy-ready blocks; other steps as short numbered lists.
- Be honest about timelines: SEO usually shows results at months 4+; revenue lags audience by 6–9 months.
