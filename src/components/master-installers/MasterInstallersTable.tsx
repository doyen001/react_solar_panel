import Icon from "@/components/ui/Icons";
import type { MasterInstallerEntry } from "@/utils/constant";

type Props = {
  rows: MasterInstallerEntry[];
};

function trendClass(delta: string) {
  return delta.startsWith("-")
    ? "master-ins-metric-delta master-ins-metric-delta-down"
    : "master-ins-metric-delta master-ins-metric-delta-up";
}

function statusClass(status: MasterInstallerEntry["status"]) {
  if (status === "pending") {
    return "master-ins-status-pill master-ins-status-pill-pending";
  }
  if (status === "suspended") {
    return "master-ins-status-pill master-ins-status-pill-suspended";
  }
  return "master-ins-status-pill master-ins-status-pill-active";
}

export function MasterInstallersTable({ rows }: Props) {
  return (
    <div className="master-ins-table-shell">
      {rows.map((row) => (
        <button key={row.id} type="button" className="master-ins-row">
          <span className="master-ins-row-arrow" aria-hidden>
            <Icon name="ChevronRight" className="size-4" />
          </span>

          <span className={`master-ins-avatar ${row.avatarClass}`} aria-hidden>
            {row.initials}
          </span>

          <span className="master-ins-company">
            <span className="master-ins-company-top">
              <span className="master-ins-company-name">{row.name}</span>
              <span className={statusClass(row.status)}>{row.status}</span>
              <span className="master-ins-rating">
                <Icon name="Star" className="size-3" />
                {row.rating}
              </span>
            </span>
            <span className="master-ins-company-location">
              <Icon name="LocationPin" className="size-3" />
              {row.location.city}, {row.location.state}
            </span>
          </span>

          <span className="master-ins-metrics">
            <span className="master-ins-metric">
              <span className="master-ins-metric-label">Customers</span>
              <span className="master-ins-metric-value">{row.customers}</span>
            </span>
            <span className="master-ins-metric">
              <span className="master-ins-metric-label">Pipeline</span>
              <span className="master-ins-metric-value">{row.pipeline}</span>
            </span>
            <span className="master-ins-metric">
              <span className="master-ins-metric-label">Installs MTD</span>
              <span className="master-ins-metric-value">{row.installsMtd}</span>
            </span>
            <span className="master-ins-metric">
              <span className="master-ins-metric-label">Conversion</span>
              <span className="master-ins-metric-row">
                <span className="master-ins-metric-value">{row.conversion}</span>
                <span className={trendClass(row.conversionDelta)}>
                  {row.conversionDelta}
                </span>
              </span>
            </span>
            <span className="master-ins-metric">
              <span className="master-ins-metric-label">Revenue</span>
              <span className="master-ins-metric-row">
                <span className="master-ins-metric-value">{row.revenue}</span>
                <span className={trendClass(row.revenueDelta)}>{row.revenueDelta}</span>
              </span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
