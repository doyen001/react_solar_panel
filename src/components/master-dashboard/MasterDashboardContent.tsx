"use client";

import { useEffect, useState } from "react";
import { MonthlyPerformanceSection } from "@/components/installer/pipeline-dashboard/MonthlyPerformanceSection";
import { PipelineDashboardTitleBar } from "@/components/installer/pipeline-dashboard/PipelineDashboardTitleBar";
import { PipelineKpiSparklineGrid } from "@/components/installer/pipeline-dashboard/PipelineKpiSparklineGrid";
import { PipelineOperationalHealth } from "@/components/installer/pipeline-dashboard/PipelineOperationalHealth";
import { PipelineOverviewBanner } from "@/components/installer/pipeline-dashboard/PipelineOverviewBanner";
import { PipelineRegionalAndLead } from "@/components/installer/pipeline-dashboard/PipelineRegionalAndLead";
import { PipelineSecondaryKpiRow } from "@/components/installer/pipeline-dashboard/PipelineSecondaryKpiRow";
import { PipelineStatStrip } from "@/components/installer/pipeline-dashboard/PipelineStatStrip";
import { PipelineStcAndFunnel } from "@/components/installer/pipeline-dashboard/PipelineStcAndFunnel";
import { PipelineTeamAndActivity } from "@/components/installer/pipeline-dashboard/PipelineTeamAndActivity";
import {
  fetchInstallerPipelineAnalytics,
  type InstallerPipelineAnalytics,
} from "@/lib/installers/analytics";

export function MasterDashboardContent() {
  const [data, setData] = useState<InstallerPipelineAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchInstallerPipelineAnalytics()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load dashboard");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 lg:py-8">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 font-inter text-sm text-red-700">
          {error}
        </div>
      ) : !data ? (
        <div className="h-[420px] animate-pulse rounded-lg bg-cream-150" />
      ) : (
        <>
          <PipelineDashboardTitleBar title={data.title} />

          <div className="mt-4 flex flex-col gap-2">
            <PipelineOverviewBanner kpis={data.overviewKpis} />
            <PipelineStatStrip items={data.statStrip} />
            <PipelineKpiSparklineGrid kpis={data.primaryKpis} />
            <PipelineSecondaryKpiRow kpis={data.secondaryKpis} />
            <MonthlyPerformanceSection data={data.monthlyPerformance} />
            <PipelineStcAndFunnel
              stcPipeline={data.stcPipeline}
              salesFunnelHeader={data.salesFunnelHeader}
              funnelStages={data.funnelStages}
            />
            <PipelineTeamAndActivity teamRows={data.teamRows} />
            <PipelineRegionalAndLead
              regionalRows={data.regionalRows}
              leadSources={data.leadSources}
              leadMixPcts={data.leadMixPcts}
              leadSourceSummary={data.leadSourceSummary}
            />
            <PipelineOperationalHealth
              operational={data.operational}
              businessHealth={data.businessHealth}
            />
          </div>
        </>
      )}
    </div>
  );
}
