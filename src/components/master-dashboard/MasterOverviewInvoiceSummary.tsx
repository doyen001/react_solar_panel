import Icon from "@/components/ui/Icons";
import { MASTER_DASHBOARD_INVOICE_METRICS, MASTER_OVERVIEW_SECTIONS } from "@/utils/constant";

export function MasterOverviewInvoiceSummary() {
  return (
    <article className="master-section-shell master-overview-side">
      <div className="master-overview-card-head">
        <h3 className="master-section-title">{MASTER_OVERVIEW_SECTIONS.invoiceSummaryTitle}</h3>
      </div>

      <div className="space-y-3 px-4 pb-4">
        {MASTER_DASHBOARD_INVOICE_METRICS.map((item) => (
          <div key={item.id} className="master-overview-metric-row">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name={item.icon} className="size-3.5 text-warm-gray" />
                <p className="master-overview-metric-label">{item.label}</p>
              </div>
              <p className="master-overview-metric-value">{item.amount}</p>
            </div>
            <div className="master-overview-progress-track">
              <span
                className={`block h-full rounded-full ${item.progressClass}`}
                style={{ width: `${Math.max(item.progress * 100, 6)}%` }}
              />
            </div>
            <p className="master-footnote text-[10px]">{item.countLabel}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
