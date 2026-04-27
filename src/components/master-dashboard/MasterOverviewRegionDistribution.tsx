import { MASTER_OVERVIEW_SECTIONS, MASTER_REGION_SLICES } from "@/utils/constant";

export function MasterOverviewRegionDistribution() {
  return (
    <article className="master-section-shell">
      <div className="master-overview-card-head">
        <h3 className="master-section-title">
          {MASTER_OVERVIEW_SECTIONS.regionDistributionTitle}
        </h3>
      </div>

      <div className="px-4 pb-4">
        <div className="master-overview-region-bar">
          {MASTER_REGION_SLICES.map((slice) => (
            <span
              key={slice.id}
              className={`h-full ${slice.swatchClass}`}
              style={{ width: `${slice.percent}%` }}
            />
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {MASTER_REGION_SLICES.map((slice) => (
            <div key={slice.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`block size-2.5 rounded-full ${slice.swatchClass}`} />
                <p className="master-overview-metric-label">{slice.label}</p>
              </div>
              <p className="master-overview-metric-value">{slice.percent}%</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
