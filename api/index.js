// Vercel serverless entry point for the whole API.
//
// Every /api/* request is routed here by the rewrite in vercel.json, then
// handed to the same Express app used in local development.
//
// Why a rewrite rather than a filesystem catch-all: `api/[...path].js` only
// ever matched a single path segment in practice, so /api/doctors reached the
// function while /api/auth/signup and /api/reports/:id/download fell through
// to Vercel's own 404 — an HTML page, which the client then failed to parse as
// JSON and reported as a generic "something went wrong".
//
// The rewrite carries the original path in a query parameter instead of
// relying on Vercel to preserve req.url across a rewrite, which is not
// something to depend on. That parameter is stripped back off here so Express
// sees exactly the URL the browser asked for.
const app = require('../server/src/app');

const PATH_PARAM = '__apiPath';

module.exports = (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const forwardedPath = url.searchParams.get(PATH_PARAM);

  if (forwardedPath !== null) {
    url.searchParams.delete(PATH_PARAM);
    const query = url.searchParams.toString();
    req.url = `/api/${forwardedPath}${query ? `?${query}` : ''}`;
  } else if (!url.pathname.startsWith('/api')) {
    // Defensive: a direct invocation that skipped the rewrite entirely.
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }

  return app(req, res);
};
