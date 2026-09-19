// A dependency-free line chart for a small daily-count series. Renders as a
// single scalable SVG (preserveAspectRatio="none" so it fills whatever box
// it's given) rather than pulling in a charting library for one sparkline.
export default function MiniLineChart({ data, height = 160 }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(1, ...data.map((d) => d.count));
  const width = 100;
  const stepX = width / (data.length - 1 || 1);
  const topPad = 8;

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = topPad + (1 - d.count / max) * (height - topPad * 2);
    return { x, y, count: d.count };
  });

  const linePath = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath = `0,${height} ${linePath} ${width},${height}`;

  // A handful of evenly-spaced date labels rather than one per day, which
  // would overlap into an unreadable strip for a 30-day series.
  const labelCount = Math.min(data.length, 5);
  const labelIndexes = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i * (data.length - 1)) / (labelCount - 1 || 1))
  );

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-40 w-full text-secondary"
      >
        <polyline points={areaPath} fill="currentColor" fillOpacity="0.12" stroke="none" />
        <polyline
          points={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.6" vectorEffect="non-scaling-stroke" fill="currentColor" />
        ))}
      </svg>
      <div className="mt-space-2xs flex justify-between text-label-sm text-on-surface-variant">
        {labelIndexes.map((i) => (
          <span key={i}>
            {new Date(data[i].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        ))}
      </div>
    </div>
  );
}
