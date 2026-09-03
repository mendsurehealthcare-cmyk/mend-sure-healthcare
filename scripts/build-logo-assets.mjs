// Turns the master logo artwork in images/logo/ into the web-sized assets the
// site actually loads.
//
//   npm run build:logo
//
// The originals are ~1MB each at over 1200px square — fine as masters, far too
// heavy to ship to a phone for a 36px navbar icon. This crops them to their
// real content, resizes, and writes optimised PNGs into client/public/, which
// are committed so a deploy needs neither this script nor sharp.
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TRANSPARENT = join(ROOT, 'images', 'logo', 'logo remove background.PNG');
const ON_WHITE = join(ROOT, 'images', 'logo', 'logo with background .PNG');
const OUT = join(ROOT, 'client', 'public');

// Content regions measured from the transparent master's alpha channel. The
// artwork separates into three bands with clear empty rows between them:
// the roundel, the MENDSURE wordmark, and the HEALTHCARE SERVICES rule.
const MARK = { left: 424, top: 23, width: 686, height: 680 };
const LOCKUP = { left: 181, top: 23, width: 1174, height: 933 };

async function markSquare(size) {
  // Pad the roundel to a true square before resizing, so it never distorts and
  // sits identically whether it's rendered at 28px or 128px.
  const side = Math.max(MARK.width, MARK.height);

  return sharp(TRANSPARENT)
    .extract(MARK)
    .extend({
      top: Math.floor((side - MARK.height) / 2),
      bottom: Math.ceil((side - MARK.height) / 2),
      left: Math.floor((side - MARK.width) / 2),
      right: Math.ceil((side - MARK.width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

async function write(name, buffer) {
  const path = join(OUT, name);
  await sharp(buffer).toFile(path);
  const { size } = await stat(path);
  console.log(`  ${name.padEnd(24)} ${(size / 1024).toFixed(1)} KB`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log('Writing to client/public/');

  // The roundel on its own — navbar, footer, and anywhere the full stacked
  // lockup would be too tall.
  await write('logo-mark.png', await markSquare(256));

  // The complete stacked lockup: roundel + MENDSURE + HEALTHCARE SERVICES.
  // Only legible on light backgrounds — the wordmark is navy.
  // Palette-quantised: the artwork is a handful of flat brand colours plus
  // gradients, so 256 indexed colours are visually indistinguishable here and
  // cut the file to a quarter of the truecolour size.
  await write(
    'logo-lockup.png',
    await sharp(TRANSPARENT)
      .extract(LOCKUP)
      .resize({ width: 720 })
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toBuffer()
  );

  // Browser tab icon.
  await write('favicon-32.png', await markSquare(32));
  await write('favicon-192.png', await markSquare(192));

  // iOS home-screen tile. The roundel only — at 180px the full lockup's
  // "HEALTHCARE SERVICES" rule is far below legible, and a tile crowded with
  // unreadable text reads worse than a clean mark. Flattened onto white
  // because iOS composites these onto an opaque tile, so a transparent source
  // would come out sitting on black.
  await write(
    'apple-touch-icon.png',
    await sharp(await markSquare(156))
      .extend({ top: 12, bottom: 12, left: 12, right: 12, background: '#ffffff' })
      .flatten({ background: '#ffffff' })
      .png({ compressionLevel: 9 })
      .toBuffer()
  );

  // Social preview card: opaque and 1.91:1, the ratio Facebook, LinkedIn, and
  // X all crop to. JPEG rather than PNG because it has no transparency to
  // preserve and the gradients cost far less this way.
  await write(
    'og-image.jpg',
    await sharp(ON_WHITE)
      .resize(1200, 630, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer()
  );

  const files = await readdir(OUT);
  console.log(`\nDone. client/public now holds: ${files.join(', ')}`);
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exitCode = 1;
});
