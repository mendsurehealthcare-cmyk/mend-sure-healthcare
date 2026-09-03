const { createClient } = require('@supabase/supabase-js');
const { missingEnv } = require('./lib/config');

// We use the service role key here (never the anon key) because this client
// only ever runs on the server, and it needs to read/write regardless of the
// row-level security policies a public client would be limited by.
//
// Creation is deferred to the first actual call rather than done at import.
// Throwing while this module loads takes the whole Express app down with it,
// which on Vercel shows up as a bare FUNCTION_INVOCATION_FAILED on every
// route — including /api/health — with the real reason buried in the function
// logs. Staying importable lets app.js answer with a 503 that names the
// missing variables instead.
let client = null;

function getClient() {
  if (client) return client;

  const missing = missingEnv();
  if (missing.length > 0) {
    throw new Error(`Supabase is not configured: ${missing.join(' and ')} not set.`);
  }

  client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return client;
}

// A proxy so the ~30 existing `supabase.from(...)` / `supabase.storage` call
// sites keep working untouched while creation stays lazy.
module.exports = new Proxy(
  {},
  {
    get(_target, property) {
      const instance = getClient();
      const value = instance[property];
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  }
);
