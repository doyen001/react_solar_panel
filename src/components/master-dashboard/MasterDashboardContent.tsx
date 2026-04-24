"use client";

import dynamic from "next/dynamic";
import { MasterInvoiceSummary } from "@/components/master-dashboard/MasterInvoiceSummary";
import { MasterKpiCard } from "@/components/master-dashboard/MasterKpiCard";
import { MasterRegionDistribution } from "@/components/master-dashboard/MasterRegionDistribution";
import { MasterSalesFunnel } from "@/components/master-dashboard/MasterSalesFunnel";
import { MasterSectionCard } from "@/components/master-dashboard/MasterSectionCard";
import { MasterTopInstallers } from "@/components/master-dashboard/MasterTopInstallers";
import {
  MASTER_DASHBOARD_KPIS,
  MASTER_REVENUE_TREND,
} from "@/utils/constant";

const MasterRevenueTrendChartClient = dynamic(
  () =>
    import("@/components/master-dashboard/charts/MasterRevenueTrendChartClient").then(
      (m) => m.MasterRevenueTrendChartClient,
    ),
  { ssr: false, loading: () => <div className="h-[219.99px] w-full" /> },
);

export function MasterDashboardContent() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {MASTER_DASHBOARD_KPIS.map((kpi) => (
          <MasterKpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-stretch">
        <MasterSectionCard
          className="min-w-0 flex-1"
          title={MASTER_REVENUE_TREND.title}
          bodyClassName="px-[15.99px] pb-[15.99px] pt-[15.99px]"
          headerRight={
            <p className="flex flex-wrap items-baseline justify-end gap-x-1 whitespace-nowrap">
              <span className="font-dm-sans text-[13px] font-bold leading-[19.5px] text-warm-ink">
                {MASTER_REVENUE_TREND.totalLabel}
              </span>
              <span
                className="font-dm-sans text-[11px] font-normal leading-[16.5px] text-warm-gray"
                style={{ fontVariationSettings: "'opsz' 9" }}
              >
                {MASTER_REVENUE_TREND.totalHint}
              </span>
            </p>
          }
        >
          <MasterRevenueTrendChartClient />
        </MasterSectionCard>

        <MasterSectionCard
          className="w-full shrink-0 xl:w-[459px] xl:self-stretch"
          title="Invoice Summary"
        >
          <MasterInvoiceSummary />
        </MasterSectionCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MasterSectionCard title="Top Installers" className="min-h-0">
          <MasterTopInstallers />
        </MasterSectionCard>
        <MasterSectionCard title="Aggregate Sales Funnel" className="min-h-0">
          <MasterSalesFunnel />
        </MasterSectionCard>
        <MasterSectionCard
          title="Installer Distribution by Region"
          className="min-h-0"
        >
          <MasterRegionDistribution />
        </MasterSectionCard>
      </div>
    </div>
  );
}
