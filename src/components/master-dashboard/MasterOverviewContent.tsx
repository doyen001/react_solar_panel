import { MasterOverviewHero } from "./MasterOverviewHero";
import { MasterOverviewInvoiceSummary } from "./MasterOverviewInvoiceSummary";
import { MasterOverviewKpiGrid } from "./MasterOverviewKpiGrid";
import { MasterOverviewRegionDistribution } from "./MasterOverviewRegionDistribution";
import { MasterOverviewRevenueChart } from "./MasterOverviewRevenueChart";
import { MasterOverviewSalesFunnel } from "./MasterOverviewSalesFunnel";
import { MasterOverviewTopInstallers } from "./MasterOverviewTopInstallers";

export function MasterOverviewContent() {
  return (
    <main className="master-overview-shell">
      <MasterOverviewHero />
      <MasterOverviewKpiGrid />

      <section className="master-overview-row">
        <MasterOverviewRevenueChart />
        <MasterOverviewInvoiceSummary />
      </section>

      <section className="master-overview-bottom-grid">
        <MasterOverviewTopInstallers />
        <MasterOverviewSalesFunnel />
        <MasterOverviewRegionDistribution />
      </section>
    </main>
  );
}
