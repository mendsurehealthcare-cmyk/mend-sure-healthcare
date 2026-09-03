const asyncRouter = require('../lib/asyncRouter');
const rateLimit = require('express-rate-limit');
const supabase = require('../supabaseClient');
const freshClient = require('../lib/freshClient');
const requireAuth = require('../middleware/requireAuth');

const router = asyncRouter();

// Login/signup/password-reset are classic brute-force & spam targets, so
// they're rate-limited the same way the lead-capture form already is.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/signup
router.post('/signup', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const { data, error } = await freshClient().auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data.session) {
    return res.status(201).json({
      message: 'Account created. Please check your email to confirm your address before logging in.',
    });
  }

  res.status(201).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  });
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const { data, error } = await freshClient().auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  });
});

// POST /api/auth/refresh — trades a refresh token for a new access token,
// so patients don't get logged out every time the 1-hour token expires.
router.post('/refresh', async (req, res) => {
  const { refresh_token: refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Missing refresh token.' });
  }

  const { data, error } = await freshClient().auth.refreshSession({ refresh_token: refreshToken });

  if (error) {
    return res.status(401).json({ error: 'Session could not be refreshed. Please log in again.' });
  }

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;

  if (email && EMAIL_REGEX.test(email)) {
    await freshClient().auth.resetPasswordForEmail(email);
  }

  // Always the same response, whether or not that email has an account —
  // otherwise this endpoint could be used to check who's registered.
  res.json({ message: 'If an account exists for that email, a reset link has been sent.' });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, phone, country, created_at')
    .eq('id', req.userId)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ email: req.userEmail, ...data });
});

// PATCH /api/auth/me
router.patch('/me', requireAuth, async (req, res) => {
  const { fullName, phone, country } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name: fullName, phone, country })
    .eq('id', req.userId)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ email: req.userEmail, ...data });
});

module.exports = router;
