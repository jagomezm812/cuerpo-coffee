# Cuerpo Coffee: How to update the site (for non-coders)

Save this in the repo as `docs/UPDATE-WORKFLOW.md`. It answers one question: **how do I change the site as many times as I want without losing anything or starting over?**

*Updated October 2026 for the $10k plan: new documents to sync, a routine for reviewing AI and writer drafts, beehiiv and Lemon Squeezy in the map of where things live. The redesign rollout (old section 7) is finished and kept only as a record.*

---

## 1. The idea in one minute

The site has three layers. Each one changes in a different way, and none of them can erase the others.

| Layer | What it is | How you change it | How often |
|---|---|---|---|
| **Content** | Articles, photos, alt text | In your browser, with Keystatic (`cuerpo.coffee/keystatic`), or by approving a draft pull request | Weekly, several times |
| **Design and features** | Colors, layout, sections, shop, tools | Through Claude Code, on a safe copy you review first, one planned session at a time (`docs/SITE-PLAN.md`) | When the plan says, ideally in batches |
| **Memory** | The plans, the design system, the changelog | Text files in the `docs/` folder of your repo | Whenever something is decided |

Two things stop you from ever starting over:

1. **Git (inside GitHub) is a time machine.** Every change is saved as a snapshot with a note. Old snapshots are never deleted, so any earlier version of the site can be brought back.
2. **A safe copy for every change.** New work happens on a copy of the site called a *branch*. The live site does not change until you approve it. If you do not like the result, you throw the copy away and the live site is exactly as it was.

---

## 2. Where everything lives

| Thing | Where it lives | Who touches it |
|---|---|---|
| Articles and photos | GitHub repo, `src/content/` | You through Keystatic; the writer and AI drafts through `draft/` branches you approve |
| Site code and design | GitHub repo, `src/` | Claude Code only |
| Plans, design rules, changelog | GitHub repo, `docs/` and `CLAUDE.md` (copies of the claude.ai Project documents) | Claude Code saves them; you decide what they say |
| AI prompt templates | GitHub repo, `prompts/` | Claude Code saves them; agents use them |
| The live website | Cloudflare (builds and publishes `main` automatically) | Nobody, it is automatic |
| Design mockups, design system, $10k plan, site plan | Links in claude.ai | You and Claude in chat |
| Email list | beehiiv (Kit until the switch) | You |
| Product checkout and files | Lemon Squeezy; Etsy for printables | You |
| Domain | Porkbun (registrar) and Cloudflare (DNS) | Rarely |

**Two Claudes, two jobs.** Claude in chat designs and writes the documents. Claude Code builds the site from them. Claude Code cannot see the chat, so anything it needs to know must be in the `docs/` folder.

---

## 3. Documents to keep in the repo

Download these from the claude.ai Project and keep the same file names each time:

| File to download | Save in the repo as |
|---|---|
| `CUERPO-BUSINESS-PLAN.md` | `docs/BUSINESS-PLAN.md` |
| `CUERPO-SITE-PLAN.md` | `docs/SITE-PLAN.md` |
| `CUERPO-TECHNICAL-PLAN.md` | `docs/TECHNICAL-PLAN.md` |
| `CUERPO-DESIGN-SYSTEM.md` | `docs/DESIGN-SYSTEM.md` |
| `CUERPO-MARKETING-BRIEF.md` | `docs/MARKETING-BRIEF.md` |
| `CUERPO-EDITORIAL-POLICY.md` | `docs/EDITORIAL-POLICY.md` |
| `CUERPO-AI-PIPELINE.md` | `docs/AI-PIPELINE.md` |
| `CUERPO-UPDATE-WORKFLOW.md` (this file) | `docs/UPDATE-WORKFLOW.md` |
| `CUERPO-LEARNING-GUIDE.md` | `docs/LEARNING-GUIDE.md` (background only) |

**Do I download everything again after each change?** No. Only the files Claude says changed. Old versions are never lost, because Git keeps every earlier version of every file.

### Backup way to save files (no Claude Code)

1. Open your repo on github.com.
2. Open the `docs` folder.
3. Click **Add file → Upload files**, drag the files in, and click **Commit changes**.

---

## 4. Everyday routines

### A. Publish or edit an article yourself (no code)

1. Go to `cuerpo.coffee/keystatic` and sign in with GitHub.
2. Open **Articles**, then **Create** (or open an existing one).
3. Fill in the fields, add the photo and its alt text, and save.
4. Wait one to two minutes. Cloudflare rebuilds the site and the article appears.
5. To hide an article without deleting it, turn on **draft**.

### B. Review an AI or writer draft (about 15 minutes)

After Site Session 4, drafts arrive as pull requests from branches starting with `draft/`.

1. On github.com open **Pull requests** and the draft's request (or open it in Keystatic).
2. Open the **preview link** Cloudflare posts for the branch and read the article there, on your phone too.
3. Go through the checklist in the pull request: facts checked against links, one real opinion, original photo or none, title ≤ 60 characters, description 120–155, affiliate flag right, at least 2 internal links.
4. Small fix? Edit it in Keystatic on the same branch. Bigger problem? Leave a comment on the request saying what to change.
5. Happy? Click **Merge pull request**. The article goes live in one to two minutes.

Never merge a draft you have not read in the preview.

### C. Change the design or add a feature (the safe loop)

1. **Decide in chat.** Claude checks it against the plan and updates the documents that change.
2. **Download changed documents** and run Prompt S below.
3. **Open Terminal** in your project folder and run `git pull`.
4. **Start Claude Code** and paste the session's prompt from `docs/SITE-PLAN.md`, or Prompt C below for a small change.
5. **Open the preview link** (or Cloudflare → **Workers & Pages → your project → Deployments** → newest build from your branch). Check computer and phone, day and dark mode.
6. **Happy?** Tell Claude Code: "Merge this into main." **Not happy?** Say what to change. Giving up? Say "abandon this branch".
7. **Watch the live deploy** turn green and open `cuerpo.coffee` to confirm.
8. **Log it.** Claude Code adds a CHANGELOG line and tags the version.
9. **Tell Claude in chat** what Claude Code reported, so the plan and START HERE stay current.

**Prompt S: sync updated documents**

```text
Follow the Update protocol in CLAUDE.md. Do not touch site code.
I downloaded updated documents into my Downloads folder: [list the file names].
Copy them into docs/ using the short names in section 3 of docs/UPDATE-WORKFLOW.md
(drop the CUERPO- prefix). Overwrite; never make v2 copies. Do it on a branch called
docs/sync, summarize what changed in each file in plain English, add a CHANGELOG
entry, and wait for my approval before merging.
```

**Prompt C: one small design change**

```text
Follow the Update protocol in CLAUDE.md. Read docs/DESIGN-SYSTEM.md first.

Change: [describe it in one or two sentences].

Use only design tokens and existing components. Work on a branch named update/[short-name]. Check both themes and mobile. Give me the preview link and a plain-English list of what changed, then wait for my approval before merging.
```

### D. Undo something (three levels, easiest first)

1. **The change is still on a branch:** say "abandon this branch". The live site never changed.
2. **The live site looks wrong after a merge:** in Cloudflare open **Workers & Pages → your project → Deployments**, choose the last good deployment and use **Rollback**. Or ask Claude Code: "Roll the live site back to the previous version."
3. **You want an older version back for good:** on github.com open **Pull requests → Closed**, pick the request, click **Revert**, and merge the new request. Or ask Claude Code: "Revert the last merge."

Never fix a broken site with Git commands found online. If a command contains `--force` or `reset --hard`, stop and ask.

---

## 5. Adding or removing a section without breaking the concept

- **Adding:** use an existing section type, a band color different from its neighbors, at most two photo spaces per page (a video counts as one), footer dark and last.
- **Removing:** any band can go except the header, the newsletter band and the footer; re-alternate the neighbors.
- **Hide before you delete.** Hide behind a setting first; delete only after a few weeks.
- **A section with nothing to show** is hidden automatically. No empty bands, no "Coming soon".

New kinds of sections go to `docs/BACKLOG.md` first, then into the design system in chat, then into code.

---

## 6. When you must touch GitHub, Cloudflare or other services (rare)

| Task | Where | Steps |
|---|---|---|
| Save a document without Claude Code | GitHub | Repo → `docs` → **Add file → Upload files → Commit changes** |
| See an old version of a file | GitHub | Open the file → **History** |
| Approve a change or a draft | GitHub | **Pull requests** → open it → **Merge pull request** |
| Undo a merged change | GitHub | **Pull requests → Closed** → the request → **Revert** |
| See a branch preview | Cloudflare | **Workers & Pages → project → Deployments** → newest build from the branch |
| Roll the live site back | Cloudflare | **Deployments** → last good one → **Rollback** |
| Add or change a secret (beehiiv key, GitHub login) | Cloudflare | Project → **Settings → Variables and secrets** → add as **Secret** |
| Verify Google Search Console | Cloudflare | Copy Google's TXT record into the domain's **DNS** page |
| Add a product or checkout link | Lemon Squeezy | Create the product; give Claude Code the checkout URL for `src/data/links.json` |

Traps to remember:

- A plain-text variable added by hand in Cloudflare can disappear on the next deploy. Only **secrets** survive. Non-secret flags go in `wrangler.jsonc` through Claude Code.
- If you regenerate the GitHub login secret, Keystatic stops working until the new value is in Cloudflare.
- Never paste a key or password into any chat. If you did in the past, rotate it.

**Never:** delete the GitHub repo, delete the Cloudflare project, click **Disconnect**, or delete files by hand in `src/`.

---

## 7. Record: the redesign rollout (done)

The six-session redesign on the `redesign` branch was completed and merged as tag `v1.1-redesign`; the rollback point is `v1.0-pre-redesign`. New site work now follows the numbered sessions in `docs/SITE-PLAN.md`.

---

## 8. Templates for `docs/CHANGELOG.md` and `docs/BACKLOG.md`

### `docs/CHANGELOG.md`

```markdown
# Changelog

Newest first. One entry for every change that reaches the live site.

## [date] · [version tag]
- **What changed:** [one or two plain sentences]
- **Why:** [the reason]
- **How to undo:** revert the pull request [number], or roll back in Cloudflare to the deployment before [date].
```

### `docs/BACKLOG.md`

```markdown
# Backlog: ideas waiting

Ideas that are not part of today's task go here, not into the code. Design ideas are batched about once a month.

| Idea | Type (content, design, feature) | Added | Batch on |
|---|---|---|---|
| | | | |
```

---

## 9. The "Update protocol" block in `CLAUDE.md`

```markdown
## Update protocol
- At the start of every session: run git pull. Read CLAUDE.md, docs/DESIGN-SYSTEM.md, docs/SITE-PLAN.md, the last five entries of docs/CHANGELOG.md, and docs/BACKLOG.md.
- Never work on main. Create a branch (update/short-name, docs/short-name, audit/date; drafts use draft/).
- One change per session. Reuse existing components. Use design tokens only. Follow the section rules in docs/DESIGN-SYSTEM.md (band order, at most two photo spaces per page, footer dark and last).
- Before merging: the build passes, both themes and mobile are checked, and the owner has seen the preview link and approved.
- After merging: add a CHANGELOG entry (date, tag, what, why, how to undo) and tag the release (minor number for design and features: v1.2, v1.3).
- Ideas that are not part of the current task go to docs/BACKLOG.md, not into code.
- Never delete a section or component outright: hide it behind a setting first, and delete only when the owner says so.
- Never use --force or reset --hard. Never commit secrets. Never ask the owner to paste a secret into chat.
```

---

## 10. Rules of thumb

1. **One change per session.** Deploy, look, then continue.
2. **Content weekly, design in batches.** The biggest risk is redesigning instead of publishing.
3. **Same file names, always.** Git keeps the old versions.
4. **If it is not in `docs/` or `CLAUDE.md`, Claude Code does not know it.**
5. **Ask for the preview first.** Nothing you have not previewed reaches the live site, including AI drafts.
