const asyncRouter = require('../../lib/asyncRouter');
const supabase = require('../../supabaseClient');
const { getPageRange, sendPage } = require('../../lib/pagination');

const router = asyncRouter();

// Every column the admin form can read or write. Keeps the insert/update
// payload to exactly the doctors columns that exist — anything else in the
// request body (a stray field, a typo) is silently dropped rather than
// surfacing as a confusing Postgres error.
const EDITABLE_FIELDS = [
  'name',
  'slug',
  'specialty',
  'designation',
  'department',
  'hospital_id',
  'hospital_name',
  'experience_years',
  'consultation_fee',
  'bio',
  'image_url',
  'education',
  'awards',
  'career_history',
  'publications',
  'is_priority',
  'is_placeholder',
];

const ARRAY_FIELDS = new Set(['education', 'awards', 'career_history', 'publications']);
const NUMBER_FIELDS = new Set(['experience_years', 'consultation_fee']);
const BOOLEAN_FIELDS = new Set(['is_priority', 'is_placeholder']);

// Turns raw form input into the exact shape each column expects, so a blank
// text input becomes null instead of an empty string sitting in a numeric or
// array column.
function normalizeValue(field, value) {
  if (ARRAY_FIELDS.has(field)) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    return [];
  }

  if (NUMBER_FIELDS.has(field)) {
    if (value === '' || value === null || value === undefined) return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }

  if (BOOLEAN_FIELDS.has(field)) {
    return Boolean(value);
  }

  if (field === 'hospital_id') {
    return value ? value : null;
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

// `partial` is true for an update, where only the fields actually present in
// the payload need checking — a doctor's name doesn't have to be resent just
// to change their bio.
function validate(payload, partial) {
  if ((!partial || 'name' in payload) && !payload.name) {
    return 'Please enter the doctor’s name.';
  }
  if ((!partial || 'slug' in payload) && !payload.slug) {
    return 'Please enter a URL slug (e.g. dr-jane-doe).';
  }
  if (payload.slug && !SLUG_PATTERN.test(payload.slug)) {
    return 'The slug can only contain lowercase letters, numbers, and hyphens.';
  }
  return null;
}

// GET /api/admin/doctors — the full list for the dashboard table. Unlike the
// public listing this isn't trimmed to card columns, since Edit needs every
// field anyway, and it isn't limited to non-placeholder rows.
router.get('/', async (req, res) => {
  const { from, to } = getPageRange({ query: { ...req.query, pageSize: req.query.pageSize || 300 } });

  const query = supabase
    .from('doctors')
    .select('id, name, slug, specialty, designation, hospital_name, image_url, is_priority, is_placeholder', {
      count: 'exact',
    })
    .order('name', { ascending: true })
    .range(from, to);

  await sendPage(res, query);
});

// GET /api/admin/doctors/:id — everything, for the edit form.
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data) {
    return res.status(404).json({ error: 'Doctor not found.' });
  }

  res.json(data);
});

// POST /api/admin/doctors
router.post('/', async (req, res) => {
  const payload = buildPayload(req.body);
  const validationError = validate(payload);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { data, error } = await supabase.from('doctors').insert(payload).select('*').single();

  if (error) {
    const message = /duplicate key.*slug/i.test(error.message)
      ? 'A doctor with that slug already exists. Please choose a different one.'
      : error.message;
    return res.status(400).json({ error: message });
  }

  res.status(201).json(data);
});

// PATCH /api/admin/doctors/:id
router.patch('/:id', async (req, res) => {
  const payload = buildPayload(req.body);
  const validationError = validate(payload, true);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { data, error } = await supabase
    .from('doctors')
    .update(payload)
    .eq('id', req.params.id)
    .select('*')
    .maybeSingle();

  if (error) {
    const message = /duplicate key.*slug/i.test(error.message)
      ? 'A doctor with that slug already exists. Please choose a different one.'
      : error.message;
    return res.status(400).json({ error: message });
  }
  if (!data) {
    return res.status(404).json({ error: 'Doctor not found.' });
  }

  res.json(data);
});

// DELETE /api/admin/doctors/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('doctors').delete().eq('id', req.params.id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
});

module.exports = router;
