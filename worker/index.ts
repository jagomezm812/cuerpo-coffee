// Worker entry point. This project deploys as a Cloudflare Worker with a
// static-assets binding (not classic Cloudflare Pages) — Cloudflare's
// current default for git-connected static sites. Everything except
// /api/keystatic/* and /api/subscribe is served straight from the static
// build; those two routes are the only server-side code in the project.
// /api/keystatic/* handles Keystatic's GitHub OAuth handshake and repo
// read/write calls for the /keystatic admin UI. /api/subscribe proxies an
// email address to Kit so the real API key never reaches the browser. See
// CLAUDE.md for the required environment variables.
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import keystaticConfig from '../keystatic.config';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  KEYSTATIC_GITHUB_CLIENT_ID: string;
  KEYSTATIC_GITHUB_CLIENT_SECRET: string;
  KEYSTATIC_SECRET: string;
  KIT_API_KEY: string;
  KIT_FORM_ID: string;
}

async function handleSubscribe(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false }), { status: 405 });
  }

  let email: unknown;
  try {
    const body = await request.json();
    email = (body as { email?: unknown }).email;
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }

  if (typeof email !== 'string' || !email.includes('@') || email.length > 320) {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Kit-Api-Key': env.KIT_API_KEY,
  };

  // Kit's v4 API is two calls: create-or-update the subscriber account-wide,
  // then attach them to the specific form. There is no single-call
  // equivalent in v4 (the older v3 single-call endpoint still exists but
  // Kit's own docs mark v3 as no longer in active development).
  const createRes = await fetch('https://api.kit.com/v4/subscribers', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email_address: email }),
  });
  if (!createRes.ok) {
    console.error('Kit create-subscriber failed', createRes.status, await createRes.text());
    return new Response(JSON.stringify({ ok: false }), { status: 502 });
  }

  const addToFormRes = await fetch(
    `https://api.kit.com/v4/forms/${env.KIT_FORM_ID}/subscribers`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: email }),
    }
  );
  if (!addToFormRes.ok) {
    console.error('Kit add-to-form failed', addToFormRes.status, await addToFormRes.text());
    return new Response(JSON.stringify({ ok: false }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

const LANG_COOKIE_NAME = 'cuerpo_lang';
const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getLangCookie(request: Request): string | undefined {
  return request.headers
    .get('cookie')
    ?.split('; ')
    .find((row) => row.startsWith(`${LANG_COOKIE_NAME}=`))
    ?.split('=')[1];
}

function buildLangCookie(value: 'en' | 'es'): string {
  return `${LANG_COOKIE_NAME}=${value}; max-age=${LANG_COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Persistent language switcher (Footer.astro) — a plain link to the
    // current page with ?setlang=en|es appended, so this needs no client
    // JS at all. Answers the escape-hatch gap the first-visit prompt alone
    // left: once cuerpo_lang=es is set, there was no way back to English
    // short of clearing cookies, since the "/" redirect below would just
    // send a visitor straight back to /es/articles.
    // This redirects to the clean URL (query stripped) rather than
    // fetching-and-patching the response in place, specifically so the
    // BROWSER's next request already carries the new cookie value — if we
    // instead served the target content directly in this same response,
    // the "/" redirect check below would still see the OLD cookie (Set-
    // Cookie on a response doesn't retroactively change the request that's
    // already being handled) and could immediately redirect the visitor
    // right back to where they just asked to leave.
    const setLang = url.searchParams.get('setlang');
    if (setLang === 'en' || setLang === 'es') {
      url.searchParams.delete('setlang');
      return new Response(null, {
        status: 302,
        headers: {
          Location: url.toString(),
          'Set-Cookie': buildLangCookie(setLang),
        },
      });
    }

    // Returning-visitor language redirect: the LanguagePrompt React island
    // (src/components/LanguagePrompt.tsx) sets a cuerpo_lang cookie on
    // first visit. This is the only place that cookie is read server-side
    // — deliberately scoped to the bare homepage only, not every route.
    // A bookmarked or shared article link should always open the article
    // that was linked, regardless of language preference; only the site's
    // generic entry point adapts to it. Doing this here means zero added
    // client JS for every page on every return visit — the island itself
    // is only responsible for the first-visit prompt and setting the
    // cookie, not for repeat-visit routing.
    // Target is /es/articles specifically because there is currently no
    // Spanish homepage — site chrome (header, hero, About, Subscribe)
    // stays English-only by design, so the Spanish article index is the
    // only page on the site that's actually meaningful in Spanish. Revisit
    // this target if/when chrome ever gets translated.
    if (pathname === '/' && getLangCookie(request) === 'es') {
      return Response.redirect(new URL('/es/articles', request.url), 307);
    }

    if (pathname === '/api/subscribe') {
      return handleSubscribe(request, env);
    }

    if (pathname.startsWith('/api/keystatic/')) {
      const handler = makeGenericAPIRouteHandler({
        config: keystaticConfig,
        clientId: env.KEYSTATIC_GITHUB_CLIENT_ID,
        clientSecret: env.KEYSTATIC_GITHUB_CLIENT_SECRET,
        secret: env.KEYSTATIC_SECRET,
      });
      const result = await handler(request);

      // @keystatic/core's githubLogin() never sets an OAuth `scope` param on
      // the GitHub authorize redirect it builds — confirmed by reading its
      // source directly. That's fine for a GitHub App, where write access
      // comes from the app's own installation permissions rather than OAuth
      // scope, but this project uses a classic OAuth App, which gets back a
      // token with NO scope at all unless one is explicitly requested —
      // hence "createCommitOnBranch requires... public_repo... but your
      // token has only been granted: ['']" once someone actually tries to
      // save an edit. Patched here by rewriting the one outgoing redirect,
      // rather than reimplementing any of Keystatic's own state/cookie
      // logic. public_repo (not the broader repo scope) is correct and
      // sufficient since cuerpo-coffee is a public repo (confirmed via
      // `gh repo view`) — repo would also grant write access to every
      // private repo on this GitHub account, which nothing here needs.
      if (pathname === '/api/keystatic/github/login' && Array.isArray(result.headers)) {
        const locationHeader = result.headers.find(
          ([key]) => key.toLowerCase() === 'location'
        );
        if (locationHeader) {
          const authorizeUrl = new URL(locationHeader[1]);
          authorizeUrl.searchParams.set('scope', 'public_repo');
          locationHeader[1] = authorizeUrl.toString();
        }
      }

      // Astro's tsconfig pulls in DOM lib types, whose Uint8Array generic
      // doesn't structurally match the one @keystatic/core's types use —
      // a type-checker-only mismatch, not a runtime one (BodyInit accepts
      // Uint8Array at runtime regardless).
      return new Response(result.body as BodyInit | null, {
        status: result.status,
        headers: result.headers,
      });
    }

    // Keystatic's admin UI is a client-side SPA with its own router, which
    // is hardcoded to assume it's mounted at /keystatic (there is no
    // basePath prop — confirmed by reading @keystatic/core's UI bundle
    // directly). The built shell physically lives at /keystatic-app (a
    // separate name so the rule below can't ever match its own target),
    // but it must be served AT /keystatic and any /keystatic/* sub-path
    // without an HTTP redirect — a redirect changes the browser's visible
    // URL, which breaks Keystatic's own route parsing (it renders its own
    // "Not found" state). So this fetches the shell server-side and
    // returns its content directly, leaving the request URL untouched.
    if (pathname === '/keystatic' || pathname.startsWith('/keystatic/')) {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/keystatic-app/';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), {
        method: request.method,
        headers: request.headers,
      }));
    }

    return env.ASSETS.fetch(request);
  },
};
