/*
  One priced-procedure table, in the same visual language as
  CardiacSurgeryCostGuide's tables: a solid header bar, an optional intro
  paragraph, a zebra-striped table, and an optional footnote.

  Cells are pre-formatted strings (already carrying ₹/$ and, where the source
  gave a range, an en dash) rather than numbers passed through formatINR /
  formatUSD — most of this content is a min–max range copied from a source
  table, not a single figure those helpers can compute.
*/
export default function CostGuideTable({ title, subtitle, note, columns, rows }) {
  const lastColumn = columns.length - 1;

  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="bg-primary px-space-lg py-space-md">
        <h3 className="text-headline-sm font-bold text-on-primary">{title}</h3>
      </div>

      {subtitle && (
        <p className="border-b border-outline-variant/20 px-space-lg py-space-md text-body-md leading-relaxed text-on-surface-variant">
          {subtitle}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-body-md">
          <thead className="bg-surface-container-low text-label-sm tracking-wide text-on-surface-variant uppercase">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-space-lg py-space-sm">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {rows.map((row, index) => (
              <tr key={row[0]} className={index % 2 === 1 ? 'bg-surface-container-low/40' : ''}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={
                      cellIndex === 0
                        ? 'px-space-lg py-space-md font-medium text-on-surface'
                        : cellIndex === lastColumn
                          ? 'px-space-lg py-space-md font-semibold text-primary'
                          : 'px-space-lg py-space-md text-on-surface-variant'
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note && (
        <p className="border-t border-outline-variant/20 px-space-lg py-space-md text-body-sm text-on-surface-variant">
          {note}
        </p>
      )}
    </div>
  );
}
