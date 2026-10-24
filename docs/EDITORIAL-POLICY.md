# Cuerpo Coffee — Editorial Policy

**Version 1.0 · October 2026.** Save in the repo as `docs/EDITORIAL-POLICY.md`. Sections 1–4 are the public text for `/editorial-policy`; section 5 is the `/disclosure` text; section 6 is the `/privacy` text; section 7 is the internal checklist for every pull request. Text in [brackets] is filled in before publishing.

---

## 1. Who writes Cuerpo Coffee

Cuerpo Coffee is written and edited by Jorge Gomez, with help from an editor and from AI tools. Jorge has made coffee every day since he was fourteen, processed his first batch from his father's trees at fifteen, and roasted his first kilo the same year. Every article that goes live has been read and approved by him.

## 2. How articles are made

- **Research and first drafts** for practical articles (troubleshooting, fundamentals, methods, buying guides) are often prepared with AI tools. Every fact in a draft carries a source link.
- **An editor checks every draft** against its sources, removes anything that can't be backed up, adds first-hand detail and opinion, and adds our own photo or none.
- **Jorge approves every article** before it is published. Nothing is published automatically.
- **Reflection essays and opinion pieces are written by Jorge himself**, without AI drafting.
- We don't publish an article just to fill a slot. If it doesn't help someone make a better cup, it doesn't go live.

## 3. How we test and recommend gear

- We say what we've used ourselves and what we're judging from specs and other people's testing, and we never present the second as the first.
- Every buying guide lists what we didn't pick and why.
- Brands can't pay to be included or to change a verdict. Sponsored content, if we ever run it, is labeled "Sponsored" at the top.
- Prices change; we show price ranges and date our updates.

## 4. Corrections

If something we published is wrong, we fix it, add an "Updated" date, and note what changed at the end of the article when the change matters. Tell us at [contact email].

---

## 5. Affiliate disclosure (for `/disclosure`)

Some links on Cuerpo Coffee are affiliate links. If you buy through one, we may earn a commission at no extra cost to you. This includes links to Amazon: as an Amazon Associate, we earn from qualifying purchases. Commissions never decide what we recommend; we only recommend what we'd buy ourselves, and every buying guide says what we rejected. Articles that contain affiliate links say so at the top.

Short line for article pages: "Some links are affiliate links. We only recommend what we'd buy." (links to `/disclosure`)

---

## 6. Privacy (for `/privacy`)

- **What we collect:** your email address, only if you subscribe, and which page you subscribed from.
- **Who processes it:** our newsletter platform ([beehiiv / Kit]) stores your email and sends our newsletter. When you buy a product, Lemon Squeezy (or Etsy, if you buy there) handles the payment and your details under its own privacy policy; we never see your card.
- **Analytics:** we use Cloudflare Web Analytics, which does not use cookies and does not track you across sites.
- **Cookies:** the site stores your theme and language choice in your browser. No advertising cookies.
- **Your choices:** every email has an unsubscribe link. To have your data deleted, write to [contact email].
- **Updated:** [date].

*This is a plain-language summary, not legal advice. Have it reviewed once revenue passes about $1,000 a month.*

---

## 7. Internal checklist (pull request template)

Every article pull request must pass all of these before the owner merges it:

- [ ] Every fact checked against its source link; unsupported claims removed
- [ ] At least one real opinion a competitor wouldn't publish
- [ ] Original photo, or no photo (never stock)
- [ ] Title ≤ 60 characters; description 120–155 characters
- [ ] Length within the pillar range (business plan, section 4)
- [ ] At least 2 internal links to other Cuerpo articles; one link to a product or the checklist where natural
- [ ] `affiliate` flag set if any affiliate link is present; every affiliate link goes through `/go/`
- [ ] Alt text on every image
- [ ] FAQ filled for troubleshooting articles (3–5 real questions)
- [ ] `aiAssisted` and `editor` fields filled
- [ ] Reflection pieces: written by Jorge, no AI draft
- [ ] Read in the branch preview on a phone
