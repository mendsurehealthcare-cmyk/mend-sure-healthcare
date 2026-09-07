// Loads the doctor directory in server/db/doctors.json into Supabase.
//
//   npm run load:doctors
//
// Run server/db/doctors-schema.sql in the Supabase SQL editor first — this
// needs the designation, department, hospital_name and is_priority columns.
//
// Safe to run repeatedly: it matches on `slug` and updates in place, so
// editing doctors.json and re-running is the way to correct the directory.
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'server', 'db', 'doctors.json');

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.\n' +
      'Copy server/.env.example to server/.env and fill them in, then run this from the repo root.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const doctors = JSON.parse(await readFile(DATA, 'utf8'));
  console.log(`Read ${doctors.length} doctors from server/db/doctors.json`);

  // Resolve hospital slugs to ids in one query rather than per doctor.
  const { data: hospitals, error: hospitalError } = await supabase
    .from('hospitals')
    .select('id, slug');
  if (hospitalError) throw new Error(`Could not read hospitals: ${hospitalError.message}`);

  const idBySlug = new Map(hospitals.map((h) => [h.slug, h.id]));

  const unmatched = new Set();
  const rows = doctors.map(({ hospital_slug: hospitalSlug, ...doctor }) => {
    if (hospitalSlug && !idBySlug.has(hospitalSlug)) unmatched.add(hospitalSlug);
    return { ...doctor, hospital_id: hospitalSlug ? (idBySlug.get(hospitalSlug) ?? null) : null };
  });

  if (unmatched.size > 0) {
    console.warn(
      `\nWarning: no hospital row for slug(s): ${[...unmatched].join(', ')}.` +
        '\nThose doctors load with the hospital name as text but no link.'
    );
  }

  // The four richer columns only exist once doctors-schema.sql has been run.
  // Rather than refusing to load anything, drop them and load the rest — the
  // directory is far more useful listed without job titles than not listed at
  // all, and re-running after the migration fills them in.
  const EXTRA = ['designation', 'department', 'hospital_name', 'is_priority'];
  const { error: probe } = await supabase.from('doctors').select(EXTRA.join(', ')).limit(1);
  const hasExtraColumns = !probe;

  const payload = hasExtraColumns
    ? rows
    : rows.map(({ designation, department, hospital_name: _h, is_priority: _p, ...rest }) => ({
        ...rest,
        // Without the dedicated columns, the job title and department still
        // reach the patient through the bio sentence.
        bio: rest.bio || `${designation}, ${department}.`,
      }));

  const { data, error } = await supabase
    .from('doctors')
    .upsert(payload, { onConflict: 'slug' })
    .select('id');

  if (error) throw new Error(error.message);

  console.log(`\nUpserted ${data.length} doctors.`);

  const linked = rows.filter((r) => r.hospital_id).length;
  console.log(`  linked to a hospital page:    ${linked}`);
  console.log(`  hospital stored as text only: ${rows.length - linked}`);

  if (hasExtraColumns) {
    console.log(`  featured (priority):          ${rows.filter((r) => r.is_priority).length}`);
  } else {
    console.log(
      '\nNote: designation, department, hospital_name and is_priority were skipped —' +
        '\nthose columns do not exist yet. Run server/db/doctors-schema.sql in the' +
        '\nSupabase SQL editor, then re-run this script to fill them in.'
    );
  }
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exitCode = 1;
});
