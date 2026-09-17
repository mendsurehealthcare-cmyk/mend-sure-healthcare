const isAdmin = require('../lib/isAdmin');

// Runs after requireAuth (needs req.userId). Every admin write route uses
// this — never just the client-side route guard, which only hides the
// dashboard UI and proves nothing about who actually sent the request.
async function requireAdmin(req, res, next) {
  const admin = await isAdmin(req.userId);

  if (!admin) {
    return res.status(403).json({ error: 'You do not have access to this.' });
  }

  next();
}

module.exports = requireAdmin;
