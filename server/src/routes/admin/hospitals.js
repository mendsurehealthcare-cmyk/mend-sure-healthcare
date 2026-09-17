const asyncRouter = require('../../lib/asyncRouter');
const supabase = require('../../supabaseClient');
const { getPageRange, sendPage } = require('../../lib/pagination');

const router = asyncRouter();

const EDITABLE_FIELDS = [
  'name',
  'slug',
  'city',
  'address',
  'description',
  'hospital_type',
  'ownership',
  'established_year',
  'bed_count',
  'icu_beds',
  'timings',
  'accreditations',
  'departments',
  'gallery_urls',
  'image_url',
  'is_placeholder',
];

const ARRAY_FIELDS = new Set(['accreditations', 'departments', 'gallery_urls']);
const NUMBER_FIELDS = new Set(['established_year', 'bed_count', 'icu_beds']);
const BOOLEAN_FIELDS = new Set(['is_placeholder']);

function normalizeValue(field, value) {
  if (ARRAY_FIELDS.has(field)) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    return [];
  }

  if (NUMBER_FIELDS.has(field)) {
    if (value === '' || value === null || value === undefined) return null;
    const num = Number(value);
    return Number.isInteger(num) ? num : null;
  }

  if (BOOLEAN_FIELDS.has(field)) {
    return Boolean(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }

  return value ?? null;
}

function buildPayload(body) {
  const payload = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) payload[field] = normalizeValue(field, body[field]);
  }
  return payload;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function validate(payload, partial) {
  if ((!partial || 'name' in payload) && !payload.name) {
    return 'Please enter the hospital’s name.';
  }
  if ((!partial || 'slug' in payload) && !payload.slug) {
    return 'Please enter a URL slug (e.g. my-hospital-name).';
  }
  if (payload.slug && !SLUG_PATTERN.test(payload.slug)) {
    return 'The slug can only contain lowercase letters, numbers, and hyphens.';
  }
  return null;
}

// GET /api/admin/hospitals
router.get('/', async (req, res) => {
  const { from, to } = getPageRange({ query: { ...req.query, pageSize: req.query.pageSize || 300 } });

  const query = supabase
    .from('hospitals')
    .select('id, name, slug, city, image_url, is_placeholder', { count: 'exact' })
    .order('name', { ascending: true })
    .range(from, to);

  await sendPage(res, query);
});

// GET /api/admin/hospitals/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data) {
    return res.status(404).json({ error: 'Hospital not found.' });
  }

  res.json(data);
});

// POST /api/admin/hospitals
router.post('/', async (req, res) => {
  const payload = buildPayload(req.body);
  const validationError = validate(payload);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { data, error } = await supabase.from('hospitals').insert(payload).select('*').single();

  if (error) {
    const message = /duplicate key.*slug/i.test(error.message)
      ? 'A hospital with that slug already exists. Please choose a different one.'
      : error.message;
    return res.status(400).json({ error: message });
  }

  res.status(201).json(data);
});

// PATCH /api/admin/hospitals/:id
router.patch('/:id', async (req, res) => {
  const payload = buildPayload(req.body);
  const validationError = validate(payload, true);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { data, error } = await supabase
    .from('hospitals')
    .update(payload)
    .eq('id', req.params.id)
    .select('*')
    .maybeSingle();

  if (error) {
    const message = /duplicate key.*slug/i.test(error.message)
      ? 'A hospital with that slug already exists. Please choose a different one.'
      : error.message;
    return res.status(400).json({ error: message });
  }
  if (!data) {
    return res.status(404).json({ error: 'Hospital not found.' });
  }

  res.json(data);
});

// DELETE /api/admin/hospitals/:id
router.delete('/:id', async (req, res) => {
  // Doctors keep their hospital_id set to null automatically (on delete set
  // null, per schema.sql) — they don't get deleted along with the hospital.
  const { error } = await supabase.from('hospitals').delete().eq('id', req.params.id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
});

module.exports = router;
