import classNames from "classnames";
import Icon from "@/components/ui/Icons";
import { MASTER_DASHBOARD_KPIS } from "@/utils/constant";

export function MasterOverviewKpiGrid() {
  return (
    <section className="master-overview-kpi-grid mt-4">
      {MASTER_DASHBOARD_KPIS.map((kpi) => (
        <article key={kpi.id} className="master-kpi-card">
          <div className="flex items-center justify-between">
            <p className="master-kpi-label">{kpi.label}</p>
            <div
              className={classNames(
                "flex size-8 items-center justify-center rounded-[8px]",
                kpi.tint === "navy" ? "master-icon-tint-navy" : "master-icon-tint-orange",
              )}
            >
              <Icon
                name={kpi.icon}
                className={classNames(
                  "size-4",
                  kpi.tint === "navy" ? "master-kpi-icon-navy" : "master-kpi-icon-orange",
                )}
                aria-hidden
              />
            </div>
          </div>
          <p className="master-kpi-value">{kpi.value}</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="master-kpi-delta">{kpi.delta}</span>
            <span className="master-footnote text-[10px]">{kpi.footnote}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
