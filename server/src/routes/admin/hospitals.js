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
  'department_heads',
  'gallery_urls',
  'image_url',
  'is_placeholder',
];

const ARRAY_FIELDS = new Set(['accreditations', 'departments', 'gallery_urls']);
const NUMBER_FIELDS = new Set(['established_year', 'bed_count', 'icu_beds']);
const BOOLEAN_FIELDS = new Set(['is_placeholder']);
const JSON_ARRAY_FIELDS = new Set(['department_heads']);

// Every named department head is a real person and gets a real
// /doctors/:slug page — matched to their existing profile when one exists,
// otherwise a bare placeholder created for them on the spot (the client
// fills in the rest of that profile later, same as any other placeholder
// doctor). Runs on every save of department_heads, not just the initial
// import, so an admin typing a brand-new name into the CMS gets it linked
// automatically instead of the link silently going nowhere.
function norm(name) {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[.,]/g, ' ')
    .replace(/^\s*(dr|prof)\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// A couple of known cases where department-head text shortens a name
// relative to how the same real person is spelled in the main doctors table
// (a dropped "Kumar", an abbreviated middle name).
const NAME_ALIASES = new Map(
  [
    ['Dr. Pradeep Bansal', 'Dr. Pradeep Kumar Bansal'],
    ['Dr. Manoj K. Goel', 'Dr. Manoj Kumar Goel'],
  ].map(([short, full]) => [norm(short), norm(full)])
);

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function linkDepartmentHeads(hospitalId, departmentHeads) {
  if (!Array.isArray(departmentHeads) || departmentHeads.length === 0) return departmentHeads;
  const anyNamed = departmentHeads.some((dept) => (dept.heads || []).some((h) => h?.name));
  if (!anyNamed) return departmentHeads;

  const { data: doctors, error } = await supabase.from('doctors').select('name, slug');
  if (error) throw error;

  const byNorm = new Map();
  for (const doctor of doctors || []) {
    const key = norm(doctor.name);
    if (!byNorm.has(key)) byNorm.set(key, doctor.slug);
  }
  const takenSlugs = new Set((doctors || []).map((d) => d.slug));
  const newDoctors = [];

  const linked = departmentHeads.map((dept) => ({
    ...dept,
    heads: (dept.heads || []).map((head) => {
      if (!head?.name) return head;

      const key = norm(head.name);
      const existingSlug = byNorm.get(NAME_ALIASES.get(key) ?? key);
      if (existingSlug) return { ...head, doctorSlug: existingSlug };

      const base = head.image_url
        ? head.image_url.split('/').pop().replace(/\.[a-z0-9]+$/i, '')
        : slugify(head.name.replace(/\([^)]*\)/g, ' ').replace(/[.,]/g, ''));
      let slug = base;
      let n = 2;
      while (takenSlugs.has(slug)) {
        slug = `${base}-${n}`;
        n += 1;
      }
      takenSlugs.add(slug);
      byNorm.set(key, slug);

      newDoctors.push({
        name: head.name,
        slug,
        specialty: dept.department,
        designation: head.title || null,
        hospital_id: hospitalId,
        image_url: head.image_url || null,
        is_placeholder: true,
      });

      return { ...head, doctorSlug: slug };
    }),
  }));

  if (newDoctors.length > 0) {
    const { error: insertError } = await supabase.from('doctors').insert(newDoctors);
    if (insertError) throw insertError;
  }

  return linked;
}

function normalizeValue(field, value) {
  if (ARRAY_FIELDS.has(field)) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    return [];
  }

  // Structured data (department name + named heads), unlike the plain
  // string lists above — passed through as-is rather than trimmed to
  // strings, since each entry is an object.
  if (JSON_ARRAY_FIELDS.has(field)) {
    return Array.isArray(value) ? value : [];
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

  if (Array.isArray(payload.department_heads) && payload.department_heads.length > 0) {
    const linked = await linkDepartmentHeads(data.id, payload.department_heads);
    const { data: relinked, error: relinkError } = await supabase
      .from('hospitals')
      .update({ department_heads: linked })
      .eq('id', data.id)
      .select('*')
      .single();
    if (!relinkError) return res.status(201).json(relinked);
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

  if (Array.isArray(payload.department_heads)) {
    payload.department_heads = await linkDepartmentHeads(req.params.id, payload.department_heads);
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
