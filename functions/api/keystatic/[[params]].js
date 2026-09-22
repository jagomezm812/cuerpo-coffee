// Cloudflare Pages Function — the only server-side code in this project.
// Handles Keystatic's GitHub OAuth handshake and repo read/write calls for
// the /keystatic admin UI. Deployed automatically by Cloudflare Pages
// alongside the static Astro build; nothing else on the site runs through
// this or any other server code. See CLAUDE.md for the three required
// environment variables.
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import config from '../../../keystatic.config';

export async function onRequest(context) {
  const handler = makeGenericAPIRouteHandler({
    config,
    clientId: context.env.KEYSTATIC_GITHUB_CLIENT_ID,
    clientSecret: context.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    secret: context.env.KEYSTATIC_SECRET,
  });

  const result = await handler(context.request);

  return new Response(result.body ?? null, {
    status: result.status,
    headers: result.headers,
  });
}
