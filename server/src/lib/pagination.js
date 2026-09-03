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

module.exports = { getPageRange };
