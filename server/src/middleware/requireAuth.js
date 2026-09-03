const verifyToken = require('../lib/verifyToken');

// Reads the "Authorization: Bearer <token>" header, asks Supabase who that
// token belongs to, and attaches the user's id to the request. Every
// profile/report route runs this first so patients can only ever see their
// own data.
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Please log in first.' });
  }

  const user = await verifyToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
  }

  req.userId = user.id;
  req.userEmail = user.email;
  next();
}

module.exports = requireAuth;
