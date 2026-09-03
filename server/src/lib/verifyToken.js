const freshClient = require('./freshClient');

// Checks a patient's login token and returns the Supabase user it belongs
// to (or null). Uses a throwaway client (see freshClient.js) so this never
// touches the shared service-role client's identity.
async function verifyToken(token) {
  const { data, error } = await freshClient().auth.getUser(token);

  if (error || !data.user) return null;
  return data.user;
}

module.exports = verifyToken;
