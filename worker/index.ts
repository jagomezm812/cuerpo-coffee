// Worker entry point. This project deploys as a Cloudflare Worker with a
// static-assets binding (not classic Cloudflare Pages) — Cloudflare's
// current default for git-connected static sites. Everything except
// /api/keystatic/* is served straight from the static build; that one path
// is the sole piece of server-side code in the project, handling Keystatic's
// GitHub OAuth handshake and repo read/write calls for the /keystatic admin
// UI. See CLAUDE.md for the required environment variables.
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import keystaticConfig from '../keystatic.config';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  KEYSTATIC_GITHUB_CLIENT_ID: string;
  KEYSTATIC_GITHUB_CLIENT_SECRET: string;
  KEYSTATIC_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/api/keystatic/')) {
      const handler = makeGenericAPIRouteHandler({
        config: keystaticConfig,
        clientId: env.KEYSTATIC_GITHUB_CLIENT_ID,
        clientSecret: env.KEYSTATIC_GITHUB_CLIENT_SECRET,
        secret: env.KEYSTATIC_SECRET,
      });
      // TEMPORARY diagnostic try/catch: production returns Cloudflare's opaque
      // "error code: 1101" for any uncaught exception here, with no way to see
      // the real message without wrangler tail (which needs the owner's own
      // authenticated session). Remove this once the cause of the live-only
      // 500 on github/refresh-token is found and fixed.
      let result;
      try {
        result = await handler(request);
      } catch (err) {
        return new Response(
          `keystatic handler threw: ${err instanceof Error ? `${err.name}: ${err.message}\n${err.stack}` : String(err)}`,
          { status: 500 }
        );
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
