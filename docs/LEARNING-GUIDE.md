Note: the site now runs as a Cloudflare Worker with static assets (not Cloudflare Pages), and email is moving from Kit to beehiiv. Use docs/TECHNICAL-PLAN.md for current details.

# Cuerpo Coffee — Learning Guide

**How to understand the thing you're building, while you build it.**

You do not need to become a web developer. You need enough of a mental model to know what broke, where to look, and what to ask for. That's maybe fifteen concepts and five commands. This guide covers them in the order you'll actually meet them.

Read Part 1 before your first Claude Code session. Read the rest as each phase arrives.

---

## Part 1 — The mental model

### What your site actually is

A WordPress site is a program running on a server. Every time someone visits, the server wakes up, asks a database for your article, assembles a page, and sends it. That server has to stay running, stay patched, and stay paid for. It's also what gets hacked.

Your site is not that. Your site is **a folder of finished HTML files sitting on a CDN.** There is no program running and no database to query. When someone visits, a Cloudflare machine near them hands over a file. That's it.

The tradeoff: pages must be built *before* anyone visits, rather than on demand. That's what "building" means, and it's why there's a build step at all.

### The pipeline

```
You write Markdown  →  git push to GitHub  →  Cloudflare notices  →
runs the build (Astro turns Markdown into HTML)  →  publishes to the CDN  →  live
```

Roughly sixty seconds end to end. **Commit this diagram to memory** — every problem you will ever have lives at exactly one of these stages, and knowing which stage narrows the fix enormously.

### The five systems you now own

| System | What it is | Where you look |
|---|---|---|
| **The repo** (GitHub) | The permanent record of every file and every change | github.com |
| **The build** (Astro, run by Cloudflare) | Turns your Markdown into HTML | Cloudflare Pages → Deployments → build log |
| **The host** (Cloudflare Pages) | Serves the finished files worldwide | Cloudflare dashboard |
| **DNS** (Cloudflare) | Points `cuerpocoffee.com` at the host | Cloudflare → DNS |
| **The services** (Kit, Lemon Squeezy) | Email and payments — not part of your site | Their own dashboards |

When something is wrong, identify the system first. Almost everyone wastes their time debugging the wrong one.

---

## Part 2 — Tools and accounts

### Install on your machine

| Tool | What it's for | Notes |
|---|---|---|
| **Claude Code** | Builds and edits the site | Install per Anthropic's current instructions. You'll run it from inside the project folder. |
| **Node.js** (via **nvm**) | The runtime the build tools need | Install nvm first, then Node LTS through it. nvm lets you switch versions without breaking anything system-wide — worth the extra five minutes. You will never write Node code; it's just the engine Astro runs on. |
| **Git** | Version control | Probably already installed. Check with `git --version`. |
| **VS Code** | A code editor | You'll rarely open it, but when you need to read a file or fix a typo, it beats a terminal. |

That's the whole list. If a tutorial tells you to install Docker, a database, or a framework CLI, you are reading the wrong tutorial for this project.

### Accounts to create

| Service | Purpose | Cost |
|---|---|---|
| **GitHub** | Stores the repo | Free |
| **Cloudflare** | Domain, DNS, hosting, analytics | Domain ~$11/year, everything else free |
| **Kit** | Email list and newsletters | Free to 10,000 subscribers |
| **Lemon Squeezy** | Checkout for the guide (month 5, not now) | 5% + $0.50 per sale |

### Useful but optional

**Squoosh** (web app) for compressing photos before they go in the repo — a 6 MB camera JPEG should be a few hundred KB. **Figma** for laying out a mood board before the design session. Neither is required.

---

## Part 3 — Vocabulary

You'll hear these constantly. Skim now, return when one confuses you.

**Repository (repo)** — the project folder, with its full history. **Commit** — a saved snapshot with a message explaining what changed. **Push** — upload commits to GitHub. **Branch** — a parallel copy where you can experiment without touching the live site. **`main`** — the branch that is live.

**Markdown** — plain text with simple formatting marks; what your articles are written in. **Frontmatter** — the block at the top of an article between `---` lines holding the title, date, and category. **Slug** — the URL-friendly name of an article, taken from its filename.

**Build** — the process that turns source files into finished HTML. **Deploy** — publishing that output. **Preview deploy** — a temporary URL for a branch, so you can look at a change before it goes live.

**Static site generator (SSG)** — a tool that builds all pages ahead of time. Astro is one. **CDN** — a network of servers worldwide that each hold a copy of your site, so it loads fast everywhere.

**DNS** — the system mapping your domain name to a server. **SSL / HTTPS** — the padlock; Cloudflare handles it automatically.

**Dependency** — outside code your project uses. Every one is a small future liability, which is why the spec limits them. **Environment variable** — a secret (like an API key) stored in the hosting dashboard rather than in the repo, because the repo is visible.

---

## Part 4 — Git, minimally

Git has hundreds of commands. You need five, and once Keystatic is installed you'll rarely need even those.

```bash
git status                        # what's changed?
git add .                         # stage everything changed
git commit -m "Add sour coffee article"   # save a snapshot
git push                          # send it to GitHub → triggers deploy
git pull                          # fetch changes made elsewhere (e.g. via Keystatic)
```

**The one habit that matters:** run `git pull` before you start a Claude Code session. If you published through Keystatic in the browser, your machine doesn't know yet, and skipping this is how you get a conflict.

**How to undo things.** You will not need Git surgery. Two safe recoveries cover almost everything:

- *Bad content change:* on GitHub, open the file, view its history, and restore an earlier version through the interface.
- *Bad deploy — site is broken:* in Cloudflare Pages → Deployments, roll back to the last working deployment. The site is fixed in seconds. Then fix the cause properly.

If you're ever tempted to type a Git command you found online that contains `--force` or `reset --hard`, stop and ask instead.

---

## Part 5 — Markdown in five minutes

An article file looks like this:

```markdown
---
title: "Why your coffee tastes sour"
description: "Sourness is almost always under-extraction. Here's how to fix it in one change."
publishDate: 2026-10-14
category: troubleshooting
tags: ["extraction", "beginner"]
draft: false
---

Sour coffee is the most common complaint, and it has one dominant cause.

## What sour actually means

Not acidity — **under-extraction**. You pulled water through too fast...

- Grind finer
- Use hotter water
- Extend the brew time

[Read the guide to grind size](/articles/grind-size-explained)
```

The rules: `#` levels are headings (the title is already an `<h1>`, so your headings start at `##`), `**text**` is bold, `*text*` is italic, `-` makes a list, `[label](url)` is a link, and a blank line separates paragraphs. That's ninety percent of everything you'll write.

The frontmatter block is validated at build time. Get a field wrong and the build fails with a message naming the file — which is the point. Better a loud failure than a silently broken page.

---

## Part 6 — Working with Claude Code

This is a real skill and it determines how much you get out of the project.

**Give it context, once per session.** With `CLAUDE.md` in the repo root, each session starts knowing the stack, the rules, and the design system. You don't re-explain. If you find yourself explaining the same thing twice across sessions, it belongs in `CLAUDE.md`.

**One change at a time.** "Build the homepage, the article page, and the newsletter form" produces three half-reviewed things. "Build the article layout" produces one you can actually judge. Deploy, look at it, then continue.

**Describe visual problems concretely.** Not "it looks off" but "the space between the article title and the first paragraph is larger than the space between paragraphs." Better still, take a screenshot and paste it in.

**Ask for the reasoning when you want to learn, and say so.** "Why a content collection instead of just a folder of files?" is a good question and you'll get a real answer. You don't have to ask every time.

**Push back on scope.** If a session starts producing files you didn't ask for, stop it. Scope creep in an unmaintained codebase is the thing that eventually makes the site unmaintainable.

**Use branches for anything visual.** Ask for the change on a branch, look at the preview URL Cloudflare generates, then merge if you like it. Your live site is never at risk.

---

## Part 7 — The debugging ladder

When something is wrong, walk down this list in order. It almost always resolves in the first three steps.

1. **Is it the content?** Did the build fail? Cloudflare Pages → Deployments → the failed build → read the log. The error names the file and usually the line. Most failures are a malformed frontmatter field or a missing image.
2. **Did it deploy?** Check that the latest deployment is green and recent. If your change isn't there, it probably wasn't pushed.
3. **Is it cached?** Hard-refresh (`Ctrl+Shift+R`). Try an incognito window. A surprising share of "the site is broken" is an old cached copy in your own browser.
4. **Is it DNS?** Only relevant right after setting up the domain or changing it. Symptom: the `.pages.dev` URL works but your domain doesn't. Give it an hour before assuming it's broken.
5. **Is it the service?** Form not capturing? That's Kit, not your site. Checkout failing? That's Lemon Squeezy. Check their dashboards before touching code.
6. **Only now**, bring it to Claude Code — with the error message, the deploy log, and what you changed last.

---

## Part 8 — Six-week curriculum

Roughly an hour a week alongside the build. Each item is tied to what you're actually doing that week, which is the only reason any of it will stick.

**Week 1 — How the web works.** What a domain, DNS record, and HTTPS certificate are and how they connect. *Doing it:* register the domain in Cloudflare, watch the DNS records appear, watch the certificate issue.

**Week 2 — Git and GitHub.** Commits, history, branches. *Doing it:* watch the repo fill up during Phase 1. Open a few commits on GitHub and read the diffs — the green and red lines are the clearest explanation of version control there is.

**Week 3 — HTML and CSS, conceptually.** You don't need to write either, but you should be able to read a page and see the structure. Open your own site, right-click → Inspect, and hover over elements. *Doing it:* find `tokens.css` in the repo and change one color value. Watch the whole site change. That's the design system working.

**Week 4 — Markdown and the content pipeline.** *Doing it:* publish an article through Keystatic, then find the file it created on GitHub. Seeing that your browser edit became a Markdown file in a repo is the moment the whole architecture clicks.

**Week 5 — Performance and SEO.** Run Lighthouse in Chrome DevTools against your own site. Learn what LCP and CLS mean and why images cause both. *Doing it:* upload one uncompressed photo, measure the damage, then compress it and measure again.

**Week 6 — Analytics and the funnel.** Cloudflare Web Analytics for traffic, Kit for subscribers. *Doing it:* work out your visitor-to-subscriber rate for the first time, and which article produces the most subscribers per visit. That number should direct what you write next.

---

## Part 9 — Safely ignore, for now

Frameworks (React, Vue, Svelte). TypeScript beyond the config files already in the repo. Databases. Docker. CI/CD pipelines. Kubernetes, obviously. Server administration. npm's full dependency ecosystem. Any of the twelve "best headless CMS" comparisons you'll find.

None of it applies to a static blog with 25 articles, and every hour spent on it is an hour not spent writing — which is the only input that determines whether this project works.

---

## Part 10 — Reference

Official documentation, which is better than almost every tutorial you'll find:

- **Astro** — `docs.astro.build` (start with Content Collections and Images)
- **Cloudflare Pages** — `developers.cloudflare.com/pages`
- **Git** — the Pro Git book, free at `git-scm.com/book` (Chapters 1–3 are enough)
- **MDN** — `developer.mozilla.org` for anything HTML or CSS
- **Markdown** — CommonMark spec, or any one-page cheat sheet

When you search for help, add the year to the query. Web tooling advice goes stale faster than almost any other kind, and a 2021 answer about deployment is likely wrong now.
