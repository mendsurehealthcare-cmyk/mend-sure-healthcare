const asyncRouter = require('../lib/asyncRouter');
const supabase = require('../supabaseClient');
const { getPageRange, sendPage } = require('../lib/pagination');

const router = asyncRouter();

const SORTABLE_COLUMNS = new Set(['name', 'city']);

// GET /api/hospitals?city=Delhi&sort=name&order=asc&page=1&pageSize=20
router.get('/', async (req, res) => {
  const sort = SORTABLE_COLUMNS.has(req.query.sort) ? req.query.sort : 'name';
  const ascending = req.query.order !== 'desc';
  const { from, to } = getPageRange(req);

  let query = supabase
    .from('hospitals')
    .select('*', { count: 'exact' })
    .order(sort, { ascending })
    .range(from, to);

  if (req.query.city) {
    query = query.eq('city', req.query.city);
  }

  await sendPage(res, query);
});

// GET /api/hospitals/:slug
router.get('/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('hospitals')
    .select(
      '*, hospital_treatments(price_min_usd, price_max_usd, treatments(id, name, slug, specialty))'
    )
    .eq('slug', req.params.slug)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Hospital not found' });
  }

  res.json(data);
});

module.exports = router;
