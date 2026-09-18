// Converts between the department_heads JSON structure
// ([{ department, heads: [{ name, title, image_url }], note }]) and a
// plain-text format the admin form can edit, since the other array fields
// already use a "one per line" textarea and named department heads don't
// fit that shape (each department can have several named people, each
// optionally with a photo).
//
// Format: one department per block, separated by a blank line. First line
// is the department name; each following line is either:
//   Name — Title
//   Name — Title | https://photo-url
// for a named head (the "| photo url" part is optional), or "Note: ..."
// when no named head is publicly listed.
export function departmentHeadsToText(entries) {
  if (!Array.isArray(entries)) return '';

  return entries
    .map(({ department, heads, note }) => {
      const lines = [department];
      for (const head of heads || []) {
        if (!head?.name) continue;
        const namePart = `${head.name} — ${head.title || ''}`.trim().replace(/—\s*$/, '').trim();
        lines.push(head.image_url ? `${namePart} | ${head.image_url}` : namePart);
      }
      if (note) lines.push(`Note: ${note}`);
      return lines.join('\n');
    })
    .join('\n\n');
}

export function textToDepartmentHeads(text) {
  const blocks = (text || '')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const [department, ...rest] = block.split('\n').map((line) => line.trim()).filter(Boolean);
    const heads = [];
    let note = null;

    for (const line of rest) {
      const noteMatch = line.match(/^Note:\s*(.+)$/i);
      if (noteMatch) {
        note = noteMatch[1].trim();
        continue;
      }

      const [namePart, imageUrl] = line.split('|').map((part) => part.trim());
      const [name, ...titleParts] = namePart.split('—').map((part) => part.trim());
      if (!name) continue;

      const head = { name, title: titleParts.join('—').trim() || null };
      if (imageUrl) head.image_url = imageUrl;
      heads.push(head);
    }

    const entry = { department, heads };
    if (note) entry.note = note;
    return entry;
  });
}
