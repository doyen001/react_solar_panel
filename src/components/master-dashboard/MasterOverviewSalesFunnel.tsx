import { MASTER_FUNNEL_STAGES, MASTER_OVERVIEW_SECTIONS } from "@/utils/constant";

export function MasterOverviewSalesFunnel() {
  const max = Math.max(...MASTER_FUNNEL_STAGES.map((item) => item.value));

  return (
    <article className="master-section-shell">
      <div className="master-overview-card-head">
        <h3 className="master-section-title">{MASTER_OVERVIEW_SECTIONS.salesFunnelTitle}</h3>
      </div>

      <div className="space-y-2 px-4 pb-4">
        {MASTER_FUNNEL_STAGES.map((stage) => (
          <div key={stage.id} className="master-overview-funnel-row">
            <div className="flex items-center justify-between gap-3">
              <p className="master-overview-metric-label">{stage.label}</p>
              <p className="master-overview-metric-value">
                {stage.value.toLocaleString()}
              </p>
            </div>
            <div className="master-overview-progress-track">
              <span
                className={`block h-full rounded-full ${stage.barClass}`}
                style={{ width: `${(stage.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
