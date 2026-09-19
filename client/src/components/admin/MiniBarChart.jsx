// A dependency-free bar chart for a short daily-count series (a week's worth
// of enquiries) — plain flex/CSS bars rather than a charting library, same
// reasoning as MiniLineChart.
export default function MiniBarChart({ data }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex h-40 items-end gap-space-sm">
      {data.map((d) => {
        // A floor height so a zero day still renders as a visible sliver
        // instead of disappearing entirely.
        const pct = d.count === 0 ? 3 : Math.max(6, (d.count / max) * 100);
        return (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-space-3xs">
            <span className="text-label-sm font-semibold text-on-surface-variant">{d.count}</span>
            <div className="flex h-28 w-full items-end">
              <div
                className="w-full rounded-t-md bg-secondary transition-all"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-label-sm text-on-surface-variant">
              {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
