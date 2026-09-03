const express = require('express');

// Express 4 does not understand async handlers.
//
// If an `async (req, res) => {...}` route rejects — Supabase unreachable, a
// malformed SUPABASE_URL, a typo that throws a TypeError — Express never sees
// it. The promise rejection goes unhandled, no response is ever sent, and the
// request simply hangs until something else kills it. On Vercel that means a
// FUNCTION_INVOCATION_TIMEOUT: the caller waits the full maxDuration, we pay
// for the whole 30 seconds, and the logs show a timeout rather than the actual
// error.
//
// This returns a Router whose handlers are wrapped so a rejection is forwarded
// to next(), reaching the JSON error handler in app.js like any other failure.
// Route files use this instead of express.Router() so new routes are covered
// automatically rather than relying on everyone remembering a try/catch.
function wrap(handler) {
  if (typeof handler !== 'function') return handler;

  // Express identifies error-handling middleware by arity, so a 4-argument
  // handler has to stay a 4-argument handler.
  if (handler.length === 4) {
    return function wrappedErrorHandler(err, req, res, next) {
      return Promise.resolve(handler(err, req, res, next)).catch(next);
    };
  }

  return function wrappedHandler(req, res, next) {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
}

const METHODS = ['use', 'all', 'get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

function asyncRouter(options) {
  const router = express.Router(options);

  for (const method of METHODS) {
    const original = router[method].bind(router);
    router[method] = (...args) => original(...args.map(wrap));
  }

  return router;
}

module.exports = asyncRouter;
