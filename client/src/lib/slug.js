// Turns a display name into the same kind of slug the doctors/hospitals
// tables already use ("Dr. Jane Doe" -> "dr-jane-doe").
export function slugify(value) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Textarea <-> array helpers for the list-style columns (education, awards,
// accreditations, ...): one entry per line in the form, one array item per
// entry in the database.
export function linesToArray(text) {
  return (text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function arrayToLines(value) {
  return Array.isArray(value) ? value.join('\n') : '';
}
