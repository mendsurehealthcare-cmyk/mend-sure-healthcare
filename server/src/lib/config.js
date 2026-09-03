// The environment variables the API cannot run without.
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

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

module.exports = { REQUIRED_ENV, missingEnv };
