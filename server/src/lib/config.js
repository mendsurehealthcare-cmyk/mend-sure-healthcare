// The environment variables the API cannot run without.
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

function missingEnv() {
  return REQUIRED_ENV.filter((key) => !process.env[key]);
}

module.exports = { REQUIRED_ENV, missingEnv };
