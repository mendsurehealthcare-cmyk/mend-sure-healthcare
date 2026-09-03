const asyncRouter = require('../lib/asyncRouter');
const supabase = require('../supabaseClient');
const { getPageRange, sendPage } = require('../lib/pagination');

const router = asyncRouter();

const SORTABLE_COLUMNS = new Set(['name', 'price_min_usd']);

// GET /api/treatments?specialty=Cardiac Surgery&sort=price_min_usd&order=asc&page=1&pageSize=20
router.get('/', async (req, res) => {
  const sort = SORTABLE_COLUMNS.has(req.query.sort) ? req.query.sort : 'name';
  const ascending = req.query.order !== 'desc';
  const { from, to } = getPageRange(req);

  let query = supabase
    .from('treatments')
    .select('*', { count: 'exact' })
    .order(sort, { ascending })
    .range(from, to);

  if (req.query.specialty) {
    query = query.eq('specialty', req.query.specialty);
  }

  await sendPage(res, query);
});

// GET /api/treatments/:slug
router.get('/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('treatments')
    .select(
      '*, hospital_treatments(price_min_usd, price_max_usd, hospitals(id, name, slug, city, image_url, accreditations))'
    )
    .eq('slug', req.params.slug)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Treatment not found' });
  }

  res.json(data);
});

module.exports = router;
