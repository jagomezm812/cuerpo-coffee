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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

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
