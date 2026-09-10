const DEFAULT_PAGE_SIZE = 20;
// The doctor directory is a few hundred rows and the listing page filters it
// in the browser, so it asks for the whole set in one request. Raise this if
// any single directory outgrows it.
const MAX_PAGE_SIZE = 300;

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

  Takes either an unexecuted query or an already-awaited result, so a route
  that needed to inspect the outcome first (to retry differently, say) can hand
  the result straight over instead of running the query twice.
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

/*
  Runs a ranged query, and follows up with further ranged queries if the
  platform's own per-request row cap truncated the response short of what was
  actually asked for.

  Supabase projects carry a "Max Rows" setting (Dashboard -> Settings -> API)
  that limits how many rows a single PostgREST request returns, independent of
  the range the caller asked for — a request for rows 0-299 on a project
  capped at 100 gets rows 0-99 back, silently, with the `count` in the
  response still correctly reporting the true total. A caller that takes the
  data at face value drops however many rows sit past the cap; on this
  project's cap that meant 3 of 103 doctors missing from "the whole directory
  in one request" with nothing in the response marking it as partial.

  `makeQuery(rangeFrom, rangeTo)` must return an *unexecuted* Supabase query
  for that sub-range — a query object can only be awaited once, so a fresh one
  is built for each follow-up call.

  Costs nothing extra for the common case: a request that fits inside the
  platform's cap in one call (every list this app pages through 20 or so rows
  at a time, say) returns after that first call exactly as it always did.
*/
async function fetchFullRange(makeQuery, from, to) {
  let rows = [];
  let count = null;
  let cursor = from;

  while (cursor <= to) {
    const requested = to - cursor + 1;
    const { data, error, count: totalCount } = await makeQuery(cursor, to);
    if (error) return { data: null, error, count: null };

    count = totalCount ?? count;
    if (!data || data.length === 0) break;

    rows = rows.concat(data);
    cursor = from + rows.length;

    // Got everything asked for on this call: either the requested window is
    // now full (the loop condition ends it next) or nothing was left to cap.
    if (data.length >= requested) break;

    // Fewer rows came back than requested. Expected once the table's
    // matching rows genuinely run out — cursor has then reached `count`.
    // Anything short of that is the platform's cap, not the end of the data,
    // and cursor already picks up exactly where this call left off.
    if (count != null && cursor >= count) break;
  }

  return { data: rows, error: null, count };
}

module.exports = { getPageRange, isRangeBeyondEnd, sendPage, fetchFullRange };
