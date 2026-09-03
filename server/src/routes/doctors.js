const asyncRouter = require('../lib/asyncRouter');
const supabase = require('../supabaseClient');
const { getPageRange, sendPage } = require('../lib/pagination');

const router = asyncRouter();

const SORTABLE_COLUMNS = new Set(['name', 'experience_years']);

// GET /api/doctors?hospital=some-hospital-slug&specialty=Cardiac Surgery&sort=name&order=asc&page=1&pageSize=20
router.get('/', async (req, res) => {
  const sort = SORTABLE_COLUMNS.has(req.query.sort) ? req.query.sort : 'name';
  const ascending = req.query.order !== 'desc';
  const { from, to } = getPageRange(req);

  let query = supabase
    .from('doctors')
    .select('*, hospitals(id, name, slug, city)', { count: 'exact' })
    .order(sort, { ascending })
    .range(from, to);

  if (req.query.specialty) {
    query = query.eq('specialty', req.query.specialty);
  }

  if (req.query.hospital) {
    const { data: hospital } = await supabase
      .from('hospitals')
      .select('id')
      .eq('slug', req.query.hospital)
      .single();

    if (!hospital) {
      res.set('X-Total-Count', '0');
      return res.json([]);
    }

    query = query.eq('hospital_id', hospital.id);
  }

  await sendPage(res, query);
});

// GET /api/doctors/:slug
router.get('/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*, hospitals(id, name, slug, city)')
    .eq('slug', req.params.slug)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Doctor not found' });
  }

  res.json(data);
});

module.exports = router;
