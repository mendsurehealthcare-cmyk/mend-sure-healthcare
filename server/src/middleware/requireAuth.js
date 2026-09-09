const verifyToken = require('../lib/verifyToken');
const { missingAuthEnv } = require('../lib/config');

// Reads the "Authorization: Bearer <token>" header, verifies it as a Clerk
// session token, and attaches the user's id to the request. Every
// profile/report route runs this first so patients can only ever see their
// own data.
//
// The email deliberately isn't read here. Clerk's session token doesn't carry
// one unless the instance is configured to add it as a custom claim, and the
// browser already knows the address from Clerk's own session — so the client
// supplies it for display and the API keys everything on the id alone.
async function requireAuth(req, res, next) {
  // Told apart from a bad token deliberately. With no secret key every token
  // fails to verify, and answering 401 would log the patient out and send them
  // back to a login page that then signs them straight in again — a loop with
  // no way out and nothing in it naming the cause.
  const missing = missingAuthEnv();
  if (missing.length > 0) {
    console.error(`Refusing authenticated request: missing env ${missing.join(', ')}`);
    return res.status(503).json({
      error: 'Accounts are temporarily unavailable. Please try again shortly.',
    });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Please log in first.' });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
  }

  req.userId = payload.sub;
  next();
}

module.exports = requireAuth;
