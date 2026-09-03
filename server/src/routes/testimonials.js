const asyncRouter = require('../lib/asyncRouter');
const supabase = require('../supabaseClient');

const router = asyncRouter();

// GET /api/testimonials
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Testimonials query failed:', error);
    return res.status(500).json({ error: 'Could not load patient stories. Please try again shortly.' });
  }

  res.json(data);
});

module.exports = router;
