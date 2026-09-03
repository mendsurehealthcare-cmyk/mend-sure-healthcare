// Regenerates the country and city lists used by the autocomplete fields.
//
//   npm run build:locations
//
// Source: https://github.com/dr5hn/countries-states-cities-database (ODbL).
// The upstream dataset is ~44MB across all countries, which has no business in
// a browser bundle, so this trims it down to the two lists the site actually
// needs — every country, and every city in India — and writes them to
// client/src/data/. Those outputs are committed, so a deploy never depends on
// GitHub being reachable at build time. Re-run this only when you want to pick
// up upstream corrections.
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json';
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'client', 'src', 'data');

async function fetchJson(file) {
  const url = `${REPO}/${encodeURIComponent(file)}`;
  process.stdout.write(`Fetching ${file}... `);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}. The upstream file layout may have changed.`);
  }

  const data = await response.json();
  console.log(`${data.length} records`);
  return data;
}

async function writeJson(name, data) {
  const path = join(OUT_DIR, name);
  // Written minified: these are generated build inputs, not files anyone edits
  // by hand, and the whitespace would roughly double the shipped bytes.
  await writeFile(path, `${JSON.stringify(data)}\n`, 'utf8');
  const kb = (JSON.stringify(data).length / 1024).toFixed(1);
  console.log(`  -> client/src/data/${name} (${kb} KB raw)`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // Countries: name plus the ISO code and flag emoji the dropdown displays.
  const rawCountries = await fetchJson('countries.json');
  const countries = rawCountries
    .map((country) => ({ name: country.name, code: country.iso2, flag: country.emoji }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Cities: countries+cities.json is keyed by country name and holds a flat
  // array of city-name strings, which is all the autocomplete needs.
  const rawCities = await fetchJson('countries+cities.json');
  const india = rawCities.find((country) => country.name === 'India');
  if (!india) {
    throw new Error('No "India" entry in countries+cities.json — check the upstream schema.');
  }

  const cities = [...new Set(india.cities)].sort((a, b) => a.localeCompare(b));

  await writeJson('countries.json', countries);
  await writeJson('india-cities.json', cities);

  console.log(`\nDone. ${countries.length} countries, ${cities.length} Indian cities.`);
  console.log('Data © dr5hn/countries-states-cities-database, licensed ODbL.');
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exitCode = 1;
});
