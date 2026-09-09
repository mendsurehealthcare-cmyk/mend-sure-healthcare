// Turns the doctor and hospital photographs in images/ into the web-sized
// assets the directory cards actually load.
//
//   npm run build:images
//
// The originals are supplied at whatever size and shape the hospital's own
// site published them at — anything from a 220px thumbnail to a 6000px camera
// frame, portrait, landscape or square, JPEG, PNG, WebP or AVIF. The cards
// render them through a fixed-shape box, so this normalises the whole set to
// one size and one aspect ratio per kind, and writes optimised WebP into
// client/public/images/, which is committed so a deploy needs neither this
// script nor sharp.
//
// A source file is matched to a directory record by slugifying its filename
// and comparing that against the record's slug and its slugified name, so
// adding a photograph is a matter of dropping it in named after the doctor.
//
// Alongside the images it writes client/src/data/directory-images.json — the
// slug-to-path map the cards fall back on when a record carries no image_url
// of its own. Generated from the files that were actually written, so it
// cannot drift from what is on disk.
import sharp from 'sharp';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'client', 'public', 'images');
const MANIFEST = join(ROOT, 'client', 'src', 'data', 'directory-images.json');

const IMAGE_FILE = /\.(jpe?g|png|webp|avif)$/i;

// Filenames that don't slugify to any record, mapped to the record they
// belong to. Kept here, spelled out and one line each, rather than solved
// with fuzzy name matching: these are photographs of real, named people, and
// approximate matching would quietly put the wrong face on a profile.
//
//   dr-ramji-malhotra  "Dr. Ramji Malhotra.JPG.jpeg". The directory has no
//                      Malhotra by that first name and does have Dr. Ramji
//                      Mehrotra, so the filename is read as a misspelling.
//                      Worth confirming against the source photograph.
const ALIASES = {
  'dr-ramji-malhotra': 'dr-ramji-mehrotra',
};

const KINDS = [
  {
    key: 'doctors',
    source: join(ROOT, 'images', 'doctors'),
    records: join(ROOT, 'server', 'db', 'doctors.json'),
    // Square, because these are headshots and roughly half the originals are
    // already 1:1 — a landscape box would crop the top of every portrait one.
    width: 600,
    height: 600,
    // Portraits are cropped towards the top: the head is what has to survive,
    // and on a standing full-length shot a centred crop lands on the chest.
    // Landscape and square sources have little or nothing to lose vertically,
    // so they are cropped from the centre.
    position: (meta) => (meta.width / meta.height < 0.95 ? 'top' : 'centre'),
  },
  {
    key: 'hospitals',
    source: join(ROOT, 'images', 'hospital'),
    records: join(ROOT, 'server', 'db', 'hospitals.json'),
    // 3:2 landscape: every facility photograph supplied is a wide exterior
    // shot, and the card gives the image a landscape panel.
    width: 1200,
    height: 800,
    position: () => 'centre',
  },
];

// Matches the slugs already in the directory data: lowercase, punctuation
// dropped, runs of anything else collapsed to a single hyphen. The dash range
// is normalised first so "Medanta – The Medicity" and "Medanta - The
// Medicity" produce the same slug.
function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[‐-―]/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Several files carry a doubled extension ("Dr. Ajay Kaul.JPG.jpeg") from
// whatever downloaded them, so strip extensions until none is left.
function withoutExtension(filename) {
  let name = filename;
  while (IMAGE_FILE.test(name)) name = name.replace(IMAGE_FILE, '');
  return name;
}

// Photographs supplied as cut-outs — the subject masked out onto a
// transparent background. They are the ones that need a white background put
// behind them, and they must not be cropped: a cut-out is usually a
// half-length figure with the head close to the top edge, so cropping it to a
// square takes the head off. They are fitted whole onto a white panel
// instead.
async function isCutout(source) {
  const { hasAlpha } = await sharp(source).metadata();
  if (!hasAlpha) return false;

  const { channels } = await sharp(source).stats();
  const alpha = channels.at(-1);

  // Two things have to hold. Some transparency has to exist at all: a PNG can
  // carry an alpha channel that is opaque everywhere, which is a photograph
  // with a redundant channel. And a real share of the frame has to be
  // transparent, because a photograph saved with rounded corners is
  // transparent in well under a tenth of its area and is still a photograph —
  // it wants cropping like any other, not a white panel built around it.
  return alpha.min < 250 && alpha.mean < 240;
}

async function render(source, destination, kind) {
  const cutout = await isCutout(source);
  // autoOrient applies the EXIF orientation, and makes the width and height
  // that metadata() reports the ones the picture is actually seen at — which
  // is what decides whether a source counts as a portrait below. None of the
  // photographs supplied so far carry an orientation tag, but one straight off
  // a phone would.
  const open = () => sharp(source, { failOn: 'none', autoOrient: true });

  const pipeline = open();

  if (cutout) {
    pipeline
      // Drop the empty transparent margin first, so the figure fills as much
      // of the panel as it can rather than floating in the middle of it.
      .trim()
      .resize(kind.width, kind.height, { fit: 'contain', background: '#ffffff' });
  } else {
    const meta = await open().metadata();
    pipeline.resize(kind.width, kind.height, { fit: 'cover', position: kind.position(meta) });
  }

  await pipeline.flatten({ background: '#ffffff' }).webp({ quality: 80 }).toFile(destination);

  return cutout;
}

async function build(kind) {
  const records = JSON.parse(await readFile(kind.records, 'utf8'));

  // Both a record's own slug and its slugified name are accepted, because the
  // files are named after the doctor or hospital while several slugs are
  // shortened ("Aakash Healthcare Super Speciality Hospital" is
  // `aakash-healthcare`).
  const bySlug = new Map();
  for (const record of records) {
    bySlug.set(record.slug, record);
    bySlug.set(slugify(record.name), record);
  }

  const files = (await readdir(kind.source)).filter((file) => IMAGE_FILE.test(file));

  const outDir = join(PUBLIC_DIR, kind.key);
  // Cleared each run so a renamed or deleted source does not leave a stale
  // image behind that the manifest no longer points at.
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const manifest = {};
  const unmatched = [];
  let cutouts = 0;

  for (const file of files) {
    const slug = slugify(withoutExtension(file));
    const record = bySlug.get(ALIASES[slug] ?? slug);
    if (!record) {
      unmatched.push(file);
      continue;
    }

    const name = `${record.slug}.webp`;
    if (await render(join(kind.source, file), join(outDir, name), kind)) cutouts += 1;
    manifest[record.slug] = `/images/${kind.key}/${name}`;
  }

  const missing = records.filter((record) => !manifest[record.slug]);

  console.log(`\n${kind.key}: wrote ${Object.keys(manifest).length} of ${records.length}`);
  console.log(`  given a white background (cut-outs): ${cutouts}`);

  if (unmatched.length > 0) {
    console.warn(
      `\n  ${unmatched.length} file(s) matched no record and were skipped —` +
        '\n  rename them after the doctor or hospital to bring them in:'
    );
    for (const file of unmatched) console.warn(`    ${file}`);
  }

  if (missing.length > 0) {
    console.warn(
      `\n  ${missing.length} record(s) have no photograph. Their cards fall back` +
        '\n  to the tinted panel, which is by design rather than broken:'
    );
    for (const record of missing) console.warn(`    ${record.name}`);
  }

  // Sorted so a rebuild that changes nothing produces no diff.
  return Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
}

async function main() {
  const manifest = {};
  for (const kind of KINDS) manifest[kind.key] = await build(kind);

  await mkdir(dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nWrote client/src/data/directory-images.json`);
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exitCode = 1;
});
