const asyncRouter = require('../lib/asyncRouter');
const rateLimit = require('express-rate-limit');
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/requireAuth');
const { notifyNewInquiry } = require('../lib/notifyTeam');
const verifyToken = require('../lib/verifyToken');

const router = asyncRouter();

// Limit how many quote requests one IP can submit, so a bot can't flood the table.
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  message: { error: 'Too many submissions from this IP. Please try again later.' },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/inquiries
router.post('/', inquiryLimiter, async (req, res) => {
  const {
    fullName,
    email,
    phone,
    country,
    treatmentInterested,
    message,
    sourcePage,
    // Honeypot field: real visitors never see or fill this input (it's hidden
    // with CSS on the form), so anything filling it in is almost certainly a bot.
    website,
    // Timestamp the form was rendered, sent back on submit. Bots tend to
    // submit instantly; real people take at least a couple of seconds.
    formLoadedAt,
  } = req.body;

  if (website) {
    // Silently pretend it worked so the bot doesn't learn anything.
    return res.status(200).json({ success: true });
  }

  if (formLoadedAt && Date.now() - Number(formLoadedAt) < 2000) {
    return res.status(400).json({ error: 'Please try submitting again.' });
  }

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required.' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Logging in isn't required to submit — but if the patient happens to be
  // logged in, we link the enquiry to their account so it shows up under
  // "my enquiries" later.
  let userId = null;
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const user = await verifyToken(authHeader.slice(7));
    if (user) userId = user.id;
  }

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      user_id: userId,
      full_name: fullName,
      email,
      phone,
      country: country || null,
      treatment_interested: treatmentInterested || null,
      message: message || null,
      source_page: sourcePage || null,
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  await notifyNewInquiry(data);

  res.status(201).json({ success: true, inquiry: data });
});

// GET /api/inquiries/mine — the logged-in patient's own past enquiries
router.get('/mine', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('id, full_name, treatment_interested, message, status, created_at')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;
