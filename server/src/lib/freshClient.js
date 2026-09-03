const { createClient } = require('@supabase/supabase-js');

// Returns a brand-new Supabase client instance every time it's called.
//
// Auth methods (signUp, signInWithPassword, refreshSession, getUser) mutate
// the *instance* they're called on to remember who's logged in. The rest of
// the app shares one client instance (server/src/supabaseClient.js) for
// every database/storage call, always as the service role — so calling any
// of those auth methods on that shared instance silently switches its
// identity, and every other request relying on it for service-role access
// starts failing (or worse, silently running as whoever last logged in).
//
// Anything that needs to call a Supabase auth method gets its own
// throwaway client from here instead.
function freshClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

module.exports = freshClient;
