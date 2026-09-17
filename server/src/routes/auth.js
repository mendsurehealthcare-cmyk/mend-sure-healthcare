/*
  The patient profile.

  Signing up, logging in, sending and checking the emailed code, and ending a
  session are all Clerk's job now and happen entirely in the browser against
  Clerk's own API — so there is no signup, login, refresh or password endpoint
  here any more, and no password ever reaches this server.

  What stays is the row that hangs off a Clerk account: the name, phone and
  country a patient fills in, which are ours rather than Clerk's because the
  care team reads them alongside the enquiries and reports keyed by the same
  id. `email` is a synced-not-owned copy — Clerk is still the source of truth
  for it, but a copy is kept here too so a profile row is identifiable by more
  than a Clerk id when browsing the table directly. It's kept fresh by being
  re-written on every login (see loadOrCreateProfile) rather than trusted to
  stay accurate from a single write at signup.
*/
const asyncRouter = require('../lib/asyncRouter');
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/requireAuth');

const router = asyncRouter();

// Progressively smaller field lists, tried in order. Lets profiles keep
// working before server/db/admin-schema.sql (adds `role`) and/or
// server/db/profiles-email.sql (adds `email`) have been run yet, rather than
// failing outright — each column is independently optional from the API's
// point of view.
const FIELD_TIERS = [
  'full_name, phone, country, created_at, role, email', // both columns present
  'full_name, phone, country, created_at, role', // role only
  'full_name, phone, country, created_at', // neither
];

const isMissingColumn = (error) => /column .* does not exist/i.test(error?.message || '');

function withDefaults(row, tier) {
  if (!row) return row;
  return {
    ...row,
    role: tier <= 1 ? row.role : 'patient',
    email: tier === 0 ? row.email : null,
  };
}

// Runs `run(fields)` against each tier's field list until one doesn't fail on
// a missing column, applying that tier's defaults to whatever row comes back.
async function withFieldFallback(run) {
  for (let tier = 0; tier < FIELD_TIERS.length; tier++) {
    const { data, error } = await run(FIELD_TIERS[tier]);
    if (!error) return { data: withDefaults(data, tier), tier, error: null };
    if (!isMissingColumn(error) || tier === FIELD_TIERS.length - 1) {
      return { data: null, tier, error };
    }
  }
}

/*
  Returns the caller's profile, creating it on first sight.

  Under Supabase auth a database trigger on auth.users created this row at
  signup. Clerk accounts live outside the database entirely, so there is
  nothing for a trigger to fire on and the row is made here instead — on
  whichever request first arrives for an id we have never seen, which is this
  one, because the app loads the profile as soon as a patient is known.

  `email` comes from the caller (the browser already has Clerk's live value)
  rather than being looked up here, since verifying it against Clerk on every
  single profile load would mean an extra network call on every page view for
  a field that isn't security-sensitive — it's a display/lookup convenience,
  not an identity check.
*/
async function loadOrCreateProfile(userId, email) {
  const found = await withFieldFallback((fields) =>
    supabase.from('profiles').select(fields).eq('id', userId).maybeSingle()
  );
  if (found.error) throw new Error(found.error.message);

  if (found.data) {
    // Keep the stored copy in sync. Best-effort: if this write fails, the
    // profile the caller already has is still correct, just not re-synced
    // this time around.
    if (found.tier === 0 && email && found.data.email !== email) {
      const { error: syncError } = await supabase
        .from('profiles')
        .update({ email })
        .eq('id', userId);
      if (!syncError) found.data.email = email;
    }
    return found.data;
  }

  const insertPayload = found.tier === 0 ? { id: userId, email: email || null } : { id: userId };

  const created = await withFieldFallback((fields) =>
    supabase.from('profiles').insert(insertPayload).select(fields).single()
  );
  if (created.error) throw new Error(created.error.message);
  return created.data;
}

// GET /api/auth/me?email=... — the email is optional; when present it's
// synced onto the stored row (see loadOrCreateProfile above).
router.get('/me', requireAuth, async (req, res) => {
  res.json(await loadOrCreateProfile(req.userId, req.query.email || null));
});

// PATCH /api/auth/me
router.patch('/me', requireAuth, async (req, res) => {
  const { fullName, phone, country, email } = req.body;
  const basePayload = { id: req.userId, full_name: fullName, phone, country };

  // `email` is only added to the payload for the tier that has the column —
  // an `undefined` value is dropped by JSON.stringify, so upserting without
  // it leaves any existing stored email untouched rather than nulling it out.
  const result = await withFieldFallback((fields) =>
    supabase
      .from('profiles')
      .upsert(fields.includes('email') ? { ...basePayload, email } : basePayload, {
        onConflict: 'id',
      })
      .select(fields)
      .single()
  );

  if (result.error) {
    return res.status(500).json({ error: result.error.message });
  }

  res.json(result.data);
});

module.exports = router;
