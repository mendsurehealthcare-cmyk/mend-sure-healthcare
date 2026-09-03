// Vercel serverless entry point for the whole API.
//
// The filename is a catch-all, so every request to /api/<anything> — including
// nested paths like /api/reports/123/download — is handed to this one function
// and then routed by Express exactly as it is in local development.
//
// Vercel normally passes the original request path through untouched, but the
// prefix is restored defensively below so the routers match either way.
const app = require('../server/src/app');

module.exports = (req, res) => {
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }

  return app(req, res);
};
