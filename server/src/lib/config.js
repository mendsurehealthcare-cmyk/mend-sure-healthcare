// The environment variables no API route can run without.
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

// Needed only by the logged-in routes. Deliberately kept out of REQUIRED_ENV,
// which gates every /api request: the treatment, hospital and doctor listings
// and the enquiry form are the whole public site and none of them know or care
// who is asking. A deploy that is missing the Clerk key should lose its
// account pages, not its front door.
const AUTH_ENV = ['CLERK_SECRET_KEY'];

// Returns a list of human-readable problems with the current environment, or
// an empty array when everything needed is present and plausible.
//
// This deliberately checks shape, not connectivity: a health check that calls
// Supabase would add a round-trip to every probe and fail during unrelated
// outages. Shape alone catches the realistic mistakes — a variable left unset,
// or a URL pasted with a typo or a stray quote, which otherwise fails much
// later with "Invalid supabaseUrl" on every single request.
function missingEnv() {
  const problems = REQUIRED_ENV.filter((key) => !process.env[key]);

  if (problems.length === 0) {
    const url = process.env.SUPABASE_URL;
    let valid = false;

    try {
      const parsed = new URL(url);
      valid = parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      valid = false;
    }

    if (!valid) problems.push('SUPABASE_URL (set, but not a valid http/https URL)');
  }

  return problems;
}

/*
  The public origin this deployment is served from.

  Used to pin Clerk session tokens to this site — see verifyToken.js. Auth
  emails no longer point anywhere here: Clerk emails a six-digit code that the
  patient types back into the page they started on, so there is no link to
  build and no callback route to land on.
*/
function siteUrl() {
  const configured =
    process.env.PUBLIC_SITE_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  return configured.replace(/\/+$/, '');
}

// Which of the Clerk variables are missing. Surfaced by /api/health so a
// broken login can be diagnosed with one curl, and checked by requireAuth so
// the patient gets "temporarily unavailable" rather than "your session
// expired" — which would send them round the login loop forever.
function missingAuthEnv() {
  return AUTH_ENV.filter((key) => !process.env[key]);
}

module.exports = { REQUIRED_ENV, AUTH_ENV, missingEnv, missingAuthEnv, siteUrl };
