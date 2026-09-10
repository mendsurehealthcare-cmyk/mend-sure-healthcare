import { useEffect, useState } from 'react';
import Icon from './Icon';

/*
  A grid that shows a fixed number of items at a time with Prev/Next paging,
  rather than everything at once or an endlessly scrolling row.

  Built for the Doctors listing's "More Specialists" section: a hundred-plus
  doctors on one page reads as a wall of cards, and a horizontal scroll row
  hides most of them off-screen with no sense of how many there are. Paging
  nine at a time keeps the grid's own 3-column layout (three rows of three)
  and gives a visible "page 2 of 9" instead.
*/
export default function PaginatedGrid({
  items,
  pageSize = 9,
  renderItem,
  gridClassName = 'grid grid-cols-1 gap-space-xl md:grid-cols-2 lg:grid-cols-3',
  pageLabel = (page, count) => `Page ${page} of ${count}`,
  prevLabel = 'Previous page',
  nextLabel = 'Next page',
}) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  // Guards against a stale page index after the underlying list shrinks —
  // without this, landing on what is now page 4 of 2 would render an empty
  // grid instead of snapping back to a real page.
  useEffect(() => {
    if (page > pageCount - 1) setPage(0);
  }, [pageCount, page]);

  const start = page * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  const arrowClasses =
    'flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary transition-colors hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-container disabled:hover:text-primary';

  return (
    <div>
      <div className={gridClassName}>{pageItems.map(renderItem)}</div>

      {pageCount > 1 && (
        <div className="mt-space-xl flex items-center justify-center gap-space-md">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label={prevLabel}
            className={arrowClasses}
          >
            <Icon name="chevron_left" className="!text-[22px]" />
          </button>

          <span className="min-w-[7rem] text-center text-label-md text-on-surface-variant">
            {pageLabel(page + 1, pageCount)}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page === pageCount - 1}
            aria-label={nextLabel}
            className={arrowClasses}
          >
            <Icon name="chevron_right" className="!text-[22px]" />
          </button>
        </div>
      )}
    </div>
  );
}
