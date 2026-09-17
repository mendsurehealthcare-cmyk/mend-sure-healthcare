// Hands the name/phone/country collected during sign-up off to whichever
// code runs next after the session actually exists — see AuthProvider.jsx,
// which applies these the first time it loads the freshly created profile.
//
// This exists because grabbing an auth token directly inside the sign-up
// form, right after setActive(), is a real race: Clerk's React hooks can
// still be holding the pre-login token getter for a moment, so that save
// would occasionally do nothing with no visible error. Stashing the details
// here and letting AuthProvider apply them once it's definitely signed in —
// through the same authFetch path every other save already uses reliably —
// removes that race instead of working around it.
const KEY = 'mendsure_pending_profile_details';

export function stashPendingProfileDetails(details) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(details));
  } catch {
    // Private browsing / storage disabled: the patient just fills these in
    // from the Account page instead, same as before this existed.
  }
}

// Single-use: removes the stashed value as soon as it's read, so a stale
// entry can never be re-applied to a later, unrelated sign-in in the same
// browser tab.
export function takePendingProfileDetails() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
