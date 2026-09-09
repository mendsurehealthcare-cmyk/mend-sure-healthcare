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
async function verifyToken(token) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return null;

  // Local development runs the client on Vite's port while the deployed site
  // serves both halves from one origin, so both are allowed.
  const authorizedParties = [...new Set([siteUrl(), 'http://localhost:5173'])];

  try {
    const payload = await verifyClerkToken(token, { secretKey, authorizedParties });
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
