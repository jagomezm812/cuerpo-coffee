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

    return env.ASSETS.fetch(request);
  },
};
