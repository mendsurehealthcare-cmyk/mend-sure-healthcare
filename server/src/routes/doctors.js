const asyncRouter = require('../lib/asyncRouter');
const supabase = require('../supabaseClient');
const { getPageRange, sendPage, fetchFullRange } = require('../lib/pagination');

const router = asyncRouter();

const SORTABLE_COLUMNS = new Set(['name', 'experience_years']);

// GET /api/doctors?hospital=some-hospital-slug&specialty=Cardiac Surgery&sort=name&order=asc&page=1&pageSize=20
router.get('/', async (req, res) => {
  const sort = SORTABLE_COLUMNS.has(req.query.sort) ? req.query.sort : 'name';
  const ascending = req.query.order !== 'desc';
  const { from, to } = getPageRange(req);

  // Featured doctors lead the listing, then the requested sort within each
  // group. Ordering happens in the database rather than the browser because
  // the results are paginated — sorting only the current page would put
  // featured doctors at the top of every page instead of the top of the list.
  //
  // `is_priority` only exists once server/db/doctors-schema.sql has been run,
  // so it is applied conditionally: the directory still lists correctly on a
  // database that hasn't had that migration applied yet, just unranked.
  //
  // Takes the range as arguments rather than closing over `from`/`to`:
  // fetchFullRange below needs to build a fresh sub-range query per call,
  // since a Supabase query object can only be awaited once.
  const buildQuery = (withPriority) => (rangeFrom, rangeTo) => {
    let q = supabase.from('doctors').select('*, hospitals(id, name, slug, city)', { count: 'exact' });
    if (withPriority) q = q.order('is_priority', { ascending: false });
    q = q.order(sort, { ascending }).range(rangeFrom, rangeTo);

    if (req.query.specialty) q = q.eq('specialty', req.query.specialty);
    if (hospitalId) q = q.eq('hospital_id', hospitalId);
    return q;
  };

  let hospitalId = null;
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

    hospitalId = hospital.id;
  }

  let result = await fetchFullRange(buildQuery(true), from, to);

  if (result.error && /is_priority/.test(result.error.message)) {
    console.warn(
      'doctors.is_priority is missing — run server/db/doctors-schema.sql to enable featured ordering.'
    );
    result = await fetchFullRange(buildQuery(false), from, to);
  }

  await sendPage(res, result);
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
