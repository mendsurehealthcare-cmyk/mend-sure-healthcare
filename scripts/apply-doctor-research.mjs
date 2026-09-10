// One-off: merges the researched bios and years of experience into
// server/db/doctors.json.
//
// The spreadsheet the directory was built from (images/hospital/Doctors list
// Top.xlsx) gives each doctor's name, designation, department and hospital,
// but not their experience or a biography — the two things a patient reads
// before choosing a specialist. Neither is guessable, so both were researched
// individually against each doctor's own hospital profile page and recorded
// in research.json, one entry per slug with the source page noted.
//
// Run once: node scripts/apply-doctor-research.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCTORS = join(ROOT, 'server', 'db', 'doctors.json');
const RESEARCH = process.argv[2];

if (!RESEARCH) {
  console.error('Usage: node scripts/apply-doctor-research.mjs <path-to-research.json>');
  process.exit(1);
}

const doctors = JSON.parse(await readFile(DOCTORS, 'utf8'));
const research = JSON.parse(await readFile(RESEARCH, 'utf8'));

const missing = doctors.filter((d) => !research[d.slug]);
if (missing.length > 0) {
  console.error(`Refusing to run: no research entry for ${missing.length} doctor(s):`);
  for (const d of missing) console.error(`  ${d.slug}`);
  process.exit(1);
}

const updated = doctors.map((doctor) => {
  const { experience_years: experienceYears, bio } = research[doctor.slug];
  // experience_years stays absent (rather than null) for doctors whose own
  // hospital profile states no figure — see doctors-schema.sql, which already
  // treats a missing value as "not shown" rather than "zero".
  const withExperience =
    experienceYears == null ? doctor : { ...doctor, experience_years: experienceYears };

  return { ...withExperience, bio };
});

await writeFile(DOCTORS, `${JSON.stringify(updated, null, 2)}\n`);

const withExp = updated.filter((d) => d.experience_years).length;
console.log(`Updated ${updated.length} doctors.`);
console.log(`  with years of experience: ${withExp}`);
console.log(`  without (left for a human to confirm): ${updated.length - withExp}`);
