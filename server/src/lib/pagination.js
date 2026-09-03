const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// Turns ?page=&pageSize= into the { from, to } range Supabase's .range() wants,
// plus the page/pageSize actually used (after clamping) so routes can echo them back.
function getPageRange(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(req.query.pageSize, 10) || DEFAULT_PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return { page, pageSize, from, to };
}

// PostgREST answers a range that begins past the last row with an error
// (PGRST103) rather than an empty page. Left unhandled that turns every
// past-the-end request — a crawler walking ?page=, a "load more" that runs off
// the end, a stale link — into a 500, which is both wrong and noisy in the
// platform's error metrics. An empty list is the honest answer.
function isRangeBeyondEnd(error) {
  if (!error) return false;
  return error.code === 'PGRST103' || /range not satisfiable/i.test(error.message || '');
}

/*
  Runs a built list query and writes the response.

  Centralised so all four list endpoints agree on how an empty page, a real
  failure, and the X-Total-Count header are handled.
*/
async function sendPage(res, query) {
  const { data, error, count } = await query;

  if (error) {
    if (isRangeBeyondEnd(error)) {
      res.set('X-Total-Count', String(count ?? 0));
      return res.json([]);
    }

    // The detail belongs in the logs, not in a response a patient might see.
    console.error('List query failed:', error);
    return res.status(500).json({ error: 'Could not load that list. Please try again shortly.' });
  }

  res.set('X-Total-Count', String(count ?? data.length));
  res.json(data);
}

module.exports = { getPageRange, isRangeBeyondEnd, sendPage };
