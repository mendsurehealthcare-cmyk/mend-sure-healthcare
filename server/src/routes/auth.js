/*
  The patient profile.

  Signing up, logging in, sending and checking the emailed code, and ending a
  session are all Clerk's job now and happen entirely in the browser against
  Clerk's own API — so there is no signup, login, refresh or password endpoint
  here any more, and no password ever reaches this server.

  What stays is the row that hangs off a Clerk account: the name, phone and
  country a patient fills in, which are ours rather than Clerk's because the
  care team reads them alongside the enquiries and reports keyed by the same
  id.
*/
const asyncRouter = require('../lib/asyncRouter');
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/requireAuth');

const router = asyncRouter();

const PROFILE_FIELDS = 'full_name, phone, country, created_at';

/*
  Returns the caller's profile, creating it on first sight.

  Under Supabase auth a database trigger on auth.users created this row at
  signup. Clerk accounts live outside the database entirely, so there is
  nothing for a trigger to fire on and the row is made here instead — on
  whichever request first arrives for an id we have never seen, which is this
  one, because the app loads the profile as soon as a patient is known.
*/
async function loadOrCreateProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_FIELDS)
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (data) return data;

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({ id: userId })
    .select(PROFILE_FIELDS)
    .single();

  if (insertError) throw new Error(insertError.message);
  return created;
}

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  res.json(await loadOrCreateProfile(req.userId));
});

// PATCH /api/auth/me
router.patch('/me', requireAuth, async (req, res) => {
  const { fullName, phone, country } = req.body;

  // Upsert rather than update: a patient who edits their details before
  // anything else has read their profile would otherwise update nothing and
  // be told it saved.
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      { id: req.userId, full_name: fullName, phone, country },
      { onConflict: 'id' }
    )
    .select(PROFILE_FIELDS)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;
