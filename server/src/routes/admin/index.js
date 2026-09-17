const asyncRouter = require('../../lib/asyncRouter');
const supabase = require('../../supabaseClient');
const requireAuth = require('../../middleware/requireAuth');
const requireAdmin = require('../../middleware/requireAdmin');
const doctorsRouter = require('./doctors');
const hospitalsRouter = require('./hospitals');

const router = asyncRouter();

// Every route under /api/admin needs a logged-in admin. This is the real
// enforcement — the dashboard's client-side route guard only improves the
// experience for everyone else by not showing them a dashboard they can't
// use.
router.use(requireAuth, requireAdmin);

// GET /api/admin/overview — counts for the dashboard landing page.
router.get('/overview', async (req, res) => {
  const [doctors, hospitals] = await Promise.all([
    supabase.from('doctors').select('id', { count: 'exact', head: true }),
    supabase.from('hospitals').select('id', { count: 'exact', head: true }),
  ]);

  if (doctors.error || hospitals.error) {
    return res.status(500).json({
      error: (doctors.error || hospitals.error).message,
    });
  }

  res.json({
    doctors: doctors.count ?? 0,
    hospitals: hospitals.count ?? 0,
  });
});

router.use('/doctors', doctorsRouter);
router.use('/hospitals', hospitalsRouter);

module.exports = router;
