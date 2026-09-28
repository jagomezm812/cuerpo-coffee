# Cuerpo Coffee: How to update the site (for non-coders)

Save this in the repo as `docs/UPDATE-WORKFLOW.md`. It answers one question: **how do I change the site as many times as I want without losing anything or starting over?**

---

## 1. The idea in one minute

The site has three layers. Each one changes in a different way, and none of them can erase the others.

| Layer | What it is | How you change it | How often |
|---|---|---|---|
| **Content** | Articles, photos, alt text | In your browser, with Keystatic (`cuerpo.coffee/keystatic`) | Daily |
| **Design** | Colors, layout, sections | Through Claude Code, on a safe copy you review first | When you decide, ideally in batches |
| **Memory** | The plans, the design system, the changelog | Text files in the `docs/` folder of your repo | Whenever something is decided |

Two things stop you from ever starting over:

1. **Git (inside GitHub) is a time machine.** Every change is saved as a snapshot with a note. Old snapshots are never deleted, so any earlier version of the site can be brought back.
2. **A safe copy for every change.** New work happens on a copy of the site called a *branch*. The live site does not change until you approve it. If you do not like the result, you throw the copy away and the live site is exactly as it was.

---

## 2. Where everything lives

| Thing | Where it lives | Who touches it |
|---|---|---|
| Articles and photos | GitHub repo, `src/content/` | You, through Keystatic |
| Site code and design | GitHub repo, `src/` | Claude Code only |
| Plans, design rules, changelog | GitHub repo, `docs/` and `CLAUDE.md` | Claude Code saves them; you decide what they say |
| The live website | Cloudflare (builds and publishes `main` automatically) | Nobody, it is automatic |
| Design mockups and design system | Links in claude.ai (nothing to download) | You and Claude in chat |
| Email list | Kit | You |
| Domain | Porkbun (registrar) and Cloudflare (DNS) | Rarely |

**Two Claudes, two jobs.** Claude in this chat designs and writes the documents. Claude Code builds the site from them. Claude Code cannot see this chat, so anything it needs to know must be in the `docs/` folder.

---

## 3. One-time setup (do this once)

### Which documents to download

Download these files from this chat and keep the same file names each time:

| File to download | Save in the repo as |
|---|---|
| `CUERPO-TECHNICAL-PLAN.md` | `docs/TECHNICAL-PLAN.md` |
| `CUERPO-BUSINESS-PLAN.md` | `docs/BUSINESS-PLAN.md` |
| `CUERPO-DESIGN-SYSTEM.md` | `docs/DESIGN-SYSTEM.md` |
| `CUERPO-UPDATE-WORKFLOW.md` (this file) | `docs/UPDATE-WORKFLOW.md` |
| `CUERPO-LEARNING-GUIDE.md` | `docs/LEARNING-GUIDE.md` (unchanged, if it is not there yet) |

**Do I download everything again after each change?** No. Only the files I tell you changed. I will say "documents updated" and list them. The design mockup and the design system are online links, so there is nothing to download for them. Old versions are never lost, because Git keeps every earlier version of every file.

### How to save them (easiest way)

Copy the downloaded files into a folder Claude Code can reach (your Downloads folder is fine), then paste **Prompt 0** below into Claude Code. It does everything and gives you a preview link.

### Prompt 0: set up the update system

```text
Set up our update system, one step at a time. Do not touch any site code.

1. Create a git tag called v1.0-pre-redesign on the current main and push the tag. This is our "go back here" point.
2. From my Downloads folder, copy into docs/ these files, renamed:
   CUERPO-TECHNICAL-PLAN.md -> TECHNICAL-PLAN.md
   CUERPO-BUSINESS-PLAN.md -> BUSINESS-PLAN.md
   CUERPO-DESIGN-SYSTEM.md -> DESIGN-SYSTEM.md
   CUERPO-UPDATE-WORKFLOW.md -> UPDATE-WORKFLOW.md
   CUERPO-LEARNING-GUIDE.md -> LEARNING-GUIDE.md (only if it is not already there)
3. Create docs/CHANGELOG.md and docs/BACKLOG.md from the templates in section 8 of docs/UPDATE-WORKFLOW.md.
4. Add the "Update protocol" block from section 9 of docs/UPDATE-WORKFLOW.md to CLAUDE.md. Keep everything already in CLAUDE.md, and change its Design section so it points to docs/DESIGN-SYSTEM.md.
5. Do all of this on a branch called setup/update-system, push it, and tell me the preview link and exactly what changed.
```

### Backup way to save files (no Claude Code)

1. Open your repo on github.com.
2. Open the `docs` folder (or create it: **Add file → Create new file**, type `docs/notes.md`, then commit).
3. Click **Add file → Upload files**, drag the files in, and click **Commit changes**.

---

## 4. Everyday routines

### A. Publish or edit an article (no code, no Claude Code)

1. Go to `cuerpo.coffee/keystatic` and sign in with GitHub.
2. Open **Articles**, then **Create** (or open an existing one).
3. Fill in the fields, add the photo and its alt text, and save.
4. Wait one to two minutes. Cloudflare rebuilds the site and the article appears.
5. To hide an article without deleting it, turn on **draft**.

Articles do not touch the design, so you can publish every day while a design change is being built.

### B. Change the design, or add or remove a section (the safe loop)

Follow these steps in order, every time:

1. **Decide in chat.** Tell Claude in this chat what you want, and paste your design system link. Claude updates the mockup and the design system, and tells you which documents changed.
2. **Download changed documents** and ask Claude Code to sync them (Prompt S below).
3. **Open Terminal** in your project folder (the one that contains `CLAUDE.md`) and run `git pull`. This brings in any articles you published in the browser.
4. **Start Claude Code** and paste **Prompt C** (below) with your change filled in. It works on a branch, so the live site stays untouched.
5. **Open the preview link** Claude Code gives you. If it does not, open Cloudflare, go to **Workers & Pages → your project → Deployments**, and open the newest build from your branch. Look at it on your computer and phone, in day and dark mode.
6. **Happy?** Tell Claude Code: "Merge this into main." **Not happy?** Say what to change and it updates the same preview. If you give up, say "abandon this branch". The live site never changed.
7. **Watch the live deploy** in Cloudflare turn green (one to two minutes) and open `cuerpo.coffee` to confirm.
8. **Log it.** Claude Code adds a line to `docs/CHANGELOG.md` and tags the version (for example `v1.1`). This is your diary and your undo map.

**Prompt S: sync updated documents**

```text
I downloaded updated documents into my Downloads folder: [list the file names]. Copy them into docs/ using the same short names as before (TECHNICAL-PLAN.md, BUSINESS-PLAN.md, DESIGN-SYSTEM.md, UPDATE-WORKFLOW.md). Do it on a branch called docs/sync, summarize what changed in each file in plain English, and add a CHANGELOG entry. Do not touch site code.
```

**Prompt C: one design change**

```text
Follow the Update protocol in CLAUDE.md. Read docs/DESIGN-SYSTEM.md first.

Change: [describe it in one or two sentences, for example "add an 'About the author' band to the Home page" or "remove the Series band from Home"].

Use only design tokens and existing components. Work on a branch named update/[short-name]. Check both themes and mobile. Give me the preview link and a plain-English list of what changed, then wait for my approval before merging.
```

### C. Undo something (three levels, easiest first)

1. **The change is still on a branch:** do nothing. Say "abandon this branch". The live site never changed.
2. **The live site looks wrong after a merge:** in Cloudflare, open **Workers & Pages → your project → Deployments**, choose the last good deployment and use its **Rollback** option. If you cannot find it, ask Claude Code: "Roll the live site back to the previous version."
3. **You want an older design back for good:** on github.com open **Pull requests → Closed**, pick the pull request, and click **Revert**. GitHub creates a new pull request that undoes it. Merge that one. Or ask Claude Code: "Revert the last merge."

Never try to fix a broken site by typing Git commands you found online. If a command contains `--force` or `reset --hard`, stop and ask.

---

## 5. Adding or removing a section without breaking the concept

The site is built from a fixed list of section types, in a fixed order, on alternating color bands. The rules are in `docs/DESIGN-SYSTEM.md`. In plain words:

- **Adding:** use one of the existing section types, give it a band color different from its neighbors, keep at most two large photo spaces per page, and keep the footer dark and last. Claude Code follows these rules automatically if you use Prompt C.
- **Removing:** any band can go except the header, the newsletter band and the footer. After removing one, the colors of the neighbors are re-alternated so no two touching bands match.
- **Hide before you delete.** Ask for a section to be *hidden behind a setting* first. If you miss it, one line brings it back. Delete it for good only after a few weeks.
- **A section with nothing to show yet** (no series, no featured article) is hidden automatically. The site never shows an empty band.

New kinds of sections (not on the list) go to `docs/BACKLOG.md` first. When you are ready, ask Claude in chat to add the new section type to the design system, then build it.

---

## 6. When you must touch GitHub or Cloudflare (rare)

For the redesign you do **not** need to add or remove anything in either place. Fonts are stored in the repo, search is built during the deploy, and Cloudflare already builds branches.

| Task | Where | Steps |
|---|---|---|
| Save a document without Claude Code | GitHub | Repo → `docs` → **Add file → Upload files → Commit changes** |
| See an old version of a file | GitHub | Open the file → **History** → pick a snapshot |
| Approve a change yourself | GitHub | **Pull requests** → open it → **Merge pull request** |
| Undo a merged change | GitHub | **Pull requests → Closed** → the request → **Revert** |
| See a preview of a branch | Cloudflare | **Workers & Pages → project → Deployments** → newest build from the branch |
| Roll the live site back | Cloudflare | **Deployments** → last good one → **Rollback** |
| Change a secret (Kit key, GitHub login) | Cloudflare | Project → **Settings → Variables and secrets** |
| Change the domain or DNS | Cloudflare | **Domains** or the domain's **DNS** page |

Two traps to remember:

- A plain-text variable you add by hand in Cloudflare can disappear on the next deploy. Only **secrets** survive. Ask Claude Code to put non-secret values in `wrangler.jsonc`.
- If you regenerate the GitHub login secret, the Keystatic login stops working until the new value is pasted into Cloudflare.

**Never:** delete the GitHub repo, delete the Cloudflare project, click **Disconnect**, or delete files by hand in `src/`.

---

## 7. The redesign rollout: six small sessions

Do these one at a time on **one branch called `redesign`**. The live site keeps the old look until step 6. Publishing articles in the meantime is fine: Claude Code brings the newest articles into the branch before the final merge.

Start each session with `git pull`, then paste the prompt.

| Step | Goal | Prompt (paste into Claude Code) |
|---|---|---|
| 1 | Colors and fonts | `Follow the Update protocol. Read docs/DESIGN-SYSTEM.md and section 6 of docs/TECHNICAL-PLAN.md. On branch redesign, replace src/styles/tokens.css with the new tokens (light and dark, exact names). Self-host Manrope and Fraunces as woff2 and remove Inter. Apply only to existing pages, no layout changes yet. Log it. Give me the preview link.` |
| 2 | Header, footer, dark mode | `Same branch. Build the new Header (wordmark, four links, search icon, sun/moon toggle, Subscribe) and the dark footer with the faint wordmark and the English/Español switcher. The toggle shows a moon in day mode and a sun in dark mode, follows the system setting by default, remembers the choice, and sets the theme in <head> before paint so nothing flashes. Preview link please.` |
| 3 | Home page | `Same branch. Build Home from docs/DESIGN-SYSTEM.md section types in this order: hero photo card, Start here tiles, Latest, Series band, Reflection strip, newsletter band. Hide any section with nothing to show. At most two photo spaces. Preview link please.` |
| 4 | Article and Explore | `Same branch. Build the article template (title block, hero, progress line, sticky table of contents from the h2s, series rail, author box, Keep reading) and the /articles Explore page (topic tiles, series, tag cloud). Static category and tag pages. Preview link please.` |
| 5 | Search, essays, motion | `Same branch. Add Pagefind search (loads only when opened), the Reflection essay look (opens dark unless the visitor chose light), and the CSS transitions from the design system with prefers-reduced-motion respected. Then run Lighthouse and check contrast in both themes. Report the numbers.` |
| 6 | Go live | `Merge branch redesign into main through a pull request after first merging the latest main into it. Tag v1.1-redesign. Add the CHANGELOG entry. Tell me how to roll back.` |

**Only merge in step 6 after you have looked at the preview on your phone and computer, in day and dark mode.**

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

## [date] · v1.0-pre-redesign
- **What changed:** Snapshot of the live site before the redesign. Not a change.
- **How to go back here:** ask Claude Code to check out the tag v1.0-pre-redesign.
```

### `docs/BACKLOG.md`

```markdown
# Backlog: ideas waiting

Ideas that are not part of today's task go here, not into the code. Design ideas are batched: pick the next batch about once a month.

| Idea | Type (content, design, feature) | Added | Batch on |
|---|---|---|---|
| | | | |
```

---

## 9. The "Update protocol" block to add to `CLAUDE.md`

```markdown
## Update protocol
- At the start of every session: run git pull. Read CLAUDE.md, docs/DESIGN-SYSTEM.md, the last five entries of docs/CHANGELOG.md, and docs/BACKLOG.md.
- Never work on main. Create a branch (update/short-name, or redesign for the redesign rollout).
- One change per session. Reuse existing components. Use design tokens only, never a hardcoded color or size. Follow the section rules in docs/DESIGN-SYSTEM.md (band order, at most two photo spaces per page, footer dark and last).
- Before merging: the build passes, both themes and mobile are checked, and the owner has seen the preview link and approved.
- After merging: add a CHANGELOG entry (date, tag, what, why, how to undo) and tag the release (design changes raise the minor number: v1.1, v1.2).
- Ideas that are not part of the current task go to docs/BACKLOG.md, not into code.
- Never delete a section or component outright: hide it behind a setting first, and delete only when the owner says so.
- Never use --force or reset --hard. Never commit secrets.
```

---

## 10. Rules of thumb

1. **One change per session.** Deploy, look, then continue.
2. **Content daily, design in batches.** Your plan's biggest risk is redesigning instead of writing. Log design ideas in the backlog and batch them.
3. **Same file names, always.** Overwrite `docs/DESIGN-SYSTEM.md` rather than making `DESIGN-SYSTEM-v2.md`. Git keeps the old version.
4. **If it is not in `docs/` or `CLAUDE.md`, Claude Code does not know it.** Anything decided in chat must be saved there.
5. **Ask for the preview first.** Nothing you have not previewed should reach the live site.
