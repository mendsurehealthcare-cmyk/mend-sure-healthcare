const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    'Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. ' +
    'Copy server/.env.example to server/.env and fill in your Supabase project details.'
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
