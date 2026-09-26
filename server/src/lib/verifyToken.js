const { verifyToken: verifyClerkToken } = require('@clerk/backend');
const { siteUrl } = require('./config');

/*
  Checks a patient's Clerk session token and returns its payload (or null).

  Clerk signs session tokens with a key pair; `verifyToken` fetches the public
  half from Clerk's JWKS endpoint, caches it, and checks the signature and
  expiry locally. So this is a local check on the common path, not a network
  round-trip per request.

  `authorizedParties` pins the token to the sites we actually serve. Without
  it, a session token minted for any other application on the same Clerk
  instance would be accepted here.
*/
// "https://example.com" -> ["https://example.com", "https://www.example.com"],
// and the same pair starting from the www form. Anything that isn't a plain
// http(s) origin (e.g. localhost) is returned as-is.
function withWwwVariants(origin) {
  try {
    const url = new URL(origin);
    if (url.hostname === 'localhost' || !url.hostname.includes('.')) return [origin];
    const bare = url.hostname.replace(/^www\./, '');
    const port = url.port ? `:${url.port}` : '';
    return [`${url.protocol}//${bare}${port}`, `${url.protocol}//www.${bare}${port}`];
  } catch {
    return [origin];
  }
}

/*
  Every origin a legitimate session token can come from.

  - PUBLIC_SITE_URL (or CLIENT_ORIGIN), in both its bare and www. forms: the
    site answers on both (one redirects to the other), and a token's `azp` is
    whichever origin the browser ended up on.
  - Vercel's own production domain and this deployment's URL, which Vercel
    sets automatically. Relying on PUBLIC_SITE_URL alone meant that when it
    was unset, pointed at the wrong domain, or disagreed with the redirect on
    "www.", every token was rejected: all account requests failed, and the
    admin saw "this account doesn't have admin access".
  - Local development, where the client runs on Vite's port.
*/
function authorizedParties() {
  const vercelHosts = [process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL]
    .filter(Boolean)
    .map((host) => `https://${host}`);

  return [
    ...new Set([
      ...withWwwVariants(siteUrl()),
      ...vercelHosts.flatMap(withWwwVariants),
      'http://localhost:5173',
    ]),
  ];
}

async function verifyToken(token) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return null;

  try {
    const payload = await verifyClerkToken(token, {
      secretKey,
      authorizedParties: authorizedParties(),
    });
    // `sub` is the Clerk user id — the string every profile, report and
    // enquiry is keyed by.
    return payload?.sub ? payload : null;
  } catch {
    // Expired, tampered with, or issued for somewhere else. The caller turns
    // this into "please log in again"; there is nothing here worth logging on
    // every expired tab.
    return null;
  }
}

module.exports = verifyToken;
module.exports.authorizedParties = authorizedParties;
