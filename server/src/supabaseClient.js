const { createClient } = require('@supabase/supabase-js');

// Without these, createClient throws a bare "supabaseUrl is required" as the
// module loads, which on Vercel surfaces as a 500 on every single endpoint with
// no hint as to why. Fail loudly and say exactly what to set instead.
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set. ' +
    'Locally: copy server/.env.example to server/.env and fill them in. ' +
    'On Vercel: add them under Project Settings -> Environment Variables, then redeploy.'
  );
}

// We use the service role key here (never the anon key) because this client
// only ever runs on the server, and it needs to read/write regardless of the
// row-level security policies a public client would be limited by.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;
