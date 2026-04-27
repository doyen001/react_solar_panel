import { MASTER_REVENUE_TREND } from "@/utils/constant";

function toPoints(values: readonly number[], width: number, height: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const xStep = width / (values.length - 1);
  const range = max - min || 1;

  return values.map((value, index) => {
    const x = index * xStep;
    const y = height - ((value - min) / range) * height;
    return { x, y, label: value };
  });
}

export function MasterOverviewRevenueChart() {
  const values = MASTER_REVENUE_TREND.valuesMillions;
  const width = 540;
  const height = 190;
  const points = toPoints(values, width, height);
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${polyline} ${width},${height} 0,${height}`;
  const lastPoint = points[points.length - 1];

  return (
    <article className="master-section-shell master-revenue-card flex-1">
      <div className="master-revenue-head">
        <div>
          <h3 className="master-section-title">{MASTER_REVENUE_TREND.title}</h3>
          <p className="master-footnote text-[11px]">{MASTER_REVENUE_TREND.totalHint}</p>
        </div>
        <p className="master-revenue-total">{MASTER_REVENUE_TREND.totalLabel}</p>
      </div>

      <div className="master-revenue-chart-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[210px] w-full"
          preserveAspectRatio="none"
          aria-label="Revenue trend chart"
        >
          <defs>
            <linearGradient id="masterRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className="master-revenue-fill-start" />
              <stop offset="100%" className="master-revenue-fill-end" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((line) => (
            <line
              key={line}
              x1={0}
              y1={(height / 3) * line}
              x2={width}
              y2={(height / 3) * line}
              className="master-revenue-grid"
            />
          ))}
          <polygon points={area} fill="url(#masterRevenueFill)" />
          <polyline points={polyline} className="master-revenue-line" />
          {points.map((point) => (
            <circle
              key={`${point.x}-${point.y}`}
              cx={point.x}
              cy={point.y}
              r={3}
              className="master-revenue-dot"
            />
          ))}
        </svg>

        <div className="master-revenue-axis">
          {MASTER_REVENUE_TREND.months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>

        <div
          className="master-revenue-tooltip"
          style={{
            left: `${(lastPoint.x / width) * 100}%`,
            top: `${(lastPoint.y / height) * 100}%`,
          }}
        >
          ${lastPoint.label.toFixed(1)}M
        </div>
      </div>
    </article>
  );
}
